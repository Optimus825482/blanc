import { redirect } from 'next/navigation';
import { getCategories } from '../../../lib/db';
import { pageMetadata } from '../../../lib/seo';
import Cards from '../cards';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('Özel Gün Koleksiyonları', 'Girne Alsancak’ta söz, nişan, doğum günü ve bebek kutlamaları için kişiye özel çikolata ve hediyelik koleksiyonları.', '/koleksiyonlar');

// Statik stüdyo menüsündeki özel gün kimlikleri ile veritabanı kategori adresleri
// arasındaki geçici eşleme. Katalog veritabanına taşınınca (plan 1.2) kaldırılır.
const aliases = { 'hos-geldin-bebek': 'bebek-hediyelikleri', 'kisiye-ozel-cikolata': 'kisiye-ozel' };

export default async function Collections({ searchParams }) {
  const { gun } = await searchParams;
  const categories = await getCategories();
  const wanted = typeof gun === 'string' && /^[a-z0-9-]{1,72}$/.test(gun) ? (aliases[gun] ?? gun) : null;
  if (wanted && categories.some(item => item.slug === wanted)) redirect('/koleksiyonlar/' + wanted);
  return <section className="v-kabuk v-bolum">
    <div className="bb-page-intro">
      <p className="v-etiket">Beyza Blanc · Girne Alsancak</p><h1>Özel gün koleksiyonları</h1>
      <p>Her kutlama kendine özgü. Atölyemizin çikolata ve hediyelik tasarımlarını keşfedin, size ilham veren koleksiyonu seçin.</p>
      {wanted && <p className="bb-status" role="status">Aradığınız özel gün için koleksiyon hazırlanıyor. Dilerseniz <a href="/studyo">tasarım stüdyosunda</a> hemen başlayabilirsiniz.</p>}
    </div>
    <Cards categories={categories} />
    {!categories.length && <p>Yeni koleksiyonlarımız hazırlanıyor.</p>}
  </section>;
}
