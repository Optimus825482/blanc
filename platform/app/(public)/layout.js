import Script from 'next/script';
import { contact, instagram } from '../../lib/seo';
import { getSettings, whatsappLink } from '../../lib/settings';

export default async function PublicLayout({ children }) {
  const whatsapp = whatsappLink(await getSettings());
  return <div className="vitrin">
    <a className="skip-link" href="#icerik">İçeriğe geç</a>
    <div className="v-serit">Girne · Alsancak <span aria-hidden="true">✦</span> Çikolata ve hediye atölyesi</div>
    <header className="v-kabuk v-ust">
      <a className="v-marka" href="/"><img src="/assets/img/instagram/marka/beyza-blanc-profil.webp" width="38" height="38" alt="" />BEYZA <span className="v-marka-script">Blanc</span></a>
      <nav aria-label="Ana menü">
        <a href="/koleksiyonlar">Koleksiyonlar</a><a href="/hakkimizda">Atölye</a><a href="/kurumsal">Kurumsal</a>
      </nav>
      <a className="v-dugme v-dugme--cizgi" href="/studyo">Tasarım stüdyosu <span aria-hidden="true">↗</span></a>
    </header>
    <main id="icerik">{children}</main>
    <footer className="v-alt"><div className="v-kabuk v-alt-ic">
      <div><a className="v-marka" href="/">BEYZA <span className="v-marka-script">Blanc</span></a><p>Girne · Alsancak / Kuzey Kıbrıs</p></div>
      <nav aria-label="Alt menü"><a href="/hakkimizda">Atölye hakkında</a><a href="/iletisim">İletişim</a><a href={instagram}>Instagram</a>{whatsapp && <a href={whatsapp}>WhatsApp</a>}</nav>
      <a className="v-metin-link" href={contact}>Atölyeye yaz <span aria-hidden="true">↗</span></a>
    </div></footer>
    <Script src="/assets/js/reveal.js" strategy="afterInteractive" />
  </div>;
}
