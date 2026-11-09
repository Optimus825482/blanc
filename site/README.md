# Beyza Blanc — web sitesi

Statik vitrin + **tasarım stüdyosu**. Sitede online satış ve ödeme yoktur: müşteri hazır
tasarımlara bakar ya da stüdyoda kendi tasarımını oluşturur, ardından tasarımın görselini ve
özetini WhatsApp’tan gönderip **fiyat teklifi** ister.

Sunucu, veritabanı, ödeme altyapısı gerekmez. Tüm dosyalar tarayıcıda çalışır.

---

## 1. Nasıl çalıştırılır

**Bilgisayarda denemek için:** `index.html` dosyasına çift tıkla. (Tasarım stüdyosu dahil her şey
çalışır; dosya yükleme de tarayıcıda kalır.)

**Telefondan test etmek için** aynı ağdaki bir bilgisayarda şu komutu çalıştırıp telefondan
`http://BILGISAYAR-IP:8765` adresini aç:

```bash
cd site
python -m http.server 8765
```

## 2. Yayına alma (hosting)

| Yöntem | Nasıl |
|---|---|
| **Netlify Drop** (en hızlı) | app.netlify.com/drop adresine `site` klasörünü sürükle-bırak. Alt alan adı anında verilir, kendi alan adını bağlayabilirsin. |
| **Vercel** | `npx vercel` — klasörü yayınlar. |
| **Cloudflare Pages** | Klasörü yükle ya da Git deposuna bağla. |
| **GitHub Pages** | Dosyaları bir depoya koy, Settings → Pages → Branch: main. |
| **Mevcut hosting / cPanel** | `site` klasörünün *içindeki* dosyaları `public_html` içine at. |

Kurulum adımı, derleme (build) veya npm gerekmez.

## 3. Yayına almadan önce doldurulacak bilgiler

Hepsi tek dosyada: **`assets/js/config.js`**

| Alan | Ne yazılacak |
|---|---|
| `whatsapp` | **Zorunlu.** Ülke kodlu, boşluksuz, `+` işareti olmadan. KKTC hattı 0533 123 45 67 ise → `905331234567` |
| `whatsappGorunum` | Sitede yazı olarak görünecek numara: `+90 533 123 45 67` |
| `eposta` | Bilgi e-postan |
| `adres`, `adresDetay` | Mağaza adresi (şu an Alsancak/Girne yazılı) |
| `instagram`, `facebook` | Hesap adresleri |
| `googleMaps` | Mağaza konum linki |
| `calismaSaatleri` | Gün ve saat listesi |

> Numara örnek değerde (`905000000000`) kaldığı sürece tarayıcı konsoluna uyarı düşer ve WhatsApp
> bağlantıları yanlış numaraya gider.

**Hızlı kontrol:** Yayına aldıktan sonra sitede herhangi bir “WhatsApp’tan fiyat iste” butonuna bas
— WhatsApp açılıp mesaj hazır geliyorsa numara doğru.

## 4. Ürün görsellerini değiştirme

`assets/img/` içindeki dosyalar **yer tutucu vektör illüstrasyonlardır**, gerçek ürün fotoğrafı
değildir. Kendi fotoğraflarını koymak için:

1. Fotoğrafları `assets/img/` içine at (örn. `altin-isilti-1.jpg`).
2. `assets/js/data.js` içinde ilgili tasarımın `gorsel` alanını yeni dosyaya çevir:
   ```js
   gorsel: 'assets/img/altin-isilti-1.jpg',
   ```
3. Önerilen ölçü: **1200×1200 piksel (1:1 kare)**, beyaz/krem zemin, ürün ortada. Kartlar kare
   çerçeve kullanır (sektör standardı); yatay fotoğraf yüklersen kenarlardan kırpılır.

İstersen dosyayı `urun-madlen.svg` ile aynı adla kaydedip `assets/img/urun-madlen.svg` dosyasını
silmek de yeterli; kod değişikliği gerekmez.

## 5. İçerik ekleme ve düzenleme

Her şey `assets/js/data.js` içinde:

- **Özel gün kategorisi ekle:** `temalar` listesine yeni kayıt ekle (`id`, `ad`, `kisa`,
  `aciklama`, `ikon`, `vurgu`, `oneri`). Menü, ana sayfa ve filtreler otomatik güncellenir.
- **Hazır tasarım ekle:** `tasarimlar` listesine kayıt ekle ve `tema` alanını yukarıdaki
  kategorilerden birinin `id`'siyle eşleştir.
- **Stüdyo seçenekleri:** `studyo` altında ürün tipleri, çikolata tipleri, ambalaj renkleri,
  kurdeleler, kartlar, yazı tipleri, adetler ve ekstralar.
- **S.S.S.:** `sss` listesi.
- **Kurumsal sayfası:** `kurumsal` bölümü.
- **Anlatı metinleri:** `hakkimizda.html` içindeki hikâye paragraflarını kendi cümlelerinle
  değiştir (şu an genel bir taslak).

### Fiyat göstermek istersen

