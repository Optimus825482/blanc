# Beyza Blanc web platformu: mevcut durum analizi ve geliştirme raporu

Tarih: 9 Kasım 2026 · Kapsam: `D:\PROJECTS\beyza` altındaki `platform/` (Next.js + PostgreSQL) ve `site/` (statik prototip) klasörleri, araştırma raporları ve yerel çalışan sunucu (http://localhost:3011) üzerinde yapılan doğrulamalar.

## 1. Yönetici özeti

Proje iki paralel üründen oluşuyor. `site/` klasörü, araştırma bulgularına göre olgunlaştırılmış, 19 özel gün ve 28 hazır tasarım içeren çok eksenli bir statik vitrin ve canvas tabanlı tasarım stüdyosudur. `platform/` klasörü ise Next.js 16 ve PostgreSQL üzerine kurulmuş, yönetim panelli, veritabanından beslenen yeni vitrindir; ancak bugün yalnızca 4 kategori ve 3 içerik sayfası barındırır, ürün/tasarım kavramı yoktur.

En önemli bulgu şudur: platform, statik sitenin stüdyo, ürün detayı ve SSS sayfalarını `public/` altından olduğu gibi servis ediyor. Bu sayfalar eski üst barı ve `koleksiyonlar.html?gun=…` bağlantılarını kullanıyor; Next bu adresleri `/koleksiyonlar`a 308 ile yönlendiriyor; sorgu korunuyor ama platformun koleksiyon sayfası `gun` parametresini okumuyordu. Sonuç: ziyaretçi, tasarım detayından bir özel gün kategorisine tıkladığında filtresiz ve yalnızca 4 kartlık bir sayfaya düşüyordu. (9 Kasım, paket 0.4 ile düzeltildi: eşleşen kategoriye yönlendirme, eşleşmeyene bilgi notu.) İki içerik kaynağı (veritabanı ve `data.js`) ve iki tasarım kabuğu aynı anda yayında.

Platformun temeli sağlam (güvenli oturum, görsel işleme, SEO uçları, şifreli Instagram anahtarı), fakat ürün kataloğu, çok eksenli kategori mimarisi, sipariş/teklif kaydı, test ve sürüm kontrolü yok. Önerilen yol: önce hijyen ve birleştirme (Faz 0 ve 1), sonra kataloğu veritabanına taşıyıp stüdyoyu platforma entegre etmek (Faz 2), ardından teklif kaydı, kurumsal akış ve ölçüm (Faz 3).

## 2. Proje envanteri

| Klasör | İçerik | Durum |
|---|---|---|
| `platform/` | Next.js 16.4.5 App Router, React 19.3, `pg` 8.23, `sharp` 0.35; 25 kaynak dosya, yaklaşık 900 satır | Aktif geliştirme; yerelde çalışıyor, DB bağlı (4 kategori, 0 yüklenmiş medya) |
| `platform/public/` | Statik sitenin kopyası: `studyo.html`, `urun.html`, `sss.html`, `assets/js/*` (main.js 1231, studyo.js 1031, data.js 859 satır), görseller 1,5 MB | Platform ile kısmen uyarlanmış; `data.js`, `style.css`, `vitrin.css` site ile birebir aynı, `main.js` ve `studyo.js` farklılaşmış |
| `site/` | Statik prototip, 8 HTML sayfa, WhatsApp akışı, mega menü, filtreli koleksiyon | Referans uygulama; platformdan daha zengin içerik modeli |
| `reports/`, `research_notes/` | İki araştırma raporu (sektör modelleri, kategori mimarisi) ve 12 not dosyası | Platform için uygulanacak öneri listesi burada |
| `tools/` | `prepare_seo.py` (statik site yayın hazırlığı), `md2html.py` | Statik siteye özgü |
| `_tmp_tr/`, `_scripts/` | Rakip sitelerden indirilen 4,2 MB HTML ve link çıkarma betikleri | Araştırma artığı |
| `platform/.env.exampl`, `.gitignor`, `README.m`, `next.config.mj` | Boş dizinler | Yanlış komut artığı, silinmeli |

Proje bir git deposu değildir. `.gitignore` var ama hiçbir şey sürüm kontrolünde değil; `.env.local` gerçek sırlarla birlikte çalışma dizininde duruyor.

## 3. Platform mimarisi

### 3.1 Rota haritası

| Rota | Kaynak | Veri | Not |
|---|---|---|---|
| `/` | `app/(public)/page.js` | `bb_content` (home, about, corporate), `bb_categories`, Instagram API | LocalBusiness JSON-LD, force-dynamic |
| `/koleksiyonlar` | `koleksiyonlar/page.js` | yayındaki kategoriler | Yalnızca kart listesi, filtre yok |
| `/koleksiyonlar/[slug]` | `[slug]/page.js` | tek kategori | Başlık, metin, görsel, iki buton; ürün listesi yok |
| `/hakkimizda`, `/kurumsal` | `content-page.js` | `bb_content` | Tek şablon |
| `/iletisim` | statik JSX | yok | Adres, telefon, saat, harita yok |
| `/studyo` | rewrite → `public/studyo.html` | `data.js` (istemci) | Next dışı, noindex |
| `/urun.html`, `/sss.html` | `public/` | `data.js` (istemci) | Next dışı, eski üst bar, noindex |
| `/admin` | `admin/page.js` + server actions | tüm tablolar | Parola ile giriş, içerik ve kategori düzenleme, Instagram bağlama |
| `/media/[id]` | route handler | `bb_media` | Yalnızca yayındaki içeriğe bağlı görseller, max-age 300 |
| `/sitemap.xml`, `/robots.txt` | `sitemap.js`, `robots.js` | kategoriler | SITE_URL boşsa her şey noindex |

### 3.2 Veri modeli

Beş tablo: `bb_media` (WebP bytea), `bb_content` (3 sabit anahtar), `bb_categories` (slug, metin, görsel, sıra, yayın), `bb_login_limits` (15 dakikalık kova), `bb_instagram` (tekil satır, AES-256-GCM şifreli anahtar). Ürün, tasarım, fiyat, teklif, müşteri veya sipariş tablosu yoktur. Statik `data.js` ise `temalar` (19), `kime` (8), `segmentler` (3), `tasarimlar` (28), `studyo` seçenekleri, `sss`, `kurumsal`, `taahhutler` ve boş `yorumlar` içerir. Bu model platforma taşınmamıştır.

### 3.3 Güvenlik ve oturum

- Oturum: HMAC-SHA256 imzalı, 8 saatlik, `httpOnly`, `sameSite=lax`, `path=/admin`, üretimde `secure`. Zaman sabitli karşılaştırma kullanılıyor. İyi.
- Giriş sınırı: 15 dakikada 12 deneme, ancak kova IP'den bağımsız ve küresel. Tek bir saldırgan, atölye sahibini de 15 dakika kilitler.
- Tek paylaşılan parola, ikinci faktör yok, oturum iptali yok, denetim kaydı yok.
- Başlıklar: `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY` var. İçerik Güvenlik Politikası (CSP) ve `Strict-Transport-Security` yok.
- Görsel yükleme: 5 MB sınırı, MIME ve `sharp` biçim doğrulaması, yeniden kodlama, piksel sınırı. İyi.
- Instagram anahtarı `SESSION_SECRET`ten türetilen anahtarla şifreli. Sır değişirse bağlantı kopar; belgelenmiş.
- Yetim medya: görsel değiştirildiğinde eski `bb_media` satırı silinmiyor; `/media/[id]` yalnızca referanslı görselleri sunduğu için sızıntı yok ama tablo büyür.

### 3.4 Performans ve önbellek

Tüm sayfalar `force-dynamic`; her istek veritabanına gidiyor, yanıt `Cache-Control: no-store`. Görseller veritabanından 300 saniyelik önbellekle sunuluyor. Statik varlıklar `next/image` kullanmıyor; `public/assets/img` 1,5 MB WebP, kabul edilebilir. Yerel ölçümde ana sayfa 0,4 saniye, koleksiyon sayfası ilk derlemede 1,1 saniye. Düşük trafikte sorun olmaz; ancak ISR veya `revalidateTag` ile ucuz bir kazanım duruyor.

### 3.5 Instagram entegrasyonu

Gönderi ve hikâye okuma, 5 dakikalık bellek içi önbellek, URL ve alan adı doğrulaması, hata durumunda sabit üç gönderiye düşüş. Eksikler: uzun ömürlü anahtarın 60 günlük süresi dolmadan yenilenmesi (`refresh_access_token`) yok; bellek içi önbellek sunucusuz ortamda etkisiz; panel anahtarın son kullanma tarihini göstermiyor.

## 4. Statik site ve stüdyo

Statik site araştırmanın P0 ve P1 maddelerini uygulamış durumda: 6 köklü mega menü, 4 eksenli filtre rayı ve sıralama, URL'ye yazılan filtre durumu, kırıntı navigasyonu, ürün detayında "benzer tasarımlar", stüdyoda üretim öncesi onay ekranı, teslim paneli, taslak kaydetme (`localStorage`), Web Share API ile PNG + metin paylaşımı, taahhüt bloğu ve teslim bantları. Yorumlar bilinçli olarak boş.

Platformdaki kopyada iletişim kanalı WhatsApp'tan Instagram DM'e (`ig.me/m/beyzablanc`) çevrilmiş; `config.js` sadeleşmiş ama `whatsapp` alanı ve `numaraHazirMi()` kontrolü duruyor. Stüdyo girişine "gerçek örnekle başla" ilham ızgarası eklenmiş (`studyo-v2.css`). Bu çatallanma, iki `main.js` ve iki `studyo.js` dosyasının ayrı ayrı bakımını gerektiriyor.

## 5. Doğrulama sonuçları

Çalışan sunucu üzerinde 21 rota denendi, tarayıcıda ana sayfa, stüdyo ve ürün detayı açıldı.

| Kontrol | Sonuç |
|---|---|
| Ana sayfa, koleksiyonlar, kategori detayı, içerik sayfaları | 200, konsol hatasız, JSON-LD mevcut |
| Bilinmeyen kategori | 404 (doğru) |
| `/studyo`, `/urun.html`, `/sss.html` | 200, çalışıyor; ancak eski üst bar ve `.html` bağlantıları |
| `/koleksiyonlar.html?gun=soz-nisan` | 308 → `/koleksiyonlar?gun=soz-nisan`; sayfa parametreyi okumuyordu (0.4 ile düzeltildi) |
| `/sss`, `/urun` (uzantısız) | 404; yalnızca `.html` uzantılı adresler çalışıyor |
| `/sitemap.xml`, `/robots.txt` | 200; `SITE_URL` yer tutucu (`beyzablanc.example`) olduğu için robots "Allow" üretiyor |
| Güvenlik başlıkları | nosniff, Referrer-Policy, X-Frame-Options var; CSP ve HSTS yok |
| Veritabanı | Bağlı; 4 kategori yayında, 0 yüklenmiş medya (tüm görseller `public/` dosyaları) |
| Derleme | `.next/BUILD_ID` 9 Kasım 07:19 tarihli; `npm run build` başarıyla alınmış |
| Test, lint, tip denetimi | Yok (`package.json` yalnızca dev/build/start/db:seed) |

## 6. Tespitler ve öncelikler

### Kritik

1. **İki içerik kaynağı, iki kabuk.** Veritabanı 4 kategori sunarken `data.js` 19 özel gün, 8 alıcı ekseni, 28 tasarım taşıyor. `/urun.html` ve `/sss.html` eski "Zarafetin Adresi" üst barıyla, `/` ve `/koleksiyonlar` yeni vitrin kabuğuyla açılıyor. Marka tutarsızlığı ve kırık kullanıcı yolculuğu.
2. **Koleksiyon sayfası sorguyu yok sayıyor.** Yönlendirme `?gun=…` parametresini taşıyor, ancak platformun koleksiyon sayfası okumuyor; filtre de tanımıyor. (Paket 0.4 ile geçici çözüm uygulandı; kalıcı çözüm 1.5.) Stüdyo ve ürün detayındaki 20 menü bağlantısının tamamı etkileniyor.
3. **Ürün kataloğu yok.** Kategori detay sayfası tek görsel ve metinden ibaret; araştırmanın "her kategoride en az 3–6 tasarım" kuralı karşılanamıyor. Yönetim paneli tasarım ekleyemiyor.

### Yüksek

4. **Sipariş veya teklif kaydı yok.** Stüdyo çıktısı yalnızca PNG ve metin olarak Instagram DM'e gidiyor; atölye tarafında hiçbir kayıt, kod takibi veya durum yok. Araştırma raporu "sipariş kaydı, teslim tarihi, hediye notu"nu birinci faz zorunluluğu sayıyor.
5. **İletişim bilgisi eksik.** `/iletisim` sayfasında adres, telefon, çalışma saatleri, harita yok; LocalBusiness şemasında telefon ve tam adres eksik. Statik `config.js` bunların hepsini taşıyor ama platform okumuyor.
6. **Kanal kararı belirsiz.** Statik site WhatsApp, platform Instagram DM. Araştırma her iki kanalı birlikte öneriyor. `config.js`'de iki kanalın kalıntıları bir arada.
7. **Sürüm kontrolü, test ve CI yok.** Git deposu yok, otomatik test yok, lint yok. Geri alma ve güvenli dağıtım imkânsız.

### Orta

8. Giriş sınırı küresel; sahibi kilitleyen hizmet engelleme riski. IP veya oturum bazlı kovaya geçilmeli.
9. Tüm sayfalar dinamik ve önbelleksiz; `revalidatePath` zaten çağrılıyor, ISR'ye geçiş ucuz.
10. Instagram anahtar yenileme ve süre takibi yok; 60 gün sonra sessizce sabit gönderilere düşer.
11. CSP ve HSTS başlıkları yok; Google Fonts dış bağımlılığı (self-host ile hem CSP hem gizlilik kazancı).
12. Yetim `bb_media` satırları; kategori silme yok; görsel silme yok; veritabanı yedeği prosedürü belgelenmemiş.
13. Panelde taslak önizleme yok; "Yayında" kutusu kapalı kategori hiçbir yerde görülemiyor.

### Düşük

14. Boş artık dizinler (`.env.exampl` vb.), 4,2 MB `_tmp_tr` ve `_scripts` projede duruyor.
15. `package.json` sürümü 1.0.0, `name` dışında meta yok; `engines` alanı yok (Node 24 ile çalışıyor).
16. Statik ve platform `README` dosyaları birbirine atıf yapıyor ama hangi kopyanın kaynak olduğu yazmıyor.

## 7. Güçlü yönler

- Mimari sade ve okunabilir: 900 satırlık platform kodu, bağımlılık sayısı 6.
- Güvenlik temelleri doğru: imzalı çerez, zaman sabitli karşılaştırma, görsel yeniden kodlama, parametreli sorgular, şifreli üçüncü taraf anahtarı, `server-only` işaretleri.
- SEO altyapısı hazır: metadata şablonu, canonical, Open Graph, sitemap, robots, JSON-LD, admin için noindex.
- Erişilebilirlik bilinci: skip link, `aria-label`, `focus-visible`, 44 px hedefler, `prefers-reduced-motion`.
- Araştırma tabanı güçlü ve kararlar gerekçeli; statik sitede P0/P1 maddeleri zaten uygulanmış durumda. Platforma taşınacak iş büyük ölçüde "aktarma", "yeniden keşif" değil.
- Yayın belgeleri (`README.md`) yerel kurulumdan Search Console'a kadar adım adım yazılmış.

## 8. Geliştirme yol haritası

### Faz 0: Hijyen (1–2 gün)

- Git deposu başlat; `.env.local`ı dışarıda tut; ilk commit.
- Artık dizinleri sil; `_tmp_tr` ve `_scripts`'i `research_notes/kaynak-html/` altına taşı veya arşivle.
- `package.json`a `engines`, `lint` (ESLint + `eslint-config-next`) ve basit bir `check` betiği ekle.
- Kanal kararını yaz: WhatsApp mı, Instagram DM mi, ikisi mi. Karar `lib/seo.js` ve `config.js`'te tek yerden okunmalı.

### Faz 1: Birleştirme (3–5 gün)

- `/urun.html`, `/sss.html` ve `/studyo`yu platform kabuğuna al: ya Next sayfası olarak (`app/(public)/sss/page.js`, `app/(public)/urun/[id]/page.js`) ya da en azından ortak başlık/alt bilgiyi paylaşan `.html` kopyaları olarak. Uzantısız adresler (`/sss`, `/urun/altin-isilti`) açılmalı.
- `next.config.mjs` yönlendirmelerinde sorgu parametresini koru veya `koleksiyonlar.html?gun=X` isteğini `/koleksiyonlar/X`e eşle.
- İletişim sayfasına adres, telefon, saat, harita; JSON-LD'ye `telephone`, `openingHoursSpecification`, `streetAddress`.
- Tek `main.js` / `studyo.js`: `site/` klasörünü "arşiv prototip" olarak işaretle, canlı kaynak `platform/public/assets/js` olsun.

### Faz 2: Katalog ve stüdyo entegrasyonu (2–3 hafta)

- Veri modeli: `bb_occasions` (19 özel gün, `kok` ile), `bb_recipients` (8 alıcı), `bb_product_types` (4), `bb_designs` (28 tasarım; slug, başlık, kısa metin, görsel, `occasion_ids[]`, `recipient_ids[]`, `product_type`, `segment`, `featured`, `bestseller`, `published`, `position`). `data.js`'den tek seferlik seed.
- Yönetim paneline tasarım CRUD, çoklu kategori etiketleme, sıralama ve yayın; kategoriler için silme ve taslak önizleme.
- `/koleksiyonlar` sayfasına çok eksenli filtre ve sıralama (sunucu tarafı, URL'de durum); `/koleksiyonlar/[slug]`a tasarım ızgarası; mega menüyü veritabanından üret.
- Stüdyoyu istemci bileşeni olarak Next'e taşı; seçenekleri veritabanından veya tek bir JSON uçtan oku; `data.js` bağımlılığını kaldır.
- Görselleri `next/image` ile sun; `force-dynamic` yerine `revalidateTag` tabanlı ISR.

### Faz 3: Teklif kaydı, kurumsal ve ölçüm (2–4 hafta)

- `bb_quotes` tablosu: tasarım kodu, seçimler JSON, PNG (bb_media), alıcı/teslim bilgileri, iletişim tercihi, durum (yeni, teklif verildi, onaylandı, üretimde, teslim). Stüdyonun "onayla ve gönder" adımı önce sunucuya kaydeder, sonra DM/WhatsApp'ı önceden doldurulmuş mesajla açar. Panelde teklif listesi.
- Kurumsal sayfaya teklif formu (adet aralığı, logo yükleme, tarih), aynı `bb_quotes` tablosuna `type=corporate`.
- Gerçek müşteri yorumları için `bb_reviews` ve panelden onay akışı; `yorumlar` bölümü otomatik görünür.
- Mevsimsel duyuru bandı ve "son sipariş tarihi" ayarları panelden yönetilebilir (`bb_settings` anahtar-değer).
- Ölçüm: gizlilik dostu analitik (Plausible veya Umami), teklif dönüşüm hunisi; Search Console doğrulaması.
- Güvenlik sertleştirme: IP bazlı giriş sınırı, CSP, HSTS, Instagram anahtar yenileme işi, günlük `pg_dump` yedeği.

### Testler ve kalite kapısı (her fazda)

- Birim: `lib/auth.js` çerez doğrulama, `lib/instagram.js` normalize/validImage, `actions.js` alan doğrulama.
- Entegrasyon: route handler'lar için `/media/[id]` yetki sınırı, yönlendirme tablosu.
- Uçtan uca: Playwright ile ana sayfa → kategori → tasarım → stüdyo → onay akışı, mobil ve masaüstü.
- CI: lint + test + `next build`; dağıtım öncesi `npm run db:seed` idempotent.

## 9. Sahibinden karar beklenen noktalar

1. Teklif kanalı: yalnızca Instagram DM, yalnızca WhatsApp, ikisi birden mi?
2. Tasarım kataloğu panelden mi yönetilecek, yoksa `data.js` kaynak dosya olarak mı kalacak? (Panel önerilir; aksi halde Faz 2 küçülür ama iki kaynak sorunu sürer.)
3. Fiyat gösterimi: "başlangıç fiyatı" yayınlanacak mı? Araştırma, fiyat belirsizliğini en sık şikâyet olarak işaretliyor.
4. Yayın hedefi: Vercel, Cloudflare veya VPS? Bellek içi önbellek ve `pg` havuzu kararı buna bağlı.
5. Alan adı ve gerçek işletme bilgileri (telefon, tam adres, saatler) ne zaman netleşir? SEO ve JSON-LD buna bağlı.

## 10. Dosya referansları

- Rota ve yönlendirme: `platform/next.config.mjs`
- Veri erişimi: `platform/lib/db.js`, şema `platform/db/schema.sql`, seed `platform/db/seed.mjs`
- Oturum ve giriş: `platform/lib/auth.js`, `platform/app/admin/actions.js`
- Instagram: `platform/lib/instagram.js`
- Statik katalog ve stüdyo: `platform/public/assets/js/data.js`, `main.js`, `studyo.js`
- Araştırma önerileri: `reports/Özel gün hediye siteleri kategori analizi.md` (bölüm "Mevcut Beyza Blanc sitesine uygulanacak somut değişiklikler"), `reports/Özel gün çikolata hediye sitesi modelleri.md` (bölüm "Beyza Blanc için öneriler")
