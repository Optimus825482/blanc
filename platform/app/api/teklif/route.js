import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { query } from '../../../lib/db';
import { quoteNotificationEmail, sendMail } from '../../../lib/mail';
import { getSettings, whatsappLink } from '../../../lib/settings';
import { kodDeseni, kodUret, sorguIzinli, takipYolu, tokenDeseni, tokenUret } from '../../../lib/teklif';

// Stüdyo onayı sonrası teklif kaydı (plan 2.5). multipart: veri (JSON), gorsel (PNG/WebP/JPEG).
// Oturum yok; kayıt anonimdir, takip kodu müşteriye döner. Basit oran sınırı: aynı istemci 15 dakikada en çok 8 kayıt.
const slug = (v, max = 72) => (typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(v) && v.length <= max ? v : '');
const metin = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const json = (o, init) => Response.json(o, init);
// İstemci kimliği: ters vekil arkasında vekilin eklediği (en sağdaki) adres; başlık yoksa boş. Sunucu kurulumunda
// Nginx X-Forwarded-For'u yeniden yazmalı; yerelde tek istemci olduğundan sınır herkes için ortaktır.
const istemci = (request) => {
  const xff = request.headers.get('x-forwarded-for') || '';
  return (xff.split(',').pop() || request.headers.get('x-real-ip') || '').trim();
};

