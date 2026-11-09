import { createHash } from 'node:crypto';
import { query } from '../../../lib/db';
import { sorguIzinli } from '../../../lib/teklif';

// Çerezsiz ziyaret ölçümü: vitrin her sayfa geçişinde buraya küçük bir beacon yollar.
// Ziyaretçi kimliği = sha256(gün + adres + tarayıcı); gün değişince kimlik değişir, kalıcı iz yok.
const istemci = (request) => ((request.headers.get('x-forwarded-for') || '').split(',').pop() || request.headers.get('x-real-ip') || '').trim();

export async function POST(request) {
  const ip = istemci(request);
  if (!sorguIzinli('ziyaret|' + ip, 120, 60000)) return new Response(null, { status: 429 });
  let veri;
  try { veri = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const yol = typeof veri?.yol === 'string' && /^\/[^\s?#]{0,200}$/.test(veri.yol) ? veri.yol : null;
  if (!yol || yol.startsWith('/admin') || yol.startsWith('/api')) return new Response(null, { status: 204 });
  let kaynak = '';
  try {
    const u = new URL(veri.kaynak || '', 'https://x.invalid');
    const kendi = (request.headers.get('host') || '').split(':')[0].replace(/^www\./, '');
    const host = u.hostname.replace(/^www\./, '');
    if (u.hostname !== 'x.invalid' && host !== kendi) kaynak = host.slice(0, 120); // site içi geçişler kaynak sayılmaz
  } catch { kaynak = ''; }
  const cihaz = veri.cihaz === 'mobil' ? 'mobil' : 'masaustu';
  const gun = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Nicosia' });
  const ziyaretci = createHash('sha256').update(gun + '|' + ip + '|' + (request.headers.get('user-agent') || '')).digest('hex').slice(0, 24);
  await query('INSERT INTO bb_visits(path, referrer_host, device, visitor_hash) VALUES ($1,$2,$3,$4)', [yol, kaynak, cihaz, ziyaretci]);
  return new Response(null, { status: 204 });
}
