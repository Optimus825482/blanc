import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { query } from '../../../lib/db';
import { getSettings, whatsappLink } from '../../../lib/settings';
import { kodUret } from '../../../lib/teklif';

// Stüdyo onayı sonrası teklif kaydı (plan 2.5). multipart: veri (JSON), gorsel (PNG/WebP/JPEG).
// Oturum yok; kayıt anonimdir, takip kodu müşteriye döner. Basit oran sınırı: aynı istemci 15 dakikada en çok 8 kayıt.
const slug = (v, max = 72) => (typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/i.test(v) && v.length <= max ? v : '');
const metin = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const json = (o) => Response.json(o);

export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return json({ hata: 'Geçersiz istek.' }, { status: 400 }); }
  let veri;
  try { veri = JSON.parse(String(form.get('veri') || '')); } catch { return json({ hata: 'Geçersiz veri.' }, { status: 400 }); }
  if (!veri || typeof veri !== 'object') return json({ hata: 'Geçersiz veri.' }, { status: 400 });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || '';
  const clientHash = createHash('sha256').update(ip + '|' + (request.headers.get('user-agent') || '')).digest('hex').slice(0, 32);
  const { rows: [{ n }] } = await query("SELECT count(*)::int AS n FROM bb_quotes WHERE client_hash=$1 AND created_at > now() - interval '15 minutes'", [clientHash]);
  if (n >= 8) return json({ hata: 'Çok sık kayıt oluşturuldu. Lütfen birkaç dakika sonra tekrar deneyin.' }, { status: 429 });

  const adet = Number.parseInt(veri.adet, 10);
  const quantity = Number.isInteger(adet) && adet >= 1 && adet <= 100000 ? adet : 1;
  const estimate = Number.isFinite(Number(veri.tahmin)) && Number(veri.tahmin) > 0 ? Number(veri.tahmin).toFixed(2) : null;
  const teslimTarihi = /^\d{4}-\d{2}-\d{2}$/.test(veri.teslimTarihi || '') ? veri.teslimTarihi : null;
  const secimler = veri.secimler && typeof veri.secimler === 'object' && !Array.isArray(veri.secimler) ? veri.secimler : {};
  const secimMetin = JSON.stringify(secimler);
  if (secimMetin.length > 8000) return json({ hata: 'Seçimler çok uzun.' }, { status: 400 });

  // Görsel: canvas PNG'si WebP'ye çevrilip bb_media'ya yazılır (1000 px, kalite 84).
  let gorsel = null;
  const dosya = form.get('gorsel');
  if (dosya && typeof dosya === 'object' && dosya.size) {
    if (dosya.size > 6 * 1024 * 1024) return json({ hata: 'Görsel çok büyük.' }, { status: 413 });
    try {
      const img = sharp(Buffer.from(await dosya.arrayBuffer()), { limitInputPixels: 24000000 });
      const { data, info } = await img.resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 84 }).toBuffer({ resolveWithObject: true });
      gorsel = { id: randomUUID(), data, width: info.width, height: info.height };
    } catch { gorsel = null; }
  }

  const designSlug = slug(veri.tasarim) || null;
  const designOk = designSlug ? (await query('SELECT 1 FROM bb_designs WHERE slug=$1', [designSlug])).rowCount : 0;
  // Kurumsal: özel gün kökü kurumsal ise, müşteri işaretlediyse ya da adet 50 ve üzeriyse.
  const kok = slug(veri.tema) ? (await query('SELECT root FROM bb_occasions WHERE slug=$1', [slug(veri.tema)])).rows[0]?.root : '';
  const kind = kok === 'kurumsal' || veri.kurumsal === true || quantity >= 50 ? 'corporate' : 'personal';

  if (gorsel) await query('INSERT INTO bb_media(id,bytes,width,height) VALUES ($1,$2,$3,$4)', [gorsel.id, gorsel.data, gorsel.width, gorsel.height]);
  let code = null;
  for (let deneme = 0; deneme < 5 && !code; deneme++) {
    const aday = kodUret();
    const r = await query(`
      INSERT INTO bb_quotes(code, kind, design_slug, occasion_slug, product_type_slug, size, quantity, selections, summary, estimate,
        delivery_method, delivery_date, recipient_name, image_id, client_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT (code) DO NOTHING RETURNING code`,
      [aday, kind, designOk ? designSlug : null, slug(veri.tema), slug(veri.urun), metin(veri.boyut, 40), quantity, secimMetin,
        metin(veri.ozet, 6000), estimate, slug(veri.teslimSekli), teslimTarihi, metin(veri.aliciAdi, 120), gorsel?.id ?? null, clientHash]);
    if (r.rowCount) code = r.rows[0].code;
  }
  if (!code) return json({ hata: 'Kayıt oluşturulamadı. Lütfen tekrar deneyin.' }, { status: 500 });

  const settings = await getSettings();
  const origin = process.env.SITE_URL?.trim() || new URL(request.url).origin;
  const takip = origin + '/teklif/' + code;
  const mesaj = 'Merhaba Beyza Blanc, ' + code + ' kodlu tasarımım için fiyat teklifi istiyorum.\n' + takip + '\n\n' + metin(veri.ozet, 3000);
  return json({
    kod: code,
    takip,
    mesaj,
    whatsapp: whatsappLink(settings, mesaj),
    instagram: 'https://ig.me/m/beyzablanc',
    gorsel: gorsel ? '/media/' + gorsel.id : null,
  });
}

// Kanal tercihi: müşteri hangi düğmeye bastıysa kayda işlenir (yalnızca boşsa).
export async function PATCH(request) {
  let veri;
  try { veri = await request.json(); } catch { return json({ hata: 'Geçersiz istek.' }, { status: 400 }); }
  const kanal = ['whatsapp', 'instagram', 'share', 'download'].includes(veri?.kanal) ? veri.kanal : null;
  if (!kanal || !/^BB-[A-Z0-9]{4}-[A-Z0-9]{2}$/.test(veri.kod || '')) return json({ hata: 'Geçersiz veri.' }, { status: 400 });
  await query("UPDATE bb_quotes SET contact_channel=$2, updated_at=now() WHERE code=$1 AND contact_channel=''", [veri.kod, kanal]);
  return json({ tamam: true });
}
