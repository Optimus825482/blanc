'use server';

import { randomUUID } from 'node:crypto';
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import sharp from 'sharp';
import { query } from '../../../lib/db';
import { quoteNotificationEmail, sendMail } from '../../../lib/mail';
import { getSettings } from '../../../lib/settings';
import { ADET_KADEMELERI, BUTCELER, kodUret, sorguIzinli, takipYolu, tokenUret } from '../../../lib/teklif';

// Kurumsal teklif formu (plan 3.1). Kayıt bb_quotes'a kind='corporate' olarak düşer; firma bilgileri
// company sütununda, logo bb_media'da. Başarıda müşteri takip sayfasına yönlenir (kanal düğmeleri orada).
const slugOk = (v) => typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v) && v.length <= 72;
const metin = (data, ad, max) => { const v = data.get(ad); return typeof v === 'string' ? v.trim().slice(0, max) : ''; };
const hata = (kod) => redirect('/kurumsal?hata=' + kod + '#kurumsal-teklif');

async function logoIsle(file) {
  if (!file || typeof file !== 'object' || !file.size) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error('logo');
  try {
    const img = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 24000000 });
    if (!['jpeg', 'png', 'webp'].includes((await img.metadata()).format)) throw new Error('logo');
    const { data, info } = await img.rotate().resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 }).toBuffer({ resolveWithObject: true });
    return { id: randomUUID(), data, width: info.width, height: info.height };
  } catch { throw new Error('logo'); }
}

export async function kurumsalTeklif(data) {
  if (metin(data, 'web_sitesi', 200)) redirect('/kurumsal'); // bal küpü: botlar doldurur, insanlar görmez

  const basliklar = await headers();
  const istemci = (basliklar.get('x-forwarded-for') || '').split(',').pop().trim() || basliklar.get('x-real-ip') || '';
  if (!sorguIzinli('kurumsal|' + istemci, 5, 15 * 60000)) hata('sik');

  const firma = metin(data, 'firma', 120);
  const yetkili = metin(data, 'yetkili', 120);
  const eposta = metin(data, 'eposta', 160);
  const telefon = metin(data, 'telefon', 40);
  const kademe = ADET_KADEMELERI.find(([k]) => k === data.get('kademe'));
  const butce = BUTCELER.find(([k]) => k === data.get('butce'));
  const teslim = /^\d{4}-\d{2}-\d{2}$/.test(metin(data, 'teslim', 10)) ? metin(data, 'teslim', 10) : null;
  const urun = slugOk(data.get('urun')) ? data.get('urun') : '';
  const vesile = slugOk(data.get('vesile')) ? data.get('vesile') : '';
  const numune = data.get('numune') === 'on';
  const not = metin(data, 'not', 2000);
  if (!firma || !yetkili || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta) || !kademe || !butce) hata('alan');
  if (data.get('izin') !== 'on') hata('izin');

  let logo = null;
  try { logo = await logoIsle(data.get('logo')); } catch { hata('logo'); }

  const [urunSatir, vesileSatir] = await Promise.all([
    urun ? query('SELECT title FROM bb_product_types WHERE slug=$1 AND published', [urun]) : { rows: [] },
    vesile ? query("SELECT title FROM bb_occasions WHERE slug=$1 AND published AND root='kurumsal'", [vesile]) : { rows: [] },
  ]);
  const company = { firma, yetkili, eposta, telefon, kademe: kademe[1], butce: butce[1], numune, not };
  const ozet = [
    'Kurumsal teklif talebi',
    'Firma: ' + firma,
    'Yetkili: ' + yetkili + (telefon ? ' · ' + telefon : '') + ' · ' + eposta,
    vesileSatir.rows[0] ? 'Vesile: ' + vesileSatir.rows[0].title : '',
    urunSatir.rows[0] ? 'Ürün: ' + urunSatir.rows[0].title : 'Ürün: atölye önerisi',
    'Adet: ' + kademe[1],
    'Kişi başı bütçe: ' + butce[1],
    teslim ? 'Hedef teslim: ' + teslim : '',
    numune ? 'Numune isteniyor' : '',
    logo ? 'Logo eklendi' : '',
    not ? 'Not: ' + not : '',
  ].filter(Boolean).join('\n');

  const clientHash = createHash('sha256').update(istemci).digest('hex').slice(0, 32);
  if (logo) await query('INSERT INTO bb_media(id,bytes,width,height) VALUES ($1,$2,$3,$4)', [logo.id, logo.data, logo.width, logo.height]);
  const token = tokenUret();
  let code = null;
  for (let deneme = 0; deneme < 5 && !code; deneme++) {
    const r = await query(`
      INSERT INTO bb_quotes(code, token, kind, occasion_slug, product_type_slug, quantity, selections, summary, delivery_date,
        recipient_name, logo_id, company, client_hash)
      VALUES ($1,$2,'corporate',$3,$4,$5,'{}'::jsonb,$6,$7,$8,$9,$10::jsonb,$11) ON CONFLICT (code) DO NOTHING RETURNING code`,
      [kodUret(), token, vesileSatir.rows[0] ? vesile : '', urunSatir.rows[0] ? urun : '', kademe[2], ozet, teslim, firma,
        logo?.id ?? null, JSON.stringify(company), clientHash]);
    if (r.rowCount) code = r.rows[0].code;
  }
  if (!code) hata('kayit');
  const settings = await getSettings();
  const bildirimAdres = settings.notification_email || settings.contact_email;
  if (bildirimAdres) {
    const origin = process.env.SITE_URL?.trim() || 'https://beyzablanc.com';
    const mailVerisi = quoteNotificationEmail({
      code,
      kind: 'corporate',
      productTitle: urunSatir.rows[0]?.title || 'Kurumsal Hediye',
      quantity: kademe[2],
      estimate: null,
      recipientName: firma,
      customerEmail: company.eposta,
      customerPhone: company.telefon,
      summary: ozet,
      trackingUrl: origin + takipYolu(code, token),
      adminUrl: origin + '/admin?bolum=talepler',
      company,
    });
    await sendMail({ to: bildirimAdres, replyTo: company.eposta || undefined, ...mailVerisi }).catch(() => {});
  }
  redirect(takipYolu(code, token) + '&yeni=1');
}
