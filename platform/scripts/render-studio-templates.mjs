import env from '@next/env';
import pg from 'pg';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Şablon kartları, editörün kendisinden dışa aktarılır; ayrı bir temsili tasarım çizilmez.
env.loadEnvConfig(process.cwd());
const pool = new pg.Pool();
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
try {
  const { rows } = await pool.query("SELECT slug FROM bb_designs WHERE slug LIKE 'studyo-%' AND image='' ORDER BY position");
  await mkdir('public/assets/img/studyo/templates', { recursive: true });
  const page = await browser.newPage();
  for (const { slug } of rows) {
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid template slug');
    await page.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011') + '/studyo?tasarim=' + slug);
    await page.locator('#onizleme[data-render-mode="photo-mockup"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    // fonts.ready callback redraws the current canvas before this later task.
    const data = await page.locator('#onizleme').evaluate((canvas) => canvas.toDataURL('image/png').split(',')[1]);
    const url = '/assets/img/studyo/templates/' + slug + '.webp';
    await sharp(Buffer.from(data, 'base64')).resize(480, 480).webp({ quality: 86 }).toFile('public' + url);
    await pool.query("UPDATE bb_designs SET image=$2 WHERE slug=$1 AND image=''", [slug, url]);
    console.log(slug);
  }
  console.log(rows.length + ' şablon görseli hazır.');
} finally { await browser.close(); await pool.end(); }
