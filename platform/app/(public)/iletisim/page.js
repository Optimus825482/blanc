import { contact, instagram, pageMetadata } from '../../../lib/seo';

export const metadata = pageMetadata('İletişim · Girne Alsancak', 'Beyza Blanc atölyesine çikolata, özel gün hediyesi ve kurumsal tasarım talepleriniz için ulaşın.', '/iletisim');

export default function ContactPage() {
  return <section className="v-kabuk v-bolum"><div className="bb-prose">
    <p className="v-etiket">Girne · Alsancak</p><h1>Atölyeye ulaşın</h1>
    <p>Tasarım talebiniz için kutlama türünü, tarihi ve düşündüğünüz adedi Instagram üzerinden paylaşabilirsiniz.</p>
    <div className="v-eylemler"><a className="v-dugme" href={contact}>Instagram mesajı</a><a className="v-metin-link" href={instagram}>Beyza Blanc profili</a></div>
  </div></section>;
}
