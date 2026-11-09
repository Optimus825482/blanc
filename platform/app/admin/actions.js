'use server';

import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { clearSession, createSession, equalText, requireAdmin } from '../../lib/auth';
import { query } from '../../lib/db';
import { clearInstagramCache, encryptToken, verifyInstagram } from '../../lib/instagram';

class InvalidInput extends Error {}

function field(data, name, max) {
  const value = data.get(name);
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new InvalidInput();
  return value.trim();
}

async function processImage(file) {
  if (!file || !file.size) return null;
  if (file.size > 5 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new InvalidInput();
  try {
    const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 24000000 });
    if (!['jpeg', 'png', 'webp'].includes((await image.metadata()).format)) throw new InvalidInput();
    const { data, info } = await image.rotate().resize(1440, 1440, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 86 }).toBuffer({ resolveWithObject: true });
    return { id: randomUUID(), data, width: info.width, height: info.height };
  } catch {
    throw new InvalidInput();
  }
}

export async function login(data) {
  const password = data.get('password');
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof password !== 'string' || password.length > 128 || !expected || expected.length < 16) redirect('/admin?durum=giris');
  await query("DELETE FROM bb_login_limits WHERE bucket < now() - interval '1 day'");
  const { rows: [limit] } = await query(`
    INSERT INTO bb_login_limits(bucket, attempts)
    VALUES (date_bin(interval '15 minutes', now(), timestamptz '2000-01-01'), 1)
    ON CONFLICT(bucket) DO UPDATE SET attempts=LEAST(bb_login_limits.attempts+1,13)
    RETURNING attempts
  `);
  if (limit.attempts > 12) redirect('/admin?durum=limit');
  if (!equalText(password, expected)) redirect('/admin?durum=giris');
  await createSession();
  redirect('/admin');
}

export async function logout() {
  await requireAdmin();
  await clearSession();
  redirect('/admin');
}

export async function save(data) {
  await requireAdmin();
  try {
    const kind = field(data, 'kind', 12);
    const key = field(data, 'key', 72);
    const title = field(data, 'title', 120);
    const body = field(data, 'body', 4000);
    const alt = field(data, 'alt', 180);
    if (kind === 'content' ? !['home','about','corporate'].includes(key) : kind !== 'category' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) throw new InvalidInput();
    const position = Number(data.get('position') || '0');
    if (!Number.isInteger(position) || position < 0 || position > 10000) throw new InvalidInput();
    const image = await processImage(data.get('image'));
    const category = kind === 'category';
    const imagePath = image ? '/media/' + image.id : null;
    const isNew = category && data.get('new') === '1';
    if (isNew && !image) throw new InvalidInput();
    const mutation = category
      ? isNew
        ? 'INSERT INTO bb_categories(slug,title,body,alt,image,position,published) VALUES ($5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING'
        : 'UPDATE bb_categories SET title=$6,body=$7,alt=$8,image=COALESCE($9,image),position=$10,published=$11,updated_at=now() WHERE slug=$5'
      : 'UPDATE bb_content SET title=$6,body=$7,alt=$8,image=COALESCE($9,image),updated_at=now() WHERE key=$5';
    const values = [image?.id ?? null, image?.data ?? null, image?.width ?? null, image?.height ?? null, key, title, body, alt, imagePath];
    if (category) values.push(position, data.get('published') === 'on');
    const result = await query(`WITH changed AS (${mutation} RETURNING 1), upload AS (
      INSERT INTO bb_media (id,bytes,width,height)
      SELECT $1::uuid,$2::bytea,$3::integer,$4::integer FROM changed WHERE $1::uuid IS NOT NULL
    )
    SELECT 1 FROM changed`, values);
    if (!result.rowCount) throw new InvalidInput();
  } catch (error) {
    if (!(error instanceof InvalidInput)) throw error;
    redirect('/admin?durum=gecersiz');
  }
  revalidatePath('/', 'layout');
  redirect('/admin?durum=kaydedildi');
}


export async function connectInstagram(data) {
  await requireAdmin();
  const token = data.get('token');
  if (typeof token !== 'string' || token.length < 20 || token.length > 2048 || !/^[A-Za-z0-9_\-.]+$/.test(token)) redirect('/admin?durum=meta-hata');
  let account;
  try {
    account = await verifyInstagram(token);
  } catch {
    redirect('/admin?durum=meta-hata');
  }
  await query(
    `INSERT INTO bb_instagram(singleton,account_id,username,token_cipher) VALUES (true,$1,$2,$3)
    ON CONFLICT(singleton) DO UPDATE SET account_id=$1,username=$2,token_cipher=$3,updated_at=now()`,
    [account.id, account.username, encryptToken(token)]
  );
  clearInstagramCache();
  revalidatePath('/');
  redirect('/admin?durum=meta-bagli');
}

export async function disconnectInstagram() {
  await requireAdmin();
  await query('DELETE FROM bb_instagram WHERE singleton=true');
  clearInstagramCache();
  revalidatePath('/');
  redirect('/admin?durum=meta-kaldirildi');
}

const settingLimits = {
  contact_phone: 32, contact_whatsapp: 32, contact_email: 120, address_street: 160, address_locality: 60,
  address_region: 60, address_country: 60, maps_url: 400, hours_text: 600, hours_schema: 300,
};

export async function saveSettings(data) {
  await requireAdmin();
  const rows = [];
  for (const [key, max] of Object.entries(settingLimits)) {
    const value = data.get(key);
    if (typeof value !== 'string' || value.length > max) redirect('/admin?durum=gecersiz');
    const trimmed = value.trim();
    if (key === 'maps_url' && trimmed && !/^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)\//.test(trimmed)) redirect('/admin?durum=gecersiz');
    if (key === 'contact_email' && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) redirect('/admin?durum=gecersiz');
    if ((key === 'contact_phone' || key === 'contact_whatsapp') && trimmed && !/^\+?[\d\s()-]{10,20}$/.test(trimmed)) redirect('/admin?durum=gecersiz');
    rows.push([key, trimmed]);
  }
  await query(
    'INSERT INTO bb_settings(key,value) SELECT * FROM unnest($1::text[], $2::text[]) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()',
    [rows.map(row => row[0]), rows.map(row => row[1])]
  );
  revalidatePath('/', 'layout');
  redirect('/admin?durum=kaydedildi');
}
