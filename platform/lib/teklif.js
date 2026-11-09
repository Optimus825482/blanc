import 'server-only';
import { randomBytes, randomInt } from 'node:crypto';
import { cache } from 'react';
import { query } from './db';

// Teklif talepleri (plan 2.5 / 2.6). Kod: BB-XXXX-YY; karışabilen harfler (I, O, 0, 1) kullanılmaz.
const HARFLER = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const parca = (n) => Array.from({ length: n }, () => HARFLER[randomInt(HARFLER.length)]).join('');
export const kodUret = () => 'BB-' + parca(4) + '-' + parca(2);
export const kodDeseni = /^BB-[A-Z0-9]{4}-[A-Z0-9]{2}$/;
// Takip anahtarı: 128 bit; kod yalnızca okunur referanstır, sayfa ve kanal işareti anahtarsız açılmaz.
export const tokenUret = () => randomBytes(16).toString('hex');
export const tokenDeseni = /^[0-9a-f]{32}$/;
export const takipYolu = (code, token) => '/teklif/' + code + '?t=' + token;

// Takip sayfası / PATCH için basit süreç içi hız sınırı: istemci başına dakikada en çok 30 sorgu.
const sayaclar = globalThis.beyzaTeklifSayac ?? new Map();
globalThis.beyzaTeklifSayac = sayaclar;
export function sorguIzinli(anahtar, sinir = 30, pencereMs = 60000) {
  const simdi = Date.now();
  if (sayaclar.size > 5000) for (const [k, v] of sayaclar) if (v.bitis < simdi) sayaclar.delete(k);
  const kayit = sayaclar.get(anahtar);
  if (!kayit || kayit.bitis < simdi) { sayaclar.set(anahtar, { sayi: 1, bitis: simdi + pencereMs }); return true; }
  kayit.sayi += 1;
  return kayit.sayi <= sinir;
}

export const DURUMLAR = [
  ['new', 'Yeni talep', 'Talebiniz alındı; atölye en kısa sürede dönüş yapar.'],
  ['contacted', 'Görüşülüyor', 'Atölye sizinle iletişime geçti; detaylar netleşiyor.'],
  ['quoted', 'Teklif iletildi', 'Fiyat ve teslim günü size iletildi; onayınız bekleniyor.'],
  ['confirmed', 'Üretimde', 'Tasarımınız onaylandı ve hazırlanıyor.'],
  ['done', 'Teslim edildi', 'Siparişiniz tamamlandı. Teşekkür ederiz.'],
  ['cancelled', 'İptal edildi', 'Bu talep kapatıldı. Yeni bir tasarım için stüdyoya dönebilirsiniz.'],
];
export const durumAdi = (durum) => DURUMLAR.find(([d]) => d === durum)?.[1] ?? durum;

export const getQuote = cache(async (code, token) => {
  if (!kodDeseni.test(code) || !tokenDeseni.test(token || '')) return undefined;
  const { rows } = await query(`
    SELECT q.*, o.title AS occasion_title, o.icon AS occasion_icon, p.title AS product_title, d.title AS design_title
    FROM bb_quotes q
    LEFT JOIN bb_occasions o ON o.slug = q.occasion_slug
    LEFT JOIN bb_product_types p ON p.slug = q.product_type_slug
    LEFT JOIN bb_designs d ON d.slug = q.design_slug
    WHERE q.code = $1 AND q.token = $2`, [code, token]);
  return rows[0];
});

export const getQuotes = cache(async (limit = 200) => (await query(`
  SELECT q.id, q.code, q.token, q.kind, q.status, q.quantity, q.size, q.estimate, q.recipient_name, q.delivery_method, q.delivery_date,
         q.contact_channel, q.image_id, q.admin_note, q.created_at, q.updated_at, q.summary,
         o.short_title AS occasion_title, p.title AS product_title
  FROM bb_quotes q
  LEFT JOIN bb_occasions o ON o.slug = q.occasion_slug
  LEFT JOIN bb_product_types p ON p.slug = q.product_type_slug
  ORDER BY (q.status = 'new') DESC, q.created_at DESC LIMIT $1`, [limit])).rows);

export const tarihYaz = (d) => d ? new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
