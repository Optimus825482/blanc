import { test, expect } from '@playwright/test';
import envPkg from '@next/env';
import pg from 'pg';

envPkg.loadEnvConfig(process.cwd());
const testKodlari = [];

test.afterAll(async () => {
  if (!testKodlari.length) return;
  const havuz = new pg.Pool();
  await havuz.query('DELETE FROM bb_quotes WHERE code = ANY($1)', [testKodlari]);
  await havuz.end();
});

async function adim(page, n) {
  await page.locator(`[data-studio-step="${n}"]`).click();
  await expect(page.locator(`[data-studio-step="${n}"]`)).toHaveAttribute('aria-current', 'step');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/studyo');
  await expect(page.locator('#studio-guide')).toBeVisible();
});

test('adımlar, yerleşim, geri al ve taslak tekrar açma', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await expect(page.locator('#isim')).toBeHidden();
  await adim(page, 2);
  await expect(page.locator('[data-editor-step="2"] h2').first()).toBeFocused();
  await page.locator('#isim').fill('Elif & Mert');
  await page.getByText('Yazıyı hassas yerleştir', { exact: true }).click();
  await page.locator('#yazi-x').focus();
  await page.locator('#yazi-x').press('ArrowRight');
  await expect(page.locator('#yazi-x-deger')).toHaveText('51%');
  await page.locator('#studio-undo').click();
  await expect(page.locator('#yazi-x')).toHaveValue('50');
  await expect(page.locator('#isim')).toHaveValue('Elif & Mert');
  await page.locator('#studio-redo').click();
  await expect(page.locator('#yazi-x')).toHaveValue('51');

  await page.getByText('Kaydet ve sonra devam et', { exact: true }).click();
  await page.locator('#taslak-kaydet').click();
  await page.reload();
  await expect(page.locator('#studio-guide')).toBeVisible();
  await page.getByText('Kaydet ve sonra devam et', { exact: true }).click();
  await page.locator('#taslak-yukle').click();
  await expect(page.locator('#isim')).toHaveValue('Elif & Mert');
  await expect(page.locator('#yazi-x')).toHaveValue('51');
  await expect(page.locator('#studio-live-summary')).toContainText('Elif & Mert');
  await adim(page, 3);
  await page.getByRole('button', { name: 'Romantik pudra', exact: true }).click();
  await expect(page.locator('input[name="ambalaj"][value="pudra"]')).toBeChecked();
  await page.locator('#studio-undo').click();
  await expect(page.locator('input[name="ambalaj"][value="krem"]')).toBeChecked();
  await adim(page, 4);
  await page.locator('#btn-sifirla').click();
  await expect(page.locator('[data-studio-step="0"]')).toHaveAttribute('aria-current', 'step');
  await page.locator('#studio-undo').click();
  await adim(page, 2);
  await expect(page.locator('#isim')).toHaveValue('Elif & Mert');
  await expect(page.locator('#yazi-x')).toHaveValue('51');
  await page.locator('#taslak-sil').click();
  await expect(page.locator('#taslak-yukle')).toBeHidden();
  expect(errors).toEqual([]);
});

test('fotoğraf yükleme hatası, kaldırma ve geri alma', async ({ page }) => {
  await adim(page, 2);
  await page.locator('#foto').setInputFiles({ name: 'bozuk.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#foto-hata')).toContainText('Fotoğraf açılamadı');
  await page.locator('#foto').setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6XbQAAAAASUVORK5CYII=', 'base64') });
  await expect(page.locator('#foto-onizleme img')).toBeVisible();
  await expect(page.locator('#foto-hata')).toBeHidden();
  await page.locator('#foto-kaldir').click();
  await expect(page.locator('#foto-onizleme img')).toHaveCount(0);
  await page.locator('#studio-undo').click();
  await expect(page.locator('#foto-onizleme img')).toBeVisible();
  await page.locator('#studio-redo').click();
  await expect(page.locator('#foto-onizleme img')).toHaveCount(0);
});