Sitede fiyat yayınlanmıyor. Başlangıç fiyatı göstermek istersen:
`config.js` → `fiyatGoster: true`, sonra `data.js` içindeki tasarımlara `baslangicFiyat: '1.250 TL'`
gibi alanlar ekle ve kart şablonunu (`main.js` → `tasarimKartiHTML`) bu alanı gösterecek şekilde
güncelle.

## 6. Tasarım stüdyosu nasıl çalışıyor

- Tüm çizim **HTML canvas** üzerinde tarayıcıda yapılır; sunucuya hiçbir veri gitmez.
- Yüklenen fotoğraf `FileReader` ile yalnızca belleğe okunur, cihazdan çıkmaz.
- “WhatsApp’tan fiyat iste” iki durumda farklı davranır:
  - **Telefon (destekleyen tarayıcı):** Tasarımın PNG’si + özet metin paylaşım ekranına verilir;
    WhatsApp’ı seçtiğinde görsel ve metin birlikte gider.
  - **Masaüstü / desteklemeyen tarayıcı:** Görsel indirilir ve WhatsApp özet metinle açılır; görseli
    sohbete elle eklersin. Buton bu durumda “Görseli indir ve WhatsApp’ı aç” olarak görünür.
- WhatsApp bağlantıları `wa.me/<numara>?text=<kodlanmış mesaj>` biçimindedir; görsel bir linkin
  içine gömülemez, bu yüzden görsel paylaşımı/paylaşım ekranı yolu kullanılıyor.
- Her tasarımın bir kodu vardır (örn. `BB-MAD16-DOĞ`). WhatsApp mesajının başında bu kod gider;
  siparişi bu kodla takip edebilirsin.

## 7. Dosya yapısı

```
site/
├── index.html            Ana sayfa
├── koleksiyonlar.html    Özel günler + hazır tasarımlar (filtreli)
├── urun.html             Tasarım detayı (?tasarim=id)
├── studyo.html           Tasarım stüdyosu
├── kurumsal.html         Kurumsal hediyeler
├── hakkimizda.html       Hakkımızda
├── sss.html              Sıkça sorulan sorular
├── iletisim.html         İletişim ve adres
└── assets/
    ├── css/style.css     Tasarım sistemi (renk, tipografi, bileşenler)
    ├── js/config.js      Marka ve iletişim bilgileri  ← önce burayı doldur
    ├── js/data.js        Kategoriler, tasarımlar, stüdyo seçenekleri, metinler
    ├── js/main.js        Üst bar, alt bilgi, vitrin ve filtreler
    ├── js/studyo.js      Tasarım stüdyosu (canvas + WhatsApp aktarımı)
    └── img/*.svg         Yer tutucu ürün görselleri
```

## 8. Bilinen sınırlar

- Sitede **sepet, ödeme, sipariş kaydı yoktur** — bilinçli bir tercih. Talep toplama tamamen
  WhatsApp üzerinden.
- Üst bar ve alt bilgi JavaScript ile üretilir; bu yüzden eski/JS kapalı tarayıcılarda menü
  görünmez (içerik görünür).
- Tasarım önizlemesi bir **ön izleme**dir; üretimde el işçiliğiyle küçük farklar olabilir.
- Yazı tipleri Google Fonts’tan yüklenir; internet erişimi olmayan bir ortamda sistem yazı tipine
  düşer.
- Sitede yayınlanmış fiyat yoktur; stüdyo “tahmini fiyat” göstermez, kasıtlı olarak yalnızca teklif
  akışı vardır.

---

## İlgili dosyalar (bu klasörün dışında)

- Araştırma raporu: `../reports/Özel gün çikolata hediye sitesi modelleri.md`
- Araştırma notları: `../research_notes/Özel gün çikolata hediye sitesi modelleri/`
- Kategori analizi raporu: `../reports/Özel gün hediye siteleri kategori analizi.md`
- Kategori analizi notları: `../research_notes/Özel gün hediye siteleri kategori analizi/`

---

## 9. Araştırma bulgularıyla yapılan güncellemeler (9 Kasım 2026)

İkinci araştırma turunun (bkz. kategori analizi raporu) bulguları siteye uygulandı.

### Kategori mimarisi artık çok eksenli

Eskiden yalnızca "özel gün" ekseni vardı. Sektördeki kazanan model uygulandı:
**2–3 eksen menüde gezilebilir kategori, kalan eksenler filtre.**

| Eksen | Nerede | Nasıl düzenlenir |
|---|---|---|
| Özel gün (19 kategori) | Mega menü + filtre | `data.js` → `temalar` |
| Kime göre (8 kategori) | Mega menü + filtre | `data.js` → `kime` |
| Ürün tipi (4 tip) | Mega menü + filtre | `data.js` → `studyo.urunTipleri` |
| Hediye büyüklüğü (3 segment) | Yalnızca filtre | `data.js` → `segmentler` |

- Yeni açılan kategoriler: **Teşekkür & Tebrik, Geçmiş Olsun, Öğretmenler Günü, Açılış & Tören,
  Her Zaman & Sade**, ayrıca "Babaya Kutu" tasarımı.
