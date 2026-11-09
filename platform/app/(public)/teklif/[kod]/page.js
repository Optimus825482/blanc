import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { contact } from '../../../../lib/seo';
import { getSettings, whatsappLink } from '../../../../lib/settings';
import { DURUMLAR, getQuote, sorguIzinli, tarihYaz } from '../../../../lib/teklif';
import { fiyatYaz } from '../../../../lib/katalog-oku';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Teklif takibi', robots: { index: false, follow: false } };

// Takip sayfası: kod + 128 bitlik anahtar (?t=) birlikte gerekir; kod tek başına yalnızca okunur referanstır.
export default async function Teklif({ params, searchParams }) {
  const [{ kod }, { t, yeni }, basliklar] = await Promise.all([params, searchParams, headers()]);
  const istemci = (basliklar.get('x-forwarded-for') || '').split(',').pop().trim() || basliklar.get('x-real-ip') || '';
  if (!sorguIzinli('takip|' + istemci)) return <section className="v-kabuk v-bolum bb-inner-page"><div className="bb-page-intro"><h1>Çok sık istek</h1><p>Lütfen bir dakika sonra yeniden deneyin.</p></div></section>;
  const [q, settings] = await Promise.all([getQuote(kod.toUpperCase(), typeof t === 'string' ? t : ''), getSettings()]);
  if (!q) notFound();
  const adim = Math.max(0, DURUMLAR.findIndex(([d]) => d === q.status));
  const iptal = q.status === 'cancelled';
  const kurumsal = q.kind === 'corporate';
  const f = q.company || {};
  const mesaj = kurumsal
    ? 'Merhaba Beyza Blanc, ' + q.code + ' kodlu kurumsal talebimiz (' + (f.firma || '') + ') hakkında yazıyorum.\n' + (q.summary || '')
    : 'Merhaba Beyza Blanc, ' + q.code + ' kodlu tasarımım hakkında yazıyorum.';
  const wa = whatsappLink(settings, mesaj);
  return <section className="v-kabuk v-bolum bb-inner-page bb-teklif">
    <div className="bb-page-intro">
      <p className="v-etiket">{kurumsal ? 'Kurumsal teklif takibi' : 'Teklif takibi'}</p>
      <h1>{q.code}</h1>
      {yeni === '1' && <p className="bb-status" role="status">Talebiniz kaydedildi. Bu sayfanın bağlantısını saklayın; durum değiştikçe burada görünür.</p>}
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
          {kurumsal ? <>
            <div><dt>Firma</dt><dd>{f.firma}</dd></div>
            <div><dt>Yetkili</dt><dd>{f.yetkili}</dd></div>
            {q.occasion_title && <div><dt>Vesile</dt><dd>{q.occasion_icon} {q.occasion_title}</dd></div>}
            <div><dt>Ürün</dt><dd>{q.product_title || 'Atölye önerisi'}</dd></div>
            <div><dt>Adet</dt><dd>{f.kademe}</dd></div>
            <div><dt>Kişi başı bütçe</dt><dd>{f.butce}</dd></div>
            {f.numune && <div><dt>Numune</dt><dd>İsteniyor</dd></div>}
          </> : <>
            <div><dt>Tasarım</dt><dd>{q.design_title || 'Stüdyo tasarımı'}</dd></div>
            <div><dt>Özel gün</dt><dd>{q.occasion_icon} {q.occasion_title || '—'}</dd></div>
            <div><dt>Ürün</dt><dd>{q.product_title || '—'}{q.size ? ' · ' + q.size : ''}</dd></div>
            <div><dt>Adet</dt><dd>{q.quantity}</dd></div>
            {q.recipient_name && <div><dt>Alıcı</dt><dd>{q.recipient_name}</dd></div>}
          </>}
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
      {q.image_id ? <img className="bb-detail-image" src={'/media/' + q.image_id} alt="Tasarım önizlemesi" width="640" height="640" />
        : q.logo_id ? <img className="bb-detail-image bb-logo" src={'/media/' + q.logo_id} alt={(f.firma || '') + ' logosu'} width="640" height="640" /> : null}
    </div>
  </section>;
}
