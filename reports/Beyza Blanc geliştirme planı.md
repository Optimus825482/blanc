# Beyza Blanc web platformu: geliştirme planı

Tarih: 9 Kasım 2026 · Durum: onaylı kararlara göre hazırlanmış uygulama planı. Henüz kod yazılmadı. Analiz için bkz. `Beyza Blanc web platformu analiz raporu.md`.

## 1. Alınan kararlar

| Karar | Seçim | Plana etkisi |
|---|---|---|
| Teklif kanalı | Önce platforma kayıt, sonra müşteri WhatsApp veya Instagram DM seçer | `bb_quotes` tablosu, takip kodu, iki kanal için önceden doldurulmuş mesaj, panelde talep listesi |
| Katalog yönetimi | Yönetim paneli, PostgreSQL | `data.js` tek seferlik seed olur; özel gün, alıcı, ürün tipi, tasarım ve stüdyo seçenekleri tablolara taşınır |
| Fiyat | Segment + "X TL'den başlayan" + stüdyoda canlı tahmini aralık | Fiyat kuralları tablosu, stüdyoda adet ve seçeneklere göre hesaplama, teklif kaydında tahmini aralık |
| Yayın | Tek VPS, Docker | Docker Compose (Next + PostgreSQL + Caddy), bellek içi önbellekler kalabilir (tek süreç), yedekleme cron |
| Çalışma biçimi | Fable planlar, uygulama ayrı oturumlarda ve küçük parçalarda | Her fazın işleri bağımsız, kısa oturumlarda bitecek büyüklükte yazıldı |

## 2. Hedef deneyim: "neden geldiğini bilen, mutlu ayrılan ziyaretçi"

Platform bir tanıtım sitesi değil, özel gün hediyesi için karar ve tasarım aracı. Ziyaretçi dört niyetten biriyle gelir; her niyetin net bir giriş yolu ve net bir "mutlu çıkış" sonucu olmalı.

| Niyet | Giriş | Yol | Mutlu çıkış |
|---|---|---|---|
| "Yaklaşan bir gün var, fikir arıyorum" | Ana sayfada "Kim için, hangi gün, ne zaman?" üçlü seçici | Filtrelenmiş koleksiyon, 3–6 tasarım, segment ve başlayan fiyat | Beğenilenler listesi veya seçilen tasarımla stüdyoya geçiş |
| "Ne istediğimi biliyorum, kendim tasarlayacağım" | Stüdyo | Örnekle başla → ürün, renk, yazı, fotoğraf → canlı önizleme → fiyat aralığı → teslim → onay | Takip kodu, görsel ve özet elinde; WhatsApp veya Instagram'dan devam |
| "Kurumsal hediye, adet çok" | Kurumsal sayfası | Adet aralığı, logo yükleme, tarih, kademeli fiyat tablosu | Kurumsal teklif kaydı, numune talebi, 1 iş günü yanıt taahhüdü |
| "Daha önce sipariş verdim / durumunu merak ediyorum" | Takip sayfası | Kod ile sorgulama | Durum ve tahmini teslim; sonraki özel gün için hatırlatıcı |

Çıkışta her ziyaretçiye tek bir kalıcı değer bırakılır: takip kodu, kaydedilmiş tasarım bağlantısı, beğeni listesi veya özel gün hatırlatıcısı. Hiçbir yol "bize yazın" ile bitmez; hepsi somut bir sonuçla biter.

## 3. Rakip kıyası ve fark yaratacak özellikler

Araştırma raporlarındaki emsallerden (Compartés "Make Your Own", Sugarfina "Design Your Own", Baked by Melissa 4 adımlı hediye akışı, Godiva TR okazyon menüsü, Choc on Choc alıcı ekseni, Chococraft fotoğraf baskı) alınan ve üstüne çıkılacak noktalar:

