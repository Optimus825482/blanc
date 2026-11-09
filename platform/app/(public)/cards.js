import Link from 'next/link';

// Özel gün / koleksiyon kartları. Görsel yoksa simge gösterilir; count varsa tasarım sayısı yazılır.
export default function Cards({ categories }) {
  return <div className="bb-topics">
    {categories.map((category) => <Link data-reveal="" className="v-kart" href={'/koleksiyonlar/' + category.slug} key={category.slug}>
      {category.image
        ? <img src={category.image} alt={category.alt} width="640" height="640" loading="lazy" decoding="async" />
        : <span className="bb-topics__simge" aria-hidden="true">{category.icon || '✦'}</span>}
      <h3>{category.title}</h3><p>{category.body}</p>
      {typeof category.count === 'number' && <small className="bb-topics__sayi">{category.count ? category.count + ' hazır tasarım' : 'Stüdyoda tasarlayın'}</small>}
    </Link>)}
  </div>;
}