test('ürün değişimini geri alır; bozuk taslak mevcut tasarımı değiştirmez', async ({ page }) => {
  const ilkUrun = await page.locator('input[name="urun"]:checked').inputValue();
  await page.locator('input[name="urun"]').nth(1).check();
  await page.locator('#studio-undo').click();
  await expect(page.locator('input[name="urun"]:checked')).toHaveValue(ilkUrun);
  await expect(page.locator('#studio-redo')).toBeEnabled();
  await adim(page, 2);
  await page.locator('#isim').fill('Korunan tasarım');
  await expect(page.locator('#studio-redo')).toBeDisabled();
  await page.getByText('Kaydet ve sonra devam et', { exact: true }).click();
  await page.locator('#taslak-kaydet').click();
  await page.evaluate(() => localStorage.setItem('beyza-studyo-taslak-v1', JSON.stringify({ version: 2, durum: { urun: 'artık-sunulmuyor' } })));
  await page.locator('#taslak-yukle').click();
  await expect(page.locator('#studio-feedback')).toContainText('Mevcut tasarımınız korundu');
  await expect(page.locator('#isim')).toHaveValue('Korunan tasarım');
  await expect(page.locator('input[name="urun"]:checked')).toHaveValue(ilkUrun);
});

test('dar, tablet ve geniş ekranlarda taşma ve adım odağı', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await adim(page, 2);
    await page.locator('#isim').fill('Ayşe & Mehmet');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const hiddenFocusable = await page.locator('[data-editor-step="0"]').evaluateAll((panels) => panels.every((p) => getComputedStyle(p).display === 'none'));
    expect(hiddenFocusable).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`studio-${width}.png`) });
  }
});

test('fotoğraf maketi ürün ve kutu boyutuyla değişir, görsel hatası yeniden denenebilir', async ({ page }) => {
  const canvas = page.locator('#onizleme');
  await expect(canvas).toHaveAttribute('data-render-mode', 'photo-mockup');
  await page.locator('input[name="boyut"][value="9"]').check();
  await expect(canvas).toHaveAttribute('data-chocolate-count', '9');
  const ilkGorsel = await canvas.evaluate((c) => c.toDataURL());
  await page.locator('input[name="boyut"][value="25"]').check();
  await expect(canvas).toHaveAttribute('data-chocolate-count', '25');
  expect(await canvas.evaluate((c) => c.toDataURL())).not.toBe(ilkGorsel);
  for (const urun of ['bar', 'tepsi']) {
    await page.locator(`input[name="urun"][value="${urun}"]`).check();
    await expect(canvas).toHaveAttribute('data-render-mode', 'photo-mockup');
    await expect(canvas).toHaveAttribute('data-chocolate-count', urun === 'bar' ? '0' : '12');
  }
  await page.route('**/assets/img/studyo/photo-empty-v1.webp', (route) => route.abort());
  await page.reload();
  await expect(canvas).toHaveAttribute('data-render-mode', 'error');
  await expect(page.locator('#studio-scene-retry')).toBeVisible();
  await page.unroute('**/assets/img/studyo/photo-empty-v1.webp');
  await page.locator('#studio-scene-retry').click();
  await expect(canvas).toHaveAttribute('data-render-mode', 'photo-mockup');
  await expect(page.locator('#studio-scene-retry')).toBeHidden();
});