| Alan | Sektör standardı | Beyza Blanc hedefi |
|---|---|---|
| Navigasyon | Özel gün + alıcı menüsü | Üç eksen menü + niyet seçici + URL'de filtre durumu (statik sitede hazır, platforma taşınacak) |
| Kişiselleştirme | İsim/tarih formu, çoğunda statik önizleme | Gerçek ürün fotoğrafı üzerine katmanlı canlı önizleme, fotoğraf yükleme, yazı tipi ve renk seçimi, taslak kaydetme, paylaşılabilir tasarım bağlantısı |
| Fiyat | Sabit fiyat veya hiç yok | Segment + başlayan fiyat + stüdyoda seçime göre anlık aralık |
| Teslim | Tarih seçici | Tarih seçici + son sipariş eşiği + hazırlık bandı + KKTC içi aynı gün bilgisi; geçmiş tarih seçilemez |
| Onay | Sepet özeti | Üretim öncesi onay ekranı, yazım teyidi, "birebir basılacak" kutusu (statik sitede hazır) |
| Sipariş sonrası | E-posta onayı | Takip kodu sayfası, durum çizelgesi, takvime ekle (ICS), bir sonraki özel gün hatırlatıcısı |
| Kurumsal | Form | Logo yükleme + adet kademesi + anlık tahmini bütçe + numune talebi |
| Güven | Yorum ve rozet | Gerçek müşteri yorumları (panelden onaylı), "neyi garanti ediyoruz" bloğu, Instagram canlı akış |

Sektörde görülmeyen ve butik ölçekte yapılabilir üç fark: **paylaşılabilir tasarım bağlantısı** (eş, arkadaş onayı için), **özel gün hatırlatıcısı** (yıl dönümü, doğum günü; e-posta veya WhatsApp ile 10 gün önce), **takip kodu ile durum sayfası**.

## 4. Modül planı

### 4.1 Vitrin ve katalog

- Ana sayfa: niyet seçici (kim için / hangi gün / ne zaman), öne çıkan tasarımlar, taahhüt bloğu, teslim bantları, Instagram akışı, gerçek yorumlar (varsa).
- Mega menü veritabanından: Özel Güne Göre, Kime Göre, Ürün Tipi, Kurumsal, Yeni & Çok Satan, Stüdyo. Mobilde akordeon.
- `/koleksiyonlar`: dört eksenli filtre, sıralama, sayaç, kırıntı, URL durumu; sunucu tarafı render.
- `/koleksiyonlar/[slug]`: kategori metni + tasarım ızgarası + "stüdyoda bu temayla başla".
- `/tasarim/[slug]`: tasarım detayı, segment, başlayan fiyat, kişiselleştirme seçenekleri, benzer tasarımlar, "bu tasarımla stüdyoya git".
- `/sss`, `/iletisim` (adres, telefon, saat, harita, iki kanal), `/hakkimizda`, `/kurumsal`.
- Eski `.html` adresleri için sorgu koruyan yönlendirmeler.

### 4.2 Tasarım stüdyosu v3

Mevcut canvas çizimi (madlen kutusu, bar, tepsi) korunur; üstüne şunlar eklenir:

