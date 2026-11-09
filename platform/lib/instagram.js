import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { query } from './db';

const graph = 'https://graph.instagram.com/v24.0';
let cached = null;

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET eksik.');
  return createHash('sha256').update('instagram-token:' + secret).digest();
}

export function encryptToken(token) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map(part => part.toString('base64url')).join('.');
}

function decryptToken(value) {
  const [iv, tag, ciphertext] = value.split('.').map(part => Buffer.from(part, 'base64url'));
  const decipher = createDecipheriv('aes-256-gcm', key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

async function request(path, token) {
  const response = await fetch(graph + path, {
    headers: { Authorization: 'Bearer ' + token },
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error('Instagram isteği başarısız.');
  return response.json();
}

export async function verifyInstagram(token) {
  const account = await request('/me?fields=id,username', token);
  if (!/^\d+$/.test(String(account.id)) || account.username?.toLowerCase() !== 'beyzablanc') {
    throw new Error('Instagram hesabı doğrulanamadı.');
  }
  return account;
}

export function clearInstagramCache() {
  cached = null;
}

function validImage(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && /(^|\.)(cdninstagram\.com|fbcdn\.net)$/.test(parsed.hostname);
  } catch {
    return false;
  }
}

function normalize(items, stories = false) {
  return (Array.isArray(items) ? items : []).slice(0, 8).flatMap(item => {
    const image = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    if (!/^\d+$/.test(String(item.id)) || !validImage(image)) return [];
    let link = stories ? 'https://www.instagram.com/stories/beyzablanc/' + item.id + '/' : item.permalink;
    try {
      const parsed = new URL(link);
      if (parsed.protocol !== 'https:' || !['www.instagram.com', 'instagram.com'].includes(parsed.hostname)) return [];
      link = parsed.href;
    } catch { return []; }
    return [{ id: item.id, image, link, caption: typeof item.caption === 'string' ? item.caption.slice(0, 160) : '' }];
  });
}

export async function getInstagram() {
  if (cached && cached.until > Date.now()) return cached.data;
  const { rows: [settings] } = await query('SELECT account_id, username, token_cipher FROM bb_instagram WHERE singleton=true');
  if (!settings) return null;
  try {
    const token = decryptToken(settings.token_cipher);
    const [mediaResult, storiesResult] = await Promise.allSettled([
      request('/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=8', token),
      request('/me/stories?fields=id,media_type,media_url,thumbnail_url,timestamp&limit=8', token),
    ]);
    const result = {
      posts: mediaResult.status === 'fulfilled' ? normalize(mediaResult.value.data) : [],
      stories: storiesResult.status === 'fulfilled' ? normalize(storiesResult.value.data, true) : [],
      postsAvailable: mediaResult.status === 'fulfilled',
      storiesAvailable: storiesResult.status === 'fulfilled',
    };
    cached = { data: result, until: Date.now() + 5 * 60 * 1000 };
    return result;
  } catch {
    return { posts: [], stories: [], postsAvailable: false, storiesAvailable: false };
  }
}
