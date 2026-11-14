// Katalog panelinin alan tanımları (plan 1.3). Hem form (app/admin/katalog.js) hem de kaydetme
// aksiyonu (app/admin/actions.js) bu listeden beslenir; sütun adları yalnızca buradan gelir.
// type: text | textarea | number | decimal | check | select | color | tags | json | image
// options: sabit dizi ya da ilişkili tablo adı (occasions, product_types, segments, chocolate)

const KOKLER = [['ozel-gun', 'Kişisel özel gün'], ['mevsim', 'Takvim / mevsim'], ['kurumsal', 'Kurumsal']];
const CIZIM = [['kutu', 'Kutu'], ['bar', 'Bar'], ['tepsi', 'Tepsi']];
const GRUPLAR = [
  ['chocolate', 'Çikolata tipi'], ['wrap_color', 'Ambalaj rengi'], ['ribbon', 'Kurdele'], ['card', 'Kart'],
  ['font', 'Yazı tipi'], ['extra', 'Ekstra'], ['delivery', 'Teslim şekli'], ['quantity', 'Adet'],
  ['frame', 'Baskı çerçevesi'],
];

const ortak = {
  position: { name: 'position', label: 'Sıra', type: 'number' },
  published: { name: 'published', label: 'Yayında', type: 'check' },
  image: { name: 'image', label: 'Görsel', type: 'image' },
  alt: { name: 'alt', label: 'Görsel açıklaması', type: 'text', max: 180 },
};

