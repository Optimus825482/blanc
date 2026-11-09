# Özel Gün / Hediye / Çikolata Sitelerinde Etkileşim ve Dönüşüm Desenleri

Kapsam: Sektördeki (kişiselleştirilmiş hediye, çikolata, özel gün hediyesi) etkileşim ve dönüşüm desenlerinin envanteri ve bunların **ödemesiz / WhatsApp-tabanlı teklif modeline** uyarlanabilirliği.
Gözlem/kaynak tarihi: **9 Kasım 2026**. Bağlam: "Beyza Blanc" (vitrin + kategori + tasarım stüdyosu + WhatsApp'tan fiyat teklifi; online ödeme YOK).
Not: Sayısal sonuçların büyük kısmı **satıcı/vendor tarafından yayınlanmış vaka çalışmalarıdır**; her birinde kaynak türü ayrıca belirtilmiştir. Bunlar bağımsız hakemli çalışmalar değildir, kıyaslama (benchmark) olarak dikkatli kullanılmalıdır.

**Bu oturumda yapılan doğrudan saha gözlemleri (9 Kasım 2026):**
- `hediyesepeti.com` (TR hediye sitesi, HTML indirildi, 538 KB): sayfada `api.whatsapp.com/send?phone=905308357373` bağlantısı, 49 adet "swiper" (kaydırılabilir carousel) referansı, **93 adet `data-price` özniteliği** (fiyat facet'i), 4 adet `aria-expanded` (akordeon), kargo/kampanya/indirim metinleri ("Ücretsiz", "Kampanya", "indirim") tespit edildi.
- `modacikolata.com` (TR çikolata üreticisi, B2B bayilik sayfası, 17 KB): çok adımlı süreç gösterimi (**Başvuru → Değerlendirme → Görüşme → Planlama → İlk Sipariş**), bayilik başvuru formu (`Adınız ve soyadınız`, `05xx xxx xx xx`, `ornek@firma.com`, `İşletme / firma adı` placeholder'ları) + WhatsApp CTA.
- `kahvedunyasi.com` (27 `aria-label`, 91 `data-*` özniteliği), `hafizmustafa.com` (217 `data-*`), `hediyesepeti.com` (1.593 `data-*`) — büyük TR markaları etkileşimi `data-*` öznitelikleri ve ARIA ile işaretliyor; WhatsApp gömülü değil.
- Beyza Blanc mevcut yapısı (`D:\PROJECTS\beyza\site`): `index.html` (h1 hero, "Hangi özel gün için?", "Hazır tasarımlar", "Nasıl çalışıyor?", kurumsal toplu hediye, 3 WhatsApp CTA), `koleksiyonlar.html` (~2,3 KB, statik liste, filtre yok), `urun.html` ("Bu tasarımı beğendin mi?" → WhatsApp), `studyo.html` (7 adımlı form: Ürün ve adet → Özel gün → Yazı → Fotoğraf/logo → Ambalaj/kurdele/kart → Ekstralar → Gönder; `aria-live` ve `aria-describedby` mevcut), `sss.html`, `iletisim.html`, `kurumsal.html`, `hakkimizda.html`. Sitede **prefers-reduced-motion, `<details>` akordeon, sticky mobil bar, sosyal kanıt şeridi ve e-posta yakalama yok**.

---

## 1. Ana sayfa akışı: hero yapısı, güven şeridi, kategori girişleri, sosyal kanıt, kampanya bandı, WhatsApp/e-posta yakalama — hangi sırayla ve neden?

### Takeaway
Sektörde kabul gören akış: **hero (net vaat + tek CTA) → hemen altında güven/sosyal kanıt şeridi → özel gün/kategori girişleri → nasıl çalışıyor → ürün vitrini → sosyal kanıt bloğu → yakalama (e-posta/WhatsApp)**. Sıralamanın mantığı, kullanıcının ilk saniyelerdeki "burası doğru yer mi + güvenilir mi" sorusunu, karar vermeden önce yanıtlamaktır. Ödemesiz modelde hero CTA'sı "Sepete ekle" değil, **"Tasarımını oluştur" / "WhatsApp'tan teklif al"** olmalıdır.

### Cited Findings
- E-ticarette hero bölümünün minimum dört bileşeni: yüksek kaliteli görsel/video, "doğru yerdesiniz" diyen başlık, destekleyici metin ve tek CTA — [SplitBase](https://splitbase.com/blog/hero-section).
- Ana sayfa ilk izlenimde güven kararı verilir; en yüksek etkili ana sayfa yerleşimleri: toplu yıldız puanı + yorum sayısı ("4.8 / 12.000+ yorum"), gerçek müşteri galerisi (UGC), altında kısa alıntı bulunan basın logoları ve güven ikonları, etkileyici müşteri/sipariş sayısı — [BigCommerce](https://www.bigcommerce.com/articles/ecommerce/social-proof-examples).
- Sosyal kanıt yerleşimi şablonu: katlanma üstü (above the fold) yıldız + yorum sayısı; hero'da büyük başarı/müşteri sayısı; gövdede 3-4 müşteri fotoğraflı referans; footer'da güven rozetleri — [Senja](https://senja.io/blog/social-proof-ecommerce) (pazarlama blogu).
- Ana sayfa, dürtüsel değil rasyonel satın alma için kurgulanmalı; sosyal kanıt + net CTA + iyi kurgulanmış teklif ana sayfada iletilmeli — [theStory](https://thestory.is/en/journal/home-page-ecommerce-guidelines).
- Trafik kaynağına göre hero/kampanya banner'ı kişiselleştirme ve çıkış niyeti (exit-intent) popup'ı önerilir; güven sinyallerinin yerleşimini A/B test etme tavsiyesi — [eCorn](https://www.ecorn.agency/blog/ecommerce-homepage-design-best-practices) (ajans blogu).
- Baymard'ın ana sayfa/kategori ve ürün bulma araştırması 5.550+ saat ve 219 "Think Aloud" oturumuna dayanıyor ve 1.000+ orta-ciddi kullanılabilirlik sorunu tespit etti; 24 yeni, 84 revize rehber üretildi — [Baymard, Product Finding 2024](https://baymard.com/research-articles/product-finding-2024-launch).

### Inferences
- Güven şeridi (basın logoları, "X yıldır", elle üretim, iade/kargo politikası) **hero'nun hemen altına** konmalı; çünkü kullanıcı karar vermeden önce güven arar (BigCommerce/Senja yerleşimleri).
- Beyza Blanc'ta e-posta yakalama, ödemesiz modelde düşük öncelikli: asıl yakalama kanalı WhatsApp'tır. E-posta yerine **"WhatsApp'tan fiyat teklifi al"** akışını öne almak daha uygun.
- "Hangi özel gün için?" girişi (Beyza Blanc'ta mevcut) sektördeki "occasion entry" desenine denk düşer ve doğru sıradadır: hero'dan hemen sonra özel gün/kategori girişleri gelmeli.

### Gaps
- Baymard'ın "Homepage & Category Navigation" için kesin yerleşim sırası rehberleri **ücretli (Premium)**; ücretsiz kaynaklardan doğrulanamadı.
- Kampanya bandının (üst şerit) dönüşüme etkisini ölçen bağımsız bir A/B sonucu bulunamadı.

---

## 2. Kategori ve ürün sayfası etkileşimleri: filtre/çip, sıralama, quick view, hızlı sepete ekleme, renk/boyut seçici, "tükendi" davranışı, çapraz satış, yapışkan "sepete ekle"

### Takeaway
Liste sayfasında **filtre ve sıralama** dönüşümün belirleyicisidir; 8 temel kural (varyantları tek satırda topla, 3+ thumbnail, uygulanan filtreleri göster vb.) sektörde yaygın olarak ihlal ediliyor. Ürün sayfasında **yapışkan ürün özeti + CTA** uzun sayfalarda standart hale geldi. Ödemesiz modelde "sepete ekle" yerine **yapışkan "teklif al" CTA'sı**; "tükendi" yerine "siparişe göre üretilir / WhatsApp'tan sor" davranışı kullanılmalı.

### Cited Findings
- Ürün listesi kullanılabilirliğinde sitelerin **üçte ikisi "vasat" veya daha kötü**; Baymard'ın 8 temel bulgusu: (1) varyantları tek liste öğesinde topla — **%42 toplamıyor**; (2) 3+ ürün thumbnail'i ver — **%80 vermiyor**; (3) hacim/adedi değişen ürünlerde "birim fiyat" göster — **%67 göstermiyor**; (4) yatay filtre araç çubuklarına dikkat; (5) aynı tip birden çok filtre değerini birleştirmeye izin ver — **%14 vermiyor**; (6) 5 temel filtre tipini mutlaka ver — **%51 vermiyor**; (7) uygulanan filtreleri bir özet alanda göster — **%20 göstermiyor**; (8) 4 temel sıralama tipini ver — **%69 vermiyor** — [Baymard, Product List UX 2025](https://baymard.com/research-articles/current-state-product-list-and-filtering).
- Masaüstünde **gerçek zamanlı (anında güncellenen) filtreleme** genelde tercih edilen desen; mobilde ise ara sayfa yenilenmelerini önlemek için **"Şu X sonucu göster" uygulama butonu** önerilir — [Baymard, Filter UI](https://baymard.com/blog/ecommerce-filter-ui).
- Görsel olarak ayırt edilebilen öznitelikler (renk, desen) için **"görsel" filtreler (swatch)** kullanılmalı; kullanıcı dilinin site terminolojisiyle uyuşmaması filtreyi işlevsiz kılar — [Baymard, Visual Filters](https://baymard.com/research-articles/use-visual-filters-for-visually-distinct-product-attributes).
- Sektöre özgü filtreler açıklanmalı (**%62 açıklamıyor**) ve önemli filtreler öne çıkarılmalı (**%61 öne çıkarmıyor**) — Baymard (aynı makale künyesi).
- Uzun ürün sayfalarında kullanıcı aşağı kaydırdığında üstte sabit kalan **"sticky ürün özeti + Add to Cart"** deseni önerilir — [Baymard, Responsive Upscaling](https://baymard.com/research-articles/responsive-upscaling).
- Yapışkan CTA kullanılacaksa etrafında yeterli boşluk bırakılmalı, **tam genişlikte buton kullanılmamalı** ve ana CTA diğer butonlardan farklı stille ayrılmalı — [Baymard, 35 Ecommerce Best Practices](https://baymard.com/blog/ecommerce-ux-best-practices).
- Ürün detay sayfalarında sitelerin yalnızca **%48'i masaüstünde "makul/iyi"** (mobil siteler %38, uygulamalar %36) ve **hiçbir site "kusursuz" değil**; ortalama sitenin ürün sayfasında **24 yapısal kullanılabilirlik sorunu** var — [Baymard, Current State of PDP UX](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux) / [Product Page Design Examples](https://baymard.com/ecommerce-design-examples/41-product-page).
- eBay Research Labs (eski çalışma): "super-sized" görseller dönüşümü **ikiye katladı**, ürün slayt gösterisi (çoklu görünüm) dönüşümü **%65 artırdı** — [Pixelz özeti](https://www.pixelz.com/blog/more-product-images-lead-to-more-sales) (ikincil kaynak, eski veri).

### Inferences
- "Tükendi" ve "hızlı sepete ekle" desenleri ödemesiz modelde doğrudan uyarlanamaz. Yerine: **"Bu tasarım siparişe özel üretilir — WhatsApp'tan stok/teslim sor"** butonu ve her ürün başlığı yanında **kalıcı "Teklif al"** butonu (Beyza Blanc `urun.html`'de zaten "Bu tasarımı beğendin mi? → WhatsApp" var; bunu **yapışkan** hale getirmek** ana kazanç).
- Quick view, çikolata/kişiselleştirilmiş hediye için düşük değerli: kişiselleştirme kararı hızlı bakışla verilmiyor.

### Gaps
- "Tükendi" (out-of-stock) davranışının dönüşüme etkisine dair sayısal bir çalışmaya ulaşılamadı.
- Quick view'in dönüşüme etkisi için bağımsız kanıt bulunamadı.

---

## 3. Kişiselleştirme akışı: form alan sırası, canlı önizleme, dosya yükleme geri bildirimi, hata durumları, şablon galerisi, adım sayısı, ilerleme göstergesi

### Takeaway
Kişiselleştirmede kazanan desen: **temiz taban görsel üzerinde gerçek zamanlı (2D/3D) önizleme**, alan sayısının minimumda tutulması ve **ekstrem girdi testleri** (uzun yazı, dikey fotoğraf, geniş logo). Canlı önizleme "süs" değil, sipariş hatası ve sepet terkini azaltan bir güven aracı. Dosya yükleme hataları ve üretime sığmayan tasarımın önlenmesi kritik.

### Cited Findings
- İyi canlı önizleme kuralları: temiz/merkezî taban görsel, **baskı alanının gerçek üretim sınırına eşitlenmesi** (üretilemeyecek tasarıma izin vermeme), yalnızca anlamlı kontrollerin açılması, alan sayısının makul tutulması ve **ekstrem girdilerin test edilmesi** (uzun metin, dikey fotoğraf, geniş logo) — [WowApps](https://wowapps.io/blog/add-customizable-products-with-live-preview-on-shopify) (uygulama satıcısı).
- Süreç: taban varyant seçimi → metin/fotoğraf/şablon ekleme → **önizlemenin anında güncellenmesi** → tüccar kuralları (baskı alanı, font, izinli renkler, ek ücret) → sipariş üretime baskıya hazır dosya olarak ulaşır — [Zakeke](https://www.zakeke.com/pillars/product-customization-for-ecommerce) (satıcı).
- Canlı önizleme "müşterinin ne aldığından emin olup ödemeye geçmesi" ile "emin olmayıp sepeti terk etmesi" arasındaki farktır; **kavisli/küçük yüzeyli üründe ve mobilde ayrıca test edilmeli** — [Customily](https://www.customily.com/post/best-live-preview-product-customizer-apps-for-shopify) (satıcı).
- Vaka (satıcı-yayınlanmış, tek mağaza, 90 gün): ABD mücevher mağazasında fotoğraf girdili AI hediye bulucu → hediye oturumu dönüşümü **%0,64'ten %1,05'e (+%64, p<0,01)**, AOV **1.250$ → 1.425$ (+%14)**, iade oranı **%8,2 → %6,8 (-%17)**; fotoğraflar AES-256 ile şifrelendi, 7 gün sonra otomatik silindi, rıza kaydedildi — [WiserBrand](https://wiserbrand.com/case/ai-gift-finder-jewelry) (satıcı vaka çalışması; fotoğraf işleme/GDPR-KVKK açısından önemli bir uygulama örneği).

### Inferences
- Beyza Blanc `studyo.html` zaten **7 adımlı** bir akış ve `aria-live`/`aria-describedby` içeriyor — bu, sektör standardının üstünde bir başlangıç. Ancak 7 adım, kişiselleştirmede üst sınır; **canlı önizleme yoksa** kullanıcı sonucu göremeden "gönder"e basıyor. Öncelik: adım sayısını koruyup **her adımda canlı önizleme** eklemek.
- Fotoğraf yükleme için beyan edilmiş bir boyut/format kuralı ve **"fotoğraf çok küçük / çözünürlük yetersiz"** hata mesajı, üretim hatasını ve iade riskini azaltır (WiserBrand örneğindeki -%17 iade ile tutarlı; ancak bu nedensellik kanıtlanmadı, yalnızca tutarlılık).

### Gaps
- "Fotoğraf çok küçük" gibi somut hata mesajı metinlerinin dönüşüme etkisine dair sayısal kanıt bulunamadı.
- İlerleme göstergesinin (progress bar) adım tamamlama oranına etkisine dair doğrulanmış çalışma bulunamadı.
- Örnek şablon galerisi ("hazır tasarımlar") ile boş başlangıç arasındaki dönüşüm farkı için kanıt bulunamadı.

---

## 4. Hediye akışı: teslim tarihi seçimi, hediye notu, alıcıya farklı adres, hediye paketi, planlı teslimat geri sayımı, "son sipariş tarihi" uyarısı

### Takeaway
Hediye akışında en güçlü kaldıraç **net teslim tarihi iletişimi** ("2 iş günü" değil, "25 Aralık'tan önce") ve **alıcıya ayrı adres + hediye notu** adımlarının ödeme akışına gömülmesi. Ödemesiz modelde hediye notu/paket/adres bilgisi **WhatsApp mesajının yapılandırılmış parçası** olur; "son sipariş tarihi" uyarısı geri sayım bandıyla desteklenir.

### Cited Findings
- Kullanıcı siparişi "hediye" olarak işaretlediğinde, giriş yapmış olsa bile **alıcının adresi ayrıca girilmeli** (hesabındaki varsayılan adres kullanılmamalı) — [Baymard, Gifting Flow](https://baymard.com/research-articles/gifting-flow).
- Hediyenin son teslimde nasıl görüneceğini (hediye kutusu, özel kart/mesaj) **ürün sayfasında göstermek** kullanıcının içini rahatlatır; Baymard 1-800-Flowers.com'u örnek verir — [Baymard, Gifting Flow](https://baymard.com/research-articles/gifting-flow).
- Belirsiz kargo hızı yerine **somut teslim tarihi/aralığı** verilmeli ("4 Nisan'da teslim" gibi) — [Salesforce Checkout Guide](https://www.salesforce.com/commerce/online-payment-solution/checkout-guide).
- Baymard araştırması, alışverişçilerin **belirsiz kargo hızından çok somut teslim tarihlerine** olumlu tepki verdiğini gösteriyor — [ShipperHQ](https://shipperhq.com/blog/delivery-dates-101) (Baymard'a atıfla).
- Tahmini teslim tarihi (EDD) gösterildiğinde tüketicilerin **%64'ü satın almaya daha yatkın** (Maergo araştırması) ve **ABD'li tüketicilerin %68'i** sipariş vermeden önce teslim tarihini sitede doğrulamak istiyor (Forrester) — [Kibo Commerce](https://kibocommerce.com/blog/estimated-delivery-dates-ecommerce) (ikincil kaynaklar).
- Kesme (cutoff) banner'ı **tarih + servis + varış varsayımını** içermeli ("15 Aralık'a kadar sipariş → standart ile 25 Aralık'tan önce teslim"); yerleşim: ürün sayfasında sepete ekle yanı, sepet, ödeme, e-postalar ve **sitede genel banner (1 Aralık'tan itibaren)**; kesme geçince standart vaadi kaldırıp **hızlandırılmış servislere/mağaza teslimine/kart'a** geçilmeli — [BigCommerce, Holiday Shipping](https://www.bigcommerce.com/articles/ecommerce/holiday-shipping).
- Geri sayım sayacı son teslim tarihini pekiştirir ve aciliyet yaratır (kesme tarihi + saat dilimi + tek CTA ile birlikte) — [SmartrMail](https://www.smartrmail.com/blog/shipping-deadline-emails) (e-posta pazarlama blogu).

### Inferences
- Ödemesiz modelde "ödeme ekranı" olmadığı için hediye akışının tamamı **WhatsApp mesaj şablonunda** toplanmalı: `Ürün → Adet → Özel gün/tarih → Alıcı adı+adres (ayrı) → Hediye notu → Ambalaj/kurdele → Tercih edilen teslim tarihi`. Beyza Blanc studyo formu zaten ürün/adet/özel gün/yazı/fotoğraf/ambalaj/ekstra içeriyor; **eksik olan: alıcı adresi, hediye notu ve tercih edilen teslim tarihi**.
- "Son sipariş tarihi" uyarısı, hediye sektöründe aciliyetin en meşru biçimidir (yapay "sadece 2 kaldı" yerine gerçek üretim/teslim kesmesi).

### Gaps
- Baymard'ın gifting rehberlerinin tam listesi (kaç guideline) Premium'da; ücretsiz kaynaktan tam doğrulanamadı.
- Geri sayım bandının dönüşüme etkisine dair bağımsız sayısal test bulunamadı.
- Hediye paketi/kart seçiminin dönüşüme etkisine dair kanıt bulunamadı.

---

## 5. Hediye bulma yardımcıları: "hediye bulucu" quizi, bütçeye göre seçim, kime göre filtre, gift guide sayfaları, "bunları da beğenebilirsin"

### Takeaway
Hediye bulucu quizi, sektörde en çok raporlanan "yüksek dönüşüm" aracıdır; ortak payda **kime/bütçeye göre soru sorup 3-5 ürün önermek**. Ancak tüm güçlü sayılar **satıcı (quiz app) tarafından yayınlanmış** vaka çalışmalarıdır; bağımsız doğrulama yok. Ödemesiz modelde quiz, "seçim" ile "WhatsApp'ta teklif" arasında köprü kurabilir.

### Cited Findings
- JOTT (Fransa, moda) — Shopify hediye quizi: **günlük ortalamaya göre 5× dönüşüm**, **%74 quiz tamamlama**, **+%46 sepete ekleme**, lansman günü **3× etkileşim** — [Quizell vaka](https://quizell.com/case-studies/jott) (satıcı, tek marka).
- Kadın iç giyim perakendecisi — uygulama içi hediye quizi: **yıllık bazda %50 dönüşüm artışı**, **52 günde 35.000+ tamamlanan quiz** — [Chatter by Stingray vaka](https://www.chatterresearch.com/gift-guide-drove-increase-in-conversion) (satıcı).
- Beardbrand: **%43 tamamlama**, tamamlayanlarda **%31 dönüşüm**, **+%68 AOV**, quiz trafiği toplam gelirin **%35'i**; Ritual: ziyaretçilerin **%52'si quizi başlatıyor**, **iade %40 azaldı** — [Outgrow blog](https://outgrow.co/blog/shopify-quiz-funnel-guide) (derleme/ajans, ikincil — marka rakamları doğrulanmadı).
- "Alışverişçiye değil, hediye alınan kişiye sor": bir hediye markası quiz yolunda **5× dönüşüm** ve **%74 tamamlama** ölçtü — [TailorHQ Playbook](https://tailorhq.ai/playbook/find-the-right-gift) (satıcı-bildirimli, ikincil).
- Quiz sonuç sayfası için önerilen desen: **3-5 ürün** (20 değil), "neden bunu önerdik" açıklaması, sosyal kanıt, net CTA; sonuç sayfası metnini cevaplara göre kişiselleştiren markalarda **%40-60 dönüşüm artışı** iddiası — [Outgrow](https://outgrow.co/blog/shopify-quiz-funnel-guide) (doğrulanmadı).

### Inferences
- Beyza Blanc için quiz maliyetli bir ilk yatırım; **"özel gün + kime + bütçe"** üçlüsüyle 3 soruluk hafif bir bulucu, "Hazır tasarımlar" sayfasında filtrelenmiş sonuç üretip her sonuçta **"WhatsApp'tan fiyat al"** butonuyla bağlanabilir.
- "Bunları da beğenebilirsin" (çapraz satış) vitrin modelinde de değerli: teklif öncesi sepet ortalamasını artırır.

### Gaps
- Quiz sonuçlarının bağımsız (satıcı olmayan) bir A/B testiyle doğrulanmış sayısal kanıtı bulunamadı; tüm rakamlar vendor-reported.
- "Gift guide" statik sayfası ile interaktif quiz arasındaki dönüşüm karşılaştırması yok.

---

## 6. Güven ve ikna: fotoğraflı yorumlar, yıldız puanı, "kaç kişi aldı" göstergesi, basın logoları, kargo/iade politikası kutusu, ödeme güvenliği ikonları — ödemesiz sitede nasıl karşılanır?

### Takeaway
Sosyal kanıt, özellikle **yüksek fiyatlı hediyelerde** en güçlü ikna aracıdır (yorumlu üründe satın alma olasılığı 5 yoruma kadar **%270** artıyor). Ödemesiz sitede "ödeme güvenliği" ikonları anlamsız; onların yerini **"WhatsApp'tan birebir teklif", "elle üretim", "fotoğraflı gerçek müşteri işleri", "kargo/iade politikası"** almalı.

### Cited Findings
- Medill Spiegel Research Center: 5 yorumlu bir ürünün satın alınma olasılığı, yorumsuz ürüne göre **%270 daha yüksek**; ancak ilk 5 yorumdan sonra **marjinal fayda hızla azalıyor**; düşük fiyatlı üründe yorum gösterimi dönüşümü **%190**, yüksek fiyatlı üründe **%380** artırıyor — [Medill Spiegel](https://spiegel.medill.northwestern.edu/how-online-reviews-influence-sales) (2017 araştırması, güncelliğini koruduğu belirtiliyor).
- PowerReviews 2023: tüketicilerin **%77'si** başka alıcıların fotoğraf/videolarını arıyor; kullanıcı fotoğraf/videosuyla etkileşen ziyaretçilerde dönüşümde **%103,9 artış** (ör. galeriyi genişletme +%103,1, sonraki görsele geçme +%106,3) — [PowerReviews](https://www.powerreviews.com/how-ugc-impacts-conversion-2023) (satıcı araştırması).
- BrightLocal 2023: tüketicilerin **%49'u** ürün yorumlarına, yakınlarının tavsiyesi kadar güveniyor — [The Good (aktaran)](https://thegood.com/insights/product-reviews-improve-conversion-rates).
- Basın logoları, yanında kısa alıntıyla birlikte ve toplu yıldız puanı + yorum sayısı ana sayfada en yüksek etkili güven yerleşimleri arasında — [BigCommerce](https://www.bigcommerce.com/articles/ecommerce/social-proof-examples).
- Ürün sayfasında genelde kullanılan yorum sayısı önerisi: **3-5 yorum**; ana sayfada **2-3 referans**; iade politikası kolay okunur ve anlaşılır tutulmalı (Baymard Guideline #1501, ASOS örneği ile) ve footer'da SSS bağlantısı olmalı — [Baymard, 35 Best Practices](https://baymard.com/blog/ecommerce-ux-best-practices) / [Senja](https://senja.io/blog/social-proof-ecommerce).

### Inferences
- Ödemesiz modelde "ödeme güvenliği" ikonları (SSL, kart logoları) **kaldırılmalı**; yerine üç güven bloğu: (a) **"Teklif WhatsApp'ta birebir, sipariş öncesi onay"**, (b) **fotoğraflı gerçek müşteri eserleri / teslim edilen kutular**, (c) **net kargo + iade/değişim kutusu** (çikolata için "kırılma/kalite garantisi").
- "Kaç kişi aldı" göstergesi, doğrulanabilir değilse kullanılmamalı (BigCommerce: "yalnızca gerçek, doğrulanabilir sayılar"). Yerine **"şu ana kadar X sipariş üretildi"** gibi denetlenebilir bir metrik ya da "Etsy/Google yorum puanı" gösterilebilir.
- Medill bulgusu ışığında: tek üründe 3-5 yorum dahi yeterli ve etkili; bu, az yorumu olan küçük bir atölye için **ulaşılabilir bir eşik**.

### Gaps
- "Kaç kişi aldı" / son satın alma bildirimi (FOMO) deseninin dönüşüme etkisi için bağımsız kanıt bulunamadı.
- Türkiye'de tüketici yorum/güven davranışına dair TR'ye özgü bir çalışma bulunamadı (kaynaklar ABD/Avrupa odaklı).

---

## 7. Sepet/ödeme olmayan modeller: WhatsApp/telefon/DM ile sipariş akışı nasıl tasarlanıyor?

### Takeaway
WhatsApp-tabanlı siparişte desen: **yüzen (floating) WhatsApp butonu + ürün başına "teklif al" butonu + önceden doldurulmuş mesaj (`wa.me/...?text=`)**. Ancak Baymard, mobilde **yapışkan chat/sabit overlay'lerin sayfa içeriğini kapattığı** ve genel olarak canlı sohbet balonlarının **kaçınılması gerektiği** uyarısını yapıyor — yani yüzen buton "erişilebilir ama sayfa içeriğini engellemeyecek" biçimde küçük ve köşede olmalı.

### Cited Findings
- Baymard: "Canlı sohbet overlay diyaloglarından genel olarak kaçının. Mobilde her tür **yapışkan (sticky) chat öğesine karşı dikkatli olun**; bunun yerine header, footer ve yardım bölümlerine statik sohbet bağlantıları koyun." — [Baymard, 35 Best Practices](https://baymard.com/blog/ecommerce-ux-best-practices).
- WhatsApp vaka çalışmaları (Meta "WhatsApp for Business" yayınları, **marka tarafından bildirilmiş**): **Magalu** 6 haftalık pencerede uygulama/e-ticarete göre **3× dönüşüm** ve 85 NPS; **Lojas Renner** WhatsApp sepet kurtarma ile **çevrimiçi dönüşümde %50 artış**; **MarketZhop** e-ticaret dönüşüm oranını **%2'den %5'in üzerine** çıkardı; **Clarins** WhatsApp kampanyasında **%90 açılma oranı** ve e-postadan **7× yüksek dönüşüm**; **Vogacloset**'te WhatsApp en yüksek dönüşen kanal oldu — kaynaklar: [Ominiflow derlemesi](https://ominiflow.com/blog/whatsapp-success-stories), [Insider One](https://insiderone.com/whatsapp-ecommerce), [ElevateSpot](https://elevatespot.sg/conversational-commerce-strategy), [Yavendio](https://yavendio.com/us/blog/average-conversion-rates-per-marketing-channel-whatsapp-traditional-ecommerce-and-others), [ActiveCampaign](https://www.activecampaign.com/blog/whatsapp-ecommerce-complete-guide). **Hepsi satıcı/marka beyanı; bağımsız denetim yok.**
- WhatsApp'ın açılma oranı **%90-99**, tıklama/dönüşüm oranı **%20-60** olarak bildiriliyor — [Insider One](https://insiderone.com/whatsapp-ecommerce) (satıcı; abartılı olabilir, tek kaynak).
- Saha gözlemi (9 Kasım 2026): `hediyesepeti.com` ürün/anasayfa kodunda `api.whatsapp.com/send?phone=905308357373` bağlantısı; `modacikolata.com` B2B sayfası çok adımlı **süreç + form + WhatsApp** birleşimi kullanıyor (bkz. üstteki gözlem notu).
- Ücretsiz/indirilebilir katalog: BigCommerce, kesme sonrası müşteriyi "dijital hediye kartı" ve mağaza içi teslim gibi alternatiflere yönlendirmeyi öneriyor — [BigCommerce](https://www.bigcommerce.com/articles/ecommerce/holiday-shipping) (katalog PDF'i yerine geçebilecek "teklif/talep formu" mantığı için dolaylı dayanak).

### Inferences
- Beyza Blanc için ideal kombinasyon: **küçük, köşede yüzen WhatsApp butonu** (yarı saydam, tıklamayı engellemeyen, kaydırmada içeriği kapatmayan) + her ürün/koleksiyon kartında **"WhatsApp'tan teklif al"** bağlantısı + studyo/hediye akışlarından **ön-doldurulmuş mesaj** ile aktarım (`wa.me/<no>?text=<ürün+adet+özel gün+teslim tarihi>`).
- Baymard uyarısı gereği buton **tam ekran/half-screen overlay** olmamalı ve mobilde sticky chat tarzı bir panel açmamalı.
- "Katalog PDF indir" yerine, vitrin modelinde **"teklif talep formu → WhatsApp'a düşer"** akışı hem dönüşüm hem veri açısından daha uygun.

### Gaps
- Ödemesiz/WhatsApp-only modelde "teklif al" butonunun dönüşüme etkisine dair bağımsız (satıcı olmayan) A/B testi bulunamadı.
- Katalog PDF indirmenin lead üretimine etkisine dair sayısal kanıt bulunamadı.

---

## 8. Mobil etkileşim: alt sabit bar, kaydırılabilir ürün şeritleri, akordeon filtreler, dokunma hedefi boyutları, WhatsApp/arama kısayolları

### Takeaway
Mobilin en büyük sorunu **sayfa genel görünümü kaybı**; bu yüzden akordeon filtre ve "Şu X sonucu göster" butonu gibi **kontrollü açılır desenler** öne çıkıyor. Dokunma hedefi için **WCAG 2.5.8 (24×24 CSS piksel, AA)** yasal eşik; Apple 44×44 öneriyor. Yüzen WhatsApp butonu dahil tüm etkileşim hedefleri bu eşiklerin üstünde olmalı.

### Cited Findings
- Baymard mobil araştırmasında **2.597 mobil UX sorunu** tespit edildi; en ciddi ve en yaygın sorun **sayfa genel görünümü (overview) kaybı**; sanal klavye açıkken form görünümü **~%40 küçülüyor** — [Baymard, Mobile Commerce Design](https://baymard.com/research-articles/mobile-commerce-design).
- Mobilde filtreler için **"Şu X sonucu göster" uygulama butonu** önerilir (anında yenilenme kafa karıştırıcıdır) — [Baymard, Filter UI](https://baymard.com/blog/ecommerce-filter-ui).
- WCAG 2.5.8 Target Size (Minimum), **WCAG 2.2'de yeni Level AA** kriteri: etkileşimli hedefler **en az 24×24 CSS piksel** veya komşu hedeflerden yeterli boşluk; Avrupa Erişilebilirlik Yasası (EAA) **28 Haziran 2025'te** yürürlüğe girdiği için yasal olarak da gerekli — [AllAccessible](https://www.allaccessible.org/blog/wcag-258-target-size-minimum-implementation-guide).
- Apple iPhone HIG **44×44 piksel** minimum hedef önerir; MIT Touch Lab ortalama insan parmak ucunun **16-20 mm** genişliğinde olduğunu, motor engelli kullanıcıların küçük hedeflerde **%75'e varan hata oranı** yaşadığını buldu — [TestParty](https://testparty.ai/blog/wcag-target-size-guide) (ikincil; W3C tartışması da 44px vs 24px uzlaşmasını doğruluyor — [W3C GitHub #2704](https://github.com/w3c/wcag/issues/2704)).
- Ürün sayfalarında yapışkan CTA; mobilde "yapışkan chat" öğelerinin içeriği kapatma riski — [Baymard](https://baymard.com/blog/ecommerce-ux-best-practices).

### Inferences
- Beyza Blanc için mobil öncelik: **koleksiyonlar sayfasına akordeon filtre** (fiyat/özel gün/tema) + **"X sonucu göster"**, ürün sayfasına **alt sabit (sticky) bar içinde "WhatsApp'tan teklif al" + "Ara"** (iki kısayol), kartlar arasında **kaydırılabilir "Bunları da beğenebilirsin" şeridi** (Beyza Blanc'ta şu an yok).
- Alt sabit bar tek satır ve ≤2 buton olmalı; yüzen chat balonuyla **çakışmamalı** (Baymard'ın sticky chat uyarısı).

### Gaps
- "Alt sabit bar" (bottom bar / tab bar) deseninin dönüşüme etkisine dair doğrulanmış sayısal çalışma bulunamadı.
- Türkiye'de WhatsApp'ın mobil dönüşümdeki payına dair bağımsız veri bulunamadı.

---

## 9. Erişilebilirlik etkileşimleri: klavye ile filtreleme, carousel kontrolleri, odak görünürlüğü, prefers-reduced-motion

### Takeaway
Uygulanabilir iki somut, kanıtlı gereksinim: **dokunma hedefi boyutu (WCAG 2.5.8)** ve **carousel'lerin klavye ile kullanılabilirliği / otomatik oynatmanın durdurulabilirliği**. Beyza Blanc'ta şu an `prefers-reduced-motion`, `<details>` akordeon ve carousel kontrolleri yok; bu, hem erişilebilirlik hem de hareket hassasiyeti olan kullanıcılar için boşluk.

### Cited Findings
- WCAG 2.5.8 (Target Size Minimum, AA) — 24×24 CSS piksel; EAA ile yasal — [AllAccessible](https://www.allaccessible.org/blog/wcag-258-target-size-minimum-implementation-guide), [Calling All Minds](https://callingallminds.com/resources/wcag/2.5.8-target-size-minimum).
- Baymard "Page Control UI: Definition, Features, & Design Styles" (15 Mayıs 2026) carousel/sayfa-kontrol noktaları (page control dots) tasarımını ele alıyor — [Baymard blog](https://baymard.com/blog/ecommerce-filter-ui) (sayfa listesinde referans; içerik ücretli/özet).
- Saha gözlemi (9 Kasım 2026): `hediyesepeti.com` 49 Swiper referansı + `aria-expanded` akordeon kullanıyor; Beyza Blanc'ta `aria-live`/`aria-describedby` studyo formunda mevcut ama carousel/akordeon ve reduced-motion desteği yok.

### Inferences
- Otomatik oynatılan carousel kullanılacaksa **durdurma/duraklatma mekanizması** (WCAG 2.2 SC 2.2.2 Pause, Stop, Hide) ve `prefers-reduced-motion: reduce` altında **otomatik oynatmayı kapatma** standart uygulamadır; ayrıca carousel'e `role="region"` + `aria-roledescription="carousel"` ve klavye ile ileri/geri kontrolleri eklenmelidir. (Not: bu maddeler bu oturumda birincil W3C sayfasından **doğrulanamadı**; standart WCAG prensibi olarak inference olarak veriliyor.)
- Akordeon filtre için `<details>/<summary>` (modacikolata.com'da olduğu gibi) klavye erişilebilirliğini bedava sağlar.
- Odak görünürlüğü (`:focus-visible`) studyo formu ve WhatsApp CTA'ları için kritik; Beyza Blanc `sss.html` gibi sayfalara akordeon eklenirse klavye testi şart.

### Gaps
- `prefers-reduced-motion` uygulamasının dönüşüme/erişilebilirliğe etkisine dair sayısal çalışma bu oturumda bulunamadı; W3C birincil sayfaları doğrulanmadı.
- Carousel'lerin klavye ile kullanılmasına dair NN/g ("Auto-Forwarding Carousels and Accordions Annoy Users") çalışması **bu oturumda fetch edilmedi** — doğrulanması önerilir.

---

## 10. Beyza Blanc için öncelikli uygulama listesi (Faz 1 / 2 / 3)

Kısa not: Beyza Blanc sitesi zaten güçlü bir temele sahip (özel gün girişi, "nasıl çalışıyor", 7 adımlı studyo formu, ürün başına WhatsApp CTA, `aria-live`). Aşağıdaki liste mevcut boşlukları kapatmaya odaklanır.

### Faz 1 — Yüksek etki, düşük maliyet (önce bunlar)
1. **WhatsApp'tan ön-doldurulmuş teklif akışı** (`wa.me/<no>?text=`): ürün + adet + özel gün + tercih edilen teslim tarihi otomatik mesaja yazılsın. (Desen 7; saha: hediyesepeti.com, modacikolata.com.)
2. **Yapışkan teklif CTA'sı**: `urun.html`'de mobilde alt sabit bar içinde "WhatsApp'tan teklif al" + "Ara". (Desen 2 & 8; Baymard sticky CTA.)
3. **Sosyal kanıt şeridi + yorum bloğu**: hero altına 3-4 fotoğraflı gerçek müşteri eseri + yıldız/az sayıda yorum. (Desen 1 & 6; Medill %270, PowerReviews %103,9 artış.)
4. **Kargo + iade/değişim politika kutusu** ("kırılma/kalite garantisi"), ödeme güvenliği ikonları yerine. (Desen 6; BigCommerce.)
5. **Koleksiyonlar sayfasına filtre + sıralama**: fiyat (data-price facet), özel gün, tema; masaüstünde gerçek zamanlı, mobilde "X sonucu göster". (Desen 2; Baymard 8 madde.)
6. **Doğru teslim tarihi iletişimi**: "son sipariş tarihi" bandı + belirli tarih/aralık; ürün sayfasında sepete ekle yanı. (Desen 4; BigCommerce, Salesforce, Kibo %64.)

### Faz 2 — Orta vadeli (tasarım stüdyosu ve hediye akışı derinleştirme)
7. **Canlı önizleme (live preview)** studyo akışında: her adımda anlık güncellenen 2D önizleme; baskı alanı üretim sınırıyla eşleşsin. (Desen 3; WowApps, Zakeke, Customily.)
8. **Fotoğraf yükleme geri bildirimi ve hata durumları**: "fotoğraf çok küçük / çözünürlük yetersiz", format/boyut kuralları, `aria-live` ile duyuru. (Desen 3; WiserBrand -%17 iade ile tutarlı.)
9. **Hediye akışını genişlet**: alıcıya **ayrı adres**, **hediye notu**, tercih edilen **teslim tarihi** alanları studyo formuna eklensin. (Desen 4; Baymard gifting.)
10. **Hediye bulucu quizi**: 3 soru (özel gün / kime / bütçe) → filtrelenmiş "Hazır tasarımlar" + her sonuçta WhatsApp CTA. (Desen 5; Quizell/Chatter +%50-%5x, vendor-reported.)
11. **"Bunları da beğenebilirsin" çapraz satış şeridi** (kaydırılabilir, mobilde). (Desen 2 & 5.)

### Faz 3 — İnce ayar ve erişilebilirlik
12. **Erişilebilirlik seti**: WCAG 2.5.8 uyumlu dokunma hedefleri (≥24×24, hedef 44), `:focus-visible` stilleri, carousel'e `role="region"`/`aria-roledescription` + klavye kontrolleri. (Desen 9.)
13. **`prefers-reduced-motion` desteği** ve otomatik carousel'e durdurma mekanizması. (Desen 9; doğrulanacak.)
14. **Akordeon SSS/filtre**: `<details>/<summary>` ile klavye erişilebilir akordeon. (Desen 9; modacikolata.com deseni.)
15. **"Kaç kişi aldı"/aciliyet göstergeleri**: yalnızca **doğrulanabilir** sayılarla; aksi halde uygulama. (Desen 6; BigCommerce uyarısı.)

### Kesinlikle uygulanmaması önerilenler
- Ödeme güvenliği ikonları, kart logoları, "3D Secure" rozetleri (ödeme yok → yanıltıcı).
- Hızlı sepete ekle / quick view / tükendi-limit göstergeleri (sepet yok).
- Tam ekran veya sayfa içeriğini kapatan yapışkan chat panelleri (Baymard uyarısı).
- Doğrulanamayan "X kişi şu an bakıyor" tipi FOMO bildirimleri.
