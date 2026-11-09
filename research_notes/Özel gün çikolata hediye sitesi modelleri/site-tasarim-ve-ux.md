# Özel Gün Odaklı Kişiselleştirilmiş Çikolata / Hediyelik Markalarının Web Sitesi Tasarım Dili, Bilgi Mimarisi ve UX Analizi

> **Yöntem ve gözlem tarihi notu.** Bu notlardaki sitede-gözlem ifadeleri **9 Kasım 2026** tarihinde, ilgili sitelerin canlı sayfalarından otomatik içerik çıkarma (Tavily extract) aracıyla alınan **HTML/metin içeriğine** dayanır; renk/font gibi görsel-estetik iddialar ise (aksi belirtilmedikçe) ikincil kaynaklardan (Colorlib, Sufio, Dribbble, LetterCrafted) alınmıştır. Yani "şu siteyi şu tarihte inceledim, şunları gördüm" ifadelerinde gördüğüm şey; navigasyon etiketleri, duyuru şeritleri (promo bar), ürün/fiyat metinleri, "nasıl çalışır" adımları, güven rozetleri ve gömülü **metin**tir. Piksel bazlı görsel karşılaştırma (font ismi, tam renk kodu, animasyon) yapılmadı — bunlar **Gaps** olarak işaretlendi. Bir site (Boomf) gözlem anında **kapanmış** durumdaydı.

---

## 1) Bilgi Mimarisi / Navigation: "Shop by Occasion" menüsü nasıl kurgulanmış?

### Takeaway
Olgun özel-gün siteleri menüyü **tek eksende değil, çapraz eksenlerde** kuruyor: en yaygın kalıp `Özel Gün + Kime (alıcı) + Ürün Tipi/Koleksiyon` üçlüsü; ek olarak Sugarfina ve Things Remembered **fiyat aralığı** ekseni de ekliyor. Türkiye/Beyza Blanc ölçeğinde gerçekçi olan, bu eksenlerin tümünü mega-menüye doldurmak değil; **Özel Gün (birincil) + Kim İçin + Kişiye Özel** ile başlamaktır.

