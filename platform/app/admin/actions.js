'use server';

import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { clearSession, createSession, equalText, requireAdmin } from '../../lib/auth';
import { query } from '../../lib/db';
import { clearInstagramCache, encryptToken, verifyInstagram } from '../../lib/instagram';
import { katalog, slugDeseni } from '../../lib/katalog';
import { panelBolumu } from './bolumler';

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
    redirect('/admin?bolum=icerik&durum=gecersiz');
  }
  revalidatePath('/', 'layout');
  redirect('/admin?bolum=icerik&durum=kaydedildi');
}


export async function connectInstagram(data) {
  await requireAdmin();
  const token = data.get('token');
  if (typeof token !== 'string' || token.length < 20 || token.length > 2048 || !/^[A-Za-z0-9_\-.]+$/.test(token)) redirect('/admin?bolum=instagram&durum=meta-hata');
  let account;
  try {
    account = await verifyInstagram(token);
  } catch {
    redirect('/admin?bolum=instagram&durum=meta-hata');
  }
  await query(
    `INSERT INTO bb_instagram(singleton,account_id,username,token_cipher) VALUES (true,$1,$2,$3)
    ON CONFLICT(singleton) DO UPDATE SET account_id=$1,username=$2,token_cipher=$3,updated_at=now()`,
    [account.id, account.username, encryptToken(token)]
  );
  clearInstagramCache();
  revalidatePath('/');
  redirect('/admin?bolum=instagram&durum=meta-bagli');
}

export async function disconnectInstagram() {
  await requireAdmin();
  await query('DELETE FROM bb_instagram WHERE singleton=true');
  clearInstagramCache();
  revalidatePath('/');
  redirect('/admin?bolum=instagram&durum=meta-kaldirildi');
}

const settingLimits = {
  contact_phone: 32, contact_whatsapp: 32, contact_email: 120, address_street: 160, address_locality: 60,
  address_region: 60, address_country: 60, maps_url: 400, hours_text: 600, hours_schema: 300,
  announcement_text: 200, announcement_link: 400, announcement_link_text: 60, announcement_until: 10,
  last_order_note: 240, delivery_bands: 600, studio_corporate_qty_note: 240,
};

export async function saveSettings(data) {
  await requireAdmin();
  const rows = [];
  for (const [key, max] of Object.entries(settingLimits)) {
    if (!data.has(key)) continue; // ayarlar birkaç forma bölündü; yalnızca gönderilenler güncellenir
    const value = data.get(key);
    if (typeof value !== 'string' || value.length > max) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    const trimmed = value.trim();
    if (key === 'maps_url' && trimmed && !/^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps)\//.test(trimmed)) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    if (key === 'contact_email' && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    if (key === 'announcement_link' && trimmed && !/^(\/[^\s]*|https:\/\/[^\s]+)$/.test(trimmed)) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    if (key === 'announcement_until' && trimmed && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    if ((key === 'contact_phone' || key === 'contact_whatsapp') && trimmed && !/^\+?[\d\s()-]{10,20}$/.test(trimmed)) redirect('/admin?bolum=ayarlar&durum=gecersiz');
    rows.push([key, trimmed]);
  }
  await query(
    'INSERT INTO bb_settings(key,value) SELECT * FROM unnest($1::text[], $2::text[]) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()',
    [rows.map(row => row[0]), rows.map(row => row[1])]
  );
  revalidatePath('/', 'layout');
  redirect('/admin?bolum=ayarlar&durum=kaydedildi');
}

