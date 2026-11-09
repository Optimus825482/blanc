import { getSettings } from '../../lib/settings';
import { siteUrl } from '../../lib/seo';
import { saveSettings } from './actions';

// Arama motorları ve analitik: doğrulama etiketleri ve GA4 kimliği panelden; etiketler vitrin <head>'ine yazılır.
export default async function Arama() {
  const s = await getSettings();
  const kok = siteUrl || 'https://ALANADINIZ';
  return <>
    <h2>Arama motoru kayıtları ve analitik</h2>
    <p>Aşağıdaki değerler kaydedilince sitenin tüm sayfalarına gerekli etiketler otomatik eklenir; kod değişikliği gerekmez. Site haritası: <code>{kok}/sitemap.xml</code></p>
    <form action={saveSettings}>
      <input type="hidden" name="bolum" value="arama" />
      <label htmlFor="a-ga">Google Analytics 4 ölçüm kimliği<input id="a-ga" name="ga_measurement_id" defaultValue={s.ga_measurement_id} maxLength="20" placeholder="G-XXXXXXXXXX" pattern="G-[A-Z0-9]{4,16}" /></label>
      <small>analytics.google.com → Yönetici → Veri akışları → Web akışı → “Ölçüm Kimliği”. Boşsa Google Analytics yüklenmez; paneldeki gösterge yine çalışır.</small>
      <label htmlFor="a-google">Google Search Console doğrulama kodu<input id="a-google" name="google_site_verification" defaultValue={s.google_site_verification} maxLength="120" placeholder="HTML etiketi yöntemindeki content değeri" /></label>
      <small>search.google.com/search-console → Mülk ekle (URL öneki: {kok}) → “HTML etiketi” → <code>content=&quot;…&quot;</code> içindeki değeri yapıştırın. Doğruladıktan sonra aynı yerden site haritasını gönderin.</small>
      <label htmlFor="a-bing">Bing Webmaster doğrulama kodu<input id="a-bing" name="bing_site_verification" defaultValue={s.bing_site_verification} maxLength="120" placeholder="msvalidate.01 değeri" /></label>
      <small>bing.com/webmasters → Site ekle → “HTML Meta etiketi” → <code>msvalidate.01</code> değeri. Search Console’dan içe aktarma seçeneği de vardır.</small>
      <label htmlFor="a-yandex">Yandex Webmaster doğrulama kodu<input id="a-yandex" name="yandex_verification" defaultValue={s.yandex_verification} maxLength="120" placeholder="yandex-verification değeri" /></label>
      <small>webmaster.yandex.com → Site ekle → “Meta etiketi” → <code>yandex-verification</code> değeri.</small>
      <button className="btn btn--birincil" type="submit">Kaydet</button>
    </form>
    <h2>Kontrol listesi</h2>
    <ol className="bb-adim-listesi">
      <li>Üstteki kodları kaydedin ve ilgili hizmette “Doğrula”ya basın (etiket anında yayında).</li>
      <li>Google Search Console ve Bing’de site haritası olarak <code>{kok}/sitemap.xml</code> gönderin; Yandex’te “Site haritası dosyaları” bölümüne ekleyin.</li>
      <li>Google Business Profile’da (işletme kaydı) web sitesi alanına {kok} yazın; İletişim sayfasındaki adres ve saatlerle aynı olsun.</li>
      <li>Google Analytics’te “Geliştirilmiş ölçüm” açık kalsın; stüdyo gönderimleri ve talepler paneldeki göstergede zaten sayılır.</li>
    </ol>
  </>;
}
