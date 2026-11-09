import { getContent } from '../../../lib/db';
import { pageMetadata } from '../../../lib/seo';
import ContentPage from '../content-page';

export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const item = await getContent('about');
  return pageMetadata(item.title, item.body.slice(0, 160), '/hakkimizda', item.image);
}
export default async function About() {
  return <ContentPage item={await getContent('about')} />;
}
