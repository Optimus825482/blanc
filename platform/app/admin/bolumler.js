// Panel bölümleri: kenar menüsü ve hangi katalog türünün hangi bölümde göründüğü.
// Aksiyonlar kayıttan sonra ilgili bölüme döner (panelBolumu).
export const BOLUMLER = [
  { id: 'talepler', ad: 'Talepler', simge: '✉', aciklama: 'Kurumsal ve bireysel teklif talepleri' },
  { id: 'yorumlar', ad: 'Yorumlar', simge: '★', aciklama: 'Müşteri yorumları; onaylananlar ana sayfada “Sizden gelenler” bölümünde görünür' },
  { id: 'katalog', ad: 'Katalog', simge: '◫', kinds: ['occasion', 'recipient', 'segment', 'product_type'], aciklama: 'Özel günler, alıcılar, segmentler, ürün tipleri' },
  { id: 'tasarimlar', ad: 'Tasarımlar', simge: '✿', kinds: ['design'], aciklama: 'Hazır tasarımlar; vitrin kartları ve detay sayfaları buradan beslenir' },
  { id: 'studyo', ad: 'Stüdyo seçenekleri', simge: '✎', kinds: ['studio_option'], aciklama: 'Çikolata, ambalaj, kurdele, kart, yazı tipi, ekstra, teslim ve adet seçenekleri' },
  { id: 'fiyat', ad: 'Fiyat kuralları', simge: '₺', kinds: ['price_rule'], aciklama: 'Stüdyodaki tahmini fiyat bu kurallardan hesaplanır' },
  { id: 'sss', ad: 'Sık sorulanlar', simge: '?', kinds: ['faq'], aciklama: '/sss sayfası ve arama motoru SSS işaretlemesi' },
  { id: 'icerik', ad: 'Sayfa içerikleri', simge: '¶', aciklama: 'Ana sayfa, hakkımızda ve kurumsal metinleri; eski koleksiyon kategorileri' },
  { id: 'ayarlar', ad: 'Ayarlar', simge: '⚙', aciklama: 'İletişim bilgileri, duyuru bandı, hazırlık süreleri, son sipariş notu' },
  { id: 'instagram', ad: 'Instagram', simge: '◎', aciklama: 'Hesap bağlantısı ve erişim anahtarı' },
];

export const panelBolumu = Object.fromEntries(BOLUMLER.flatMap((b) => (b.kinds || []).map((k) => [k, b.id])));
export const bolumBul = (id) => BOLUMLER.find((b) => b.id === id) ?? BOLUMLER[0];
