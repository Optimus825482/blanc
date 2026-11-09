import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fiyatYaz, getDesign, getDesigns } from '../../../../lib/katalog-oku';
import { contact, pageMetadata, siteUrl } from '../../../../lib/seo';
import { TasarimIzgarasi } from '../../tasarim-karti';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const t = await getDesign((await params).slug);
  if (!t) return {};
  return pageMetadata(t.title + ' · ' + t.occasion_short, (t.summary || t.body || t.title).slice(0, 160), '/tasarim/' + t.slug, t.image || undefined);
}

export default async function Tasarim({ params }) {
  const t = await getDesign((await params).slug);
  if (!t) notFound();
  const benzerler = (await getDesigns({ occasion: t.occasion_slug })).filter((b) => b.slug !== t.slug).slice(0, 3);
  const studyo = '/studyo?tasarim=' + t.slug;
  const urun = {
    '@context': 'https://schema.org', '@type': 'Product', name: t.title, description: t.summary || t.body || undefined,
    image: siteUrl && t.image ? new URL(t.image, siteUrl).href : undefined, brand: { '@type': 'Brand', name: 'Beyza Blanc' },
    category: t.occasion_title,
    offers: t.starting_price !== null ? { '@type': 'Offer', priceCurrency: 'TRY', price: Number(t.starting_price), availability: 'https://schema.org/MadeToOrder', priceSpecification: { '@type': 'PriceSpecification', minPrice: Number(t.starting_price), priceCurrency: 'TRY' } } : undefined,
  };
  const ozellikler = [
    ['Özel gün', <Link key="g" href={'/koleksiyonlar/' + t.occasion_slug}>{t.occasion_icon} {t.occasion_title}</Link>],
    ['Ürün tipi', t.product_title + (t.size ? ' · ' + t.size : '')],
    ['Çikolata', t.chocolate_title || null],
    ['Hediye büyüklüğü', t.segment_title ? t.segment_title + (t.segment_body ? ' (' + t.segment_body + ')' : '') : null],
    ['Kime uygun', t.recipient_titles?.length ? t.recipient_titles.join(', ') : null],
    ['Kişiselleştirme', t.tags?.length ? t.tags.join(', ') : null],
  ].filter(([, v]) => v);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(urun).replace(/</g, '\\u003c') }} />
    <section className="v-kabuk v-bolum v-acilis bb-tasarim-detay" style={{ '--gun-vurgu': t.occasion_accent || '#B08D57' }}>
      <div className="bb-tasarim-detay__gorsel">
        {t.image ? <img src={t.image} alt={t.alt || t.title} width="640" height="640" fetchPriority="high" /> : <span aria-hidden="true">{t.occasion_icon}</span>}
        {(t.bestseller || t.is_new) && <span className="bb-tasarim__rozet">{t.bestseller ? 'Çok tercih edilen' : 'Yeni'}</span>}
      </div>
      <div className="bb-prose v-acilis-metin">
        <nav className="bb-kirinti" aria-label="Konum"><Link href="/koleksiyonlar">Koleksiyonlar</Link> / <Link href={'/koleksiyonlar/' + t.occasion_slug}>{t.occasion_short}</Link></nav>
        <h1>{t.title}</h1>
        {t.summary && <p className="bb-tasarim-detay__ozet">{t.summary}</p>}
        <p className="bb-tasarim-detay__fiyat">{t.starting_price !== null
          ? <><strong>{fiyatYaz(t.starting_price)}</strong>’den başlayan fiyatlarla · kesin teklif adet ve baskı detayına göre atölyeden</>
          : <>Fiyat, adet ve baskı detayına göre atölyeden teklif olarak iletilir.</>}</p>
        <dl className="bb-ozellikler">{ozellikler.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        {t.body && <p>{t.body}</p>}
        <div className="v-eylemler">
          <Link className="v-dugme" href={studyo}>Bu tasarımı kişiselleştir <span aria-hidden="true">↗</span></Link>
          <a className="v-metin-link" href={contact}>Atölyeye sor</a>
        </div>
        <p className="bb-gun__oneri">Stüdyoda isim, tarih, kurdele ve kart notunu ekleyip canlı önizlemeyi görürsünüz; özet ve görsel atölyeye tek mesajla gider.</p>
      </div>
    </section>
    {benzerler.length > 0 && <section className="v-kabuk v-bolum" aria-labelledby="benzer-baslik">
      <div className="v-bolum-baslik"><div><p className="v-etiket">{t.occasion_short} için</p><h2 id="benzer-baslik">Bunları da beğenebilirsiniz</h2></div>
        <Link className="v-metin-link" href={'/koleksiyonlar/' + t.occasion_slug}>Tüm {t.occasion_short.toLocaleLowerCase('tr-TR')} tasarımları</Link></div>
      <TasarimIzgarasi tasarimlar={benzerler} />
    </section>}
  </>;
}
