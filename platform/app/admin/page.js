import Link from 'next/link';
import { isAdmin } from '../../lib/auth';
import { query } from '../../lib/db';
import { connectInstagram, disconnectInstagram, login, logout, save, saveSettings } from './actions';
import { getSettings } from '../../lib/settings';
import { getInstagram } from '../../lib/instagram';
import KatalogBolumleri from './katalog';
import Teklifler from './teklifler';

export const metadata = { title: 'Yönetim', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const contentNames = { home: 'Ana sayfa', about: 'Hakkımızda', corporate: 'Kurumsal hediyeler' };
const messages = {
  giris: 'Giriş yapılamadı. Parolanızı kontrol edin.',
  limit: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.',
  gecersiz: 'Değişiklik kaydedilemedi. Alanları, kategori adresinin benzersiz olduğunu ve görsel biçimini kontrol edin.',
  kaydedildi: 'Değişiklik kaydedildi.',
  silindi: 'Kayıt silindi.',
  bagli: 'Bu kayıt başka kayıtlar tarafından kullanıldığı için silinemedi. Önce ona bağlı tasarımları değiştirin.',
  'meta-bagli': 'Instagram hesabı doğrulandı ve bağlandı.',
  'meta-kaldirildi': 'Instagram bağlantısı kaldırıldı.',
  'meta-hata': 'Hesap doğrulanamadı. Beyza Blanc için Instagram Login erişim anahtarını ve izinlerini kontrol edin.',
};

function Editor({ item, category = false, isNew = false }) {
  const key = item?.key || item?.slug;
  const prefix = isNew ? 'new-category' : (category ? 'category-' : 'content-') + key;
  return <form action={save}>
    <input type="hidden" name="kind" value={category ? 'category' : 'content'} />
    {isNew ? <>
      <input type="hidden" name="new" value="1" />
      <label htmlFor={prefix + '-key'}>Kategori adresi
        <input id={prefix + '-key'} name="key" placeholder="ornegin-soz-nisan" required maxLength="72" pattern="[a-z0-9]+(-[a-z0-9]+)*" />
      </label>
    </> : <input type="hidden" name="key" value={key} />}
    <label htmlFor={prefix + '-title'}>Başlık
      <input id={prefix + '-title'} name="title" defaultValue={item?.title} required maxLength="120" />
    </label>
    <label htmlFor={prefix + '-body'}>İçerik
      <textarea id={prefix + '-body'} name="body" defaultValue={item?.body} required maxLength="4000" />
    </label>
    {item?.image && <img src={item.image.startsWith('/media/') ? '/admin/media/' + item.image.split('/').pop() : item.image} alt={item.alt} width="144" height="144" loading="lazy" />}
    <label htmlFor={prefix + '-image'}>Görsel {isNew ? '' : '(değiştirmek için seçin)'}
      <input id={prefix + '-image'} type="file" name="image" accept="image/jpeg,image/png,image/webp" required={isNew} aria-describedby={prefix + '-image-hint'} />
    </label>
    <small id={prefix + '-image-hint'}>JPEG, PNG veya WebP · En fazla 5 MB</small>
    <label htmlFor={prefix + '-alt'}>Görsel açıklaması
      <input id={prefix + '-alt'} name="alt" defaultValue={item?.alt} required maxLength="180" />
    </label>
    {category && <>
      <label htmlFor={prefix + '-position'}>Sıra
        <input id={prefix + '-position'} type="number" name="position" min="0" max="10000" defaultValue={item?.position ?? 0} required />
      </label>
      <label className="bb-check"><input type="checkbox" name="published" defaultChecked={item?.published ?? false} /> Yayında</label>
    </>}
    <button className="btn btn--birincil" type="submit">{isNew ? 'Kategori oluştur' : 'Değişiklikleri kaydet'}</button>
  </form>;
}

export default async function Admin({ searchParams }) {
  const status = (await searchParams).durum;
  const message = typeof status === 'string' && Object.hasOwn(messages, status) ? messages[status] : null;
  const authenticated = await isAdmin();
  const [content, categories, instagram, instagramFeed, settings] = authenticated ? await Promise.all([
    query('SELECT * FROM bb_content ORDER BY key'),
    query('SELECT * FROM bb_categories ORDER BY position, title'),
    query('SELECT username,updated_at FROM bb_instagram WHERE singleton=true'),
    getInstagram(),
    getSettings(),
  ]) : [];
  return <main className="bb-admin">
    <Link href="/">← Vitrine dön</Link><h1>Beyza Blanc Yönetim</h1>
    {message && <p className="bb-status" role="status">{message}</p>}
    {!authenticated ? <form action={login}>
      <label htmlFor="password">Yönetim parolası<input id="password" name="password" type="password" autoComplete="current-password" required maxLength="128" /></label>
      <button className="btn btn--birincil" type="submit">Giriş yap</button>
    </form> : <>
      <form action={logout}><button className="btn btn--cizgili" type="submit">Çıkış yap</button></form>
      <Teklifler />
      <h2>Instagram bağlantısı</h2>
      <p>Instagram Login için oluşturulmuş Beyza Blanc profesyonel hesap erişim anahtarını girin. Anahtar sunucuda şifreli saklanır.</p>
      {instagram.rows[0] ? <>
        <p className="bb-status">Bağlı hesap · @{instagram.rows[0].username}
          {instagramFeed?.postsAvailable ? ' · Gönderilere erişiliyor' : ' · Gönderilere erişilemiyor'}
          {instagramFeed?.storiesAvailable ? ' · Hikâyelere erişiliyor' : ' · Hikâye erişimi doğrulanamadı'}
        </p>
        <form action={disconnectInstagram}><button className="btn btn--cizgili" type="submit">Instagram bağlantısını kaldır</button></form>
      </> : <p>Hesap bağlı değil. Ana sayfada seçilmiş gönderiler görüntüleniyor.</p>}
      <form action={connectInstagram}>
        <label htmlFor="instagram-token">Instagram erişim anahtarı
          <input id="instagram-token" name="token" type="password" required minLength="20" maxLength="2048" autoComplete="off" />
        </label>
        <small>Anahtarın beyzablanc hesabına ait olması gerekir. Yeni bir anahtar kaydetmek mevcut bağlantıyı günceller.</small>
        <button className="btn btn--birincil" type="submit">Hesabı doğrula ve bağla</button>
      </form>
      <h2>İletişim ve işletme bilgileri</h2>
      <p>Boş bırakılan alanlar sitede ve arama motoru işaretlemesinde gösterilmez. WhatsApp numarasını ülke koduyla yazın.</p>
      <form action={saveSettings}>
        <label htmlFor="s-phone">Telefon<input id="s-phone" name="contact_phone" defaultValue={settings.contact_phone} maxLength="32" placeholder="+90 533 000 00 00" /></label>
        <label htmlFor="s-wa">WhatsApp<input id="s-wa" name="contact_whatsapp" defaultValue={settings.contact_whatsapp} maxLength="32" placeholder="+90 533 000 00 00" /></label>
        <label htmlFor="s-email">E-posta<input id="s-email" name="contact_email" type="email" defaultValue={settings.contact_email} maxLength="120" /></label>
        <label htmlFor="s-street">Adres satırı<input id="s-street" name="address_street" defaultValue={settings.address_street} maxLength="160" /></label>
        <label htmlFor="s-loc">Semt<input id="s-loc" name="address_locality" defaultValue={settings.address_locality} maxLength="60" /></label>
        <label htmlFor="s-region">İlçe / Şehir<input id="s-region" name="address_region" defaultValue={settings.address_region} maxLength="60" /></label>
        <label htmlFor="s-country">Ülke<input id="s-country" name="address_country" defaultValue={settings.address_country} maxLength="60" /></label>
        <label htmlFor="s-maps">Google Maps bağlantısı<input id="s-maps" name="maps_url" type="url" defaultValue={settings.maps_url} maxLength="400" placeholder="https://maps.app.goo.gl/..." /></label>
        <label htmlFor="s-hours">Çalışma saatleri (her satır: Gün = Saat)<textarea id="s-hours" name="hours_text" defaultValue={settings.hours_text} maxLength="600" /></label>
        <label htmlFor="s-hours-schema">Arama motoru saat biçimi (her satır: Mo-Fr 10:00-19:00)<textarea id="s-hours-schema" name="hours_schema" defaultValue={settings.hours_schema} maxLength="300" /></label>
        <button className="btn btn--birincil" type="submit">Bilgileri kaydet</button>
      </form>
      <h2>Sayfa içerikleri</h2>
      {content.rows.map(item => <details key={item.key}><summary>{contentNames[item.key] ?? item.key}</summary><Editor item={item} /></details>)}
      <h2>Koleksiyon kategorileri</h2>
      {categories.rows.map(item => <details key={item.slug}><summary>{item.title} · {item.published ? 'Yayında' : 'Taslak'}</summary><Editor item={item} category /></details>)}
      <details><summary>Yeni kategori ekle</summary><Editor category isNew /></details>
      <KatalogBolumleri />
    </>}
  </main>;
}
