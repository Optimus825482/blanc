import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const cookieName = 'bb_admin';
const sessionSeconds = 8 * 60 * 60;

export function equalText(a, b) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

function sign(payload) {
  const key = process.env.SESSION_SECRET;
  if (!key || key.length < 32) throw new Error('SESSION_SECRET eksik veya çok kısa.');
  return createHmac('sha256', key).update(payload).digest('hex');
}

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value || '';
  const [expires, nonce, signature, extra] = value.split('.');
  if (extra !== undefined || !/^\d{10}$/.test(expires) || !/^[a-f0-9]{32}$/.test(nonce || '') || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  return Number(expires) > Math.floor(Date.now() / 1000) && equalText(signature, sign(expires + '.' + nonce));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin');
}

export async function createSession() {
  const payload = Math.floor(Date.now() / 1000 + sessionSeconds) + '.' + randomBytes(16).toString('hex');
  (await cookies()).set(cookieName, payload + '.' + sign(payload), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/admin', maxAge: sessionSeconds,
  });
}

export async function clearSession() {
  (await cookies()).set(cookieName, '', { path: '/admin', maxAge: 0, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
}
