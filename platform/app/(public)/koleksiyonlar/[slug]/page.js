import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { eskiKategori, getDesigns, getOccasion, getProductTypes, getRecipients, getSegments, temizFiltre } from '../../../../lib/katalog-oku';
import { contact, pageMetadata } from '../../../../lib/seo';
import Filtreler from '../../filtreler';
import { TasarimIzgarasi } from '../../tasarim-karti';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getOccasion(eskiKategori[slug] ?? slug);
  if (!item) return {};
  return pageMetadata(item.title + ' · Girne Alsancak', item.body.slice(0, 160) || item.title, '/koleksiyonlar/' + item.slug, item.card_image || undefined);
}

export default async function Collection({ params, searchParams }) {
  const { slug } = await params;
  if (eskiKategori[slug]) permanentRedirect('/koleksiyonlar/' + eskiKategori[slug]);
  const [item, query, recipients, products, segments] = await Promise.all([getOccasion(slug), searchParams, getRecipients(), getProductTypes(), getSegments()]);
  if (!item) notFound();
  const filtre = temizFiltre(query);
  const designs = await getDesigns({ occasion: item.slug, ...filtre });
  const oneri = item.suggested || {};
  const studyo = '/studyo?tema=' + item.slug;
  return <>
    <section className="v-kabuk v-bolum v-acilis bb-gun" style={{ '--gun-vurgu': item.accent || '#B08D57' }}>
      <div className="bb-prose v-acilis-metin">
        <Link className="v-metin-link" href="/koleksiyonlar">← Tüm koleksiyonlar</Link>
        <p className="v-etiket"><span aria-hidden="true" /> {item.icon} {item.short_title}</p>
        <h1>{item.title}</h1>
        <p>{item.body}</p>
        <div className="v-eylemler">
          <Link className="v-dugme" href={studyo}>Bu özel gün için tasarla</Link>
          <a className="v-metin-link" href={contact}>Atölyeye yaz <span aria-hidden="true">↗</span></a>
        </div>
        {(oneri.ambalaj || oneri.kurdele) && <p className="bb-gun__oneri">Atölyenin önerisi: {[oneri.ambalaj && oneri.ambalaj + ' ambalaj', oneri.kurdele && oneri.kurdele + ' kurdele', oneri.cikolata && oneri.cikolata + ' çikolata'].filter(Boolean).join(', ')}.</p>}
      </div>
      {item.card_image && <img className="bb-detail-image v-acilis-gorsel" src={item.card_image} alt={item.card_alt} width="640" height="640" fetchPriority="high" />}
    </section>
    <section className="v-kabuk v-bolum" aria-labelledby="tasarimlar-baslik">
      <div className="v-bolum-baslik"><div><p className="v-etiket">Hazır tasarımlar</p><h2 id="tasarimlar-baslik">{item.short_title} için {designs.length} tasarım</h2></div></div>
      <Filtreler taban={'/koleksiyonlar/' + item.slug} params={query} alicilar={recipients} urunTipleri={products} segmentler={segments} />
      <TasarimIzgarasi tasarimlar={designs} bos={'Bu özel gün için seçiminize uyan hazır tasarım yok; stüdyoda ' + item.short_title.toLocaleLowerCase('tr-TR') + ' temasıyla kendiniz oluşturabilirsiniz.'} />
    </section>
  </>;
}
