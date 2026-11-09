// Tasarım stüdyosu altlık sahnelerini üretir (SVG → WebP, 1000×1000).
// Gerçek ürün fotoğrafları gelene kadar kullanılır; aynı geometriyle (altliklar.json)
// panelden yüklenecek fotoğraflar bu dosyaların yerini alır.
// Kullanım: node tools/altlik-uret.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const S = 1000;
const out = new URL('../public/assets/img/studyo/', import.meta.url);

const defs = `
<defs>
  <radialGradient id="zemin" cx="38%" cy="32%" r="85%">
    <stop offset="0" stop-color="#fbf6ee"/><stop offset="0.6" stop-color="#efe6d7"/><stop offset="1" stop-color="#d6c9b4"/>
  </radialGradient>
  <filter id="keten" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.09"/></feComponentTransfer>
  </filter>
  <filter id="yumusak" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="26"/></filter>
  <filter id="yumusak-kucuk" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="folyo" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="4" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="16" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <linearGradient id="kutu-dis" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f3ede2"/><stop offset="1" stop-color="#d9d0c1"/>
  </linearGradient>
  <linearGradient id="kutu-taban" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ddd4c5"/><stop offset="1" stop-color="#cfc5b4"/>
  </linearGradient>
  <linearGradient id="ic-golge-ust" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a1a10" stop-opacity="0.28"/><stop offset="1" stop-color="#2a1a10" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="ic-golge-sol" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2a1a10" stop-opacity="0.22"/><stop offset="1" stop-color="#2a1a10" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="gumus" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6f3ee"/><stop offset="0.45" stop-color="#d9d4cb"/><stop offset="0.6" stop-color="#f1ede6"/><stop offset="1" stop-color="#c9c3b8"/>
  </linearGradient>
  <linearGradient id="altin" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f0e2b6"/><stop offset="0.35" stop-color="#b8923f"/><stop offset="0.55" stop-color="#e9d49b"/><stop offset="1" stop-color="#9a7a33"/>
  </linearGradient>
  <linearGradient id="ayna" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#faf7f1"/><stop offset="0.5" stop-color="#e8e2d8"/><stop offset="1" stop-color="#cfc8bc"/>
  </linearGradient>
</defs>`;

const zemin = `<rect width="${S}" height="${S}" fill="url(#zemin)"/><rect width="${S}" height="${S}" filter="url(#keten)"/>`;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${defs}${zemin}${body}</svg>`;

// Kutu: üstten, kapağı alınmış, duvarları görünen açık kutu. Renk nötr; stüdyo ambalaj rengini multiply ile bindirir.
const kutu = {
  dis: { x: 90, y: 150, g: 820, h: 700, r: 26 },
  ic: { x: 124, y: 184, g: 752, h: 632, r: 16 },
};
const kutuSvg = svg(`
  <rect x="${kutu.dis.x + 22}" y="${kutu.dis.y + 34}" width="${kutu.dis.g}" height="${kutu.dis.h}" rx="34" fill="#2b1d14" opacity="0.42" filter="url(#yumusak)"/>
  <rect x="${kutu.dis.x}" y="${kutu.dis.y}" width="${kutu.dis.g}" height="${kutu.dis.h}" rx="${kutu.dis.r}" fill="url(#kutu-dis)"/>
  <rect x="${kutu.dis.x + 1.5}" y="${kutu.dis.y + 1.5}" width="${kutu.dis.g - 3}" height="${kutu.dis.h - 3}" rx="${kutu.dis.r}" fill="none" stroke="#ffffff" stroke-opacity="0.65" stroke-width="2"/>
  <rect x="${kutu.ic.x}" y="${kutu.ic.y}" width="${kutu.ic.g}" height="${kutu.ic.h}" rx="${kutu.ic.r}" fill="url(#kutu-taban)"/>
  <rect x="${kutu.ic.x}" y="${kutu.ic.y}" width="${kutu.ic.g}" height="70" rx="${kutu.ic.r}" fill="url(#ic-golge-ust)"/>
  <rect x="${kutu.ic.x}" y="${kutu.ic.y}" width="60" height="${kutu.ic.h}" rx="${kutu.ic.r}" fill="url(#ic-golge-sol)"/>
  <rect x="${kutu.ic.x}" y="${kutu.ic.y}" width="${kutu.ic.g}" height="${kutu.ic.h}" rx="${kutu.ic.r}" fill="none" stroke="#1f140c" stroke-opacity="0.35" stroke-width="2"/>
  <path d="M${kutu.ic.x + 10} ${kutu.ic.y + kutu.ic.h} H${kutu.ic.x + kutu.ic.g - 10}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>
  <path d="M${kutu.ic.x + kutu.ic.g} ${kutu.ic.y + 10} V${kutu.ic.y + kutu.ic.h - 10}" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3"/>
