# Özel Gün Odaklı Çikolata / Hediyelik E-Ticaret Sitelerinin SOMUT TASARIM KANITLARI

> **Amaç ve kapsam.** Bu notların tek amacı, önceki araştırmacının kapatamadığı boşluğu doldurmaktır: tahmin değil, **canlı sayfa kaynağından (HTML / CSS) çıkarılmış** renk kodu, font ailesi, menü etiketi, hero metni, URL kalıbı, sepet/kişiselleştirme izi ve altyapı izi. Görsel piksel karşılaştırması / ekran görüntüsü alınamamıştır (bkz. Yöntem ve Gaps).
>
> **Gözlem tarihi:** Tüm alan adları **9 Kasım 2026** tarihinde, tarayıcı User-Agent'ı ile alınmıştır.
>
> **Yöntem (site başına yazılmıştır):** Sayfa HTML'i `curl -L --compressed` ile indirilip; `<link rel="stylesheet">`, `<style>`, `font-family`, hex renk kodları, `--css-değişkenleri`, `meta name="generator"`, `<nav>` etiketleri, `<h1>/<h2>`, ürün/collection URL kalıpları Python (regex) ile ayıklandı; mümkün olduğunda **ana tema CSS dosyası ayrıca indirilip** renk/font değişkenleri doğrulandı. Bot koruması nedeniyle `curl` HTTP 403 / Cloudflare challenge dönen siteler için **Tavily extract (advance)** kullanıldı; bu sitelerde renk/font **kanıtı elde edilemedi** ve açıkça belirtildi.
>
> **ÖNEMLİ KANIT UYARISI (platform tespiti):** Basit `grep "mage/"` araması Magento'yu değil, **`image/`** yolunu ("image" içinde "mage/") yakalar. Bu yüzden aşağıda hiçbir site "Magento" olarak işaretlenmemiştir sadece bu izle; platform iddiaları yalnızca **`cdn.shopify.com`, `wp-content`/`wp-includes`, `/themes/.../cache/theme-*.css` (PrestaShop), `build/assets`+Livewire (Laravel), `_next/static` (Next.js)** gibi güvenilir izlere dayandırılmıştır.

---

# BÖLÜM A — Global Siteler (kanıt bloğu olan 9 site)

## 1) choconchoc.co.uk — Choc on Choc (Birleşik Krallık)

**Yöntem:** curl ile HTML (1.06 MB, HTTP 200) + `base.css` + `use.typekit.net/apu0mbm.css` doğrudan indirildi. Gözlem: 9 Kasım 2026.

**Altyapı izleri (doğrulandı):** `cdn.shopify.com` + `/cdn/shop/t/...` + `portable-wallets` → **Shopify**. Ek: Klaviyo (e-posta), GTM, Wishlist Hero (cdn.shopify.com/extensions).

