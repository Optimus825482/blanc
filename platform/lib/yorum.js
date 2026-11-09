import { cache } from 'react';
import { query } from './db';

// Müşteri yorumları (plan 3.2): yalnızca panelde onaylananlar okunur.
// Ad, herkese açık gösterimde "Ayşe Y." biçimine indirgenir.
export const kisaAd = (ad = '') => {
  const parca = String(ad).trim().split(/\s+/).filter(Boolean);
  if (!parca.length) return 'Müşterimiz';
  return parca.length === 1 ? parca[0] : parca[0] + ' ' + parca[parca.length - 1][0] + '.';
};

export const getReviews = cache(async (limit = 6) => (await query(`
  SELECT r.id, r.name, r.text, r.rating, o.title AS occasion_title
  FROM bb_reviews r
  LEFT JOIN bb_occasions o ON o.slug = r.occasion_slug
  WHERE r.approved
  ORDER BY r.created_at DESC
  LIMIT $1`, [limit])).rows);
