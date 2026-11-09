'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Göstergeyi belirli aralıkla sunucudan yeniler (sekme görünürken).
export default function Yenile({ saniye = 30 }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === 'visible') router.refresh(); }, saniye * 1000);
    return () => clearInterval(id);
  }, [router, saniye]);
  return null;
}
