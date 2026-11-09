/* ==========================================================================
   Beyza Blanc — site ayarları
   --------------------------------------------------------------------------
   Buradaki değerleri düzenle. Başka hiçbir dosyayı değiştirmen gerekmez.
   ========================================================================== */

window.BEYZA = {
  /* --- Marka --- */
  marka: 'Beyza Blanc',
  slogan: 'Zarafetin Adresi',
  kisaTanitim:
    'Özel günlerinize özel, şık ve eşsiz tasarımlar. Elle hazırlanan kişiye özel çikolata ve hediyelik kutular.',

  /* --- İletişim --- */
  // ÖNEMLİ: WhatsApp numarası ülke koduyla, boşluksuz ve başında + olmadan yazılır.
  // Örnek: KKTC hattı 0533 123 45 67 ise  ->  '905331234567'
  whatsapp: '905000000000',
  whatsappGorunum: '+90 500 000 00 00', // sitede yazı olarak görünen numara
  eposta: 'info@beyzablanc.com',
  adres: 'Ankara Caddesi, Baş-Yıl 1 Apt. Dükkan No: 2',
  adresDetay: 'Alsancak / Girne — Kuzey Kıbrıs',
  instagram: 'https://www.instagram.com/beyzablanc/',
  instagramKullanici: '@beyzablanc',
  facebook: '', // varsa sayfa adresini yaz
  googleMaps: '', // varsa Google Maps linkini yaz

  calismaSaatleri: [
    ['Pazartesi – Cuma', '10:00 – 19:00'],
    ['Cumartesi', '10:00 – 19:00'],
    ['Pazar', 'Randevu ile'],
  ],

  /* --- Sipariş akışı --- */
  // Sitede online satış yok: sipariş ve fiyat teklifi WhatsApp üzerinden alınır.
  siparisNotu:
    'Sitemizde online ödeme yok. Tasarımını oluştur, tek dokunuşla WhatsApp’tan fiyat iste.',
  teslimatNotu: 'Girne ve çevresine aynı gün teslimat; tüm KKTC’ye 1–2 iş günü.',

  /* Son sipariş tarihi iletişimi (araştırma: "belirsiz teslim tarihi" en sık şikâyet) */
  sonSiparisNotu:
    'Özel gün siparişlerinde önerilen son tarih: teslim gününden 3 iş günü önce.',
  teslimBantlari: [
    { baslik: '1–4 adet', metin: '2–3 iş günü içinde hazır' },
    { baslik: '5–24 adet', metin: '3–5 iş günü içinde hazır' },
    { baslik: '25 adet ve üzeri', metin: '5–7 iş günü içinde hazır' },
  ],

  /* Mevsimsel duyuru şeridi — boş bırakılırsa görünmez.
     Örnek: metin: 'Sevgililer Günü siparişleri için son gün 10 Şubat.' */
  duyuruBandi: {
    aktif: false,
    metin: '',
    baglantiMetni: '',
    baglanti: '',
  },

  /* --- Tasarım stüdyosu --- */
  studyo: {
    // Üretilen görselin kenar uzunluğu (piksel). 1000 = yüksek kalite, hızlı.
    olcu: 1000,
    // Yüklenen fotoğraf en fazla bu megabayt olabilir (dosya tarayıcıdan çıkmaz)
    maksFotoMB: 8,
    isimKarakter: 22,
    mesajKarakter: 60,
    varsayilanAdet: '16',
  },

  /* --- Fiyat gösterimi --- */
  // Fiyatlar sitede yayınlanmıyor; teklif WhatsApp'ta veriliyor.
  // Başlangıç fiyatı yayınlamak istersen fiyatGoster'i true yap ve
  // data.js içindeki her tasarıma "baslangicFiyat" alanı ekle.
  fiyatGoster: false,
};
