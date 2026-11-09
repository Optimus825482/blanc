import 'server-only';
import pg from 'pg';
import { cache } from 'react';

const pool = globalThis.beyzaPool ?? new pg.Pool({ max: 8, connectionTimeoutMillis: 5000 });
if (process.env.NODE_ENV !== 'production') globalThis.beyzaPool = pool;

export const query = (text, values) => pool.query(text, values);
export const getContent = cache(async (key) => (await query('SELECT * FROM bb_content WHERE key=$1', [key])).rows[0]);
export const getCategories = cache(async () => (await query(
  'SELECT * FROM bb_categories WHERE published ORDER BY position, title'
)).rows);
export const getCategory = cache(async (slug) => (await query(
  'SELECT * FROM bb_categories WHERE slug=$1 AND published', [slug]
)).rows[0]);
