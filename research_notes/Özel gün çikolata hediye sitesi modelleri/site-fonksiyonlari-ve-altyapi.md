# Özel Gün Çikolata / Hediyelik E-Ticaret Siteleri — Fonksiyon, Araç ve Teknoloji Altyapısı Envanteri

> Kapsam notu: Araştırma global önceliklidir. Türkiye'ye özgü altyapı (Ticimax, İdeasoft, iyzico, PayTR, Shopier vb.) bu nota **dahil edilmemiştir** (ayrı araştırmacı). Tüm fiyatlar 2026 yılı kaynak verilerine dayanır; para birimi USD (aksi belirtilmedikçe) ve Shopify App Store liste fiyatlarıdır. Araç adları orijinal yazımıyla korunmuştur.
>
> Fiyat toplama tarihi aralığı: kaynaklarda en güncel veriler 2026 (bazıları Ekim–Kasım 2026, bazıları Mart–Temmuz 2026). Bazı sayfalarda yalnızca yıl belirtildiği için aylık tarih verilememiştir.

---

## 1. Kişiselleştirme / Konfigüratör Araçları (Zakeke, Kickflip, Threekit, Spiff, Customily, Product Personalizer, Bold, Angle3D ve benzerleri)

### Takeaway
Bu kategoride iki ayrı segment vardır: (a) çikolata/kutu üzerine baskı veya gravür yapan butikler için **uygun fiyatlı 2D kişiselleştiriciler** (Customily, Zepto Product Personalizer, Inkybay, Teeinblue, Kickflip, Zakeke — çoğu aylık $8–$70 + kişiselleştirilmiş ürün başına %0–1,9 işlem ücreti) ve (b) mobilya/makine gibi karmaşık ürünler için **kurumsal 3D konfigüratörler** (Threekit, Spiff 3D — teklif bazlı, yıllık on binlerce dolar). Butik bir hediye çikolata markası için doğru katman birinci segmenttir. Çoğu araç canlı önizleme (live preview) ve baskıya hazır dosya üretimi sunar; düşük çözünürlük/DPI uyarısı ise yalnızca bazı araçlarda (Zakeke, Zepto, PIMW/Cmsmart) doğrulanmıştır. "Angle3D" adlı bir ürün için güvenilir kaynak bulunamadı.

