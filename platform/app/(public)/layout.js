import Link from 'next/link';
import Script from 'next/script';
import { contact, instagram } from '../../lib/seo';
import { announcement, getSettings, whatsappLink } from '../../lib/settings';
import MegaMenu from './mega-menu';

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  const whatsapp = whatsappLink(settings);
  const duyuru = announcement(settings);
  return <div className="vitrin">
    <a className="skip-link" href="#icerik">İçeriğe geç</a>
    <div className="v-serit">Girne · Alsancak <span aria-hidden="true">✦</span> Çikolata ve hediye atölyesi</div>
    {duyuru && <div className="bb-duyuru" role="region" aria-label="Duyuru"><div className="v-kabuk bb-duyuru__ic"><span>📅 {duyuru.text}</span>{duyuru.link && <a href={duyuru.link}>{duyuru.linkText}</a>}</div></div>}
    <header className="v-kabuk v-ust">
      <Link className="v-marka" href="/"><img decoding="async" src="/assets/img/instagram/marka/beyza-blanc-profil.webp" width="38" height="38" alt="" />BEYZA <span className="v-marka-script">Blanc</span></Link>
      <MegaMenu />
      <a className="v-dugme v-dugme--cizgi" href="/studyo">Tasarım stüdyosu <span aria-hidden="true">↗</span></a>
    </header>
    <main id="icerik">{children}</main>
    <footer className="v-alt"><div className="v-kabuk v-alt-ic">
      <div><Link className="v-marka" href="/">BEYZA <span className="v-marka-script">Blanc</span></Link><p>Girne · Alsancak / Kuzey Kıbrıs</p></div>
      <nav aria-label="Alt menü"><Link href="/hakkimizda">Atölye hakkında</Link><Link href="/iletisim">İletişim</Link><Link href="/sss">Sık sorulanlar</Link><a href={instagram}>Instagram</a>{whatsapp && <a href={whatsapp}>WhatsApp</a>}</nav>
      <a className="v-metin-link" href={contact}>Atölyeye yaz <span aria-hidden="true">↗</span></a>
    </div></footer>
    <Script src="/assets/js/reveal.js" strategy="afterInteractive" />
  </div>;
}
