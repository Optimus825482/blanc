import 'server-only';
import { cache } from 'react';
import { query } from './db';

// Vitrin için katalog okuma (plan 1.4 / 1.5). Yalnızca yayındaki kayıtlar.
export const KOKLER = [
  ['ozel-gun', 'Kişisel özel günler'],
  ['mevsim', 'Takvim ve mevsim günleri'],
  ['kurumsal', 'İş ve kurum hayatı'],
];

// Eski vitrin kategorisi adresleri → özel gün adresleri (kalıcı yönlendirme).
export const eskiKategori = { 'bebek-hediyelikleri': 'hos-geldin-bebek', 'kisiye-ozel': 'her-zaman', 'kisiye-ozel-cikolata': 'her-zaman' };

const slugOk = (s) => typeof s === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length <= 72;
const normalizeDesignRow = (row) => {
  if (!row) return row;
  if (typeof row.image === 'string' && /^\/assets\/img\/urun-[a-z-]+\.svg$/i.test(row.image) && row.slug) {
    return { ...row, image: `/assets/img/studyo/templates/${row.slug}.webp` };
  }
  return row;
};
const normalizeOccasionRow = (row) => {
  if (!row) return row;
  let cardImage = row.card_image;
  if (typeof cardImage === 'string' && /^\/assets\/img\/urun-[a-z-]+\.svg$/i.test(cardImage) && row.fallback_design_slug) {
    cardImage = `/assets/img/studyo/templates/${row.fallback_design_slug}.webp`;
  } else if (row.slug === 'her-zaman' && typeof cardImage === 'string' && cardImage.includes('fotografli-puzzle-cikolata.webp')) {
    cardImage = '/assets/img/studyo/templates/sade-imza-kutusu.webp';
  } else if (row.slug === 'anneler-babalar' && typeof cardImage === 'string' && cardImage.includes('musteri-hediye-tasarimi.webp')) {
    cardImage = '/assets/img/studyo/templates/anneler-gunu-tepsisi.webp';
  }
  return cardImage === row.card_image ? row : { ...row, card_image: cardImage };
};

// Görseli olmayan özel gün için o güne ait ilk tasarımın görseli kullanılır.
const occasionSelect = `
  SELECT o.*, COALESCE(NULLIF(o.image, ''), d.image, '') AS card_image, COALESCE(NULLIF(o.alt, ''), d.alt, o.title) AS card_alt,
         d.slug AS fallback_design_slug,
         (SELECT count(*) FROM bb_designs x WHERE x.published AND (x.occasion_slug = o.slug OR x.slug IN (SELECT design_slug FROM bb_design_occasions WHERE occasion_slug = o.slug))) AS design_count
  FROM bb_occasions o
  LEFT JOIN LATERAL (SELECT slug, image, alt FROM bb_designs WHERE published AND occasion_slug = o.slug AND image <> '' ORDER BY featured DESC, bestseller DESC, position LIMIT 1) d ON true
  WHERE o.published`;

export const getOccasions = cache(async () => (await query(occasionSelect + ' ORDER BY o.position, o.title')).rows.map(normalizeOccasionRow));
export const getOccasion = cache(async (slug) => slugOk(slug) ? normalizeOccasionRow((await query(occasionSelect + ' AND o.slug = $1', [slug])).rows[0]) : undefined);
export const getRecipients = cache(async () => (await query('SELECT * FROM bb_recipients WHERE published ORDER BY position, title')).rows);
export const getProductTypes = cache(async () => (await query('SELECT * FROM bb_product_types WHERE published ORDER BY position, title')).rows);
export const getSegments = cache(async () => (await query('SELECT * FROM bb_segments ORDER BY position, title')).rows);

// Filtreli tasarım listesi. Tüm filtreler isteğe bağlı; geçersiz değerler yok sayılır.
export const getDesigns = cache(async ({ occasion, recipient, product, segment } = {}) => {
  const where = ['d.published'];
  const values = [];
  const add = (sql, v) => { values.push(v); where.push(sql.replace('?', '$' + values.length)); };
  if (slugOk(occasion)) {
    values.push(occasion);
    where.push(`(d.occasion_slug = $${values.length} OR d.slug IN (SELECT design_slug FROM bb_design_occasions WHERE occasion_slug = $${values.length}))`);
  }
  if (slugOk(recipient)) add('d.slug IN (SELECT design_slug FROM bb_design_recipients WHERE recipient_slug = ?)', recipient);
  if (slugOk(product)) add('d.product_type_slug = ?', product);
  if (slugOk(segment)) add('d.segment_slug = ?', segment);
  const { rows } = await query(`
    SELECT d.*, p.title AS product_title, s.title AS segment_title, o.title AS occasion_title, o.icon AS occasion_icon
    FROM bb_designs d
    JOIN bb_product_types p ON p.slug = d.product_type_slug
    JOIN bb_occasions o ON o.slug = d.occasion_slug
    LEFT JOIN bb_segments s ON s.slug = d.segment_slug
    WHERE ${where.join(' AND ')}
    ORDER BY d.featured DESC, d.bestseller DESC, d.position, d.title`, values);
  return rows.map(normalizeDesignRow);
});

export const getDesign = cache(async (slug) => {
  if (!slugOk(slug)) return undefined;
  const { rows } = await query(`
    SELECT d.*, p.title AS product_title, p.body AS product_body, p.sizes AS product_sizes, s.title AS segment_title, s.body AS segment_body,
           o.title AS occasion_title, o.short_title AS occasion_short, o.icon AS occasion_icon, o.accent AS occasion_accent,
           (SELECT array_agg(r.title ORDER BY r.position) FROM bb_design_recipients dr JOIN bb_recipients r ON r.slug = dr.recipient_slug WHERE dr.design_slug = d.slug AND r.published) AS recipient_titles,
           (SELECT title FROM bb_studio_options WHERE option_group = 'chocolate' AND slug = d.chocolate) AS chocolate_title
    FROM bb_designs d
    JOIN bb_product_types p ON p.slug = d.product_type_slug
    JOIN bb_occasions o ON o.slug = d.occasion_slug
    LEFT JOIN bb_segments s ON s.slug = d.segment_slug
    WHERE d.published AND d.slug = $1`, [slug]);
  return normalizeDesignRow(rows[0]);
});

export const getFaq = cache(async () => (await query('SELECT * FROM bb_faq WHERE published ORDER BY position, id')).rows);

export function temizFiltre(params) {
  const al = (k) => (slugOk(params?.[k]) ? params[k] : undefined);
  return { recipient: al('kime'), product: al('urun'), segment: al('segment') };
}

export const fiyatYaz = (n) => Number(n).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' TL';
