import Link from 'next/link';

// URL tabanlı filtre çipleri: her çip bir bağlantı; seçili olan vurgulanır, tekrar tıklanınca kalkar.
function Grup({ baslik, anahtar, secenekler, secili, taban, params }) {
  const url = (deger) => {
    const p = new URLSearchParams(params);
    if (deger && deger !== secili) p.set(anahtar, deger); else p.delete(anahtar);
    const q = p.toString();
    return taban + (q ? '?' + q : '');
  };
  return <div className="bb-filtre-grup">
    <span className="bb-filtre-grup__baslik">{baslik}</span>
    <ul>
      <li><Link href={url(null)} aria-current={!secili ? 'true' : undefined}>Tümü</Link></li>
      {secenekler.map((s) => <li key={s.slug}><Link href={url(s.slug)} aria-current={secili === s.slug ? 'true' : undefined}>{s.short_title || s.title}</Link></li>)}
    </ul>
  </div>;
}

export default function Filtreler({ taban, params, alicilar, urunTipleri, segmentler }) {
  const secili = { kime: params.kime, urun: params.urun, segment: params.segment };
  const temiz = Object.fromEntries(Object.entries(secili).filter(([, v]) => v));
  return <nav className="bb-filtreler" aria-label="Tasarım filtreleri">
    <Grup baslik="Kime göre" anahtar="kime" secenekler={alicilar} secili={secili.kime} taban={taban} params={temiz} />
    <Grup baslik="Ürün tipi" anahtar="urun" secenekler={urunTipleri} secili={secili.urun} taban={taban} params={temiz} />
    <Grup baslik="Hediye büyüklüğü" anahtar="segment" secenekler={segmentler} secili={secili.segment} taban={taban} params={temiz} />
  </nav>;
}
