import Link from 'next/link';
import { notFound } from 'next/navigation';
import { contact } from '../../../../lib/seo';
import { getSettings, whatsappLink } from '../../../../lib/settings';
import { DURUMLAR, getQuote, tarihYaz } from '../../../../lib/teklif';
import { fiyatYaz } from '../../../../lib/katalog-oku';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Teklif takibi', robots: { index: false, follow: false } };

// Takip sayfası: kod bilen herkes görür (kod tahmin edilemez); kişisel veri yalnızca alıcı adı.
export default async function Teklif({ params }) {
  const { kod } = await params;
  const [q, settings] = await Promise.all([getQuote(kod.toUpperCase()), getSettings()]);
  if (!q) notFound();
  const adim = Math.max(0, DURUMLAR.findIndex(([d]) => d === q.status));
  const iptal = q.status === 'cancelled';
  const mesaj = 'Merhaba Beyza Blanc, ' + q.code + ' kodlu tasarımım hakkında yazıyorum.';
  const wa = whatsappLink(settings, mesaj);
  return <section className="v-kabuk v-bolum bb-inner-page bb-teklif">
    <div className="bb-page-intro">
      <p className="v-etiket">Teklif takibi</p>
      <h1>{q.code}</h1>
      <p>{DURUMLAR[adim][2]} Bu kodu atölyeyle yazışırken belirtmeniz yeterli.</p>
    </div>
    <div className="bb-teklif__izgara">
      <div>
        <ol className="bb-adimlar" aria-label="Talep durumu">
          {DURUMLAR.filter(([d]) => d !== 'cancelled').map(([d, ad], i) => <li key={d} aria-current={i === adim && !iptal ? 'step' : undefined} className={i < adim && !iptal ? 'bb-adimlar__tamam' : ''}>
            <span aria-hidden="true">{i < adim && !iptal ? '✓' : i + 1}</span>{ad}
          </li>)}
        </ol>
        {iptal && <p className="bb-status" role="status">Bu talep iptal edildi.</p>}
        <dl className="bb-ozellikler">
          <div><dt>Tasarım</dt><dd>{q.design_title || 'Stüdyo tasarımı'}</dd></div>
          <div><dt>Özel gün</dt><dd>{q.occasion_icon} {q.occasion_title || '—'}</dd></div>
          <div><dt>Ürün</dt><dd>{q.product_title || '—'}{q.size ? ' · ' + q.size : ''}</dd></div>
          <div><dt>Adet</dt><dd>{q.quantity}</dd></div>
          {q.recipient_name && <div><dt>Alıcı</dt><dd>{q.recipient_name}</dd></div>}
          {q.delivery_date && <div><dt>Hedef teslim</dt><dd>{tarihYaz(q.delivery_date)}</dd></div>}
          {q.estimate !== null && <div><dt>Sitedeki tahmin</dt><dd>{fiyatYaz(q.estimate)} (kesin teklif atölyeden)</dd></div>}
          <div><dt>Talep tarihi</dt><dd>{tarihYaz(q.created_at)}</dd></div>
        </dl>
        <div className="v-eylemler">
          {wa && <a className="v-dugme" href={wa}>WhatsApp’tan yaz</a>}
          <a className={wa ? 'v-metin-link' : 'v-dugme'} href={contact}>Instagram’dan yaz <span aria-hidden="true">↗</span></a>
          <Link className="v-metin-link" href="/studyo">Yeni tasarım</Link>
        </div>
        {q.summary && <details className="bb-teklif__ozet"><summary>Gönderilen özet</summary><pre>{q.summary}</pre></details>}
      </div>
      {q.image_id && <img className="bb-detail-image" src={'/media/' + q.image_id} alt="Tasarım önizlemesi" width="640" height="640" />}
    </div>
  </section>;
}
