import Link from 'next/link';
import { query } from '../../lib/db';
import { getSettings, whatsappLink } from '../../lib/settings';
import { durumAdi, tarihYaz } from '../../lib/teklif';
import Yenile from './yenile';

// Panel açılış sayfası: anlık ziyaretçi, bugün/7 gün, sayfalar, kaynaklar, talepler, kurulum durumu.
// Veri kaynağı: bb_visits (çerezsiz beacon) ve bb_quotes. 30 saniyede bir yenilenir.
const sayi = (n) => Number(n || 0).toLocaleString('tr-TR');
const GUN = { timeZone: 'Europe/Nicosia' };

export default async function Gosterge() {
  const [anlik, bugun, hafta, gunler, sayfalar, kaynaklar, cihazlar, talepler, sonTalepler, yorum, settings] = await Promise.all([
    query("SELECT count(DISTINCT visitor_hash)::int AS n FROM bb_visits WHERE created_at > now() - interval '5 minutes'"),
    query("SELECT count(*)::int AS g, count(DISTINCT visitor_hash)::int AS z FROM bb_visits WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Nicosia') AT TIME ZONE 'Europe/Nicosia'"),
    query("SELECT count(*)::int AS g, count(DISTINCT visitor_hash)::int AS z FROM bb_visits WHERE created_at > now() - interval '7 days'"),
    query(`SELECT to_char(d, 'YYYY-MM-DD') AS gun, coalesce(v.g, 0) AS g, coalesce(v.z, 0) AS z
           FROM generate_series((now() AT TIME ZONE 'Europe/Nicosia')::date - 13, (now() AT TIME ZONE 'Europe/Nicosia')::date, '1 day') d
           LEFT JOIN (SELECT (created_at AT TIME ZONE 'Europe/Nicosia')::date AS gun, count(*)::int AS g, count(DISTINCT visitor_hash)::int AS z
                      FROM bb_visits WHERE created_at > now() - interval '14 days' GROUP BY 1) v ON v.gun = d ORDER BY d`),
    query("SELECT path, count(*)::int AS g FROM bb_visits WHERE created_at > now() - interval '7 days' GROUP BY path ORDER BY g DESC LIMIT 8"),
    query("SELECT coalesce(nullif(referrer_host, ''), 'Doğrudan / yer imi') AS kaynak, count(*)::int AS g FROM bb_visits WHERE created_at > now() - interval '7 days' GROUP BY 1 ORDER BY g DESC LIMIT 6"),
    query("SELECT device, count(*)::int AS g FROM bb_visits WHERE created_at > now() - interval '7 days' GROUP BY device"),
    query(`SELECT count(*) FILTER (WHERE status='new')::int AS yeni, count(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS hafta,
           count(*) FILTER (WHERE kind='corporate' AND created_at > now() - interval '30 days')::int AS kurumsal,
           count(*) FILTER (WHERE kind='personal' AND created_at > now() - interval '30 days')::int AS bireysel FROM bb_quotes`),
    query('SELECT code, kind, status, quantity, created_at, company FROM bb_quotes ORDER BY created_at DESC LIMIT 5'),
    query("SELECT CASE WHEN to_regclass('bb_reviews') IS NULL THEN NULL ELSE (SELECT count(*)::int FROM bb_reviews WHERE NOT approved) END AS bekleyen"),
    getSettings(),
  ]);
  const enCok = Math.max(1, ...gunler.rows.map((g) => g.g));
  const toplamCihaz = cihazlar.rows.reduce((t, c) => t + c.g, 0) || 1;
  const mobil = cihazlar.rows.find((c) => c.device === 'mobil')?.g || 0;
  const kurulum = [
    ['WhatsApp numarası', !!whatsappLink(settings), 'ayarlar', 'Stüdyo ve takip sayfalarındaki WhatsApp düğmeleri için'],
    ['Google Analytics', !!settings.ga_measurement_id, 'arama', 'GA4 ölçüm kimliği'],
    ['Google Search Console', !!settings.google_site_verification, 'arama', 'Doğrulama etiketi'],
    ['Bing Webmaster', !!settings.bing_site_verification, 'arama', 'Doğrulama etiketi'],
    ['Yandex Webmaster', !!settings.yandex_verification, 'arama', 'Doğrulama etiketi'],
  ];
  const simdi = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit', ...GUN });
  return <div className="bb-gosterge">
    <Yenile saniye={30} />
    <p className="bb-gosterge__zaman">Canlı · son güncelleme {simdi} · 30 saniyede bir yenilenir</p>
    <div className="bb-kartlar">
      <div className="bb-kart bb-kart--vurgu"><p>Şu an sitede</p><strong>{sayi(anlik.rows[0].n)}</strong><small>son 5 dakikadaki ziyaretçi</small></div>
      <div className="bb-kart"><p>Bugün</p><strong>{sayi(bugun.rows[0].z)}</strong><small>{sayi(bugun.rows[0].g)} sayfa görüntüleme</small></div>
      <div className="bb-kart"><p>Son 7 gün</p><strong>{sayi(hafta.rows[0].z)}</strong><small>{sayi(hafta.rows[0].g)} sayfa görüntüleme · %{Math.round(mobil * 100 / toplamCihaz)} mobil</small></div>
      <div className="bb-kart"><p>Yeni talep</p><strong>{sayi(talepler.rows[0].yeni)}</strong><small>{sayi(talepler.rows[0].hafta)} talep bu hafta · 30 günde {sayi(talepler.rows[0].kurumsal)} kurumsal, {sayi(talepler.rows[0].bireysel)} bireysel</small></div>
      {yorum.rows[0].bekleyen !== null && <div className="bb-kart"><p>Onay bekleyen yorum</p><strong>{sayi(yorum.rows[0].bekleyen)}</strong><small><Link href="/admin?bolum=yorumlar">Yorumlar bölümüne git</Link></small></div>}
    </div>

    <div className="bb-gosterge__izgara">
      <section className="bb-panel-kutu">
        <h3>Son 14 gün</h3>
        <div className="bb-cubuklar" role="img" aria-label="Günlük ziyaretçi çubuk grafiği">
          {gunler.rows.map((g) => <div key={g.gun} className="bb-cubuk" title={g.gun + ': ' + g.z + ' ziyaretçi, ' + g.g + ' görüntüleme'}>
            <span style={{ height: Math.max(2, Math.round(g.g * 100 / enCok)) + '%' }} />
            <small>{g.gun.slice(8)}</small>
          </div>)}
        </div>
        <p className="kucuk">Çubuk: sayfa görüntüleme. Üzerine gelince gün ve ziyaretçi sayısı.</p>
      </section>
      <section className="bb-panel-kutu">
        <h3>En çok görüntülenen sayfalar <small>(7 gün)</small></h3>
        {sayfalar.rows.length ? <ol className="bb-liste">{sayfalar.rows.map((s) => <li key={s.path}><a href={s.path} target="_blank" rel="noopener">{s.path}</a><b>{sayi(s.g)}</b></li>)}</ol> : <p className="kucuk">Henüz veri yok. Vitrin ziyaret edildikçe dolar.</p>}
      </section>
      <section className="bb-panel-kutu">
        <h3>Nereden geliyorlar <small>(7 gün)</small></h3>
        {kaynaklar.rows.length ? <ol className="bb-liste">{kaynaklar.rows.map((k) => <li key={k.kaynak}><span>{k.kaynak}</span><b>{sayi(k.g)}</b></li>)}</ol> : <p className="kucuk">Henüz veri yok.</p>}
      </section>
      <section className="bb-panel-kutu">
        <h3>Son talepler</h3>
        {sonTalepler.rows.length ? <ol className="bb-liste">{sonTalepler.rows.map((t) => <li key={t.code}><span>{t.code} · {t.kind === 'corporate' ? (t.company?.firma || 'Kurumsal') : t.quantity + ' adet'}</span><b>{durumAdi(t.status)}</b><small>{tarihYaz(t.created_at)}</small></li>)}</ol> : <p className="kucuk">Henüz talep yok.</p>}
        <Link href="/admin?bolum=talepler">Tüm talepler →</Link>
      </section>
      <section className="bb-panel-kutu">
        <h3>Kurulum durumu</h3>
        <ul className="bb-kurulum">
          {kurulum.map(([ad, tamam, bolum, not]) => <li key={ad} data-tamam={tamam ? '1' : '0'}>
            <span aria-hidden="true">{tamam ? '✓' : '○'}</span><Link href={'/admin?bolum=' + bolum}>{ad}</Link><small>{tamam ? 'Ayarlı' : not}</small>
          </li>)}
        </ul>
      </section>
    </div>
    <p className="kucuk">Ziyaret ölçümü çerez kullanmaz: kimlik gün + adres + tarayıcıdan türetilir ve ertesi gün değişir; kişisel veri saklanmaz. Google Analytics ayrıca kurulursa onun raporları Google hesabınızda görünür.</p>
  </div>;
}
