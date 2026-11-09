import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cache } from 'react';
import { getStudioData } from '../../../lib/studio-data';
import StudyoIstemci from './studyo-istemci';

export const metadata = {
  title: 'Kendi Tasarımını Oluştur — Tasarım Stüdyosu',
  description: 'Ürünü, özel günü, renkleri, kutusunu ve üzerindeki yazıyı seç; fotoğrafını yükle, tasarımını canlı gör, özet ekranında onayla ve atölyeden fiyat iste.',
  alternates: { canonical: '/studyo' },
};
export const dynamic = 'force-dynamic';

// Stüdyo gövdesi: eski studyo.html'in <main> içeriği ve onay diyaloğu. Etkileşim public/assets/js/studyo.js'de.
const govde = cache(() => readFile(join(process.cwd(), 'app', '(public)', 'studyo', 'studyo-govde.html'), 'utf8'));

export default async function Studyo() {
  const [html, veri] = await Promise.all([govde(), getStudioData()]);
  return <>
    <link rel="stylesheet" href="/assets/css/studyo-v2.css" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Great+Vibes&display=swap" rel="stylesheet" />
    <StudyoIstemci html={html} veri={veri} />
  </>;
}
