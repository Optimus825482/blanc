import { readFile } from 'node:fs/promises';
import nextEnv from '@next/env';
import pg from 'pg';

nextEnv.loadEnvConfig(process.cwd());
const pool = new pg.Pool();
const client = await pool.connect();
const image = (path) => '/assets/img/instagram/' + path + '.webp';
const content = [
  ['home', 'Özel günlere özel çikolata ve hediyeler', 'Girne Alsancak’taki atölyemizde söz ve nişandan ilk yaş kutlamasına, her güne isminizi taşıyan çikolatalar ve saklanacak hediyeler tasarlıyoruz.', image('nisan/altin-cikolata-aranjmani'), 'Altın ambalajlı çikolatalar ve Beyza Blanc monogramı'],
  ['about', 'Girne Alsancak’ta Beyza Blanc Atölyesi', '2026’da Girne Alsancak’ta açılan atölyemizde, kutlamanızın renklerine ve hikâyesine eşlik edecek çikolata ve hediyeler tasarlıyoruz. İsim, tarih, fotoğraf ve renk seçiminizi bize iletebilirsiniz.', image('atolye/atolye-tanitim'), 'Beyza Blanc atölyesinde çiçekler ve krem hediye kutusu'],
  ['corporate', 'Markanıza özel çikolata kutuları', 'Misafir karşılama, etkinlik ve ekip kutlamaları için markanızın renklerine ve logosuna uyarlanan çikolata kutuları tasarlıyoruz. Gökhan Türk Motors için hazırlanan logo baskılı çikolatalar atölyenin kurumsal çalışmalarından biri.', image('kurumsal/gokhan-turk-motors'), 'Gökhan Türk Motors için hazırlanan Beyza Blanc sunumu']
];
const categories = [
  ['soz-nisan', 'Söz ve Nişan', 'İnci ve kristal çiçek detaylarıyla hazırlanan nişan tepsileri ve isimle kişiselleştirilebilen çikolata sunumları.', image('nisan/kristal-inci-nisan-tepsisi'), 'Kristal çiçek ve inci detaylı nişan tepsisi'],
  ['bebek-hediyelikleri', 'Hoş Geldin Bebek', 'Bebek karşılama için isme özel pleksi kapı süsleri, müzik kutuları ve küçük hatıralar.', image('bebek/isme-ozel-pleksi-kapi-susu'), 'İsme özel pleksi bebek kapı süsü'],
  ['dogum-gunu', 'Doğum Günü', 'İlk yaş kutlamalarından fotoğraflı çikolata kutularına, kişiye özel doğum günü hediyeleri.', image('dogum-gunu/ilk-yas-hatirasi'), 'İlk yaş kutlaması için kişiye özel hatıra'],
  ['kisiye-ozel', 'Kişiye Özel Çikolatalar', 'Bir fotoğrafı, ismi veya kutlama notunu taşıyan özel tasarım çikolatalar ve kutular.', image('kisiye-ozel/fotografli-puzzle-cikolata'), 'Fotoğraflı puzzle çikolata kutusu']
];
try {
  await client.query('BEGIN');
  await client.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
  for (const row of content) {
    await client.query('INSERT INTO bb_content(key,title,body,image,alt) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING', row);
  }
  for (const [index, row] of categories.entries()) {
    await client.query('INSERT INTO bb_categories(slug,title,body,image,alt,position,published) VALUES ($1,$2,$3,$4,$5,$6,true) ON CONFLICT DO NOTHING', [...row, index * 10]);
  }
  await client.query('COMMIT');
  console.log('Beyza Blanc içerik tabloları hazır.');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
