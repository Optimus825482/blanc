import env from '@next/env';
import pg from 'pg';

// Eklemeli, tekrar çalıştırılabilir katalog paketi. Panelde değiştirilen kayıtları ezmez.
env.loadEnvConfig(process.cwd());
const pool = new pg.Pool();
const client = await pool.connect();
const colors = [
  ['adacayi', 'Adaçayı', '#D6E0CD', '#425241'], ['lavanta', 'Lavanta', '#E0D5EC', '#514264'],
  ['gok-mavisi', 'Gök mavisi', '#D2E4EE', '#2C475B'], ['seftali', 'Şeftali', '#F2D4BD', '#694331'],
  ['gul-kurusu', 'Gül kurusu', '#BE8D98', '#361B28'], ['lacivert', 'Gece laciverti', '#263B56', '#FFF5DF'],
  ['tas-grisi', 'Taş grisi', '#D7D2CA', '#3F3B36'], ['kakao', 'Kakao', '#65463A', '#FFF1DF'],
];
const ribbons = [['pudra', 'Pudra saten', '#D6A6B1'], ['lavanta', 'Lavanta saten', '#B8A4D1'], ['adacayi', 'Adaçayı saten', '#A2B693'], ['lacivert', 'Lacivert saten', '#33496B'], ['gumus', 'Gümüş saten', '#CDD0D4']];
const fonts = [['bodoni', 'Moda · Bodoni', "'Bodoni Moda', Georgia, serif"], ['dancing', 'Samimi · Dancing Script', "'Dancing Script', cursive"], ['montserrat', 'Geometrik · Montserrat', "'Montserrat', sans-serif"]];
const frames = [['yok', 'Çerçevesiz'], ['ince', 'İnce çizgi'], ['cift', 'Çift çizgi'], ['kose', 'Zarif köşeler'], ['art-deco', 'Art déco']];
const styles = [
  ['inci-zarafet', 'İnci Zarafeti', 'soz-nisan', 'fildisi', 'krem', 'elyazi', 'ince', 'Elif & Mert', 'Bir ömür birlikte', 'romantik'],
  ['ada-bahcesi', 'Ada Bahçesi', 'dugun', 'adacayi', 'krem', 'playfair', 'kose', 'Ayşe & Deniz', 'En güzel günümüzden bir hatıra', 'botanik'],
  ['minik-mucize', 'Minik Mucize', 'hos-geldin-bebek', 'gok-mavisi', 'gumus', 'dancing', 'cift', 'Hoş geldin Atlas', 'Küçük eller, büyük mutluluk', 'pastel'],
  ['lavanta-dusu', 'Lavanta Düşü', 'dogum-gunu', 'lavanta', 'lavanta', 'dancing', 'ince', 'İyi ki varsın', 'Yeni yaşın güzelliklerle dolsun', 'pastel'],
  ['seftali-mutlulugu', 'Şeftali Mutluluğu', 'tesekkur-tebrik', 'seftali', 'krem', 'montserrat', 'yok', 'Çok teşekkürler', 'İnceliğiniz için küçük bir teşekkür', 'minimal'],
  ['gece-imzasi', 'Gece İmzası', 'kurumsal', 'lacivert', 'gumus', 'montserrat', 'art-deco', 'Markanıza özel', 'Birlikte nice başarılara', 'modern'],
  ['gul-hatirasi', 'Gül Hatırası', 'sevgililer', 'gul-kurusu', 'pudra', 'elyazi', 'cift', 'Seninle güzel', 'Her anımız ayrı bir hatıra', 'romantik'],
  ['altin-basari', 'Altın Başarı', 'mezuniyet', 'antik-altin', 'siyah', 'bodoni', 'art-deco', 'Yeni başlangıçlara', 'Yolun hep açık olsun', 'klasik'],
];
const products = [['madlen-kutu', 'Madlen Kutusu', '16'], ['hediye-kutusu', 'Hediye Kutusu', '9'], ['bar', 'Çikolata Bar', '100 g'], ['tepsi', 'Sunum Tepsisi', 'Tek kat']];
const totals = { options: 0, designs: 0 };
try {
  await client.query('BEGIN');
  const options = [
    ...colors.map(([slug, title, zemin, metin]) => ['wrap_color', slug, title, { zemin, metin, kenar: metin }]),
    ...ribbons.map(([slug, title, renk]) => ['ribbon', slug, title, { renk }]),
    ...fonts.map(([slug, title, css]) => ['font', slug, title, { css }]),
    ...frames.map(([slug, title]) => ['frame', slug, title, { stil: slug }]),
  ];
  for (const [i, [group, slug, title, data]] of options.entries()) {
    const result = await client.query('INSERT INTO bb_studio_options(option_group,slug,title,data,position,published) VALUES($1,$2,$3,$4,$5,true) ON CONFLICT DO NOTHING', [group, slug, title, data, 100 + i]);
    totals.options += result.rowCount;
  }
  for (const [i, s] of styles.entries()) {
    const [slug, title, occasion, wrap, ribbon, font, frame, name, note, tag] = s;
    for (const [j, [product, productName, size]] of products.entries()) {
      const id = 'studyo-' + slug + '-' + product;
      const template = { isim: name, not: note, font, ambalaj: wrap, kurdele: ribbon, kart: 'beyaz-altin', cerceve: frame };
      const result = await client.query(`INSERT INTO bb_designs
        (slug,title,summary,body,occasion_slug,product_type_slug,size,chocolate,tags,template,position,published,is_new,alt)
        VALUES($1,$2,$3,$4,$5,$6,$7,'karisik',$8,$9,$10,true,true,$11) ON CONFLICT DO NOTHING`,
      [id, title + ' · ' + productName, 'Kişiselleştirilebilir dijital şablon · ' + tag + ' renk ve yazı uyumu.',
        title + ' tasarımını isim, not, yazı tipi, çerçeve ve renklerle kişiselleştirin. Görsel dijital ürün maketidir; malzeme, renk ve üretim uygunluğu atölyeyle netleştirilir.',
        occasion, product, size, ['stüdyo şablonu', tag], template, 300 + i * 4 + j, title + ' ' + productName + ' dijital tasarım maketi']);
      totals.designs += result.rowCount;
    }
  }
  await client.query('COMMIT');
  console.log(JSON.stringify(totals));
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally { client.release(); await pool.end(); }
