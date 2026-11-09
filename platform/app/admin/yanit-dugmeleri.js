'use client';

import { useState, useSyncExternalStore } from 'react';

// Konum kökü yalnızca istemcide okunur; sunucuda boş kalır (yol göreli kalır).
const aboneligiYok = () => () => {};

// Panel: talep başına tek tık yanıt. Telefon/e-posta yalnızca kurumsal talepte bilinir (bireyselde toplanmaz);
// takip bağlantısı kopyalama her talepte vardır. Mesaj metni takip bağlantısını içerir.
export default function YanitDugmeleri({ code, takipYolu, telefon = '', eposta = '', firma = '', yetkili = '' }) {
  const kok = useSyncExternalStore(aboneligiYok, () => window.location.origin, () => '');
  const [bilgi, setBilgi] = useState('');

  const baglanti = kok + takipYolu;
  const metin = firma
    ? `Merhaba${yetkili ? ' ' + yetkili : ''}, ${firma} için hazırladığımız kurumsal teklif (${code}) hakkında yazıyoruz. Takip sayfanız: ${baglanti}`
    : `Merhaba, Beyza Blanc teklif talebiniz (${code}) hakkında yazıyoruz. Takip sayfanız: ${baglanti}`;
  const rakam = String(telefon).replace(/\D/g, '');
  const mailKonu = encodeURIComponent('Beyza Blanc teklifiniz · ' + code);

  async function kopyala() {
    try {
      await navigator.clipboard.writeText(baglanti);
      setBilgi('Takip bağlantısı kopyalandı.');
    } catch {
      setBilgi('Kopyalanamadı; bağlantıyı elle seçin.');
    }
  }

  return <div className="bb-yanit">
    {rakam.length >= 10 && <a className="btn btn--cizgili" href={'https://wa.me/' + rakam + '?text=' + encodeURIComponent(metin)} target="_blank" rel="noopener">WhatsApp ile yanıtla</a>}
    {eposta.includes('@') && <a className="btn btn--cizgili" href={'mailto:' + eposta + '?subject=' + mailKonu + '&body=' + encodeURIComponent(metin)}>E-posta ile yanıtla</a>}
    <button className="btn btn--cizgili" type="button" onClick={kopyala}>Takip bağlantısını kopyala</button>
    <span className="bb-yanit__bilgi" aria-live="polite">{bilgi}</span>
  </div>;
}
