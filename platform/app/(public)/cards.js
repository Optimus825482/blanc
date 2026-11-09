export default function Cards({ categories }) {
  return <div className="bb-topics">
    {categories.map((category) => <a data-reveal="" className="v-kart" href={'/koleksiyonlar/' + category.slug} key={category.slug}>
      <img src={category.image} alt={category.alt} width="640" height="640" loading="lazy" decoding="async" />
      <h3>{category.title}</h3><p>{category.body}</p>
    </a>)}
  </div>;
}
