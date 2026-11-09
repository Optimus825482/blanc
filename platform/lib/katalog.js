// Katalog panelinin alan tanımları (plan 1.3). Hem form (app/admin/katalog.js) hem de kaydetme
// aksiyonu (app/admin/actions.js) bu listeden beslenir; sütun adları yalnızca buradan gelir.
// type: text | textarea | number | decimal | check | select | color | tags | json | image
// options: sabit dizi ya da ilişkili tablo adı (occasions, product_types, segments, chocolate)

const KOKLER = [['ozel-gun', 'Kişisel özel gün'], ['mevsim', 'Takvim / mevsim'], ['kurumsal', 'Kurumsal']];
const CIZIM = [['kutu', 'Kutu'], ['bar', 'Bar'], ['tepsi', 'Tepsi']];
const GRUPLAR = [
  ['chocolate', 'Çikolata tipi'], ['wrap_color', 'Ambalaj rengi'], ['ribbon', 'Kurdele'], ['card', 'Kart'],
  ['font', 'Yazı tipi'], ['extra', 'Ekstra'], ['delivery', 'Teslim şekli'], ['quantity', 'Adet'],
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
      { name: 'suggested', label: 'Önerilen stüdyo seçimleri (JSON: ambalaj, kurdele, cikolata)', type: 'json' },
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
      { ...ortak.image, label: 'Altlık fotoğrafı (stüdyo gerçek görsel zemini)' }, ortak.alt, ortak.position, ortak.published,
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
      ortak.image, ortak.alt, ortak.position, ortak.published,
    ],
    relations: [
      { name: 'recipients', label: 'Alıcılar', table: 'bb_design_recipients', column: 'recipient_slug', options: 'recipients' },
      { name: 'occasions', label: 'Ek özel günler', table: 'bb_design_occasions', column: 'occasion_slug', options: 'occasions' },
    ],
  },
  studio_option: {
    table: 'bb_studio_options', title: 'Stüdyo seçenekleri', single: 'seçenek', order: 'option_group, position, title',
    group: { name: 'option_group', label: 'Grup', options: GRUPLAR },
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', max: 120, required: true },
      { name: 'data', label: 'Veri (JSON: renk kodları, css, varsayilan)', type: 'json' },
      ortak.position, ortak.published,
    ],
  },
};

export const slugDeseni = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const grupAdi = (slug) => GRUPLAR.find(([g]) => g === slug)?.[1] ?? slug;
