import { contact, instagram, pageMetadata } from '../../../lib/seo';
import { getSettings, hoursRows, phoneLink, whatsappLink } from '../../../lib/settings';

export const dynamic = 'force-dynamic';
export const metadata = pageMetadata('İletişim · Girne Alsancak', 'Beyza Blanc atölyesine çikolata, özel gün hediyesi ve kurumsal tasarım talepleriniz için ulaşın.', '/iletisim');

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsapp = whatsappLink(settings, 'Merhaba Beyza Blanc, bir tasarım için bilgi almak istiyorum.');
  const phone = phoneLink(settings);
  const hours = hoursRows(settings);
  const address = [settings.address_street, [settings.address_locality, settings.address_region].filter(Boolean).join(' / '), settings.address_country].filter(Boolean);
  return <section className="v-kabuk v-bolum bb-contact">
    <div className="bb-prose">
      <p className="v-etiket">Girne · Alsancak</p><h1>Atölyeye ulaşın</h1>
      <p>Kutlama türünü, tarihi ve düşündüğünüz adedi yazın; size en kısa sürede dönelim. Tasarım stüdyosunda hazırladığınız görseli de mesajınıza ekleyebilirsiniz.</p>
      <div className="v-eylemler">
        {whatsapp && <a className="v-dugme" href={whatsapp}>WhatsApp’tan yazın</a>}
        <a className={whatsapp ? 'v-dugme v-dugme--cizgi' : 'v-dugme'} href={contact}>Instagram mesajı</a>
      </div>
    </div>
    <dl className="bb-contact-list">
      {address.length > 0 && <div><dt>Adres</dt><dd>{address.map(line => <span key={line}>{line}</span>)}
        {settings.maps_url && <a className="v-metin-link" href={settings.maps_url} rel="noopener">Yol tarifi al <span aria-hidden="true">↗</span></a>}</dd></div>}
      {phone && <div><dt>Telefon</dt><dd><a href={phone}>{settings.contact_phone}</a></dd></div>}
      {whatsapp && <div><dt>WhatsApp</dt><dd><a href={whatsapp}>{settings.contact_whatsapp}</a></dd></div>}
      {settings.contact_email && <div><dt>E-posta</dt><dd><a href={'mailto:' + settings.contact_email}>{settings.contact_email}</a></dd></div>}
      <div><dt>Instagram</dt><dd><a href={instagram}>@beyzablanc</a></dd></div>
      {hours.length > 0 && <div><dt>Çalışma saatleri</dt><dd>{hours.map(([day, time]) => <span key={day}><b>{day}</b> {time}</span>)}</dd></div>}
    </dl>
  </section>;
}
