import Link from 'next/link';
import { getFaq } from '../../../lib/katalog-oku';
import { contact, pageMetadata } from '../../../lib/seo';

export const revalidate = 60;
export const metadata = pageMetadata('Sıkça Sorulan Sorular', 'Sipariş nasıl veriliyor, ne kadar sürede hazırlanıyor, bebek çikolatasına neler yazılabiliyor, teslimat ve kargo nasıl işliyor?', '/sss');

export default async function Sss() {
  const sorular = await getFaq();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: sorular.map((s) => ({ '@type': 'Question', name: s.question, acceptedAnswer: { '@type': 'Answer', text: s.answer } })),
  };
  return <section className="v-kabuk v-bolum bb-inner-page">
    {sorular.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
    <div className="bb-page-intro">
      <p className="v-etiket">Beyza Blanc · Girne Alsancak</p>
      <h1>Merak edilenler</h1>
      <p>Sipariş, hazırlık süresi, kişiselleştirme ve teslimat hakkında en sık sorulanlar. Cevabını bulamadığınız soru için atölyeye yazabilirsiniz.</p>
    </div>
    {sorular.length ? <div className="bb-sss">
      {sorular.map((s) => <details key={s.id} className="bb-sss__soru">
        <summary><h2>{s.question}</h2><span aria-hidden="true">+</span></summary>
        <div className="bb-prose"><p>{s.answer}</p></div>
      </details>)}
    </div> : <p className="bb-status" role="status">Sorular hazırlanıyor.</p>}
    <div className="v-eylemler bb-sss__eylem">
      <a className="v-dugme" href={contact}>Atölyeye sor <span aria-hidden="true">↗</span></a>
      <Link className="v-metin-link" href="/studyo">Tasarım stüdyosunu aç</Link>
    </div>
  </section>;
}
