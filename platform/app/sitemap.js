import { getCategories } from '../lib/db';
import { siteUrl } from '../lib/seo';

export const dynamic = 'force-dynamic';
export default async function sitemap() {
  if (!siteUrl) return [];
  const categories = await getCategories();
  return [
    ...['/', '/koleksiyonlar', '/hakkimizda', '/kurumsal', '/iletisim'].map(path => ({ url: siteUrl + path })),
    ...categories.map(item => ({ url: siteUrl + '/koleksiyonlar/' + item.slug, lastModified: item.updated_at })),
  ];
}
