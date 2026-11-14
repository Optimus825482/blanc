import { defineConfig, devices } from '@playwright/test';

// Uçtan uca testler (plan 2.10). Çalışan geliştirme sunucusunu kullanır; PLAYWRIGHT_BASE_URL ile değiştirilebilir.
export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3011',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'masaustu', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobil', use: { ...devices['Pixel 7'] } },
  ],
});