/* ---------------------------------- Katalog (plan 1.3) --------------------------------- */
function katalogDeger(alan, data) {
  const ham = data.get(alan.input || alan.name);
  const metin = typeof ham === 'string' ? ham.trim() : '';
  switch (alan.type) {
    case 'check': return ham === 'on';
    case 'number': {
      if (!metin && alan.nullable) return null;
      const n = Number(metin || '0');
      if (!Number.isInteger(n) || n < (alan.min ?? 0) || n > 10000) throw new InvalidInput();
      return n;
    }
    case 'decimal': {
      if (!metin) { if (alan.nullable) return null; throw new InvalidInput(); }
      const n = Number(metin.replace(',', '.'));
      if (!Number.isFinite(n) || n < 0 || n > 1e6) throw new InvalidInput();
      return n.toFixed(2);
    }
    case 'color':
      if (metin && !/^#[0-9A-Fa-f]{6}$/.test(metin)) throw new InvalidInput();
      return metin;
    case 'tags':
      if (metin.length > (alan.max || 300)) throw new InvalidInput();
      return metin.split(',').map((p) => p.trim()).filter(Boolean).slice(0, 30);
    case 'json': {
      if (!metin) return '{}';
      if (metin.length > 2000) throw new InvalidInput();
      try {
        const nesne = JSON.parse(metin);
        if (!nesne || typeof nesne !== 'object' || Array.isArray(nesne)) throw new InvalidInput();
        return JSON.stringify(nesne);
      } catch { throw new InvalidInput(); }
    }
    case 'select':
      if (!metin) { if (alan.nullable) return null; if (alan.required) throw new InvalidInput(); return ''; }
      if (Array.isArray(alan.options)) { if (!alan.options.some(([v]) => v === metin)) throw new InvalidInput(); return metin; }
      if (!slugDeseni.test(metin) || metin.length > 72) throw new InvalidInput();
      return metin;
    default:
      if (alan.required && !metin) throw new InvalidInput();
      if (metin.length > (alan.max || 4000)) throw new InvalidInput();
      return metin;
  }
}

// Satırın anahtarı: slug; stüdyo seçeneklerinde (grup, slug) çifti.
function katalogAnahtar(tanim, data, yeni = false) {
  if (tanim.numericKey) {
    if (yeni) return { key: null, where: [], values: [] };
    const id = Number(field(data, 'key', 12));
    if (!Number.isInteger(id) || id < 1) throw new InvalidInput();
    return { key: id, where: ['id'], values: [id] };
  }
  const key = field(data, 'key', 72);
  if (!slugDeseni.test(key)) throw new InvalidInput();
  if (!tanim.group) return { key, where: ['slug'], values: [key] };
  const grup = field(data, tanim.group.name, 30);
  if (!tanim.group.options.some(([g]) => g === grup)) throw new InvalidInput();
  return { key, where: ['slug', tanim.group.name], values: [key, grup] };
}

const kosul = (where, offset) => where.map((w, i) => `${w}=$${offset + i + 1}`).join(' AND ');
const veritabaniHatasi = (error) => ['23503', '22P02', '23514', '23505'].includes(error?.code);

export async function saveCatalog(data) {
  await requireAdmin();
  let kind;
  try {
    kind = field(data, 'kind', 20);
    const tanim = katalog[kind];
    if (!tanim) throw new InvalidInput();
    const yeni = data.get('new') === '1';
    const anahtar = katalogAnahtar(tanim, data, yeni);
    const sutunlar = [];
    const degerler = [];
    let gorsel = null;
    for (const alan of tanim.fields) {
      if (alan.type === 'image') {
        gorsel = await processImage(data.get('image'));
        if (gorsel) { sutunlar.push('image'); degerler.push('/media/' + gorsel.id); }
        continue;
      }
      sutunlar.push(alan.name);
      degerler.push(katalogDeger(alan, data));
    }
    const n = degerler.length;
    let sql;
    if (yeni) {
      const tum = [...sutunlar, ...anahtar.where];
      sql = `INSERT INTO ${tanim.table}(${tum.join(',')}) VALUES (${tum.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT DO NOTHING`;
    } else {
      const set = sutunlar.map((s, i) => `${s}=$${i + 1}`);
      if (tanim.table !== 'bb_segments') set.push('updated_at=now()');
      sql = `UPDATE ${tanim.table} SET ${set.join(',')} WHERE ${kosul(anahtar.where, n)}`;
    }
    const sonuc = await query(sql, [...degerler, ...anahtar.values]);
    if (!sonuc.rowCount) throw new InvalidInput();
    if (gorsel) await query('INSERT INTO bb_media(id,bytes,width,height) VALUES ($1,$2,$3,$4)', [gorsel.id, gorsel.data, gorsel.width, gorsel.height]);
    for (const iliski of tanim.relations || []) {
      const secili = data.getAll(iliski.name).filter((s) => typeof s === 'string' && slugDeseni.test(s)).slice(0, 50);
      await query(`DELETE FROM ${iliski.table} WHERE design_slug=$1`, [anahtar.key]);
      if (secili.length) {
        await query(`INSERT INTO ${iliski.table}(design_slug,${iliski.column}) SELECT $1, unnest($2::text[]) ON CONFLICT DO NOTHING`, [anahtar.key, secili]);
      }
    }
  } catch (error) {
    if (!(error instanceof InvalidInput) && !veritabaniHatasi(error)) throw error;
    redirect('/admin?bolum=' + (panelBolumu[kind] || 'katalog') + '&durum=gecersiz#' + (kind || ''));
  }
  revalidatePath('/', 'layout');
  redirect('/admin?bolum=' + (panelBolumu[kind] || 'katalog') + '&durum=kaydedildi#' + kind);
}

export async function deleteCatalog(data) {
  await requireAdmin();
  let kind;
  try {
    kind = field(data, 'kind', 20);
    const tanim = katalog[kind];
    if (!tanim) throw new InvalidInput();
    const anahtar = katalogAnahtar(tanim, data);
    const sonuc = await query(`DELETE FROM ${tanim.table} WHERE ${kosul(anahtar.where, 0)}`, anahtar.values);
    if (!sonuc.rowCount) throw new InvalidInput();
  } catch (error) {
    if (error?.code === '23503') redirect('/admin?bolum=' + (panelBolumu[kind] || 'katalog') + '&durum=bagli#' + kind);
    if (!(error instanceof InvalidInput)) throw error;
    redirect('/admin?bolum=' + (panelBolumu[kind] || 'katalog') + '&durum=gecersiz#' + (kind || ''));
  }
  revalidatePath('/', 'layout');
  redirect('/admin?bolum=' + (panelBolumu[kind] || 'katalog') + '&durum=silindi#' + kind);
}

/* ---------------------------------- Teklifler (plan 2.5) -------------------------------- */
export async function saveQuote(data) {
  await requireAdmin();
  const id = Number(data.get('id'));
  const status = data.get('status');
  const note = data.get('admin_note');
  const durumlar = ['new', 'contacted', 'quoted', 'confirmed', 'done', 'cancelled'];
  if (!Number.isInteger(id) || id < 1 || !durumlar.includes(status) || typeof note !== 'string' || note.length > 2000) redirect('/admin?bolum=talepler&durum=gecersiz');
  await query('UPDATE bb_quotes SET status=$2, admin_note=$3, updated_at=now() WHERE id=$1', [id, status, note.trim()]);
  redirect('/admin?bolum=talepler&durum=kaydedildi');
}
