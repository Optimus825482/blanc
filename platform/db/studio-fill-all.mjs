import env from '@next/env';
import pg from 'pg';

// Tüm ürün × özel gün eşleşmeleri için en az 3 hazır şablon sağlar; mevcut kayıtları ezmez.
env.loadEnvConfig(process.cwd());
const pool = new pg.Pool();
const client = await pool.connect();

const PRODUCTS = [
  ['madlen-kutu', 'Madlen Kutusu', '16'],
  ['hediye-kutusu', 'Hediye Kutusu', '9'],
  ['bar', 'Çikolata Bar', '100 g'],
  ['tepsi', 'Sunum Tepsisi', 'Tek kat'],
];

const VARIANTS = [
  { key: 'klasik', label: 'Klasik Altın', wrap: 'krem', ribbon: 'altin', font: 'serif', frame: 'ince', tag: 'klasik' },
  { key: 'romantik', label: 'Romantik Pastel', wrap: 'pudra', ribbon: 'krem', font: 'elyazi', frame: 'cift', tag: 'romantik' },
  { key: 'modern', label: 'Modern İmza', wrap: 'lacivert', ribbon: 'gumus', font: 'montserrat', frame: 'art-deco', tag: 'modern' },
  { key: 'botanik', label: 'Botanik Zarafet', wrap: 'adacayi', ribbon: 'krem', font: 'playfair', frame: 'kose', tag: 'botanik' },
  { key: 'bordo', label: 'Bordo Asalet', wrap: 'bordo', ribbon: 'altin', font: 'bodoni', frame: 'cift', tag: 'asalet' },
];

const OCCASION_COPY = {
  'dogum-gunu': [
    ['İyi ki doğdun', 'Yeni yaşın güzelliklerle dolsun'],
    ['Nice mutlu yıllara', 'Sevgi ve mutlulukla'],
    ['Yeni yaşın kutlu olsun', 'Her anın tatlı bir hatıra'],
  ],
  'hos-geldin-bebek': [
    ['Hoş geldin bebek', 'Küçük eller, büyük mutluluk'],
    ['Minik mucizemiz', 'Sağlık ve neşeyle büyü'],
    ['Dünyamıza hoş geldin', 'Ömrün hep aydınlık olsun'],
  ],
  'soz-nisan': [
    ['Elif & Mert', 'Bir ömür birlikte'],
    ['Sözümüz söz', 'En güzel başlangıcımız'],
    ['Sonsuza dek', 'Mutluluğa ilk adım'],
  ],
  'dugun': [
    ['Ayşe & Deniz', 'En güzel günümüzden hatıra'],
    ['Bir ömür boyu', 'Sevgiyle paylaşılan anılar'],
    ['Mutluluğumuza ortak olun', 'Teşekkürlerimizle'],
  ],
  'evlilik-yildonumu': [
    ['Nice yıllara', 'Her yıl daha da güzel'],
    ['Birlikte nice senelere', 'İlk günkü heyecanla'],
    ['Yıl dönümümüz kutlu olsun', 'Aşkımızla daim'],
  ],
  'yeni-ev': [
    ['Yeni yuvanız hayırlı olsun', 'Huzur ve bereketle'],
    ['Hoş geldiniz', 'Güzel anılar biriktirin'],
    ['Evinize neşe dolsun', 'Sevgiyle tebrikler'],
  ],
  'mezuniyet': [
    ['Yeni başlangıçlara', 'Yolun hep açık olsun'],
    ['Tebrikler mezun', 'Başarıların daim olsun'],
    ['Gurur günümüz', 'Geleceğin parlak olsun'],
  ],
  'tesekkur-tebrik': [
    ['Çok teşekkürler', 'İnceliğiniz için minnettarız'],
    ['Gönülden teşekkür', 'Değerli katkılarınız için'],
    ['Tebrik ederiz', 'Başarılarınızın devamını dileriz'],
  ],
  'gecmis-olsun': [
    ['Geçmiş olsun', 'Acil şifalar dileriz'],
    ['Çabuk iyileş', 'Güzel günler yakında'],
    ['Yanınızdayız', 'Sağlık ve huzurla'],
  ],
  'her-zaman': [
    ['Sevgiyle', 'Her anı tatlandıran bir jest'],
    ['Sizin için', 'Küçük bir mutluluk'],
    ['Beyza Blanc seçkisi', 'Özenle hazırlandı'],
  ],
  'sevgililer': [
    ['Seninle her an güzel', 'Kalbimden sana'],
    ['Aşkla', 'Her anımız ayrı bir hatıra'],
    ['İyi ki varsın', 'Sevgililer günümüz kutlu olsun'],
  ],
  'anneler-babalar': [
    ['İyi ki varsınız', 'Sevginiz en büyük hediyemiz'],
    ['Canım ailem', 'Sonsuz teşekkürlerimle'],
    ['Minnetle ve sevgiyle', 'Her zaman baş tacımızsınız'],
  ],
  'ogretmenler-gunu': [
    ['Değerli öğretmenim', 'Emeğiniz ve sabrınız için teşekkürler'],
    ['Öğretmenler gününüz kutlu olsun', 'Işığınız hiç sönmesin'],
    ['Saygı ve minnetle', 'İyi ki varsınız'],
  ],
  'bayram': [
    ['İyi bayramlar', 'Sevdiklerinizle nice güzel günlere'],
    ['Mutlu yıllar', 'Sağlık, huzur ve bereketle'],
    ['Bayramınız kutlu olsun', 'Paylaşınca güzelleşen anlar'],
  ],
  'kurumsal': [
    ['Markanıza özel', 'Birlikte nice başarılara'],
    ['Değerli iş ortağımız', 'İş birliğimiz için teşekkürler'],
    ['Ekibimize teşekkürler', 'Güçlü yarınlara birlikte'],
  ],
  'is-yildonumu': [
    ['Birlikte nice yıllara', 'Değerli emeğiniz için teşekkürler'],
    ['İş yıl dönümünüz kutlu olsun', 'Nice başarılara'],
    ['Teşekkürlerimizle', 'Katkılarınız bizim için kıymetli'],
  ],
  'ise-baslama': [
    ['Aramıza hoş geldiniz', 'Birlikte güzel başarılara'],
    ['Yeni göreviniz hayırlı olsun', 'Başarılar dileriz'],
    ['Hoş geldiniz', 'Ekibimize güç kattınız'],
  ],
  'terfi': [
    ['Yeni unvanınız hayırlı olsun', 'Başarılarınızın devamını dileriz'],
    ['Tebrikler', 'Yeni sorumluluğunuzda başarılar'],
    ['Gururla tebrikler', 'Nice yeni zirvelere'],
  ],
  'acilis-toren': [
    ['Açılışınız hayırlı olsun', 'Bol kazanç ve başarılar'],
    ['Bu özel günde yanınızdayız', 'Hayırlı uğurlu olsun'],
    ['Tebriklerimizle', 'Nice güzel başlangıçlara'],
  ],
};

