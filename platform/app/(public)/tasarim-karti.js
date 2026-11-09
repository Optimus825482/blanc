import Link from 'next/link';
import { fiyatYaz } from '../../lib/katalog-oku';

// Hazır tasarım kartı: görsel, rozetler, ürün tipi, "… TL'den başlayan" ve stüdyoya bağlantı.
export default function TasarimKarti({ tasarim }) {
  const t = tasarim;
  return <article className="bb-tasarim" data-reveal="">
    <Link className="bb-tasarim__gorsel" href={'/tasarim/' + t.slug} aria-label={t.title + ' detayı'}>
      {t.image ? <img src={t.image} alt={t.alt || t.title} width="640" height="640" loading="lazy" decoding="async" /> : <span aria-hidden="true">{t.occasion_icon}</span>}
      {(t.bestseller || t.is_new) && <span className="bb-tasarim__rozet">{t.bestseller ? 'Çok tercih edilen' : 'Yeni'}</span>}
    </Link>
    <div className="bb-tasarim__metin">
      <p className="v-etiket">{t.product_title}{t.size ? ' · ' + t.size : ''}</p>
      <h3><Link href={'/tasarim/' + t.slug}>{t.title}</Link></h3>
      {t.summary && <p>{t.summary}</p>}
      {t.tags?.length > 0 && <ul className="bb-tasarim__etiketler">{t.tags.slice(0, 3).map((e) => <li key={e}>{e}</li>)}</ul>}
      <div className="bb-tasarim__alt">
        <span className="bb-tasarim__fiyat">{t.starting_price !== null ? fiyatYaz(t.starting_price) + '’den başlayan' : (t.segment_title || 'Fiyat atölyeden')}</span>
        <Link className="v-metin-link" href={'/studyo?tasarim=' + t.slug}>Bu tasarımla başla <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  </article>;
}

export function TasarimIzgarasi({ tasarimlar, bos = 'Bu seçime uyan hazır tasarım henüz yok. Stüdyoda kendi tasarımınızı oluşturabilirsiniz.' }) {
  if (!tasarimlar.length) return <p className="bb-status" role="status">{bos} <Link href="/studyo">Stüdyoyu aç</Link></p>;
  return <div className="bb-tasarimlar">{tasarimlar.map((t) => <TasarimKarti key={t.slug} tasarim={t} />)}</div>;
}
