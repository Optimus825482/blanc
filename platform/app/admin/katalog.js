import { query } from '../../lib/db';
import { grupAdi, katalog } from '../../lib/katalog';
import { deleteCatalog, saveCatalog } from './actions';
import SilDugmesi from './sil-dugmesi';

const onizleme = (yol) => (yol.startsWith('/media/') ? '/admin/media/' + yol.split('/').pop() : yol);

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
      return <label htmlFor={id}>{etiket} (#RRGGBB)<input id={id} name={alan.input || alan.name} defaultValue={deger ?? ''} pattern="#[0-9A-Fa-f]{6}" placeholder="#B08D57" /></label>;
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
        {deger && <img src={onizleme(deger)} alt={item?.alt || ''} width="144" height="144" loading="lazy" />}
        <label htmlFor={id}>{etiket} {deger ? '(değiştirmek için seçin)' : ''}
          <input id={id} type="file" name="image" accept="image/jpeg,image/png,image/webp" />
        </label>
        <small>JPEG, PNG veya WebP · En fazla 5 MB</small>
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

export default async function KatalogBolumleri() {
  const satirlar = {};
  for (const [kind, tanim] of Object.entries(katalog)) {
    satirlar[kind] = (await query(`SELECT * FROM ${tanim.table} ORDER BY ${tanim.order}`)).rows;
  }
  const [alicilar, ozelGunler] = await Promise.all([
    query('SELECT design_slug, recipient_slug FROM bb_design_recipients'),
    query('SELECT design_slug, occasion_slug FROM bb_design_occasions'),
  ]);
  const iliskiler = {};
  for (const r of alicilar.rows) ((iliskiler[r.design_slug] ??= { recipients: [], occasions: [] }).recipients).push(r.recipient_slug);
  for (const r of ozelGunler.rows) ((iliskiler[r.design_slug] ??= { recipients: [], occasions: [] }).occasions).push(r.occasion_slug);
  const cift = (liste) => liste.map((r) => [r.slug, r.title]);
  const secenekler = {
    occasions: cift(satirlar.occasion),
    recipients: cift(satirlar.recipient),
    segments: cift(satirlar.segment),
    product_types: cift(satirlar.product_type),
    chocolate: cift(satirlar.studio_option.filter((o) => o.option_group === 'chocolate')),
    extras: cift(satirlar.studio_option.filter((o) => o.option_group === 'extra')),
  };
  return <>
    <h2 id="katalog">Katalog</h2>
    <p>Özel günler, alıcılar, ürün tipleri, hazır tasarımlar ve stüdyo seçenekleri. Yayında olmayan kayıtlar sitede görünmez.</p>
    {Object.entries(katalog).map(([kind, tanim]) => <section key={kind} id={kind} className="bb-katalog">
      <h3>{tanim.title} <small>({satirlar[kind].length})</small></h3>
      {kind === 'price_rule' && <p className="kucuk">Temel fiyat: ürün tipi + (isteğe bağlı) boyut + adet aralığı için fiyat. Ekstra: seçilen stüdyo ekstrası için ek ücret. Stüdyodaki tahmini fiyat bu kurallardan hesaplanır; kural yoksa tahmin gösterilmez.</p>}
      {satirlar[kind].map((item) => <details key={(item.option_group || '') + (tanim.numericKey ? item.id : item.slug)}>
        <summary>{tanim.ozet ? tanim.ozet(item) : <>{tanim.group ? grupAdi(item.option_group) + ' · ' : ''}{item.title}{'published' in item ? (item.published ? ' · Yayında' : ' · Taslak') : ''}</>}</summary>
        <Duzenleyici kind={kind} tanim={tanim} item={item} secenekler={secenekler} iliskiler={iliskiler[item.slug]} />
      </details>)}
      <details><summary>Yeni {tanim.single} ekle</summary><Duzenleyici kind={kind} tanim={tanim} secenekler={secenekler} /></details>
    </section>)}
  </>;
}