**Renk (CSS'ten çıkarıldı):**
- Arka plan: `#FFFFFF`; ikincil/krem zemin: `#F5EFE6` (rgb 245 239 230).
- Metin / başlık (foreground-heading): `#3D2016` (rgb 61 32 22 — koyu kahve) ve `rgb(0 0 0)`.
- **Birincil buton / vurgu magentası:** `#B90661` (rgb 185 6 97) — `--color-background` / `--color-border` tokenlarında buton zemini olarak geçiyor.
- Yardımcı: `#333333` (koyu gri zemin), durum renkleri `#8B0000` (error), `#006400` (success), `#3ED660` (stokta).
- Not: ekranda görülen `#EB001B, #F48120, #F79E1B, #3086C8` gibi hex'ler ödeme/rozet ikonlarından gelir, marka paleti değildir.

**Tipografi (doğrulandı):**
- Gövde + accent: `Inter, sans-serif` (`--font-body--family: Inter, sans-serif`; `--font-accent--family: Inter`).
- Başlık: **Typekit `p22-mackinac-pro` (serif)** — `use.typekit.net/apu0mbm.css` içinde `font-family:"p22-mackinac-pro"` olarak yükleniyor.
- Yani: **serif display başlık + Inter sans gövde**. El yazısı vurgu fontu tespit edilmedi.

**Anasayfa yapısı (metin kanıtı):**
- Logo H1: "Choc on Choc". > Hero/şerit başlıkları (H2): "Christmas Collection", "Gifts For Every Occasion", "Adored By All", "A Gift for Everyone."
- Menü (sırayla): `Bestsellers | Shop All | Shop By Recipient | Shop By Occasion | Shop By Hobby | Shop Other` + `Build a Bundle | Christmas | The Chocolate Club | Our Story | Wishlist | Gift Finder Quiz`.
- Promo/duyuru: "Send beautiful chocolate gifts, handmade in Great Britain…" (meta description) + Gift Finder Quiz vurgusu.

**Özel gün mimarisi (güçlü):** `Shop By Occasion` alt başlıkları: Birthday, Wedding/Engagement, New Home, Graduation/Exams, Thank You, Congratulations, Get Well Soon, Anniversary. **URL kalıbı:** `/collections/birthdays`, `/collections/wedding-engagement-chocolate-gifts`, `/collections/graduation-exam-results-chocolate-gifts`, `/collections/thank-you-chocolate-gifts-1`, `/collections/get-well-soon-chocolate-gifts`, `/collections/anniversary`, `/collections/new-home-chocolate-gifts`. Ayrıca `Shop By Recipient` (Her/Him/Kids/Adults/Teachers) ve `Shop By Hobby` (Sports/Music/Animals…) eksenleri var.

**Akış:** `gift message` + `gift card message` metinleri var; `delivery date` var; `personaliz*`, `custom` geçiyor; **build a bundle** (kendi paketini kurma) CTA'sı var. `whatsapp` metni kaynakta var. Misafir checkout izi bulunamadı (metin düzeyinde).

**Mobil:** Yapısal olarak `overflow-list` ve `component-menu-drawer` CSS'leri yükleniyor → mobil çekmece menü var.

---

## 2) cocochocolatier.com — COCO Chocolatier (İskoçya)

**Yöntem:** curl ile HTML (326 KB, HTTP 200) + `theme.css`. **DÖNÜŞ:** `cocochocolatier.com` artık **`madeuncommon.co/pages/coco`** adresine 301 yönlendiriyor (marka "Made Uncommon" çatısı altında birleşmiş). Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com` + `madeuncommon.co/cdn/shop/t/2/...` → **Shopify**. Ek: Judge.me (yorum).

**Renk (CSS tokenlarından):**
- `--color-primary: #000000`, `--color-secondary: #FFFFFF` (siyah-beyaz yüksek kontrast).
- **Accent teal/yeşil: `#108474`** (26 kez geçiyor — en sık marka rengi).
- Yumuşak krem: `--mu-b-soft: #fff4e7`; gri `--mu-b-grey: #6E6E6E`; çizgi `--mu-b-line: #E4E4E4`; header zemini `--mu-head-bg: #000000`, header metni `#FFFFFF` (ters logo `invert(1)`).
- Not: `#EB001B, #F48120…` ikonlardan; `#0071CE` ödeme rozetinden.

**Tipografi (Google Fonts linkinden doğrulandı):** `fonts.googleapis.com/css2?family=Archivo:400..800 & Baloo+2:500,700 & Cormorant+Garamond:600 & Fraunces:600 & Nunito:400,700` yükleniyor. CSS `--element-text-font-family--heading: Poppins, sans-serif`, gövde/nav `Inter, sans-serif`. Yani: **sans ağırlıklı (Poppins/Archivo/Inter) + serif vurgu (Cormorant Garamond/Fraunces)**; Baloo 2 (yuvarlak display) ikincil.

**Anasayfa yapısı:** H1 "THE ART OF CHOCOLATE". H2: "Crafted with purpose, made for pleasure." Menü büyük **mega menü**, çok eksenli: `By type` (Chocolate Bars, Mini Bars, Truffles, Selection Boxes, Drinking Chocolate, Treats & Snacks, Limited Edition, Candles) → `By flavour` → `By diet & preference` (Vegan/Organic/Palm Oil Free) → `By Brand` (Love Cocoa, H!P, Otherly, UP-UP, Seed & Bean…) → `Featured` → **`By occasion`** → `By season` → `Shop gifts`.

**Özel gün mimarisi (çok eksenli):** `By occasion`: Birthday, Thank You, Anniversary, Congratulations, Housewarming. `By season`: Christmas, Easter, Mother's Day, Father's Day, **Eid**. **URL kalıbı:** `/collections/birthday-gifts`, `/collections/thank-you-gifts`, `/collections/anniversary-gifts`, `/collections/congratulations-gifts`, `/collections/housewarming-gifts`, `/collections/mothers-day-gifts`, `/collections/eid-gifts`, `/pages/corporate-gifting`, `/pages/gift-messages`.

**Akış:** `gift message` ve ayrı bir **`/pages/gift-messages`** sayfası var (hediye notu mimarisi net). Sepet: `View bag → Check out` (Shopify drawer). Teslim tarihi seçimi tespit edilmedi.

---

## 3) compartes.com — Compartés (Los Angeles, ABD)

**Yöntem:** curl ile HTML (492 KB, HTTP 200) + Tailwind CSS (`oxygen-v2/.../tailwind-*.css`) indirildi. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** Shopify **Oxygen/Hydrogen** (headless; `cdn.shopify.com/oxygen-v2/...`, JS chunk'lar) + Tailwind. Klaviyo. Geleneksel Liquid tema değil, **headless Shopify** — bu yapısal olarak öne çıkan bir kanıt.

**Renk (Tailwind CSS'ten):**
- `#31261d` (43x, koyu kahve), `#1a1612` (42x, neredeyse siyah-kahve), `#fefefd` / `#f7f5f2` (kırık beyaz).
- Vurgu/altın tonları: `#94795d` (28x, taupe/altın-kahve), `#e6cd8f` (altın/hardal), `#f2e9db` + `#f8f3eb` (krem).
- `--ob-deep-chocolate` adında bir renk değişkeni tanımlı (adı marka dilini yansıtıyor).
- HTML içinde ayrıca `#c9a96a` (altın) ve `#7a4e1e` (kahve) geçiyor.

**Tipografi (Tailwind `--font-*` değişkenlerinden doğrulandı):**
- `--font-sans: "Figtree", system-ui, sans-serif` (gövde).
- `--font-serif-display / --font-serif-subhead / --font-serif-caption: "kepler-std-*"` → **Kepler Std (Adobe serif)**.
- `--font-monogram: "bickham-script-pro-3", "kepler-std-display"…` → **Bickham Script Pro (el yazısı / monogram fontu)**.
- Yani: **serif ağırlıklı lüks tipografi + el yazısı monogram vurgusu + Figtree sans gövde**. El yazısı fonunun *isimle* bulunması, kişiselleştirme/gravür temasını destekliyor.

**Anasayfa yapısı:** H1: "Compartés Chocolatier: Handmade Luxury Chocolate in Los Angeles". Şerit başlıkları (H2, sırayla): "Holiday chocolate gifts", "Chocolate Advent Calendars", "The Gifting Edit", "Thanksgiving Chocolate", "Holiday favorites", "Handmade fresh daily", "Collaborations", FAQ, "Stories from the kitchen.", "Our promises". CTA metinleri: "Shop Holiday →", "Shop Advent Calendars →", "Build Your Own Bark →", "Build a Bar Box →", "Start a Project", "Chat with Concierge".

**Özel gün mimarisi:** Menü kısaltılmış: `Advent | Corporate | Club | Member`. **URL kalıbı:** `/collections/christmas`, `/collections/hanukkah-gifts`, `/collections/passover-gifts`, `/collections/best-fathers-day-chocolate-gifts-los-angeles`, `/pages/chocolate-holiday-gift-guide`, `/pages/custom-chocolate-gifts`, `/custom-chocolate-bar-gift-box`, `/collections/business-gifts`. Yani özel gün eksenini koleksiyon + "gift guide" landing'leri üzerinden kuruyor.

**Akış:** `/pages/custom-chocolate-gifts` + "Build Your Own Bark / Build a Bar Box" → **ürün içi/ayrı kişiselleştirme-konfigürasyon akışı** kanıtı. Sepet: "Add to Bag" (drawer). "Shop the Gift Box $24.95" gibi hediye kutusu modülü var.

---

## 4) milkbarstore.com — Milk Bar / Christina Tosi (New York, ABD)

**Yöntem:** curl ile HTML (744 KB, HTTP 200) + `layout.theme.css` (957 KB) indirildi. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com` + `/cdn/shop/t/147/...` + `portable-wallets` → **Shopify**. Tema sağlayıcı "shoplift.css". Ek: Klaviyo, GTM, Cloudflare.

**Renk (tema CSS + HTML tokenları):**
- Siyah `#000000` (ana metin/logo; SVG logo `fill:#000`), beyaz `#FFFFFF`.
- **Tomboy Pink: `#E83A87`** (10x) ve **`#FD69B0`** (5x) — marka pembe ailesi.
- Krem **"vanilla": `#FFEFDA`** (8x) ve `#FFF5E9`/`#FFEFDC` (krem varyantları; CSS'te `--background-not-vanilla`, `--background-tomboy-pink` gibi isimli tokenlar var → marka dili isimlendirmeye yansımış).
- Buton: zemin `#F7F7F8`, metin **`#272D45`** (koyu lacivert), hover `#000`; sınır `#DBDDE4`, radius 4px, kalınlık 1px.

**Tipografi (tema CSS'ten doğrulandı — Google Fonts YOK):**
- **`Garnett`** ailesi self-hosted: `Garnett Regular / Medium / Semibold / Bold / Black` (155 kez `font-family:Garnett`).
- **`Pitch Bold`** (18x) → el yazısı/display vurgu fontu.
- Yani: **özel self-hosted geometrik sans (Garnett) + el yazısı/display vurgu (Pitch Bold)**. Google/Typekit linki yok.

**Anasayfa yapısı:** Banner H1'leri: "CROSS PIE OFF YOUR LIST", "FINALLY: GLUTEN FREE MILK BAR PIE", "A PIE THEY WILL BE THANKFUL FOR", "Summer Treats, Delivered." H2'ler: "FROM OUR BAKERY TO YOUR DOOR", "Gifts for every occasion!", "Why choose Milk Bar?", "SHOP OUR BESTSELLERS", "SEND GROUP GIFTS", "WORD ON THE STREET", "HEY, NICE TO TREAT YOU."
- Menü: `Desserts | Cakes | Cookies | Pies | Cake Truffles | Gluten-Free | Bundles | Baking Mixes | Gift Cards` + `Thanksgiving | Birthday | Corporate Gifts` + mağaza listesi (NYC/Chicago/LA/DC/Las Vegas) + `Same Day Pick Up or Delivery`.

**Özel gün mimarisi:** **URL kalıbı:** `/collections/birthday`, `/collections/the-birthday-sweet-shop`, `/collections/special-occasions-thank-you`, `/collections/special-occasions-congratulations-gifts`, `/pages/corporate-gifts`, `gifts.zest.co/milkbar` (kurumsal hediye entegrasyonu). Yani hem `/collections/{occasion}` hem `/collections/special-occasions-{occasion}` hem `/pages/{gift-guide}` kalıpları birlikte kullanılıyor.

**Akış:** `gift note` var, `delivery date` + `select date` var (teslim tarihi seçimi), `personaliz*`/`custom` geçiyor. **Sticky add-to-cart kanıtı:** `sticky-atc.js` + `sticky_bar` + `sticky top-0` sınıfları. `announcement-bar` modülü var. WhatsApp/`whatsApp` metni kaynakta geçiyor.

**Mobil:** `sticky-atc.js` (mobil sticky "sepete ekle"), `component-menu-drawer` → çekmece menü.

---

## 5) bakedbymelissa.com — Baked by Melissa (New York, ABD)

**Yöntem:** curl ile HTML (455 KB, HTTP 200) + `use.typekit.net/ine6hcd.css`. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com` + `/cdn/shop/t/112/...` + `portable-wallets` → **Shopify** (çok sayıda `bbym-*` özel section CSS'i). Ek: Yotpo (yorum), Klaviyo, GTM, Cloudflare.

**Renk (Shopify tema tokenlarından — net):**
- `--color-melissa-pink: #E20063` (marka pembesi; buton zemini `--color-button: 226,0,99`).
- `--color-light-pink: #F7E6ED`; siyah `--color-black: #121212` / zemin `#FFFFFF`.
- Destek: `--color-light-blue: #D5E9F8`, mavi gradyan `linear-gradient(9deg, #1373AF 0%, #46A2CB…)`, `--color-lucky-green: #167C78`; gri `#65656A` / `#3A3A3A`.
- Yani: **canlı fuşya-pembe (#E20063) ana buton/marka + yumuşak pembe/mavi pastel zeminler + siyah metin**.

**Tipografi:** Tek dış font kaynağı **Typekit `use.typekit.net/ine6hcd.css`** → **`proxima-nova` + `proxima-nova-condensed`** (sans; condensed olan başlık/CTA için). HTML'de ayrıca `Poppins` ve `Assistant` referansları geçiyor; el yazısı fontu tespit edilmedi.

**Anasayfa yapısı:** H1 boş (logo/lazy). H2'ler: "TRENDING TREATS", **"What's the Occasion?"**, "How It Works", "Meet Melissa", "Find Us on Socials", "Sign up for the latest sweets". Menü: `Flavors | Cookbook | Stores | Rewards`. CTA: "LEARN MORE", "Check out".

**Özel gün mimarisi:** **URL kalıbı:** `/collections/birthday-cupcakes`, `/collections/thank-you-cupcakes-gifts`, `/collections/thanksgiving`, `/products/birthday-gift-box-25-pack`, `/pages/corporate-gifts`. Anasayfada "What's the Occasion?" adlı ayrı bir **özel-gün seçim şeridi** var (kanıt: H2 metni).

**Akış:** `gift message` var (hediye notu), `delivery date` var (teslim tarihi). `custom` geçiyor. Menüde "Stores" (fiziksel mağaza) var.

---

## 6) personalcreations.com — Personal Creations (ABD)

**Yöntem:** curl ile HTML (1.17 MB, HTTP 200) + tema CSS yolları. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com`/`wp-content` **YOK**. CSS yolları `/templates/default/css/main.css`, `/templates/pcrus_new/css/main.css`, ürün URL'leri `/personalized-christmas-gifts-pchrbsl` ve `?styleDESIGN_FILTERS79=1` biçiminde → **özel (in-house) platform** (Personalization Mall ailesi ile aynı altyapı; şablon + `-pXXXX` ürün kodu kalıbı). Kesin platform adı doğrulanamadı (bkz. Gaps).

**Renk (tema CSS root tokenlarından — net):**
- **Birincil teal: `--color-primary: #296E70`** (darken `#195E60`).
- **Vurgu mercan/turuncu: `--color-highlight: #F16650`** (darken `#E63E00`), deals `#ED4D12`.
- Checkout indigo: `--color-pcrus-checkout-indigo: #5d76b9`; ikincil mavi `#5F76B8` (51x) ve turuncu `#FFA439` (79x).
- Nötr: `#454545` (79x metin), `#D1D1D1`, `#FFFFFF`.
- Yani: **teal + mercan/turuncu + indigo-mavi** üçlü paleti (klasik "hediye" sıcaklığı + güven mavisi).

**Tipografi (Google Fonts linkinden doğrulandı):** `Roboto:400,500,700,900` + `Montserrat:400..700` yükleniyor; `Lato` ve `var(--font-family-heading/secondary/medium)` referansları var. Yani: **Roboto gövde + Montserrat başlık (sans)**; serif yok.

**Anasayfa yapısı:** H1: **"Unique Personalized Products for Life's Special Occasions"**. Menü düz `<nav>` içinde metin olarak ayıklanamadı (JS/mega-menü tabanlı) — bkz. Gaps. CTA örnekleri: "SHOP HOME", "Live Chat", "Account".

**Özel gün mimarisi:** **URL kalıbı** güçlü kanıt: `/personalized-christmas-gifts-pchrbsl`, `/christmas-gifts-pchrnew`, `/family-christmas-gifts-pchrfam`, `/christmas-hostess-gifts-pchrkch` ve kişiselleştirme filtreleri `?styleDESIGN_FILTERS79=1`. Yani özel gün = hem kategori hem **design-filter** ekseni.

**Akış:** Kişiselleştirme çok güçlü (`personaliz*`, `engrav*`, `custom`, `monogram`). `gift message`/`delivery date` HTML'de bulunamadı. Sepet/checkout: `/checkout` ve `/cart` yolu var.

---

## 7) zchocolat.com — zChocolat (Forcalquier, Fransa)

**Yöntem:** curl ile HTML (340 KB, HTTP 200) + `themes/zchocolat/assets/cache/theme-884cde386.css` (613 KB). Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `themes/zchocolat/assets/cache/theme-*.css` + `/z/46-business-gifts` + `.html` ürün URL'leri (`/luxurious-mahogany-gifts/229-sapphire.html`) → **PrestaShop**. GTM.

**Renk (tema CSS + HTML değişkenlerinden):**
- Sıcak siyah: **`#171310`** (44x) ve `#1A1A1A`, `#322E29`.
- Sıcak gri: **`#706A61`** (12x); `#4C463F`, `#6B665E`, `#8A8378`.
- Krem: `#F2F2F1` (9x), `#FFF DEF`/`#F6F5F2`.
- Aksan: **`#C84437`** (kiremit kırmızısı) ve **`#786420`** (koyu altın/zeytin), `#C8102E` (kırmızı).
- CSS değişkenleri: `--ink #1A1A1A`, `--slate #1A1A1A`, `--stone #2E2E2E`, `--tile-accent`.
- Yani: **neredeyse-siyah sıcak zemin + altın/kiremit aksan** (lüks, müzayede kataloğu tonu).

**Tipografi (doğrulandı):** Google Fonts `Cormorant Garamond` (serif) + `Manrope` (sans) yükleniyor; Typekit `use.typekit.net/bla0egj.css`; tema CSS içinde self-hosted **`AGaramond`** (Adobe Garamond), **`Isidora`**, **`Jost`**, **`'2420'`** font aileleri tanımlı (`font-family:'AGaramond'`, `var(--zpp-sans,'Jost',sans-serif)` vb.). Yani: **serif liderli (AGaramond / Cormorant Garamond) + sans yardımcı (Manrope/Jost)**.

**Anasayfa yapısı:** H2'ler: "Holiday Magic, written in the stars", "The Favorites", "The Collections", "The Macaron Collection", "A regal indulgence", "Spectacular gifts, carved to be kept", "From France to anywhere on earth.", "The zBoxes", "World Champion Chocolatier". Güven iddiaları: "The trusted preference of 19,000 companies", "100 Michelin-starred chefs recommend zChocolat". Nav: `Holidays | Business Gifts | Shipping | About Us | Contact Us | FAQ | Personalize | Delivery by Country | Flavors`.

**Özel gün mimarisi:** **URL kalıbı (sayı önekli):** `/collections/27-birthday`, `/collections/35-romance`, `/collections/34-party-favors`, `/collections/44-christmas-2026-v1`, `/collections/45-new-year-2027`, `/collections/36-vegan`, `/collections/30-gold`, `/collections/32-mahogany`, `/z/46-business-gifts`, `/z/55-gift-services`.

**Akış:** Nav'da **"Personalize"**; meta description "Personalised gift boxes, **engraved**" → **gravür/kişiselleştirme** birinci sınıf akış. Ürün CTA'ları "Shop now / Discover"; sepet "Check out". Teslim tarihi seçimi tespit edilmedi.

---

## 8) patchi.com — Patchi (Beyrut, Lübnan)

**Yöntem:** curl ile HTML (65 KB, HTTP 200) + `build/assets/app-ltr-BX55qPpj.css`. Gözlem: 9 Kasım 2026.
**Dikkat:** Bu bir **kurumsal/marka sitesi**, mağaza değil — nav'da "Visit Online Store" ayrı platforma gidiyor.

**Altyapı izleri:** `build/assets/*.css` + `--livewire-progress-bar-color` → **Laravel + Livewire**. Cloudflare.

**Renk (CSS'ten):**
- **Koyu yeşil: `#143D34`** (11x) — ana marka rengi.
- Adaçayı/yumuşak yeşil: **`#96BA92`** (3x).
- Açık gri: `#F3F4F6` (14x). (`#FF2D20` Laravel varsayılan kırmızısıdır, marka değildir; `#003399` izleme pikselinden gelir.)

**Tipografi (CSS'ten):** `font-family: fenwick, Noto Kufi Arabic, Helvetica, Arial, sans-serif` → **"fenwick" özel fontu (lüks serif/sans) + Arapça için Noto Kufi Arabic**; Font Awesome 6 Pro ikonlar.

**Anasayfa yapısı:** H2'ler: "OUR OFFERINGS", Chocolates, Gift Boxes, Gift Arrangements, Decorated Chocolates, Celebrations, Delectables, Patchi Café, Patchino, Patchi Experience, Franchise, "LATEST NEWS". Nav: `The brand | Our offerings | Occasions gifting | Patchi experience | Franchise | Boutiques | Visit Online Store` + dil seçici **en / ar / fr**.

**Özel gün mimarisi:** Ayrı bir **"Occasions gifting"** menüsü; **URL kalıbı:** `/en/occasions/gifting`.

**Akış:** Bilgi sitesi olduğu için sepet/gift-note akışı yok; gerçek mağaza ayrı platformda (aldatılmadı — bkz. Gaps).

---

## 9) vosgeschocolate.com — Vosges Haut-Chocolat (Chicago, ABD)

**Yöntem:** curl ile HTML (570 KB, HTTP 200). Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com` + `/cdn/shop/t/695/...` + `portable-wallets` → **Shopify**. Ek: Yotpo, Judge.me, Klaviyo, GTM, Cloudflare.

**Renk (tema tokenları + HTML):**
- Zemin `#FFFFFF`; metin `rgb(18,18,18)`.
- **Derin mor / patlıcan: `#3D1152` (30x), `#440A56` (19x), `#38165F` (14x), `#3C1952`** → belirgin **mor/mürdüm markası** (Newsletter/buton alanlarında).
- Teal aksan `#108474` (13x); koyu `#0E1C29`.
- Tema accent-2: `rgb(51 79 180)` (mavi).
- Yani: **beyaz zemin + derin mürdüm moru (#3D1152) birincil + teal ikincil**.

**Tipografi (dosya linklerinden + CSS değişkenlerinden doğrulandı):**
- Google Fonts: `Montserrat:500` + `Roboto:400,500,700` ve `Inter` + **`Joan`** (serif) yükleniyor.
- CSS: `--font-heading-family: Roboto, sans-serif`, `--font-body-family: Roboto, sans-serif`; ayrıca **`Playfair Display, serif !important`** (serif vurgu başlıkları için).
- Yani: **Roboto/Montserrat/Inter sans + Playfair Display (serif) vurgu + Joan**.

**Anasayfa yapısı:** H2'ler: "Thanksgiving Gifts", "Fall into Haut-Chocolat", "The Alpine Chocolate Ensemble", "Last Call for Halloween", "Cheese Meets Chocolate with Rogue Creamery x Vosges", "Reserve Your Stay at the Grand Cacao Lodge", "Bestsellers", "Blog". Nav (büyük harf): `ADVENT 2026 | SHOP | BY CATEGORY | BY TYPE | GIFTS | BY PRICE | WEDDINGS & EVENTS | CORPORATE GIFTING | THE CHOCOLATE EXPERIENCE`. CTA: "SHOP NOW", "ORDER NOW", "DISCOVER", "Add to bag".

**Özel gün mimarisi (çok eksenli, örnek kalıp):** `GIFTS` altında → Thank You Gifts, Wedding Gifts, Birthday Gifts, Anniversary Gifts, Hostess Gifts, Graduation Gifts; `WEDDINGS & EVENTS` (Wedding Favors, Custom Gifts); `CORPORATE GIFTING` (Client/Employee/Instant Gifts); `BY PRICE` (Gifts $25 & Under … $100 and Over). **URL kalıbı:** `/collections/birthday-gifts`, `/collections/anniversary-gifts`, `/collections/hostess-gifts`, `/collections/graduation-gifts`, `/collections/wedding-gifts-favors`, `/collections/gifts-under-25`, `/collections/thanksgiving-gifts`. Kurumsal: `gifts.zest.co/vosges`.

**Akış:** Kurumsal/özel gün odaklı; `personaliz*`/`custom` geçiyor; `gift message`/`delivery date` HTML'de bulunamadı. Sepet: "Add to bag".

---

# BÖLÜM B — Türkiye / KKTC Siteleri (kanıt bloğu olan 5 site)

## 10) godiva.com.tr — GODIVA Türkiye

**Yöntem:** curl ile HTML (451 KB, HTTP 200) + `theme.css` (143 KB) + `byte.css` yolları. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `cdn.shopify.com` + `/cdn/shop/t/86/...` + `portable-wallets` → **Shopify**. Ek: Klaviyo, GTM, Wishlist Engine, "freegifts" uygulaması, `floating-widget.css`.

**Renk (HTML/tema tokenlarından):**
- Baskın metin/koyu: **`#303030` (152x)**, `#616161` (24x), `#000000`.
- Zemin `#FFFFFF`, `#F3F3F3`, `#F0F0F0`.
- **Altın: `#CFB56A` (7x)** ve **kahve/altın: `#6F4B21` (6x)**, `#F6C566` (5x) → hediye/altın aksanı.
- Krem: `#FFF8DB`, `#DEE6FF`.
- İkincil: `#2332D5` (indigo, 18x), `#005BD3` (mavi).
- Yani: **siyah-beyaz-gri nötr zemin + altın (#CFB56A) ve kahve (#6F4B21) aksan** (klasik çikolata-lüks dili).

**Tipografi (HTML'den):** `font-family: Gotham !important` (3 kez) → **Gotham (sans, self-hosted/tema)**; Google Fonts linki yok; serif yok.

**Anasayfa yapısı:** H1: **"Godiva Çikolata Dünyasını Keşfedin"**. H2'ler (kategori/segment): "GODIVA Çikolataları", "Bol Sütlü Godiva Çikolatalarla Gerçek Lezzet", "En Lezzetli Seçeneklerle Bitter GODIVA Çikolata Deneyimi", "GODIVA Kare Çikolata ve Madlen Çikolata Seçenekleriyle Doğru Seçim", "Hediyelik GODIVA Çikolata Kutularıyla Anlamlı Sürprizler", "GODIVA Yenidoğan Çikolata Kutularıyla Tatlı Başlangıçlar", "Söz ve Nişan Törenleri İçin Özel GODIVA Çikolatalar", "Özel GODIVA Bayram Çikolataları ile Kutlamayı Renklendirin", "HABER BÜLTENİMİZE ABONE OLUN".

**Özel gün mimarisi (Türkiye için en güçlü kanıt):** Menü: `Mağazalar | Çikolata Çeşitleri | 100. Yıla Özel Centennial Kutu | Tüm Ürünler |` **tipler** (Napoliten, Madlen, Pralin, Trüf, Atıştırmalık, Sütlü, Bitter, Kare, Tablet, Kadayıflı) `| Özel Koleksiyonlar` (Gold, Royal Box, Signature, Masterpieces, Domes) `| Fiyat` (1.000 TL ve Altı / 1.000-2.000 TL / 2.000 TL ve Üzeri) `|` **"Okazyona Göre Hediyeler"** `| Tamamlayıcı Ürünler | İndirimli Ürünler | Kurumsal Satış`. **"Okazyona Göre Hediyeler" alt kalemleri:** Söz & Nişan Hediyeleri, Doğum Günü, Kurumsal Hediyeler, Teşekkür ve Tebrik Hediyeleri, Ev Hediyeleri, Geçmiş Olsun Hediyeleri, Yenidoğan Çikolatası, Yıl Dönümü, Öğretmenler Günü Hediyeleri, Sevgililer Günü Hediyeleri, Bayram Çikolatası. Çok eksenli: **tip + koleksiyon + fiyat + özel gün + kurumsal**.

**Akış:** **"Ücretsiz Hediye Notu"** metni doğrulandı (hediye notu alanı). **"Aynı gün teslimat"** ürünleri ve "Teslimat seçeneği" var (teslim seçimi). Sepet: "Sepete ekle", "Sepeti boşaltıp ekle".

---

## 11) kahvedunyasi.com — Kahve Dünyası (Türkiye)

**Yöntem:** curl ile HTML (464 KB, HTTP 200); site `_next/static/chunks/*.css` yüklüyor (JS ile render). Nav HTML'de boş geldi. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** `_next/static/...` → **Next.js** (React). Klasik e-ticaret platformu izi (Shopify/Woo) yok — muhtemelen headless/özel.

**Renk (HTML/chunk referanslarından):**
- **Marka yeşili: `#005E5B`** (9x) ve **teal: `#01A49F`** (6x).
- **Bordo/maroon: `#6C0733`** (7x) — ikinci marka rengi.
- Sarı aksan `#FFF46D`; nötr `#949494`, `#A8A8A8`, `#000000`, `#FFFFFF`.

**Tipografi:** HTML'de `font-family` tanımı bulunamadı (CSS chunk'larında; ayrıca indirilmedi) → **kanıt bulunamadı** (bkz. Gaps).

**Anasayfa yapısı:** H1: "HEMEN İNDİR" (app indirme bannerı). H2: "Yenilenen Uygulamamızı İndir, Sana Özel Fırsatlar…", "Sepetin şu an boş". CTA: "Sepete Ekle", "Bizi Takip Edin", "Alışverişe Başla". Nav metni ayıklanamadı (JS).

**Özel gün mimarisi:** Doğrudan kanıt bulunamadı; yalnızca `ozel` anahtar kelimesi 2 kez geçiyor. **Kanıt yok.**

**Akış (metin izleri):** **`hediye notu`** var (hediye notu alanı), **`teslim tarihi` / `teslimat tarihi`** var (teslim tarihi seçimi), **`misafir`** geçiyor (misafir checkout olasılığı yüksek), `kişisel` geçiyor.

---

## 12) pelit.com.tr — Pelit Çikolata (Türkiye)

**Yöntem:** curl ile HTML (155 KB, HTTP 200) + tema/eklenti CSS yolları. Gözlem: 9 Kasım 2026.

**Altyapı izleri (meta generator ile doğrulandı):** `WordPress 5.5.24`, **`WooCommerce 4.3.0`**, `qTranslate-X 3.4.6.8` (çok dilli), `WPBakery Page Builder` (drag&drop). CSS: `wp-content/plugins/woocommerce/...`, tema `pelit-theme`, menü eklentileri `maxmegamenu` + `iks-menu-pro`, `dashicons`. → **WordPress + WooCommerce (eski sürümler)**.

**Renk (HTML'den — sınırlı):** `#3C2011` (koyu kahve, 3x), `#B19F93` (taupe, 2x), `#00A99D` (teal, 1x), `#003388`/`#003399` (mavi). Renk kanıtı zayıf (palet büyük ölçüde tema CSS'inde değil, görsel banner'larda).

**Tipografi (CSS linkinden):** Google Fonts **`Open Sans:400,500,600,700`**; ayrıca Bootstrap + Font Awesome 4.7 + Ionicons + Linearicons ikon fontları. Serif/el yazısı tespit edilmedi.

**Anasayfa yapısı:** H2: "All Categories", "Search", "Şubeler", "Organizasyon", "Kataloglarımız". Nav metni JS düzeyinde boş geldi. CTA: "Ürün Arama", "Tamam".

**Özel gün mimarisi (URL kalıbı kanıtı):** Kategori ağacı: `/cikolata/` (madlen, `draje-ve-badem-sekeri`, `spesiyal`, `cikolatali-urunler`), `/dugun/` (`dugun-pastalari`, `nikah-sekerleri`, `porsiyon-pastalar`, `soz-ve-nisan-pastalari`), `/hediye-onerileri/`, `/organizasyon/`, `/pelit-subeleri/`. Yani **özel gün = "Düğün" ekseni + "Hediye Önerileri" + "Organizasyon"**. `ozel` anahtar kelimesi 25 kez.

**Akış:** Sepet/checkout WooCommerce standart (`/cart`); `gift message`/`delivery date` HTML'de bulunamadı.

---

## 13) ciceksepeti.com (kişiye özel kategorisi) — Çiçeksepeti (Türkiye)

**Yöntem:** curl HTTP 403 + Cloudflare challenge (HTML alınamadı). **Tavily extract (advanced)** ile içerik (metin) alındı. Gözlem: 9 Kasım 2026.

**Altyapı izleri:** Cloudflare koruması. Renk/font HTML olmadan çıkarılamadı. Platform izi (Shopify/Woo) **doğrulanamadı** (JS/SPA).

**Renk / Tipografi:** **Kanıt bulunamadı** (403 + yalnızca metin düzeyi çıkarım). Bu boşluk açıkça işaretlenmiştir.

**Sayfa yapısı / mimari (metin kanıtı):** Breadcrumb: "Çiçeksepeti.com > Kişiye Özel Ürünler". Ürün kartlarında **"TASARLANABİLİR"** etiketi (kişiselleştirilebilir ürün) ve "Aynı Gün Ücretsiz Teslimat" rozeti. Kategoriler: Kişiye Özel, Hediye Setleri, El Yapımı Hediye, Gurme Lezzetler (Kişiye Özel Karışık Gurme Lezzetler & Draje vb.).

**Özel gün mimarisi (TR için çok zengin):**
- **"Özel Günler"** mega bloğu: Sevgililer Günü, Kadınlar Günü, Anneler Günü, Babalar Günü, Öğretmenler Günü, Yılbaşı, Black Friday, Tıp Bayramı, Avukatlar Günü, Hemşireler Günü, Eczacılık Günü, Diş Hekimleri Günü.
- **"Gönderim Amacı"** ekseni: Doğum Günü, Geçmiş Olsun, Yeni Doğan, Yıl Dönümü, Özür Dilerim, Sevgili, Tebrik, Açılış/Tören, Söz/Nişan/Düğün, Teşekkür, Kendim İçin, Cenaze, Evlilik Teklifi.
- **URL kalıbı:** `/kisiye-ozel`.

**Akış:** "TASARLANABİLİR" (konfigüratör/kişiselleştirme), aynı gün teslimat vaadi. Checkout adım sayısı kanıtlanamadı.

---

## 14) caramelchocolate.com — Caramel Chocolate (KKTC)

**Yöntem:** curl ile HTML (185 KB, HTTP 200) + tema/eklenti CSS yolları. Gözlem: 9 Kasım 2026.

**Altyapı izleri (meta generator ile doğrulandı):** `WordPress 6.8.12`, **`WooCommerce 10.1.4`**, `WPBakery Page Builder`, `Slider Revolution 6.7.36`, tema **`basel`**, eklentiler: `woo-custom-product-addons` (kişiselleştirme/ek ürün seçenekleri), `flexible-shipping`, `yith-woocommerce-customer-history-premium`. → **WordPress + WooCommerce, "Basel" tema + ürün-eklentisi konfigüratörü**.

**Renk (HTML'den — sınırlı):** WooCommerce Custom Product Addons tokenları: **`--wcpaButtonColor: #3340D3`** (mavi buton), `--wcpaBorderColorFocus: #3561F3`, `--wcpaLabelColor: #424242`. Ek olarak WordPress varsayılan palet kodları (`#ff6900, #fcb900, #f78da7, #00d084, #0693e3…`) ve `#B9CBE3`. Marka paleti için güçlü tek kanıt **mavi `#3340D3`**.

**Tipografi (Google Fonts linklerinden):** `Saira`, `Saira Semi Condensed`, `Chivo`, `Siemreap` ve `Roboto:900,400 + PT Sans + Chivo`; ayrıca WPBakery Font Awesome. Yani: **Saira/Chivo/Roboto (sans)**. Serif/el yazısı tespit edilmedi.

**Anasayfa yapısı:** H1/H2 HTML'de bulunamadı (JS/Slider Revolution başlıkları görsel içinde). CTA: "Sepete Ekle", "Giriş Yap", "Hesap oluştur", "İstek Listem", "Hızlı Bakış".

**Özel gün mimarisi:** Belirgin bir "özel gün" gezinmesi **kanıtlanamadı**; bunun yerine ürün-tipi ekseni var: `/urun/…` kalıbıyla ~25 ürün (örn. `kare-kutu-dubai-tart-cikolata`, `kravat-kutu-alkollu-art-spesiyal-cikolata`, `kare-kutu-logolu-sargili-madlen-yeni-yil-konseptli-32li`, `kravat-kutu-sugar-free-cikolata-kapli-hurma`, `orta-boy-dikdortgen-kutu-truffle-cikolata`). Görülen temalar: yılbaşı konseptli kutu, dubai çikolatası, kravat kutusu, logolu kutu → **hediyelik + logolu/kurumsal**.

**Akış:** `woo-custom-product-addons` → ürün sayfasında **ek seçenek/kişiselleştirme** akışı. Sepet/checkout WooCommerce standart. `gift message`/`delivery date` HTML'de bulunamadı.

---

# BÖLÜM C — Bot Koruması / Erişim Sorunu Olan Siteler

## 15) sugarfina.com — Sugarfina (ABD)
**Yöntem:** curl → HTTP 403 (773 byte). **Tavily extract (advanced)** ile metin düzeyi içerik alındı; renk/font **kanıtı yok**.
**Altyapı izi (kanıt):** Görsel/CSS yolları `/static/version1793797101/frontend/Corra/sugarfina/en_US/...` ve `/media/wysiwyg/...`, `/media/catalog/product/...` → **Magento 2 (Corra tema acentesi)**. Bu, doğrudan URL yolundan okunabilen güvenilir bir Magento izidir.
**Yapı (metin kanıtı):** Hero = "Our 2026 Advent Calendar is here!". Kategori şeritleri (H2/H3): Advent Calendars, Holiday Gifts, Peanuts®, Hanukkah, Cocktail Party, Parisian Chocolates, Greeting Cards, **Design Your Own**, Celebration Bottles, Party Packs, Bulk Bags, Taster Packets, Champagne, Sour, Chocolates. Promo bar: "1 Free Candy Bar with $75 Spend, CODE: SPEND75" (kademeli hediye eşikleri). "Design Your Own" = konfigüratör. Ülke değiştirme modalı var.
**Renk/Tipografi:** **Kanıt bulunamadı** (403).

## 16) thingsremembered.com — Things Remembered (ABD)
**Yöntem:** curl → HTTP 403. **Tavily extract** ile metin düzeyi içerik. Renk/font **kanıtı yok**.
**Altyapı izi:** Footer'da Personalization Mall logosu + `/Personalized-Gifts-Shop-By-Occasion-z5.store` biçimli `.store` URL'leri → **Personalization Mall / Personal Creations altyapısı** (özel platform). Shopify/Woo/Wix izi yok.
**Yapı (metin kanıtı):** Hero H1: "Personalized Gifts For Every Special Occasion". Duyuru barı: "Enjoy Free Shipping over $99". "Find Your Perfect gift" bloğu: **Upcoming Occasions / Milestone Occasions / Seasonal Occasions / Recipients / Products**. Mega menü eksenleri: BY RECIPIENT, BY CATEGORY, HOLIDAY SHOP, BABY & KIDS, OFFICE GIFTS, WEDDING GIFTS; ayrıca marka duvarı (Carhartt, Kate Spade, Vera Wang, Fossil, Waterford…). Kişiselleştirme: "engraved and embroidered", "engraving or embroidered message" → **gravür/nakış kişiselleştirme** öne çıkıyor.
**Renk/Tipografi:** **Kanıt bulunamadı** (403).

## 17) bateel.com — Bateel (BAE)
**Yöntem:** curl → HTTP 403 (Cloudflare "Just a moment..."). **Tavily extract** ile metin düzeyi içerik. Renk/font **kanıtı yok**.
**Yapı (metin kanıtı):** Mega menü eksenleri: **By Filling / By Collection / By Occasion / By Type / By Weight**; ana bölümler: Luxury Gifts, Organic Dates, Gourmet Food. Hero: "The World's Finest Organic Dates, Artisan Chocolates and Luxury Gift Boxes". Özel gün metni: "personal celebrations and family gatherings to corporate milestones, weddings, anniversaries and festive occasions like Ramadan, including Eid, Christmas, Diwali". **Konfigürasyon:** "Each collection can be customised with premium dates, chocolates or gourmet delicacies". Tasarım dili sözel: "signature gold tin", "Emerald Green Wood Gift Set", "wooden gift boxes, ballotins, premium trays" → altın + koyu yeşil + ahşap lüks teması (ancak **hex/font kanıtı yok**).
**Renk/Tipografi:** **Kanıt bulunamadı** (403).

## 18) sharisberries.com — Shari's Berries (ABD)
**Yöntem:** curl → bağlantı kurulamadı (HTTP 000, TLS/bağlantı hatası); **Tavily extract** → "Failed to fetch url". **Hiçbir kanıt toplanamadı.** Things Remembered footer'ında 1800Flowers ailesinin bir markası olarak listeleniyor.

## 19) andsons.com — (hedef listede "andsons.com")
**Yöntem:** curl ile HTML (44 KB, HTTP 200). **Site artık park edilmiş bir alan adı:** `<title>andsons.com</title>`, H1 "We're getting things ready", meta "Buy this domain / Photo Software". **Çikolata markası değil** — hedef liste muhtemelen yanlış/öldü. (Not: gerçek "And Sons" çikolata markası farklı bir alan adında olabilir; bu adres üzerinden kanıt yok.)

## 20) cocochocolatier.com notu
Hedef listedeki **"cocochocolatier.com"** ve muhtemelen **"cocoachocolate"** atıfları: `cocochocolatier.com` → `madeuncommon.co/pages/coco` (Bölüm A.2'de kanıtlandı). `cocoachocolate.com` ise 9 Kasım 2026'da **bağlantı kurulamadı (HTTP 000)** — hangi marka olduğu doğrulanamadı (bkz. Gaps).

---

# BÖLÜM D — KANITA DAYALI ORTAK TASARIM KALIPLARI ve BEYZA BLANC ÖLÇEĞİ DEĞERLENDİRMESİ

## D.1) Renk kalıpları (gerçek hex'lerle)

**Kanıta dayalı gözlem:** Lüks çikolata markaları iki ana yoldan birini seçiyor; ikisi de kanıtlı:
- **A) Sıcak-nötr + metalik aksan (lüks, "butik"):** zchChocolat `#171310` zemin + `#C84437`/`#786420` aksan; Godiva TR `#303030` metin + `#CFB56A`/`#6F4B21` altın-kahve; Compartes `#31261d`/`#1a1612` + `#e6cd8f` altın; Choc on Choc krem `#F5EFE6` + kahve `#3D2016` + magenta `#B90661`.
- **B) Yüksek kontrast + canlı marka rengi (dijital/DTC):** Milk Bar siyah-beyaz + pembe `#E83A87`/krem `#FFEFDA`; Baked by Melissa fuşya `#E20063`; Vosges beyaz + mürdüm `#3D1152`; COCO Chocolatier siyah-beyaz + teal `#108474`.
- **TR özel:** Godiva TR ve Çiçeksepeti "özel gün"de altın/kırmızı-ticari tonları; Kahve Dünyası teal+maroon `#005E5B`/`#6C0733`; Personal Creations teal `#296E70` + mercan `#F16650`.

**Ortak payda:** Neredeyse tümü **kırık beyaz/krem zemin** (`#FFF…`, `#F5EFE6`, `#FFEFDA`, `#F2E2DB`…) üzerine **tek bir doygun aksan** koyuyor. Altın tonu (`#cfb56a`, `#e6cd8f`, `#786420`) sadece "lüks/hediye" konumundaki markalarda (Godiva, zChocolat, Compartes, Bateel sözel) görülüyor.

## D.2) Tipografi kalıpları (gerçek font aileleriyle)

- **En yaygın kanıtlı kalıp = serif başlık + sans gövde:** Choc on Choc (**P22 Mackinac Pro** serif + Inter), Compartes (**Kepler Std** serif + **Bickham Script Pro** el yazısı monogram + Figtree), zChocolat (**AGaramond/Cormorant Garamond** + Manrope/Jost), Vosges (**Playfair Display** + Roboto/Montserrat).
- **DTC/eğlenceli markalar = özel self-hosted sans:** Milk Bar **Garnett + Pitch Bold** (Google Fonts yok), Baked by Melissa **Proxima Nova/Proxima Nova Condensed** (Typekit), Godiva TR **Gotham**.
- **Google Fonts en sık yüklenen:** Roboto, Montserrat, Open Sans, Inter, Poppins, Figtree, Manrope, Cormorant Garamond. **Typekit** kullananlar: Choc on Choc, Baked by Melissa, Compartes, zChocolat.
- **El yazısı vurgusu (kanıtlı):** Compartes `bickham-script-pro-3` (monogram), Milk Bar `Pitch Bold`. Diğerlerinde el yazısı fontu tespit edilmedi.

## D.3) Özel gün mimarisi kalıpları (gerçek URL'lerle)

Kanıtlanan dört kalıp birlikte kullanılıyor:
1. **`/collections/{occasion}`** (Shopify standardı — Choc on Choc, COCO, Vosges, Milk Bar, Baked by Melissa).
2. **`/pages/{gift-guide}` / `/collections/special-occasions-{occasion}`** (Compartes gift guide; Milk Bar "special-occasions").
3. **Fiyat ekseni** (Vosges: `/collections/gifts-under-25`; Godiva TR: "1.000 TL ve Altı…"). **Kime/alıcı ekseni** (Choc on Choc "Shop By Recipient", Vosges, Things Remembered "BY RECIPIENT").
4. **Türkiye kalıbı:** Godiva TR "Okazyona Göre Hediyeler"; Çiçeksepeti "Özel Günler" + "Gönderim Amacı"; Pelit "Düğün / Hediye Önerileri / Organizasyon". **Türkiye'de özel gün = düğün/nişan + bayram + yılbaşı üçlüsü belirgin** (Godiva: Bayram Çikolatası, Söz & Nişan; Pelit: `/dugun/nikah-sekerleri`, `/dugun/soz-ve-nisan-pastalari`).

## D.4) Kişiselleştirme ve sepet/teslim akışı (kanıtlı)

- **Hediye notu (gift message/hediye notu):** kanıtlı → Choc on Choc, COCO (`/pages/gift-messages`), Milk Bar, Baked by Melissa, **Godiva TR ("Ücretsiz Hediye Notu")**, Kahve Dünyası ("hediye notu").
- **Teslim tarihi seçimi:** kanıtlı → Milk Bar (`select date`), Baked by Melissa, Choc on Choc (`delivery date`), Kahve Dünyası ("teslim tarihi"/"teslimat tarihi"), Godiva TR ("Aynı gün teslimat", "Teslimat seçeneği").
- **Kişiselleştirme biçimi:** ürün sayfası içi ek seçenekler (WooCommerce `woo-custom-product-addons` — Caramel Chocolate), ayrı "Build a Bundle / Build Your Own Bark / Design Your Own" konfigüratörleri (Choc on Choc, Compartes, Sugarfina), gravür/nakış (zChocolat "Personalize"/"engraved", Things Remembered).
- **Misafir checkout:** yalnızca Kahve Dünyası HTML'inde "misafir" kelimesi geçti (zayıf kanıt); diğerlerinde metin düzeyinde doğrulanamadı.
- **Kurumsal hediye entegrasyonu:** `gifts.zest.co/{marka}` (Milk Bar, Vosges) — üçüncü taraf kurumsal hediye platformu; Godiva TR'de doğrudan "Kurumsal Satış".

## D.5) Mobil / yapısal farklar (kanıtlı)

- **Sticky sepete ekle:** Milk Bar'da `sticky-atc.js` + `sticky_bar` (kanıt). 
- **Mobil çekmece menü:** Choc on Choc, Baked by Melissa, Vosges (`component-menu-drawer.css`) (kanıt).
- **WhatsApp/float balon:** Choc on Choc, Milk Bar, Baked by Melissa HTML'inde `whatsapp` metni geçiyor (davranış değil, iz düzeyinde kanıt); Godiva TR'de `floating-widget.css` yükleniyor.
- **Duyuru (announcement) barı:** Milk Bar (`announcement-bar`), Baked by Melissa, Vosges (`announcement_bar.css`), Things Remembered ("Free Shipping over $99").

## D.6) Beyza Blanc için KANITA DAYALI öneri özeti

**Kanıtla desteklenen ve erişilebilir (küçük/orta ölçekte kolay):**
- **Palet:** Kırık-beyaz/krem zemin + **tek sıcak aksan** (kahve `#3D2016` veya altın `#CFB56A`/`#E6CD8F`) — Godiva TR, Choc on Choc, Compartes, zChocolat kanıtı. Butik lüks için "sıcak-nötr + altın", daha dijital/genç için "siyah-beyaz + canlı aksan" (Milk Bar/COCO kalıbı).
- **Tipografi:** **serif başlık + sans gövde** en güvenli ve en yaygın kalıp (Choc on Choc P22 Mackinac + Inter; zChocolat AGaramond/Cormorant + Manrope). Google Fonts ücretsiz eşdeğerleri: Cormorant Garamond / Playfair Display (başlık) + Inter / Manrope / Roboto (gövde). El yazısı vurgu (Compartes Bickham Script) yalnızca monogram/isim alanında ve opsiyonel.
- **Özel gün mimarisi:** `Özel Gün (birincil) + Kime (alıcı) + Kişiye Özel` üç eksen yeterli. **Türkiye'ye özgü zorunlu kalemler kanıtlı:** Söz & Nişan / Düğün, Doğum Günü, Yıl Dönümü, Yeni Bebek, Bayram, Sevgililer Günü, Öğretmenler Günü, Kurumsal (Godiva TR + Pelit + Çiçeksepeti kanıtı).
- **URL kalıbı:** platforma göre `/collections/{occasion}` (Shopify) veya `/kategori/ozel-gun-*` (Woo/TR); Godiva tarzı "Okazyona Göre Hediyeler" gibi **insan diline yakın tek etiket** kullanılabilir.
- **Akış:** **Hediye notu alanı + teslim tarihi seçimi** hem global hem TR'de kanıtlı ve düşük maliyetli → ikisi de konmalı. Kişiselleştirme, ürün sayfası içi ek-seçenek (WooCommerce add-on) olarak en kolay; "kendi kutunu kur" konfigüratörü orta zorlukta (Compartes/Sugarfina kalıbı).
- **Platform seçimi:** Küçük ölçek + Türkiye için **WooCommerce** (Pelit, Caramel Chocolate kanıtı) veya **Shopify** (Godiva TR dahil onlarca global markada hâkim) gerçekçi; Tamamen özel/headless (Compartes Oxygen, Kahve Dünyası Next.js) küçük ölçekte **önerilmez** (yüksek maliyet).

**Erişilebilir olmayan / küçük ölçekte gerçekçi olmayan (kanıtlı):**
- Kendi kurumsal hediye platformu (`gifts.zest.co` entegrasyonu) — üçüncü tarafla çözülür.
- Headless/hydrogen (Compartes) ve Next.js SPA (Kahve Dünyası) mimarisi — küçük ölçekte bakım maliyeti yüksek.
- Marka-spesifik self-hosted font lisansları (Garnett, Gotham, P22 Mackinac, Proxima Nova) — lisans maliyeti; ücretsiz eşdeğerlerle taklit edilebilir.

---

# GAPS (kanıt elde edilemeyen noktalar — tahmin yürütülmedi)

1. **Görsel/piksel kanıt yok:** Hiçbir sitede ekran görüntüsü alınmadı; renk/font yalnızca kaynak koddan çıkarıldı. "Animasyon/geçiş" davranışları **doğrulanamadı** (yalnızca `text-speed`, `sticky` gibi izler).
2. **sugarfina.com, thingsremembered.com, bateel.com:** HTTP 403 / Cloudflare → yalnızca Tavily metni; **renk hex'i ve font ailesi elde edilemedi.** (Sugarfina altyapısı = Magento 2/Corra, URL yolundan kanıtlı.)
3. **sharisberries.com:** Erişilemedi (curl 000 + Tavily başarısız) — **hiçbir kanıt yok.**
4. **andsons.com:** Park edilmiş alan adı (çikolata markası değil).
5. **cocoachocolate.com:** Bağlantı kurulamadı; hangi marka olduğu doğrulanamadı.
6. **kahvedunyasi.com:** Nav ve font HTML'de yok (Next.js client render + CSS chunk indirilmedi) → **font kanıtı yok**, özel gün mimarisi kanıtlanamadı.
7. **pelit.com.tr:** Renk paleti HTML'de zayıf (banner görsellerinde); net marka hex'i ve ana sayfa bölüm sıralaması JS düzeyinde doğrulanamadı.
8. **ciceksepeti.com:** 403 + SPA → **renk/font kanıtı yok**; platform izi doğrulanamadı.
9. **Misafir checkout:** Metin düzeyinde yalnızca Kahve Dünyası'nda "misafir" geçti; gerçek sepet/checkout adım sayısı hiçbir sitede cURL ile (oturum açmadan) doğrulanamadı.
10. **Compartes klasik Liquid tema mı?** Hayır — Oxygen/Hydrogen (headless) kanıtlı; ancak Liquid mi Hydrogen mı kesin ayrımı yalnızca URL chunk yapısından yapıldı.
11. **Patchi:** Kurumsal site kanıtlandı; gerçek e-ticaret mağazasının ("Visit Online Store") ayrı platformu/URL'i incelenmedi (kapsam dışı bırakıldı).
12. Bazı hex kodları (ödeme ikonları, Laravel/WordPress varsayılan paletleri, izleme pikseli `#003399`) marka paletiyle karışabilir; yukarıda bunlar ayrıştırıldı ancak tam doğrulama için marka style guide erişimi gerekir.
