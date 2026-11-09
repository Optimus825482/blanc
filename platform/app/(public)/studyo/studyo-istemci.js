'use client';

import { useEffect } from 'react';

// Stüdyo betikleri (config → main → studyo) sırayla yüklenir; veri tablolardan gelir ve
// betiklerin beklediği window.BEYZA_DATA olarak verilir. Her ziyarette yeniden çalışır,
// böylece istemci tarafı gezinmede de stüdyo kurulur.
const BETIKLER = ['/assets/js/config.js', '/assets/js/main.js', '/assets/js/studyo.js'];

function yukle(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src + '?v=' + encodeURIComponent(process.env.NEXT_PUBLIC_BUILD_ID || '1');
    s.onload = resolve;
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
}

export default function StudyoIstemci({ html, veri }) {
  useEffect(() => {
    let iptal = false;
    document.body.setAttribute('data-sayfa', 'studyo');
    window.BEYZA_DATA = veri;
    (async () => {
      for (const src of BETIKLER) {
        if (iptal) return;
        await yukle(src);
      }
    })().catch((e) => console.error('Stüdyo betiği yüklenemedi:', e.message));
    return () => {
      iptal = true;
      document.body.removeAttribute('data-sayfa');
      document.querySelectorAll('script[src^="/assets/js/"]').forEach((s) => s.remove());
    };
  }, [veri]);
  return <div className="studyo-govde" dangerouslySetInnerHTML={{ __html: html }} />;
}
