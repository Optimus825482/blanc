import Link from 'next/link';
import { KOKLER, getOccasions, getProductTypes, getRecipients } from '../../lib/katalog-oku';
import MenuDavranisi from './menu-davranisi';

// Üst menü: Özel güne göre (3 kök sütun), Kime göre, Ürün tipi — hepsi tablolardan.
// <details> tabanlı: masaüstünde açılır panel, mobilde akordeon; JS olmadan da çalışır.
function Acilir({ ad, children }) {
  return <details className="bb-menu__oge">
    <summary>{ad} <span aria-hidden="true">▾</span></summary>
    <div className="bb-menu__panel">{children}</div>
  </details>;
}

export default async function MegaMenu() {
  const [occasions, recipients, products] = await Promise.all([getOccasions(), getRecipients(), getProductTypes()]);
  return <nav className="bb-menu" aria-label="Ana menü">
    <MenuDavranisi />
    <Acilir ad="Özel güne göre">
      <div className="bb-menu__sutunlar">
        {KOKLER.map(([kok, kokAdi]) => {
          const liste = occasions.filter((o) => o.root === kok);
          return liste.length ? <div key={kok}><h3>{kokAdi}</h3><ul>{liste.map((o) => <li key={o.slug}><Link href={'/koleksiyonlar/' + o.slug}>{o.icon} {o.short_title}</Link></li>)}</ul></div> : null;
        })}
      </div>
      <Link className="bb-menu__tumu" href="/koleksiyonlar">Tüm koleksiyonlar →</Link>
    </Acilir>
    <Acilir ad="Kime göre">
      <ul className="bb-menu__liste">{recipients.map((r) => <li key={r.slug}><Link href={'/koleksiyonlar?kime=' + r.slug}>{r.title}</Link></li>)}</ul>
    </Acilir>
    <Acilir ad="Ürün tipi">
      <ul className="bb-menu__liste">{products.map((p) => <li key={p.slug}><Link href={'/koleksiyonlar?urun=' + p.slug}><strong>{p.title}</strong>{p.body && <small>{p.body}</small>}</Link></li>)}</ul>
    </Acilir>
    <Link href="/kurumsal">Kurumsal</Link>
    <Link href="/hakkimizda">Atölye</Link>
  </nav>;
}
