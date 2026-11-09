import { DURUMLAR, getQuotes, takipYolu, tarihYaz } from '../../lib/teklif';
import { saveQuote } from './actions';
import YanitDugmeleri from './yanit-dugmeleri';

// Panel: teklif talepleri listesi; durum ve not satır içi formla güncellenir.
export default async function Teklifler() {
  const hepsi = await getQuotes();
  return <>
    <Liste id="kurumsal-talepler" baslik="Kurumsal talepler" aciklama="Kurumsal sayfadaki formdan ve 50+ adetli stüdyo tasarımlarından gelen talepler. Firma bilgileri ve logo kayıtta."
      teklifler={hepsi.filter((t) => t.kind === 'corporate')} />
    <Liste id="teklifler" baslik="Bireysel teklif talepleri" aciklama="Stüdyodan gönderilen tasarımlar. Durumu güncellediğinizde müşteri takip sayfasında görür."
      teklifler={hepsi.filter((t) => t.kind !== 'corporate')} />
  </>;
}

function Liste({ id, baslik, aciklama, teklifler }) {
  const yeni = teklifler.filter((t) => t.status === 'new').length;
  return <>
    <h2 id={id}>{baslik} {yeni ? <small>({yeni} yeni)</small> : null}</h2>
    <p>{aciklama}</p>
    {!teklifler.length && <p className="bb-status">Henüz talep yok.</p>}
    {teklifler.map((t) => <details key={t.id} className={t.status === 'new' ? 'bb-teklif-yeni' : ''}>
      <summary>{t.code} · {t.company?.firma ? t.company.firma + ' · ' : ''}{t.product_title || (t.kind === 'corporate' ? 'Atölye önerisi' : '—')}{t.size ? ' ' + t.size : ''} · {t.quantity} adet · {t.occasion_title || ''} · {DURUMLAR.find(([d]) => d === t.status)?.[1]} · {tarihYaz(t.created_at)}</summary>
      <form action={saveQuote}>
        <input type="hidden" name="id" value={t.id} />
        <div className="bb-teklif-satir">
          {t.image_id && <img src={'/admin/media/' + t.image_id} alt="" width="144" height="144" loading="lazy" />}
          {t.logo_id && <img src={'/admin/media/' + t.logo_id} alt="Logo" width="144" height="144" loading="lazy" />}
          <div>
            {t.company?.firma && <p><strong>{t.company.firma}</strong> · {t.company.yetkili} · <a href={'mailto:' + t.company.eposta}>{t.company.eposta}</a>{t.company.telefon ? ' · ' + t.company.telefon : ''}<br />{t.company.kademe} · Kişi başı {t.company.butce}{t.company.numune ? ' · Numune istiyor' : ''}</p>}
            <p><strong>Kanal:</strong> {t.contact_channel || 'seçilmedi'} · <strong>Teslim:</strong> {t.delivery_method || '—'} {t.delivery_date ? tarihYaz(t.delivery_date) : ''} · <strong>Alıcı:</strong> {t.recipient_name || '—'} · <strong>Tahmin:</strong> {t.estimate !== null ? Number(t.estimate).toLocaleString('tr-TR') + ' TL' : '—'}</p>
            <a href={takipYolu(t.code, t.token)} target="_blank" rel="noopener">Müşterinin gördüğü takip sayfası ↗</a>
            <YanitDugmeleri code={t.code} takipYolu={takipYolu(t.code, t.token)} telefon={t.company?.telefon} eposta={t.company?.eposta} firma={t.company?.firma} yetkili={t.company?.yetkili} />
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
