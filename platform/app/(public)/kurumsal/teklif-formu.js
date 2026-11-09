import { getOccasions, getProductTypes } from '../../../lib/katalog-oku';
import { ADET_KADEMELERI, BUTCELER } from '../../../lib/teklif';
import { kurumsalTeklif } from './actions';

const HATALAR = {
  alan: 'Firma, yetkili, geçerli bir e-posta, adet kademesi ve bütçe aralığı gerekli.',
  izin: 'Devam etmek için bilgilerinizin teklif amacıyla kullanılmasını onaylamanız gerekir.',
  logo: 'Logo PNG, JPEG veya WebP olmalı ve 5 MB’ı aşmamalı. Vektör (SVG/PDF) logoyu sonra WhatsApp’tan iletebilirsiniz.',
  sik: 'Kısa sürede çok fazla talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.',
  kayit: 'Talep kaydedilemedi. Lütfen tekrar deneyin ya da doğrudan atölyeye yazın.',
};

// Kurumsal teklif formu (plan 3.1): logo, adet kademesi, kişi başı bütçe, numune, hedef tarih.
export default async function TeklifFormu({ hata }) {
  const [urunler, gunler] = await Promise.all([getProductTypes(), getOccasions()]);
  const vesileler = gunler.filter((g) => g.root === 'kurumsal');
  const mesaj = typeof hata === 'string' && Object.hasOwn(HATALAR, hata) ? HATALAR[hata] : null;
  const bugun = new Date(); bugun.setDate(bugun.getDate() + 3);
  const enErken = bugun.toISOString().slice(0, 10);
  return <section className="v-kabuk v-bolum bb-kurumsal" id="kurumsal-teklif">
    <div className="bb-page-intro">
      <p className="v-etiket">Kurumsal teklif</p>
      <h2>Ekibiniz ya da müşterileriniz için teklif isteyin</h2>
      <p>Adet, bütçe ve tarihi yazın; atölye 1 iş günü içinde logolu örnek görsel ve net fiyatla döner. Talebiniz bir takip koduyla kaydedilir.</p>
      {mesaj && <p className="bb-status" role="alert">{mesaj}</p>}
    </div>
    <form className="bb-kurumsal__form" action={kurumsalTeklif} encType="multipart/form-data">
      <div className="bb-kurumsal__izgara">
        <label htmlFor="k-firma">Firma / kurum<input id="k-firma" name="firma" required maxLength="120" autoComplete="organization" /></label>
        <label htmlFor="k-yetkili">Yetkili ad soyad<input id="k-yetkili" name="yetkili" required maxLength="120" autoComplete="name" /></label>
        <label htmlFor="k-eposta">E-posta<input id="k-eposta" name="eposta" type="email" required maxLength="160" autoComplete="email" /></label>
        <label htmlFor="k-telefon">Telefon <small>(isteğe bağlı)</small><input id="k-telefon" name="telefon" type="tel" maxLength="40" autoComplete="tel" placeholder="+90 5xx xxx xx xx" /></label>
        <label htmlFor="k-vesile">Vesile
          <select id="k-vesile" name="vesile" defaultValue="">
            <option value="">Seçiniz</option>
            {vesileler.map((g) => <option key={g.slug} value={g.slug}>{g.title}</option>)}
          </select>
        </label>
        <label htmlFor="k-urun">İlgilendiğiniz ürün
          <select id="k-urun" name="urun" defaultValue="">
            <option value="">Atölye önersin</option>
            {urunler.map((u) => <option key={u.slug} value={u.slug}>{u.title}</option>)}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Adet kademesi</legend>
        <div className="bb-kurumsal__secenekler">
          {ADET_KADEMELERI.map(([k, ad], i) => <label key={k} className="bb-secenek"><input type="radio" name="kademe" value={k} required defaultChecked={i === 0} /> {ad}</label>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>Kişi başı tahmini bütçe</legend>
        <div className="bb-kurumsal__secenekler">
          {BUTCELER.map(([k, ad]) => <label key={k} className="bb-secenek"><input type="radio" name="butce" value={k} required /> {ad}</label>)}
        </div>
      </fieldset>
      <div className="bb-kurumsal__izgara">
        <label htmlFor="k-teslim">Hedef teslim tarihi <small>(isteğe bağlı)</small><input id="k-teslim" name="teslim" type="date" min={enErken} /></label>
        <label htmlFor="k-logo">Logo <small>(PNG, JPEG veya WebP · en fazla 5 MB)</small><input id="k-logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" /></label>
      </div>
      <label htmlFor="k-not">Notlarınız <small>(renk, mesaj, paketleme, teslim adresi…)</small><textarea id="k-not" name="not" maxLength="2000" rows="4" /></label>
      <label className="bb-secenek"><input type="checkbox" name="numune" /> Karar öncesi ücretli numune istiyorum</label>
      <label className="bb-secenek"><input type="checkbox" name="izin" required /> Bilgilerimin yalnızca bu teklif için kullanılmasını onaylıyorum.</label>
      <label className="bb-gizli" aria-hidden="true">Web sitesi<input name="web_sitesi" tabIndex="-1" autoComplete="off" /></label>
      <button className="v-dugme" type="submit">Teklif iste</button>
      <p className="bb-kurumsal__not">Gönderince takip kodunuz ve WhatsApp / Instagram bağlantıları açılır. Logonuz yalnızca örnek görsel için kullanılır.</p>
    </form>
  </section>;
}