export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return json({ hata: 'Geçersiz istek.' }, { status: 400 }); }
  let veri;
  try { veri = JSON.parse(String(form.get('veri') || '')); } catch { return json({ hata: 'Geçersiz veri.' }, { status: 400 }); }
  if (!veri || typeof veri !== 'object') return json({ hata: 'Geçersiz veri.' }, { status: 400 });

  const clientHash = createHash('sha256').update(istemci(request)).digest('hex').slice(0, 32);
  const { rows: [{ n }] } = await query("SELECT count(*)::int AS n FROM bb_quotes WHERE client_hash=$1 AND created_at > now() - interval '15 minutes'", [clientHash]);
  if (n >= 8) return json({ hata: 'Çok sık kayıt oluşturuldu. Lütfen birkaç dakika sonra tekrar deneyin.' }, { status: 429 });

  const adet = Number.parseInt(veri.adet, 10);
  const quantity = Number.isInteger(adet) && adet >= 1 && adet <= 100000 ? adet : 1;
  const estimate = Number.isFinite(Number(veri.tahmin)) && Number(veri.tahmin) > 0 ? Number(veri.tahmin).toFixed(2) : null;
  const teslimTarihi = /^\d{4}-\d{2}-\d{2}$/.test(veri.teslimTarihi || '') ? veri.teslimTarihi : null;
  const secimler = veri.secimler && typeof veri.secimler === 'object' && !Array.isArray(veri.secimler) ? veri.secimler : {};
  const secimMetin = JSON.stringify(secimler);
  if (secimMetin.length > 8000) return json({ hata: 'Seçimler çok uzun.' }, { status: 400 });

  // Görsel: canvas PNG'si Beyza Blanc filigranıyla WebP'ye çevrilip bb_media'ya yazılır (1000 px, kalite 84).
  let gorsel = null;
  const dosya = form.get('gorsel');
  if (dosya && typeof dosya === 'object' && dosya.size) {
    if (dosya.size > 6 * 1024 * 1024) return json({ hata: 'Görsel çok büyük.' }, { status: 413 });
    try {
      const img = sharp(Buffer.from(await dosya.arrayBuffer()), { limitInputPixels: 24000000 });
      const boyutlu = await img.resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
      const w = boyutlu.info.width || 1000;
      const h = boyutlu.info.height || 1000;
      const cx = Math.round(w / 2);
      const cy = Math.round(h / 2);
      const filigranSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <g transform="translate(${cx} ${cy}) rotate(-26)" text-anchor="middle" font-family="Georgia, serif" font-weight="600" letter-spacing="6">
          <text x="0" y="0" font-size="${Math.max(26, Math.round(w * 0.045))}" fill="rgba(45,24,18,0.16)" stroke="rgba(255,250,244,0.22)" stroke-width="1.5">BEYZA BLANC · TASARIM ÖNİZLEMESİ</text>
        </g>
        <g transform="translate(${w - 22} ${h - 20})" text-anchor="end" font-family="Georgia, serif" font-weight="600" letter-spacing="3">
          <text x="0" y="0" font-size="${Math.max(15, Math.round(w * 0.022))}" fill="rgba(45,24,18,0.42)" stroke="rgba(255,250,244,0.55)" stroke-width="2" paint-order="stroke">BEYZA BLANC</text>
        </g>
      </svg>`;
      const { data, info } = await sharp(boyutlu.data)
        .composite([{ input: Buffer.from(filigranSvg), top: 0, left: 0 }])
        .webp({ quality: 84 })
        .toBuffer({ resolveWithObject: true });
      gorsel = { id: randomUUID(), data, width: info.width, height: info.height };
    } catch { gorsel = null; }
  }

  const designSlug = slug(veri.tasarim) || null;
  const designOk = designSlug ? (await query('SELECT 1 FROM bb_designs WHERE slug=$1', [designSlug])).rowCount : 0;
  // Kurumsal: özel gün kökü kurumsal ise, müşteri işaretlediyse ya da adet 50 ve üzeriyse.
  const kok = slug(veri.tema) ? (await query('SELECT root FROM bb_occasions WHERE slug=$1', [slug(veri.tema)])).rows[0]?.root : '';
  const kind = kok === 'kurumsal' || veri.kurumsal === true || quantity >= 50 ? 'corporate' : 'personal';

  const musteriEposta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(metin(veri.musteriEposta, 120)) ? metin(veri.musteriEposta, 120) : '';
  const musteriTelefon = metin(veri.musteriTelefon, 32);
  const companyObj = (musteriEposta || musteriTelefon) ? { eposta: musteriEposta, telefon: musteriTelefon } : {};

  if (gorsel) await query('INSERT INTO bb_media(id,bytes,width,height) VALUES ($1,$2,$3,$4)', [gorsel.id, gorsel.data, gorsel.width, gorsel.height]);
  const token = tokenUret();
  let code = null;
  for (let deneme = 0; deneme < 5 && !code; deneme++) {
    const aday = kodUret();
    const r = await query(`
      INSERT INTO bb_quotes(code, token, kind, design_slug, occasion_slug, product_type_slug, size, quantity, selections, summary, estimate,
        delivery_method, delivery_date, recipient_name, company, image_id, client_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15::jsonb,$16,$17) ON CONFLICT (code) DO NOTHING RETURNING code`,
      [aday, token, kind, designOk ? designSlug : null, slug(veri.tema), slug(veri.urun), metin(veri.boyut, 40), quantity, secimMetin,
        metin(veri.ozet, 6000), estimate, slug(veri.teslimSekli), teslimTarihi, metin(veri.aliciAdi, 120), JSON.stringify(companyObj), gorsel?.id ?? null, clientHash]);
    if (r.rowCount) code = r.rows[0].code;
  }
  if (!code) return json({ hata: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.' }, { status: 500 });

  const settings = await getSettings();
  const origin = process.env.SITE_URL?.trim() || new URL(request.url).origin;
  const takip = origin + takipYolu(code, token);
  const bildirimAdres = settings.notification_email || settings.contact_email;
  if (bildirimAdres) {
    const mailVerisi = quoteNotificationEmail({
      code,
      kind,
      productTitle: slug(veri.urun),
      quantity,
      estimate,
      recipientName: metin(veri.aliciAdi, 120),
      customerEmail: musteriEposta,
      customerPhone: musteriTelefon,
      summary: metin(veri.ozet, 6000),
      trackingUrl: takip,
      adminUrl: origin + '/admin?bolum=talepler',
      company: companyObj,
    });
    await sendMail({ to: bildirimAdres, replyTo: musteriEposta || undefined, ...mailVerisi }).catch(() => {});
  }
  const mesaj = 'Merhaba Beyza Blanc, ' + code + ' kodlu tasarımım için fiyat teklifi istiyorum.\n' + takip + '\n\n' + metin(veri.ozet, 3000);
  return json({
    kod: code,
    anahtar: token,
    takip,
    mesaj,
    whatsapp: whatsappLink(settings, mesaj),
    instagram: 'https://ig.me/m/beyzablanc',
    gorsel: gorsel ? '/media/' + gorsel.id : null,
  });
}

// Kanal tercihi veya müşteri ek notu / revize talebi: kod + anahtar birlikte gerekir.
export async function PATCH(request) {
  if (!sorguIzinli('patch|' + istemci(request))) return json({ hata: 'Çok sık istek.' }, { status: 429 });
  let veri;
  try { veri = await request.json(); } catch { return json({ hata: 'Geçersiz istek.' }, { status: 400 }); }
  if (!kodDeseni.test(veri?.kod || '') || !tokenDeseni.test(veri?.anahtar || '')) return json({ hata: 'Geçersiz veri.' }, { status: 400 });

  if (typeof veri.ekNot === 'string') {
    const temizNot = veri.ekNot.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 500);
    if (temizNot.length < 3) return json({ hata: 'Lütfen en az 3 karakterlik bir not yazın.' }, { status: 400 });
    const zaman = new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
    const satir = `\n\n[Müşteri ek notu · ${zaman}]: ${temizNot}`;
    const { rows } = await query('UPDATE bb_quotes SET summary = summary || $3, updated_at = now() WHERE code = $1 AND token = $2 RETURNING code', [veri.kod, veri.anahtar, satir]);
    if (!rows.length) return json({ hata: 'Teklif kaydı bulunamadı.' }, { status: 404 });
    return json({ tamam: true, ekSatir: satir.trim() });
  }

  const kanal = ['whatsapp', 'instagram', 'share', 'download'].includes(veri?.kanal) ? veri.kanal : null;
  if (!kanal) return json({ hata: 'Geçersiz veri.' }, { status: 400 });
  await query("UPDATE bb_quotes SET contact_channel=$2, updated_at=now() WHERE code=$1 AND token=$3 AND contact_channel=''", [veri.kod, kanal, veri.anahtar]);
  return json({ tamam: true });
}
