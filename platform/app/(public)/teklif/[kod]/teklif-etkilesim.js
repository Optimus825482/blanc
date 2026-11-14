'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeklifEtkilesim({ kod, anahtar }) {
  const router = useRouter();
  const [notMetin, setNotMetin] = useState('');
  const [durum, setDurum] = useState('');
  const [gonderiyor, setGonderiyor] = useState(false);

  async function ekNotGonder(e) {
    e.preventDefault();
    const temiz = notMetin.trim();
    if (temiz.length < 3) {
      setDurum('Lütfen en az 3 karakterlik bir not yazın.');
      return;
    }
    setGonderiyor(true);
    setDurum('');
    try {
      const res = await fetch('/api/teklif', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kod, anahtar, ekNot: temiz }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDurum(data.hata || 'Not gönderilemedi.');
      } else {
        setNotMetin('');
        setDurum('Ek notunuz / revize talebiniz atölyeye iletildi.');
        router.refresh();
      }
    } catch {
      setDurum('Bağlantı hatası; lütfen tekrar deneyin.');
    } finally {
      setGonderiyor(false);
    }
  }

  return (
    <div className="bb-teklif__araclar bb-no-print">
      <div className="bb-teklif__yazdir">
        <button type="button" className="v-metin-link" onClick={() => window.print()}>
          🖨 Antetli Teklif Özeti Yazdır / PDF
        </button>
      </div>
      <form className="bb-teklif__eknot-form" onSubmit={ekNotGonder}>
        <label htmlFor="bb-ek-not">Atölyeye ek not veya revize talebi ekle</label>
        <textarea
          id="bb-ek-not"
          rows={2}
          maxLength={500}
          value={notMetin}
          onChange={(e) => setNotMetin(e.target.value)}
          placeholder="Örn. Kurdele rengini bordo yapabilir miyiz veya teslim tarihini öne alabilir miyiz?"
        />
        <button type="submit" className="v-dugme" disabled={gonderiyor}>
          {gonderiyor ? 'Gönderiliyor…' : 'Ek Not Gönder'}
        </button>
        {durum && <p className="bb-status" role="status">{durum}</p>}
      </form>
    </div>
  );
}
