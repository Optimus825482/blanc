import 'server-only';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from './db';

// Yönetim oturumu (plan 3.5): çerezde rastgele 256 bitlik belirteç; sunucuda yalnızca özeti (SHA-256) tutulur.
// Oturum kaydı parola parmak izini taşır: ADMIN_PASSWORD veya SESSION_SECRET değişince tüm oturumlar düşer.
const cookieName = 'bb_admin';
const sessionSeconds = 8 * 60 * 60;
const tokenDeseni = /^[a-f0-9]{64}$/;

const ozet = (deger) => createHash('sha256').update(deger).digest('hex');

export function equalText(a, b) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

function parmakIzi() {
  return ozet('bb-iz|' + (process.env.ADMIN_PASSWORD || '') + '|' + (process.env.SESSION_SECRET || '')).slice(0, 32);
}

function cerezAyar(maxAge) {
  return { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/admin', maxAge };
}

export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value || '';
  if (!tokenDeseni.test(token)) return false;
  const { rows } = await query(
    'SELECT 1 FROM bb_sessions WHERE token_hash=$1 AND fingerprint=$2 AND expires_at > now()',
    [ozet(token), parmakIzi()],
  );
  return rows.length > 0;
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin');
}

export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await query('DELETE FROM bb_sessions WHERE expires_at < now()');
  await query(
    "INSERT INTO bb_sessions (token_hash, fingerprint, expires_at) VALUES ($1, $2, now() + interval '8 hours')",
    [ozet(token), parmakIzi()],
  );
  (await cookies()).set(cookieName, token, cerezAyar(sessionSeconds));
}

export async function clearSession() {
  const token = (await cookies()).get(cookieName)?.value || '';
  if (tokenDeseni.test(token)) await query('DELETE FROM bb_sessions WHERE token_hash=$1', [ozet(token)]);
  (await cookies()).set(cookieName, '', cerezAyar(0));
}

// Tüm oturumları kapatır (bu tarayıcıdaki dahil).
export async function clearAllSessions() {
  await query('DELETE FROM bb_sessions');
  (await cookies()).set(cookieName, '', cerezAyar(0));
}
