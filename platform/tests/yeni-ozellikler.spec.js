import { test, expect } from '@playwright/test';

test('studyo not onerileri, yakinlastirma, paylasim linki ve filigranli indirme', async ({ page }) => {
  await page.goto('/studyo');
  await expect(page.locator('#onizleme')).toHaveAttribute('data-render-mode', /photo-mockup|product-photo/, { timeout: 20_000 });

  // 1. Detaya yakinlasma
  const zoomBtn = page.locator('#studio-zoom-toggle');
  await zoomBtn.click();
  await expect(zoomBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#studio-canvas-frame')).toHaveClass(/is-zoomed/);
  await zoomBtn.click();
  await expect(zoomBtn).toHaveAttribute('aria-pressed', 'false');

  // 2. "Ne yazsam?" not onerileri (Adim 2)
  await page.locator('[data-studio-step="2"]').click();
  const ilkOneri = page.locator('#not-onerileri .studio-note-chip').first();
  await expect(ilkOneri).toBeVisible();
  const oneriMetin = (await ilkOneri.textContent()) || '';
  await ilkOneri.click();
  await expect(page.locator('#mesaj')).toHaveValue(oneriMetin);

  // 3. Paylasim linki ile durum geri yukleme (?durum=)
  const testDurum = {
    urun: 'hediye-kutusu',
    tema: 'dogum-gunu',
    isim: 'Paylaşılan İsim',
    mesaj: 'Nice mutlu yıllara',
  };
  const kod = Buffer.from(JSON.stringify(testDurum), 'utf8').toString('base64url');
  await page.goto('/studyo?durum=' + kod);
  await expect(page.locator('#isim')).toHaveValue('Paylaşılan İsim');
  await expect(page.locator('#mesaj')).toHaveValue('Nice mutlu yıllara');

  // 4. Filigranli PNG indirme
  await page.locator('[data-studio-step="4"]').click();
  await expect(page.locator('#musteriEposta')).toBeVisible();
  await expect(page.locator('#musteriTelefon')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#btn-indir').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^beyza-blanc-.*\.png$/);
});
