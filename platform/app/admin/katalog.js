import fs from 'node:fs';
import path from 'node:path';
import { query } from '../../lib/db';
import { SABLON_ALANLARI, VERI_ALANLARI, grupAdi, katalog } from '../../lib/katalog';
import BaskiAlani from './baski-alani';
import { deleteCatalog, saveCatalog } from './actions';
import SilDugmesi from './sil-dugmesi';

const onizleme = (yol, item) => {
  if (!yol) return '';
  if (yol.startsWith('/media/')) return '/admin/media/' + yol.split('/').pop();
  if (/^\/assets\/img\/urun-[a-z-]+\.svg$/i.test(yol) && item?.slug) return `/assets/img/studyo/templates/${item.slug}.webp`;
  return yol;
};
const hex6 = (v, varsayilan = '#B08D57') => (typeof v === 'string' && /^#[0-9A-Fa-f]{6}$/.test(v) ? v : varsayilan);

function sablonGorselListesi() {
  try {
    const dir = path.join(process.cwd(), 'public', 'assets', 'img', 'studyo', 'templates');
    return fs.readdirSync(dir)
      .filter((f) => f.endsWith('.webp'))
      .sort()
      .map((f) => ['/assets/img/studyo/templates/' + f, f.replace(/\.webp$/, '')]);
  } catch {
    return [];
  }
}

// Stüdyo seçeneğinin görünüm alanları: grup başına renk seçici / onay kutusu / liste (JSON yerine).
function VeriAlanlari({ grup, veri, id }) {
  const alanlar = VERI_ALANLARI[grup] || [];
  if (!alanlar.length) return <p className="kucuk">Bu grup için ek görünüm ayarı yok.</p>;
  const d = veri || {};
  const bayrak = (ad) => ad === 'karisik' ? d.dolgu === 'mix' : ad === 'yok' ? (grup === 'ribbon' ? d.renk === null && 'renk' in d : d.zemin === null && 'zemin' in d) : !!d[ad];
  return <div className="bb-veri__alanlar">
    {alanlar.map((a) => {
      const ida = id + '-' + a.ad;
      if (a.tip === 'renk') return <label key={a.ad} htmlFor={ida} className="bb-renk">{a.etiket}
        <span><input id={ida} type="color" name={'veri_' + a.ad} defaultValue={hex6(d[a.ad])} /> <code>{typeof d[a.ad] === 'string' ? d[a.ad] : '—'}</code></span>
      </label>;
      if (a.tip === 'bayrak') return <label key={a.ad} className="bb-check"><input type="checkbox" name={'veri_' + a.ad} defaultChecked={bayrak(a.ad)} /> {a.etiket}</label>;
      return <label key={a.ad} htmlFor={ida}>{a.etiket}
        <select id={ida} name={'veri_' + a.ad} defaultValue={a.secenekler.some(([v]) => v === d[a.ad]) ? d[a.ad] : a.secenekler[0][0]}>
          {a.secenekler.map(([v, ad]) => <option key={v} value={v} style={{ fontFamily: v }}>{ad}</option>)}
        </select>
      </label>;
    })}
  </div>;
}

function Alan({ alan, item, id, secenekler }) {
  const deger = item?.[alan.name];
  const etiket = alan.label;
  switch (alan.type) {
    case 'check':
      return <label className="bb-check"><input type="checkbox" name={alan.input || alan.name} defaultChecked={!!deger} /> {etiket}</label>;
    case 'textarea':
      return <label htmlFor={id}>{etiket}<textarea id={id} name={alan.input || alan.name} defaultValue={deger ?? ''} maxLength={alan.max} required={alan.required} /></label>;
    case 'number':
      return <label htmlFor={id}>{etiket}<input id={id} type="number" name={alan.input || alan.name} min={alan.min ?? 0} max="10000" defaultValue={deger ?? (alan.nullable ? '' : alan.min ?? 0)} required={!alan.nullable} /></label>;
    case 'decimal':
      return <label htmlFor={id}>{etiket}<input id={id} type="text" inputMode="decimal" name={alan.input || alan.name} defaultValue={deger ?? ''} placeholder="örn. 850" /></label>;
    case 'color':
      return <label htmlFor={id} className="bb-renk">{etiket}
        <span><input id={id} type="color" name={alan.input || alan.name} defaultValue={hex6(deger)} /> <code>{deger || 'varsayılan'}</code></span>
      </label>;
    case 'veri':
      // Mevcut kayıtta grup belli; yeni kayıtta tüm gruplar çizilir, CSS seçili gruba göre gösterir.
      return item ? <VeriAlanlari grup={item.option_group} veri={deger} id={id} />
        : Object.keys(VERI_ALANLARI).map((g) => <div key={g} className="bb-veri" data-grup={g}><VeriAlanlari grup={g} veri={null} id={id + '-' + g} /></div>);
    case 'alan':
      return <BaskiAlani id={id} gorsel={item?.image ? onizleme(item.image) : ''} deger={deger || {}} cizim={item?.draw_type || 'kutu'} />;
    case 'sablon': {
      const t = deger || {};
      return <fieldset className="bb-oneri"><legend>{etiket}</legend>
        {SABLON_ALANLARI.map((a) => {
          const ida = id + '-' + a.ad;
          if (a.tip === 'metin') return <label key={a.ad} htmlFor={ida}>{a.etiket}<input id={ida} name={'sablon_' + a.ad} defaultValue={t[a.ad] || ''} maxLength={a.max} /></label>;
          if (a.tip === 'renk') return <label key={a.ad} htmlFor={ida} className="bb-renk">{a.etiket}
            <span><input id={ida} type="color" name={'sablon_' + a.ad} defaultValue={hex6(t[a.ad], '#3D2016')} /> <code>{t[a.ad] || 'varsayılan'}</code></span>
          </label>;
          return <label key={a.ad} htmlFor={ida}>{a.etiket}
            <select id={ida} name={'sablon_' + a.ad} defaultValue={t[a.ad] || ''}>
              <option value="">Şablonda belirtilmesin</option>
              {(secenekler[a.secenek] || []).map(([v, isim]) => <option key={v} value={v}>{isim}</option>)}
            </select>
          </label>;
        })}
      </fieldset>;
    }
    case 'oneri': {
      const o = deger || {};
      const liste = [['ambalaj', 'Ambalaj rengi', 'wrap_colors'], ['kurdele', 'Kurdele', 'ribbons'], ['cikolata', 'Çikolata', 'chocolate']];
      return <fieldset className="bb-oneri"><legend>{etiket}</legend>
        {liste.map(([ad, baslik, kaynak]) => <label key={ad} htmlFor={id + '-' + ad}>{baslik}
          <select id={id + '-' + ad} name={'oneri_' + ad} defaultValue={o[ad] ?? ''}>
            <option value="">Öneri yok</option>
            {(secenekler[kaynak] || []).map(([v, isim]) => <option key={v} value={v}>{isim}</option>)}
          </select>
        </label>)}
      </fieldset>;
    }
    case 'tags':
      return <label htmlFor={id}>{etiket}<input id={id} name={alan.input || alan.name} defaultValue={Array.isArray(deger) ? deger.join(', ') : ''} maxLength={alan.max} /></label>;
    case 'json':
      return <label htmlFor={id}>{etiket}<textarea id={id} name={alan.input || alan.name} defaultValue={deger ? JSON.stringify(deger, null, 1) : ''} maxLength="2000" spellCheck="false" /></label>;
    case 'select': {
      const liste = Array.isArray(alan.options) ? alan.options : secenekler[alan.options] || [];
      return <label htmlFor={id}>{etiket}
        <select id={id} name={alan.input || alan.name} defaultValue={deger ?? ''} required={alan.required}>
          {(alan.empty || !alan.required) && <option value="">{alan.empty || 'Seçin'}</option>}
          {liste.map(([v, ad]) => <option key={v} value={v}>{ad}</option>)}
        </select>
      </label>;
    }
    case 'image':
      return <>
        {deger && <img src={onizleme(deger, item)} alt={item?.alt || ''} width="144" height="144" loading="lazy" />}
        <label htmlFor={id}>{etiket} {deger ? '(değiştirmek için dosya seçin)' : ''}
          <input id={id} type="file" name="image" accept="image/jpeg,image/png,image/webp" />
        </label>
        <small>JPEG, PNG veya WebP · En fazla 5 MB</small>
        <label htmlFor={id + '-preset'}>Veya hazır şablon görsellerinden seçin
          <select id={id + '-preset'} name="image_preset" defaultValue="">
            <option value="">Mevcut / yüklenen görsel kalsın</option>
            {(secenekler.template_images || []).map(([v, ad]) => <option key={v} value={v}>{ad}</option>)}
          </select>
        </label>
        {deger && <label className="bb-check"><input type="checkbox" name="image_clear" value="1" /> Görseli kaldır (varsayılana dön)</label>}
      </>;
    default:
      return <label htmlFor={id}>{etiket}<input id={id} name={alan.input || alan.name} defaultValue={deger ?? ''} maxLength={alan.max} required={alan.required} /></label>;
  }
}

function Duzenleyici({ kind, tanim, item, secenekler, iliskiler }) {
  const yeni = !item;
  const anahtar = tanim.numericKey ? item?.id : item?.slug;
  const key = yeni ? 'yeni' : (tanim.group ? item[tanim.group.name] + '-' : '') + anahtar;
  const on = `${kind}-${key}`;
  return <form action={saveCatalog}>
    <input type="hidden" name="kind" value={kind} />
    {yeni ? <>
      <input type="hidden" name="new" value="1" />
      {tanim.group && <label htmlFor={on + '-grup'}>{tanim.group.label}
        <select id={on + '-grup'} name={tanim.group.name} required>{tanim.group.options.map(([v, ad]) => <option key={v} value={v}>{ad}</option>)}</select>
      </label>}
      {!tanim.numericKey && <label htmlFor={on + '-key'}>Adres (slug)
        <input id={on + '-key'} name="key" placeholder="ornegin-soz-nisan" required maxLength="72" pattern="[a-z0-9]+(-[a-z0-9]+)*" />
      </label>}
    </> : <>
      <input type="hidden" name="key" value={anahtar} />
      {tanim.group && <input type="hidden" name={tanim.group.name} value={item[tanim.group.name]} />}
    </>}
    {tanim.fields.map((alan) => <Alan key={alan.name} alan={alan} item={item} id={on + '-' + alan.name} secenekler={secenekler} />)}
    {(tanim.relations || []).map((iliski) => <fieldset key={iliski.name}>
      <legend>{iliski.label}</legend>
      {(secenekler[iliski.options] || []).map(([v, ad]) => <label key={v} className="bb-check">
        <input type="checkbox" name={iliski.name} value={v} defaultChecked={!!iliskiler?.[iliski.name]?.includes(v)} /> {ad}
      </label>)}
    </fieldset>)}
    <div className="bb-actions">
      <button className="btn btn--birincil" type="submit">{yeni ? `${tanim.single[0].toLocaleUpperCase('tr-TR')}${tanim.single.slice(1)} ekle` : 'Değişiklikleri kaydet'}</button>
      {!yeni && <SilDugmesi action={deleteCatalog} label={tanim.ozet ? tanim.ozet(item) : item.title} />}
    </div>
  </form>;
}

export default async function KatalogBolumleri({ kinds }) {
  const gosterilen = Object.entries(katalog).filter(([kind]) => !kinds || kinds.includes(kind));
  const satirlar = {};
  for (const [kind, tanim] of Object.entries(katalog)) {
    satirlar[kind] = (await query(`SELECT * FROM ${tanim.table} ORDER BY ${tanim.order}`)).rows;
  }
  const [alicilar, ozelGunler, urunGunleri] = await Promise.all([
    query('SELECT design_slug, recipient_slug FROM bb_design_recipients'),
    query('SELECT design_slug, occasion_slug FROM bb_design_occasions'),
    query('SELECT product_type_slug, occasion_slug FROM bb_product_type_occasions'),
  ]);
  // İlişkiler tür+slug ile anahtarlanır (tasarım ve ürün tipi slug'ları çakışabilir).
  const iliskiler = {};
  for (const r of alicilar.rows) ((iliskiler['design:' + r.design_slug] ??= { recipients: [], occasions: [] }).recipients).push(r.recipient_slug);
  for (const r of ozelGunler.rows) ((iliskiler['design:' + r.design_slug] ??= { recipients: [], occasions: [] }).occasions).push(r.occasion_slug);
  for (const r of urunGunleri.rows) ((iliskiler['product_type:' + r.product_type_slug] ??= { occasions: [] }).occasions).push(r.occasion_slug);
  const cift = (liste) => liste.map((r) => [r.slug, r.title]);
  const secenekler = {
    occasions: cift(satirlar.occasion),
    recipients: cift(satirlar.recipient),
    segments: cift(satirlar.segment),
    product_types: cift(satirlar.product_type),
    chocolate: cift(satirlar.studio_option.filter((o) => o.option_group === 'chocolate')),
    wrap_colors: cift(satirlar.studio_option.filter((o) => o.option_group === 'wrap_color')),
    ribbons: cift(satirlar.studio_option.filter((o) => o.option_group === 'ribbon')),
    extras: cift(satirlar.studio_option.filter((o) => o.option_group === 'extra')),
    cards: cift(satirlar.studio_option.filter((o) => o.option_group === 'card')),
    fonts: cift(satirlar.studio_option.filter((o) => o.option_group === 'font')),
    frames: cift(satirlar.studio_option.filter((o) => o.option_group === 'frame')),
    template_images: sablonGorselListesi(),
  };
  return <>
    {!kinds && <h2 id="katalog">Katalog</h2>}
    <p>Yayında olmayan kayıtlar sitede görünmez.</p>
    {gosterilen.map(([kind, tanim]) => <section key={kind} id={kind} className="bb-katalog">
      <h2>{tanim.title} <small>({satirlar[kind].length})</small></h2>
      {kind === 'price_rule' && <p className="kucuk">Temel fiyat: ürün tipi + (isteğe bağlı) boyut + adet aralığı için fiyat. Ekstra: seçilen stüdyo ekstrası için ek ücret. Stüdyodaki tahmini fiyat bu kurallardan hesaplanır; kural yoksa tahmin gösterilmez.</p>}
      {satirlar[kind].map((item) => <details key={(item.option_group || '') + (tanim.numericKey ? item.id : item.slug)}>
        <summary>{item.image && <img src={onizleme(item.image, item)} alt="" width="24" height="24" style={{ verticalAlign: 'middle', marginRight: '0.5rem', borderRadius: '4px', objectFit: 'cover' }} />}{tanim.ozet ? tanim.ozet(item) : <>{tanim.group ? grupAdi(item.option_group) + ' · ' : ''}{item.title}{'published' in item ? (item.published ? ' · Yayında' : ' · Taslak') : ''}</>}</summary>
        <Duzenleyici kind={kind} tanim={tanim} item={item} secenekler={secenekler} iliskiler={iliskiler[kind + ':' + item.slug]} />
      </details>)}
      <details><summary>Yeni {tanim.single} ekle</summary><Duzenleyici kind={kind} tanim={tanim} secenekler={secenekler} /></details>
    </section>)}
  </>;
}