### Cited Findings
- **Choc on Choc (choconchoc.co.uk)** — 9 Kasım 2026 anasayfa menüsü: `Shop All` altında **Shop By Recipient** (Gifts For Her / Him / Kids / Adults / Teachers), **Shop By Occasion** (Birthday, Wedding/Engagement, New Home, Graduation/Exams, Thank You, Congratulations, Get Well Soon, Anniversary), **Shop By Hobby** (Sports, Foods, Music, Animals, Crafting, Alcohol) ve ayrıca **Shop Other** (trash, brownies, chocolate cards vs.) + **Build a Bundle**. Marka iddiası: "unique Belgian chocolates for every occasion". — [choconchoc.co.uk](https://www.choconchoc.co.uk/)
- **Boomf (boomf.com)** — 9 Kasım 2026 anasayfa menüsü hâlâ görünür: üst seviyede ürün-tipi menüleri (Cannon Card®, Bomb Cards®, Gifts, eCards, Christmas, Birthday) ve her ürün ailesinin içinde tekrar eden **Occasion** (Birthday, Anniversary, Wedding, Thank you, Engagement, Get well, Pregnancy, New home, New job) + **Seasonal** (New Year's, Valentine's, Father's/Mother's Day, Easter, Diwali, Pride, Thanksgiving, Halloween) + **Themes** (Trending, Cute, Rude, Funny, Celebrity, LGBTQ, Meme). Aynı sayfa "Boomf has officially closed its doors" (kapanış) mesajı gösteriyordu. — [boomf.com](https://www.boomf.com/)
- **Sugarfina (sugarfina.com)** — 9 Kasım 2026 mega-menü: `Shop Gifts` altında **Gift Boxes** (Build a Gift Box, Bestselling Gifts, Gift Bags & Favor Boxes, Greeting Cards), **Gifts by Occasion** (Birthday, Congratulations, Party Favors, Thank You, Wedding), **By Recipient** (Him/Her/Kids/Hostess), **By Price** (Under $35 / $50 / $75); ayrıca `Customize`, `Corporate Gifting` (Ready to Ship / Wedding Favors / Custom Celebrations / Corporate Gifting), `Instant Gifts`, `Rewards`, `Find a Store`. — [sugarfina.com](https://sugarfina.com/)
- **Personal Creations (personalcreations.com)** — 9 Kasım 2026 menü derinliği en yüksek örnek: **Occasions** (Wedding, Anniversary, Baby Shower, Engagement, Housewarming, Memorial, Retirement), **By Recipient** (For Mom/Grandma/Wives/Daughters/Sisters/Friends/Bride/Bridesmaids/Couples/Teachers), **By Collection** (Apparel, Keepsakes, Jewelry…), **Seasonal** (Halloween, Thanksgiving, Christmas, Valentine's, Easter, Mother's/Father's Day, Graduation, Back to School), **Everyday Occasions** (Anniversary, Baby Shower, Baptism, Birthdays, Engagement, New Baby…). Ayrıca yıl bazlı alt kırılım: Banners'da **1st / 5th / 10th / 25th / 50th Anniversary** ve Birthday'de **First Birthday** dahil For Her/Him/Mom/Dad/Girls/Boys. — [personalcreations.com](https://www.personalcreations.com/)
- **Compartes Chocolatier (compartes.com)** — 9 Kasım 2026 menü: `Gifting → Gift Shop`; **Shop by Holiday** (Seasonal: Christmas/Hanukkah/Easter; Moments: Valentine's/Mother's/Father's Day; Cultural: Passover/Diwali/Lunar New Year), **Shop by Occasion** (Birthday, Thank You, Anniversary, Congratulations, Housewarming, All Occasions), **Make Your Own** (New / Build a Bar Set / Build Your Own Bark), **Corporate Gifts** (Luxury Client Gifts / Volume Orders / Custom Branding). — [compartes.com](https://compartes.com/)
- **Things Remembered (thingsremembered.com)** — 9 Kasım 2026 "Find Your Perfect gift" alanında dört eksenli ayrım: **Upcoming Occasions / Milestone Occasions / Seasonal Occasions / Recipients / Products**; üst menüde Birthday, Graduation, Wedding, Religious, New Baby gibi hazır gün kısayolları. — [thingsremembered.com](https://www.thingsremembered.com/)
- **Shari's Berries (sharisberries.com)** — 9 Kasım 2026 üst menü: `SELECTS, BIRTHDAY, BEST SELLERS, ALL BERRIES, OCCASIONS, OTHER GIFTS, FLOWERS, SAME DAY DELIVERY, COMMUNITY`. Anasayfada "Find The Perfect Gift" kutusu: **Where Is It Going? / Occasion / Search Find A Gift Now**. — [sharisberries.com](https://sharisberries.com/)
- **Karşı örnek — COCO Chocolatier (cocochocolatier.com)** — 9 Kasım 2026 sayfası özel-gün navigasyonu **kullanmıyor**; bunun yerine marka-house yapısı (Love Cocoa, COCO Chocolatier, H!P, OTHERLY, UP-UP, Seed & Bean) ve sanat/koleksiyon ekseni var. Öne çıkan mesaj: sanatçı işi tasarımlı ambalaj, £6 el yapımı barlar, "Free UK delivery over £35". — [cocochocolatier.com](https://www.cocochocolatier.com/)
- **Sugarwish (sugarwish.com)** standart bir "shop by occasion" menüsü kullanmıyor; IA alıcı-merkezli ("Let them choose their favorites", "Send by email or text — no address needed") ve kurumsal özel gün odaklı (birthdays, work anniversaries, holidays, company events). — [sugarwish.com](https://www.sugarwish.com/)
- **CorporateGift.com** kurumsal eksenli; IA "Multi-recipient sending", "Gift automation", "Company store", "eGifting", "Integrations" gibi işlevsel başlıklara kurgulu. — [corporategift.com](https://www.corporategift.com/)
- Sektör normu: en iyi e-ticaret menüleri **8'den az üst seviye** öğe, net jargon içermeyen etiket ve **sticky** menü kullanır; menüler sırayla "öne çıkan/en popüler" ile başlatılmalıdır. — [designstudiouiux.com](https://www.designstudiouiux.com/blog/ecommerce-navigation-best-practices), [cxl.com](https://cxl.com/ecommerce-best-practices/navigation)

### Inferences
- Özel-gün sitelerinde **"hangi eksen birincil?"** kararı iş modelini yansıtıyor: koleksiyon/aesthetic markaları (COCO, MarieBelle) koleksiyonu öne alır; hediye-platformu mantığı (Personal Creations, Things Remembered, Choc on Choc) özel günü öne alır. Beyza Blanc "özel gün → hediye" konumlandırmasında olduğundan **özel gün birincil eksen** olmalı.
- **Yıl bazlı yıl dönümü kırılımı (1./5./10./25./50.)** ve **işe başlama/iş yıl dönümü** gibi B2B'ye kayan günler yalnızca katalog genişliği olan oyuncularda görülüyor; tek şubeli butik için bunlar **içerik/blog** ile karşılanabilir, menüye taşınması gereksiz.
- Önerilen minimal IA (inference): `Özel Günler` (Doğum, Doğum Günü, Yaş Günü, Nişan, Evlilik Yıl Dönümü, İşe Başlama, İş Yıl Dönümü, Mezuniyet) · `Kim İçin` (O / O'na / Çocuk / Bebek / Kurumsal) · `Kişiye Özel` · `Kurumsal` · `Hakkımızda` · `Blog` · `SSS`, üstte arama + sepet ve **sticky** başlık.

### Gaps
- Choc on Choc'un ve diğerlerinin **mobil menü** davranışı (hamburger içi hiyerarşi) metin çıkarımıyla görülemedi.
- notjustchocolate.co.uk üç denemede de alınamadı (fetch fail, 9 Kas 2026) — bu markanın IA'sı doğrulanamadı.
- Hiçbir sitede **A/B test ile doğrulanmış** "özel gün ekseni mi koleksiyon ekseni mi daha iyi dönüşüyor" verisi bulunamadı.

---

## 2) Tasarım Dili: renk, tipografi, fotoğrafçılık, animasyon

### Takeaway
İki egemen palet var: (a) **lüks kod — koyu kahve/siyah + altın + krem, yüksek-kontrast serif** (MarieBelle, Compartes); (b) **minimal/sıcak-nötr — toprak tonları, beyaz alan, serif başlık + sans-serif gövde** (Dandelion, Askinosie). Bir de karşı-kod olarak **şekerli/oyuncu, parlak renk + illüstrasyon** (Boomf, Sugarfina'nın renkli kutuları) mevcut. "Kahverengi kutu + altın yazı" sektörün ana akım klişesi olarak açıkça tanımlanıyor.

### Cited Findings
- **MarieBelle (mariebelle.com)** — "Sophisticated **serif/sans-serif pairing**, extensive mega-menus, **earth-tone palette with gold accents**." — [colorlib.com/wp/chocolate-shop-website-examples](https://colorlib.com/wp/chocolate-shop-website-examples) (9 Kas 2026)
- **Compartes Chocolatier** — "Ultra-bold luxury aesthetic with sophisticated photography, **restrained typography, and muted color palette**"; "bold typography ve güçlü görsel hiyerarşi". — [colorlib.com](https://colorlib.com/wp/chocolate-shop-website-examples) (9 Kas 2026). Markanın kendi metni de konumlandırmayı doğruluyor: Fendi/Tom Ford/Netflix için özel sleeve'ler, "handmade in Los Angeles since 1950"; basın alıntısı "A modern day Willy Wonka with an Andy Warhol flair." — [compartes.com](https://compartes.com/) (9 Kas 2026)
- **Dandelion Chocolate** — "Minimalist luxury with **warm earth tones**"; **Askinosie** — "warm browns and creams, press testimonials"; **Gnosis** — "Artisanal aesthetic with warm color palette"; **Olive & Sinclair** — "Heritage-focused design with **gallery-style imagery, minimal navigation**"; bir başka örnek — "Minimalist with **gold accents**, clean grid layout, and corporate gifting integration." — [colorlib.com](https://colorlib.com/wp/chocolate-shop-website-examples) (9 Kas 2026)
- Lüks kod eleştirisi (Base Design, andSons vakası): "our refusal to follow the **conventional codes – brown boxes and gold lettering** – of luxury chocolate packaging… playful and effortless"; aynı markada web'de "kullanıcı scroll ettikçe kutu bir mücevher kutusu gibi yavaşça açılıyor" (scroll-tetiklemeli açılma animasyonu). — [sufio.com/blog/chocolate-packaging-design-ideas](https://sufio.com/blog/chocolate-packaging-design-ideas) (9 Kas 2026)
- Tipografi rehberi: lükste serif "elegant/premium/sophisticated/traditional" algısı verir; popüler kodlar "thin high-contrast serif, editorial-inspired typography, minimal luxury layouts, **gold foil typography**"; yaygın başarılı eşleşme **serif başlık + sans-serif destek metni**. — [lettercrafted.com](https://lettercrafted.com/best-packaging-design-typography-guide-designers) (9 Kas 2026)
- **COCO Chocolatier** — Tasarım dili "bold, design-led artwork by independent artists" ve "hand-wrapped bars" etrafında; yani **illüstrasyon/sanat öne çıkan, sıcak-nötr, ürün-odaklı** bir dil (metin gözlemi). — [cocochocolatier.com](https://www.cocochocolatier.com/) (9 Kas 2026)
- **Boomf** — "spreading joy, surprises and confetti" konumlandırması; patlayan konfeti kartları/kutuları = **oyuncu, sürpriz-odaklı, parlak ve eğlenceli** dil (metin gözlemi). — [boomf.com](https://www.boomf.com/) (9 Kas 2026)
- Konsept çalışmalar (canlı site değil, referans): Dribbble'da "Choc9 — Pure Indulgence, Reimagined" **dark theme/editorial**; "M.C. Chocolat — Luxury Chocolate E-commerce" ve "Luxury Chocolate & Food E-Commerce Website Design" **minimal/premium** olarak etiketli. — [dribbble.com/search/chocolate-website](https://dribbble.com/search/chocolate-website) (9 Kas 2026)

### Inferences
- Kremsi/krem zemin + koyu metin + **altın vurgu + yüksek-kontrast serif başlık** kombinasyonu, "lüks kişiye özel çikolata" için sektörde en güvenli kod; ancak artık **klişe** sayıldığı için farklılaşma illüstrasyon veya fotoğrafçılıkla kuruluyor.
- Butik/beyaz-etiket marka için öneri (inference): beyaz/krem ağırlıklı zemin, ürün fotoğrafında **flat-lay + gerçek kutu unboxing/UGC karışımı**, kimlikte serif başlık + sans gövde, tek vurgu rengi (altın yerine markaya özgü bir aksan), ve tek bir zarif **scroll animasyonu** (kutu açılması vb.) — çoklu animasyon yerine.
- Fotoğrafçılık: lüks örnekler "sophisticated photography / gallery-style imagery" kullanıyor; UGC verileri gerçek müşteri fotoğrafının stok/kusursuz stüdyo görselinden daha ikna edici olduğunu gösteriyor (bkz. Q5).

### Gaps
- **Font isimleri, tam renk kodları ve animasyon süreleri** görsel olarak doğrulanmadı (metin tabanlı çıkarım sınırı). Bunlar canlı site görsel incelemesi veya Wayback Machine CSS analizi gerektirir.
- Sugarfina ve Baked by Melissa'nın **somut palette/font** tanımı bağımsız kaynakta bulunamadı.

---

## 3) Kullanıcı Akışı: ana sayfa → sipariş; kişiselleştirme nerede; checkout kaç adım

### Takeaway
Kişiselleştirme iki yere yerleşiyor: (a) **ürün sayfasında/ürün-ailesi içinde "Create Your Own" konfigüratörü** (Boomf, Compartes "Make Your Own"); (b) **"Build a Box" tipi ayrı bir yapılandırıcı** (Sugarfina). Checkout tarafında sektör ortalaması **5,1 adım / 11,3 alan**; ideal hedef **~8 alan**. Misafir (guest) checkout kritik: kullanıcıların **%18'i** sırf hesap açmak istemediği için vazgeçiyor.

### Cited Findings
- **Boomf** ürün ailelerinde `Create Your Own` / `Personalised` / `Non-personalised` ayrımı; ayrıca "Money Wallets" gibi ayrı yapılandırıcı yüzeyleri var. — [boomf.com](https://www.boomf.com/) (9 Kas 2026)
- **Sugarfina** ve **Compartes** "Build a Gift Box" / "Make Your Own → Build a Bar Set / Build Your Own Bark" konfigüratörlerini ana menüye taşıyor. — [sugarfina.com](https://sugarfina.com/), [compartes.com](https://compartes.com/) (9 Kas 2026)
- **Baked by Melissa (bakedbymelissa.com)** "How It Works" bölümü 4 adım olarak yazılmış: **Step 1 Pick your treats → Step 2 Pick your delivery date → Step 3 Add your gift message → Step 4 Delivered fresh!** — yani kişiselleştirme + teslim tarihi + hediye notu, ürün seçiminden hemen sonra ana akışa gömülü. — [bakedbymelissa.com](https://www.bakedbymelissa.com/) (9 Kas 2026)
- **Sugarfina checkout ekranı** gözlemi: hesap seçimi "Checkout as a new customer" vs "Checkout using your account" olarak sunuluyor (misafir akışı mevcut). — [sugarfina.com](https://sugarfina.com/) (9 Kas 2026, 404 veren /pages/build-a-gift-box içeriğinde görüldü)
- Baymard 2024: ortalama checkout **5,1 adım** ve **11,3 form alanı** (2021: 11,8; 2019: 12,7); çoğu site için gereken **~8 alan**; **%17** kullanıcı sırf "çok uzun/karmaşık" olduğu için vazgeçiyor. — [baymard.com/research-articles/checkout-flow-average-form-fields](https://baymard.com/research-articles/checkout-flow-average-form-fields) (26 Haz 2024)
- Ortalama sepet terk oranı **%70,22** (22 Eyl 2025 güncellemesi); yalnızca checkout tasarım iyileştirmeleriyle ortalama büyük sitede **+%35,26** dönüşüm potansiyeli. — [baymard.com/lists/cart-abandonment-rate](https://baymard.com/lists/cart-abandonment-rate)
- Misafir checkout: 1.026 ABD'li katılımcıyla ankette **%18'i** hesap açmak istemediği için vazgeçmiş; sitelerin **%62'si** misafir checkout'u en görünür seçenek yapmıyor. — [baymard.com/research-articles/current-state-of-checkout-ux](https://baymard.com/research-articles/current-state-of-checkout-ux) (2025)
- Ödeme çeşitliliği: bir kullanıcı alt grubu 3. taraf ödeme yöntemlerine bağımlı; sitelerin **%21'i yalnızca 1 yöntem** kabul ediyor. — [baymard.com/research-articles/collections/cart-and-checkout](https://baymard.com/research-articles/collections/cart-and-checkout)
- Kişiselleştirme dönüşüm etkisi (ajans iddiası): Beysis (Personalized Lifestyle & Corporate Gifting) — kişiye özel ürünler için özel ürün şablonu → **+%23 dönüşüm, −%18 sepet terk, +%12 AOV**. — [maperce.com/pages/case-studies](https://maperce.com/pages/case-studies) (9 Kas 2026)
- Shopify ekosisteminde hazır çözüm: Giftship **Box Builder** uygulaması, çikolata için "build a box + kişisel mesaj" akışını ve kurumsal/mevsimsel varyantları destekliyor. — [gist-apps.com](https://gist-apps.com/articles/how-you-could-build-the-ultimate-chocolate-box-with-shopifys-giftship-box-builder)

### Inferences
- Kişiselleştirme için iki gerçekçi yol var: düşük-ortalama-sepetli marka için **ürün sayfası içi basit alanlar** (isim/tarih/mesaj + canlı önizleme); butik ölçekte **"Box Builder" tarzı ayrı konfigüratör** Shopify uygulamasıyla hızlı kurulabilir.
- Checkout hedefi (inference): 4–5 adım, ≤8–10 alan, **misafir checkout en görünür seçenek**, gömülü hediye-notu alanı, Express ödeme (Apple/Google/Shop Pay) — Baymard bulgularıyla birebir örtüşüyor.
- "Sepet terk kurtarma" için bulunan somut kanıt Shopify/WhatsApp uygulama ekosistemindeki **abandoned-cart otomasyonları** ile sınırlı; marka-özel bir vaka bulunamadı.

### Gaps
- Sugarfina'nın **gerçek checkout adım sayısı ve alan sayısı** sayılmadı (hesap gerektiren akış, oturum açmadan ölçülemedi).
- Hiçbir sitede **misafir checkout'un A/B dönüşüm verisi** yayınlanmamış.
- **Sepet terk kurtarma** (e-posta/SMS/WhatsApp akışı) canlı olarak doğrulanamadı; yalnızca araç/vendor iddiaları mevcut.

---

## 4) Özel Gün Akışına Özgü Detaylar: teslim tarihi, farklı adrese gönderim, hediye notu

### Takeaway
Özel-gün UX'inin kalbi: **"Bu tarihe kadar gelsin" teslim-tarihi seçimi** ve **hediye notu alanı**. Sektör lideri örnek Baked by Melissa; "Pick your delivery date" ve "Add your gift message"i anasayfada 4 adımlı akış olarak vitrinliyor. Baymard da checkout'ta "Shipping Speed" yerine **"Delivery Date"** kullanılmasını, katılımcıların "Delivers Thursday" gibi net tarih istediğini gösteriyor.

### Cited Findings
- **Baked by Melissa** anasayfa "How It Works": Step 2 = **Pick your delivery date**, Step 3 = **Add your gift message**; ayrıca güven şeridinde "**Pick your delivery date**" bir vaat olarak yineleniyor. — [bakedbymelissa.com](https://www.bakedbymelissa.com/) (9 Kas 2026)
- **MarieBelle** duyuru şeritleri teslim zamanlamasını operasyonel olarak yönetiyor: "No Friday shipping to keep your packages from melting! **Please review your delivery dates at checkout**", "Orders placed before 12:00 PM EST ship the same business day", "**Last Chance for Overnight & 2-Day Orders Must Be Placed Before 12PM ET Thursday** " (soğuk-zincir/erime kısıtı + kesme saati). — [mariebelle.com](https://www.mariebelle.com/) (9 Kas 2026)
- **Personal Creations** duyuru şeridi: "**ORDER BY 5PM PST FOR HALLOWEEN DELIVERY** " = teslim-tarihi öncelikli, kesme-saati vurgulu banner. — [personalcreations.com](https://www.personalcreations.com/) (9 Kas 2026)
- **Shari's Berries** "Where Is It Going?" + **Occasion** girişli hediye bulucu ve üst menüde ayrı **SAME DAY DELIVERY** sekmesi. — [sharisberries.com](https://sharisberries.com/) (9 Kas 2026)
- **Sugarwish** adres toplamayı alıcıya devrediyor: "Send by email or text — **no address needed**", "They choose favorites and **tell us where to ship**". — [sugarwish.com](https://www.sugarwish.com/) (9 Kas 2026)
- Baymard: **"Delivery Date" (Shipping Speed değil)** kullanılmalı — sitelerin %48'i (2025) / %41'i (2023) kullanmıyor; Apple örneğinde katılımcı "'Delivers Thursday' ile istediğim güne yetiştiğini kolayca anladım" diyor. — [baymard.com/research-articles/current-state-of-checkout-ux](https://baymard.com/research-articles/current-state-of-checkout-ux), [baymard.com/research-articles/collections/cart-and-checkout](https://baymard.com/research-articles/collections/cart-and-checkout)
- Baymard: **kesme saatini geri sayım (countdown)** olarak göstermek — sitelerin **%83'ü** yapmıyor. — [baymard.com/research-articles/current-state-of-checkout-ux](https://baymard.com/research-articles/current-state-of-checkout-ux) (2025)
- Baymard gifting flow: sipariş "gift" olarak işaretlenince **billing = shipping varsayılmamalı**; alıcı adresi açıkça istenmeli (Walmart örneğinde alanlar "Recipient's first name / last name" diye etiketlenmiş); Edible Arrangements'ta (hediye-ağırlıklı) "Same as recipient" kutucuğu **varsayılan olarak işaretsiz**. — [baymard.com/research-articles/gifting-flow](https://baymard.com/research-articles/gifting-flow), [baymard.com/research-articles/set-billing-equal-to-shipping](https://baymard.com/research-articles/set-billing-equal-to-shipping)
- Gelecek-tarihli/planlı teslimat ve hatırlatma, planlı sipariş uygulamalarıyla (Flare, Zapiet Pickup+Delivery) tipik olarak 14–30 gün ileriye kuruluyor (topluluk/uygulama kaynağı, vendor). — [getflare5.wordpress.com](https://getflare5.wordpress.com/2024/09/09/how-to-offer-future-delivery-dates-for-gifts-in-your-online-store), [community.shopify.com](https://community.shopify.com/t/how-can-i-offer-future-ship-dates-for-gifts-in-my-online-store/248110)
- Teslim-tarihi beklentisi: Forrester'a atıfla **ABD'li tüketicilerin %68'i** siparişten önce web'de teslim tarihini teyit etmek istiyor; doğum günü/etkinlik gibi aciliyetli alımlarda tarihin yokluğu = kesin "hayır". — [kibocommerce.com](https://kibocommerce.com/blog/estimated-delivery-dates-ecommerce) (13 Haz 2026)
- Kurumsal tarafta "preschedule milestone gifts": tarihler önceden kurulur, hediyeler otomatik olarak seçilen günde gider. — [corporategift.com](https://www.corporategift.com/) (9 Kas 2026)

### Inferences
- Özel-gün sitesinde **en yüksek değerli 3 özellik**: (1) ürün sayfasında/sepette tarih seçici + "yetkili teslim" güvencesi, (2) hediye notu/kart metni alanı (canlı önizleme), (3) "bana değil, alıcıya gönder" mantığının varsayılan ve net olması.
- Butik marka için "doğum gününe yetişme" kaygısını gidermek üzere: **kesme-saati geri sayımı** + "X tarihine kadar sipariş → Y'de elinde" mesajı, görece düşük maliyetli ve Baymard'ın "çok az site yapıyor" dediği bir farklılaşma.
- Hatırlatma (kayıtlı özel gün takvimi) kanıtı bulunan tek yerde **kurumsal** akışlarda (CorporateGift.com preschedule); tüketici tarafında yaygın bir "özel gün hatırlatıcı" özelliği gözlenmedi.

### Gaps
- **Farklı adrese gönderim (ship-to-different-address) ve "price hidden on packing slip"** özelliğinin bu markalardaki somut uygulaması sepet oturumu açmadan doğrulanamadı.
- Tüketici tarafında **"belirli güne planlı teslimat" + hatırlatma kaydı** özelliği canlı örnekte net görülmedi.
- Baymard gifting-flow makalesinin tam metni (5 guideline) yalnızca özet/atıf düzeyinde okunabildi.

---

## 5) Güven ve İkna Unsurları: yorumlar, UGC, basın, kargo/iade, ödeme güvenliği

### Takeaway
En güçlü kaldıraç **gerçek müşteri fotoğraflı yorumlar** (UGC): yorum içeren ürün sayfaları %15–30 daha iyi dönüşüyor; 50+ yorumlu ürünler yorumsuzlara göre ~4,6x. Ayrıca **kesme-saati/teslim bilgisi** bir güven unsuru olarak öne çıkıyor (Baked by Melissa: "Ships nationwide in 1–2 days").

### Cited Findings
- Yotpo analizi (200.000+ mağaza, 163M+ sipariş): PDP'de UGC göstermek ortalamada **+%161** dönüşüm; alıcıların **%55+'ı** satın almadan önce yorum/fotoğraf/Q&A ile etkileşiyor. — [inbeat.agency/blog/ugc-statistics](https://inbeat.agency/blog/ugc-statistics)
- PowerReviews 2025 (21.279 tüketici anketi): **%95** düzenli olarak yorum okur; **yalnızca %43** hiç yorum/puan olmayan ürünü satın alır; **%78** diğer tüketici fotoğraflarını marka/etkileyici görselinden daha değerli bulur; **%91** yorumda fotoğraf/video varsa almaya daha yatkın; **%23** müşteri görseli olmayan ürünü almaz. — [shopify.com/enterprise/blog/user-generated-content-examples](https://www.shopify.com/enterprise/blog/user-generated-content-examples)
- Yorum eşiği etkisi: yorumlu PDP **%15–30 daha yüksek dönüşüm**; **50+ yorumlu ürünler 4,6x** daha iyi dönüşür; **%88** online yorumlara kişisel tavsiye kadar güvenir. — [resources.rework.com](https://resources.rework.com/libraries/ecommerce-growth/customer-reviews-ugc)
- Güven rozetleri + kredi kartı ikonları **+%12,6** dönüşüm (SearchBloom CRO vakası); güven sinyalleri doğru yerleştirilirse **+%12–42**. — [brimaronlinemarketing.com](https://brimaronlinemarketing.com/blog/which-website-trust-signals-increase-conversions), [buildgrowscale.com](https://buildgrowscale.com/trust-signals-ecommerce-conversion)
- Yerleşim rehberi: **Anasayfa** → referanslar, yıldızlar, basın, logolar; **Ürün sayfası** → yorum/yıldız, UGC fotoğraf/video, para-iade garantisi, kargo/iade politikası; **Checkout** → SSL/kilit, güvenlik mührü, gizlilik politikası, tanıdık ödeme logo(ları). — [brimaronlinemarketing.com](https://brimaronlinemarketing.com/blog/which-website-trust-signals-increase-conversions)
- Stok fotoğraf yerine **gerçek müşteri fotoğrafı** "authenticity bias" tetikler; tanınmayan güven mührü, ücretsiz SSL kilidinden bile kötü dönüşebilir; Shopify Payments/Stripe logosu güçlü güven sermayesi taşır. — [buildgrowscale.com](https://buildgrowscale.com/trust-signals-ecommerce-conversion)
- Sahada gözlenen güven unsurları: **Baked by Melissa** güven şeridi — "Ships nationwide in 1–2 days / Baked fresh, shipped sealed / Pick your delivery date"; ürünlerde "Bestseller" etiketi. — [bakedbymelissa.com](https://www.bakedbymelissa.com/) (9 Kas 2026). **Compartes** — "Trusted by the world's leading brands" marka logo duvarı (Louis Vuitton, Gucci, Tiffany & Co., Nike, Google, Netflix, Grammys, American Airlines) + kurumsal vaatler "Design Proofs Free / Turnaround 2 Weeks / Shipping No-Melt". — [compartes.com](https://compartes.com/) (9 Kas 2026). **MarieBelle** — "Companies & Brands That Trust Us" bölümü. — [mariebelle.com](https://www.mariebelle.com/) (9 Kas 2026). **CorporateGift.com** — "Customers love us" yorum alıntıları + ödeme yöntemi logoları. — [corporategift.com](https://www.corporategift.com/) (9 Kas 2026). **Milk Bar** — "Why choose Milk Bar?" (One-of-a-kind treats / Thoughtfully packaged / Nationwide delivery). — [milkbarstore.com](https://milkbarstore.com/) (9 Kas 2026)

### Inferences
- Butik ölçek için en yüksek getirili sıralama (inference): (1) teslim-tarihi/sıcaklık güvencesi şeridi, (2) WhatsApp/Instagram'dan toplanan **gerçek müşteri fotoğraflı yorumlar** (UGC) ürün sayfasında CTA yakınında, (3) ürün sayfasında para-iade/kargo politikası özeti, (4) checkout'ta ödeme logo/SSL, (5) mümkünse basın/yayın referansı.
- Kurumsal müşteri kazanımı için marka-logo duvarı (Compartes tarzı) güçlü; ancak tek şubeli marka için bu, **yerel/işletme müşteri referansları** ile küçültülerek kullanılabilir.

### Gaps
- Bu markalarda **basın logosu (press bar) ve gerçek müşteri fotoğrafı (UGC)** yerleşiminin somut örnekleri metin çıkarımıyla tam doğrulanamadı (Compartes/MarieBelle'de "brand logos", Milk Bar/Baked'de vaat şeritleri görüldü, ama UGC galerisi görülmedi).
- Ödeme güvenliği rozetlerinin (SSL, Norton, 3D Secure) hangilerinin kullanıldığı ve iade süresi gibi somut politika detayları doğrulanamadı.

---

## 6) Mobil Deneyim: mobil öncelik, WhatsApp/DM kısayolları, hız algısı, sticky CTA

### Takeaway
Mobil, sektörün en zayıf halkası: lider mobil sitelerin **%67'sinin navigasyonu** "vasat/kötü". En çok kazanan mobil A/B testleri **sticky add-to-cart** ve **küçültülmüş başlık/navigasyon**. WhatsApp kısayolu Türkiye bağlamında değerli ama Baymard, sürekli yüzen (floating) chat balonlarının mobilde içeriği kapattığını ve rahatsız edici bulunduğunu gösteriyor — yani konumlandırma ve yanıt hızı kritik.

### Cited Findings
- Baymard benchmark: lider **mobil** e-ticaret sitelerinin **%67'sinin navigasyonu** "mediocre/poor"; masaüstünde %58. — [appkodes.com](https://appkodes.com/blog/what-is-ecommerce-navigation) (Baymard 2025 atfı)
- Baymard 2026: lider US/Avrupa sitelerinin **%59'u** checkout UX'te "vasat veya daha kötü"; Cart & Checkout'ta **%65** vasat+, yalnızca **%2** "iyi"; ortalama sitede **32 iyileştirme** gerekiyor. — [baymard.com/research/checkout-usability](https://baymard.com/research/checkout-usability)
- Mobil A/B testlerinde en çok kazananlar (CRO pratisyeni, 1.000+ test): **daha küçük başlık/navigasyon**, **sticky add-to-cart butonu**, benefit içeren başlık, kısa/ taranabilir metin, **Apple Pay / Google Pay / Shop Pay** express ödeme; sticky CTA sayfa yüklenince veya scroll'da test edilmeli, "Buy Now" gibi güçlü çağrılardan kaçınılmalı. — [nicolasfradet.com/ab-test-ecommerce-mobile](https://nicolasfradet.com/ab-test-ecommerce-mobile)
- WhatsApp ölçeği ve oranları: 2,5 milyar kullanıcı; açılma oranı %90–99, CTR/dönüşüm %20–60 (vendor iddiası); 15 dk içinde yanıt veren işletmelerin dönüşümü **%80'e kadar** daha yüksek (Gallabox). — [insiderone.com/whatsapp-ecommerce](https://insiderone.com/whatsapp-ecommerce), [veloryntech.com](https://www.veloryntech.com/chatcartpro/blog/floating-whatsapp-button)
- Baymard uyarısı: tüm sayfalarda sürekli duran yüzen chat/WhatsApp balonları mobilde içeriği örtüyor ve rahatsız edici bulunuyor (Lowe's katılımcısı: "Oh, god, I hate these, go away"). — [veloryntech.com](https://www.veloryntech.com/chatcartpro/blog/floating-whatsapp-button) (Baymard atfı)
- WhatsApp sipariş butonu yaygın bir Shopify/WooCommerce eklentisi; önerilen varsayılan marka rengi WhatsApp yeşili (tanınırlık için). — [apps.shopify.com/ca-chat-order-button-widget](https://apps.shopify.com/ca-chat-order-button-widget), [woocommerce.com/products/order-on-whatsapp-for-woocommerce](https://woocommerce.com/products/order-on-whatsapp-for-woocommerce)

### Inferences
- Butik marka için mobil öncelik (inference): tek-sütun düzen, sticky "Sepete ekle" + sticky WhatsApp kısayolu (ama **içeriği gizlemeyen** konumda, çoğu sayfada sabit yüzen balon yerine bağlamsal yerleştirme), Apple/Google Pay, hızlı yüklenen tek büyük görsel.
- WhatsApp/DM, Türkiye'de "özel sipariş" görüşmesi için kritik; ancak **15 dk içinde yanıt** vaadini karşılayamayacaksa öne çıkarmamak daha iyi (Baymard + Gallabox uyarısı).

### Gaps
- Hiçbir sitede **ölçülen Core Web Vitals / sayfa hızı** verisine ulaşılamadı; "hız algısı" yalnızca tasarım kalıbı düzeyinde değerlendirildi.
- Bu markaların mobil menülerinin ve WhatsApp/DM kısayollarının **canlı varlığı** (Türkiye dışı örneklerde) doğrulanmadı.

---

## 7) Ortak "iyi" ve "kötü" kalıplar; butik ölçekte erişilebilirlik

### Takeaway
**İyi kalıplar** (düşük maliyetle kopyalanabilir): özel-gün birincil navigasyon, 4 adımlı "nasıl çalışır" (ürün → teslim tarihi → hediye notu → teslimat), kesme-saati/teslim güvencesi, misafir checkout, gerçek fotoğraflı yorumlar, sticky mobil CTA. **Kurumsal ölçek gerektiren kalıplar**: derin mega-menüler (yıl bazlı yıl dönümü kırılımı, By Price), çok-alıcılı kurumsal gifting platformu, HR/CRM entegrasyonları, marka-logo duvarı.

### Cited Findings
- Sektör nav normu: **8'den az üst seviye öğe**, jargon yok, "en popüler" üstte, sticky menü, breadcrumb, hızlı arama; mobilde hamburger + thumb-friendly. — [designstudiouiux.com](https://www.designstudiouiux.com/blog/ecommerce-navigation-best-practices), [cxl.com](https://cxl.com/ecommerce-best-practices/navigation), [shopify.com/enterprise/blog/ecommerce-navigation](https://www.shopify.com/enterprise/blog/ecommerce-navigation)
- Sezon/kampanya kategorilerini menünün sonuna koymak, tek bir aksan renk kullanmak ve yalnızca 1–2 öğeyi vurgulamak öneriliyor; ConvertCart'ın Emerald Struts vakasında yüksek-kontrast navigasyon ipuçlarıyla **+%39,57** dönüşüm. — [convertcart.com/blog/ecommerce-navigation-menu](https://www.convertcart.com/blog/ecommerce-navigation-menu)
- Koyu/altın "lüks çikolata" kodu klişe ilan ediliyor (Base Design/andSons); farklılaşma oyuncu/eğlenceli veya editorial-minimal yönde aranıyor. — [sufio.com](https://sufio.com/blog/chocolate-packaging-design-ideas)
- Butik/ölçek ayrımı kanıtı: derin çok-eksenli menüler (Personal Creations yıl-bazlı alt kırılımlar; Sugarfina By Price) ve kurumsal otomasyon (CorporateGift.com entegrasyonlar, çok-alıcılı gönderim, preschedule) yalnızca katalog/platform ölçeğinde oyuncularda gözleniyor. — [personalcreations.com](https://www.personalcreations.com/), [sugarfina.com](https://sugarfina.com/), [corporategift.com](https://www.corporategift.com/) (9 Kas 2026)
- Butikte uygulanabilir "4 adımlı akış" ve güven şeridi modeli **Baked by Melissa**'da net biçimde küçük ölçekte de kurulabilir. — [bakedbymelissa.com](https://www.bakedbymelissa.com/) (9 Kas 2026)
- E-ticaret platformu önerileri: Shopify/WooCommerce/Magento planlı teslim tarihi eklentileri destekliyor; kişiselleştirilmiş ürün için özel şablon dönüşümü artırıyor (Beysis +%23). — [getflare5.wordpress.com](https://getflare5.wordpress.com/2024/09/09/how-to-offer-future-delivery-dates-for-gifts-in-your-online-store), [maperce.com](https://maperce.com/pages/case-studies)
- Dönüşüm kıyası: kişiselleştirme testleri ~%20+ lift iddiaları (Shoplift 21,7%), Edible Blooms/Hampers.com.au dönüşümü %1,35→%4,38 (Shopify vaka). — [shoplift.ai](https://www.shoplift.ai/get-started/shopify-personalization), [shopify.com/case-studies](https://www.shopify.com/case-studies)

### Inferences
- **Butik için erişilebilir set (inference):** özel-gün navigasyonu + "nasıl çalışır" + teslim tarihi & kesme saati + hediye notu + misafir checkout + UGC yorumlar + sticky mobil CTA + tek scroll animasyonu. **Kurumsal ölçek gerektiren (ertele):** yıl-bazlı mega-menü kırılımları, By Price ekseni, çok-alıcılı gifting platformu, HR/CRM entegrasyonu, geniş marka-logo duvarı.
- Önerilen sayfa haritası (inference): **Ana sayfa** (özel-gün girişi + vitrin + güven şeridi) · **Özel Gün koleksiyonları** (doğum/doğum günü/yaş günü/nişan/evlilik yıl dönümü/işe başlama/iş yıl dönümü/mezuniyet) · **Kişiye Özel / Konfigüratör** · **Ürün sayfası** (teslim tarihi + hediye notu + UGC) · **Sepet & Checkout** (misafir, 4 adım) · **Kurumsal** · **Hakkımızda** · **Blog** (özel-gün rehberi) · **SSS/Kargo&İade** · **İletişim (WhatsApp kısayolu)**.

### Gaps
- "İyi/kötü kalıp" değerlendirmeleri alan-gözlemi ve sektör rehberlerine dayanıyor; bu kalıpların butik ölçekte **ölçülmüş dönüşüm etkisi** (A/B) yayınlanmış kaynak bulunamadı.
- Boomf gözlem anında kapalıydı; kapanış nedeni/tarihi doğrulanamadı (yalnızca "has officially closed its doors" mesajı görüldü, 9 Kas 2026) — bu, "trend belirleyici örnek" olarak kullanılırken dikkat edilmesi gereken bir belirsizlik.

---

## Ek: Kaynak doğrulanamayan / erişilemeyen noktalar (genel Gaps)
- **notjustchocolate.co.uk** — üç ayrı denemede de içerik alınamadı (fetch fail, 9 Kas 2026).
- **lovecocoa.com** — içerik alınamadı (cocochocolatier.com aynı gruba ait "Made Uncommon" çatısı altında görüldü).
- **sugarfina.com/pages/build-a-gift-box** — 404 döndü (URL tahmini yanlıştı); gerçek konfigüratör sayfası doğrulanamadı.
- **Awwwards / Behance / Mobbin / Wayback Machine** ile tasarım evrimi ve görsel karşılaştırma bu turda yapılamadı (araç/zaman sınırı); font, renk kodu ve animasyon iddiaları bu nedenle yalnızca ikincil kaynaklı.
- Baymard ücretli guideline'ların (ör. gifting flow 5 guideline, checkout 700+ guideline) tam metni alınamadı; yalnızca özet/atıf düzeyinde kullanıldı.
