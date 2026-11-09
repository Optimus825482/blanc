import Link from 'next/link';
import { getContent } from '../../lib/db';
import { getOccasions, getRecipients } from '../../lib/katalog-oku';
import { contact, instagram, pageMetadata, siteUrl } from '../../lib/seo';
import Cards from './cards';
import InstagramFeed from './instagram-feed';
import { getInstagram } from '../../lib/instagram';
import { deliveryBands, getSettings, hoursSchema, postalAddress } from '../../lib/settings';
import { getReviews, kisaAd } from '../../lib/yorum';
import './home.css';

export const revalidate = 60;
export async function generateMetadata() {
  const home = await getContent('home');
  return pageMetadata('Girne Alsancak’ta ' + home.title, home.body, '/', home.image);
}

const posts = [
  ['Dd_qwYWKdYV', 'Altın çikolata aranjmanı', 'nisan/altin-cikolata-aranjmani'],
  ['DfUupJkiL_s', 'İsme özel bebek hediyeliği', 'bebek/isme-ozel-pleksi-kapi-susu'],
  ['DeKCxa2KYvX', 'Gökhan Türk Motors çalışması', 'kurumsal/gokhan-turk-motors'],
];

export default async function Home() {
  const [home, about, corporate, occasions, recipients, feed, settings] = await Promise.all([
    getContent('home'), getContent('about'), getContent('corporate'), getOccasions(), getRecipients(), getInstagram(), getSettings()
  ]);
  const bantlar = deliveryBands(settings);
  const yorumlar = await getReviews(6); // yalnızca onaylananlar; boşsa bölüm görünmez
  // Vitrinde görseli olan ilk 6 özel gün; kişisel günler önce.
  const categories = occasions.filter((o) => o.card_image).sort((a, b) => (a.root === 'kurumsal') - (b.root === 'kurumsal')).slice(0, 6)
    .map((o) => ({ slug: o.slug, title: o.title, body: o.body, image: o.card_image, alt: o.card_alt, icon: o.icon, count: Number(o.design_count) }));
  const business = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Beyza Blanc',
    description: home.body, url: siteUrl || undefined,
    image: siteUrl ? new URL(home.image, siteUrl).href : undefined, sameAs: [instagram],
    address: postalAddress(settings),
    telephone: settings.contact_phone || undefined,
    email: settings.contact_email || undefined,
    hasMap: settings.maps_url || undefined,
    openingHours: hoursSchema(settings),
  };
  return <div className="bb-home">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, '\\u003c') }} />
    <section className="bb-cover" aria-labelledby="cover-title">
      <div className="v-kabuk bb-cover-grid">
        <div className="bb-cover-copy">
          <p className="bb-overline">Çikolata ve hediye atölyesi</p>
          <h1 id="cover-title">{home.title}</h1>
          <p className="bb-cover-intro">{home.body}</p>
          <div className="v-eylemler">
            <a className="bb-gold-button" href="#koleksiyonlar">Koleksiyonları keşfet <span aria-hidden="true">↘</span></a>
            <a className="v-metin-link" href="/studyo">Tasarım stüdyosunu aç <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <figure className="bb-cover-figure">
          <div className="bb-cover-photo"><img decoding="async" src={home.image} alt={home.alt} width="640" height="640" fetchPriority="high" /></div>
          <figcaption><span>BEYZA BLANC</span><span>ALSANCAK · GİRNE</span></figcaption>
        </figure>
      </div>
    </section>
    <nav className="bb-index v-kabuk" aria-label="Vitrin bölümleri">
      <a href="#koleksiyonlar"><small>01</small> Koleksiyonlar <span aria-hidden="true">↘</span></a>
      <a href="#tasarim"><small>02</small> Kişiselleştirme <span aria-hidden="true">↘</span></a>
      <a href="#kurumsal"><small>03</small> Kurumsal hediyeler <span aria-hidden="true">↘</span></a>
    </nav>
    <section className="v-kabuk bb-niyet" aria-labelledby="niyet-baslik">
      <p className="bb-overline" id="niyet-baslik">Bugün ne için geldiniz?</p>
      <div className="bb-niyet__secenekler">
        <Link href="/koleksiyonlar"><strong>Bir özel gün için hediye</strong><span>Söz, nişan, doğum günü, bebek… güne göre keşfedin</span></Link>
        <Link href="/koleksiyonlar?kime=es-sevgili"><strong>Birine göre seçmek</strong><span>{recipients.slice(0, 4).map((r) => r.short_title).join(', ')}…</span></Link>
        <Link href="/kurumsal"><strong>Kurumsal hediye</strong><span>Logo baskılı toplu kutular, ekip ve müşteri hediyeleri</span></Link>
        <Link href="/studyo"><strong>Kendi tasarımımı yapmak</strong><span>Stüdyoda isim, tarih ve renklerinizle canlı önizleme</span></Link>
      </div>
    </section>
    {bantlar.length > 0 && <section className="v-kabuk bb-teslim" aria-labelledby="teslim-baslik">
      <p className="bb-overline" id="teslim-baslik">Hazırlık süreleri</p>
      <div className="bb-teslim__bantlar">{bantlar.map((b) => <div key={b.title}><p className="bb-teslim__adet">{b.title}</p><p className="bb-teslim__sure">{b.text}</p></div>)}</div>
      {settings.last_order_note && <p className="bb-teslim__not">📅 {settings.last_order_note}</p>}
    </section>}
    <section className="v-kabuk v-bolum bb-collection" id="koleksiyonlar">
      <div className="v-bolum-baslik" data-reveal=""><div><p className="v-etiket">01 / Koleksiyonlar</p><h2>Kutlamanıza eşlik eden tasarımlar</h2><p>Nişan tepsilerinden isme özel bebek hediyelerine, atölyenin çalışmalarını keşfedin.</p></div>
        <Link className="v-metin-link" href="/koleksiyonlar">Tüm koleksiyonlar</Link></div>
      <Cards categories={categories} />
      {!categories.length && <p>Yeni koleksiyonlarımız hazırlanıyor.</p>}
    </section>
    {yorumlar.length > 0 && <section className="v-kabuk bb-yorumlar" aria-labelledby="yorumlar-baslik">
      <p className="v-etiket">Müşterilerimiz</p>
      <h2 id="yorumlar-baslik">Sizden gelenler</h2>
      <div className="bb-yorumlar__izgara">{yorumlar.map((y) => <figure key={y.id} className="bb-yorum">
        <p className="bb-yorum__puan" aria-label={y.rating + ' yıldız'}>{'★'.repeat(y.rating)}{'☆'.repeat(5 - y.rating)}</p>
        <blockquote>{y.text}</blockquote>
        <figcaption>{kisaAd(y.name)}{y.occasion_title ? ' · ' + y.occasion_title : ''}</figcaption>
      </figure>)}</div>
      <p><Link className="v-metin-link" href="/yorum">Siz de deneyiminizi yazın</Link></p>
    </section>}
    <section className="bb-process" id="tasarim" aria-labelledby="process-title">
      <div className="v-kabuk bb-process-grid">
        <div data-reveal="">
          <p className="bb-overline">02 / Kişiye özel</p>
          <h2 id="process-title">İlk fikirden son kurdeleye</h2>
          <a className="v-metin-link" href="/studyo">Stüdyoda tasarla <span aria-hidden="true">↗</span></a>
        </div>
        <ol>
          <li data-reveal=""><span aria-hidden="true">01</span><div><h3>Özel günü seçin</h3><p>Koleksiyonlara göz atın veya doğrudan stüdyoda başlayın.</p></div></li>
          <li data-reveal=""><span aria-hidden="true">02</span><div><h3>İmzanızı ekleyin</h3><p>İsim, tarih, renk ve kutu seçimlerinizi canlı önizlemede görün.</p></div></li>
          <li data-reveal=""><span aria-hidden="true">03</span><div><h3>Atölyeyle paylaşın</h3><p>Görseli indirip etkinlik tarihi ve adetle birlikte Instagram’dan iletin.</p></div></li>
        </ol>
      </div>
    </section>
    <section className="v-kabuk v-eslesme bb-atelier">
      <img decoding="async" data-reveal="" src={about.image} alt={about.alt} width="640" height="640" loading="lazy" />
      <div className="v-panel bb-prose" data-reveal=""><p className="v-etiket">Alsancak / Atölye</p>
        <h2>{about.title}</h2><p>{about.body}</p><Link className="v-dugme" href="/hakkimizda">Atölyeyi tanıyın</Link></div>
    </section>
    <section className="v-kabuk v-eslesme v-kurumsal bb-atelier" id="kurumsal">
      <div className="v-panel bb-prose" data-reveal=""><p className="v-etiket">03 / Kurumsal hediyeler</p>
        <h2>{corporate.title}</h2><p>{corporate.body}</p><Link className="v-dugme v-dugme--cizgi" href="/kurumsal">Kurumsal hediyeleri inceleyin</Link></div>
      <img decoding="async" data-reveal="" src={corporate.image} alt={corporate.alt} width="640" height="640" loading="lazy" />
    </section>
    <InstagramFeed feed={feed} fallback={posts.map(([id, title, image]) => ({
      id, caption: title, image: '/assets/img/instagram/' + image + '.webp',
      link: 'https://www.instagram.com/p/' + id + '/',
    }))} />
  </div>;
}
