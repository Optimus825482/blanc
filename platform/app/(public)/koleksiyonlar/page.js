import { getCategories } from '../../../lib/db';
import { pageMetadata } from '../../../lib/seo';
import Cards from '../cards';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('Özel Gün Koleksiyonları', 'Girne Alsancak’ta söz, nişan, doğum günü ve bebek kutlamaları için kişiye özel çikolata ve hediyelik koleksiyonları.', '/koleksiyonlar');

export default async function Collections() {
  const categories = await getCategories();
  return <section className="v-kabuk v-bolum">
    <div className="bb-page-intro">
      <p className="v-etiket">Beyza Blanc · Girne Alsancak</p><h1>Özel gün koleksiyonları</h1>
      <p>Her kutlama kendine özgü. Atölyemizin çikolata ve hediyelik tasarımlarını keşfedin, size ilham veren koleksiyonu seçin.</p>
    </div>
    <Cards categories={categories} />
    {!categories.length && <p>Yeni koleksiyonlarımız hazırlanıyor.</p>}
  </section>;
}
