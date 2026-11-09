# Özel gün / hediye / çikolata sitelerinde RENK, TİPOGRAFİ, BOŞLUK ve YERLEŞİM ÖLÇÜMLERİ (kaynak koddan)

**Gözlem tarihi:** 9 Kasım 2026. Tüm hex renk, font, punto, boşluk ve yarıçap değerleri bu tarihte indirilen HTML/CSS snapshot'larından ayıklandı.

**Amaç:** "Beyza Blanc" sitesini (bkz. `D:\PROJECTS\beyza\site`) bu ölçümlerle karşılaştırıp iyileştirmek. Bu yüzden aşağıdaki her değer **tahmin değil, kaynak koddan ölçümdür**; tahmin/çıkarım olan yerler "Çıkarım" başlığı altında açıkça işaretlendi.

**Ekran görüntüsü uyarısı:** Bu araştırmada **hiçbir ekran görüntüsü alınmadı**. Tüm veriler HTTP ile indirilen HTML + CSS dosyalarından regex/ayrıştırma ile çıkarıldı. Bu nedenle "hangi renk nerede, ekranda nasıl görünüyor" iddiaları **kod düzeyinde** doğrulanmıştır; görsel doğrulama (render) yapılmadı. JS ile render edilen SPA sitelerde (moonpig, notonthehighstreet) yalnızca HTML içine gömülü kritik CSS/token katmanı ölçülebildi — bunlar ayrıca işaretlendi.

---

## Yöntem ve kanıt durumu tablosu (site bazında hangi veriyi nasıl aldım)