test('şablon arama, özel gün filtresi ve isim-not koruyarak şablon değiştirme', async ({ page }) => {
  await adim(page, 2);
  await page.locator('#isim').fill('Zeynep & Emre');
  await page.locator('#mesaj').fill('Özel notumuz');

  await adim(page, 1);
  await expect(page.locator('#sablon-kisisel-koru')).toBeChecked();

  await page.locator('#sablon-ara').fill('lavanta');
  await expect(page.locator('input[name="sablon"][value="studyo-lavanta-dusu-madlen-kutu"]')).toBeVisible();
  await expect(page.locator('#sablon-sonuc')).toContainText('1 şablon');

  await page.locator('#sablon-ara').fill('');
  await page.locator('#sablon-gunum').check();
  const gunSablonSayisi = await page.locator('#alan-sablon input[name="sablon"]').count();
  expect(gunSablonSayisi).toBeGreaterThanOrEqual(4); // 1 Serbest tasarım + en az 3 özel gün şablonu
  await expect(page.locator('input[name="sablon"][value="studyo-ada-bahcesi-madlen-kutu"]')).toHaveCount(0);
  await page.locator('#sablon-gunum').uncheck();

  await page.locator('#sablon-ara').fill('ERKAN ERDEM');
  await expect(page.locator('#alan-sablon input[name="sablon"]')).toHaveCount(7); // Serbest + 6 önerilen
  await page.locator('.studio-template-apply').click();
  await expect(page.locator('#isim')).toHaveValue('ERKAN ERDEM');
  await page.locator('#studio-undo').click();
  await expect(page.locator('#isim')).toHaveValue('Zeynep & Emre');
  await page.locator('#sablon-ara').fill('');

  await page.locator('input[name="sablon"][value="studyo-ada-bahcesi-madlen-kutu"]').check();
  await adim(page, 2);
  await expect(page.locator('#isim')).toHaveValue('Zeynep & Emre');
  await expect(page.locator('#mesaj')).toHaveValue('Özel notumuz');

  await adim(page, 3);
  await expect(page.locator('input[name="ambalaj"][value="adacayi"]')).toBeChecked();
  await expect(page.locator('input[name="font"][value="playfair"]')).toBeChecked();
  await expect(page.locator('input[name="cerceve"][value="kose"]')).toBeChecked();

  await adim(page, 1);
  await page.locator('#sablon-kisisel-koru').uncheck();
  await page.locator('input[name="sablon"][value="studyo-gece-imzasi-madlen-kutu"]').check();
  await adim(page, 2);
  await expect(page.locator('#isim')).toHaveValue('Markanıza özel');
  await expect(page.locator('#mesaj')).toHaveValue('Birlikte nice başarılara');

  await adim(page, 3);
  await expect(page.locator('input[name="ambalaj"][value="lacivert"]')).toBeChecked();
  await expect(page.locator('input[name="kurdele"][value="gumus"]')).toBeChecked();
  await expect(page.locator('input[name="font"][value="montserrat"]')).toBeChecked();
  await expect(page.locator('input[name="cerceve"][value="art-deco"]')).toBeChecked();
});

test('yeni şablon, renk, kurdele, yazı tipi ve çerçeve seçimleri teklif kaydına aktarılır', async ({ page }) => {
  await adim(page, 1);
  await page.locator('input[name="sablon"][value="studyo-lavanta-dusu-madlen-kutu"]').check();

  await adim(page, 3);
  await page.locator('input[name="kurdele"][value="pudra"]').check();
  await page.locator('input[name="cerceve"][value="art-deco"]').check();

  await adim(page, 4);
  await expect(async () => {
    await page.locator('#btn-paylas').click();
    await expect(page.locator('#onay-diyalog')).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 30_000 });

  await expect(page.locator('#onay-liste')).toContainText('Art déco');
  await page.locator('#onay-tasdik').check();
  await page.locator('#btn-gonder').click();

  const kod = page.locator('#onay-kod');
  await expect(kod).toHaveText(/BB-[A-Z0-9]{4}-[A-Z0-9]{2}/, { timeout: 30_000 });
  const kodMetni = ((await kod.textContent()) || '').match(/BB-[A-Z0-9]{4}-[A-Z0-9]{2}/)[0];
  testKodlari.push(kodMetni);

  const havuz = new pg.Pool();
  try {
    const { rows } = await havuz.query('SELECT design_slug, selections, summary FROM bb_quotes WHERE code = $1', [kodMetni]);
    expect(rows).toHaveLength(1);
    expect(rows[0].design_slug).toBe('studyo-lavanta-dusu-madlen-kutu');
    expect(rows[0].selections).toMatchObject({
      ambalaj: 'lavanta',
      kurdele: 'pudra',
      font: 'dancing',
      cerceve: 'art-deco',
      sablon: 'studyo-lavanta-dusu-madlen-kutu',
    });
    expect(rows[0].summary).toContain('Çerçeve: Art déco');
  } finally {
    await havuz.end();
  }
});