let inserted = 0;
try {
  await client.query('BEGIN');
  const occasions = (await client.query('SELECT slug, title, short_title FROM bb_occasions WHERE published = true ORDER BY position, title')).rows;
  const countsRows = (await client.query('SELECT product_type_slug, occasion_slug, count(*)::int AS n FROM bb_designs WHERE published = true GROUP BY 1, 2')).rows;
  const counts = new Map(countsRows.map((r) => [`${r.product_type_slug}|${r.occasion_slug}`, r.n]));

  let pos = 500;
  for (const [productSlug, productName, size] of PRODUCTS) {
    for (const occ of occasions) {
      const existing = counts.get(`${productSlug}|${occ.slug}`) || 0;
      const needed = Math.max(0, 3 - existing);
      const copyList = OCCASION_COPY[occ.slug] || [
        [occ.short_title || occ.title, 'Özenle hazırlanmış hediye'],
        ['Sevgiyle', 'Her anı tatlandıran bir jest'],
        ['Özel tasarım', 'Sizin için hazırlandı'],
      ];

      for (let idx = 0; idx < needed; idx++) {
        const variant = VARIANTS[(idx + existing) % VARIANTS.length];
        const [isim, not] = copyList[(idx + existing) % copyList.length];
        const slug = `studyo-${occ.slug}-${variant.key}-${productSlug}`;
        const title = `${occ.short_title || occ.title} · ${variant.label} · ${productName}`;
        const template = {
          isim,
          not,
          font: variant.font,
          ambalaj: variant.wrap,
          kurdele: variant.ribbon,
          kart: 'beyaz-altin',
          cerceve: variant.frame,
        };
        const res = await client.query(
          `INSERT INTO bb_designs
            (slug, title, summary, body, occasion_slug, product_type_slug, size, chocolate, tags, template, position, published, is_new, alt)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'karisik', $8, $9, $10, true, false, $11)
           ON CONFLICT (slug) DO NOTHING`,
          [
            slug,
            title,
            `${occ.title} için ${variant.label.toLocaleLowerCase('tr')} şablon.`,
            `${occ.title} temasına uygun ${variant.label.toLocaleLowerCase('tr')} stüdyo şablonu. İsim, not, yazı tipi, çerçeve ve renkleri dilediğiniz gibi düzenleyebilirsiniz.`,
            occ.slug,
            productSlug,
            size,
            ['stüdyo şablonu', variant.tag, occ.slug],
            template,
            pos++,
            `${title} dijital tasarım maketi`,
          ]
        );
        inserted += res.rowCount;
      }
    }
  }
  await client.query('COMMIT');
  console.log(JSON.stringify({ inserted }));
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
