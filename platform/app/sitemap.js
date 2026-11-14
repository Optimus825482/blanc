import { getDesigns, getOccasions } from '../lib/katalog-oku';
import { siteUrl } from '../lib/seo';

export const dynamic = 'force-dynamic';
export default async function sitemap() {
  if (!siteUrl) return [];
  const [occasions, designs] = await Promise.all([getOccasions(), getDesigns()]);
  const abs = (img) => (img ? [new URL(img, siteUrl).href] : undefined);
  return [
    { url: siteUrl + '/', changeFrequency: 'weekly', priority: 1.0 },
    { url: siteUrl + '/koleksiyonlar', changeFrequency: 'weekly', priority: 0.9 },
    { url: siteUrl + '/studyo', changeFrequency: 'weekly', priority: 0.9 },
    ...['/sss', '/hakkimizda', '/kurumsal', '/iletisim'].map((path) => ({
      url: siteUrl + path, changeFrequency: 'monthly', priority: 0.7,
    })),
    ...occasions.map((item) => ({
      url: siteUrl + '/koleksiyonlar/' + item.slug,
      lastModified: item.updated_at,
      changeFrequency: 'weekly',
      priority: 0.85,
      images: abs(item.card_image),
    })),
    ...designs.map((item) => ({
      url: siteUrl + '/tasarim/' + item.slug,
      lastModified: item.updated_at,
      changeFrequency: item.slug.startsWith('studyo-') ? 'monthly' : 'weekly',
      priority: item.slug.startsWith('studyo-') ? 0.5 : 0.8,
      images: abs(item.image),
    })),
  ];
}
