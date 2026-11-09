import { getQuote, sorguIzinli } from '../../../../../lib/teklif';

export const dynamic = 'force-dynamic';

const iki = (n) => String(n).padStart(2, '0');
const gunKodu = (d) => d.getFullYear() + iki(d.getMonth() + 1) + iki(d.getDate());

// Teslim takvimi (tüm gün etkinliği): kod + 128 bitlik anahtar (?t=) zorunlu. Alıcı ve firma adı dosyaya girmez.
export async function GET(request, { params }) {
  const { kod } = await params;
  const t = new URL(request.url).searchParams.get('t') || '';
  const istemci = (request.headers.get('x-forwarded-for') || '').split(',').pop().trim() || request.headers.get('x-real-ip') || '';
  if (!sorguIzinli('takip|' + istemci)) return new Response('Çok sık istek', { status: 429 });

  const q = await getQuote(kod.toUpperCase(), t);
  if (!q || !q.delivery_date) return new Response(null, { status: 404 });

  // pg DATE sütunu yerel gece yarısı olarak gelir; yerel tarih bileşenleri kullanılır.
  const gun = q.delivery_date instanceof Date ? q.delivery_date : new Date(q.delivery_date + 'T00:00:00');
  const ertesi = new Date(gun.getFullYear(), gun.getMonth(), gun.getDate() + 1);
  const damga = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const satirlar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Beyza Blanc//Teklif takibi//TR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + q.code + '@beyzablanc',
    'DTSTAMP:' + damga,
    'DTSTART;VALUE=DATE:' + gunKodu(gun),
    'DTEND;VALUE=DATE:' + gunKodu(ertesi),
    'SUMMARY:Beyza Blanc teslim · ' + q.code,
    'DESCRIPTION:Teslim günü. Takip kodu ' + q.code + '.',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Yarın Beyza Blanc teslimi',
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(satirlar.join('\r\n') + '\r\n', { headers: {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Content-Disposition': 'attachment; filename="' + q.code + '.ics"',
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex',
  } });
}
