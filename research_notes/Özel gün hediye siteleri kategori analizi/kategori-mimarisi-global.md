# Özel gün odaklı hediye/çikolata sitelerinde KATEGORİ MİMARİSİ (global, Türkiye/KKTC hariç)

**Gözlem tarihi:** 9 Kasım 2026 (tüm menü, sitemap ve kategori listesi alıntıları bu tarihe ait snapshot'tır).

**Kapsam ve yöntem (site bazında, hangi veriyi nasıl aldım).** Kapsam dışı: Türkiye ve KKTC (ayrı araştırmacıda). Bu notta kullanılan yöntemler:

| Site | Altyapı (kanıt) | Yöntem | Aldığım veri |
|---|---|---|---|
| Compartés (compartes.com) | Shopify headless (sitemap `/sitemap/collections/1.xml`, `cdn.shopify.com/oxygen-v2`) | `curl https://compartes.com/sitemap.xml` → `/sitemap/collections/1.xml`; ana sayfa HTML nav parse | ~80 koleksiyon URL'si; mega menü etiketleri (Advent/Corporate/Club/Member + "Shop by Occasion") |
| Choc on Choc (choconchoc.co.uk) | Shopify (`sitemap_collections_1.xml`) | sitemap + ana sayfa `<nav>` HTML parse (4 blok, 6 `<ul>`, 37 `<li>`, 4 `menu-column` sınıfı) | ~68 koleksiyon URL'si; **mega menü etiketlerinin tam sırası** (aşağıda) |
| Milk Bar (milkbarstore.com) | Shopify | sitemap_collections | ~140 koleksiyon URL'si (özel gün + filtre + test/kirli kayıtlar) |
| Baked by Melissa (bakedbymelissa.com) | Shopify | sitemap_collections + ana sayfa HTML | ~78 koleksiyon URL'si; nav'da "Shop By Occasion" bloğu |
| Vosges (vosgeschocolate.com) | Shopify | sitemap_collections + ana sayfa `<nav>` HTML parse (11 `<ul>`, 60 `<li>`) | ~180 koleksiyon; **8 başlıklı mega menü** (BY CATEGORY / BY TYPE / GIFTS / BY PRICE …) |
| Godiva (godiva.com, ABD sitesi) | Shopify | sitemap_collections | ~105 koleksiyon URL'si; nav'da 28 `mega-menu`, 153 `submenu` işaretçisi |
| Sugarfina (sugarfina.com) | Magento 2 (Corra teması; `/static/version…/frontend/Corra/sugarfina`) | DataDome 403 → `tavily_extract` ile menü HTML'i | **Tam mega menü ağacı** (Shop Candy / Shop Gifts / Customize / Corporate / Instant Gifts / Rewards) |
| See's Candies (sees.com) | Custom (Amplience CDN görselleri) | curl 403 → `tavily_extract` | Nav + Gifts menüsü (Gift Type / Gifts by Price kolonları) |
| Harry & David (harryanddavid.com) | Custom (curlie 406) | `tavily_extract` ana sayfa | Occasion / Seasonal / "Shop By Category" listeleri, "+ More Ways to Shop" kalıbı |
| Fortnum & Mason (fortnumandmason.com) | Magento (magic linkler, `/media/wysiwyg/`, `.aspx` yok) | `/media/sitemap.xml` + `tavily_extract` `/gifts-occasions` | 10 başlıklı üst nav; **facet/eksen tabanlı kategori sayfası** (ürün sayılarıyla) |
| Not On The High Street (notonthehighstreet.com) | Custom Next.js | ana sayfa HTML (921 href), robots'taki gz sitemap index | 11 başlıklı üst nav; `/gifts/shop-by-occasion/…`, `/christmas/christmas-gifts/gifts-for-…`, `/department/…` URL şablonları |
| Moonpig (moonpig.com/uk) | Custom (Contentful görselleri) | `tavily_extract` ana sayfa | Nav: Birthday cards / Photo upload / Flowers / Christmas Cards / Special offers / Beauty gifts / Experience gifts / Birthday gifts / Balloons / Alcohol gifts / Anniversary cards |
| Prezzybox (prezzybox.com) | Custom ASP.NET (`.aspx`) | curl 403 → 404 sayfası HTML'i 922 KB (megamenu gömülü) ile sitemap taraması | `/gift-occasions/{ana}/{alt}.aspx` iki seviyeli taksonomi (aşağıda sayısal örnekler) |
| Etsy (etsy.com) | Custom | `tavily_extract` `/gifts` | Gifts hub kategori kartları + filtre (occasion/recipient/price/arrival date) |

Not: `seescandies.com` (kısa alan adı) çözümlenmedi; See's'in gerçek alan adı `sees.com`. `prezzybox.com`, `sugarfina.com`, `sees.com`, `harryanddavid.com` düz `curl`'de 403/406 verdiği için bu dört site Tavily ile alındı.

---

## KQ1 — Kaç eksen var ve eksenler nasıl birleşiyor? (a–i eksenlerinin her biri)

### Takeaway
Olgun özel-gün siteleri kategori eksenini 2–4 "birincil gezinme ekseni" olarak kurar (en yaygın üçlü: **özel gün + kime/alıcı + ürün/koleksiyon**), kalan eksenleri (fiyat, mevsim, tema, diyet, kurumsal, yeni/popüler) kategori yerine **filtre/facet** veya **"More Ways to Shop" alt kırılımı** olarak bağlar. Fortnum & Mason bunun en uç kanıtıdır: tek "Gifts & Occasions" sayfası hem özel-gün hem "kime" hem fiyat hem diyet facet'lerini aynı anda barındırır.

### Cited Findings
- **Eksen (a) özel gün** tüm markalarda birincil: Choc on Choc mega menüsünde ayrı bir "By Occasion" kolonu var (Birthday, Wedding/Engagement, New Home, Graduation/Exams, Thank You, Congratulations, Get Well Soon, Anniversary) — [choconchoc.co.uk](https://choconchoc.co.uk/) (ana sayfa `<nav>` HTML, 9 Kas 2026).
- **Eksen (b) alıcı/kime** ikinci birincil eksen: Choc on Choc'ta "Gifts For Her / Him / Kids / Adults / Teachers" ayrı kolon — [choconchoc.co.uk](https://choconchoc.co.uk/collections/chocolate-gifts-for-her). Vosges menüsünde ayrı "Gifts For Him/Her" — [harryanddavid.com](https://www.harryanddavid.com/) ("Gifts For Him", "Gifts For Her" = "+ More Ways to Shop" altında).
- **Eksen (c) ürün tipi** üçüncü birincil: Vosges menüsünde "BY CATEGORY" (Truffles, Chocolate Bars, Drinking Chocolate, Gift Sets…) ve "BY TYPE" (Dark/Milk/Caramel/Fruit/Vegan/Dairy Free/Gluten Free/Nut Free) — [vosgeschocolate.com](https://www.vosgeschocolate.com/) (nav HTML).
- **Eksen (d) fiyat aralığı**: Vosges'te ayrı "BY PRICE" kolonu (Gifts $25 & Under / $50 & Under / $100 & Under / $100 and Over) — [vosgeschocolate.com](https://www.vosgeschocolate.com/) nav. Sugarfina'da "By Price" altında "Gifts Under $35 / $50 / $75" — [sugarfina.com](https://www.sugarfina.com/gift-shop) (mega menü). Godiva sitemap'inde `/collections/gifts-under-25`, `-30`, `-50`, `-60`, `-100` ayrı koleksiyonlar — [godiva.com/sitemap_collections_1.xml](https://www.godiva.com/sitemap.xml).
- **Eksen (e) mevsim/tatil**: Her sitede Christmas/Hanukkah/Easter/Thanksgiving/Lunar New Year ayrı koleksiyon (Godiva: `holiday-gifts`, `hanukkah-gifts`, `lunar-new-year-gifts`, `halloween-chocolates`; Compartés: `christmas`, `easter`, `diwali`, `eid`, `nowruz`, `ramadan`, `passover-gifts`, `lunar-new-year`) — [compartes.com/sitemap/collections/1.xml](https://compartes.com/sitemap.xml), [godiva.com](https://www.godiva.com/sitemap.xml).
- **Eksen (f) tema/ilgi alanı**: Choc on Choc'ta ayrı kolon: "Sports, Foods, Music, Animals, Crafting, Alcohol" — [choconchoc.co.uk](https://choconchoc.co.uk/collections/sports), `/collections/music-themed-chocolate-gifts`, `/collections/crafting-themed-chocolate-gifts`.
- **Eksen (g) kişiselleştirme tipi**: Moonpig'de "Personalised Cards" ile "Gifts" iki ayrı dünya olarak kurulmuş (`/uk/personalised-cards/birthday/` vs `/uk/gifts/birthday/`); Fortnum'da "Personalised" 163 ürünlük bir facet — [moonpig.com/uk](https://www.moonpig.com/uk/), [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions).
- **Eksen (h) kurumsal**: Vosges menüsünde kök seviyede "CORPORATE GIFTING" (Client Gifts / Employee Gifts / Instant Gifts) — [vosgeschocolate.com](https://www.vosgeschocolate.com/); Compartés `/collections/gourmet-corporate-chocolate-gifts` ve `/collections/business-gifts`; Sugarfina kök nav "Corporate Gifting" — [sugarfina.com](https://www.sugarfina.com/corporate-gifting).
- **Eksen (i) yeni/popüler/çok satan**: Neredeyse evrensel — Compartés `shop-best-sellers` + `new-chocolate-gifts`; Godiva `best-selling-chocolate` + `new-arrivals`; Vosges `bestsellers` + `new-collections`; Milk Bar `the-best-sellers-shop`; Choc on Choc `best-selling-products` + `whats-new`.
- **Eksenler "ayrı menü" değil "facet" olarak birleşiyor (en net kanıt):** Fortnum & Mason "Gifts & Occasions" sayfası 1.873 ürünü tek listede tutup eksenleri filtreye çeviriyor — Occasion facet: Birthday 714, Christmas 678, Thank You 524, Housewarming 482, Thinking of You 455, Anniversary 440, Graduation 404, Corporate Gift 337, Wedding 337, New Baby 290; Recipient facet: For Someone Else 1497, For Her 1285, For Him 1075, For a Colleague 912, For a Couple 851, For a Child 94; ayrıca Product Type, Brand, Dietary (Vegan 14, Organic 7, Gluten-Free 2), Colour, Delivery facet'leri — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions).
- **Boyut kanıtı:** Fortnum tam katalogda 1.873 ürün, sayfa başına 48 ürün, 21 sayfa — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions).

### Inferences
- Başarılı model şudur: **2–3 eksen gerçek "kategori" (menüde gezilebilir), 4–6 eksen facet/filtre**. Ekseni menüye taşımak, ürün sayısı o eksende yeterince büyükse anlamlı (Fortnum'da mevsim 678 ürün, ama "For a Child" sadece 94 ürün → facet olarak kalmış).
- Özel gün ekseni ticari niyeti en yüksek eksendir; "kime" ekseni İngiltere/ABD'de özel günden **daha** çok alt kategoriye bölünüyor (Choc on Choc'ta 5 alıcı × fortnum'da 6 alıcı). Beyza Blanc için "kime" eksenini eş/partner, anne-baba, arkadaş, çocuk/bebek, kurumsal-çalışan olarak kurmak sektör standardına uyar.

### Gaps
- Hiçbir sitede eksen başına **trafik/dönüşüm payı** kamuya açık değil; hangi eksenin gerçekten kâr getirdiği ölçülemedi.
- Eksenlerin marka tarafında **kaç yılda** bugünkü hâle geldiğine dair tarihsel veri yok.

---

## KQ2 — Her eksende hangi kategori isimleri? (site başına tam menü/koleksiyon listesi)

### Takeaway
Sektörde iki isimlendirme katmanı var: **menüde kısa, jargon-suz başlıklar** (Birthday, Gifts For Her) ve **sitemap'te çok daha geniş, kimi zaman kirli bir koleksiyon envanteri** (test/trash koleksiyonları dahil). İlginç biçimde büyük oyuncular sitemap'e onlarca kampanya/tatil koleksiyonu ekliyor ama menüde yalnızca 5–10 tanesini gösteriyor.

Aşağıda **menüde görünen** (birebir alıntı) ve **sitemap koleksiyon envanteri** ayrıştırılmıştır. Orijinal adlar korunmuştur; parantez içi Türkçedir.

#### 1) Choc on Choc — mega menü etiketleri (birebir sıra, ana sayfa `<nav>`)
`Bestsellers | Shop All | Gifts For Her | Gifts For Him | Gifts For Kids | Gifts For Adults | Gifts For Teachers | Birthday | Wedding/Engagement | New Home | Graduation/Exams | Thank You | Congratulations | Get Well Soon | Anniversary | Sports | Foods | Music | Animals | Crafting | Alcohol | Chocolate Brownies | Chocolate Cards | Candy Floss | Chocolate Biscuits | Activity Kits | Choc on Choc Clothing | Christmas | The Chocolate Club | Our Story | Wishlist | Gift Finder Quiz` — [choconchoc.co.uk](https://choconchoc.co.uk/) (nav, 9 Kas 2026).
Sitemap envanterinde ek olarak: `/collections/shop-all-by-occasion`, `/collections/celebrations-occasions`, `/collections/gifts-under-5-00`, `-10`, `-15`, `-20`, `/collections/dads-birthday`, `/collections/mums-birthday`, `/collections/gifts-for-your-daughter`, `-friend`, `-mum`, `-sister`, `/collections/wimbledon`, `/collections/festival-chocolate`, `/collections/spring-animals`, `/collections/wildlife-collection`, `/collections/giant-chocolate`, `/collections/stocking-fillers` — [choconchoc.co.uk/sitemap_collections_1.xml](https://choconchoc.co.uk/sitemap.xml). Not: `/collections/trash`, `/collections/md-collection-email-exclusion`, `/collections/email-incentive-excluding-apparel` gibi iç/test kayıtları sitemap'te herkese açık.

#### 2) Vosges — mega menü sütun başlıkları ve altındakiler (birebir)
`ADVENT 2026` | `SHOP`: Holiday Collection, Thanksgiving Gifts, Cheese & Chocolate, The Smashing Pumpkins, Latest Luxuries | `BY CATEGORY`: Bestsellers, Truffles, Comfort Foods, Chocolate Bars, Drinking Chocolate, Soirées & Entertaining, Gift Sets | `BY TYPE`: Dark Chocolate, Milk Chocolate, Caramel, Fruit, Vegan, Dairy Free, Gluten Free, Nut Free | `GIFTS`: Weddings & Favors, Corporate Gifting, Instant Gifting | `BY PRICE`: Gifts $25 & Under, Gifts $50 & Under, Gifts $100 & Under, $100 and Over | (özel günler düz liste): Thank You Gifts, Wedding Gifts, Birthday Gifts, Anniversary Gifts, Hostess Gifts, Graduation Gifts | `WEDDINGS & EVENTS`: Wedding Favors, Custom Gifts | `CORPORATE GIFTING`: Client Gifts, Employee Gifts, Instant Gifts | `THE CHOCOLATE EXPERIENCE`: Our Story, Ingredient Origins, Our Boutiques, Blog — [vosgeschocolate.com](https://www.vosgeschocolate.com/) (nav HTML).
Sitemap'te ayrıca "gift guide" tipi koleksiyonlar: `/collections/bon-vivant-gift-guide`, `/collections/cacao-wellness-gift-guide`, `/collections/cancer-gift-guide`, `/collections/for-every-kind-of-mom-gift-guide`, `/collections/the-vosgiens-gift-guide`, `/collections/gluten-free-gift-guide` (bkz. KQ8).

#### 3) Sugarfina — tam mega menü ağacı (Magento)
Kök seviye: `New Arrivals | Shop Candy | Shop Gifts | Customize | Corporate Gifting | Instant Gifts | Rewards | FIND A STORE`.
- `New Arrivals` altında alt-kolon: Gift Shop, Greeting Cards, Gift Bags & Favor Boxes; Advent Calendars, Holiday, Peanuts® Holiday, Hanukkah, Cocktail Party; "Gifts By Recipient": Gifts for Him, Gifts for Her, Gifts for Kids, Hostess Gifts; "Gift Types": Gift Types, Party Favors, Bulk Bags, Taster Packets, Build Your Own Gift Box.
- `Shop Gifts` alt-kolonları: **Gift Boxes** (Build a Gift Box, Bestselling Gifts, Gift Bags & Favor Boxes, Greeting Cards); **Gifts by Occasion** (Birthday, Congratulations, Party Favors, Thank You, Wedding); **By Recipient** (Gifts for Him, Gifts for Her, Gifts for Kids, Hostess Gifts); **By Price** (Gifts Under $35, $50, $75).
- `Shop Candy` alt-kolonları: Collections (Advent Calendars, Holiday, Hanukkah, Peanuts® x Sugarfina, Parisian Chocolates); All Candy (All Candy, Gummies, Chocolates & Cordials, Kosher Candies, Vegan Candies, Sour Candies); Cocktail Candies (Cocktail Candies, Champagne, Rosé All Day).
- `Corporate Gifting` mega-sütununda görsel kutucuklar: Custom, Ready to Ship, Wedding Favors, Custom Celebrations, Corporate Gifting — [sugarfina.com](https://www.sugarfina.com/gift-shop) (mega menü HTML). Dikkat: "By Price" başlığının href'i hatalıdır (`hhttps://www.sugarfina.com/gift-shop` — çift "h" ve kırık link); kategori sayfası değil hub'a gidiyor.

#### 4) Fortnum & Mason — üst nav (10 kök) + "Gifts & Occasions" hub
Kök nav birebir: `Christmas | Hampers | Gifts | Food Hall | Wine & Spirits | Tea & Coffee | Biscuits & Chocolate | Home & Kitchen | Beauty & Accessories | Visit Fortnum's` — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions).
Özel-gün/season hub'ları ve alt başlıklar: `/gifts-occasions/gifting-ideas/personalised-gifts`, `/gifts-occasions/gifting-ideas/gift-cards`, `/seasonal-events/christmas/advent-calendars`, `/hampers/hampers-for-export`, `/hampers/gift-hampers`, `/hampers/all-hampers`, `/biscuits/all-biscuits/chocolate` — [fortnumandmason.com/media/sitemap.xml](https://www.fortnumandmason.com/media/sitemap.xml). Kategori sayfasındaki facet adları: Price, Colour, Delivery, Brand, Format, Size, Dietary, Product Type, Country, flavour (+ "Show All Filters").

#### 5) See's Candies — nav + Gifts menüsü
`Gift Type` kolonu: All Christmas Gifts, Stocking Stuffers, Boxed Chocolates, Gift Packs & Sets, Gifts for Kids, Limited Time Sweets, Mint & Peppermint, Build a Custom Box. `Gifts by Price` kolonu: Gifts Under $20, Gifts Under $50, Gifts Over $50, Gifts that Wow, eGift Cards, Gift Cards. Üst düzey: Christmas, Thanksgiving, Hanukkah, Build a Box, Shop (Chocolate & Candy: Boxed Chocolates, Lollypops, Milk Chocolate, Dark Chocolate…) — [sees.com/gifts](https://www.sees.com/gifts). Ayrıca `/christmas/…`, `/chocolate-and-candy`, `/limited-time-sweets`, `/build-a-box`.

#### 6) Harry & David — occasion + seasonal + "More Ways to Shop"
Occasion listesi: Birthday Gifts, Thank You Gifts, Thinking of You, Congratulations Gifts, New Baby Gifts, Anniversary Gifts, Care Packages, Housewarming Gifts, Wedding Gifts, Graduation Gifts, Game Time Favorites, Retirement Gifts. Seasonal: fall gifts, Halloween gifts, Thanksgiving dinner delivered, Christmas gifts. "+ More Ways to Shop": Bestsellers, Gift Bundles, Gifts For Him, Gifts For Her, Last Minute Gifts, Subscriptions, Deal of the Day. "+ Thoughtful Choices": Gluten Free, Organic, Sugar Free, Vegan, Kosher. Ürün-tipi kolları: + Gift Baskets (All Occasion / Fruit / Seasonal / Sentiments / Spa), + Gift Boxes (All Occasion / Seasonal / Meat & Cheese / Premium), + Gift Towers (All Occasion / Seasonal / Sentiments), + Brands (Rifle Paper Co.), + Gifts With Wine — [harryanddavid.com](https://www.harryanddavid.com/). Ana sayfada bir "gift finder" formu var: "Please choose a recipient / Please choose an occasion / Please choose a budget".

#### 7) Not On The High Street — üst nav (11 kök) + URL aileleri
Kök nav birebir: `Offers | Christmas | Gifts & cards | Jewellery | Home | Fashion & beauty | The Food Hall | The Flower Shop | Games & hobbies | Baby & child | Weddings`. Özel-gün ve alıcı URL'leri: `/gifts/shop-by-occasion`, `/gifts/shop-by-occasion/anniversary/view-all-anniversary-gifts`, `/gifts/shop-by-occasion/baby-shower-gifts`, `/gifts/shop-by-occasion/well-done-gifts`, `/gifts/shop-by-occasion/engagement`, `/gifts/shop-by-occasion/exam-congratulations`, `/christmas/christmas-gifts/gifts-for-boyfriends|brothers|couples|dads|families|friends|girlfriends|grandparents|husband|mums|sisters|teachers|teenagers|tweens|wives|pets|babies-children`, `/themes/gifts/luxury-gifts/for-her|for-him`, `/department/gifts` — [notonthehighstreet.com](https://www.notonthehighstreet.com/) + [notonthehighstreet.com/gifts/shop-by-occasion](https://www.notonthehighstreet.com/gifts/shop-by-occasion). Hub sayfası "Gifts by occasion — 8,839 products" gösteriyor.

#### 8) Prezzybox — iki seviyeli `.aspx` taksonomi (sayısal örnekler)
Kök: `/gift-occasions/{ana}/{alt}.aspx`. Ana gruplar ve alt kategori sayıları (404 sayfasındaki megamenu HTML'inden): `anniversary-gifts` (21 alt: 5th/10th/20th/25th/30th/40th/50th/60th-anniversary-gifts …), `wedding-gifts` (12 alt), `fathers-day-gifts` (11 alt), `birthday` yaş kırılımı (`18th/21st/30th/40th/50th/60th/70th/80th/90th-birthday-gifts`, çoğu ayrıca `-for-her` / `-for-him`), `memorial-gifts`, `christening-gifts`, `engagement-gifts`, `graduation-gifts`, `gifts-for-a-new-job`, `gender-reveal`, `halloween-autumn`, `baby-boy-gifts` / `baby-girl-gifts`, `adult-gifts`, `back-to-school`, `advent-calendars`, `all-prezzybox-gifts` — [prezzybox.com](https://www.prezzybox.com/occasions/) (megamenu HTML, 9 Kas 2026).

#### 9) Godiva (godiva.com) — koleksiyon envanteri (~105)
Özel gün: `anniversary-gifts`, `birthday-gifts`, `birthday-gift-ideas-by-recipient`, `thank-you-gifts`, `thank-you-and-congratulations-gifts`, `sympathy-gifts`, `wedding-showers`, `graduation-chocolate-favors-and-gifts`. Mevsim: `holiday-gifts`, `holiday-gifts-top-sellers`, `holiday-gift-boxes`, `holiday-stocking-stuffers`, `hanukkah-gifts`, `easter-gifts`, `halloween-chocolates`, `lunar-new-year-gifts`. Fiyat: `gifts-under-25/30/50/60/100`, `holiday-gifts-under-25/50/100`. Kime: `best-chocolate-gifts-for-chocolate-lovers`. Ürün: `assorted-chocolates`, `chocolate-truffles`, `chocolate-bars-and-snacks`, `chocolate-covered-snacks`, `chocolate-covered-strawberries`, `dark-chocolate`, `milk-chocolate`, `white-chocolate`, `kosher-chocolates`. Kurumsal: `corporate-gifts`. Yeni/popüler: `new-arrivals`, `best-selling-chocolate`. Koleksiyon tipleri kökü: `collections-type`, `collections-type-specialvalues`, `featured`, `frontpage` — [godiva.com/sitemap_collections_1.xml](https://www.godiva.com/sitemap.xml). Kirli kayıtlar: `test`, `test-1`, `test2`, `test-collection-mg`, `test-title`, `test-title-2`, `uat-products`.

#### 10) Compartés — koleksiyon envanteri (~80)
Özel gün: `birthday-chocolate`, `anniversary-gifts`, `thank-you-gifts`, `congratulations-gifts`, `housewarming-gifts`, `get-well-gifts`, `sympathy-gifts`, `push-gifts-and-push-presents`, `wedding-favors`. Mevsim/kültür: `christmas`, `easter`, `valentines-day`, `mothers-day`, `best-fathers-day-chocolate-gifts-los-angeles`, `thanksgiving`, `halloween`, `hanukkah-gifts`, `passover-gifts`, `diwali`, `lunar-new-year`, `nowruz`, `ramadan`, `eid`. Ürün: `boxes-of-chocolate`, `chocolate-bars-premium`, `chocolate-gift-baskets`, `chocolate-gift-sets`, `gourmet-gift-towers`, `chocolate-bark`, `gourmet-chocolate-truffles-gifts`, `hot-chocolate`, `heart-shaped-box`, `chocolate-bunny`, `chocolate-eggs`, `chocolate-advent-calendar`, `stocking-stuffers`. Fiyat: `chocolate-gifts-under-25`, `chocolate-gifts-under-50`, `gourmet-chocolate-gifts-under-100`, `luxury-chocolate-gifts-and-boxes`, `gourmet-chocolate-gifts`. Rejim/diyet: `dairy-free-chocolate`, `gluten-free-gourmet-chocolates`, `nut-free-chocolate`, `healthy-chocolate`, `vegan-chocolates-gourmet-organic-gifts`. Kurumsal: `gourmet-corporate-chocolate-gifts`, `business-gifts`. Yeni/popüler: `shop-best-sellers`, `new-chocolate-gifts`, `shop-all`. Tema/marka iş birliği: `dubai-chocolate`, `white-lotus`, `olipop`, `panda-express-chocolate`, `little-debbie-chocolate-bars`, `matcha-chocolate`, `spicy-chocolate`, `boozy-chocolate`, `chocolate-and-salt` — [compartes.com/sitemap/collections/1.xml](https://compartes.com/sitemap.xml).

#### 11) Milk Bar & Baked by Melissa — özel gün ve filtre deseni
Milk Bar: `birthday`, `the-birthday-sweet-shop`, `special-occasions-anniversary`, `special-occasions-engagement-bridal-shower`, `special-occasions-new-baby`, `special-occasions-wedding-gift-delivery`, `special-occasions-get-well`, `special-occasions-sympathy-gifts`, `special-occasions-thank-you`, `special-occasions-thinking-of-you`, `special-occasions-back-to-school`, `graduation` (`grad-shop`), `retirement-gifts`, `housewarming-gift-delivery`, `holidays-christmas`, `holidays-hanukkah`, `valentines-day-shop`, `easter-treats-delivered`, `thanksgiving-dessert-shop`, `fathers-day-shop`, `mothers-day` (mantıksal); fiyat `gifts-under-50/100/150`, `filters-0-50`, `filters-50-100`, `filters-100`; ürün-tipi filtreleri `filter-cakes`, `filter-cookies`, `filter-truffles`, `filter-gluten-free`, `filter-chocolate`, `filter-pistachio`+ `filters-*`; `the-best-sellers-shop`, `always-on`. Üst-seviye kategori grupları: "shop-all-*" ailesi (shop-all-cakes, shop-all-cookies, shop-all-pies, shop-all-bundles, shop-all-gift-card, shop-all-the-ice-cream-shop) — [milkbarstore.com/sitemap_collections_1.xml](https://milkbarstore.com/sitemap.xml).
Baked by Melissa: özel gün `birthday-cupcakes`, `congratulation-cupcakes`, `thank-you-cupcakes-gifts`, `sympathy-get-well-cupcakes`, `baby-shower-cupcakes`, `wedding-engagement-cupcakes`, `wedding-favors`, `rehearsal-dinner-sweets`, `guest-wedding-thank-you`, `graduation` (grad), `back-to-school-cupcakes-treats`, `housewarming` (`welcome-weekend-gifts`); mevsim `christmas`, `hanukkah-cupcakes`, `valentines-day`, `easter`, `halloween`, `thanksgiving`, `st-patricks-day`, `fourth-of-july`; rejim `gluten-free-cupcakes`, `vegan-cupcakes`, `specialty-diet-cupcakes`, `no-nut-flavor-cupcakes`; tema/koleksiyon `zodiac-collection`, `flavor-collection-*`, marka iş birlikleri (`ferrero-cupcakes`, `paw-patrol-cupcakes`, `emily-in-paris-cupcakes`); fiyat `gifts-under-50` — [bakedbymelissa.com/sitemap_collections_1.xml](https://www.bakedbymelissa.com/sitemap.xml).

#### 12) Moonpig & Etsy
Moonpig (kart + hediye ikili modeli): `/uk/personalised-cards/birthday/`, `/uk/personalised-cards/photo-upload/`, `/uk/personalised-cards/christmas/`, `/uk/personalised-cards/new-baby/`, `/uk/personalised-cards/anniversary/`, `/uk/personalised-cards/thank-you/`, `/uk/personalised-cards/diwali/`; hediye tarafı `/uk/gifts/birthday/`, `/uk/gifts/beauty/all/`, `/uk/gifts/experience-gifts/`, `/uk/gifts/balloons/all/`, `/uk/gifts/alcohol/all/`, `/uk/gifts/korres/` (marka), `/uk/gifts/offers/`, `/uk/gifts/all/` — [moonpig.com/uk](https://www.moonpig.com/uk/).
Etsy `/gifts` hub kartları: Gifts for Her, Gifts for Him, Gifts for Kids, Gifts for Couples, Gifts for Teachers, Gifts for Friends, Gifts for Pets, Personalized Gifts, Last Minute Gifts, Mother's Day Gifts, Father's Day Gifts — [etsy.com/gifts](https://www.etsy.com/gifts).

### Inferences
- **Menü ≈ 5–12 kök**; sitemap koleksiyon sayısı menünün 5–20 katı. Büyük oyuncular "kategori" yerine "koleksiyon" kavramını kullanıp kampanya/mevsim başına koleksiyon açıyor ama yalnızca azını menüye koyuyor.
- "By Price" ekseni ABD/İngiltere'de standart (Vosges, Sugarfina, See's, Godiva, Milk Bar, Choc on Choc). Beyza Blanc için de fiyat aralığı (ör. "1.000 TL altı" yerine ürün segmenti) bir koleksiyon ailesi olarak düşünülebilir.
- Sitemap'te test/`trash` koleksiyonlarının olması, kategori sayısını "yönetilebilirlik" açısından uyarıcı: kayıt disiplini olmadan koleksiyon envanteri hızla kirlenir (Godiva'da 7 `test*`, Choc on Choc'ta `trash`).

### Gaps
- Birinci/ikinci seviye tam listeyi **görsel menü sırasıyla** yalnızca Choc on Choc ve Vosges için çıkarabildim; Sugarfina/Moonpig/Fortnum için metin bazlı çıkarım yaptım; mobil (hamburger) menü listeleri JS ile yüklendiği için doğrulanamadı.
- Etsy'nin `/gifts` hub'ının ötesindeki tam kategori taksonomisi (ör. `/c/…` yapıları) SPA/filtre tabanlı olduğu için tam çıkarılamadı.

---

## KQ3 — İsimlendirme kalıpları ("Shop by Occasion" mı "Gifts for…" mi, "By Price" mı "Collections" mı; emoji/kısa etiket)

### Takeaway
İki egemen kalıp var: **hub/toplayıcı başlıklar** ("Shop by…", "Gifts by Occasion", "By Price", "Collections") ve **alıcıya yönelik "Gifts for X" etiketleri**. Çikolata/hediyede "Gifts for…" ve "Shop by Occasion" yan yana kullanılıyor; "Collections" daha çok kendi markalı/curated setler ve lisans/koleksiyon ürünleri için ayrılmış. Emoji hiçbir markanın ana menüsünde görülmedi (yalnızca Instagram/banner'da).

### Cited Findings
- Hub başlıkları: Choc on Choc "Shop All", "Shop All By Occasion", "Celebrations & Occasions"; Vosges "BY CATEGORY / BY TYPE / GIFTS / BY PRICE / WEDDINGS & EVENTS / CORPORATE GIFTING"; Sugarfina "Gifts by Occasion / By Recipient / By Price"; See's "Gift Type / Gifts by Price"; Not On The High Street "shop-by-occasion", "shop-by-category", "department"; Fortnum "Gifts & Occasions", "Gifting Ideas" — kaynaklar KQ2 ile aynı.
- "Gifts for X" kalıbı: Moonpig "Birthday gifts", Etsy "Gifts for Her/Him/Kids/Couples/Teachers/Friends/Pets", Choc on Choc "Gifts For Her/Him/Kids/Adults/Teachers", Sugarfina "Gifts for Him/Her/Kids", Fortnum facet'i "For Her/For Him/For a Couple/For a Child" — [etsy.com/gifts](https://www.etsy.com/gifts), [choconchoc.co.uk](https://choconchoc.co.uk/), [sugarfina.com](https://www.sugarfina.com/gift-shop), [fortnumandmason.com](https://www.fortnumandmason.com/gifts-occasions).
- "Collections" etiketi: Sugarfina "Collections" (Advent Calendars, Holiday, Hanukkah, Peanuts® x Sugarfina, Parisian Chocolates), Compartés koleksiyon adları ("Custom Atelier" hariç), Vosges "Gift Collections", Moonpig "collections"/"Shop The Collection" (ör. Focker In-Law collection) — [sugarfina.com](https://www.sugarfina.com/gift-shop), [moonpig.com/uk](https://www.moonpig.com/uk/).
- Kısa/başlık etiketleri: Vosges ve Milk Bar menüde çoğunlukla 1–3 kelime; Fortnum kök nav'da tek kelime ("Hampers", "Gifts", "Christmas"). Ürün-ailesi adları bazen doğrudan etiket: Choc on Choc "Chocolate Cards", "Candy Floss", "Chocolate Biscuits".
- "Gift Finder"/"Quiz" gibi karar yardımcıları: Choc on Choc'ta "Gift Finder Quiz" menü öğesi; Harry & David'de ana sayfa "Please choose a recipient / occasion / budget" formu — [choconchoc.co.uk](https://choconchoc.co.uk/), [harryanddavid.com](https://www.harryanddavid.com/).
- Emoji/kısa etiket: ana menülerde emoji yok; kısa etiket (tek kelime) ve "+ More Ways to Shop" gibi katlanır başlıklar baskın. (Gözlem: bu sitelerin ana nav HTML'inde emoji karakteri görülmedi.)

### Inferences
- Sektörde "Shop by Occasion" (İngiliz) ve "Gifts by Occasion" (ABD) eşdeğer; Türkçe karşılığı olarak "Özel Güne Göre" / "Hediyeler" ikilisi doğal bir eşlemedir.
- "By Price" etiketi yerine parantezsiz sayı etiketi de kullanılıyor (Choc on Choc `/gifts-under-20`); menü etiketi "Gifts Under £20" gibi sayı içermesi tıklanabilirliği artırıyor olabilir (kanıt: davranış testi yok, çıkarım).

### Gaps
- Emoji kullanımının dönüşüme etkisine dair veri yok; zaten ana nav'da emoji kullanan bir örnek bulunamadı.
- Etiket uzunluğunun (1 vs 3 kelime) A/B sonucuna dair kamuya açık marka verisi yok.

---

## KQ4 — URL kalıpları ve SEO

### Takeaway
Üç URL ailesi baskın: **Shopify `/collections/{slug}`**, **path tabanlı taksonomi `/gifts/shop-by-occasion/…`, `/christmas/christmas-gifts/gifts-for-…`, `/department/…`** ve **platform-bağımsız düz slug** (Fortnum `/gifts-occasions/gifting-ideas/personalised-gifts`). Slug'lar tamamen anahtar-kelime odaklı ve İngilizce; sayı/mevsim/yıl içeren koleksiyon slug'ları SEO'da uzun kuyruk yakalıyor.

### Cited Findings
- **Shopify `/collections/{occasion}`:** Compartés `/collections/birthday-chocolate`, `/collections/anniversary-gifts`, `/collections/thank-you-gifts`; Choc on Choc `/collections/birthdays`, `/collections/wedding-engagement-chocolate-gifts`, `/collections/new-home-chocolate-gifts`, `/collections/graduation-exam-results-chocolate-gifts`; Godiva `/collections/birthday-gifts`, `/collections/holiday-gifts`; Milk Bar `/collections/special-occasions-anniversary`; Vosges `/collections/valentines-day-gifts` — sitemap kaynakları (KQ2).
- **Fiyat taşıyan slug:** `/collections/gifts-under-10/-15/-20/-5-00` (Choc on Choc), `/collections/gifts-under-25/30/50/60/100` (Godiva), `/collections/gifts-25-75`, `/collections/gifts-over-100` (Vosges) — sitemap kaynakları.
- **Alıcı taşıyan slug:** `/collections/chocolate-gifts-for-her`, `/collections/chocolate-gifts-for-mum`, `/collections/gifts-for-your-sister`, `/collections/chocolate-gifts-for-your-teacher` (Choc on Choc); `/collections/purple-box-favorites`, `/collections/gift-for-him`, `/collections/gift-for-her` (Vosges) — [choconchoc.co.uk](https://choconchoc.co.uk/sitemap.xml), [vosgeschocolate.com](https://www.vosgeschocolate.com/sitemap.xml).
- **Path-tabanlı (NOTHS):** `/gifts/shop-by-occasion/…`, `/gifts/shop-by-category/…`, `/christmas/christmas-gifts/gifts-for-…`, `/themes/gifts/…`, `/department/gifts`, `/sale/gifts-sale/…` — [notonthehighstreet.com](https://www.notonthehighstreet.com/) HTML. Fortnum: `/gifts-occasions`, `/gifts-occasions/gifting-ideas/personalised-gifts`, `/seasonal-events/christmas/advent-calendars` — [fortnumandmason.com](https://www.fortnumandmason.com/gifts-occasions).
- **Sugarfina (Magento) yarı-yapısal slug'lar:** `/gift-shop`, `/gift-shop/occasion/birthday-gifts`, `/gift-shop/recipient/gifts-for-him`, `/gift-shop/gifts-under-35`, `/candy/all-candy/new-arrivals`, `/candy/collection/cocktail-candy`, `/design-your-own-bento`, `/corporate-gifting` — [sugarfina.com](https://www.sugarfina.com/gift-shop).
- **See's:** `/christmas/stocking-stuffers`, `/christmas/gifts-under-20`, `/christmas/gifts-that-wow`, `/chocolate-and-candy`, `/build-a-box`, `/limited-time-sweets`.
- **Moonpig:** `/uk/gifts/birthday/`, `/uk/personalised-cards/birthday/` — kart/gift ayrımı URL'de de var — [moonpig.com/uk](https://www.moonpig.com/uk/).
- **Prezzybox:** `/gift-occasions/anniversary-gifts/11th-anniversary-gifts.aspx`, `/gift-occasions/christening-gifts/personalised-christening-gifts.aspx`, `/gift-occasions/graduation-gifts.aspx` — taksonomi klasör = kategori, `.aspx` dosya adı = alt kategori.
- **Gift guide sayfaları ayrı path:** Compartés `/pages/…` ve `/collections/…`; Vosges `/collections/{x}-gift-guide` (bkz. KQ8).

### Inferences
- SEO açısından en verimli kalıp, kategori slug'ına **hem niyet hem alıcı/özel gün anahtar kelimesini** koymak (`birthday-chocolate`, `wedding-engagement-chocolate-gifts`, `chocolate-gifts-for-mum`). Slug'a sayı (under-25) koymak yüksek niyetli uzun kuyruk trafiği yakalar.
- Beyza Blanc için öneri kalıp: `/koleksiyon/{ozel-gun}` yerine daha SEO-dostu İngilizce veya TR slug kararı; global hedefleme varsa İngilizce slug + hreflang, TR/KKTC hedefinde TR slug (ör. `/koleksiyonlar/dogum-gunu`). (Bu, kanıtlanmış bir kalıptan türetilmiş uygulama önerisidir, kaynak değil çıkarım.)

### Gaps
- Her kalıbın **organik trafik getirisini** karşılaştıran veri yok; sitemap'te olmak indexlenmek anlamına gelir, tıklama değil.
- Canonical/hreflang stratejileri (özellikle aynı ürünün çok koleksiyonda görünmesinin yarattığı duplicate riski) doğrulanamadı.

---

## KQ5 — Mega menü tasarımı (kolon sayısı, görsel kullanımı, öge sayısı, açılma davranışı)

### Takeaway
Mega menüler **4–8 kolon** arasında; kolonlar eksen başlıklarıyla ("BY CATEGORY", "By Price") etiketleniyor; görsel/ürün kutucukları yalnızca bazı kolonlarda (Sugarfina corporate kolonu, Not On The High Street banner'ları) kullanılıyor. Hover tabanlı açılma egemen (ABD sitelerinin %88'i); Baymard hover gecikmesini şart koşuyor.

### Cited Findings
- **Choc on Choc:** `<nav>` bloğunda 6 `<ul>`, 37 `<li>`, 4 `menu-column` sınıfı → yaklaşık **4–6 kolonlu mega menü**, metin linkleri ağırlıklı, görsel yok (`<img>` sayısı 0). Kolon içerikleri: Bestsellers/Shop All; alıcılar (5); özel günler (8); tema/hobi (6); ürün tipleri — [choconchoc.co.uk](https://choconchoc.co.uk/) HTML.
- **Vosges:** 11 `<ul>`, 60 `<li>`, 10 `<button>` → **çok kolonlu** mega menü, **büyük harfli eksen başlıkları** (BY CATEGORY / BY TYPE / GIFTS / BY PRICE / WEDDINGS & EVENTS / CORPORATE GIFTING / THE CHOCOLATE EXPERIENCE), görsel yok (`<img>`=0) — [vosgeschocolate.com](https://www.vosgeschocolate.com/) HTML.
- **Sugarfina:** Kök 7 madde (New Arrivals, Shop Candy, Shop Gifts, Customize, Corporate Gifting, Instant Gifts, Rewards, Find a Store). "Corporate Gifting" menüsü **görsel mega-sütun** kullanıyor: 4 görsel kutucuk (Custom, Ready to Ship, Wedding Favors, Custom Celebrations, Corporate Gifting) ve alt başlıklar — [sugarfina.com](https://www.sugarfina.com/gift-shop).
- **Not On The High Street:** 11 kök öğe; `/department/…` ve `/christmas/…` gibi **kategori kökü tek kelime**, alt kolonlarda "For Her / For Him / For Baby" düzenekleri; nav HTML'inde banner görselleri var — [notonthehighstreet.com](https://www.notonthehighstreet.com/) HTML.
- **Fortnum & Mason:** 10 kök öğe; kategori sayfası facet'leri **"Show All Filters" + 10 filtre grubu** ile tek büyük panel oluşturuyor — [fortnumandmason.com](https://www.fortnumandmason.com/gifts-occasions).
- **Baymard (2025/2026 benchmark):** ABD'deki üst e-ticaret sitelerinin **%88'i mega menü** kullanıyor; 180+ ABD/AB sitesinin **%58'i masaüstü, %67'si mobil** ana sayfa+kategori navigasyonunda "orta/kötü". **%61'inde hover gecikmesi yok** (en yaygın kusur); **%60'ı kategori/alt kategorileri sindirilebilir parçalara bölmüyor**; **%76'sı ara kategori sayfalarında alt kategorileri ana içerik olarak sunmuyor**; **%13'ü ara kategori sayfası sunmuyor**; kategoriler ~**10 öğeyi** geçince alt bölümlere ayırma öneriliyor; **hover gecikmesi 300–500 ms** öneriliyor — [Baymard](https://baymard.com/blog/ecommerce-ux-best-practices), [Baymard](https://baymard.com/research-articles/ecommerce-navigation-best-practice), [Baymard örnek galerisi](https://baymard.com/ecommerce-design-examples/27-drop-down-menu).

### Inferences
- 4–8 kolon, ~10–60 link: Choc on Choc 4 kolon/37 link, Vosges ~8 kolon/60 link. Butik ölçekte üst sınır **3–4 kolon / 12–20 link** makul görünüyor (Choc on Choc'un "Gift Finder Quiz" ve "Bestsellers" gibi karar yardımcıları menüde üst sırada).
- Görsel ağırlıklı mega menü yalnızca yüksek bütçeli/çok kategorili oyuncularda (Sugarfina, NOTHS); saf çikolata markaları metin-ağırlıklı menü kullanıyor. Beyza Blanc için görsel bütçesi kısıtlıyken metin-ağırlıklı 3 kolon mantıklı.

### Gaps
- Hiçbir sitede **mega menünün kolon sayısı** ölçülmüş durumda değil (HTML'deki sınıf sayıları kullanıldı; JS ile eklenen kolonlar görülemeyebilir).
- Açılma davranışı (hover vs click, gecikme değeri) JS/CSS içinde; doğrulamak için tarayıcı testi gerekirken yapılamadı.

---

## KQ6 — Kategori sayfası şablonu (ürün sayısı, filtre sayısı, sıralama, açıklama, alt kategori çipleri, "tümünü gör")

### Takeaway
Olgun kategori sayfaları ürün ızgarası + sol/üst filtre rayı + sıralama + sayfalama şablonunu kullanıyor. Fortnum & Mason en zengin örneği veriyor: **10 filtre grubu, 48 ürün/sayfa, 21 sayfa, sort seçici ve "Show All Filters"**. Ürün sayısı büyük sitede binlerle ölçülüyor (NOTHS occasion hub 8.839 ürün; Fortnum 1.873 ürün).

### Cited Findings
- **Fortnum & Mason `/gifts-occasions`:** "Showing 48 (1873)", "Items per page: 48 100", "Sort By:", filtre grupları: **Price** (<£10, £10–25, £25–75, £75–150, £150–300, £300>), **Colour**, **Delivery**, **Brand**, **Format**, **Size**, **Dietary**, **Product Type**, **Country**, **flavour** + "Show All Filters" / "Clear All" / sayfalama (1…21) — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions). Kategori sayfasında üstte bir **kategori açıklama metni** var: "From joy-giving hampers to personalised presents, let your loved ones know you're..." ("Read More" ile katlanıyor).
- **Not On The High Street `/gifts/shop-by-occasion`:** Başlık "Gifts by occasion", **8.839 products** sayısı; ürün kartlarında fiyat, puan (ör. "Rated 4.8"), **tahmini teslim** ("Estimated delivery Wed 11th · FREE") ve indirim yüzdesi — [notonthehighstreet.com/gifts/shop-by-occasion](https://www.notonthehighstreet.com/gifts/shop-by-occasion).
- **See's `/gifts`:** "Showing 205 Product Results" — [sees.com/gifts](https://www.sees.com/gifts).
- **Baymard kategori/navigasyon kuralları:** kategoriler/alt kategoriler **~10 öğeyi geçince böl**, en derin seviyede **en az ~10 ürün** hedefle; **aşırı kategorizasyon (overcategorization) terk oranını artırır ve sitelerin %75'i bunu yanlış yapıyor**; site içi arama **%60 geride kalan kategori bulma sonrası yedek arama** rolünde; "Sales/Deals" filtre tabanlı kategori sun (sitelerin %32'si yapmıyor); mobilde her seviyede **"View All"** seçeneği (sitelerin yalnızca %24'ü doğru yapıyor) — [Baymard](https://baymard.com/blog/ecommerce-ux-best-practices), [Baymard](https://baymard.com/research-articles/ecommerce-navigation-best-practice).
- **Kategori açıklaması örneği (Fortnum):** kategori üstünde kısa tanıtım + "Read More" — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions). Sugarfina'da hub sayfası yerine 404 görülse de menü her yerde aynı (mega menü global sabit); bu, kategori açıklamasının marka standardı olmadığını gösterir.

### Inferences
- Şablon parametreleri: **ürün/sayfa 24–48**, **filtre grubu 5–10**, **sıralama: Featured/Bestselling/Price asc-desc**, **kategori açıklaması opsiyonel ama SEO için değerli** (Fortnum "Read More" ile katlıyor), **alt kategori çipleri/chip navigasyonu** büyük oyuncularda menü ile aynı işlevi görüyor.
- Butik ölçekte (10–60 ürün) fiyat facet'i tek başına yeter; Fortnum'ın "Country/flavour/Size" gibi facet'leri butik için gereksiz karmaşıklık (Baymard'ın overcategorization uyarısıyla örtüşür — çıkarım).

### Gaps
- Hiçbir sitede kategori sayfasında **"tümünü gör / view all"** davranışı ve alt-kategori çip navigasyonu birebir HTML'den doğrulanamadı (JS).
- Filtrelerin kaç tanesinin gerçekten kullanıldığı (analytics) ve hangi sıralama seçeneklerinin sunulduğu tüm siteler için teyit edilemedi.

---

## KQ7 — Cross-linking: aynı ürün kaç kategoriye bağlanıyor, "ilgili kategoriler" blokları

### Takeaway
Aynı ürünün çok kategoriye bağlanması bu sektörde **kural, istisna değil** (bir çikolata kutusu hem "Birthday" hem "Gifts Under $50" hem "Corporate" hem "Dark Chocolate"da olabilir). Koleksiyonlar "manuel" olarak çapraz etiketleniyor; "Also of Interest" / "Related" blokları ile kategori sayfaları birbirine bağlanıyor.

### Cited Findings
- **Aynı ürünün farklı eksen koleksiyonlarında görünmesi:** Godiva ve Compartés sitemap'inde aynı tema (ör. gift box) birden çok koleksiyonda yeniden listelenmiş; St. Regis/Vosges gibi ortak marka koleksiyonları `an-exclusive-indulgence-for-st-regis-guests`, `meta-x-vosges` gibi birden çok etiket taşıyor — [vosgeschocolate.com](https://www.vosgeschocolate.com/sitemap.xml).
- **"Also of Interest" bloğu (kategori sayfası içinde):** Sugarfina ana sayfa/404 şablonunda kategori altında "Also of Interest" ile ilgili koleksiyonlara link veriyor: "Best Candy Gifts for Candy Lovers", "Global Gourmet Candy Collection", "All Treats, No Tricks" — [sugarfina.com](https://www.sugarfina.com/).
- **Cross-sell / öneri koleksiyonları (mekanik kanıt):** Milk Bar sitemap'inde `a-b-cart-product-suggestions`, `cart-product-suggestions`, `cake-upsells-collection`, `priority-cart-upsells`, `product-recommendations-exclusions` gibi **sepet/öneri motoru koleksiyonları** var — bu, kategori mimarisinin ürün öneri motoruyla entegre edildiğini gösteriyor — [milkbarstore.com](https://milkbarstore.com/sitemap.xml).
- **Filtre tabanlı çaprazlama:** Fortnum facet'lerinde aynı ürünün "Occasion", "Recipient", "Product Type", "Dietary" gruplarında birlikte yer alması, ürünün tek bir kategoriye değil bir facet vektörüne bağlandığını gösteriyor — [fortnumandmason.com/gifts-occasions](https://www.fortnumandmason.com/gifts-occasions).
- **"by-occasion" hub'ları kategori gibi çalışıyor:** NOTHS `/gifts/shop-by-occasion` ve `/christmas/christmas-gifts/gifts-for-her` gibi birden çok kesişim URL'si aynı ürün havuzuna farklı kesitler sunuyor — [notonthehighstreet.com](https://www.notonthehighstreet.com/).

### Inferences
- Kategori mimarisi aslında bir **matris**: ürün × (özel gün + alıcı + fiyat + mevsim + diyet). Bu yüzden kategori sayısı şişebiliyor ama gerçek ürün sayısı sınırlı. Beyza Blanc için de aynı ürünü 3–5 etiketle çapraz bağlamak beklenen davranış.
- Öneri motoru koleksiyonlarının (Milk Bar kanıtı) varlığı, cross-linklemenin sadece navigasyon değil **AOV (ortalama sepet) aracı** olduğunu düşündürüyor (çıkarım).

### Gaps
- "Aynı ürün ortalama kaç kategoriye bağlı?" sorusuna **sayısal yanıt yok**; ürün-üye listelerini API'siz çekmek (her ürünün `collections` alanı) tek tek kurulmalı.
- "Related products/kategoriler" bloklarının hangi eşikte ve hangi algoritmayla gösterildiği kamuya açık değil.

---

## KQ8 — Curated içerik: "gift guide" / "hediye fikri" sayfaları kategori olarak mı çalışıyor?

### Takeaway
Evet — "gift guide" sayfaları fiilen kategori gibi çalışıyor ve iki kalıpla kuruluyor: **koleksiyon olarak** (`/collections/{x}-gift-guide`, kolay indexlenir, ürün listesi döner) veya **page/içerik olarak** (`/pages/{gift-guide}`, editoryal + link). Curated içerik hem SEO hem "hediye fikri arayan" trafiği yakalamak için birincil araç.

### Cited Findings
- **Koleksiyon tabanlı gift guide (Vosges):** `/collections/bon-vivant-gift-guide`, `/collections/cacao-wellness-gift-guide`, `/collections/cancer-gift-guide`, `/collections/for-every-kind-of-mom-gift-guide`, `/collections/gluten-free-gift-guide`, `/collections/the-vosgiens-gift-guide`, `/collections/holiday-gift-guide` — [vosgeschocolate.com](https://www.vosgeschocolate.com/sitemap.xml).
- **Page tabanlı gift guide (Compartés):** `/pages/custom-chocolate-gifts` ve gift-guide landing'leri (önceki raporda ve sitemap'te `content.xml`/`static.xml` içinde) — [compartes.com](https://compartes.com/sitemap.xml).
- **See's:** `/christmas/gifts-that-wow`, `/christmas/limited-time-sweets` gibi curated koleksiyonlar — [sees.com/gifts](https://www.sees.com/gifts). **Godiva:** `holiday-gift-guide`, `holiday-gifts-top-sellers`, `gift-sets`, `best-chocolate-gifts-for-chocolate-lovers` — [godiva.com](https://www.godiva.com/sitemap.xml). **Vosges:** `the-10-best-gifts-of-2025`, `the-hot-list`, `hall-of-fame`, `best-gifts-of-the-year` gibi "en iyi" listeleri (editoryal/curated).
- **"Instant Gifts" (acil hediye) curated kolu:** Sugarfina `/instantgifts`; Vosges "Instant Gifting" → `https://gifts.zest.co/vosges` **üçüncü taraf** kurumsal hediye platformu; Vosges `gotogifts.vosgeschocolate.com` ve `gifts.zest.co/vosges` bağlantıları — [sugarfina.com](https://www.sugarfina.com/instantgifts), [vosgeschocolate.com](https://www.vosgeschocolate.com/) nav HTML.
- **Occasion hub = curated sayfa:** Moonpig `/uk/gifts/offers/`, NOTHS `/themes/gifts/…` ("Roam", "first-day-of-school"), Etsy `/gifts` hub'ı editoryal metin + koleksiyon kartlarıyla çalışıyor — [moonpig.com/uk](https://www.moonpig.com/uk/), [notonthehighstreet.com](https://www.notonthehighstreet.com/), [etsy.com/gifts](https://www.etsy.com/gifts).
- **Marka/lisans curated koleksiyonları:** Baked by Melissa `flavor-collection-*`, `zodiac-collection`, `paw-patrol-cupcakes`; Compartés `olipop`, `white-lotus`, `little-debbie-chocolate-bars` — lisans/ortak marka koleksiyonları da bir "tema" ekseni.

### Inferences
- Curated gift guide, butik ölçekte **en düşük maliyetli SEO/keşif aracı**: 6–12 ürünü elle seçip "Anneye 5 çikolata fikri" gibi bir sayfa/koleksiyonla yayınlamak, yeni üretim gerektirmez. Vosges bu kalıbı düzinelerce kez tekrarlıyor.
- "Instant Gifting"in üçüncü taraf platforma (zest.co) devredilmesi (Vosges kanıtı), acil/kurumsal hediyenin ayrı bir ürün-dışı altyapı gerektirdiğini gösteriyor.

### Gaps
- Gift guide sayfalarının **trafik/dönüşüm getirisi** hiçbir kaynakta yok.
- Compartés'in `/pages/...` gift guide'larının tam listesi (content sitemap'i ayrı dosyada) çıkarılamadı.

---

## KQ9 — Kaç kategori "çok" sayılır? Büyük oyuncu vs butik eşiği ve yönetilebilirlik

### Takeaway
Büyük oyuncular sitemap düzeyinde **~80–180 koleksiyon** yönetiyor ama **menüde yalnızca 5–12 kök** gösteriyor; butikler için pratik eşik menüde **5–8 kök, toplam 20–40 koleksiyon**. Baymard'ın ampirik eşiği: bir listede **~10 öğeyi geçince böl**, aşırı kategorizasyon terk oranını artırır.

### Cited Findings
- **Sitemap koleksiyon sayıları (9 Kas 2026):** Vosges ~180, Milk Bar ~140, Godiva ~105, Compartés ~80, Baked by Melissa ~78, Choc on Choc ~68 (sayımlar sitemap XML'inden; kirli/test kayıtları dahil). **Menü kök sayıları:** Fortnum 10, NOTHS 11, Moonpig ~13, Sugarfina 8, Choc on Choc ~4 kolon içinde 37 link, Vosges ~8 kolon/60 link — kaynaklar KQ2/KQ5.
- **Baymard eşikleri:** "Divide categories and subcategories into manageable chunks… **Subdivide when you reach approximately 10 categories**, and aim for at least 10 products in categories at the deepest level." Ayrıca "**Overcategorization of the Product Catalog Can Lead to Abandonment (Yet 75% Get It Wrong)**" — [Baymard](https://baymard.com/blog/ecommerce-ux-best-practices), [Baymard](https://baymard.com/research-articles/collections/homepage-and-category).
- **Menü üst sınırı:** "eCommerce navigation menu yapısı… **8 top-level item'ı geçmemeli**" (2026 önerisi; Baymard 2019 çalışmasına dayanıyor) — [DesignStudioUIUX (Baymard 2024 Product Finding Study'ye dayanarak)](https://www.designstudiouiux.com/blog/ecommerce-navigation-best-practices).
- **Ürün yoğunluğu gereğini gösteren rakamlar:** NOTHS occasion hub'ı 8.839 ürün; Fortnum "Gifts & Occasions" 1.873 ürün (48/sayfa, 21 sayfa); See's gifts 205 ürün. Yani büyük oyuncuların "kategori başına >10 ürün" kuralını karşılaması ürün hacmiyle mümkün — [notonthehighstreet.com](https://www.notonthehighstreet.com/gifts/shop-by-occasion), [fortnumandmason.com](https://www.fortnumandmason.com/gifts-occasions), [sees.com/gifts](https://www.sees.com/gifts).
- **Baymard üst sınır/eşik bulgusu:** 180+ ABD/AB sitesinin %58'i masaüstü kategori navigasyonunda "orta/kötü"; kategorileri parçalara ayırmama oranı %60 → eşik ihlalinin yaygınlığı — [Baymard](https://baymard.com/research-articles/ecommerce-navigation-best-practice).

### Inferences
- Büyük oyuncu içeriği **geniş** (100+ koleksiyon) çünkü ürün hacmi bunu kaldırıyor; butik için aynı taksonomi ölü kategori yaratır (her kategoride 1–2 ürün → Baymard'a göre hayal kırıklığı). Bu nedenle **butik = az kategori, çok etiket/facet**.
- Beyza Blanc için pragmatik hedef: **5–7 kök kategori** (özel gün, kime, ürün tipi/kişiye özel, fiyat/segment, kurumsal, yeni-popüler, mevsim) ve altında 20–40 koleksiyon; her koleksiyonda min 3–6 ürün hedefi. (Kanıtlı eşiklerden türetilmiş öneri, marka verisi değil.)

### Gaps
- Butik ölçekli (10–60 SKU) bir özel-gün markasının **gerçek kategori sayısına** dair bir benchmark/vaka bulunamadı; KQ9'daki butik eşiği büyük-oyuncu verisinden türetilmiştir.
- "Doğru" kategori sayısının dönüşüme etkisini ölçen kamuya açık bir A/B sonucu yok.

---

## Kesişen notlar ve veri uyarıları

- **Platform ayrımı taksonomiyi şekillendiriyor.** Shopify siteleri (Compartés, Choc on Choc, Milk Bar, Baked by Melissa, Vosges, Godiva) `/collections/{slug}` kullanıp koleksiyonu "kategori" gibi konumlandırıyor; Magento (Sugarfina, Fortnum) daha derin, path-tabanlı ve facet-yoğun taksonomi kuruyor; custom ASP.NET (Prezzybox) `.aspx` + klasör taksonomisi kullanıyor.
- **Kart vs hediye ayrımı:** Moonpig'de "personalised cards" ve "gifts" iki ayrı kategori ağacı; özel-gün sitesi kurarken kart/hediye ikiliğinin ayrı eksen olması yaygın bir pattern.
- **Sitemap, menüden çok daha geniş:** kategori sayısını "menüde kaç link var" ile ölçmek yanıltıcı; gerçek envanter sitemap koleksiyon dosyalarında. Bu yüzden bu notta iki katman ayrıştırıldı.
- **Gözlem anında kapanan/erişilemeyen sayfalar:** Sugarfina'da `sugarfina.com/collections` 404 döndü (Magento'da koleksiyon kavramı farklı); Prezzybox ana sayfası curl'de 403 ama 404 sayfası megamenüyü içeriyor; `harryanddavid.com/gifts-by-occasion` ve `prezzybox.com/occasions` (uzantısız) 404.
- **Önceki raporla tutarlılık:** Önceki rapor (`D:\PROJECTS\beyza\reports\Özel gün çikolata hediye sitesi modelleri.md`) da "özel gün + kime + ürün/koleksiyon" üçlüsünü ve Sugarfina/Vosges'in "fiyat" eksenini işaret ediyordu — bu notta bu eksenler birebir menü HTML'i ve sitemap ile doğrulandı.
