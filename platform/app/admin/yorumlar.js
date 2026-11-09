import { query } from '../../lib/db';
import SilDugmesi from './sil-dugmesi';
import { deleteReview, moderateReview } from './actions';

// Panel: müşteri yorumları. Yalnızca onaylananlar sitede görünür.
export default async function Yorumlar() {
  const { rows } = await query(`
    SELECT r.id, r.name, r.text, r.rating, r.approved, o.title AS occasion_title
    FROM bb_reviews r LEFT JOIN bb_occasions o ON o.slug = r.occasion_slug
    ORDER BY r.approved, r.created_at DESC LIMIT 200`);
  const bekleyen = rows.filter((r) => !r.approved).length;
  return <>
    <h2 id="yorumlar">Yorumlar {bekleyen ? <small>({bekleyen} onay bekliyor)</small> : null}</h2>
    <p>Onaylanan yorumlar ana sayfadaki “Sizden gelenler” bölümünde görünür.</p>
    {!rows.length && <p className="bb-status">Henüz yorum yok.</p>}
    {rows.map((r) => <article key={r.id} className="bb-yorum-satir">
      <p><strong>{r.name}</strong> · {'★'.repeat(r.rating)} · {r.occasion_title || 'özel gün belirtilmedi'} · {r.approved ? 'Yayında' : 'Onay bekliyor'}</p>
      <p>{r.text}</p>
      <form action={moderateReview} className="bb-yanit">
        <input type="hidden" name="id" value={r.id} />
        <button className="btn btn--birincil" type="submit" name="op" value={r.approved ? 'gizle' : 'onayla'}>{r.approved ? 'Yayından kaldır' : 'Onayla'}</button>
        <SilDugmesi action={deleteReview} label="Bu yorum" />
      </form>
    </article>)}
  </>;
}