1. **Giriş:** boş başla veya gerçek örnekle başla (Instagram görselleri), ya da tasarım sayfasından devralınan seçimlerle başla.
2. **Adımlar:** ürün → özel gün ve alıcı → ambalaj rengi, kurdele, kart → yazı (isim, tarih, mesaj, yazı tipi) → fotoğraf veya logo → adet ve segment → teslim (tarih, şekil, alıcı adı, not) → onay.
3. **Canlı önizleme:** katmanlı render; gerçek ürün fotoğrafı altlık, üstüne renk maskesi, yazı ve fotoğraf. Mobilde yapışkan önizleme.
4. **Fiyat aralığı:** `bb_price_rules` tablosundan ürün tipi × adet kademesi × ekstralar; "tahmini 1.250–1.450 TL" biçiminde, teklifte netleşir notu.
5. **Taslak ve paylaşım:** `localStorage` taslağı korunur; "tasarımı kaydet" sunucuya yazar ve `/t/[kod]` bağlantısı üretir; bağlantı önizleme görseli ile açılır.
6. **Onay ekranı:** mevcut 13 satırlık özet + yazım teyidi kutusu + fiyat aralığı + teslim tarihi kontrolü (son sipariş eşiğini aşarsa uyarı ve alternatif tarih).
7. **Gönderim:** önce `bb_quotes` kaydı (PNG `bb_media`'ya), sonra kanal seçimi: WhatsApp (`wa.me`) veya Instagram (`ig.me`), mesajda kod + özet + bağlantı. Masaüstünde görsel indirme yedeği kalır.
8. **Sonuç sayfası:** `/takip/[kod]` kod, görsel, özet, durum çizelgesi, takvime ekle, hatırlatıcı kur.

Erişilebilirlik: her adım klavye ile tamamlanabilir, canvas için metin özeti, renk seçimlerinde isim etiketi, `prefers-reduced-motion`.

### 4.3 Teklif kaydı ve takip

- `bb_quotes`: kod (BB-XXXX-YY), tür (bireysel/kurumsal), tasarım referansı, seçimler JSON, görsel, adet, tahmini aralık, teslim bilgileri, iletişim tercihi, durum, zaman damgaları, panel notları.
- Durumlar: yeni → teklif verildi → onaylandı → üretimde → hazır → teslim edildi / iptal.
- `/takip/[kod]`: herkese açık ama yalnızca kodla; kişisel veri gösterilmez (alıcı adı maskelenir).
- Panelde talep listesi: filtre, durum değiştirme, not, WhatsApp/Instagram'a tek tık yanıt bağlantısı.

### 4.4 Kurumsal

- Kademeli fiyat tablosu (panelden), logo yükleme, adet ve tarih, anlık tahmini bütçe, numune talebi, "1 iş günü içinde dönüş" taahhüdü.
- Aynı `bb_quotes` tablosu, `type=corporate`; referans işler galerisi (Gökhan Türk Motors, OSK Auto, Ege Motors).

### 4.5 Hatırlatıcı ve yorumlar

- `bb_reminders`: e-posta veya WhatsApp numarası (onaylı), özel gün tipi, tarih, yıllık tekrar; 10 gün önce gönderim. Faz 3; e-posta için Resend benzeri ücretsiz kademe.
- `bb_reviews`: ad, metin, puan, fotoğraf, onay durumu; teslimattan 7 gün sonra kod sahibine yorum bağlantısı. Yalnızca onaylılar yayınlanır.

### 4.6 Yönetim paneli

Bugünkü tek sayfa panel sekmelere ayrılır: Talepler, Tasarımlar, Kategoriler (özel gün, alıcı, ürün tipi), Stüdyo seçenekleri, Fiyat kuralları, İçerik sayfaları, Yorumlar, Ayarlar (duyuru bandı, son sipariş notu, teslim bantları, iletişim bilgileri, kanal numaraları), Instagram. Taslak önizleme, silme, sürükle-bırak sıralama. Giriş sınırı IP bazlı; isteğe bağlı TOTP ikinci faktör.

### 4.7 Altyapı (VPS)

- Docker Compose: `web` (Next standalone), `db` (PostgreSQL 16, volume), `caddy` (otomatik HTTPS). Günlük `pg_dump` ve medya yedeği cron, 14 gün saklama, haftalık geri yükleme denemesi.
- Ortam: `SITE_URL`, PG değişkenleri, `ADMIN_PASSWORD`, `SESSION_SECRET`, `WHATSAPP_NUMBER`, `INSTAGRAM_HANDLE`.
- Güvenlik başlıkları: CSP (fontlar self-host edilince `'self'` ağırlıklı), HSTS, mevcut başlıklar.
- Gözlem: Caddy erişim günlükleri, uygulama hata günlüğü dosyaya, Plausible veya Umami (self-host) ile sayfa ve huni ölçümü.
- CI: GitHub Actions ile lint + test + build; `main`'e birleşince VPS'e SSH ile dağıtım.

## 5. Veri modeli özeti

| Tablo | Amaç |
|---|---|
| `bb_occasions` | 19 özel gün; slug, ad, kısa, açıklama, ikon, kök (ozel-gun / mevsim / kurumsal), sıra, yayın |
| `bb_recipients` | 8 alıcı ekseni |
| `bb_product_types` | madlen kutu, bar, tepsi, hediye kutusu; stüdyo çizim tipi |
| `bb_designs` | 28 tasarım; slug, başlık, metin, görsel, ürün tipi, segment, başlayan fiyat, öne çıkan, çok satan, yeni, yayın, sıra |
| `bb_design_occasions`, `bb_design_recipients` | çoktan çoğa etiketler |
| `bb_studio_options` | çikolata tipi, ambalaj rengi, kurdele, kart, yazı tipi, adet, ekstra; grup + değer + görsel/renk |
| `bb_price_rules` | ürün tipi × adet kademesi taban fiyat, ekstra ek ücretleri |
| `bb_quotes` | teklif talepleri (bireysel ve kurumsal) |
| `bb_saved_designs` | paylaşılabilir tasarım bağlantıları |
| `bb_reviews`, `bb_reminders`, `bb_settings` | yorumlar, hatırlatıcılar, anahtar-değer ayarlar |
| Mevcut: `bb_media`, `bb_content`, `bb_categories`, `bb_login_limits`, `bb_instagram` | `bb_categories` → `bb_occasions`'a göç eder |

## 6. Fazlar ve iş paketleri

Her iş paketi tek oturumda bitecek büyüklükte, bağımlılığı yazılı. Süreler tahmini geliştirme günüdür.

### Faz 0: Hijyen ve hızlı kazanımlar (2 gün)

| No | İş | Dosyalar | Kabul ölçütü |
|---|---|---|---|
| 0.1 | Git deposu, `.gitignore`, ilk commit; artık dizinleri sil; `_tmp_tr` ve `_scripts`'i `research_notes/kaynak/` altına taşı | kök | `git status` temiz, `.env.local` izlenmiyor |
| 0.2 | ESLint + `eslint-config-next`, `npm run lint` ve `npm run check` | `package.json`, `eslint.config.mjs` | Lint sıfır hata ✔ (9 Kasım; 13 uyarı: `<img>` → 1.7, font/CSS etiketleri → 3.5) |
| 0.3 | Başlıkta "Blanc" script yazı tipi (logo ile uyum); Great Vibes veya Pinyon Script self-host | `app/layout.js`, `app/(public)/layout.js`, `vitrin.css` | Başlık ve alt bilgi logo ile tutarlı, kontrast AA |
| 0.4 | Koleksiyon sayfası `gun` parametresini okur: eşleşen kategoriye yönlendirir, eşleşmeyene not gösterir; `/sss` ve `/urun` uzantısız açılır | `koleksiyonlar/page.js`, `next.config.mjs` | 20 menü bağlantısı doğru hedefe gider ✔ (9 Kasım) |
| 0.5 | İletişim sayfası ve JSON-LD: adres, telefon, saat, harita, iki kanal; değerler `bb_settings`'ten, panelde form | `iletisim/page.js`, `page.js`, `lib/settings.js`, `admin/*` | Rich Results testi geçer ✔ (9 Kasım; telefon ve WhatsApp panelden girilecek) |
| 0.6 | Docker Compose + Caddy + yedek betiği; VPS'e ilk dağıtım | `Dockerfile`, `compose.yml`, `deploy/` | HTTPS'te açılır, yedek dosyası oluşur |

### Faz 1: Katalog veritabanına (5–7 gün)

| No | İş | Bağımlılık | Kabul ölçütü |
|---|---|---|---|
| 1.1 | Şema: occasions, recipients, segments, product_types, designs, bağlantı tabloları, studio_options, price_rules (settings 0.5'te geldi) | 0.1 | `db:seed` idempotent çalışır ✔ (9 Kasım; 10 yeni tablo, iki kez seed doğrulandı) |
| 1.2 | `data.js`'den seed göçü; `bb_categories` → `bb_occasions` | 1.1 | 19 özel gün, 8 alıcı, 28 tasarım panelde görünür — ✅ 9 Kasım: `db/katalog-tasi.mjs` seed içinde çalışır; 19 özel gün, 8 alıcı, 3 segment, 4 ürün tipi, 28 tasarım (28 özel gün + 49 alıcı bağı), 42 stüdyo seçeneği tabloda; tekrar çalıştırma var olanı ezmez. Panelde görünme 1.3 ile |
| 1.3 | Panel: sekmeler, tasarım CRUD, çoklu etiket, sıralama, silme, taslak önizleme | 1.2 | Yeni tasarım 2 dakikada eklenebilir — ✅ 9 Kasım: panelde Katalog bölümü (özel gün, alıcı, segment, ürün tipi, tasarım, stüdyo seçeneği) ekle/düzenle/sil; tasarımda çoklu alıcı ve ek özel gün; ürün tipine altlık fotoğrafı yükleme; alan tanımları `lib/katalog.js`'de. Kalan: sekmeli düzen ve taslak önizleme (2.1 sonrası) |
| 1.4 | Mega menü ve niyet seçici veritabanından | 1.2 | Menü 6 kök, mobil akordeon — ✅ 9 Kasım: üst menü tablolardan (`mega-menu.js`): Özel güne göre (3 kök sütun), Kime göre, Ürün tipi, Kurumsal, Atölye; `<details>` tabanlı, mobilde akordeon, dışarı tıklama/Escape kapatır. Ana sayfada "Bugün ne için geldiniz?" niyet seçici (4 niyet) ve özel gün kartları tablodan |
| 1.5 | `/koleksiyonlar` filtre + sıralama + URL durumu, `/koleksiyonlar/[slug]` tasarım ızgarası | 1.2 | Statik sitedeki tüm filtre kombinasyonları çalışır — ✅ 9 Kasım: `/koleksiyonlar` özel günleri kök başlıklarıyla listeler; `?kime= ?urun= ?segment=` çipleri URL'de tutulur ve tasarım ızgarasını filtreler; `/koleksiyonlar/[slug]` özel gün açılışı (vurgu rengi, atölye önerisi) + filtreli tasarım kartları (rozet, "… TL'den başlayan", stüdyoya `?tasarim=` bağlantısı); eski kategori adresleri 308 ile özel güne yönlenir; `/studyo?tema=` devralır; sitemap özel günlerden. Sıralama seçeneği yok (öne çıkan → çok satan → sıra) |
| 1.6 | `/tasarim/[slug]`, `/sss` Next sayfası; eski `urun.html` ve `sss.html` kaldırılır | 1.5 | Tek kabuk, noindex yok, sitemap'te — ✅ 9 Kasım: `/tasarim/[slug]` (özellik listesi, başlayan fiyat, Product JSON-LD, benzer tasarımlar, stüdyoya bağlantı) ve `/sss` (`bb_faq` tablosu, panelde "Sıkça sorulan sorular" CRUD, FAQPage JSON-LD, akordeon); `urun.html`/`sss.html` kaldırıldı, eski adresler 308 ile yönlenir; sitemap tasarımları ve SSS'yi içerir |
| 1.7 | ISR: `revalidateTag` ile katalog önbelleği; `next/image` | 1.5 | Ana sayfa TTFB < 200 ms yerelde |

### Faz 2: Stüdyo v3 ve teklif kaydı (8–10 gün)

| No | İş | Bağımlılık | Kabul ölçütü |
|---|---|---|---|
| 2.1 | Stüdyoyu Next istemci bileşenine taşı; seçenekler `/api/studio-options` veya sunucu props | 1.1 | `data.js` bağımlılığı yok, eski davranış korunur — ✅ 9 Kasım: `/studyo` artık Next rotası (`app/(public)/studyo`); veri `lib/studio-data.js` ile tablolardan (özel gün, ürün tipi, stüdyo seçenekleri, tasarımlar, ayarlar) üretilip betiğe `BEYZA_DATA` olarak verilir; panelden yüklenen ürün tipi altlığı gerçek görselde kullanılır; `public/studyo.html` kaldırıldı. Gövde markup'ı hâlâ HTML dosyası, çizim kodu `studyo.js` — tam React bileşenine ayrıştırma 2.2 ile |
| 2.2 | Fiyat aralığı hesaplayıcı (sunucu ve istemci aynı fonksiyon) | 1.1 | Panelde kural değişince stüdyo günceller — ✅ 9 Kasım: panelde "Fiyat kuralları" (temel: ürün tipi + boyut + adet aralığı; ekstra: stüdyo ekstrası ücreti; adet veya sipariş başına); stüdyo canlı taslak altında "Tahmini fiyat" kutusu ve teklif metninde satır; kural yoksa gösterilmez. Hesap istemcide (`fiyatTahmini`), kurallar `studio-data` ile gelir. Gerçek fiyatlar panelden girilecek (sahibi girdisi) |
| 2.3 | Katmanlı gerçek fotoğraf önizlemesi (ürün başına altlık + maske) | 2.1 | 4 ürün tipi için fotoğraflı önizleme — ◐ 9 Kasım: altlık sistemi (`altliklar.json` + render edilmiş kutu/bar/tepsi sahneleri) ve gerçekçi çizim katmanı statik stüdyoda canlı; 9 Kasım (2): "Gerçek görsel / Taslak çizim" geçişi — özel güne ve ürün tipine göre atölyenin gerçek fotoğrafı altlık olur, isim/tarih/kurdele/kart/fotoğraf üstüne işlenir (`altliklar.json` → `gercek` eşlemesi, 16 özel gün); kalan: panelden altlık ve gerçek görsel yükleme (1.3 ile) |
| 2.4 | Teslim adımı: tarih seçici, son sipariş eşiği, hazırlık bandı uyarıları | 2.1 | Geçmiş veya eşik dışı tarih engellenir — ✅ 9 Kasım: tarih seçici (bugünden önce seçilemez, geçmiş tarih temizlenir), adete göre hazırlık bandından en az iş günü uyarısı (göndermeyi engellemez, bant metni 'N iş günü' okunur; hafta sonu sayılmaz, resmi tatiller sayılmaz); özet satırı 'Hedef teslim günü' zaten vardı |
| 2.5 | `bb_quotes` + kayıt eylemi + PNG saklama + kod üretimi | 1.1 | Onay sonrası kayıt oluşur, kod gösterilir — ✅ 9 Kasım: `bb_quotes` + `POST /api/teklif` (seçimler JSON, özet, tahmin, teslim, PNG→WebP `bb_media`, kod BB-XXXX-YY, istemci başına 15 dk/8 kayıt sınırı); `/teklif/[kod]?t=anahtar` takip sayfası (kod okunur referans, 128 bitlik anahtar zorunlu, dakikada 30 sorgu sınırı; durum çizelgesi, özet, görsel); panelde "Teklif talepleri" listesi, durum ve not. Kurumsal sınıflama: kök kurumsal veya ≥50 adet. Herkese açık `/media` artık özel gün/ürün tipi/tasarım/teklif görsellerini de sunar (1.3'teki eksik) |
| 2.6 | Kanal seçimi ve önceden doldurulmuş mesaj (WhatsApp, Instagram) | 2.5 | Her iki kanalda kod ve bağlantı mesajda — ✅ 9 Kasım: onay diyaloğunda kayıt sonrası kanal adımı: WhatsApp (ayarlarda numara varsa, mesaj kod + takip bağlantısı + özetle dolu), Instagram DM (mesaj panoya kopyalanır), görselle paylaş (destekleyen cihazlarda), görseli indir; seçilen kanal kayda işlenir (`PATCH`) |
| 2.7 | `/takip/[kod]` sayfası, ICS indirme | 2.5 | Kod ile durum görülür, kişisel veri maskeli |
| 2.8 | Paylaşılabilir tasarım bağlantısı `/t/[kod]` ve Open Graph görseli | 2.5 | Bağlantı WhatsApp'ta önizlemeli açılır |
| 2.9 | Panel: talep listesi, durum, not, tek tık yanıt | 2.5 | Durum değişince takip sayfası güncellenir |
| 2.10 | Playwright uçtan uca: ana sayfa → tasarım → stüdyo → onay → kod | 2.7 | Mobil ve masaüstünde yeşil |

### Faz 3: Kurumsal, güven ve büyüme (5–7 gün)

| No | İş | Bağımlılık | Kabul ölçütü |
|---|---|---|---|
| 3.1 | Kurumsal teklif akışı: logo, adet kademesi, tahmini bütçe, numune | 2.5 | Kurumsal talep panelde ayrı görünür — ✅ 9 Kasım: `/kurumsal#kurumsal-teklif` formu (firma, yetkili, e-posta, telefon, vesile, ürün, adet kademesi, kişi başı bütçe, hedef tarih, logo→`bb_media`, numune, not, onay, bal küpü, 15 dk/5 sınır); kayıt `bb_quotes` kind=corporate (`company` jsonb, `logo_id`); başarıda takip sayfasına yönlenir (kurumsal ayrıntılar + logo); panelde "Kurumsal talepler" ve "Bireysel teklif talepleri" ayrı |
| 3.2 | Yorum toplama ve onay; ana sayfada "Sizden gelenler" | 2.9 | Onaysız yorum yayınlanmaz |
| 3.3 | Özel gün hatırlatıcısı (e-posta ilk, WhatsApp sonra) | 2.5 | 10 gün önce mesaj gider, tek tık iptal |
| 3.4 | Panel ayarları: duyuru bandı, son sipariş notu, teslim bantları, iletişim | 1.3 | Kod değişmeden içerik yönetilir — ✅ 9 Kasım: panel kenar menüsüyle bölümlere ayrıldı (`?bolum=` Talepler, Katalog, Tasarımlar, Stüdyo seçenekleri, Fiyat kuralları, SSS, Sayfa içerikleri, Ayarlar, Instagram; yeni talep rozeti; aksiyonlar ilgili bölüme döner). Ayarlar: duyuru bandı (metin, bağlantı, son gösterim günü → tüm sayfaların üstünde), hazırlık süreleri (ana sayfada bantlar), son sipariş notu (ana sayfa + stüdyo onayı), stüdyo yüksek adet notu, iletişim |
| 3.5 | Güvenlik: IP bazlı giriş sınırı, sunucu tarafı oturum iptali (`bb_sessions`, parola değişince tüm oturumlar düşer), CSP, HSTS, TOTP (isteğe bağlı), Instagram anahtar yenileme işi | 0.6 | Güvenlik başlıkları testinde A |
| 3.6 | Ölçüm: Plausible/Umami, huni olayları (seçici, stüdyo adımları, onay, kanal) | 0.6 | Haftalık dönüşüm raporu |
| 3.7 | CI/CD: GitHub Actions lint + test + build + SSH dağıtım | 0.1 | `main`'e birleşince canlıya çıkar |

## 7. Çalışma düzeni (haftalık kullanım sınırı için)

- Her iş paketi ayrı, kısa oturumda; oturum başında yalnızca ilgili dosyalar okunur. Bu plan ve analiz raporu bağlam kaynağıdır, tekrar keşif yapılmaz.
- Önerilen sıra: 0.1 → 0.4 → 0.3 → 0.5 → 1.1 → 1.2 → 1.3 → 1.5 → 1.6 → 2.1 → 2.5 → 2.6 → 2.7 → geri kalanlar.
- Her paket sonunda: lint, ilgili test, kısa tarayıcı doğrulaması, commit. Uzun açıklama yok, değişiklik listesi var.
- Uygulama oturumları Sonnet gibi daha ucuz bir modelle yürütülebilir; tasarım kararı gerektiren paketler (2.3 önizleme, 4.1 niyet seçici) bu modelde kalır.

## 8. Sahibinden gerekenler

1. Gerçek işletme bilgileri: telefon, WhatsApp hattı, tam adres, çalışma saatleri, alan adı.
2. Fiyat kademeleri: 4 ürün tipi × adet aralıkları için başlangıç fiyatları ve ekstra ücretler (fotoğraf baskı, logo, kurdele).
3. Ürün başına yüksek çözünürlüklü altlık fotoğrafları (kare, krem zemin) stüdyo önizlemesi için.
4. VPS erişimi ve alan adı DNS yetkisi; Instagram Login erişim anahtarı.
5. Kurumsal kademe tablosu ve numune politikası.

## 9. Riskler

| Risk | Önlem |
|---|---|
| Katalog göçünde içerik kaybı | Seed idempotent, `data.js` arşivde kalır, panelde karşılaştırma listesi |
| Stüdyo yeniden yazımında davranış kırılması | Eski canvas fonksiyonları birebir taşınır, Playwright akışı ilk gün yazılır |
| Fiyat aralığının yanlış beklenti yaratması | "Tahmini, teklifte netleşir" ifadesi ve üst sınır gösterimi |
| Hatırlatıcı mesajlarının izinsiz sayılması | Açık onay, tek tık iptal, yalnızca kullanıcı tarihleri |
| VPS tek nokta arızası | Günlük yedek, haftalık geri yükleme denemesi, Caddy sağlık kontrolü |
