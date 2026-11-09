import { DURUMLAR, getQuotes, tarihYaz } from '../../lib/teklif';
import { saveQuote } from './actions';

// Panel: teklif talepleri listesi; durum ve not satır içi formla güncellenir.
export default async function Teklifler() {
  const teklifler = await getQuotes();
  const yeni = teklifler.filter((t) => t.status === 'new').length;
  return <>
    <h2 id="teklifler">Teklif talepleri {yeni ? <small>({yeni} yeni)</small> : null}</h2>
    <p>Stüdyodan gönderilen talepler. Durumu güncellediğinizde müşteri takip sayfasında görür.</p>
    {!teklifler.length && <p className="bb-status">Henüz talep yok.</p>}
    {teklifler.map((t) => <details key={t.id} className={t.status === 'new' ? 'bb-teklif-yeni' : ''}>
      <summary>{t.code} · {t.kind === 'corporate' ? 'Kurumsal · ' : ''}{t.product_title || '—'}{t.size ? ' ' + t.size : ''} · {t.quantity} adet · {t.occasion_title || ''} · {DURUMLAR.find(([d]) => d === t.status)?.[1]} · {tarihYaz(t.created_at)}</summary>
      <form action={saveQuote}>
        <input type="hidden" name="id" value={t.id} />
        <div className="bb-teklif-satir">
          {t.image_id && <img src={'/admin/media/' + t.image_id} alt="" width="144" height="144" loading="lazy" />}
          <div>
            <p><strong>Kanal:</strong> {t.contact_channel || 'seçilmedi'} · <strong>Teslim:</strong> {t.delivery_method || '—'} {t.delivery_date ? tarihYaz(t.delivery_date) : ''} · <strong>Alıcı:</strong> {t.recipient_name || '—'} · <strong>Tahmin:</strong> {t.estimate !== null ? Number(t.estimate).toLocaleString('tr-TR') + ' TL' : '—'}</p>
            <a href={'/teklif/' + t.code} target="_blank" rel="noopener">Müşterinin gördüğü takip sayfası ↗</a>
            <details><summary>Özet metni</summary><pre>{t.summary}</pre></details>
          </div>
        </div>
        <label htmlFor={'durum-' + t.id}>Durum
          <select id={'durum-' + t.id} name="status" defaultValue={t.status}>{DURUMLAR.map(([d, ad]) => <option key={d} value={d}>{ad}</option>)}</select>
        </label>
        <label htmlFor={'not-' + t.id}>Panel notu (müşteri görmez)<textarea id={'not-' + t.id} name="admin_note" defaultValue={t.admin_note} maxLength="2000" /></label>
        <button className="btn btn--birincil" type="submit">Kaydet</button>
      </form>
    </details>)}
  </>;
}