export const katalog = {
  occasion: {
    table: 'bb_occasions', title: 'Özel günler', single: 'özel gün', order: 'position, title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'short_title', label: 'Kısa ad (menü)', type: 'text', max: 60, required: true },
      { name: 'body', label: 'Açıklama', type: 'textarea', max: 1000 },
      { name: 'icon', label: 'Simge (emoji)', type: 'text', max: 8 },
      { name: 'root', label: 'Menü kökü', type: 'select', options: KOKLER, required: true },
      { name: 'accent', label: 'Vurgu rengi', type: 'color' },
      { name: 'suggested', label: 'Stüdyoda bu gün seçilince önerilen seçimler', type: 'oneri' },
      ortak.image, ortak.alt, ortak.position, ortak.published,
    ],
  },
  recipient: {
    table: 'bb_recipients', title: 'Alıcılar (kime göre)', single: 'alıcı', order: 'position, title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'short_title', label: 'Kısa ad', type: 'text', max: 60, required: true },
      { name: 'body', label: 'Açıklama', type: 'textarea', max: 600 },
      ortak.position, ortak.published,
    ],
  },
  segment: {
    table: 'bb_segments', title: 'Hediye büyüklüğü (segment)', single: 'segment', order: 'position, title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'body', label: 'Açıklama', type: 'textarea', max: 400 },
      ortak.position,
    ],
  },
  product_type: {
    table: 'bb_product_types', title: 'Ürün tipleri', single: 'ürün tipi', order: 'position, title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'body', label: 'Kısa açıklama', type: 'textarea', max: 600 },
      { name: 'draw_type', label: 'Stüdyo çizim tipi', type: 'select', options: CIZIM, required: true },
      { name: 'sizes', label: 'Boyut / adet seçenekleri (virgülle)', type: 'tags', max: 200 },
      { ...ortak.image, label: 'Boş ürün fotoğrafı (stüdyo şablonu: üzerinde yazı olmayan, beyaz/krem ürün; kare, tepeden)' }, ortak.alt,
      { name: 'print_area', label: 'Baskı alanı (yazı ve logonun oturacağı bölge)', type: 'alan' },
      ortak.position, ortak.published,
    ],
    relations: [
      { name: 'occasions', label: 'Uygun özel günler (hiçbiri seçili değilse hepsi)', table: 'bb_product_type_occasions', key: 'product_type_slug', column: 'occasion_slug', options: 'occasions' },
    ],
  },
  design: {
    table: 'bb_designs', title: 'Hazır tasarımlar', single: 'tasarım', order: 'position, title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'summary', label: 'Özet (kart metni)', type: 'textarea', max: 400 },
      { name: 'body', label: 'Detay metni', type: 'textarea', max: 4000 },
      { name: 'occasion_slug', label: 'Ana özel gün', type: 'select', options: 'occasions', required: true },
      { name: 'product_type_slug', label: 'Ürün tipi', type: 'select', options: 'product_types', required: true },
      { name: 'size', label: 'Boyut / adet', type: 'text', max: 40 },
      { name: 'chocolate', label: 'Çikolata', type: 'select', options: 'chocolate', empty: 'Belirtilmedi' },
      { name: 'segment_slug', label: 'Segment', type: 'select', options: 'segments', empty: 'Belirtilmedi', nullable: true },
      { name: 'starting_price', label: '"… TL\'den başlayan" fiyatı (boş: gösterme)', type: 'decimal', nullable: true },
      { name: 'bestseller', label: 'Çok satan', type: 'check' },
      { name: 'is_new', label: 'Yeni', type: 'check' },
      { name: 'featured', label: 'Vitrinde öne çıkar', type: 'check' },
      { name: 'tags', label: 'Etiketler (virgülle)', type: 'tags', max: 300 },
      { name: 'template', label: 'Stüdyo şablonu (bu tasarım seçilince stüdyoya dolan değerler)', type: 'sablon' },
      ortak.image, ortak.alt, ortak.position, ortak.published,
    ],
    relations: [
      { name: 'recipients', label: 'Alıcılar', table: 'bb_design_recipients', key: 'design_slug', column: 'recipient_slug', options: 'recipients' },
      { name: 'occasions', label: 'Ek özel günler', table: 'bb_design_occasions', key: 'design_slug', column: 'occasion_slug', options: 'occasions' },
    ],
  },
  studio_option: {
    table: 'bb_studio_options', title: 'Stüdyo seçenekleri', single: 'seçenek', order: 'option_group, position, title',
    group: { name: 'option_group', label: 'Grup', options: GRUPLAR },
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'data', label: 'Görünüm', type: 'veri' },
      ortak.position, ortak.published,
    ],
  },
  price_rule: {
    table: 'bb_price_rules', title: 'Fiyat kuralları', single: 'fiyat kuralı', order: 'kind, product_type_slug, size, min_qty, id',
    numericKey: true,
    ozet: (r) => (r.kind === 'base' ? 'Ürün fiyatı' : 'Ekstra') + ' · ' + (r.product_type_slug || r.option_slug || '') + (r.size ? ' · ' + r.size : '') + ' · ' + r.min_qty + (r.max_qty ? '–' + r.max_qty : '+') + ' adet · ' + Number(r.amount).toLocaleString('tr-TR') + ' ' + r.currency + (r.mode === 'per_order' ? ' / sipariş' : ' / adet'),
    fields: [
      { name: 'kind', input: 'rule_kind', label: 'Kural türü', type: 'select', options: [['base', 'Ürün temel fiyatı'], ['extra', 'Ekstra ücreti']], required: true },
      { name: 'product_type_slug', label: 'Ürün tipi (temel fiyat için)', type: 'select', options: 'product_types', empty: 'Seçin', nullable: true },
      { name: 'size', label: 'Boyut (boş: tüm boyutlar)', type: 'text', max: 40 },
      { name: 'option_slug', label: 'Ekstra (ekstra ücreti için)', type: 'select', options: 'extras', empty: 'Seçin', nullable: true },
      { name: 'min_qty', label: 'En az adet', type: 'number', min: 1 },
      { name: 'max_qty', label: 'En çok adet (boş: sınırsız)', type: 'number', min: 1, nullable: true },
      { name: 'amount', label: 'Tutar (TL)', type: 'decimal', required: true },
      { name: 'mode', label: 'Uygulama', type: 'select', options: [['per_unit', 'Adet başına'], ['per_order', 'Sipariş başına']], required: true },
      { name: 'note', label: 'Not (yalnızca panelde)', type: 'text', max: 200 },
    ],
  },
};

export const sss = {
  table: 'bb_faq', title: 'Sıkça sorulan sorular', single: 'soru', order: 'position, id', numericKey: true,
  ozet: (r) => (r.question.length > 80 ? r.question.slice(0, 77) + '…' : r.question) + (r.published ? '' : ' · Taslak'),
  fields: [
    { name: 'question', label: 'Soru', type: 'text', max: 200, required: true },
    { name: 'answer', label: 'Cevap', type: 'textarea', max: 2000, required: true },
    { name: 'position', label: 'Sıra', type: 'number' },
    { name: 'published', label: 'Yayında', type: 'check' },
  ],
};
katalog.faq = sss;

