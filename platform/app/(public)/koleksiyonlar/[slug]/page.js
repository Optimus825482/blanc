import { notFound } from 'next/navigation';
import { getCategory } from '../../../../lib/db';
import { contact, pageMetadata } from '../../../../lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getCategory(slug);
  if (!item) notFound();
  return pageMetadata(item.title + ' · Girne Alsancak', item.body.slice(0, 160), '/koleksiyonlar/' + slug, item.image);
}
export default async function Collection({ params }) {
  const item = await getCategory((await params).slug);
  if (!item) notFound();
  return <section className="v-kabuk v-bolum v-acilis">
    <div className="bb-prose"><a className="v-metin-link" href="/koleksiyonlar">← Koleksiyonlar</a>
      <h1>{item.title}</h1><p>{item.body}</p>
      <div className="v-eylemler"><a className="v-dugme" href={contact}>Atölyeye yaz</a><a className="v-metin-link" href="/studyo">Stüdyoda tasarla</a></div>
    </div>
    <img className="bb-detail-image" src={item.image} alt={item.alt} width="640" height="640" fetchPriority="high" />
  </section>;
}