### Cited Findings
- **Zakeke (Shopify App Store, en güncel liste):** Starter **$69,90/ay** (ya da $712,98/yıl, %15 tasarruf), Grow **$129,90/ay**, Scale **$299,90/ay**; üç planda da satılan kişiselleştirilmiş ürün başına **%1,9 / %1,7 / %1,5 işlem ücreti** (min. 2 cent). 101 yorum. — [Shopify App Store / Zakeke](https://apps.shopify.com/zakeke-interactive-product-designer)
  - **Çelişki:** Bazı kaynaklar başlangıç fiyatını **$19,90/ay** (10–25 ürün, "Powered by Zakeke" etiketi) olarak verir; başka bir karşılaştırma yazısı **$79,90/ay + %1,9** (5 ürün) der. Bu farklılık büyük olasılıkla plan/içerik değişikliği ve üçüncü taraf sitelerin eski verilerinden kaynaklanmaktadır. — [PageFly Help](https://help.pagefly.io/page-structure-and-elements/optimization/how-to-use-the-zakeke-product-customizer-on-pagefly-pages); [Chamevo](https://chamevo.com/blog/best-zakeke-alternatives-shopify)
  - **Ne yapar:** 2D kişiselleştirici + 3D konfigüratör, 3D/AR görüntüleyici, Virtual Try-On, canlı önizleme, dinamik fiyatlandırma kuralları, siparişi otomatik baskıya hazır dosyaya çevirme (PDF, layer'lı PDF, PNG, SVG, DXF, DXF HQ, BMP, gravür), POD entegrasyonları, çok dil (Türkçe dahil). — [Zakeke Shopify](https://www.zakeke.com/integrations/shopify); [BigCommerce / Zakeke](https://www.bigcommerce.com/apps/zakeke)
  - **Hangi platform:** Shopify, WooCommerce, BigCommerce, PrestaShop, Etsy. — [BigCommerce](https://www.bigcommerce.com/apps/zakeke); [WordPress.org](https://wordpress.org/plugins/zakeke-interactive-product-designer)
  - **DPI / düşük kalite uyarısı:** Zakeke, yüklenen görselin seçilen DPI ve ürün boyutunda "net mi bulanık mı" görüneceğini hesaplayıp uyarı gösterir. — [Zakeke Zendesk — "Warning message for low quality images"](https://zakeke.zendesk.com/hc/en-us/articles/360016059114-Warning-message-for-low-quality-images)
  - **Risk notu (kullanıcı geri bildirimi):** Bir yorum, Zakeke'nin ticari şartlarını değiştirip mevcut müşterilere geriye dönük uygulayabildiğini ve depolama maliyeti şeffaflığının zayıf olduğunu iddia ediyor — sözleşme şartları incelenmeli. — [Shopify App Store / Zakeke yorumları](https://apps.shopify.com/zakeke-interactive-product-designer)
- **Kickflip:** Tek self-serve planda **$59/ay + satılan özel ürün başına %1,95 → %0** (hacimle düşer). Ekler: White-label +$49/ay, Configure Price Quote +$99/ay. Kurumsal üst planlar (Plus **$299,99/ay**, Enterprise teklif bazlı) ve widget-serve limitleri raporlanmıştır. 139 yorum. — [Kickflip Pricing](https://gokickflip.com/pricing); [Shopify App Store / Kickflip](https://apps.shopify.com/mycustomizer-1); [Glood AI](https://glood.ai/shopify-apps/kickflip-product-configurators)
  - **Ne yapar:** Canlı önizleme (çoklu perspektif), dinamik fiyat, dinamik renklendirme, sınırsız varyant, çok bileşenli ürün, ürün paketleme, metin/font/görsel yükleme, baskıya hazır dosya, çok dil/çok para birimi; 3D önizleme. — [gokickflip.com/pricing](https://gokickflip.com/pricing)
  - **Hangi platform:** Shopify ve Wix. — [Wix App Market](https://www.wix.com/app-market/kickflip-customize-products)
- **Customily Product Personalizer:** **$49/ay + kişiselleştirilmiş ürün başına $0,10–$1,00** (kademeli/düşen), sınırsız ürün/mockup/baskı-hazır dosya. 280 yorum. — [Shopify App Store / Customily](https://apps.shopify.com/customily-product-personalizer); [Customily Pricing](https://www.customily.com/pricing)
  - **Ne yapar:** Canlı önizleme ile gerçek zamanlı kişiselleştirme (metin, fotoğraf, takvim, AI filtre), otomatik baskıya hazır dosya, POD entegrasyonları (Printify/Printful/ShineOn/Gelato). Takvim/star-map/street-map gibi hazır bloklar. — [Customily Shopify](https://www.customily.com/shopify-product-personalizer)
  - **Hangi platform:** Shopify, WooCommerce, Etsy, Amazon, Shoplazza (diğer platformlar için **Customily Standalone $299/ay + işlem ücreti**). Çok dil (Türkçe dahil). — [Customily Standalone Pricing](https://www.customily.com/standalone-pricing); [Customily Pricing](https://www.customily.com/pricing)
  - **Kişiselleştirme başına ek ücret nasıl alınır:** Seçeneğe fiyatlı bir Shopify ürünü (veya varyantı) bağlanır; seçilince sepete ek satır olarak düşer (ör. $30 ürün + altın varak +$5 = $35). — [Customily Help Center](https://help.customily.com/articles/7176815740-how-to-charge-extra-for-the-personalizations)
- **Zepto Product Personalizer (Product Personalizer by Zepto):** Planlar **Free / $9,99 / $19,99 / $34,99 / $69,99 /ay** (sipariş limitlerine göre); 1.400+ yorum, 110.000+ satıcı. 22+ opsiyon tipi (metin, görsel yükleme, renk swatch, tarih seçici), koşullu mantık, dinamik fiyat, canlı önizleme, baskıya hazır çoklu çıktı. — [productpersonalizer.com](https://productpersonalizer.com); [Zepto docs](https://productpersonalizer.com/docs/how-the-app-charges)
  - **DPI/kalite kontrolü:** Ayarlanabilir **minimum yükleme boyutu** vardır; altındaki çözünürlükler reddedilir (mesaj özelleştirilebilir). — [Zepto docs — Min upload size](https://www.productpersonalizer.com/zh/docs/ref-min-upload-size)
  - **Sadece Shopify.**
- **Inkybay ‑ Product Personalizer:** **$19,99 / $49,99 / $99,99 / $249,99/ay** (Starter→Unlimited); 168 yorum. DTF/DTG/embroidery/sublimation gibi çok baskı yöntemi, SVG/vektör çıktı. — [Shopify App Store / Inkybay](https://apps.shopify.com/productsdesigner)
- **PC ‑ Custom Product Options (Hulk Product Options):** **Free / $8,90 / $18,90/ay**; 1.180 yorum. 24+ alan tipi, varyant bazlı fiyat. — [Shopify App Store / PC Custom Product Options](https://apps.shopify.com/product-customizer)
- **Teeinblue Product Personalizer:** Kişiselleştirilmiş ürün başına **$0,10–$0,40 işlem ücreti** + aylık abonelik; 391 yorum. Canlı önizleme, AI fotoğraf efektleri, otomatik üretim dosyası, Canva/PSD import, POD entegrasyonları. — [Shopify App Store / Teeinblue](https://apps.shopify.com/teeinblue)
- **Aris Product Options, Variants:** Free–**$59/ay**; 4,9 / 1.693 yorum. — [TinySEO](https://tinyseo.com/best-shopify-apps/for-product-customization)
- **Bold Product Options SC (BOLD):** **$14,99–$39,99/ay**; gizli varyant ile varyant bazlı fiyatlandırma. — [Print It My Way karşılaştırması](https://www.printitmyway.com/blog/bold-product-options-vs-zepto-product-personalizer)
- **Chamevo (Fancy Product Designer):** Basic **$30/ay**, 10 ürün, **işlem ücreti yok**; Zakeke'ye ucuz alternatif olarak pazarlanır. — [Chamevo](https://chamevo.com/blog/best-zakeke-alternatives-shopify)
- **Print It My Way (PIMW) Product Personalizer:** Free / Basic **$7,99** / Pro **$13,99** / Unlimited **$24,99/ay**, sipariş başına ücret yok; canlı önizleme, Cart Transform ile fiyat farkı. **DPI + boyut + sıkıştırma kalite kontrolü** her yüklemede uyarı verir. — [PIMW — image quality check](https://www.printitmyway.com/blog/how-to-add-image-quality-check-shopify)
- **Diğer düşük maliyetli araçlar:** SB Custom Product Personalizer (from **$9,99/ay**), Easify (free / $9,99), Qstomizer (from **$9,99/ay**), Customify (from **$10/ay**), Webyze Live Preview Options (**$9/$14/$23/$35/ay**). — [Customily blog](https://www.customily.com/post/top-7-best-product-personalizer-apps-for-shopify); [Shopify App Store / Webyze](https://apps.shopify.com/infinite-live-preview-options)
- **Bold Custom Pricing (BOLD) — DİKKAT: bu bir kişiselleştirici DEĞİLDİR**, B2B/VIP/kademeli fiyat uygulamasıdır: **$29/ay** (1 müşteri etiketi), **$69/ay** (10 etiket), **$129/ay** (sınırsız etiket); 4,4 yıldız / 514 yorum. Shopify POS ve çok para birimi desteği. — [Blumacawtech](https://blumacawtech.com/blog/bold-custom-pricing-alternatives); [DelightChat](https://www.delightchat.io/apps/customer-pricing)
- **Threekit (kurumsal 3D):** Fiyat kamuya açık değil; tarihsel olarak **$999/ay'dan başladığı**, kurumsal sözleşmelerin **$30.000–$100.000+/yıl** (render kredisi ve SKU başına asset ücretleri eklenebilir) olduğu; ayrıca her bileşen/varyant için profesyonel 3D modelleme (Maya/3DS Max) gerektirdiği için canlıya çıkmadan on binlerce dolar asset maliyeti doğduğu raporlanır. G2/Capterra verisi. — [CPQ3D pricing guide](https://cpq3d.com/3d-product-configurator-cost); [Configurator.tech](https://configurator.tech/blogs/threekit-configurable-products-review)
- **Spiff 3D:** İleri seviye 3D konfigürasyon; **fiyat "teklif için iletişime geçin"**. Mobilya/home goods odaklı. — [yuko.so](https://yuko.so/blog/shopify-product-configurator-apps)
- **Angle3D:** Güvenilir bir kaynak **bulunamadı** (bkz. Gaps).

### Inferences
- Butik çikolata için gereken özellik kümesi (metin + fotoğraf + font + canlı önizleme + baskıya hazır dosya) **Customily ($49/ay), Zepto ($19,99–$34,99/ay) veya Inkybay ($19,99–$49,99/ay)** ile karşılanabilir; 3D/AR katmanı çikolata kutusu gibi basit hacimli ürün için gereksiz maliyettir (Threekit/Spiff/Jump 3D segmenti butik ölçeğinin 10–50 katı maliyet).
- İşlem ücreti modeli ölçekte pahalılaşır: %1,9 işlem ücreti, ayda $10.000 kişiselleştirilmiş ürün satışında **ek $190/ay** demektir; sabit ücretli (PIMW, Chamevo) araçlar düşük hacimde daha ucuz başlar. — [Print It My Way](https://www.printitmyway.com/blog/custom-product-builder-vs-kickflip); [Chamevo](https://chamevo.com/blog/best-zakeke-alternatives-shopify)
- DPI uyarısı "olmazsa olmaz" değil ama baskı hatasını (yeniden üretim maliyetini) önlediği için yüksek değerli görsel yükleyen (ör. bebeğinin fotoğrafı) senaryoda önemlidir; Zakeke, Zepto ve PIMW'de doğrulanmıştır. Customily/Kickflip için DPI uyarısı kaynağı bulunamadı → kesin iddia edilmemeli.

### Gaps
- Zakeke gerçek başlangıç fiyatı kaynaklar arasında çelişkili ($19,90 vs $69,90 vs $79,90) — canlı Shopify App Store sayfasından teyit edilmeli (bugünkü sayfa $69,90 gösteriyor).
- "Angle3D" adlı araç için hiçbir güvenilir kaynak yok; isim hatalı olabilir veya niş/yerel bir ürün olabilir.
- Kickflip'in Pro/Plus/Enterprise ara plan fiyatları yalnızca üçüncü taraf aggregator'da (Glood) görüldü; Shopify/üretici sayfasından doğrulanamadı.
- Threekit güncel fiyatı yalnızca "teklif" — rakamlar geçmiş/G2 tahminidir.

---

## 2. Özel Gün Senaryolarına Özgü Araçlar (formlar, teslim tarihi, hediye notu, hatırlatıcı, yeniden sipariş, abonelik)

### Takeaway
Bu senaryo için gereken paket: (a) isim/tarih/kilo-doğum gibi alanları toplayan **özel alanlar** — çoğu personalizer/options uygulaması metin kutusu ve tarih seçici ile sağlar; (b) **teslim tarihi/planlı teslimat** — $3,99–$7,99/ay gibi çok düşük maliyetli uygulamalarla; (c) **hediye notu** — gifting uygulamalarının çekirdek özelliği; (d) **yeniden sipariş** — Shopify'ın yerleşik "Buy Again" butonu kişiselleştirme satır özelliklerini taşımadığı için özel ürünlerde yetersiz, ek uygulama gerekir; (e) **abonelik** — Shopify Subscriptions ücretsiz başlar, ciddi ölçekte Recharge/Appstle/Loop. **Doğum günü hatırlatıcı** için ticari bir uygulama var ama bağımsız fiyat kaynağı zayıf.

### Cited Findings
- **Teslim tarihi seçici (planlı teslimat):**
  - EM Delivery Date Scheduler — Basic **$3,99/ay**, Premium **$7,99/ay**; teslim tarihi/saat aralığı, kapatılan tarihler (blackout), kapasite limiti, **hediye notu ve teslim notu**. — [Shopify App Store / EM Delivery Date Scheduler](https://apps.shopify.com/delivery-date-picker-plus)
  - Delivery Date & Pickup Stellar (Identixweb) — yerel teslim ve mağazadan teslim alma, Google Calendar senkronizasyonu, güne göre kargo ücreti. — [Shopify App Store / Delivery Date & Pickup Stellar](https://apps.shopify.com/order-delivery-date-by-identixweb)
  - Teslim tarihi seçicinin nasıl çalıştığı: takvim widget'ı → hazırlık süresi ve kapasite kontrolü → geçerli tarihler → siparişe kayıt → zamanında bildirim. Çiçek/hediye gibi zaman-kritik ürünlerde "olmazsa olmaz". — [Bird Chime](https://www.birdchime.com/post/shopify-delivery-date-picker-everything-you-need-to-know)
- **Özel gün form alanları (isim/tarih/kilo-doğum):** Personalizer/options uygulamaları metin kutusu, tarih seçici, dosya yükleme alanları sunar (ör. Zepto 22 opsiyon tipi, Customily sınırsız alan). — [productpersonalizer.com](https://productpersonalizer.com); [Customily blog](https://www.customily.com/post/top-7-best-product-personalizer-apps-for-shopify)
- **Yeniden sipariş (reorder):**
  - Shopify yerleşik **"Buy Again"** butonu yeni müşteri hesaplarında mevcuttur; ancak **satır öğesi özelliklerini (line item properties = kişiselleştirme) taşımaz**, miktar düzenlemeye/belirli ürün seçmeye/indirim/hatırlatıcıya izin vermez. Kişiselleştirilmiş ürünlerde eksik kalır. — [Smiley Commerce](https://smileycommerce.com/blog/shopify-native-reorder-vs-reorder-app)
  - Uygulamalar: Reorder Buy Again Repeat Order (HulkApps) — tek tık, hesap/B2B/checkout/teşekkür sayfasında buton, **hatırlatma e-postaları**, indirimler, Klaviyo/Mailchimp senkronu; 57 yorum. — [Shopify App Store](https://apps.shopify.com/simple-reorder)
  - Reorder Reminder Pro — Free / **$12 / $39 / $89/ay**; ürün başına "kullanım günü" ile otomatik hatırlatma. — [Shopify App Store](https://apps.shopify.com/reorder-reminder-pro)
  - Reorderify (hesap/teşekkür sayfasına tek tık buton), Replenish ‑ Reorder Reminders (Free–$199). — [Shopify App Store / Reorderify](https://apps.shopify.com/reorderify); [Shopify App Store / Replenish](https://apps.shopify.com/replenish-orders)
- **Doğum günü hatırlatıcı:** "Birthday Reminder for Shopify" uygulaması mağaza sahibinin müşterinin doğum gününde mesaj/indirim göndermesini sağlar. — [YouTube / Birthday Reminder for Shopify](https://www.youtube.com/watch?v=vsCbVx6h0jQ)
- **Abonelik (subscription):**
  - **Shopify Subscriptions (yerleşik) — Free**; haftalık/aylık/yıllık otomatik faturalama, pause/skip/cancel, POS, e-posta şablonları; 3,7/872 yorum. — [Shopify blog](https://www.shopify.com/blog/subscription-billing-automation); [Enrich Labs](https://www.enrichlabs.ai/blog/shopify-subscriptions-complete-guide-2026)
  - **Recharge:** **$25/ay** (yalnızca 9 Şubat 2026'dan sonra kurulan mağazalar ve ilk 50 abone), Starter **$99/ay + %1,49 + $0,19/işlem**, Plus **$499/ay + %1,34 + $0,19**; Shopify'daki aboneliklerin %71'ini işlediği belirtilir; 4,8/3.121 yorum. — [Shopify blog](https://www.shopify.com/blog/subscription-billing-automation); [Subi](https://subi.co/post/shopify-recurring-payments-app); [Recurpay](https://www.recurpay.com/blog/recurpay-vs-recharge-which-shopify-subscription-app-is-better-in-2026)
  - **Appstle Subscriptions:** Free (aylık $500 aboneliğe kadar) / **$10/ay'dan**, %0 işlem ücreti; 5,0/8.824 yorum. — [Subi](https://subi.co/post/shopify-recurring-payments-app)
  - **Seal Subscriptions:** Free (50 aboneye kadar) / **$5,95 / $9,95 / $24,95/ay**, %0 komisyon; 4,9/3.116.
  - **Loop Subscriptions:** Free (50 aktif aboneye kadar) / **$99/ay + %1**; Skio (kurumsal), Joy/Bold Subscriptions (**$24,99–$49/ay + %0,75–%2**). — [Subi](https://subi.co/post/shopify-recurring-payments-app); [LAUNCHTIP](https://www.launchtip.com/blog/a-round-up-of-9-subscription-apps-for-shopify)
  - **Gerçeklik uyarısı:** Recurly verisine göre e-ticaret medyan yıllık churn %4,25; ödeme kurtarma ve pause/skip araçları ilk "Subscribe & Save" widget'ı kadar önemli. — [Enrich Labs](https://www.enrichlabs.ai/blog/shopify-subscriptions-complete-guide-2026)

### Inferences
- Butik çikolata için abonelik (aylık çikolata kutusu) çekirdek iş değilse önce **ücretsiz Shopify Subscriptions** ile test edilmesi, ölçek gelince Recharge/Appstle'a geçilmesi rasyoneldir (Recharge'ın %1,49 işlem ücreti düşük hacimde anlamsızdır; Appstle $10/ay ile %0 komisyon bu ölçekte daha uygun).
- Kişiselleştirilmiş ürünlerde (ör. "Beyza'nın doğum günü kutusu") yerleşik Buy Again butonu kişiselleştirmeyi taşımaz → yeniden sipariş bir "ikinci faz" özelliğidir ve özel ürün hatırlatıcısı için ücretli uygulama gerekir.

### Gaps
- Türkiye/global pazarda "özel gün hatırlatma takvimi" (doğum günü/yıldönümü) sunan özel bir araç için kapsamlı fiyat karşılaştırması bulunamadı; yalnızca bir uygulama (Birthday Reminder) ve onun kaynağı YouTube tanıtımıdır — bağımsız fiyat yok.
- "Kilo-doğum bilgisi" gibi özel alanları çikolata özelinde toplayan hazır bir uygulama/şablon örneği bulunamadı; bunlar genel "custom fields / date picker" özellikleriyle kurulur, sektöre özel paket yok.

---

## 3. Hediye Kutusu ve Sepet Araçları (hediye kartı/notu, ambalaj, adres defteri, çoklu adres, kargo takibi, kırılabilirlik/soğuk zincir, sigorta)

### Takeaway
Hediye katmanı uygulamaları ucuzdur ($0–$99/ay) ve hediye notu + ambalaj + teslim tarihi + çoklu adres gönderimini tek çatıda toplayabilir (Giftnote, Giftship, Wrapped, Wrapin, Super). **Çoklu adrese gönderim** teknik olarak sorunludur: bazı uygulamalar orijinal siparişi iptal edip yeni siparişler yarattığı için müşteriye iptal bildirimi gider ve analitik çift sayar. **Kırılabilirlik/soğuk zincir** için hazır "cold chain" uygulaması bulunamadı; mevcut çözüm **paket koruma/sigorta** (Route, Navidium, Captain Shipping Protection, SureBright) ve ambalajın operasyonel kurulumudur. Route'un politası, bozulabilir (perishable) ürünleri yalnızca "kendi takdirinde" kapsar — soğuk zincir garantisi vermez.

### Cited Findings
- **Giftnote: Gift Message & Cards:** Free (Gift Audit) / Core Gifting **$19/ay** (ilk 20 hediye alıcısı ücretsiz, sonra $1/alıcı) / Pro **$99/ay** (çoklu adresli siparişlerde %2, müşteriye aktarılabilir). Hediye mesajı **teslimatta SMS/e-posta** ile gönderilir (baskı yok, her 3PL ile çalışır); hediye kartı/store credit alıcıya gider; **kurumsal alıcılar tek checkout'ta 1.000 alıcıya** gönderir; alıcılar Klaviyo'ya senkronlanır; "Moments" takvimi. 172 yorum. — [Shopify App Store / Giftnote](https://apps.shopify.com/giftnote)
- **Wrapped: Gift Wrap & Messages:** Free / **$19 / $49 / $99/ay**; siparişin tamamı için (veya ürün başına) hediye paketi + hediye mesajı, ürün/cart/checkout blokları; 131 yorum. — [Shopify App Store / Wrapped](https://apps.shopify.com/wrapped)
- **Wrapin ‑ Gift Wrap & Options:** Free / **$3,99 / $5,99 / $7,99/ay**; ürün/cart/side-cart'ta çoklu paket seçeneği, sipariş etiketleme, istatistik; 378 yorum. — [Shopify App Store / Wrapin](https://apps.shopify.com/wrapin-gift-wrap)
- **Super: Gift Wrap, Gift Message (Effective Apps):** Free / pay-as-you-go kademeleri; paket + hediye notu + hediye fişi. — [Shopify App Store / Super](https://apps.shopify.com/super-gift-wraps)
- **Giftship (all-in-one):** Çoklu adrese gönderim + hediye mesajı + **teslim tarihi seçimi** + ürün/cart/checkout seçenekleri. — [Shopify Enterprise blog — gift wrapping](https://www.shopify.com/enterprise/blog/gift-wrapping-ecommerce); [YouTube / Giftship](https://www.youtube.com/watch?v=JqQUU95259s)
- **Hediye paketi fiyat aralığı (operasyonel referans):** Shopify Enterprise blog, hizmet kademesine göre tipik ambalaj fiyatının **$3–$10** olduğunu söyler. — [Shopify Enterprise blog](https://www.shopify.com/enterprise/blog/gift-wrapping-ecommerce)
- **Çoklu adres gönderimin sorunları (kullanıcı deneyimi):** Bazı uygulamalar mevcut siparişi iptal edip her adres için yeni sipariş yaratır → müşteriye iptal bildirimi, destek yükü ve analitikte **çift sayım** (ör. $200 sipariş $400 olarak sayılır). — [Shopify Community](https://community.shopify.com/t/shipping-to-multiple-addresses-for-holiday-gift-giving/268578)
- **Kargo sigortası / paket koruma:**
  - **Route:** Üçüncü taraf sigortalı; kayıp, hasar, hırsızlık, gecikme ve **"varışta bozulabilirlik"** kapsanır (belirtilir); ancak geçersiz adres/teslim engeli/iade edilen paketler kapsanmaz ve **bozulabilir ürünleri yalnızca "kendi takdirinde"** kapsar. Kurulum ücretsiz, gelir paylaşımı modeli; 13.000 marka, ~150M sipariş ağı (2026 verisi). Entegrasyon: Shopify, Salesforce, Magento, BigCommerce, WooCommerce. — [Route shopper policies](https://shoppers.help.route.com/hc/en-us/articles/6017831679511-Route-Package-Protection-Policies); [Farmgirl Flowers (Route kapsamı)](https://farmgirlflowers.com/hc/questions/10-why-should-i-purchase-route-package-protection-and-how-does-it-work); [RocketReach / Route](https://rocketreach.co/route-profile_b454d61efc9334a5)
  - **Navidium:** Self-funded (ücret senin, hasar talebi senin) — Free (50 siparişe kadar) / **$29,99/ay**; 4,9/~350 yorum. — [Piratify](https://piratify.io/blog-posts/best-shopify-apps-shipping-protection-3swq)
  - **Captain Shipping Protection:** Self-funded — Free (25 korumalı sipariş/ay) / **$9,95/ay** (sınırsız) / **$39,95/ay** (Plus, checkout widget); 4,9/~242. — [SetuBridge](https://www.setubridge.com/top-shopify-shipping-protection-apps)
  - **SureBright:** Üçüncü taraf sigortalı, komisyon bazlı, garanti + koruma; 4,8/~321. — [Piratify](https://piratify.io/blog-posts/best-shopify-apps-shipping-protection-3swq)
  - **Sadece Shipping Protection:** Free (%10 komisyon) veya ücretli plan; küçük mağazalar. — [Piratify](https://piratify.io/blog-posts/best-shopify-apps-shipping-protection-3swq)
  - **Ne zaman değer:** AOV < $80 ve kırılgan olmayan yurt içi gönderimde taşıyıcı sorumluluğu yeterli olabilir; ayda 50 sipariş veya AOV > $100 eşiğinde özel plan mantıklı olur. — [InsureShip](https://insureship.com/blogs/news/shopify-shipping-insurance-options-compared)

### Inferences
- Butik çikolata için en düşük maliyetli hediye paketi **Wrapin ($3,99–$7,99/ay)** veya **Wrapped ($19–$49/ay)**; hediye notu + teslim tarihi + çoklu adresi tek araçta istersen **Giftship/Giftnote** tercih edilir.
- Çoklu adrese gönderim gerekmedikçe (kurumsal hediye hariç) bu özellik "ikinci faz"dır; çünkü analitik/iptal yan etkileri operasyonel karmaşıklık getirir.
- Sıcak/soğuk hassasiyeti olan çikolata için sigorta tek başına soğuk zincir çözmez; asıl çözüm **ambalaj (termo/izole) + kargo süresi vaadi + kargo sigortası** kombinasyonudur. Uygulama tarafında yalnızca paket koruma satın alınabilir.

### Gaps
- "Soğuk zincir" (cold chain) için hazır bir Shopify/e-ticaret uygulaması **bulunamadı**; bu tamamen operasyonel/kargo sağlayıcı tarafı bir konu. Kırılabilir ürün için özel "ambalaj seçimi + kargo sigortası" paketleyen tek bir araç da tespit edilemedi.
- Adres defteri (saved addresses / address book) için ayrı bir araç fiyatı bulunamadı (Shopify yerleşik müşteri hesabı ve bazı B2B uygulamaları bu işlevi sağlar).

---

## 4. Kurumsal / B2B Araçları (toplu sipariş, CSV alıcı listesi, teklif modülü, kademeli fiyat, fatura ile satış, kurumsal hesap/onay)

### Takeaway
2026 itibarıyla Shopify native B2B, şirket hesapları/konumları, kataloglar, miktar kuralları, kademeli fiyat (price breaks), net vadeli ödeme (net terms), PO numarası ve hızlı sipariş listelerini **daha fazla plana** yaymış durumdadır; bu nedenle tam bir wholesale uygulaması kurmak şart değildir. Boşlukları (müşteriye özel fiyat, kapalı katalog, teklif isteme, hızlı sipariş formu, CSV toplu yükleme) uygulamalar doldurur — tipik olarak $12–$70/ay. Kurumsal hediye (CSV ile 1.000 alıcıya gönderim, fatura ile satış) ise Giftnote gibi gifting uygulamalarıyla çözülür.

### Cited Findings
- **Shopify native B2B (2026):** Şirket hesapları/lokasyonları, kataloglar, miktar kuralları, price breaks, net terms, PO numarası, kolay yeniden sipariş ve hızlı sipariş listeleri artık daha fazla planda standart. — [Fyresite](https://www.fyresite.com/best-shopify-b2b-apps)
  - **Çelişki/uyarı:** Başka bir kaynak, standart Shopify planlarının native wholesale özelliklerden yoksun olduğunu ve kademeli/wholesale checkout için **Shopify Plus (~$2.300–$2.500/ay)** gerektiğini savunur. Native B2B'nin plan kapsamı plana/güncellemeye göre değişebilir → teyit edilmeli. — [WizCommerce](https://wizcommerce.com/blog/shopify-pricing)
- **Teklif (Request a Quote) modülü:**
  - **BSS B2B Order, Request a Quote:** Free / Startup **$12,99** / Pro **$24,99** / Advanced **$36,99/ay**; teklif + hızlı sipariş formu + **CSV toplu yükleme**, tek tık yeniden sipariş, fiyat gizleme, e-posta onayı, teklifi draft siparişe çevirme; 4,9 / 170+ yorum. — [SetuBridge](https://www.setubridge.com/top-shopify-apps-for-custom-b2b-quotes); [webframez](https://webframez.com/blog/10-top-shopify-quote-apps-for-custom-pricing-2026-comparison)
  - **SA Request a Quote, Hide Price:** Free (20 teklif/ay) / Pro **$7,99** / Plus **$10,99** / Premium **$13,99/ay**. — [webframez](https://webframez.com/blog/10-top-shopify-quote-apps-for-custom-pricing-2026-comparison)
  - **Quotify:** Basic **$5,99** / Pro **$14,99** / Premium **$24,99/ay**. **Quotezic** (form + PDF teklif + analitik), Quotes Guru. — [GroPulse](https://gropulse.com/best-shopify-request-a-quote-apps); [Pixelfic](https://pixelfic.com/best-request-a-quote-apps-for-shopify)
  - **AI Request a Quote (SetuBridge):** Free / **$16,99/ay'dan**; AI lead scoring, WhatsApp teklifleri, PDF, Mailchimp. — [SetuBridge](https://www.setubridge.com/top-shopify-apps-for-custom-b2b-quotes)
- **Wholesale / B2B fiyat & portal:**
  - **SparkLayer:** Free (B2B katalog + hacim fiyat kırılımı) / Starter **$49/ay**; 4,9/360+; satış temsilcisi portalı, teklif motoru, ERP entegrasyonları. — [SparkLayer](https://www.sparklayer.io/best-wholesale-app-shopify)
  - **Wholesale Gorilla:** Lite **$34,95** / Advanced **$69,95/ay**; kademeli indirim (yalnızca Premium), kayıt/onay akışı, hızlı sipariş formu, ürün/fiyat gizleme. — [SparkLayer](https://www.sparklayer.io/best-wholesale-app-shopify)
  - **BSS B2B Wholesale Solution** (4,8/900+), **Wholesale Pricing Discount B2B** (net terms daha düşük kademede), **B2B Wholesale Club by Orbit**, **Sami B2B Wholesale Pricing** (4,9/800+) — hepsi 14–30 gün ücretsiz deneme.
  - **Bold Custom Pricing (BOLD):** $29 / $69 / $129/ay (etiket sayısına göre); wholesale+VIP+quantity breaks tek araçta, Shopify Checkout/POS içinde. — [Bold Commerce](https://boldcommerce.com/shopify/custom-pricing)
- **CSV ile toplu alıcı/kurumsal hediye:** Giftnote Pro ($99/ay) ile **tek checkout'ta 1.000 alıcıya** çoklu adresli kurumsal hediye gönderimi; fatura düzenleme için Shopify'ın draft order / invoice akışı kullanılabilir. — [Shopify App Store / Giftnote](https://apps.shopify.com/giftnote)
- **Maliyet uyarısı:** Standart B2B özellikleri (MOQ, teklif, toplu fiyat) için tipik olarak 5–10 üçüncü taraf aboneliği gerekir ve bu **ayda $100–$500+** eder; base Shopify aboneliğini aşabilir. — [WizCommerce](https://wizcommerce.com/blog/shopify-pricing)

### Inferences
- Butik ölçeğinde (tek şube, düşük kurumsal hacim) native Shopify B2B + tek bir quote/quick-order uygulaması (BSS $12,99–$36,99/ay) yeterlidir; tam portal (SparkLayer/Wholesale Gorilla) "üçüncü faz"dır.
- Kurumsal hediye senaryosunda (şirketin 100 çalışanına çikolata) **asıl araç Giftnote gibi çoklu adres + CSV + fatura akışı sunan gifting uygulamasıdır**, klasik B2B wholesale uygulaması değil.

### Gaps
- Native Shopify B2B'nin hangi planlarda hangi özellikleri verdiği kaynaklar arasında çelişkili (Plus gerekli mi?) — resmi Shopify fiyat/özellik matrisinden teyit gerekir.
- "Onay akışı" (approval workflow) ve "fatura ile satış" (invoice/invoicing) için butik ölçeğine uygun, fiyatı açık kaynaklı bir uygulama bulunamadı (net terms native; fatura için draft order manuel akış).

---

## 5. Teknoloji Altyapısı Tespiti (hangi marka hangi altyapıyı kullanıyor; tespit yöntemleri)

### Takeaway
E-ticaret altyapısı tespiti için standart araç seti BuiltWith (en geniş DB, 100.000+ teknoloji), Wappalyzer (temiz arayüz, güven skoru) ve Shopify'a özel TrendTrack/Koala Inspector'dur. Platform ayırt etmenin en güvenilir yolu sayfa kaynağı imzaları + `/cart`, `/checkout` gibi URL kalıplarıdır. Önemli sınır: hiçbir araç **storefront'u değiştirmeyen backend-only uygulamaları** tespit edemez. Bu araştırmada belirli bir çikolata markasının canlı stack tespiti yapılamadı (yalnızca yöntem kaynaklandırıldı).

### Cited Findings
- **Genel araçlar:** BuiltWith ~ır. yarım milyar domain, 23,8 milyar veri noktası, ayda 8,1 milyar+ GET; 100.000+ teknoloji. Wappalyzer'da güven seviyesi gösterimi var. Ücretsiz katmanlar sınırlı: BuiltWith ücretsiz sınırlı sonuç / API **$295+/ay**, Wappalyzer **50 arama/ay** ücretsiz / API **$250+/ay**. — [ZoomInfo / BuiltWith vs Wappalyzer](https://pipeline.zoominfo.com/sales/builtwith-vs-wappalyzer); [MarketBetter](https://marketbetter.ai/blog/best-free-website-technology-checker-tools-2026)
- **Shopify'a özel:** TrendTrack (ücretsiz/premium, yüksek doğruluk), Koala Inspector (tema + uygulama tespiti, orta doğruluk), WhatRuns (ücretsiz eklenti), manuel inceleme (en yüksek kontrol). — [Trendtrack](https://www.trendtrack.io/blog-post/how-to-see-what-shopify-apps-a-store-is-using)
- **Tespit yöntemi (BuiltWith/Wappalyzer'ın yaptığı):** Sayfanın public HTML'i, response header'ları ve cookie'leri parmak izi veritabanlarıyla eşleştirilir. — [IT Boffins](https://itboffins.com/free-tools/stack-detector)
- **Kısıt:** Backend-only uygulamalar (storefront'u değiştirmeyen) ve yeni eklenmiş uygulamalar tespit edilemeyebilir. — [Trendtrack](https://www.trendtrack.io/blog-post/how-to-see-what-shopify-apps-a-store-is-using)
- **Öne çıkan imzalar (bu araçların dayandığı teknik):** Shopify için `cdn.shopify.com` kaynakları, tema objeleri, `/cart` ve `/checkout` URL kalıpları, oturum/`_shopify` çerezleri; WooCommerce için `/wp-content/plugins/woocommerce`, WordPress imzaları. Apify'ın tech-stack aktörü Shopify/WordPress/Webflow/Next.js ayırt eder ve `primaryStack`, `techCount` gibi alanlar döner. — [Apify tech stack detector](https://apify.com/tugelbay/website-tech-stack-detector)

### Inferences
- Butik marka stack'ini tespit etmek için ücretsiz katman yeterlidir: Wappalyzer eklentisi + TrendTrack + sayfa kaynağında `/cart`/`/checkout` ve `cdn.shopify.com` kontrolü. Ücretli BuiltWith/Wappalyzer API'si yalnızca düzinelerce site taraması için gerekir.
- B2C hediye çikolata markalarının büyük çoğunluğunun Shopify (veya Shopify Plus) kullandığı beklenir; ancak **bu araştırmada somut bir çikolata markası için tespit çalıştırılamadı**, bu nedenle "belirli marka şu altyapıyı kullanıyor" şeklinde doğrulanmış bir örnek verilemiyor.

### Gaps
- Belirli özel gün/çikolata hediye sitelerinin canlı stack tespiti için gerçek URL listesi üzerinde BuiltWith/Wappalyzer/manuel inceleme çalıştırılmadı (bu not yalnızca yöntem ve araçları kaynaklandırır). Bir sonraki adımda rakip/örnek siteler için somut tespit yapılmalı.
- Shopify Plus vs standart Shopify ayrımını storefront'tan tespit etmenin güvenilir bir yolu kaynaklandırılmadı (Plus genelde yalnızca davranışsal/özellik farklarıyla, ör. checkout extension kalıpları ile anlaşılır).

---

## 6. Ödeme ve Kargo (Stripe/PayPal, çoklu para birimi, planlı teslimat kargo çözümleri, teslimat süresi vaatleri)

### Takeaway
Shopify mağazasında en mantıklı kurulum **Shopify Payments (birincil) + PayPal (ikincil)**'dir; çünkü Shopify Payments üçüncü taraf işlem ücretini (plan başına %2 / %1 / %0,6 / %0,2) ortadan kaldırır ve Shop Pay ile dönüşümü artırır (raporlanan %10–18 checkout tamamlama artışı). Shopify Payments, Stripe altyapısı üzerine kuruludur (2013 ortaklığı) ve ~23 ülkede geçerlidir. Çok para birimi native desteklenir ancak %1,5–%2 kur dönüşüm ücreti vardır. Planlı teslimat, teslim tarihi seçici uygulamaları + kargo taşıyıcı yapılandırmasıyla kurulur; net bir "teslimat süresi vaadi" için uygulama değil operasyon gerekir.

### Cited Findings
- **Shopify Payments ücretleri (2026):** Online kart: Basic **%2,9 + $0,30**, Grow **%2,7 + $0,30**, Advanced **%2,5 + $0,30**, Plus **%2,25 + $0,30**. Uluslararası kart ek **+%1**; kur dönüşümü **+%1,5 (ABD) / +%2 (diğer bölgeler)**; chargeback **$15**. — [ecom-store pro](https://shopify.ecom-store.pro/blog/shopify-payments)
- **Üçüncü taraf işlem ücreti:** Shopify Payments kullanılmazsa Basic **%2**, Grow **%1**, Advanced **%0,6**, Plus **%0,2** ek ücret. PayPal, Shopify Payments aktifken bu ücretten muaftır. — [eSEOspace](https://eseospace.com/blog/shopify-payments-vs-stripe-vs-paypal)
- **PayPal:** Shopify liste fiyatı **%3,49 + $0,49** (standart checkout); Wallet/Apple Pay/Venmo üzerinden **%2,59 + $0,49**; uluslararası **+%1,5**; micropayment (<$10) **%5 + $0,05**. — [SyncTrack](https://synctrack.io/blog/shopify-paypal-fee)
- **Stripe (3. parti):** **%2,9 + $0,30** online, **%2,7 + $0,05** yüz yüze; uluslararası kart **+%1**; Shopify'da kullanılırsa üçüncü taraf ücreti eklenir. Shopify Payments, Stripe'ın white-label işlemcisidir. — [Chargeflow](https://www.chargeflow.io/blog/stripe-vs-shopify-payments)
- **Shop Pay etkisi:** Shop Pay, 10–18% daha yüksek checkout tamamlama bildirir ve yalnızca Shopify Payments ile mümkündür. — [EasyApps](https://easyappsecom.com/guides/shopify-payment-gateway-comparison-2026)
- **Gateway karşılaştırma ($100 satışta toplam):** Shopify Payments Basic $3,20 / Standard $2,90 / Advanced $2,70; PayPal (SP yanında) $3,48; Stripe (3. parti, Basic) $5,20. — [EasyApps](https://easyappsecom.com/guides/shopify-payment-gateway-comparison-2026)
- **Çoklu para birimi:** Shopify Payments her desteklenen ülkenin yerel para biriminde ödeme alır ve otomatik çevirir; ABD mağazası için %1,5 (diğer %2) kur ücreti. — [ecom-store pro](https://shopify.ecom-store.pro/blog/shopify-payments)
- **Planlı teslimat kargo çözümü:** Teslim tarihi/saat seçici uygulamaları (EM Delivery Date Scheduler $3,99–$7,99/ay; Delivery Date & Pickup Stellar) yerel teslim, mağazadan teslim alma, güne göre kargo ücreti ve kapasite limiti sunar; uygulama siparişe tarihi kaydedip zamanında bildirim tetikler. — [Shopify App Store](https://apps.shopify.com/delivery-date-picker-plus); [Bird Chime](https://www.birdchime.com/post/shopify-delivery-date-picker-everything-you-need-to-know)
- **Teslimat süresi vaadi / ters lojistik:** Kargo sigortası uygulamaları (Route vb.) kargo takibi + hasar/kayıp telafisi sağlar; ancak bu "süre vaadi" değil "tazminat" çözümüdür. — [Route policies](https://shoppers.help.route.com/hc/en-us/articles/6017831679511-Route-Package-Protection-Policies)

### Inferences
- Butik için ödeme kurulumu: **Shopify Payments birincil + PayPal ikincil**; Stripe'ı doğrudan bağlamak (üçüncü taraf ücreti) sadece Shopify Payments'ın desteklenmediği ülkelerde mantıklıdır.
- Çikolata mevsimsel (14 Şubat, 8 Mart, Anneler Günü) yoğunluğa sahip olduğundan çoklu para birimi ancak yurt dışı satış varsa gerekir; %1,5–%2 kur ücreti düşük marjlı üründe dikkate alınmalı.
- Planlı teslimat, çikolatanın tazeliği için kritiktir; ancak "soğuk zincir" için ödeme/kargo uygulaması değil taşıyıcı + hızlı teslim operasyonu gerekir.

### Gaps
- Belirli bir ülkedeki (Türkiye hariç global örnekler) kargo sağlayıcılarının "planlı/randevulu teslimat" API entegrasyon fiyatları bulunamadı.
- "Teslimat süresi vaadi" (delivery promise) ve tahmini teslim tarihi gösteren (ör. Shopify native "estimated delivery date") araçların fiyat/limitleri kaynaklandırılmadı.
- Soğuk zincir lojistiği (izole kargo, jel akü, hızlandırılmış teslim) için e-ticaret uygulaması/tedarikçi karşılaştırması yok — ayrı (lojistik odaklı) araştırma gerektirir.

---

## 7. Instagram/WhatsApp Sipariş Akışını Siteye Bağlama

### Takeaway
Instagram/WhatsApp akışını siteye bağlamak üç katmanda mümkündür: (1) **link-in-bio** araçları (Shopify Linkpop, Linktree, LinkShop $15/ay) ile bio'dan satın alınabilir sayfa; (2) **Instagram Shopping** (Meta Commerce Manager kataloğu + ürün etiketleme; Shopify/WooCommerce native Meta entegrasyonu ile senkron); (3) sitede **WhatsApp sipariş butonu** uygulamaları (ör. CA: WhatsApp Chat Order Button) ile "mesajla sipariş" ve WhatsApp Business API butonu. DM-to-order için hazır "tek tıkla ödeme linki" akışı çoğunlukla manuel/kampanya linkleriyle kurulur.

### Cited Findings
- **Link-in-bio:** Shopify'ın **Linkpop** aracı özel URL oluşturur; Shopify mağazasına bağlanıp envanteri doğrudan bio sayfasında listeleyip **Shopify checkout ile satış** yapılabilir. Linktree, Bio Link, Linkjoy gibi genel araçlar yalnızca çoklu link sunar. — [Business Insider](https://www.businessinsider.com/shopify-link-in-bio-tool-helps-merchants-social-media-sales-2022-3)
- **Link-in-bio karşılaştırması:** **LinkShop $15/ay** (7 gün ücretsiz deneme), ürünleri sayfadan ayrılmadan sepete ekletir; Shopify blog 6 aracı listeler. — [Shopify blog — link in bio](https://www.shopify.com/blog/link-in-bio)
- **Instagram Shopping:** Meta Commerce Manager'da katalog (elle, CSV/XML veya Shopify/WooCommerce native Meta entegrasyonu ile) oluşturulur; hesap incelemeye gönderilir (onay saatler–günler sürer). "Shop Now" butonu bio altında görünür. — [BotPenguin](https://botpenguin.com/blogs/how-to-add-shop-button-on-instagram)
- **WhatsApp sipariş butonu:** **CA: WhatsApp Chat Order Button** (Shopify App Store, "Built for Shopify") — siparişi WhatsApp üzerinden almaya izin veren özelleştirilebilir buton/floating widget, Meta Pixel ve analitik, COD analizi. — [Shopify App Store / CA WhatsApp](https://apps.shopify.com/ca-chat-order-button-widget)
- **Link-in-bio + WhatsApp:** "Link In Bio by Xe/io" (Instagram/TikTok/WhatsApp için shoppable link tree, tıklama analitiği). — [Shopify App Store](https://apps.shopify.com/instagram-story-rewards)

### Inferences
- Instagram/WhatsApp halihazırda satış kanalıysa **ilk adım Instagram Shopping kataloğunu ve bio linkini siteye bağlamak** olmalı; bu çoğunlukla ücretsizdir (Linktree ücretsiz katman veya Shopify Linkpop).
- WhatsApp Business API butonu, DM'den sipariş alan butiklerde dönüşümü artırır ancak WhatsApp Business API'nin mesaj ücretlendirmesi bu araştırmada kaynaklandırılamadı → bütçe kalemi olarak belirsiz kaldı.

### Gaps
- **WhatsApp Business API** fiyatlandırması (konuşma/mesaj başına ücret, Meta Cloud API) kaynaklandırılmadı; yalnızca buton uygulaması bulundu.
- Instagram/TikTok **DM-to-order** (DM'de ödeme linki) için otomatik araç ve ödeme linki (Stripe Payment Links / Shopier benzeri, TR hariç) fiyatları bulunamadı.
- Instagram Shopping'ın Türkiye'deki kullanılabilirliği/kısıtları bu araştırmanın kapsamı dışında bırakıldı (Türkiye'ye özgü ayrı araştırmacıda).

---

## 8. Önceliklendirme: Olmazsa Olmaz / İkinci Faz / Gereksiz + Yaklaşık Aylık Maliyetler

### Takeaway
Tek şubeli butik ölçeğinde çekirdek (olmazsa olmaz) paket: mağaza platformu (Shopify Basic **$39/ay**) + ödeme (Shopify Payments, işlem bazlı) + hediye katmanı (hediye notu/teslim tarihi, **$4–$19/ay**) + kişiselleştirme (ör. Customily/Zepto, **~$20–$49/ay**). Bu çekirdek ~**$60–$110/ay** (kişiselleştirme işlem ücretleri hariç) tutar. İkinci faz: yeniden sipariş, abonelik, çoklu adres/kurumsal hediye, WhatsApp/Instagram otomasyonu. Gereksiz/üçüncü faz: kurumsal 3D konfigüratör (Threekit $30k+/yıl), tam B2B portalı, self-funded sigorta (düşük hacimde).

### Cited Findings (maliyet temelleri)
- Shopify mağaza aboneliği: Basic **$39/ay**, Grow **$105/ay**, Advanced **$399/ay**, Plus **$2.300/ay**. — [ecom-store pro](https://shopify.ecom-store.pro/blog/shopify-payments)
- Hediye notu/paket/teslim tarihi: Wrapin **$3,99–$7,99/ay**; EM Delivery Date Scheduler **$3,99–$7,99/ay**; Wrapped **$19–$99/ay**; Giftnote **$19–$99/ay**. — [Shopify App Store](https://apps.shopify.com/wrapin-gift-wrap); [Shopify App Store](https://apps.shopify.com/delivery-date-picker-plus); [Shopify App Store](https://apps.shopify.com/wrapped); [Shopify App Store](https://apps.shopify.com/giftnote)
- Kişiselleştirme: Zepto **$19,99–$34,99/ay**; Customily **$49/ay + $0,10–$1/ürün**; Inkybay **$19,99–$49,99/ay**; PIMW **$7,99–$24,99/ay** (işlem ücreti yok). — (bkz. Bölüm 1 kaynakları)
- Yeniden sipariş: Reorder Reminder Pro **$12–$89/ay**; Replenish **Free–$199/ay**; native Buy Again ücretsiz ama kişiselleştirmeyi taşımaz. — [Shopify App Store](https://apps.shopify.com/reorder-reminder-pro); [Smiley Commerce](https://smileycommerce.com/blog/shopify-native-reorder-vs-reorder-app)
- Abonelik: Shopify Subscriptions **Free**; Appstle **$10/ay'dan** (%0 komisyon); Recharge **$25–$99/ay + %1,49**. — [Subi](https://subi.co/post/shopify-recurring-payments-app)
- B2B/teklif: BSS B2B Order/Request a Quote **$12,99–$36,99/ay**. — [SetuBridge](https://www.setubridge.com/top-shopify-apps-for-custom-b2b-quotes)
- Kargo sigortası: Captain **$9,95/ay**; Navidium **$29,99/ay**; Route ücretsiz (gelir paylaşımı). — [Piratify](https://piratify.io/blog-posts/best-shopify-apps-shipping-protection-3swq); [SetuBridge](https://www.setubridge.com/top-shopify-shipping-protection-apps)
- Kurumsal 3D konfigüratör: Threekit **$30k–$100k+/yıl** + 3D model ($100–$500/model) + kurulum. — [CPQ3D](https://cpq3d.com/3d-product-configurator-cost); [Polymuse](https://polymuse.tech/blog/3d-product-configurator-cost)
- B2B özellik yığını toplamı: **$100–$500+/ay** (5–10 uygulama). — [WizCommerce](https://wizcommerce.com/blog/shopify-pricing)

### Inferences — Öneri Tablosu (tahmini aylık, işlem ücretleri hariç)

| Katman | Fonksiyon | Öneri | Yaklaşık aylık maliyet |
|---|---|---|---|
| **Olmazsa olmaz** | Mağaza platformu | Shopify Basic / Grow | $39–$105 |
| **Olmazsa olmaz** | Ödeme | Shopify Payments + PayPal | işlem bazlı (%2,9/%3,49) |
| **Olmazsa olmaz** | Hediye notu + teslim tarihi + ambalaj | Wrapin / EM Delivery Date Scheduler | $4–$16 |
| **Olmazsa olmaz** | Kişiselleştirme (isim/tarih + canlı önizleme) | Zepto / Customily / PIMW | $8–$49 |
| **İkinci faz** | Kargo/paket sigortası | Captain / Route | $0–$10 |
| **İkinci faz** | Yeniden sipariş + hatırlatıcı | Reorder Reminder Pro / Replenish | $12–$89 |
| **İkinci faz** | Abonelik (çikolata kulübü) | Shopify Subscriptions (free) → Appstle | $0–$10 |
| **İkinci faz** | Instagram/WhatsApp sipariş + link-in-bio | Linktree/Linkpop + WhatsApp butonu | $0–$15 |
| **Üçüncü faz** | Kurumsal hediye (CSV/çoklu adres/1.000 alıcı) | Giftnote Pro | $99 |
| **Üçüncü faz** | B2B teklif + hızlı sipariş | BSS B2B Order / Request a Quote | $13–$37 |
| **Gereksiz** | 3D konfigüratör | Threekit / Spiff 3D | $2.500+/ay eşdeğeri ($30k+/yıl) |
| **Gereksiz** | Tam B2B portalı | SparkLayer / Wholesale Gorilla | $49–$70 (düşük B2B hacminde gereksiz) |

- Eşikler: AOV < $80 ve kırılgan olmayan gönderim → sigorta gereksiz; ayda 50 sipariş veya AOV > $100 → sigorta/planlı teslim mantıklı. Kişiselleştirme işlem ücreti %1,9 → ayda ~$10.000 kişiselleştirilmiş satışta ~$190/ay ek maliyet (sabit ücretli araç lehine kırılma noktası ~$2.000/ay özel satış). — [InsureShip](https://insureship.com/blogs/news/shopify-shipping-insurance-options-compared); [Print It My Way](https://www.printitmyway.com/blog/custom-product-builder-vs-kickflip)

### Gaps
- Yukarıdaki tablo maliyet kalemlerini birleştirir; ancak **toplam aylık TCO** (uygulama + işlem ücretleri + kargo/ambalaj + operasyon) için tek bir kaynak yok — bu sentez, rapor yazarının yapacağı bir çıkarımdır, birincil kaynak değildir.
- Butik ölçeğinde gerçek bir "case" (aylık kaç sipariş, hangi araçları seçti) verisi bulunamadı; tablo ölçek varsayımına dayanır.
