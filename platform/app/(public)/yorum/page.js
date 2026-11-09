import { query } from '../../../lib/db';
import { pageMetadata } from '../../../lib/seo';
import { yorumGonder } from './actions';

export const metadata = pageMetadata('Deneyiminizi yazın', 'Beyza Blanc ile yaşadığınız deneyimi paylaşın. Yorumlar atölye tarafından onaylandıktan sonra yayınlanır.', '/yorum');

const MESAJLAR = {
  tesekkur: 'Teşekkürler! Yorumunuz alındı; onaylandıktan sonra yayınlanır.',
  alan: 'Lütfen adınızı, puanınızı ve en az 10 karakterlik yorumunuzu girin.',
  sik: 'Çok sık deneme yapıldı. Lütfen 15 dakika sonra yeniden deneyin.',
};

export default async function Yorum({ searchParams }) {
  const [{ durum }, { rows: ozelGunler }] = await Promise.all([
    searchParams,
    query('SELECT slug, title FROM bb_occasions WHERE published ORDER BY position, title'),
  ]);
  return <section className="v-kabuk v-bolum bb-inner-page">
    <div className="bb-page-intro">
      <p className="v-etiket">Deneyiminiz</p>
      <h1>Yorumunuzu yazın</h1>
      <p>Yorumlar atölye tarafından okunur ve onaylandıktan sonra sitede yayınlanır.</p>
    </div>
    {MESAJLAR[durum] && <p className="bb-status" role="status">{MESAJLAR[durum]}</p>}
    <form className="bb-kurumsal__form bb-yorum__form" action={yorumGonder}>
      <label className="bb-gizli" aria-hidden="true">Web sitesi<input name="web_sitesi" tabIndex="-1" autoComplete="off" /></label>
      <label>Adınız<input name="ad" required minLength={2} maxLength={60} autoComplete="name" /></label>
      <label>Puanınız
        <select name="puan" required defaultValue="5">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} yıldız</option>)}</select>
      </label>
      <label>Özel gün <small>(isteğe bağlı)</small>
        <select name="ozel_gun" defaultValue="">
          <option value="">Seçin</option>
          {ozelGunler.map((o) => <option key={o.slug} value={o.slug}>{o.title}</option>)}
        </select>
      </label>
      <label>Yorumunuz <small>(10–600 karakter)</small>
        <textarea name="yorum" required minLength={10} maxLength={600} rows={5} />
      </label>
      <button className="v-dugme" type="submit">Gönder</button>
    </form>
  </section>;
}
