'use client';

import { useEffect } from 'react';

// Menü davranışı: aynı anda tek panel açık kalır; dışarı tıklama ve Escape panelleri kapatır.
export default function MenuDavranisi() {
  useEffect(() => {
    const menu = document.querySelector('.bb-menu');
    if (!menu) return;
    const kapat = (haric) => menu.querySelectorAll('details[open]').forEach((d) => { if (d !== haric) d.removeAttribute('open'); });
    const toggle = (e) => { if (e.target.open) kapat(e.target); };
    const tikla = (e) => { if (!menu.contains(e.target)) kapat(); };
    const tus = (e) => { if (e.key === 'Escape') kapat(); };
    menu.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', toggle));
    document.addEventListener('click', tikla);
    document.addEventListener('keydown', tus);
    return () => {
      menu.querySelectorAll('details').forEach((d) => d.removeEventListener('toggle', toggle));
      document.removeEventListener('click', tikla);
      document.removeEventListener('keydown', tus);
    };
  }, []);
  return null;
}
