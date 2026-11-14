import Image from 'next/image';
import { contact } from '../../lib/seo';

export default function ContentPage({ item, children, cta }) {
  return <section className="v-kabuk v-acilis bb-inner-page">
    <div className="bb-prose" data-reveal=""><p className="v-etiket">Beyza Blanc · Girne Alsancak</p>
      <h1>{item.title}</h1><p>{item.body}</p>
      <a className="v-dugme" href={cta?.href ?? contact}>{cta?.label ?? 'Atölyeye yaz'}</a>
      {children}
    </div>
    <Image data-reveal="" className="bb-detail-image" src={item.image} alt={item.alt} width={640} height={640} sizes="(max-width: 900px) 100vw, 45vw" priority unoptimized={item.image.startsWith('/media/')} />
  </section>;
}
