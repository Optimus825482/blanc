/* ==========================================================================
   Beyza Blanc — içerik verisi
   --------------------------------------------------------------------------
   Site bu dosyadan besleniyor. Yeni kategori / hazır tasarım / seçenek
   eklemek için sadece burayı düzenle; sayfalar kendini otomatik günceller.

   KATEGORİ EKSENLERİ (araştırma bulgusu: 2-3 eksen menüye, kalanı filtreye)
     1) temalar      → "Özel Güne Göre" ekseni (menüde)
     2) kime         → "Kime Göre" ekseni (menüde)
     3) urun         → "Ürün Tipi" ekseni (menüde; her tasarımın urun alanından)
     4) segment      → hediye büyüklüğü (filtre)
     5) etiketler    → çapraz etiketler, kişiselleştirme tipi (filtre)
   Aynı tasarım birden çok kategoride görünür (matris modeli) — bu bilinçli.
   ========================================================================== */

window.BEYZA_DATA = {
  /* ======================================================================
     1) ÖZEL GÜN KATEGORİLERİ
     kok: menüde hangi kök altında toplanacağı
       ozel-gun → kişisel özel günler
       mevsim   → takvim/mevsim günleri
       kurumsal → iş ve kurum hayatı
     ====================================================================== */
  temalar: [
    {
      id: 'dogum-gunu',
      ad: 'Doğum Günü & Yaş Günü',
      kisa: 'Doğum Günü',
      aciklama: 'Doğum günü ve yaş günü için isim, tarih ve fotoğrafla hazırlanan kutular.',
      ikon: '🎂',
      kok: 'ozel-gun',
      vurgu: '#C77A2E',
      oneri: { ambalaj: 'krem', kurdele: 'altin', cikolata: 'karisik' },
    },
    {
      id: 'hos-geldin-bebek',
      ad: 'Hoş Geldin Bebek',
      kisa: 'Yeni Bebek',
      aciklama: 'Bebeğin adı, doğum tarihi ve kilosuyla hazırlanan hastane çıkışı ve hoş geldin tasarımları.',
      ikon: '🍼',
      kok: 'ozel-gun',
      vurgu: '#A8BFAF',
      oneri: { ambalaj: 'pudra', kurdele: 'krem', cikolata: 'beyaz' },
    },
    {
      id: 'soz-nisan',
      ad: 'Söz & Nişan',
      kisa: 'Söz & Nişan',
      aciklama: 'Söz ve nişan törenleri için isimli tepsiler ve ikram kutuları.',
      ikon: '💍',
      kok: 'ozel-gun',
      vurgu: '#B08D57',
      oneri: { ambalaj: 'fildisi', kurdele: 'altin', cikolata: 'sutlu' },
    },
    {
      id: 'dugun',
      ad: 'Düğün & Nikâh',
      kisa: 'Düğün',
      aciklama: 'Nikâh şekeri, favor kutusu ve masa üstü aranjmanlar.',
      ikon: '🤍',
      kok: 'ozel-gun',
      vurgu: '#C9B79C',
      oneri: { ambalaj: 'fildisi', kurdele: 'krem', cikolata: 'beyaz' },
    },
    {
      id: 'evlilik-yildonumu',
      ad: 'Evlilik Yıl Dönümü',
      kisa: 'Yıl Dönümü',
      aciklama: 'Evlilik yıl dönümü için tarih ve isim baskılı, ikili sunumlar.',
      ikon: '💐',
      kok: 'ozel-gun',
      vurgu: '#8E3B4A',
      oneri: { ambalaj: 'bordo', kurdele: 'altin', cikolata: 'karisik' },
    },
    {
      id: 'yeni-ev',
      ad: 'Yeni Ev',
      kisa: 'Yeni Ev',
      aciklama: 'Yeni eve taşınanlar için sıcak bir hoş geldin tasarımı.',
      ikon: '🏡',
      kok: 'ozel-gun',
      vurgu: '#7A6247',
      oneri: { ambalaj: 'krem', kurdele: 'krem', cikolata: 'sutlu' },
    },
    {
      id: 'mezuniyet',
      ad: 'Mezuniyet',
      kisa: 'Mezuniyet',
      aciklama: 'Mezuniyet kutlamaları için tarih ve bölüm baskılı kutular.',
      ikon: '🎓',
      kok: 'ozel-gun',
      vurgu: '#3A3F58',
      oneri: { ambalaj: 'siyah', kurdele: 'altin', cikolata: 'karisik' },
    },
    {
      id: 'tesekkur-tebrik',
      ad: 'Teşekkür & Tebrik',
      kisa: 'Teşekkür & Tebrik',
      aciklama: 'Teşekkür etmek ve bir başarıyı kutlamak için kısa notlu tasarımlar.',
      ikon: '🙏',
      kok: 'ozel-gun',
      vurgu: '#5B7A6A',
      oneri: { ambalaj: 'krem', kurdele: 'yesil', cikolata: 'sutlu' },
    },
    {
      id: 'gecmis-olsun',
      ad: 'Geçmiş Olsun',
      kisa: 'Geçmiş Olsun',
      aciklama: 'Nazik ve sakin bir dil ile geçmiş olsun dilekleri.',
      ikon: '🌿',
      kok: 'ozel-gun',
      vurgu: '#6E8797',
      oneri: { ambalaj: 'fildisi', kurdele: 'krem', cikolata: 'beyaz' },
    },
    {
      id: 'her-zaman',
      ad: 'Her Zaman & Sade',
      kisa: 'Her Zaman',
      aciklama: 'Belirli bir özel gün aramayanlar için zamansız, sade tasarımlar.',
      ikon: '🤎',
      kok: 'ozel-gun',
      vurgu: '#6B4326',
      oneri: { ambalaj: 'krem', kurdele: 'krem', cikolata: 'sutlu' },
    },
    {
      id: 'sevgililer',
      ad: 'Sevgililer Günü',
      kisa: 'Sevgililer',
      aciklama: 'Kalp formlu kutular, ikili sunumlar ve isim baskılı çikolatalar.',
      ikon: '❤️',
      kok: 'mevsim',
      vurgu: '#A32338',
      oneri: { ambalaj: 'bordo', kurdele: 'altin', cikolata: 'karisik' },
    },
    {
      id: 'anneler-babalar',
      ad: 'Anneler & Babalar Günü',
      kisa: 'Anneler & Babalar',
      aciklama: 'Anneye ve babaya özel, çocuk el yazısı ve fotoğraf baskılı tasarımlar.',
      ikon: '🌸',
      kok: 'mevsim',
      vurgu: '#B5738B',
      oneri: { ambalaj: 'pudra', kurdele: 'krem', cikolata: 'sutlu' },
    },
    {
      id: 'ogretmenler-gunu',
      ad: 'Öğretmenler Günü',
      kisa: 'Öğretmenler Günü',
      aciklama: 'Öğretmene teşekkür etmek için sınıf ve isim baskılı tasarımlar.',
      ikon: '🍎',
      kok: 'mevsim',
      vurgu: '#A8534B',
      oneri: { ambalaj: 'krem', kurdele: 'bordo', cikolata: 'karisik' },
    },
    {
      id: 'bayram',
      ad: 'Bayram & Yılbaşı',
      kisa: 'Bayram & Yılbaşı',
      aciklama: 'Bayram ve yılbaşı ziyaretleri için tepsi ve kutu tasarımları.',
      ikon: '🌙',
      kok: 'mevsim',
      vurgu: '#1F4B3F',
      oneri: { ambalaj: 'zumrut', kurdele: 'altin', cikolata: 'karisik' },
    },
    {
      id: 'kurumsal',
      ad: 'Kurumsal Hediyeler',
      kisa: 'Kurumsal',
      aciklama: 'Logo baskılı toplu hediye kutuları; çalışan, müşteri ve iş ortağı için.',
      ikon: '🏢',
      kok: 'kurumsal',
      vurgu: '#2B2B2B',
      oneri: { ambalaj: 'siyah', kurdele: 'altin', cikolata: 'bitter' },
    },
    {
      id: 'is-yildonumu',
      ad: 'İş Yıl Dönümü',
      kisa: 'İş Yıl Dönümü',
      aciklama: 'Çalışanın şirketteki yıl dönümü için kurumsal ama kişisel bir teşekkür.',
      ikon: '🏆',
      kok: 'kurumsal',
      vurgu: '#2E5A4B',
      oneri: { ambalaj: 'zumrut', kurdele: 'altin', cikolata: 'bitter' },
    },
    {
      id: 'ise-baslama',
      ad: 'İşe Başlama & Hoş Geldin',
      kisa: 'İşe Başlama',
      aciklama: 'Yeni işe başlayan çalışana hoş geldin kutusu; isim ve başlangıç tarihi baskılı.',
      ikon: '👋',
      kok: 'kurumsal',
      vurgu: '#3F6E8C',
      oneri: { ambalaj: 'krem', kurdele: 'yesil', cikolata: 'karisik' },
    },
    {
      id: 'terfi',
      ad: 'Terfi & Tebrik',
      kisa: 'Terfi',
      aciklama: 'Terfi, atama ve başarı tebrikleri için kısa notlu tasarımlar.',
      ikon: '📈',
      kok: 'kurumsal',
      vurgu: '#8A6B24',
      oneri: { ambalaj: 'antik-altin', kurdele: 'siyah', cikolata: 'bitter' },
    },
    {
      id: 'acilis-toren',
      ad: 'Açılış & Tören',
      kisa: 'Açılış & Tören',
      aciklama: 'İş yeri açılışı, tören ve organizasyonlar için tepsi ve toplu kutular.',
      ikon: '🎗️',
      kok: 'kurumsal',
      vurgu: '#8C6239',
      oneri: { ambalaj: 'antik-altin', kurdele: 'bordo', cikolata: 'karisik' },
    },
  ],

  /* ======================================================================
     2) KİME GÖRE EKSENİ (alıcı) — menüde gezilebilir
     ====================================================================== */
  kime: [
    { id: 'es-sevgili', ad: 'Eş / Sevgili İçin', kisa: 'Eş / Sevgili', aciklama: 'Yıl dönümü, Sevgililer Günü ve romantik sürprizler için.' },
    { id: 'anne', ad: 'Anne İçin', kisa: 'Anne', aciklama: 'Anneler Günü, doğum günü ve teşekkür için.' },
    { id: 'baba', ad: 'Baba İçin', kisa: 'Baba', aciklama: 'Babalar Günü ve doğum günü için.' },
    { id: 'arkadas', ad: 'Arkadaş İçin', kisa: 'Arkadaş', aciklama: 'Doğum günü, teşekkür ve moral hediyesi.' },
    { id: 'cocuk-bebek', ad: 'Çocuk / Bebek İçin', kisa: 'Çocuk & Bebek', aciklama: 'Yeni doğan, yaş günü ve çocuk kutlamaları.' },
    { id: 'ogretmen', ad: 'Öğretmen İçin', kisa: 'Öğretmen', aciklama: 'Öğretmenler Günü ve dönem sonu teşekkürü.' },
    { id: 'ekip-musteri', ad: 'Ekip / Müşteri İçin', kisa: 'Ekip & Müşteri', aciklama: 'Kurumsal hediyeler, çalışan ve müşteri teşekkürleri.' },
    { id: 'kendim', ad: 'Kendim İçin', kisa: 'Kendim', aciklama: 'Kendine küçük bir mola veya ev hediyesi.' },
  ],

  /* ======================================================================
     3) HEDİYE BÜYÜKLÜĞÜ (filtre) — fiyat yayınlanmadığı için segment ekseni
     ====================================================================== */
  segmentler: [
    { id: 'kucuk', ad: 'Küçük hediye', aciklama: '9 adet ve altı / tek kişilik' },
    { id: 'klasik', ad: 'Klasik kutu', aciklama: '16 adet çevresi' },
    { id: 'buyuk', ad: 'Büyük / özel üretim', aciklama: '25 adet ve üzeri, tepsi ve toplu işler' },
  ],

  /* ======================================================================
     4) HAZIR TASARIMLAR
     Bir tasarım birden çok kategoriye bağlanır: tema (özel gün), kime,
     urun (ürün tipi), segment ve etiketler. Matris modeli bilinçli.
     ====================================================================== */
  tasarimlar: [
    /* --- Doğum günü --- */
    {
      id: 'altin-isilti-madlen',
      ad: 'Altın Işıltı Madlen Kutusu',
      tema: 'dogum-gunu',
      urun: 'madlen-kutu',
      boyut: '16',
      cikolata: 'karisik',
      kime: ['arkadas', 'anne', 'es-sevgili'],
      segment: 'klasik',
      cokSatan: true,
      ozet: 'Altın varaklı 16’lı madlen kutusu; kapağa isim ve tarih baskısı eklenir.',
      etiketler: ['Çok tercih edilen', 'İsim baskılı', 'Altın detay'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    {
      id: 'iyi-ki-dogdun-bar',
      ad: 'İyi Ki Doğdun Fotoğraflı Bar',
      tema: 'dogum-gunu',
      urun: 'bar',
      boyut: '250 g',
      cikolata: 'sutlu',
      kime: ['arkadas', 'es-sevgili', 'anne'],
      segment: 'kucuk',
      cokSatan: true,
      ozet: 'Fotoğrafın ve kısa mesajın çikolata barının üzerine basıldığı tek kişilik hediye.',
      etiketler: ['Fotoğraf baskılı', 'Hızlı hazır'],
      gorsel: 'assets/img/urun-bar.svg',
    },
    /* --- Yeni bebek --- */
    {
      id: 'bebek-madlen-kutusu',
      ad: 'Hoş Geldin Bebek Madlen Kutusu',
      tema: 'hos-geldin-bebek',
      urun: 'madlen-kutu',
      boyut: '9',
      cikolata: 'beyaz',
      kime: ['cocuk-bebek', 'anne'],
      segment: 'kucuk',
      cokSatan: true,
      ozet: 'Bebeğin adı, doğum tarihi ve kilosu beyaz çikolata üzerine yazılır.',
      etiketler: ['Doğum bilgili', 'Pudra tonları'],
      gorsel: 'assets/img/urun-bebek.svg',
    },
    {
      id: 'hos-geldin-bebek-tepsisi',
      ad: 'Hoş Geldin Bebek Tepsisi',
      tema: 'hos-geldin-bebek',
      urun: 'tepsi',
      boyut: 'Tek kat',
      cikolata: 'beyaz',
      kime: ['cocuk-bebek'],
      segment: 'buyuk',
      ozet: 'Hastane çıkışı ve ilk ziyaretler için tepsi üzeri aranjman.',
      etiketler: ['Tepsi', 'Hastane çıkışı'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    /* --- Söz & nişan --- */
    {
      id: 'soz-madlen-kutusu',
      ad: 'Söz & Nişan İkram Kutusu',
      tema: 'soz-nisan',
      urun: 'madlen-kutu',
      boyut: '25',
      cikolata: 'sutlu',
      kime: ['es-sevgili'],
      segment: 'buyuk',
      ozet: 'İki ismin baş harfleri ve tarih, ikram kutularının üzerine işlenir.',
      etiketler: ['Çift isimli', 'İkram', 'Toplu üretim'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    {
      id: 'nisan-tepsisi-zarafet',
      ad: 'Zarafet Nişan Tepsisi',
      tema: 'soz-nisan',
      urun: 'tepsi',
      boyut: 'İkili',
      cikolata: 'karisik',
      kime: ['es-sevgili'],
      segment: 'buyuk',
      cokSatan: true,
      ozet: 'Altın detaylı tepsi, isim ve tarih yazılı kurdele ile tamamlanır.',
      etiketler: ['Tepsi', 'Altın detay'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    /* --- Düğün --- */
    {
      id: 'dugun-favor-kutusu',
      ad: 'Düğün Favor Kutusu',
      tema: 'dugun',
      urun: 'hediye-kutusu',
      boyut: '25',
      cikolata: 'beyaz',
      kime: ['es-sevgili'],
      segment: 'buyuk',
      ozet: 'Konuklara tek tek verilmek üzere hazırlanan küçük favor kutuları.',
      etiketler: ['Toplu üretim', 'Nikâh şekeri'],
      gorsel: 'assets/img/urun-kutu.svg',
    },
    /* --- Evlilik yıl dönümü --- */
    {
      id: 'yildonumu-ikili-kutu',
      ad: 'Yıl Dönümü İkili Kutusu',
      tema: 'evlilik-yildonumu',
      urun: 'madlen-kutu',
      boyut: '16',
      cikolata: 'karisik',
      kime: ['es-sevgili'],
      segment: 'klasik',
      ozet: 'Evlilik tarihi ve “birlikte kaç yıl” yazısıyla hazırlanan bordo kutu.',
      etiketler: ['Tarih baskılı', 'İkili sunum'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    /* --- Yeni ev --- */
    {
      id: 'yeni-ev-anahtar-kutusu',
      ad: 'Yeni Ev Kutusu',
      tema: 'yeni-ev',
      urun: 'hediye-kutusu',
      boyut: '9',
      cikolata: 'sutlu',
      kime: ['arkadas', 'kendim'],
      segment: 'kucuk',
      ozet: '“Yeni evinde mutlulukla” notu ve anahtar formlu çikolatalarla.',
      etiketler: ['Not kartlı', 'Sıcak tonlar'],
      gorsel: 'assets/img/urun-kutu.svg',
    },
    /* --- Mezuniyet --- */
    {
      id: 'mezuniyet-kutusu',
      ad: 'Mezuniyet Kutusu',
      tema: 'mezuniyet',
      urun: 'madlen-kutu',
      boyut: '16',
      cikolata: 'karisik',
      kime: ['arkadas', 'cocuk-bebek'],
      segment: 'klasik',
      ozet: 'Bölüm, okul ve tarih yazılı siyah-altın mezuniyet kutusu.',
      etiketler: ['Siyah–altın', 'Tarih baskılı'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    /* --- Teşekkür & tebrik (YENİ) --- */
    {
      id: 'tesekkur-kutusu',
      ad: 'Teşekkür Kutusu',
      tema: 'tesekkur-tebrik',
      urun: 'madlen-kutu',
      boyut: '9',
      cikolata: 'sutlu',
      kime: ['arkadas', 'ekip-musteri', 'anne'],
      segment: 'kucuk',
      yeni: true,
      ozet: 'Kısa bir teşekkür notu ve tek isim baskısıyla sade, zarif kutu.',
      etiketler: ['Not kartlı', 'İsim baskılı'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    {
      id: 'tebrikler-bari',
      ad: 'Tebrikler Çikolata Barı',
      tema: 'tesekkur-tebrik',
      urun: 'bar',
      boyut: '100 g',
      cikolata: 'bitter',
      kime: ['arkadas', 'ekip-musteri'],
      segment: 'kucuk',
      ozet: '“Tebrikler” yazılı bar; başarı ve atama kutlamaları için hızlı hediye.',
      etiketler: ['Hızlı hazır', 'Mesaj baskılı'],
      gorsel: 'assets/img/urun-bar.svg',
    },
    {
      id: 'tesekkur-tepsisi',
      ad: 'Teşekkür Tepsisi',
      tema: 'tesekkur-tebrik',
      urun: 'tepsi',
      boyut: 'Tek kat',
      cikolata: 'karisik',
      kime: ['ekip-musteri', 'anne', 'ogretmen'],
      segment: 'buyuk',
      ozet: 'Bir teşekkürü kalabalığa iletmek için tepsi üzeri aranjman.',
      etiketler: ['Tepsi', 'Kurumsal uygun'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    /* --- Geçmiş olsun (YENİ) --- */
    {
      id: 'gecmis-olsun-kutusu',
      ad: 'Geçmiş Olsun Kutusu',
      tema: 'gecmis-olsun',
      urun: 'madlen-kutu',
      boyut: '9',
      cikolata: 'beyaz',
      kime: ['arkadas', 'anne', 'ekip-musteri'],
      segment: 'kucuk',
      yeni: true,
      ozet: 'Sakin tonlarda, nazik bir “geçmiş olsun” notuyla hazırlanan küçük kutu.',
      etiketler: ['Not kartlı', 'Sade tasarım'],
      gorsel: 'assets/img/urun-bebek.svg',
    },
    {
      id: 'gecmis-olsun-bari',
      ad: 'Geçmiş Olsun Barı',
      tema: 'gecmis-olsun',
      urun: 'bar',
      boyut: '100 g',
      cikolata: 'sutlu',
      kime: ['arkadas', 'ekip-musteri'],
      segment: 'kucuk',
      ozet: 'Hastane ziyareti ve moral için tek kişilik, notlu çikolata barı.',
      etiketler: ['Hızlı hazır', 'Ziyaret hediyesi'],
      gorsel: 'assets/img/urun-bar.svg',
    },
    /* --- Öğretmenler günü (YENİ) --- */
    {
      id: 'ogretmenime-kutu',
      ad: 'Öğretmenime Kutu',
      tema: 'ogretmenler-gunu',
      urun: 'madlen-kutu',
      boyut: '16',
      cikolata: 'karisik',
      kime: ['ogretmen'],
      segment: 'klasik',
      yeni: true,
      ozet: 'Öğretmenin adı ve sınıf bilgisiyle hazırlanan, çocuk el yazısı notlu kutu.',
      etiketler: ['El yazısı not', 'İsim baskılı'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    {
      id: 'ogretmenler-gunu-bari',
      ad: 'Öğretmenler Günü Barı',
      tema: 'ogretmenler-gunu',
      urun: 'bar',
      boyut: '250 g',
      cikolata: 'sutlu',
      kime: ['ogretmen', 'cocuk-bebek'],
      segment: 'kucuk',
      ozet: 'Sınıfın toplu imzaladığı kart ile birlikte sunulan bar.',
      etiketler: ['Toplu imza', 'Hızlı hazır'],
      gorsel: 'assets/img/urun-bar.svg',
    },
    /* --- Her zaman & sade --- */
    {
      id: 'sade-imza-kutusu',
      ad: 'Sade İmza Kutusu',
      tema: 'her-zaman',
      urun: 'madlen-kutu',
      boyut: '16',
      cikolata: 'sutlu',
      kime: ['kendim', 'arkadas'],
      segment: 'klasik',
      ozet: 'Belirli bir özel gün aramayanlar için zamansız, sade kutu.',
      etiketler: ['Zamansız', 'Sade tasarım'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    /* --- Sevgililer --- */
    {
      id: 'kalp-madlen-kalbi',
      ad: 'Kalp Madlen Kalbi',
      tema: 'sevgililer',
      urun: 'madlen-kutu',
      boyut: '9',
      cikolata: 'karisik',
      kime: ['es-sevgili'],
      segment: 'kucuk',
      cokSatan: true,
      ozet: 'Kalp dizilimli 9’lu kutu; kapağa kısa bir not yazılır.',
      etiketler: ['Kalp dizilim', 'Not kartlı'],
      gorsel: 'assets/img/urun-madlen.svg',
    },
    /* --- Anneler & babalar --- */
    {
      id: 'anneler-gunu-tepsisi',
      ad: 'Anneye Tepsi',
      tema: 'anneler-babalar',
      urun: 'tepsi',
      boyut: 'Tek kat',
      cikolata: 'sutlu',
      kime: ['anne', 'cocuk-bebek'],
      segment: 'buyuk',
      ozet: 'Çocuğun el yazısı veya fotoğrafının tepsiye işlendiği Anneler Günü tasarımı.',
      etiketler: ['El yazısı', 'Tepsi'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    {
      id: 'babalar-gunu-kutusu',
      ad: 'Babaya Kutu',
      tema: 'anneler-babalar',
      urun: 'hediye-kutusu',
      boyut: '16',
      cikolata: 'bitter',
      kime: ['baba', 'cocuk-bebek'],
      segment: 'klasik',
      yeni: true,
      ozet: 'Baba ve çocuk fotoğrafının kutu kapağına işlendiği bitter ağırlıklı seçki.',
      etiketler: ['Fotoğraf baskılı', 'Bitter ağırlıklı'],
      gorsel: 'assets/img/urun-kutu.svg',
    },
    /* --- Bayram --- */
    {
      id: 'bayram-tepsisi',
      ad: 'Bayram Tepsisi',
      tema: 'bayram',
      urun: 'tepsi',
      boyut: 'Tek kat',
      cikolata: 'karisik',
      kime: ['anne', 'baba', 'arkadas'],
      segment: 'buyuk',
      cokSatan: true,
      ozet: 'Bayram ziyaretleri için aile adı yazılı yeşil-altın tepsi.',
      etiketler: ['Aile adı', 'Tepsi'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    /* --- Kurumsal & iş --- */
    {
      id: 'kurumsal-logo-kutusu',
      ad: 'Kurumsal Logo Kutusu',
      tema: 'kurumsal',
      urun: 'hediye-kutusu',
      boyut: '25',
      cikolata: 'bitter',
      kime: ['ekip-musteri'],
      segment: 'buyuk',
      cokSatan: true,
      ozet: 'Şirket logosu ve kurumsal renklerle hazırlanan toplu hediye kutusu.',
      etiketler: ['Logo baskılı', 'Toplu sipariş'],
      gorsel: 'assets/img/urun-kurumsal.svg',
    },
    {
      id: 'is-yildonumu-kutusu',
      ad: 'İş Yıl Dönümü Kutusu',
      tema: 'is-yildonumu',
      urun: 'hediye-kutusu',
      boyut: '25',
      cikolata: 'bitter',
      kime: ['ekip-musteri'],
      segment: 'buyuk',
      ozet: '“5. yılın kutlu olsun” gibi kişiselleştirilmiş kurumsal teşekkür kutusu.',
      etiketler: ['Kurumsal', 'Yıl bilgili'],
      gorsel: 'assets/img/urun-kurumsal.svg',
    },
    {
      id: 'hos-geldin-ekip-kutusu',
      ad: 'Hoş Geldin Ekip Kutusu',
      tema: 'ise-baslama',
      urun: 'hediye-kutusu',
      boyut: '16',
      cikolata: 'karisik',
      kime: ['ekip-musteri'],
      segment: 'klasik',
      ozet: 'Yeni çalışanın adı ve başlangıç tarihiyle hazırlanan onboarding kutusu.',
      etiketler: ['Onboarding', 'İsim baskılı'],
      gorsel: 'assets/img/urun-kurumsal.svg',
    },
    {
      id: 'terfi-tebrik-kutusu',
      ad: 'Terfi Tebrik Kutusu',
      tema: 'terfi',
      urun: 'madlen-kutu',
      boyut: '9',
      cikolata: 'bitter',
      kime: ['ekip-musteri'],
      segment: 'kucuk',
      ozet: 'Yeni unvan ve isim yazılı, takım tarafından imzalanmış kartla.',
      etiketler: ['Takım kartı', 'Altın detay'],
      gorsel: 'assets/img/urun-kurumsal.svg',
    },
    /* --- Açılış & tören (YENİ) --- */
    {
      id: 'acilis-tepsisi',
      ad: 'Açılış Tepsisi',
      tema: 'acilis-toren',
      urun: 'tepsi',
      boyut: 'Tek kat',
      cikolata: 'karisik',
      kime: ['ekip-musteri'],
      segment: 'buyuk',
      yeni: true,
      ozet: 'İş yeri açılışları ve törenlerde ikram için işletme adı yazılı tepsi.',
      etiketler: ['İşletme adı', 'Tören'],
      gorsel: 'assets/img/urun-tepsi.svg',
    },
    {
      id: 'acilis-kurumsal-kutusu',
      ad: 'Açılış & Tören Kutusu',
      tema: 'acilis-toren',
      urun: 'hediye-kutusu',
      boyut: '25',
      cikolata: 'bitter',
      kime: ['ekip-musteri'],
      segment: 'buyuk',
      yeni: true,
      ozet: 'Açılış konuklarına verilmek üzere logo baskılı toplu kutular.',
      etiketler: ['Logo baskılı', 'Toplu üretim'],
      gorsel: 'assets/img/urun-kurumsal.svg',
    },
  ],

  /* ======================================================================
     5) TASARIM STÜDYOSU SEÇENEKLERİ
     ====================================================================== */
  studyo: {
    urunTipleri: [
      {
        id: 'madlen-kutu',
        ad: 'Madlen Kutusu',
        ozet: 'Kalıp madlen çikolata, kişiye özel baskı',
        tip: 'kutu',
        boyutlar: ['9', '16', '25'],
      },
      {
        id: 'bar',
        ad: 'Çikolata Bar',
        ozet: 'Bar üzerine fotoğraf, isim veya logo baskısı',
        tip: 'bar',
        boyutlar: ['100 g', '250 g'],
      },
      {
        id: 'tepsi',
        ad: 'Söz & Nişan Tepsisi',
        ozet: 'Tepsi üzeri aranjman; isim, tarih ve kurdele',
        tip: 'tepsi',
        boyutlar: ['Tek kat', 'İkili'],
      },
      {
        id: 'hediye-kutusu',
        ad: 'Hediye Kutusu',
        ozet: 'Karışık çikolata seçkisi ve kişiye özel kart',
        tip: 'kutu',
        boyutlar: ['9', '16', '25'],
      },
    ],

    cikolataTipleri: [
      { id: 'sutlu', ad: 'Sütlü', dolgu: '#7A4A2B', kenar: '#5C351C' },
      { id: 'bitter', ad: 'Bitter', dolgu: '#3A2417', kenar: '#241309' },
      { id: 'beyaz', ad: 'Beyaz', dolgu: '#F2E7D5', kenar: '#DCC9AE' },
      { id: 'karisik', ad: 'Karışık', dolgu: 'mix', kenar: '#00000022' },
    ],

    ambalajRenkleri: [
      { id: 'krem', ad: 'Krem', zemin: '#F6EBDC', kenar: '#E0CDB4', metin: '#3D2016' },
      { id: 'fildisi', ad: 'Fildişi', zemin: '#FFF8F3', kenar: '#EADFD2', metin: '#3D2016' },
      { id: 'antik-altin', ad: 'Antik Altın', zemin: '#D9C08A', kenar: '#B99B5C', metin: '#4A3A18' },
      { id: 'pudra', ad: 'Pudra', zemin: '#EBD3D6', kenar: '#D3AFB4', metin: '#6E3B45' },
      { id: 'bordo', ad: 'Bordo', zemin: '#6E1F2C', kenar: '#511420', metin: '#F6E7D8' },
      { id: 'zumrut', ad: 'Zümrüt', zemin: '#1F4B3F', kenar: '#143128', metin: '#F0E7D6' },
      { id: 'siyah', ad: 'Siyah', zemin: '#1D1A18', kenar: '#0E0C0B', metin: '#EFE3D2' },
    ],

    kurdeler: [
      { id: 'altin', ad: 'Altın', renk: '#CFB56A' },
      { id: 'krem', ad: 'Krem saten', renk: '#EFE3D2' },
      { id: 'bordo', ad: 'Bordo', renk: '#8E3B4A' },
      { id: 'yesil', ad: 'Yeşil', renk: '#2E5A4B' },
      { id: 'siyah', ad: 'Siyah', renk: '#1D1A18' },
      { id: 'yok', ad: 'Kurdele istemiyorum', renk: null },
    ],

    kartlar: [
      { id: 'yok', ad: 'Kart istemiyorum', zemin: null, metin: null },
      { id: 'kraft', ad: 'Kraft kart', zemin: '#C9A87C', metin: '#4A3521' },
      { id: 'beyaz-altin', ad: 'Beyaz kart / altın yazı', zemin: '#FFFDF9', metin: '#A98336' },
      { id: 'pudra', ad: 'Pudra kart', zemin: '#F3E2E4', metin: '#8A5B62' },
    ],

    fontlar: [
      { id: 'serif', ad: 'Klasik', css: "'Cormorant Garamond', Georgia, serif" },
      { id: 'playfair', ad: 'Zarif', css: "'Playfair Display', Georgia, serif" },
      { id: 'elyazi', ad: 'El yazısı', css: "'Great Vibes', cursive" },
      { id: 'sans', ad: 'Modern', css: "'Inter', system-ui, sans-serif" },
    ],

    adetler: ['1', '2', '4', '6', '9', '16', '25', '50', '100'],
    kurumsalAdetNotu: '10 adet ve üzeri siparişler kurumsal fiyatla değerlendirilir.',

    ekstralar: [
      { id: 'cikolataUzeriIsim', ad: 'Çikolata üzerine isim / tarih baskısı', varsayilan: true },
      { id: 'kartNotu', ad: 'Karta el yazısı not', varsayilan: true },
      { id: 'isimEtiketi', ad: 'Kutu kapağında isim etiketi', varsayilan: false },
      { id: 'kurumsalFatura', ad: 'Kurumsal: fatura ve teslim evrakı', varsayilan: false },
    ],

    /* Teslim biçimi — teklif mesajına eklenir */
    teslimSekilleri: [
      { id: 'elden-girne', ad: 'Girne içi elden teslim' },
      { id: 'kargo-kktc', ad: 'KKTC içi kargo' },
      { id: 'kargo-tr', ad: 'Türkiye’ye kargo' },
      { id: 'magazadan-alma', ad: 'Mağazadan teslim alacağım' },
    ],
  },

  /* ======================================================================
     6) MÜŞTERİ YORUMLARI
     BOŞ BIRAKILDI. Gerçek müşteri yorumlarını buraya eklediğin an ana
     sayfada "Sizden gelenler" bölümü kendiliğinden görünür.
     Uydurma yorum eklemeyin.
     Örnek biçim (yorumu silip kendi verinizi yazın):
       { ad: 'Elif K.', sehir: 'Girne', puan: 5,
         metin: '...', urun: 'altin-isilti-madlen', gorsel: '' }
     ====================================================================== */
  yorumlar: [],

  /* ======================================================================
     7) METİNLER
     ====================================================================== */
  guvenSeridi: [
    { ikon: '✍️', baslik: 'Tamamen kişiye özel', metin: 'İsim, tarih, fotoğraf ve logo baskısı' },
    { ikon: '🚚', baslik: 'Girne’ye aynı gün', metin: 'Tüm KKTC’ye 1–2 iş günü teslimat' },
    { ikon: '💬', baslik: 'Fiyat WhatsApp’ta', metin: 'Tasarımını gönder, teklifi hemen al' },
    { ikon: '🎁', baslik: 'Hediye paketli', metin: 'Kart ve kurdele ile hazır teslim' },
  ],

  /* Kalite ve teslim taahhütleri — sahibi doğrulayıp güncellemeli */
  taahhutler: [
    {
      baslik: 'Kırılmaya karşı paketleme',
      metin: 'Çikolata ve tepsi ürünleri oynak dolgu ve sert kutu içinde paketlenir; kargoda hasar gören ürün aynı tasarımla yeniden hazırlanır.',
    },
    {
      baslik: 'Üretim öncesi onay',
      metin: 'İsim, tarih ve renkler üretime girmeden önce WhatsApp’tan onayına sunulur. Onay olmadan baskıya girmez.',
    },
    {
      baslik: 'Gerçek teslim tarihi',
      metin: '“Yarın gelir” demeyiz; sipariş sırasında teslim gününü yazılı olarak bildiririz.',
    },
  ],

  nasilCalisir: [
    {
      adim: '1',
      baslik: 'Özel günü seç',
      metin: 'Kategoriye göz at ya da doğrudan tasarım stüdyosuna geç.',
    },
    {
      adim: '2',
      baslik: 'Tasarımını oluştur',
      metin: 'Ürün, tema, kutu ve çikolata tipini seç; isim, tarih ve notu yaz, fotoğrafını yükle.',
    },
    {
      adim: '3',
      baslik: 'WhatsApp’tan fiyat iste',
      metin: 'Tasarım özetini onayla, görsel ve özet WhatsApp’a gitsin; fiyatı ve teslim gününü hemen iletiyoruz.',
    },
  ],

  sss: [
    {
      soru: 'Sitede neden online ödeme yok?',
      cevap:
        'Her tasarım el emeğiyle ve kişiye özel hazırlandığı için fiyat; adet, kutu tipi ve baskı detayına göre değişiyor. Tasarımını stüdyoda oluşturup WhatsApp’tan gönderdiğinde net fiyatı ve teslim tarihini aynı gün iletiyoruz.',
    },
    {
      soru: 'Sipariş nasıl veriliyor?',
      cevap:
        'Tasarımını stüdyoda oluştur, özet ekranında yazımı kontrol et ve “WhatsApp’tan gönder”e bas. Tasarım görseli ve özet mesajı hazır gelir; onayladığında üretime alıyoruz.',
    },
    {
      soru: 'Ne kadar sürede hazırlanıyor?',
      cevap:
        'Tek kutu ve küçük siparişler 2–3 iş günü, 25 adet ve üzeri siparişler 5–7 iş günü içinde hazırlanır. Özel günlerden önceki hafta kapasitemiz dolabildiği için teslim tarihini erkenden konuşmanı öneririz.',
    },
    {
      soru: 'Bebek çikolatasına neler yazılabiliyor?',
      cevap: 'Bebeğin adı, doğum tarihi, doğum saati ve kilosu. İstersen hastane çıkışı için özel tarih de eklenir.',
    },
    {
      soru: 'Yüklediğim fotoğraf nereye gidiyor?',
      cevap:
        'Yüklediğin fotoğraf cihazından çıkmaz; tasarım önizlemesi tamamen tarayıcında oluşur. Yalnızca özet ekranında “gönder” dediğinde, senin onayınla bize ulaşır.',
    },
    {
      soru: 'Kurumsal sipariş veriyor musunuz?',
      cevap:
        'Evet. Logo baskılı toplu kutular, çalışan doğum günü ve iş yıl dönümü programları ile müşteri hediyeleri hazırlıyoruz. 10 adetten itibaren kurumsal fiyat uygulanır.',
    },
    {
      soru: 'Teslimat ve kargo nasıl işliyor?',
      cevap:
        'Girne ve çevresine aynı gün el teslimi; KKTC geneline 1–2 iş gününde kargo. Çikolata sıcaklığa duyarlı olduğu için özel ambalajla ve serin saatlerde gönderilir.',
    },
    {
      soru: 'İade veya değişim var mı?',
      cevap:
        'Kişiye özel üretilen ürünlerde cayma hakkı bulunmuyor. Ancak taşıma sırasında hasar gören ürünü fotoğrafla bildirirsen aynı tasarımı yeniden hazırlıyoruz.',
    },
  ],

  kurumsal: {
    faydalar: [
      {
        baslik: 'Çalışan doğum günü ve yıl dönümü',
        metin: 'İsim ve yıl bilgisiyle hazırlanan kutularla ekibinize hatırlandığını hissettirin.',
      },
      {
        baslik: 'Yeni çalışan hoş geldin kutusu',
        metin: 'İlk günde masasına bırakılacak, ismi baskılı hoş geldin seti.',
      },
      {
        baslik: 'Müşteri ve iş ortağı hediyesi',
        metin: 'Logo baskılı, kurumsal renklerinize uygun toplu kutular.',
      },
      {
        baslik: 'Özel gün ve açılış hediyeleri',
        metin: 'Açılış, bayram, yıl dönümü ve teşekkür için zamanında teslim.',
      },
    ],
    adimlar: [
      { baslik: 'İhtiyacı anlat', metin: 'Adet, bütçe ve teslim tarihini WhatsApp’tan ilet.' },
      { baslik: 'Numune ve teklif', metin: 'Tasarım önerisi ve numune ile net fiyat sunuyoruz.' },
      { baslik: 'Onay ve üretim', metin: 'Onaylı tasarım üretime girer, teslim tarihine göre planlanır.' },
      { baslik: 'Teslim ve evrak', metin: 'Toplu teslim, isim listesine göre paketleme ve fatura.' },
    ],
    adetNotu: 'Toplu siparişlerde 10 adetten itibaren kurumsal fiyat uygulanır.',
  },
};
