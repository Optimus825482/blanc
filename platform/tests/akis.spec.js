import { test, expect } from '@playwright/test';
import envPkg from '@next/env';
import pg from 'pg';

// Akış: ana sayfa → koleksiyon → tasarım → stüdyo (?tasarim=) → isim → onay → gönder → takip sayfasında kod.
// Oluşan test kaydı test sonunda veritabanından silinir.
envPkg.loadEnvConfig(process.cwd());
const kodlar = [];

test.afterAll(async () => {
  if (!kodlar.length) return;
  const havuz = new pg.Pool();
  await havuz.query('DELETE FROM bb_quotes WHERE code = ANY($1)', [kodlar]);
  await havuz.end();
});

test('ana sayfadan teklif koduna kadar', async ({ page }) => {
  await page.goto('/');
  await page.goto('/koleksiyonlar/dogum-gunu');

  await page.locator('a[href^="/tasarim/"]:visible').first().click();
  await page.waitForURL(/\/tasarim\/[^/?]+/);

  await page.locator('a[href^="/studyo?tasarim="]:visible').first().click();
  await page.waitForURL(/\/studyo\?tasarim=/);

  await page.locator('#isim').fill('Test Ayşe');
  // Betikler geç yüklenebilir: onay diyaloğu açılana kadar düğmeye yeniden tıkla.
  await expect(async () => {
    await page.locator('#btn-paylas').click();
    await expect(page.locator('#onay-diyalog')).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30_000 });
  await page.locator('#onay-tasdik').check();
  await page.locator('#btn-gonder').click();

  const kod = page.locator('#onay-kod');
  await expect(kod).toHaveText(/BB-[A-Z0-9]{4}-[A-Z0-9]{2}/, { timeout: 30_000 });
  const kodMetni = ((await kod.textContent()) || '').match(/BB-[A-Z0-9]{4}-[A-Z0-9]{2}/)[0];
  kodlar.push(kodMetni);

  const takip = await page.locator('#onay-takip').getAttribute('href');
  await page.goto(takip);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(kodMetni);
});
