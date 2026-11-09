import { contact } from '../../lib/seo';

export default function InstagramFeed({ feed, fallback }) {
  const posts = feed?.posts?.length ? feed.posts : fallback;
  return <section className="v-kabuk v-bolum">
    <div className="v-bolum-baslik" data-reveal=""><div><p className="v-etiket">04 / Instagram</p><h2>Atölyeden seçkiler</h2></div>
      <a className="v-metin-link" href="https://www.instagram.com/beyzablanc/">@beyzablanc ↗</a></div>
    {!!feed?.stories?.length && <div className="bb-stories" aria-label="Instagram hikâyeleri">
      {feed.stories.map(item => <a className="bb-story" href={item.link} key={item.id}>
        <img decoding="async" src={item.image} alt="" width="100" height="100" loading="lazy" referrerPolicy="no-referrer" />
        <span>Hikâyeyi gör ↗</span>
      </a>)}
    </div>}
    <div className="v-kartlar">{posts.map(item => <a className="v-kart" data-reveal="" key={item.id} href={item.link}>
      <img decoding="async" src={item.image} width="640" height="640" alt="" loading="lazy" referrerPolicy="no-referrer" />
      <div className="v-kart-metin"><h3>{item.caption || 'Instagram gönderisini gör'}</h3><span aria-hidden="true">↗</span></div>
    </a>)}</div>
    <p className="v-eylemler"><a className="v-dugme" href={contact}>Tasarımınızı konuşalım</a></p>
  </section>;
}
