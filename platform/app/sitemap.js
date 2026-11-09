import { getDesigns, getOccasions } from '../lib/katalog-oku';
import { siteUrl } from '../lib/seo';

export const dynamic = 'force-dynamic';
export default async function sitemap() {
  if (!siteUrl) return [];
  const [occasions, designs] = await Promise.all([getOccasions(), getDesigns()]);
  return [
    ...['/', '/koleksiyonlar', '/studyo', '/sss', '/hakkimizda', '/kurumsal', '/iletisim'].map(path => ({ url: siteUrl + path })),
    ...occasions.map(item => ({ url: siteUrl + '/koleksiyonlar/' + item.slug, lastModified: item.updated_at })),
    ...designs.map(item => ({ url: siteUrl + '/tasarim/' + item.slug, lastModified: item.updated_at })),
  ];
}