| # | Site (marka) | Altyapı (kanıt) | Yöntem | Kanıt durumu |
|---|---|---|---|---|
| 1 | Compartés — compartes.com | Shopify Headless/Oxygen + Tailwind (`cdn.shopify.com/oxygen-v2`, `--tw-`) | `curl -L --compressed` HTML + `tailwind-*.css` indirildi | **Renk+font+yerleşim doğrulandı** |
| 2 | Choc on Choc — choconchoc.co.uk | Shopify (`/cdn/shop/t/53/`) | curl HTML + `base.css` + `compiled_assets/styles.css` + Typekit `apu0mbm.css` | **Renk+font+yerleşim doğrulandı** |
| 3 | Milk Bar — milkbarstore.com | Shopify | curl HTML + `layout.theme.css` (957 KB) | **Renk+font+yerleşim doğrulandı** |
| 4 | Baked by Melissa — bakedbymelissa.com | Shopify | curl HTML + `base.css` + Typekit `ine6hcd.css` | **Renk+font+yerleşim doğrulandı** |
| 5 | Vosges Haut-Chocolat — vosgeschocolate.com | Shopify | curl HTML + `base.css`/`custom.css` + 3 Google Fonts CSS | **Renk+font+yerleşim doğrulandı** |
| 6 | ZChocolat — zchocolat.com | PrestaShop + Bootstrap + Elementor (`--bs-`, `theme-*.css`) | curl HTML + `theme-884cde386.css` (613 KB) + Google Fonts + Typekit `bla0egj.css` | **Renk+font+yerleşim doğrulandı** |
| 7 | Godiva (TR) — godiva.com.tr | Shopify (`/cdn/shop/t/86/`) | curl HTML + `theme.css` + `byte.css` | **Renk+font+yerleşim doğrulandı** (TR örneği) |
| 8 | Not On The High Street — notonthehighstreet.com | Custom Next.js + styled-components | curl HTML (403 yok) + HTML içi gömülü 85 KB `<style>` + font preload linkleri | **Renk+font doğrulandı; yerleşim kısmen** (gömülü CSS sınırlı) |
| 9 | Moonpig — moonpig.com | Custom Next.js | curl HTML + HTML içi 5.6 KB kritik `<style>` (tam CSS JS chunk'larında) | **Renk doğrulandı; font doğrulandı (marka fontu); yerleşim zayıf** |
| 10 | Patchi — patchi.com | Laravel + Tailwind (`/build/assets/`) | curl HTML + `app-ltr-*.css` + `app-*.css` + Typekit `dqf2roi` | **Renk+font+yerleşim doğrulandı** |
| 11 | Bateel — bateel.com | Magento 2 (`Magento_Theme`) | normal UA 403 → **Googlebot UA ile** HTML 200 + `styles-m.min.css` (938 KB) | **Renk+font+yerleşim doğrulandı** |
| 12 | See's Candies — sees.com | Custom headless (Mobify bundle) | normal UA 403 → **Googlebot UA ile** HTML 200 + `mod-*.css` (230 KB) | **Renk+font doğrulandı; yerleşim kısmen** |
| 13 | Sugarfina — sugarfina.com | Magento 2 (Corra teması) | HTML 403 (DataDome); **static CSS doğrudan indirildi** (`styles-m.min.css`, `styles-l.min.css`) + Tavily metin | **Renk+font+yerleşim doğrulandı (yalnızca CSS)** |
| — | Leonidas — leonidas.com | — | curl 403 (tüm locale'ler), Tavily "Failed to fetch", TLS handshake başarısız | **ERİŞİLEMEDİ** |
| — | Harry & David — harryanddavid.com | Custom (Contentstack) | curl 406 (Akamai), Tavily yalnızca metin (CSS yok) | **Renk/font ÖLÇÜLEMEDİ** (yalnızca navigasyon metni alındı) |
| — | Prezzybox — prezzybox.com | — | curl 403 → **301 menkind.co.uk/gifts-for-her** yönlendirmesi; menkind.co.uk de 403 | **ERİŞİLEMEDİ** (marka Menkind'e geçmiş görünüyor) |

**Ölçülebilen site sayısı: 13** (hedef 12+ karşılandı). Ölçülemeyen: 3 (leonidas, harryanddavid, prezzybox).

Kullanılan araçlar: `curl -L --compressed` (UA: Chrome 131 / gerektiğinde Googlebot), indirilen dosyalar `D:/tmp/sitegrab/<site>/` altında; ayıklama Python ile `fetch.py` + `analyze.py` + `comp.py` (`D:/tmp/sitework/`).

---

## KQ1 — Renk: baskın hex kodları, kullanım sıklığı, palet sadeliği

### Takeaway
Tüm 13 sitede zemin **beyaz veya çok açık krem/bej**tir ve metin **saf siyah değil, sıcak/soğuk "near-black"** (ör. `#111111`, `#121212`, `#1a1612`, `#231f20`, `#3b3b41`). Aksan rengi ise **tek ve parlak**; iki rakip kamp var: (a) **altın/şampanya** (lüks çikolata), (b) **canlı marka rengi** (pembe/teal/mor/yeşil/mavi — DTC ve genç markalar). Paletler çok sade: tipik olarak 1 zemin + 1 metin + 1 aksan + 2-3 nötr = **4-6 renk**. Bootstrap tabanlı ZChocolat'ın varsayılan mavi (`#0b69f6`) paleti kirletmesi tek "dağınık" istisnadır.

### Cited Findings
Baskın hex'ler (kaynak CSS'te en sık geçen; `analyze.py` renk sayımı):

- **Compartés:** krem/kahve/altın paleti, custom property olarak tanımlı — `--color-cocoa #1a1612`, `--color-chocolate #31261d`, `--color-dark #5c462b`, `--color-milk #94795d`, `--color-cream #f2e9db`, `--color-cream-tint #fefefd`, `--color-gold #c9a75a`, `--color-gold-soft #e6cd8f`, `--color-gold-deep #735c00`, `--color-burgundy-dark #551c25`, `--color-evergreen #22372b` (11 marka rengi). En sık geçen hex'ler: `31261d`, `fefefd`, `94795d`, `1a1612`, `f7f5f2`, `f2e9db` — [tailwind-D23mRmwc.css](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).
- **Choc on Choc:** zemin krem `#f5efe6`, metin/kahve `#3d2016` ve `#3d1f16`, aksan **pembe/magenta** `#d80073` / `#b90661` / `#eb178a`; ayrıca bej `#ded7ce`. Zemin tanımı `body { background: var(--color-background) }` — [base.css](https://choconchoc.co.uk/cdn/shop/t/53/assets/base.css).
- **Milk Bar:** zemin krem `#ffefda` / pembe ton `#ffecf4`, aksan **sıcak pembe** `#e83a87` (ve hover `#e52379`), ikincil mor `#8772f3`, metin `#000000`/`#4e4e4e` — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- **Baked by Melissa:** zemin beyaz `#ffffff` + pembe ton `#f7e6ed`, aksan **magenta** `#e20063`, ayrıca açık mavi `#d5e9f8`, teal `#167c78`, mavi `#1373af`. `--color-button: var(--color-secondary-button)` — [base.css](https://www.bakedbymelissa.com/cdn/shop/t/112/assets/base.css).
- **Vosges:** zemin beyaz `#ffffff` (+ off-white `#f6f6f4`), metin `#000000`, aksan **koyu mor** `#3d1152` / `#440a56` / `#38165f`, ikincil teal-yeşil `#108474` — [base.css](https://www.vosgeschocolate.com/cdn/shop/t/695/assets/base.css).
- **ZChocolat:** zemin `var(--bs-body-bg)`, Bootstrap varsayılanları: `--bs-primary #0b69f6` (mavi), `--bs-secondary #6c757d`, `--bs-light #f8f9fa`, `--bs-dark #212529` + nötr `#171310`. Bootstrap paleti marka paletine karışıyor → **en "dağınık" palet** — [theme-884cde386.css](https://www.zchocolat.com/themes/zchocolat/assets/cache/theme-884cde386.css).
- **Godiva (TR):** zemin beyaz `#ffffff`, metin `#303030`/`#333333`, **altın aksan `#cfb56a`** (tek!) ve gri nötr skalası (`#f0f0f0`, `#cccccc`, `#616161`); link mavisi `#005bd3`. Zemin `rgb(var(--page-background))` — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- **Not On The High Street:** marka moru `#51285f`, zemin krem `#fefbf7`, metin `#3b3b41`, etkileşim `#31153c`, link `#135A72`, negatif `#B01518`, pozitif `#17830F` — token olarak: `--theme-color-content-brand:#51285F`, `--theme-color-content-default:#3B3B41`, `--theme-color-content-link:#135A72` — [notonthehighstreet.com](https://www.notonthehighstreet.com/) (gömülü CSS).
- **Moonpig:** aksan **mavi `#0054c8`** (hover `#0459d9`), ikincil **pembe `#ffa6b6`**, açık mavi `#e6eefa`/`#dae7f1`, koyu lacivert `#00204d`, nötr `#f8f8f9`/`#e8e8e8` — [moonpig.com](https://www.moonpig.com/) (gömülü CSS).
- **Patchi:** zemin krem `rgb(244 238 230)` = `#f4eee6`, aksan **koyu yeşil `#143d34`** (buton), ikincil beyaz, lacivert `#003399`, kırmızı `#ff2d20`, sage `#96ba92` — [app-ltr-BX55qPpj.css](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- **Bateel:** zemin beyaz `#ffffff` + krem `#ebe4e0`/`#eee5e5`, **altın `#c4a577`/`#c3a477`** (tek aksan), kahve-mor metin `#614b50`/`#8a747a`, Magento varsayılan link mavisi `#006bb4` kalıntısı — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- **See's Candies:** zemin beyaz `#ffffff`, metin `--sees-ink #030712` (neredeyse siyah), **altın `--sees-gold #96701b` / `--sees-light-gold #cfaf69` / `#c7a953`**, PayPal sarısı `#ffc439` — [mod-*.css](https://www.sees.com/mobify/bundle/2044/client/assets/mod-337cc548-CYehPFJI.css).
- **Sugarfina:** zemin beyaz `#ffffff`, metin `#222222`, **teal aksan `#6ad1e3`** (hover `#60d0e4`) ve koyu teal `#00606b`, açık teal zemin `#f1fafc` — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css). Not: Sugarfina altın DEĞİL teal kullanır.

### Inferences
- **"Krem zemin" neredeyse evrensel** (13/13 açık zemin), ama **"tek altın aksan" evrensel DEĞİL**: yalnızca 4 site (Godiva-TR, Bateel, See's, ve kısmen Compartés) gerçek altın/şampanya kullanır; 9 site canlı bir marka rengi (pembe/magenta/mor/teal/yeşil/mavi) kullanır.
- Palet sadeliği marka olgunluğuyla ilişkili görünüyor: custom property ile 8-11 renk adlandıran siteler (Compartés, NOTHS, Vosges) daha kontrollü; framework varsayılanını (Bootstrap) sızdıran ZChocolat daha dağınık.
- Aksanın tek olması ortak: her sitede baskın geçen tek bir doygun renk var; geri kalanı nötr gri/krem.

### Gaps
- Hiçbir sitede "bu hex, sayfada kaç piksel alanda görünüyor" gibi **render oranı** ölçülemedi (screenshot yok); sıklık, CSS'te geçiş sayısına dayanır ve gerçek görsel ağırlıkla birebir örtüşmeyebilir.

---

## KQ2 — Tipografi: font aileleri, kaynak, başlık/gövde eşleşmesi, punto skalası, line-height, letter-spacing

### Takeaway
İki baskın model var: **(A) serif başlık + sans gövde** (lüks segment: Compartés/Kepler, Choc on Choc/p22-mackinac-pro, Bateel/Playfair, Sugarfina/baskerville-urw, See's/American Typewriter, ZChocolat/Cormorant Garamond) ve **(B) tek geometrik/condensed sans** (DTC/genç markalar: Milk Bar/Garnett, Baked by Melissa/proxima-nova, Godiva/Gotham, NOTHS/NOTHS Sans, Moonpig/Moonpig, Vosges/Roboto). Font kaynağı üçe dağılıyor: **Google Fonts** (4 site), **Adobe Typekit `use.typekit.net`** (5 site), **self-hosted woff2** (5 site). Gövde punto aralığı dar ve tutarlı: **14-16px**; başlık **h1 28-48px**.

### Cited Findings
**Font aileleri ve kaynağı (font-face / @font-face / link kanıtı):**

- **Compartés:** `--font-sans: Figtree,system-ui,sans-serif` (Google Fonts `Figtree`), `--font-serif-display`/`serif-subhead` = **Kepler** (Adobe Typekit, `gdx7fga.js`); `@font-face` "Kepler fallback Iowan/Charter/Palatino/Georgia". → serif başlık + sans gövde — [tailwind CSS + fonts.googleapis.com Figtree](https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..700;1,300..700&display=swap).
- **Choc on Choc:** gövde `Inter`, başlık `p22-mackinac-pro` (Typekit `apu0mbm.css`); `@font-face` Inter + p22-mackinac-pro — [use.typekit.net/apu0mbm.css](https://use.typekit.net/apu0mbm.css).
- **Milk Bar:** `@font-face` **Garnett** (regular/bold) + **Pitch Bold** (self-hosted); gövde `Garnett` — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- **Baked by Melissa:** gövde `proxima-nova` / `proxima-nova-condensed` (Typekit `ine6hcd.css`); `@font-face` Assistant, Poppins, proxima-nova — [use.typekit.net/ine6hcd.css](https://use.typekit.net/ine6hcd.css).
- **Vosges:** gövde `Roboto`; Google Fonts olarak **Montserrat (w500), Inter, Joan** yükleniyor; `@font-face` Roboto/Montserrat (+Font Awesome ikonlar) — [fonts.googleapis.com Montserrat+Roboto](https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Roboto:wght@400;500;700&display=swap), [Inter+Joan](https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Joan&display=swap).
- **ZChocolat:** başlık **Cormorant Garamond** (Google) + Typekit `garamond-premier-pro`, alternatif serif `Isidora`/`AGaramond`; sans gövde `Jost` / `Manrope` (Google) / `Inter` — [fonts.googleapis.com Cormorant Garamond](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600&display=swap), [use.typekit.net/bla0egj.css](https://use.typekit.net/bla0egj.css).
- **Godiva (TR):** self-hosted **Gotham** ailesi — `@font-face`: Gotham, Gotham Medium, Gotham Bold, Gotham Light; gövde `system_ui/-apple-system`. Google Fonts/Typekit yok — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- **NOTHS:** self-hosted **NOTHS Sans No3**, NOTHS Sans No2, **NOTHS Suisse Neue** (woff2 preload: `noths_sans_3_regular.woff2`, `noths_suisse_neue_medium.woff2`); ayrıca `Lato` — [notonthehighstreet.com](https://www.notonthehighstreet.com/) (font preload linkleri).
- **Moonpig:** tek marka fontu **"Moonpig"**, fallback `Arial,Sans-Serif`; `@font-face` Moonpig — [moonpig.com](https://www.moonpig.com/) (gömülü CSS).
- **Patchi:** gövde `ui-sans-serif,system-ui`; Arapça için **Noto Kufi Arabic** (Google Fonts); özel `fenwick` + Lineicons; Typekit `dqf2roi` — [app-ltr CSS + fonts.googleapis.com Noto Kufi Arabic](https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900).
- **Bateel:** başlık **Playfair Display** (`'Playfair Display',Georgia,'Times New Roman',Times,serif`), gövde **Brown** / Brown Light / Brown Bold (self-hosted `@font-face`), yardımcı Open Sans — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- **See's:** gövde `Roboto`, vurgu serif **American Typewriter** (`@font-face` American Typewriter), genel sans `var(--font-sans)` — [mod-*.css](https://www.sees.com/mobify/bundle/2044/client/assets/mod-337cc548-CYehPFJI.css).
- **Sugarfina:** gövde **brandon-grotesque** (Typekit, sans), vurgu serif **baskerville-urw** (Typekit); ikon fontları luma-icons/sugicons; başlıklarda "Arial Black" vurgusu — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css). Kaynak: Adobe Fonts (kendi hosted); Google Fonts linki yok.

**Punto skalası (CSS `font-size` frekansı, px'e çevrildi; en sık 4-6 değer):**

| Site | Gövde (en sık) | Başlık h1 / h2 / h3 (ölçülen) |
|---|---|---|
| Compartés | 15px, 14px, 16px | `h1{font-size:inherit}` (Tailwind utility sınıfları taşıyor; px ölçülemedi) |
| Choc on Choc | 12/10/11px mikro + 14/16px | `h1/h2/h3 { font-size: var(--font-h1--size) }` (token) |
| Milk Bar | 13/16/14px | h1: `2em` / `53px` / `40px` (breakpoint'e göre) |
| Baked by Melissa | 16/22/26px | **h1 = calc(scale*3rem)=48px**, **h2 = 32px**, **h3 = 28px** |
| Vosges | 15/14px, 16/20px | **h1 = calc(scale*3rem)=48px**, h3 = calc(scale*1.7rem) |
| ZChocolat | 14/16/12px | h1=calc(body*2), h2=*1.5, h3=*1.25 |
| Godiva (TR) | 12/14/13/16px | tema token (`--heading-font-family`) |
| NOTHS | 16px, 18px, 14px | token (`--theme-typography-heading-*`) |
| Moonpig | 16/20/24/28px | **h1=1.75rem=28px, h2=1.5rem=24px, h3=1.25rem=20px** |
| Patchi | 12/14/18px, 24px | inherit (Tailwind sınıfları) |
| Bateel | 14/18/16/12px | **h1=2.3rem, h2=2.3rem, h3=1.6rem** (Playfair) |
| See's | 16/14px, 30/38px | sayısal yakalanamadı (kısmen) |
| Sugarfina | 14/16/12px, 18px | **h1=3rem=48px, h2=2.4rem=38px, h3=2.1rem=34px** |

**Line-height (en sık):** gövde 1.4-1.6 (Compartés `1.5/1.6`, Sugarfina `1.42857143`, NOTHS rem tabanlı `1.5rem`/`1.3125rem`); başlık 1-1.2 (Compartés `1.2`, Choc on Choc `1.2/1.3`, Godiva `1.2`). Milk Bar/Bateel/See's px tabanlı (`18px`, `20px`, `23px`, `30px`).

**Letter-spacing (en sık):** çoğu site **uppercase etiket/başlıkta tracking** kullanır: ZChocolat `.22em` / `.24em` / `.42em` (en agresif), Choc on Choc `0.05em`/`0.02em`, Baked by Melissa `.1rem`/`.06rem`, Vosges `0.1rem`/`.07em`, Sugarfina `-4%`/`1%` (harf), Patchi `inherit` (tracking yok), NOTHS `var(--theme-typography-heading-letter-spacing)`.

### Inferences
- Lüks çikolata segmenti (ZChocolat, Bateel, See's, Sugarfina, Compartés, Choc on Choc) **serif kimliği** kullanmaya meyilli; DTC/kitle markaları (Milk Bar, Baked by Melissa, Godiva, Moonpig, NOTHS) **markaya özel geometrik sans** kullanıyor. Bu, "hediye sitesi = serif" genellemesinin yanlış olduğunu gösterir.
- Uppercase + geniş letter-spacing (`.05-0.42em`) lüks algısı için ortak bir tipografik araç; gövde metninde tracking ~0/normal.
- Google Fonts kullanan sitelerin ortak seçimi **Cormorant Garamond, Manrope, Jost, Inter, Figtree, Montserrat, Noto Kufi Arabic**; bunlar ücretsiz ve butik ölçekte erişilebilir. Typekit/self-hosted fontlar (proxima-nova, brandon-grotesque, Gotham, Brown, Garnett, Moonpig) lisanslı ve pahalı.

### Gaps
- Token tabanlı sitelerde (Choc on Choc, Godiva, NOTHS, Moonpig, Baked by Melissa, Vosges) `h1` punto değeri `var(--...)` olduğu için **gerçek px değeri CSS'te çözümlenemedi**; root'ta tanımlı `--font-h1--size` gibi token'lar çıkarılamadı (bazıları JS/theme settings'ten geliyor).
- Font **dosya boyutu/performans** (FOUT, preload stratejisi) ölçülmedi.

---

## KQ3 — Yerleşim: konteyner genişliği, kolonlar, ürün kartı oranı, bölüm dikey boşlukları, arka plan ritmi

### Takeaway
Konteyner genişliği **1140-1280px** bandına oturuyor (en sık 1200px civarı; Tailwind tabanlılar 1280px/80rem; NOTHS 1440px ile daha geniş). Bölüm dikey boşluğu **48-96px** (yaygın 60-96px), en cömert See's (94-104px). Ürün kartı oranları **1:1 ve 4:3** baskın; bazıları 3:4/4:5 (dikey). Arka plan "tam beyaz → krem/off-white → görsel blok" ritmiyle değişiyor.

### Cited Findings
**Konteyner / max-width (en sık):**
- Compartés: Tailwind `.container` 40/48/64/**80rem(1280px)/96rem(1536px)** — [tailwind CSS](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).
- Choc on Choc: `749px` (132 kez, mobil), **`1200px`** (10 kez, masaüstü), `989px` — [base.css](https://choconchoc.co.uk/cdn/shop/t/53/assets/base.css).
- Milk Bar: `1199px` (489 kez), `799px`, **`1200px`** (46), `1170px`, `1600px` — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- Baked by Melissa: `749px`, `989px`, **`page-width--narrow: 72.6rem` (1162px)** — [base.css](https://www.bakedbymelissa.com/cdn/shop/t/112/assets/base.css).
- Vosges: `767px`, `991px`, **`.product_container: 1360px`**, **`.cust_container: 1230px`** — [custom.css](https://www.vosgeschocolate.com/cdn/shop/t/695/assets/custom.css).
- ZChocolat: Bootstrap `.container` **1140px / 1320px**, `.container--limited-xxl 1320px` — [theme CSS](https://www.zchocolat.com/themes/zchocolat/assets/cache/theme-884cde386.css).
- Godiva (TR): `699px`, `999px`, **`1149px` / `1200px`** — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- NOTHS: `767px`/`1023px` (breakpoint), **`90rem`=1440px**, `1450px` → en geniş konteyner — [notonthehighstreet.com](https://www.notonthehighstreet.com/).
- Patchi: Tailwind breakpoint'leri `640/768/1024/1280/1536`, +`1200px` — [app-ltr CSS](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- Bateel: `767px`, **`1280px`** (footer/top-controls), `980px` — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- See's: `639px`, `1023px`, **`1368px`**, `section-container: var(--breakpoint-2xl)` — [mod-*.css](https://www.sees.com/mobify/bundle/2044/client/assets/mod-337cc548-CYehPFJI.css).
- Sugarfina: `767px`, `1024px`, **`1280px`** — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css).

**Bölüm dikey boşlukları (padding-top/bottom):**
- Compartés: `top:8px/bottom:12px` (mikro), **`top:72px`, `bottom:64/72/96px`, `top:48px`, `bottom:48px`** → 48-96px bölüm boşluğu — [tailwind CSS](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).
- Milk Bar: `top:15/30/60/90px`, `bottom:15/30/60/90px` → 60-90px — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- Patchi: **`top:3rem`(19 kez), `bottom:3rem`(16)** = 48px, +`1rem/2rem` — [app-ltr CSS](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- See's: **`top:60px`, `top:94px`, `bottom:104px`** → en cömert — [mod-*.css](https://www.sees.com/mobify/bundle/2044/client/assets/mod-337cc548-CYehPFJI.css).
- Bateel: `top:10/20/30px`, `bottom:10/15/20/30px` (Magento, modüler) — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- Sugarfina: `bottom:15px`, `top:5px`, `top:10/11/15/20px` (komponent düzeyi) — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css).

**Ürün kartı / görsel oranı:** 1:1 en yaygın; dikey oranlar da var:
- Patchi: `aspect-ratio` 1/1, 16/9, 2/3 — [app-ltr CSS](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- Choc on Choc: 1/1, 16/9, **3/4** (dikey ürün) — [base.css](https://choconchoc.co.uk/cdn/shop/t/53/assets/base.css).
- Vosges: 1/1, 16/9, **2/3, 4/3** — [base.css](https://www.vosgeschocolate.com/cdn/shop/t/695/assets/base.css).
- Milk Bar: 16/9, **4/5** — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- NOTHS: 1/1, 16/9, 4/3, 4/5 — [notonthehighstreet.com](https://www.notonthehighstreet.com/).

### Inferences
- Konteyner standardı **~1200px**; daha geniş (1360/1440px) tercih edenler daha "editoryal/marketplace" hissi veriyor (Vosges, NOTHS), 1140-1200px daha "butik" hissi veriyor.
- Bölüm dikey boşluğu **büyük ölçüde 48-96px**; aradaki fark lüks konumlandırmayla ilişkili (See's/ZChocolat üst bantta). Bu, Beyza'nın "cömert boşluk" hedefi için doğrudan bir ölçek referansı.
- Ürün görseli oranı 1:1 baskın, ama lüks markalar dikey (3:4/2:3/4:5) kullanmaya meyilli — paketli çikolata kutusu dikey kompozisyona daha uygun.

### Gaps
- Gerçek **kolon sayısı** (görsel ızgarada kaç kart/desktop) çoğu sitede HTML/JS'ten çıkmadı; yalnızca aspect-ratio ve breakpoint ölçüldü. Masaüstü kolon sayıları (3/4 sütun) render gerektirirdi.

---

## KQ4 — Bileşenler: buton yarıçapı/dolgusu, kart yarıçapı, gölge, çizgi, badge

### Takeaway
İki zıt köşe stili egemen: **köşeli/lüks** (radius 0-4px) ve **yumuşak** (radius 8-10px + pill `999px`). Gölge çoğunlukla **yok veya çok hafif**; ayrım için gölge yerine **1px çizgi ve inset border** kullanılıyor. Butonlar ya dolu (koyu/kahve/yeşil) ya outline (1px border) ve sık sık uppercase + tracking.

### Cited Findings
**Border-radius (en sık):**
- Choc on Choc: **`0px` (180 kez!)** + `0` (26), `50%`, `1px` (20), `100px` (16, pill), `4px` → belirgin şekilde köşeli — [base.css](https://choconchoc.co.uk/cdn/shop/t/53/assets/base.css).
- ZChocolat: `var(--bs-border-radius)` (=6px), `0`, `4px`, `.25rem` — [theme CSS](https://www.zchocolat.com/themes/zchocolat/assets/cache/theme-884cde386.css).
- See's: yalnızca `0` ve `50%` → **tamamen köşeli** — [mod-*.css](https://www.sees.com/mobify/bundle/2044/client/assets/mod-337cc548-CYehPFJI.css).
- Bateel: `0` (28), `3px` (23), `4px` (19), `50%`, `10px` — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- Sugarfina: `0` (23), `50%`, `100%`, `2px`, `3px`, `4px`, `100px` (pill) — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css).
- Vosges: `0`, `2px`, `5px`, `20px`, `50%` — [base.css](https://www.vosgeschocolate.com/cdn/shop/t/695/assets/base.css).
- Godiva (TR): `8px` (24), `50%`, `6px` (21), `4px` (11), `10px`, **`999px`** (pill) — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- NOTHS: **`0.625rem`=10px** (14), `4px`, `12px`, + token `--theme-border-radius-md-*` — [notonthehighstreet.com](https://www.notonthehighstreet.com/).
- Milk Bar: `100%`, `0`, `50%`, `6px`, `30px` (pill buton), `8px` — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- Patchi: `0.25rem`=4px (23), `0`, **`9999px`** (pill), `50%`, `.375rem` — [app-ltr CSS](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- Compartés: **`9999px`** (pill, 4), `4px`, `999px`, `--radius-card` — [tailwind CSS](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).
- Baked by Melissa: `var(--inputs-radius)`, `var(--media-radius)`, `8px`, `50%`, `6px` — [base.css](https://www.bakedbymelissa.com/cdn/shop/t/112/assets/base.css).

**Buton dolgusu / stili:**
- Compartés `.btn`: `padding:10px 18px`, `background-color:var(--color-cocoa)`, `font-size:var(--text-caps-md)`, `text-transform:uppercase`, `letter-spacing:var(--button-cta-tracking)`, `border:1px solid #0000`; `.btn-invert{background:var(--color-cream-tint)}` — [tailwind CSS](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).
- Bateel `button`/`.abs-action-link-button`: `padding:13px 37px`, `border-radius:3px`, `background:#fff`, `font-size:1.4rem`, `border:1px solid #614b50` → **outline buton** — [styles-m.min.css](https://prod-bateel.gumlet.io/static/version1792613644/frontend/Bateel/default/en_US/css/styles-m.min.css).
- Patchi `.btn`: `background-color:rgb(20 61 52)`=#143d34, `font-size:.875rem`; `.btn:hover{background:transparent}` → **dolu yeşil → outline hover** — [app-ltr CSS](https://patchi.com/build/assets/app-ltr-BX55qPpj.css).
- Godiva (TR) `.button`: `padding:.65rem 1.75rem`, `border-radius:var(--button-border-radius)`, `border:1px solid rgb(var(--button-outline-color))`, `text-transform:var(--button-text-transform)`, `letter-spacing:var(--button-letter-spacing)` — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- ZChocolat `.btn`: `padding:var(--bs-btn-padding-y) var(--bs-btn-padding-x)`, `border-radius:.25rem`(4px), `border:var(--bs-btn-border-width) solid ...` — [theme CSS](https://www.zchocolat.com/themes/zchocolat/assets/cache/theme-884cde386.css).

**Gölge (en sık):** neredeyse tümünde **`none`** ilk değer; varsa hafif:
- Baked by Melissa: `0 8px 16px #0003` — [base.css](https://www.bakedbymelissa.com/cdn/shop/t/112/assets/base.css).
- Milk Bar: `0 0 8px #0000001a`, `0 2px 6px 1px #0000004d` — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).
- Godiva (TR): `0 1px 2px rgba(0,0,0,.05)` — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css).
- Sugarfina: `1px 4px 3px rgba(50,50,50,.64)`, `0 3px 5px 0 rgba(50,50,50,.75)`, inset `#fff` çizgiler — [styles-m.min.css](https://www.sugarfina.com/static/version1793797101/frontend/Corra/sugarfina/en_US/css/styles-m.min.css).
- Vosges: `-2px 5px 10px rgba(0,0,0,0.04)`, `0px -10px 20px rgb(0 0 0/10%)` — [base.css](https://www.vosgeschocolate.com/cdn/shop/t/695/assets/base.css).
- Compartés: inset border tabanlı (`inset 0 -1px 0 0 var(--form-field-focus)`, `inset 0 0 0 1px var(--color-gold-deep)`) → gölge yerine çizgi — [tailwind CSS](https://cdn.shopify.com/oxygen-v2/54912/168548/344613/4998389/assets/tailwind-D23mRmwc.css).

**Çizgi (border) kullanımı:** `border` değerleri `1px solid` baskın; Choc on Choc `1px` 20 kez (hairline), Bateel `1px solid #614b50` (buton çerçevesi), Compartés inset 1px (çizgi estetiği).

**Badge/etiket:** tüm sitelerde `badge`/`label`/`pill`/`tag` sınıf aileleri mevcut (kod düzeyinde `badge|label|pill|tag` regex eşleşmesi tümünde True); Godiva TR'de `cdfee1` (açık yeşil) ve `dee6ff` (açık mavi) gibi badge arka plan tonları tespit edildi — [theme.css](https://www.godiva.com.tr/cdn/shop/t/86/assets/theme.css). Milk Bar `--color-...` etiketleri (kırmızı `#ff3333` indirim) — [layout.theme.css](https://milkbarstore.com/cdn/shop/t/147/assets/layout.theme.css).

### Inferences
- **"Köşeli lüks" vs "yuvarlak samimi"** ayrımı net: See's/Choc on Choc/Bateel/ZChocolat çoğunlukla 0-4px; Godiva/NOTHS/Milk Bar/Compartés/Patchi yuvarlak + pill. Karışık değil — her marka kendi ucunda tutarlı.
- Gölge kullanımı sektörde **bilinçli olarak minimal**; derinlik gölgeyle değil, 1px çizgi/inset border ve renk bloğu geçişleriyle veriliyor. Bu, Beyza için "gölge ekle" yerine "çizgi + boşluk + renk ritmi" tavsiyesini destekler.

### Gaps
- Butonların **hover/focus renkleri** ve erişilebilirlik (kontrast oranı, WCAG) hesaplanmadı.
- Kart gölgesi olup olmadığı ürün ızgaralarında (JS render) tam doğrulanamadı.

---

## KQ5 — Sticky/floating öğeler ve mobil yapısal farklar

### Takeaway
**Sabit (sticky) header kod düzeyinde çok yaygın**: Choc on Choc (13 `position:sticky`), Godiva TR (12), Patchi (10), Milk Bar (7), Vosges (5). **Yüzen sohbet/WhatsApp balonu da yaygın**: 13 sitenin 8'inde (bakedbymelissa, patchi, vosges, moonpig, noths, milkbar, godiva_tr, choconchoc) üçüncü taraf chat aracı veya WhatsApp linki tespit edildi.

### Cited Findings
**Sticky header / sticky eleman (`position:sticky` sayımı, `analyze.py`):**
- Choc on Choc **13**, Godiva (TR) **12**, Patchi **10**, Milk Bar **7**, Vosges **5**, Compartés **3**, Baked by Melissa **2**, See's **2**, ZChocolat **17** (en yüksek), NOTHS **0** (gömülü CSS'te yok), Moonpig **0**, Bateel **0**, Sugarfina kod düzeyinde yoğun sticky içeriyor (`headSticky~61` işaretçisi) — kaynak: ilgili site CSS dosyaları (yukarıdaki tablo).
- Sticky "sepete ekle" (sticky ATC) işaretçisi: **Choc on Choc, Bateel, Milk Bar** sitelerinin CSS'inde tespit edildi (`sticky-atc|sticky-cart|sticky-buy` regex); diğerlerinde bulunamadı.
- **Yüzen sohbet/WhatsApp** (üçüncü taraf tespiti):
  - Compartés → Crisp; Baked by Melissa → HubSpot, Zendesk; Milk Bar → Crisp, HubSpot; Vosges → Gorgias, Crisp, HubSpot, Intercom; Godiva TR → HubSpot, Intercom; NOTHS → Drift; Patchi → **tawk.to**; Moonpig → HubSpot, Intercom — ilgili CSS/HTML.
  - `wa.me`/WhatsApp linki: Choc on Choc, Milk Bar, Baked by Melissa, Vosges, Godiva TR, Patchi, Bateel sitelerinde tespit edildi.

**Mobil / menu yapısı:** drawer/hamburger/off-canvas işaretçisi (`drawer-menu|mobile-menu|hamburger|off-canvas`) Compartés, Choc on Choc, Milk Bar, Baked by Melissa, Vosges, Godiva TR, Patchi, Bateel, Sugarfina'da True; NOTHS ve Moonpig'in gömülü CSS'inde tespit edilemedi (JS render). Ürün kartı oranları mobilde dikeye kayıyor (Patchi 2/3, Milk Bar 4/5).

### Inferences
- Sticky header **sektör normu**; butik ölçekte tek satır CSS (`position:sticky; top:0`) ile erişilebilir.
- Yüzen iletişim balonu (WhatsApp/chat) hem güven hem dönüşüm için yaygın; bir WhatsApp `wa.me` linkiyle butik ölçekte ücretsiz çözülebilir (Godiva TR / Bateel / Patchi'de WhatsApp mevcut).

### Gaps
- **Ekran görüntüsü/render olmadığı için** sticky header'ın mobilde gizlenip gizlenmediği, sticky CTA'nın gerçek davranışı ve mobil kolon sayıları **doğrulanamadı** (yalnızca CSS işaretçisi).
- Bazı sticky sayımları yanlış pozitif olabilir (birden fazla `position:sticky` bir header'da toplanabilir); bu değerler "kanıt düzeyi" değil "işaretçi düzeyi"dir.

---

## Siteler arası ortak tasarım kalıpları (ölçüme dayalı)

**Doğrulanan kalıplar:**

1. **Açık zemin evrensel.** 13/13 site beyaz (`#ffffff`) veya çok açık krem/bej (`#fefefd`, `#f2e9db`, `#fff8f3`, `#fefbf7`, `#f5efe6`, `#ffefda`, `#f4eee6`, `#ebe4e0`) zemin. → **Kalıp: krem/beyaz zemin** doğru.
2. **Metin = near-black, saf siyah değil.** `#111111` / `#121212` / `#1a1612` / `#231f20` / `#3b3b41` / `#030712`. → Sıcak/soğuk near-black metin normu.
3. **Tek doygun aksan rengi.** Her sitede 1 marka rengi; geri kalan nötr. → **Kalıp: tek aksan** doğru. **Ama "altın" değil:** yalnızca 4/13 site altın kullanıyor; çoğunluk canlı renk (pembe/magenta/mor/teal/yeşil/mavi). → "Tek altın aksan" **zayıf doğrulanan** kalıp (azınlık).
4. **Serif başlık = azınlık (~6/13).** Çoğu site markaya özel geometrik/condensed sans kullanıyor (Gotham, proxima-nova, Garnett, Brown, Moonpig, NOTHS Sans, brandon-grotesque, Figtree). → "Serif başlık" hakim DEĞİL.
5. **Konteyner ~1200px** (1140-1280px bandı; istisna NOTHS 1440px, Vosges 1360px).
6. **Bölüm dikey boşluğu 48-96px** (yaygın 60-96px; Patchi 48px, See's 104px uçları).
7. **Gövde punto 14-16px**, **h1 28-48px**, mikro etiket 10-12px. Line-height gövde 1.4-1.6, başlık 1-1.2.
8. **Uppercase + letter-spacing** (`.02-0.42em`) lüks başlık/etiket aracı; gövdede ~normal.
9. **İki köşe stili:** köşeli lüks (0-4px) vs yuvarlak (8-10px + pill 999px).
10. **Gölge minimal/yok**; ayrım 1px çizgi + inset border ile.
11. **Sticky header yaygın**, **yüzen chat/WhatsApp yaygın** (8/13).
12. **Ürün kartı 1:1 veya dikey (3:4/2:3/4:5)**.

**Zayıf/yanlış çıkan varsayım:**
- **"Krem zemin + tek altın aksan + serif başlık" üçlüsü hâkim DEĞİL.** Krem zemin hâkim; ama altın aksan azınlık, serif başlık azınlık. Lüks çikolata segmentinde (Compartés, Bateel, See's, ZChocolat) üçlü doğru; DTC/genç markalarda (Milk Bar, Baked by Melissa, Patchi, Sugarfina, NOTHS, Moonpig, Godiva, Vosges, Choc on Choc) kırılıyor.

---

## Butik ölçekte erişilebilir / erişilemez tablo

| Ölçülen kalıp | Kanıt (hex/değer) | Butik ölçekte erişilebilir mi? |
|---|---|---|
| Krem/beyaz zemin | `#ffffff` / `#fff8f3` / `#fefbf7` / `#f2e9db` | **Evet** — tek hex CSS değişkeni |
| Near-black sıcak metin | `#1a1612` / `#3b3b41` / `#231f20` | **Evet** — ücretsiz |
| Tek parlak aksan (altın) | `#c9a75a` / `#c4a577` / `#96701b` / `#cfb56a` | **Evet** |
| Tek parlak aksan (canlı: pembe/teal/mor/yeşil) | `#e83a87` / `#6ad1e3` / `#3d1152` / `#143d34` | **Evet** |
| Serif başlık + sans gövde | Cormorant Garamond + Manrope/Jost (Google) | **Evet** — Google Fonts ücretsiz. (Beyza zaten Cormorant Garamond + Inter kullanıyor) |
| Adobe Typekit fontlar | proxima-nova, brandon-grotesque, p22-mackinac-pro, Kepler, garamond-premier-pro | **Hayır** — Adobe Fonts ücretli/abonelik; ücretsiz yakın eşdeğer gerekir |
| Self-hosted lisanslı marka fontu | Gotham, Brown, Garnett, Moonpig, NOTHS Sans | **Hayır** — ticari lisans pahalı; yakın Google eşdeğeri şart |
| Unicode ikon fontu | Material Symbols (Google, ücretsiz) | **Evet**; Font Awesome Pro/luma-icons ticari → **Hayır** |
| Konteyner ~1200px | `max-width:1200px` | **Evet** |
| Bölüm boşluğu 60-96px | `padding:64px 0` vb. | **Evet** |
| Köşeli lüks görünüm | `border-radius:0-4px` | **Evet** |
| Pill buton | `border-radius:999px/9999px` | **Evet** |
| Minimal gölge / 1px çizgi | `box-shadow:none` + `border:1px solid` | **Evet** |
| Uppercase + tracking başlık | `text-transform:uppercase; letter-spacing:.1em` | **Evet** |
| Sticky header | `position:sticky; top:0` | **Evet** — saf CSS |
| Yüzen WhatsApp/chat balonu | `wa.me/...` linki veya fixed div | **Evet** — WhatsApp linki ücretsiz; Crisp/Intercom/Gorgias **Hayır** (ücretli 3rd-party) |
| Ürün kartı 1:1 / dikey | `aspect-ratio:1/1` veya `3/4` | **Evet** |
| Headless/Shopify Oxygen, Magento, Next.js altyapısı | Compartés (Oxygen), Bateel/Sugarfina (Magento), NOTHS/Moonpig (Next.js) | **Hayır** — butik ölçekte gereksiz/pahalı |
| Kişiselleştirme (kart/hediye notu, foto) | Moonpig, Baked by Melissa | **Hayır** — özel üretim/entegrasyon işi |
| Hero video / 3D / çoklu kampanya bloğu | tüm büyük siteler | **Hayır** — bütçe/üretim yükü |

---

## Beyza Blanc ile ilk karşılaştırma notu (ölçüm → ölçüm)

Beyza Blanc mevcut token'ları (`D:\PROJECTS\beyza\site\assets\css\style.css`): zemin krem `#fff8f3`, krem-koyu `#f6ebdc`, metin kahve `#3d2016`, altın `#cfb56a` / `#a98336`, çizgi `#e6d9c8`, yeşil `#2e5a4b`; font `Cormorant Garamond` (başlık) + `Inter` (gövde) — **Google Fonts**; konteyner `--genislik: 1180px`; radius `4/8/16/999px`; gölge `0 1px 2px` / `0 8px 24px`; h1 `clamp(2.1rem,5vw,3.4rem)`.

**Ölçüm karşılaştırması (sektör medyanına göre):**
- Zemin/metin/aksan: **sektörle uyumlu** (krem + near-black kahve + tek altın).
- Font: Cormorant Garamond + Inter kombinasyonu **ZChocolat ile birebir aynı serif+sans modeli** — geçerli ve ücretsiz.
- Konteyner 1180px: sektör bandının (1140-1280px) **içinde**, uyumlu.
- Radius `16px` (r-3): sektörde kart için 16px biraz yüksek; çoğu lüks site 0-10px kullanıyor. **Değerlendirilebilir.**
- Gölge (`0 8px 24px`): sektör ortalamasından **biraz daha belirgin**; sektör minimal gölgeye/çizgiye meyilli. **Değerlendirilebilir.**
- Eksikler (sektörde yaygın, Beyza'da teyit edilecek): sticky header, yüzen WhatsApp, ürün kartı aspect-ratio, uppercase+tracking etiketler, micro-type (10-12px) katmanı.

_Not: Bu karşılaştırma yalnızca Beyza `style.css` token'larıyla yapıldı; Beyza'nın tüm sayfalarının render'ı incelenmedi._

---

## Kanıt durumu özeti (site bazında)

| Site | Renk | Font | Yerleşim | Bileşen | Not |
|---|---|---|---|---|---|
| Compartés | Doğrulandı | Doğrulandı (Figtree+Kepler) | Doğrulandı | Doğrulandı | Tailwind/Oxygen |
| Choc on Choc | Doğrulandı | Doğrulandı (Inter+p22-mackinac) | Doğrulandı | Doğrulandı | pembe aksan |
| Milk Bar | Doğrulandı | Doğrulandı (Garnett) | Doğrulandı | Doğrulandı | pembe aksan |
| Baked by Melissa | Doğrulandı | Doğrulandı (proxima-nova) | Doğrulandı | Doğrulandı | magenta aksan |
| Vosges | Doğrulandı | Doğrulandı (Roboto+Monserrat+Joan) | Doğrulandı | Doğrulandı | mor aksan |
| ZChocolat | Doğrulandı | Doğrulandı (Cormorant+Jost/Manrope) | Doğrulandı | Doğrulandı | Bootstrap palet sızıntısı |
| Godiva (TR) | Doğrulandı | Doğrulandı (Gotham) | Doğrulandı | Doğrulandı | **TR örneği**, altın |
| NOTHS | Doğrulandı | Doğrulandı (NOTHS Sans/Suisse) | Kısmen (gömülü CSS) | Kısmen | Next.js SPA |
| Moonpig | Doğrulandı | Doğrulandı (Moonpig fontu) | Zayıf (kritik CSS) | Zayıf | Next.js SPA |
| Patchi | Doğrulandı | Doğrulandı (fenwick+Noto Kufi) | Doğrulandı | Doğrulandı | yeşil aksan |
| Bateel | Doğrulandı | Doğrulandı (Brown+Playfair) | Doğrulandı | Doğrulandı | altın; Googlebot UA |
| See's | Doğrulandı | Doğrulandı (Roboto+American Typewriter) | Kısmen | Kısmen | altın; Googlebot UA |
| Sugarfina | Doğrulandı | Doğrulandı (brandon-grotesque+baskerville) | Doğrulandı | Doğrulandı | yalnızca static CSS; teal |
| Leonidas | **Erişilemedi** | — | — | — | 403 / Tavily fail |
| Harry & David | **Ölçülemedi** | — | — | — | 406; Tavily yalnızca metin |
| Prezzybox | **Erişilemedi** | — | — | — | menkind.co.uk'e 301 |

---

## Gaps (tüm araştırma için ortak eksikler)

- **Ekran görüntüsü/render yok** → "hangi renk nerede, hangi oran görsel olarak nasıl" iddiaları yalnızca kod düzeyinde; gerçek görsel doğrulama yapılmadı.
- JS ile render edilen SPA'lar (moonpig, notonthehighstreet) ve token tabanlı temalar (Choc on Choc, Godiva, Baked by Melissa, Vosges, NOTHS) için **çözümlenmiş (computed) px değerleri** alınamadı.
- Masaüstü **kolon sayısı** ve gerçek **ızgara düzeni** render gerektirdiği için ölçülemedi.
- Leonidas, Harry & David, Prezzybox (Menkind) için **hiçbir tasarım verisi** elde edilemedi.
- Renklerin **kullanım alanı oranı** (ekranda yüzde) ve **erişilebilirlik kontrast oranları** hesaplanmadı.
