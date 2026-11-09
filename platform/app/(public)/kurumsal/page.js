import { getContent } from '../../../lib/db';
import { pageMetadata } from '../../../lib/seo';
import ContentPage from '../content-page';

export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const item = await getContent('corporate');
  return pageMetadata(item.title, item.body.slice(0, 160), '/kurumsal', item.image);
}
export default async function Corporate() {
  return <ContentPage item={await getContent('corporate')}>
    <p><a className="v-metin-link" href="https://www.instagram.com/p/DeKCxa2KYvX/">Gökhan Türk Motors çalışmasını inceleyin</a></p>
  </ContentPage>;
}
