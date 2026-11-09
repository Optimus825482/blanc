'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Her sayfa geçişinde /api/ziyaret'e çerezsiz bir sinyal gönderir (panel göstergesi için).
export default function ZiyaretOlcer() {
  const yol = usePathname();
  useEffect(() => {
    if (!yol || typeof navigator === 'undefined') return;
    const veri = JSON.stringify({ yol, kaynak: document.referrer || '', cihaz: window.innerWidth < 768 ? 'mobil' : 'masaustu' });
    try {
      if (!navigator.sendBeacon?.('/api/ziyaret', new Blob([veri], { type: 'application/json' }))) {
        fetch('/api/ziyaret', { method: 'POST', body: veri, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {});
      }
    } catch { /* ölçüm hiçbir zaman sayfayı bozmasın */ }
  }, [yol]);
  return null;
}