- Her tasarım artık `kime: [...]` ve `segment` alanlarıyla etiketli — **aynı tasarım birden çok
  kategoride görünür** (matris modeli). Bu bilinçli: sektörde de kural bu.
- Özel günler `kok` alanıyla gruoplanıyor: `ozel-gun` / `mevsim` / `kurumsal`. Menü ve filtreler
  bu alandan otomatik üretilir; yeni kategori eklerken `kok` yazmayı unutma.

### Menü, filtre ve sıralama

- **Mega menü** (6 kök, `main.js` → `menuYapisi()`): Özel Güne Göre, Kime Göre, Ürün Tipi,
  Kurumsal & İş, Yeni & Çok Satan, Tasarım Stüdyosu. Hover'da **300 ms gecikmeyle** açılır,
  klavyede Enter ile çalışır, Escape ve dış tıklama kapatır. Mobilde akordeona dönüşür.
- **Koleksiyon sayfası:** 4 eksenli filtre rayı + sıralama (Öne çıkanlar / Çok satanlar /
  Yeni tasarımlar / A–Z) + "N tasarım" sayacı + kırıntı navigasyonu + kategori açıklaması.
- Filtre durumu **URL'ye yazılır**, paylaşılabilir:
  `koleksiyonlar.html?gun=soz-nisan&kime=es-sevgili&urun=tepsi&segment=buyuk&sirala=yeni`

### Stüdyo: üretim öncesi onay ekranı (yeni)

Araştırmanın en sık tekrarlanan UX şikâyeti "önizlediğimle gelen farklı" idi. Artık:

1. "Tasarımı onayla ve gönder" düğmesi bir **onay ekranı** açar (13 satırlık özet + tasarım görseli).
2. İsim/tarih/renk/teslim bilgilerinin birebir basılacağını onaylayan bir **kutu işaretlenmeden
   gönderilemez** (düğme kilitli).
3. "Geri dön ve düzenle" ile hiçbir şey kaybolmadan forma dönülür.

Ayrıca stüdyoya **teslim paneli** eklendi: alıcı adı, teslim şekli (Girne içi elden / KKTC kargo /
Türkiye kargo / mağazadan), hedef teslim günü ve teslim notu. Hepsi WhatsApp mesajına yazılıyor.

### Güven ve teslim iletişimi (yeni)

- Ana sayfada **"Neyi garanti ediyoruz?"** bloğu (`data.js` → `taahhutler`) ve
  **hazırlık süreleri** tablosu (`config.js` → `teslimBantlari`).
- Alt bilgide ve stüdyoda **son sipariş tarihi** notu (`config.js` → `sonSiparisNotu`).
- Mevsimsel duyuru şeridi hazır ama **kapalı**: `config.js` → `duyuruBandi.aktif = true` yapıp
  metni yazınca üstte yeşil bant olarak çıkar.

### Müşteri yorumları

`data.js` → `yorumlar` **bilerek boş bırakıldı** ve bölüm bu yüzden gizli. Uydurma yorum
yazılmadı. Gerçek yorumları eklediğiniz an ana sayfada "Sizden gelenler" bölümü kendiliğinden
görünür (örnek kayıt biçimi `data.js` içinde yorum olarak duruyor).

### Tasarım token'ları

| Öğe | Eski | Yeni | Gerekçe |
|---|---|---|---|
| Kart yarıçapı | 16px | **10px** | Sektör 0–10px |
| Gölge | `0 8px 24px` | **`0 4px 14px`** | Sektör minimal gölge kullanıyor |
| Ürün kartı oranı | 4:3 | **1:1** | Sektör 1:1 veya dikey 3:4 |
| Micro-type | seyrek | **`.mikro` + `.rozet` katmanı** | Sektörde 10–12px etiket katmanı standart |

### Değişmeyenler (bilinçli)

Fiyat yayınlanmıyor ve **sepet/ödeme yok** — model gereği. Ödeme güvenliği rozetleri, quick view,
"şu an X kişi bakıyor" tipi FOMO bildirimleri bilinçli olarak eklenmedi.

## Arama motorları için yayın hazırlığı

Ana sayfadaki işletme bilgisi, ürün açıklamaları ve görseller doğrudan HTML içinde yer alır. Tasarım detay sayfası örnek verileri bir sorgu parametresinden gösterdiği için arama dizini dışında tutulur.

Yayın alan adı belirlendiğinde, yayınlanacak site klasörünün kopyasında bu komutu çalıştırın:

```powershell
python tools/prepare_seo.py D:/yayin/site https://ornek.example
```

Komut her genel sayfaya kalıcı adres ekler, ana sayfanın paylaşım görseli ve işletme işaretlemesini yayın adresine bağlar, sitemap.xml ve robots.txt üretir. Alan adını gerçek HTTPS adresiyle değiştirin. Yayından sonra Google Search Console’da alan adını doğrulayın ve sitemap.xml dosyasını gönderin. İşletme profili için telefon, tam adres ve çalışma saatlerini doğrulanmış işletme bilgileriyle tamamlayın.
