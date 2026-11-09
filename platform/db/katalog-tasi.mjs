// Plan 1.2 — Katalog verisini public/assets/js/data.js'den bb_* tablolarına taşır.
// Tekrar çalıştırılabilir: var olan satırlara dokunmaz (ON CONFLICT DO NOTHING); panelden
// yapılan düzenlemeler korunur. seed.mjs bu modülü aynı işlem (transaction) içinde çağırır.
import { readFile } from 'node:fs/promises';

const KOK = new URL('../public/assets/js/', import.meta.url);

async function veriYukle() {
  const kaynak = await readFile(new URL('data.js', KOK), 'utf8');
  const pencere = {};
  new Function('window', kaynak)(pencere);
  return pencere.BEYZA_DATA;
}

async function altliklar() {
  try {
    return JSON.parse(await readFile(new URL('../public/assets/img/studyo/altliklar.json', import.meta.url), 'utf8'));
  } catch {
    return {};
  }
}

const yol = (p) => (p ? (p.startsWith('/') ? p : '/' + p) : '');

// bb_categories (eski vitrin kategorileri) → özel gün eşlemesi; görsel ve metin buradan alınır.
const kategoriEs = { 'bebek-hediyelikleri': 'hos-geldin-bebek', 'kisiye-ozel': 'her-zaman' };

export async function katalogTasi(client) {
  const d = await veriYukle();
  const altlik = await altliklar();
  const gercek = altlik.gercek || {};
  const sayac = {};
  const ekle = async (tablo, sutunlar, satir) => {
    const yer = sutunlar.map((_, i) => '$' + (i + 1)).join(',');
    const r = await client.query(`INSERT INTO ${tablo}(${sutunlar.join(',')}) VALUES (${yer}) ON CONFLICT DO NOTHING`, satir);
    sayac[tablo] = (sayac[tablo] || 0) + r.rowCount;
  };

  const kategoriler = (await client.query('SELECT slug,body,image,alt FROM bb_categories')).rows;
  const kategori = (slug) => kategoriler.find((k) => (kategoriEs[k.slug] || k.slug) === slug);

  for (const [i, t] of d.temalar.entries()) {
    const k = kategori(t.id);
    const g = gercek[t.id] || {};
    await ekle('bb_occasions', ['slug', 'title', 'short_title', 'body', 'icon', 'root', 'accent', 'suggested', 'image', 'alt', 'position', 'published'], [
      t.id, t.ad, t.kisa, t.aciklama, t.ikon, t.kok, t.vurgu || '', JSON.stringify(t.oneri || {}),
      k?.image || g.kutu || '', k?.alt || (k || g.kutu ? t.ad + ' için Beyza Blanc çalışması' : ''), i * 10, true,
    ]);
  }
  for (const [i, k] of d.kime.entries()) {
    await ekle('bb_recipients', ['slug', 'title', 'short_title', 'body', 'position', 'published'], [k.id, k.ad, k.kisa, k.aciklama, i * 10, true]);
  }
  for (const [i, s] of d.segmentler.entries()) {
    await ekle('bb_segments', ['slug', 'title', 'body', 'position'], [s.id, s.ad, s.aciklama, i * 10]);
  }
  for (const [i, u] of d.studyo.urunTipleri.entries()) {
    await ekle('bb_product_types', ['slug', 'title', 'body', 'draw_type', 'sizes', 'position', 'published'], [u.id, u.ad, u.ozet, u.tip, u.boyutlar, i * 10, true]);
  }
  for (const [i, t] of d.tasarimlar.entries()) {
    await ekle('bb_designs', ['slug', 'title', 'summary', 'occasion_slug', 'product_type_slug', 'size', 'chocolate', 'segment_slug', 'bestseller', 'is_new', 'tags', 'image', 'alt', 'position', 'published'], [
      t.id, t.ad, t.ozet, t.tema, t.urun, t.boyut || '', t.cikolata || '', t.segment || null, !!t.cokSatan, !!t.yeni, t.etiketler || [], yol(t.gorsel), t.gorsel ? t.ad : '', i * 10, true,
    ]);
    await ekle('bb_design_occasions', ['design_slug', 'occasion_slug'], [t.id, t.tema]);
    for (const k of t.kime || []) await ekle('bb_design_recipients', ['design_slug', 'recipient_slug'], [t.id, k]);
  }

  // Stüdyo seçenekleri: her grup için (slug, başlık, ekstra alanlar jsonb)
  const s = d.studyo;
  const grup = async (ad, liste, baslik, veri) => {
    for (const [i, o] of liste.entries()) await ekle('bb_studio_options', ['option_group', 'slug', 'title', 'data', 'position'], [ad, o.id ?? o, baslik(o), JSON.stringify(veri(o)), i * 10]);
  };
  await grup('chocolate', s.cikolataTipleri, (o) => o.ad, ({ dolgu, kenar }) => ({ dolgu, kenar }));
  await grup('wrap_color', s.ambalajRenkleri, (o) => o.ad, ({ zemin, kenar, metin }) => ({ zemin, kenar, metin }));
  await grup('ribbon', s.kurdeler, (o) => o.ad, ({ renk }) => ({ renk }));
  await grup('card', s.kartlar, (o) => o.ad, ({ zemin, metin }) => ({ zemin, metin }));
  await grup('font', s.fontlar, (o) => o.ad, ({ css }) => ({ css }));
  await grup('extra', s.ekstralar.map((e) => ({ ...e, id: e.id.replace(/[A-Z]/g, (h) => '-' + h.toLowerCase()) })), (o) => o.ad, ({ varsayilan }) => ({ varsayilan }));
  await grup('delivery', s.teslimSekilleri, (o) => o.ad, () => ({}));
  await grup('quantity', s.adetler, (o) => o + ' adet', () => ({}));
  await ekle('bb_settings', ['key', 'value'], ['studio_corporate_qty_note', s.kurumsalAdetNotu]);

  return sayac;
}