`);

// Bar: açılmış folyo ambalaj ve altında yumuşak gölge; barın kendisi stüdyoda çizilir.
const bar = { x: 190, y: 330, g: 620, h: 300, r: 18, folyo: { x: 140, y: 282, g: 720, h: 396 } };
const barSvg = svg(`
  <rect x="${bar.folyo.x + 16}" y="${bar.folyo.y + 26}" width="${bar.folyo.g}" height="${bar.folyo.h}" rx="16" fill="#2b1d14" opacity="0.32" filter="url(#yumusak)"/>
  <rect x="${bar.folyo.x}" y="${bar.folyo.y}" width="${bar.folyo.g}" height="${bar.folyo.h}" rx="12" fill="url(#gumus)"/>
  <rect x="${bar.folyo.x}" y="${bar.folyo.y}" width="${bar.folyo.g}" height="${bar.folyo.h}" rx="12" filter="url(#keten)" opacity="0.9"/>
  <g stroke-linecap="round" fill="none">
    <path d="M${bar.folyo.x + 40} ${bar.folyo.y + 300} L${bar.folyo.x + 260} ${bar.folyo.y + 40}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="3"/>
    <path d="M${bar.folyo.x + 70} ${bar.folyo.y + 380} L${bar.folyo.x + 420} ${bar.folyo.y + 20}" stroke="#6b645a" stroke-opacity="0.18" stroke-width="2"/>
    <path d="M${bar.folyo.x + 380} ${bar.folyo.y + 390} L${bar.folyo.x + 700} ${bar.folyo.y + 60}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3"/>
    <path d="M${bar.folyo.x + 520} ${bar.folyo.y + 395} L${bar.folyo.x + 715} ${bar.folyo.y + 200}" stroke="#6b645a" stroke-opacity="0.16" stroke-width="2"/>
    <path d="M${bar.folyo.x + 10} ${bar.folyo.y + 120} L${bar.folyo.x + 150} ${bar.folyo.y + 10}" stroke="#6b645a" stroke-opacity="0.14" stroke-width="2"/>
  </g>
  <rect x="${bar.x + 10}" y="${bar.y + 18}" width="${bar.g}" height="${bar.h}" rx="${bar.r}" fill="#1a110a" opacity="0.34" filter="url(#yumusak-kucuk)"/>
`);

// Tepsi: altın kenarlı aynalı oval tepsi; çikolata dizilimi ve plaka stüdyoda çizilir.
const tepsi = { cx: 500, cy: 470, rx: 400, ry: 300, kenar: 26 };
const tepsiSvg = svg(`
  <ellipse cx="${tepsi.cx + 18}" cy="${tepsi.cy + 36}" rx="${tepsi.rx}" ry="${tepsi.ry}" fill="#2b1d14" opacity="0.4" filter="url(#yumusak)"/>
  <ellipse cx="${tepsi.cx}" cy="${tepsi.cy}" rx="${tepsi.rx}" ry="${tepsi.ry}" fill="url(#altin)"/>
  <ellipse cx="${tepsi.cx}" cy="${tepsi.cy}" rx="${tepsi.rx - 2}" ry="${tepsi.ry - 2}" fill="none" stroke="#fff5d6" stroke-opacity="0.7" stroke-width="2"/>
  <ellipse cx="${tepsi.cx}" cy="${tepsi.cy}" rx="${tepsi.rx - tepsi.kenar}" ry="${tepsi.ry - tepsi.kenar}" fill="url(#ayna)"/>
  <ellipse cx="${tepsi.cx}" cy="${tepsi.cy}" rx="${tepsi.rx - tepsi.kenar}" ry="${tepsi.ry - tepsi.kenar}" fill="none" stroke="#3a2a12" stroke-opacity="0.35" stroke-width="3"/>
  <ellipse cx="${tepsi.cx - 150}" cy="${tepsi.cy - 120}" rx="260" ry="70" fill="#ffffff" opacity="0.35" transform="rotate(-18 ${tepsi.cx - 150} ${tepsi.cy - 120})" filter="url(#yumusak)"/>
`);

await mkdir(out, { recursive: true });
for (const [name, body] of [['kutu', kutuSvg], ['bar', barSvg], ['tepsi', tepsiSvg]]) {
  await sharp(Buffer.from(body), { density: 96 }).webp({ quality: 88 }).toFile(new URL(`altlik-${name}.webp`, out).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  console.log('üretildi:', `altlik-${name}.webp`);
}
const geometri = {
  kutu: { gorsel: '/assets/img/studyo/altlik-kutu.webp', dis: kutu.dis, ic: kutu.ic },
  bar: { gorsel: '/assets/img/studyo/altlik-bar.webp', bar: { x: bar.x, y: bar.y, g: bar.g, h: bar.h, r: bar.r } },
  tepsi: { gorsel: '/assets/img/studyo/altlik-tepsi.webp', oval: { cx: tepsi.cx, cy: tepsi.cy, rx: tepsi.rx - tepsi.kenar, ry: tepsi.ry - tepsi.kenar } },
};
await writeFile(new URL('altliklar.json', out), JSON.stringify(geometri, null, 2) + '\n');
console.log('üretildi: altliklar.json');
