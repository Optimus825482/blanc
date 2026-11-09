'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from '../../../lib/db';
import { sorguIzinli } from '../../../lib/teklif';

// Müşteri yorumu (plan 3.2). Kayıt onaysız (approved = false) düşer; panelde onaylanınca yayınlanır.
const metin = (data, ad, max) => { const v = data.get(ad); return typeof v === 'string' ? v.trim().slice(0, max) : ''; };
const hata = (kod) => redirect('/yorum?durum=' + kod);

export async function yorumGonder(data) {
  if (metin(data, 'web_sitesi', 200)) redirect('/yorum?durum=tesekkur'); // bal küpü: botlar doldurur, insanlar görmez

  const basliklar = await headers();
  const istemci = (basliklar.get('x-forwarded-for') || '').split(',').pop().trim() || basliklar.get('x-real-ip') || '';
  if (!sorguIzinli('yorum|' + istemci, 3, 15 * 60000)) hata('sik');

  const ad = metin(data, 'ad', 60);
  const yorum = metin(data, 'yorum', 600);
  const puan = Number(data.get('puan'));
  if (ad.length < 2 || yorum.length < 10 || !Number.isInteger(puan) || puan < 1 || puan > 5) hata('alan');

  // Özel gün yalnızca yayındaki bir kayda bağlanır; bilinmeyen değer boş kalır.
  const ozelGun = metin(data, 'ozel_gun', 80);
  const { rows } = ozelGun ? await query('SELECT slug FROM bb_occasions WHERE slug=$1 AND published', [ozelGun]) : { rows: [] };

  await query('INSERT INTO bb_reviews (name, text, rating, occasion_slug) VALUES ($1, $2, $3, $4)', [ad, yorum, puan, rows[0]?.slug || '']);
  redirect('/yorum?durum=tesekkur');
}
