import { test, expect } from '@playwright/test';

test('tüm ekran boyutlarında yatay taşma olmaz ve kaydırmayla öğeler görünürleşir', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/bb-anim-ready/);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(overflow, `Ana sayfa yatay taşma (${width}px)`).toBe(true);

    const koleksiyon = page.locator('#koleksiyonlar [data-reveal]').first();
    await koleksiyon.scrollIntoViewIfNeeded();
    await expect(koleksiyon).toHaveClass(/reveal-enter/);

    const kurumsal = page.locator('#kurumsal [data-reveal]').first();
    await kurumsal.scrollIntoViewIfNeeded();
    await expect(kurumsal).toHaveClass(/reveal-enter/);
  }

  for (const path of ['/koleksiyonlar', '/hakkimizda', '/kurumsal']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(overflow, `${path} mobil yatay taşma`).toBe(true);
  }
});

test('azaltılmış hareket tercihinde içerik gizlenmez ve istemci geçişinde reveal çalışır', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/bb-anim-ready/);
  const opacity = await page.locator('#kurumsal [data-reveal]').first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('a[href="/koleksiyonlar"]:visible').first().click();
  await page.waitForURL(/\/koleksiyonlar/);
  await page.locator('[data-reveal]').first().scrollIntoViewIfNeeded();
  await expect(page.locator('[data-reveal]').first()).toHaveClass(/reveal-enter/);
});
