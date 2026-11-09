import Link from 'next/link';
import { redirect } from 'next/navigation';
import { KOKLER, eskiKategori, getDesigns, getOccasions, getProductTypes, getRecipients, getSegments, temizFiltre } from '../../../lib/katalog-oku';
import { pageMetadata } from '../../../lib/seo';
import Cards from '../cards';
import Filtreler from '../filtreler';
import { TasarimIzgarasi } from '../tasarim-karti';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('Özel Gün Koleksiyonları', 'Girne Alsancak’ta söz, nişan, doğum günü, bebek ve kurumsal kutlamalar için kişiye özel çikolata ve hediyelik tasarımları.', '/koleksiyonlar');

export default async function Collections({ searchParams }) {
  const params = await searchParams;
  const [occasions, recipients, products, segments] = await Promise.all([getOccasions(), getRecipients(), getProductTypes(), getSegments()]);
  const gun = typeof params.gun === 'string' ? (eskiKategori[params.gun] ?? params.gun) : null;
  if (gun && occasions.some((o) => o.slug === gun)) redirect('/koleksiyonlar/' + gun);

  const filtre = temizFiltre(params);
  const filtreli = Object.values(filtre).some(Boolean);
  const designs = filtreli ? await getDesigns(filtre) : [];
  const ad = (liste, slug) => liste.find((x) => x.slug === slug)?.title;
  const baslik = filtreli
    ? [ad(recipients, filtre.recipient), ad(products, filtre.product), ad(segments, filtre.segment)].filter(Boolean).join(' · ')
    : null;

  return <section className="v-kabuk v-bolum bb-koleksiyonlar">
    <div className="bb-page-intro">
      <p className="v-etiket">Beyza Blanc · Girne Alsancak</p>
      <h1>{baslik ? baslik : 'Özel gün koleksiyonları'}</h1>
      <p>{baslik ? 'Seçiminize uyan hazır tasarımlar. Her biri stüdyoda isim, tarih ve renklerinizle kişiselleştirilir.' : 'Her kutlama kendine özgü. Özel güne, hediyeyi alacak kişiye ya da ürün tipine göre keşfedin; beğendiğiniz tasarımı stüdyoda kendinize göre uyarlayın.'}</p>
      {gun && <p className="bb-status" role="status">Aradığınız özel gün için koleksiyon hazırlanıyor. Dilerseniz <Link href="/studyo">tasarım stüdyosunda</Link> hemen başlayabilirsiniz.</p>}
    </div>
    <Filtreler taban="/koleksiyonlar" params={params} alicilar={recipients} urunTipleri={products} segmentler={segments} />
    {filtreli ? <TasarimIzgarasi tasarimlar={designs} /> : <>
      {KOKLER.map(([kok, kokAdi]) => {
        const liste = occasions.filter((o) => o.root === kok);
        if (!liste.length) return null;
        return <section className="bb-kok" key={kok} aria-labelledby={'kok-' + kok}>
          <h2 id={'kok-' + kok} className="v-etiket">{kokAdi}</h2>
          <Cards categories={liste.map((o) => ({ slug: o.slug, title: o.title, body: o.body, image: o.card_image, alt: o.card_alt, icon: o.icon, count: Number(o.design_count) }))} />
        </section>;
      })}
      {!occasions.length && <p>Yeni koleksiyonlarımız hazırlanıyor.</p>}
    </>}
  </section>;
}
