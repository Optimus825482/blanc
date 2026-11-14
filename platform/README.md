# Beyza Blanc platformu

Next.js App Router ve PostgreSQL. Vitrin, koleksiyon detayları ve yönetim paneli bu klasörden çalışır. Orijinal HTML prototipi bir üst dizindeki site klasöründedir.

## Yerel çalışma

```powershell
npm ci
npm run db:seed
npm run dev -- --hostname localhost
```

- Vitrin: http://localhost:3000/
- Yönetim: http://localhost:3000/admin
- Yerel yönetim parolası .env.local dosyasındaki ADMIN_PASSWORD değeridir. Yeni bir kurulumda .env.example üzerinden .env.local oluşturun. ADMIN_PASSWORD için en az 16 karakter, SESSION_SECRET için en az 32 karakter kullanın.
- db:seed eksik tabloları ve başlangıç içeriğini ekler. Mevcut içerikleri yeniden yazmaz.
- Görseller 5 MB’a kadar JPEG, PNG ve WebP olarak yüklenebilir. Uygulama yüklemeleri yeniden kodlayıp PostgreSQL’de WebP olarak saklar. Veritabanı yedeği yüklenen görselleri de kapsar.
- Yayın kutusu işaretlenmeyen koleksiyonlar panelde taslak kalır. Panel ana sayfa, hakkımızda, kurumsal sayfa ve koleksiyon metinleri ile kapak görsellerini düzenler.

## Yayın ve arama görünürlüğü

Yayın ortamında SITE_URL için gerçek HTTPS adresini, PG değişkenleri için yayın veritabanını ve yönetim için yeni sırları tanımlayın. SITE_URL yerel geliştirmede boş kalır. Yayın ortamına geçerken veritabanını hazırlayın, npm run build çalıştırın ve npm start ile başlatın. Yönetim oturumu yayın ortamında HTTPS gerektirir.

Sitemap ve robots uçları /sitemap.xml ve /robots.txt adreslerindedir. Sitemap, yayındaki koleksiyonları veritabanından alır. Google Search Console’da alan adını doğrulayın, sitemap’i gönderin ve URL Denetimi ile ana sayfa ile koleksiyon rotalarını kontrol edin. İşletme profiline doğrulanmış adres, telefon ve saatler eklenebilir.

Instagram bölümü resmi @beyzablanc hesabından seçilmiş gönderilere ve DM kanalına bağlanır. Otomatik akış eşitlemesi ayrı bir Meta entegrasyonu gerektirir. /studyo mevcut tarayıcı tabanlı tasarım stüdyosunu açar. Önizleme ve PNG indirme çalışır, sipariş görüşmesi Instagram’da devam eder.

### Tasarım stüdyosu

`/studyo`, ürün ve özel gün → şablon → yazı/logo → renkler/ekstralar → teslim/özet olmak üzere beş adımla çalışır. Geri al/yinele son 40 durumu oturum belleğinde tutar; fotoğraf ekleme/kaldırma da geri alınabilir. Metin alanındaki kısa süreli ardışık değişiklikler tek düzenleme olarak gruplanır. Yazı ve fotoğrafın yatay/dikey konumları sürüklemeye alternatif olarak klavyeyle kullanılabilen kaydırıcılardan ayarlanır.

Kullanıcı isterse taslağı bu tarayıcıya kaydeder. Yerleşim ve tasarım seçimleri saklanır; fotoğraf saklanmaz ve tekrar yüklenmelidir. Eski taslaklar da okunur. Geçersiz veya artık sunulmayan ürün içeren kayıt açılmaz; mevcut tasarım korunur. Önizleme cihazda işlenir; teklif gönderildiğinde oluşan tasarım görseli mevcut teklif API'sine iletilir.

Önizleme, `public/assets/img/studyo/photo-*-v1.webp` fotoğraf gerçekçiliğinde üretilmiş maketleri kullanır; bunlar gerçek Beyza Blanc ürün çekimleri değildir. Kaynaklar ve üretim istemleri aynı dizindeki `mockup-sources.json` dosyasındadır. Kutu kapağı, bar kılıfı ve tepsi kartı üzerinde doku koruyan renk uygulaması; folyo çikolatalar üzerinde tekrarlanan kişiselleştirme; fotoğraf dokulu kurdele bulunur. Kutu yerleşimi 9/16/25 seçimine göre değişir. Bar gramajı, tepsi kat sayısı ve çikolatanın iç dolgusu fotoğraf maketinde birebir simüle edilmez; seçimler teklif özetine taşınır. Panelde ürün tipi için boş ürün fotoğrafı ve baskı alanı tanımlanırsa o fotoğraf önceliklidir. Maket yüklenmeden görsel indirme/onay engellenir; ağ hatası yeniden denenebilir.

Stüdyo regresyonları: `npm run test:e2e` (varsayılan adres `http://localhost:3011`). Kurulu Chrome ile çalıştırmak için PowerShell'de önce `$env:PLAYWRIGHT_CHANNEL="chrome"` ayarlanabilir. Testler masaüstü/mobil teklif akışı, adımlar, yerleşim, geri al/yinele, taslak, fotoğraf hataları ve 320/390/768/1440 px taşma kontrollerini kapsar.
## Instagram hesabını bağlama

Meta geliştirici uygulamasında Instagram Login ile profesyonel @beyzablanc hesabını yetkilendirin ve ilgili medya ve hikâye okuma izinlerini içeren Instagram kullanıcı erişim anahtarını oluşturun. Yönetim panelinde Instagram bağlantısı alanına bu anahtarı girin. Uygulama hesabın kullanıcı adını doğrular, anahtarı SESSION_SECRET üzerinden türetilen anahtarla şifreler ve PostgreSQL'e kaydeder. SESSION_SECRET değişirse mevcut Instagram bağlantısı yeniden kurulmalıdır.

Bağlantı durumunda gönderi ve hikâye erişimi ayrı gösterilir. Ana sayfa sonuçları en fazla beş dakika bellekte tutar. API erişilemezse mevcut seçilmiş gönderiler gösterilir. Hikâyeler Meta'nın erişime açtığı süre ve medya biçimiyle sınırlıdır. Anahtar süresi dolduğunda yönetim panelinden yenisini girin. Meta'nın hesap türü, uygulama modu ve izin koşulları entegrasyon sırasında ayrıca doğrulanmalıdır.
