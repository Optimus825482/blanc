import Link from 'next/link';
import { isAdmin } from '../../lib/auth';
import { query } from '../../lib/db';
import { connectInstagram, disconnectInstagram, login, logout, revokeAllSessions, save, saveSettings } from './actions';
import { getSettings } from '../../lib/settings';
import { getInstagram } from '../../lib/instagram';
import KatalogBolumleri from './katalog';
import Teklifler from './teklifler';
import Yorumlar from './yorumlar';
import { BOLUMLER, bolumBul } from './bolumler';
import Gosterge from './gosterge';
import Arama from './arama';

export const metadata = { title: 'Yönetim', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const contentNames = { home: 'Ana sayfa', about: 'Hakkımızda', corporate: 'Kurumsal hediyeler' };
const messages = {
  giris: 'Giriş yapılamadı. Parolanızı kontrol edin.',
  limit: 'Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.',
  gecersiz: 'Değişiklik kaydedilemedi. Alanları, kategori adresinin benzersiz olduğunu ve görsel biçimini kontrol edin.',
  kaydedildi: 'Değişiklik kaydedildi.',
  mail_gonderildi: 'Teklif bilgileri kaydedildi ve müşteriye e-posta ile gönderildi.',
  mail_yapilandirilmadi: 'Teklif bilgileri kaydedildi; ancak sunucuda SMTP ayarları (SMTP_HOST) tanımlı olmadığı için otomatik e-posta gönderilemedi. Aşağıdaki “E-posta ile yanıtla” bağlantısını kullanabilirsiniz.',
  mail_hata: 'Teklif bilgileri kaydedildi ancak e-posta gönderimi sırasında sunucu hatası oluştu.',
  indexnow_ok: 'Tüm yayındaki sayfalar IndexNow (Bing/Yandex) dizinine bildirildi.',
  indexnow_yok: 'IndexNow bildirimi gönderilemedi (SITE_URL tanımlı değil veya ağ yanıt vermedi).',
  oturumlar: 'Tüm yönetim oturumları kapatıldı. Yeniden giriş yapmanız gerekir.',
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

async function Icerik() {
  const [content, categories] = await Promise.all([
    query('SELECT * FROM bb_content ORDER BY key'),
    query('SELECT * FROM bb_categories ORDER BY position, title'),
  ]);
  return <>
    <h2>Sayfa içerikleri</h2>
    {content.rows.map(item => <details key={item.key}><summary>{contentNames[item.key] ?? item.key}</summary><Editor item={item} /></details>)}
    <h2>Koleksiyon kategorileri <small>(eski)</small></h2>
    <p>Vitrin artık Katalog bölümündeki özel günlerden beslenir; bu kayıtlar yalnızca eski adreslerin yönlendirmesi için tutulur.</p>
    {categories.rows.map(item => <details key={item.slug}><summary>{item.title} · {item.published ? 'Yayında' : 'Taslak'}</summary><Editor item={item} category /></details>)}
    <details><summary>Yeni kategori ekle</summary><Editor category isNew /></details>
  </>;
}

async function Ayarlar() {
  const settings = await getSettings();
  return <>
    <h2>Duyuru bandı</h2>
    <p>Sitenin en üstünde, tüm sayfalarda görünen tek satırlık şerit. Metin boşsa ya da bitiş tarihi geçmişse görünmez.</p>
    <form action={saveSettings}>
      <label htmlFor="s-duyuru">Metin<input id="s-duyuru" name="announcement_text" defaultValue={settings.announcement_text} maxLength="200" placeholder="Sevgililer Günü siparişleri için son gün 10 Şubat." /></label>
      <label htmlFor="s-duyuru-link">Bağlantı (isteğe bağlı; / ile başlayan site içi adres ya da https://)<input id="s-duyuru-link" name="announcement_link" defaultValue={settings.announcement_link} maxLength="400" placeholder="/koleksiyonlar/sevgililer-gunu" /></label>
      <label htmlFor="s-duyuru-link-metin">Bağlantı metni<input id="s-duyuru-link-metin" name="announcement_link_text" defaultValue={settings.announcement_link_text} maxLength="60" placeholder="Tasarımları gör" /></label>
      <label htmlFor="s-duyuru-bitis">Son gösterim günü (isteğe bağlı)<input id="s-duyuru-bitis" name="announcement_until" type="date" defaultValue={settings.announcement_until} /></label>
      <button className="btn btn--birincil" type="submit">Duyuruyu kaydet</button>
    </form>

    <h2>Hazırlık süreleri ve son sipariş notu</h2>
    <p>Ana sayfadaki “Hazırlık süreleri” bantları ve stüdyo onay adımındaki not. Bantlar her satırda <code>başlık = metin</code> biçiminde.</p>
    <form action={saveSettings}>
      <label htmlFor="s-bantlar">Hazırlık süreleri (her satır: 1–4 adet = 2–3 iş günü içinde hazır)<textarea id="s-bantlar" name="delivery_bands" defaultValue={settings.delivery_bands} maxLength="600" /></label>
      <label htmlFor="s-son-siparis">Son sipariş notu<input id="s-son-siparis" name="last_order_note" defaultValue={settings.last_order_note} maxLength="240" placeholder="Özel gün siparişlerinde önerilen son tarih: teslim gününden 3 iş günü önce." /></label>
      <label htmlFor="s-kurumsal-not">Stüdyoda yüksek adet notu<input id="s-kurumsal-not" name="studio_corporate_qty_note" defaultValue={settings.studio_corporate_qty_note} maxLength="240" /></label>
      <button className="btn btn--birincil" type="submit">Metinleri kaydet</button>
    </form>

    <h2>İletişim ve işletme bilgileri</h2>
    <p>Boş bırakılan alanlar sitede ve arama motoru işaretlemesinde gösterilmez. WhatsApp numarasını ülke koduyla yazın; stüdyo ve takip sayfalarındaki WhatsApp düğmeleri bu numarayla açılır.</p>
    <form action={saveSettings}>
      <label htmlFor="s-phone">Telefon<input id="s-phone" name="contact_phone" defaultValue={settings.contact_phone} maxLength="32" placeholder="+90 533 000 00 00" /></label>
      <label htmlFor="s-wa">WhatsApp<input id="s-wa" name="contact_whatsapp" defaultValue={settings.contact_whatsapp} maxLength="32" placeholder="+90 533 000 00 00" /></label>
      <label htmlFor="s-email">E-posta<input id="s-email" name="contact_email" type="email" defaultValue={settings.contact_email} maxLength="120" /></label>
      <label htmlFor="s-notif-email">Teklif bildirim e-postası (yeni taleplerin gideceği adres)<input id="s-notif-email" name="notification_email" type="email" defaultValue={settings.notification_email} maxLength="120" placeholder="Boşsa üstteki E-posta adresi kullanılır" /></label>
      <label htmlFor="s-street">Adres satırı<input id="s-street" name="address_street" defaultValue={settings.address_street} maxLength="160" /></label>
      <label htmlFor="s-loc">Semt<input id="s-loc" name="address_locality" defaultValue={settings.address_locality} maxLength="60" /></label>
      <label htmlFor="s-region">İlçe / Şehir<input id="s-region" name="address_region" defaultValue={settings.address_region} maxLength="60" /></label>
      <label htmlFor="s-country">Ülke<input id="s-country" name="address_country" defaultValue={settings.address_country} maxLength="60" /></label>
      <label htmlFor="s-maps">Google Maps bağlantısı<input id="s-maps" name="maps_url" type="url" defaultValue={settings.maps_url} maxLength="400" placeholder="https://maps.app.goo.gl/..." /></label>
      <label htmlFor="s-hours">Çalışma saatleri (her satır: Gün = Saat)<textarea id="s-hours" name="hours_text" defaultValue={settings.hours_text} maxLength="600" /></label>
      <label htmlFor="s-hours-schema">Arama motoru saat biçimi (her satır: Mo-Fr 10:00-19:00)<textarea id="s-hours-schema" name="hours_schema" defaultValue={settings.hours_schema} maxLength="300" /></label>
      <button className="btn btn--birincil" type="submit">Bilgileri kaydet</button>
    </form>
  </>;
}

async function Instagram() {
  const [instagram, instagramFeed] = await Promise.all([
    query('SELECT username,updated_at FROM bb_instagram WHERE singleton=true'),
    getInstagram(),
  ]);
  return <>
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
  </>;
}

function Bolum({ bolum }) {
  if (bolum.kinds) return <KatalogBolumleri kinds={bolum.kinds} />;
  switch (bolum.id) {
    case 'genel': return <Gosterge />;
    case 'arama': return <Arama />;
    case 'talepler': return <Teklifler />;
    case 'yorumlar': return <Yorumlar />;
    case 'icerik': return <Icerik />;
    case 'ayarlar': return <Ayarlar />;
    case 'instagram': return <Instagram />;
    default: return null;
  }
}

export default async function Admin({ searchParams }) {
  const { durum: status, bolum: bolumId } = await searchParams;
  const message = typeof status === 'string' && Object.hasOwn(messages, status) ? messages[status] : null;
  const authenticated = await isAdmin();
  if (!authenticated) {
    return <main className="bb-admin">
      <Link href="/">← Vitrine dön</Link><h1>Beyza Blanc Yönetim</h1>
      {message && <p className="bb-status" role="status">{message}</p>}
      <form action={login}>
        <label htmlFor="password">Yönetim parolası<input id="password" name="password" type="password" autoComplete="current-password" required maxLength="128" /></label>
        <button className="btn btn--birincil" type="submit">Giriş yap</button>
      </form>
    </main>;
  }
  const bolum = bolumBul(typeof bolumId === 'string' ? bolumId : '');
  const { rows: [{ yeni }] } = await query("SELECT count(*)::int AS yeni FROM bb_quotes WHERE status='new'");
  return <main className="bb-admin bb-admin--panel">
    <header className="bb-admin__ust">
      <div><Link href="/">← Vitrine dön</Link><h1>Beyza Blanc Yönetim</h1></div>
      <div className="bb-admin__eylem">
        <form action={revokeAllSessions}><button className="btn btn--cizgili" type="submit" title="Bu tarayıcı dahil tüm yönetim oturumlarını kapatır">Tüm oturumları kapat</button></form>
        <form action={logout}><button className="btn btn--cizgili" type="submit">Çıkış yap</button></form>
      </div>
    </header>
    <div className="bb-admin__govde">
      <nav className="bb-admin__menu" aria-label="Panel bölümleri">
        {BOLUMLER.map((b) => <Link key={b.id} href={'/admin?bolum=' + b.id} aria-current={b.id === bolum.id ? 'page' : undefined}>
          <span className="bb-admin__simge" aria-hidden="true">{b.simge}</span>{b.ad}
          {b.id === 'talepler' && yeni > 0 && <span className="bb-admin__rozet" aria-label={yeni + ' yeni talep'}>{yeni}</span>}
        </Link>)}
      </nav>
      <section className="bb-admin__icerik" aria-labelledby="bolum-baslik">
        <p className="bb-admin__kirinti">Yönetim / <span id="bolum-baslik">{bolum.ad}</span></p>
        <p className="bb-admin__aciklama">{bolum.aciklama}</p>
        {message && <p className="bb-status" role="status">{message}</p>}
        <Bolum bolum={bolum} />
      </section>
    </div>
  </main>;
}
