import { siteUrl } from './seo';
import { getDesigns, getOccasions } from './katalog-oku';

export const INDEXNOW_KEY = process.env.INDEXNOW_KEY?.trim() || 'b3y2a8l4c9e1d7f0a5c6e2b4d8f1a3c7';

/**
 * Verilen yol veya tam URL listesini IndexNow (Bing, Yandex, Seznam, ChatGPT Search) API'sine bildirir.
 * SITE_URL tanımlı değilse veya yerel geliştirme ortamındaysa sessizce atlar; yönetim paneli akışını asla engellemez.
 */
export async function submitToIndexNow(pathsOrUrls) {
  if (!siteUrl) return { ok: false, reason: 'SITE_URL_NOT_SET', count: 0 };
  const host = new URL(siteUrl).host;
  const rawList = Array.isArray(pathsOrUrls) ? pathsOrUrls : [pathsOrUrls];
  const urlList = [...new Set(
    rawList
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => (item.startsWith('http') ? item : new URL(item, siteUrl).href))
  )].slice(0, 10000);

  if (!urlList.length) return { ok: false, reason: 'EMPTY_URL_LIST', count: 0 };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return { ok: response.ok, status: response.status, count: urlList.length };
  } catch (error) {
    return { ok: false, reason: error?.message || 'NETWORK_ERROR', count: urlList.length };
  }
}

/**
 * Sitedeki tüm indekslenebilir vitrin, koleksiyon ve tasarım URL'lerini toplar.
 */
export async function collectSiteUrls() {
  if (!siteUrl) return [];
  const [occasions, designs] = await Promise.all([getOccasions(), getDesigns()]);
  return [
    ...['/', '/koleksiyonlar', '/studyo', '/sss', '/hakkimizda', '/kurumsal', '/iletisim'].map((p) => siteUrl + p),
    ...occasions.map((o) => siteUrl + '/koleksiyonlar/' + o.slug),
    ...designs.map((d) => siteUrl + '/tasarim/' + d.slug),
  ];
}
