'use client';
import { useEffect, useRef, useState } from 'react';

// Baskı alanı çizici: boş ürün fotoğrafının üstünde dikdörtgeni sürükleyip köşesinden boyutlandırarak
// yazının/logonun oturacağı bölge seçilir. Değerler yüzde olarak gizli olmayan sayı alanlarına yazılır
// (klavyeyle de düzenlenebilir); aksiyon bunları 0–1 oranına çevirir. Fotoğraf yoksa yalnızca sayı alanları.
const VARSAYILAN = { kutu: { x: 9, y: 15, w: 82, h: 70 }, bar: { x: 19, y: 33, w: 62, h: 30 }, tepsi: { x: 13, y: 20, w: 74, h: 55 } };
const yuzde = (v) => Math.round(v * 1000) / 10;
const sinirla = (v, en, cok) => Math.min(Math.max(v, en), cok);

export default function BaskiAlani({ id, gorsel, deger, cizim }) {
  const dolu = deger && typeof deger.w === 'number' && deger.w > 0;
  const [alan, setAlan] = useState(dolu ? { x: yuzde(deger.x), y: yuzde(deger.y), w: yuzde(deger.w), h: yuzde(deger.h) } : VARSAYILAN[cizim] || VARSAYILAN.kutu);
  const [bos, setBos] = useState(!dolu);
  const kutuRef = useRef(null);
  const surukle = useRef(null);

  useEffect(() => {
    if (!surukle.current) return undefined;
    const hareket = (e) => {
      const s = surukle.current;
      if (!s) return;
      const r = kutuRef.current.getBoundingClientRect();
      const dx = ((e.clientX - s.x0) / r.width) * 100;
      const dy = ((e.clientY - s.y0) / r.height) * 100;
      setAlan((a) => s.mod === 'tasi'
        ? { ...a, x: sinirla(s.alan.x + dx, 0, 100 - a.w), y: sinirla(s.alan.y + dy, 0, 100 - a.h) }
        : { ...a, w: sinirla(s.alan.w + dx, 5, 100 - a.x), h: sinirla(s.alan.h + dy, 5, 100 - a.y) });
    };
    const birak = () => { surukle.current = null; };
    window.addEventListener('pointermove', hareket);
    window.addEventListener('pointerup', birak);
    return () => { window.removeEventListener('pointermove', hareket); window.removeEventListener('pointerup', birak); };
  });

  const basla = (mod) => (e) => {
    e.preventDefault();
    setBos(false);
    surukle.current = { mod, x0: e.clientX, y0: e.clientY, alan: { ...alan } };
    // useEffect bağımlılığı yok; dinleyiciler her render'da yeniden bağlanır, ilk hareketi kaçırmamak için tetikle
    setAlan((a) => ({ ...a }));
  };
  const sayi = (ad) => (e) => { setBos(false); setAlan((a) => ({ ...a, [ad]: sinirla(Number(e.target.value) || 0, 0, 100) })); };
  const deg = (ad) => (bos ? '' : String(Math.round(alan[ad] * 10) / 10));

  return <fieldset className="bb-baski">
    <legend>Baskı alanı (yazı ve logonun oturacağı bölge)</legend>
    {gorsel ? <div className="bb-baski__sahne" ref={kutuRef}>
      <img src={gorsel} alt="" draggable="false" />
      <div className="bb-baski__kutu" style={{ left: alan.x + '%', top: alan.y + '%', width: alan.w + '%', height: alan.h + '%', opacity: bos ? 0.55 : 1 }}
        onPointerDown={basla('tasi')} role="presentation">
        <span className="bb-baski__tutamac" onPointerDown={(e) => { e.stopPropagation(); basla('boyut')(e); }} role="presentation" />
      </div>
    </div> : <p className="kucuk">Önce boş ürün fotoğrafını yükleyip kaydedin; sonra alanı fotoğraf üstünde sürükleyerek seçebilirsiniz.</p>}
    <div className="bb-baski__sayilar">
      {[['x', 'Sol %'], ['y', 'Üst %'], ['w', 'Genişlik %'], ['h', 'Yükseklik %']].map(([ad, etiket]) => <label key={ad} htmlFor={id + '-' + ad}>{etiket}
        <input id={id + '-' + ad} name={'alan_' + ad} type="number" inputMode="decimal" min="0" max="100" step="0.1" value={deg(ad)} onChange={sayi(ad)} placeholder="varsayılan" />
      </label>)}
      {!bos && <button type="button" className="btn btn--cizgili btn--kucuk" onClick={() => setBos(true)}>Varsayılana bırak</button>}
    </div>
    <small>{bos ? 'Boş: çizim tipine göre varsayılan alan kullanılır.' : 'Dikdörtgeni sürükleyin, sağ alt köşesinden boyutlandırın.'}</small>
  </fieldset>;
}