// Stüdyo seçeneklerinin `data` alanı: grup başına sade alt alanlar (renk seçici, onay kutusu, liste).
// Panel bu tanımdan form çizer, aksiyon aynı tanımla doğrulayıp JSON'a çevirir. Form alanı adı: veri_<ad>.
export const YAZI_TIPLERI = [
  ["'Cormorant Garamond', Georgia, serif", 'Cormorant Garamond (klasik serif)'],
  ["'Playfair Display', Georgia, serif", 'Playfair Display (zarif serif)'],
  ["'Great Vibes', cursive", 'Great Vibes (el yazısı)'],
  ["'Inter', system-ui, sans-serif", 'Inter (modern sans)'],
  ['Georgia, serif', 'Georgia (sistem serif)'],
  ["'Bodoni Moda', Georgia, serif", 'Bodoni Moda'],
  ["'Dancing Script', cursive", 'Dancing Script'],
  ["'Montserrat', sans-serif", 'Montserrat'],
  ['system-ui, sans-serif', 'Sistem yazı tipi'],
];
export const VERI_ALANLARI = {
  chocolate: [
    { ad: 'dolgu', etiket: 'Çikolata rengi', tip: 'renk' },
    { ad: 'kenar', etiket: 'Kenar / gölge rengi', tip: 'renk' },
    { ad: 'karisik', etiket: 'Karışık görünüm (çok renkli; renkler yok sayılır)', tip: 'bayrak' },
  ],
  wrap_color: [
    { ad: 'zemin', etiket: 'Zemin rengi', tip: 'renk' },
    { ad: 'kenar', etiket: 'Kenar rengi', tip: 'renk' },
    { ad: 'metin', etiket: 'Üzerindeki yazı rengi', tip: 'renk' },
  ],
  ribbon: [
    { ad: 'renk', etiket: 'Kurdele rengi', tip: 'renk' },
    { ad: 'yok', etiket: '"Kurdele istemiyorum" seçeneği (renk kullanılmaz)', tip: 'bayrak' },
  ],
  card: [
    { ad: 'zemin', etiket: 'Kart zemini', tip: 'renk' },
    { ad: 'metin', etiket: 'Kart yazısı', tip: 'renk' },
    { ad: 'yok', etiket: '"Kart istemiyorum" seçeneği (renkler kullanılmaz)', tip: 'bayrak' },
  ],
  font: [{ ad: 'css', etiket: 'Yazı tipi', tip: 'secim', secenekler: YAZI_TIPLERI }],
  frame: [{ ad: 'stil', etiket: 'Çizim biçimi', tip: 'secim', secenekler: [['yok', 'Yok'], ['ince', 'İnce çizgi'], ['cift', 'Çift çizgi'], ['kose', 'Köşeler'], ['art-deco', 'Art déco']] }],
  extra: [{ ad: 'varsayilan', etiket: 'Stüdyoda varsayılan olarak seçili gelsin', tip: 'bayrak' }],
  delivery: [],
  quantity: [],
};

// Hazır tasarım şablonu alt alanları (form adı: sablon_<ad>). secenek: panel seçenek listesi adı.
export const SABLON_ALANLARI = [
  { ad: 'isim', etiket: 'Üzerindeki yazı (isim / baş harf)', tip: 'metin', max: 22 },
  { ad: 'not', etiket: 'Kart notu', tip: 'metin', max: 60 },
  { ad: 'font', etiket: 'Yazı tipi', tip: 'secenek', secenek: 'fonts' },
  { ad: 'renk', etiket: 'Yazı rengi', tip: 'renk' },
  { ad: 'ambalaj', etiket: 'Ambalaj rengi', tip: 'secenek', secenek: 'wrap_colors' },
  { ad: 'kurdele', etiket: 'Kurdele', tip: 'secenek', secenek: 'ribbons' },
  { ad: 'kart', etiket: 'Kart', tip: 'secenek', secenek: 'cards' },
  { ad: 'cerceve', etiket: 'Baskı çerçevesi', tip: 'secenek', secenek: 'frames' },
];

export const slugDeseni = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const grupAdi = (slug) => GRUPLAR.find(([g]) => g === slug)?.[1] ?? slug;
