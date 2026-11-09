import 'server-only';
import { cache } from 'react';
import { query } from './db';
import { getSettings } from './settings';

// Stüdyo ve vitrin betiklerinin beklediği BEYZA_DATA biçimini (eski data.js) tablolardan üretir.
// Alan adları Türkçe kalır; böylece public/assets/js/studyo.js değişmeden tablolardan beslenir.
const camel = (slug) => slug.replace(/-([a-z0-9])/g, (_, h) => h.toUpperCase());

export const getStudioData = cache(async () => {
  const [occasions, recipients, segments, types, designs, recipientLinks, options, settings] = await Promise.all([
    query('SELECT * FROM bb_occasions WHERE published ORDER BY position, title'),
    query('SELECT * FROM bb_recipients WHERE published ORDER BY position, title'),
    query('SELECT * FROM bb_segments ORDER BY position, title'),
    query('SELECT * FROM bb_product_types WHERE published ORDER BY position, title'),
    query('SELECT * FROM bb_designs WHERE published ORDER BY position, title'),
    query('SELECT design_slug, recipient_slug FROM bb_design_recipients'),
    query('SELECT * FROM bb_studio_options WHERE published ORDER BY option_group, position, title'),
    getSettings(),
  ]);
  const alicilar = {};
  for (const r of recipientLinks.rows) (alicilar[r.design_slug] ??= []).push(r.recipient_slug);
  const grup = (ad, donustur) => options.rows.filter((o) => o.option_group === ad).map((o) => ({ id: o.slug, ad: o.title, ...donustur(o.data || {}) }));

  return {
    temalar: occasions.rows.map((o) => ({
      id: o.slug, ad: o.title, kisa: o.short_title, aciklama: o.body, ikon: o.icon, kok: o.root,
      vurgu: o.accent || '#B08D57', oneri: o.suggested || {}, gorsel: o.image, gorselAlt: o.alt,
    })),
    kime: recipients.rows.map((r) => ({ id: r.slug, ad: r.title, kisa: r.short_title, aciklama: r.body })),
    segmentler: segments.rows.map((s) => ({ id: s.slug, ad: s.title, aciklama: s.body })),
    tasarimlar: designs.rows.map((t) => ({
      id: t.slug, ad: t.title, tema: t.occasion_slug, urun: t.product_type_slug, boyut: t.size, cikolata: t.chocolate,
      kime: alicilar[t.slug] || [], segment: t.segment_slug || '', cokSatan: t.bestseller, yeni: t.is_new, oneCikan: t.featured,
      ozet: t.summary, etiketler: t.tags || [], gorsel: t.image, gorselAlt: t.alt,
      baslangicFiyat: t.starting_price === null ? null : Number(t.starting_price),
    })),
    studyo: {
      urunTipleri: types.rows.map((u) => ({ id: u.slug, ad: u.title, ozet: u.body, tip: u.draw_type, boyutlar: u.sizes || [], altlik: u.image })),
      cikolataTipleri: grup('chocolate', ({ dolgu, kenar }) => ({ dolgu, kenar })),
      ambalajRenkleri: grup('wrap_color', ({ zemin, kenar, metin }) => ({ zemin, kenar, metin })),
      kurdeler: grup('ribbon', ({ renk }) => ({ renk: renk ?? null })),
      kartlar: grup('card', ({ zemin, metin }) => ({ zemin: zemin ?? null, metin: metin ?? null })),
      fontlar: grup('font', ({ css }) => ({ css })),
      ekstralar: grup('extra', ({ varsayilan }) => ({ varsayilan: !!varsayilan })).map((e) => ({ ...e, id: camel(e.id) })),
      teslimSekilleri: grup('delivery', () => ({})),
      adetler: grup('quantity', () => ({})).map((a) => a.id),
      kurumsalAdetNotu: settings.studio_corporate_qty_note || '',
    },
    yorumlar: [],
  };
});
