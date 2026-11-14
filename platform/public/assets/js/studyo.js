/* ==========================================================================
   Beyza Blanc — tasarım stüdyosu
   Tarayıcıda çalışır: seçimler canvas üzerinde canlı önizlenir, tasarım PNG
   olarak üretilir ve özet metniyle birlikte Instagram'a aktarılır.
   Önizleme cihazda işlenir; kullanıcı teklif gönderdiğinde görsel sunucuya kaydedilir.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.BEYZA;
  var D = window.BEYZA_DATA;
  var UI = window.BEYZA_UI;

  var OLCO = (C.studyo && C.studyo.olcu) || 1000;
  var canvas = document.getElementById('onizleme');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var durumEl = document.getElementById('studyo-durum');
  var ozetEl = document.getElementById('studyo-ozet');
  var fotograf = null; // { img: HTMLImageElement, ad: string }
  var kontrolleriYansit = function () {};
  var gecmis = [];
  var gecmisKonum = -1;
  var geriYukleniyor = false;
  var gecmisHazir = false;
  var sonDuzenleme = { alan: null, zaman: 0 };
  var adimaGit = function () {};
  var ilkTasarim = null;

  /* ----------------------------- Başlangıç durumu ----------------------- */

  var durum = {
    sablon: '',
    cerceve: 'yok',
    yaziRenk: '',
    // Yazı ve logo konumu baskı alanına oranla (0–1); olcek kaydırıcıdan.
    yerlesim: { yazi: { x: 0.5, y: 0.5, olcek: 1 }, foto: { x: 0.78, y: 0.76, olcek: 1 } },
    urun: D.studyo.urunTipleri[0].id,
    boyut: D.studyo.urunTipleri[0].boyutlar[1],
    tema: D.temalar[0].id,
    cikolata: 'karisik',
    ambalaj: 'krem',
    kurdele: 'altin',
    kart: 'beyaz-altin',
    font: 'serif',
    isim: '',
    tarih: '',
    mesaj: '',
    aliciAdi: '',
    teslimSekli: (D.studyo.teslimSekilleri[0] || {}).id || '',
    teslimTarihi: '',
    teslimNotu: '',
    adet: (C.studyo && C.studyo.varsayilanAdet) || '16',
    ekstralar: D.studyo.ekstralar
      .filter(function (e) {
        return e.varsayilan;
      })
      .map(function (e) {
        return e.id;
      }),
  };

  /* --------------------------- Hazır tasarımdan devral ------------------- */

  var onTasarim = new URLSearchParams(location.search).get('tasarim');
  var tasarim = onTasarim ? UI.tasarimBul(onTasarim) : null;
  if (tasarim) {
    durum.urun = tasarim.urun;
    durum.boyut = tasarim.boyut;
    durum.tema = tasarim.tema;
    durum.cikolata = tasarim.cikolata;
    durum.adet = /^\d+$/.test(String(tasarim.boyut)) ? String(tasarim.boyut) : durum.adet;
    var urunTanimi = UI.urunBul(tasarim.urun);
    if (urunTanimi && urunTanimi.boyutlar.indexOf(tasarim.boyut) === -1) {
      durum.boyut = urunTanimi.boyutlar[0];
    }
    var tema = UI.temaBul(tasarim.tema);
    if (tema && tema.oneri) {
      durum.ambalaj = tema.oneri.ambalaj;
      durum.kurdele = tema.oneri.kurdele;
      durum.cikolata = tema.oneri.cikolata;
    }
    durum.sablon = tasarim.id; // şablon değerleri kontroller kurulunca uygulanır
  }

  // Koleksiyon sayfasından gelen ?tema= : özel gün ve atölye önerisi devralınır.
  var onTema = new URLSearchParams(location.search).get('tema');
  var urlTema = onTema && !tasarim ? UI.temaBul(onTema) : null;
  if (urlTema) {
    durum.tema = urlTema.id;
    if (urlTema.oneri) {
      if (urlTema.oneri.ambalaj) durum.ambalaj = urlTema.oneri.ambalaj;
      if (urlTema.oneri.kurdele) durum.kurdele = urlTema.oneri.kurdele;
      if (urlTema.oneri.cikolata) durum.cikolata = urlTema.oneri.cikolata;
    }
  }

  /* ------------------------------- Yardımcı çizim ------------------------ */

  function secili(id, liste) {
    return liste.filter(function (x) {
      return x.id === id;
    })[0];
  }

  function metinRengi(hexZemin) {
    var h = hexZemin.replace('#', '');
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    var parlaklik = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return parlaklik > 0.6 ? '#4a3020' : '#f7ead9';
  }

  function yuvarlak(ctx2, x, y, g, y2, r) {
    ctx2.beginPath();
    ctx2.moveTo(x + r, y);
    ctx2.arcTo(x + g, y, x + g, y + y2, r);
    ctx2.arcTo(x + g, y + y2, x, y + y2, r);
    ctx2.arcTo(x, y + y2, x, y, r);
    ctx2.arcTo(x, y, x + g, y, r);
    ctx2.closePath();
  }

  function satirlaraBol(metin, enFazlaGenislik) {
    var kelimeler = String(metin).split(/\s+/);
    var satirlar = [];
    var anlik = '';
    kelimeler.forEach(function (k) {
      var deneme = anlik ? anlik + ' ' + k : k;
      if (ctx.measureText(deneme).width <= enFazlaGenislik || !anlik) {
        anlik = deneme;
      } else {
        satirlar.push(anlik);
        anlik = k;
      }
    });
    if (anlik) satirlar.push(anlik);
    return satirlar;
  }

  /** Metni verilen genişliğe sığdırmak için punto küçültür. */
  function sigdir(boyut, font, metin, enFazlaGenislik) {
    var punto = boyut;
    ctx.font = '500 ' + punto + 'px ' + font;
    while (ctx.measureText(metin).width > enFazlaGenislik && punto > 12) {
      punto -= 2;
      ctx.font = '500 ' + punto + 'px ' + font;
    }
    return punto;
  }

  /** Madlen: daire + sarmal doku. */
  /* ------------------------------ Altlık sahneleri ----------------------- */
  // Her ürün tipi için render edilmiş (ileride fotoğraf) bir altlık ve çizim alanı geometrisi.
  // altliklar.json yüklenemezse eski düz çizim geometrisiyle devam edilir.
  var altlikGeo = null;
  var altlikImg = {};
  var VARSAYILAN_GEO = {
    kutu: { dis: { x: 90, y: 150, g: 820, h: 700, r: 26 }, ic: { x: 124, y: 184, g: 752, h: 632, r: 16 } },
    bar: { bar: { x: 190, y: 330, g: 620, h: 300, r: 18 } },
    tepsi: { oval: { cx: 500, cy: 470, rx: 374, ry: 274 } },
  };

  function geo(tip) {
    return (altlikGeo && altlikGeo[tip]) || VARSAYILAN_GEO[tip];
  }

  function altliklariYukle() {
    if (!window.fetch) return;
    fetch('/assets/img/studyo/altliklar.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (json) {
        if (!json) return;
        altlikGeo = json;
        Object.keys(json).forEach(function (tip) {
          if (!json[tip].gorsel) return;
          var img = new Image();
          img.onload = function () { altlikImg[tip] = img; ciz(); };
          img.src = json[tip].gorsel;
        });
      })
      .catch(function () {});
  }
  // Fotoğraf maketleri isteğe göre yüklenir; eski vektör sahneleri ağdan alınmaz.

  /* ------------------------------ Renk yardımcıları ---------------------- */

  function hexRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return { r: 122, g: 74, b: 43 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function karistir(hex, hedef, oran) {
    var a = hexRgb(hex);
    var r = Math.round(a.r + (hedef - a.r) * oran);
    var g = Math.round(a.g + (hedef - a.g) * oran);
    var b = Math.round(a.b + (hedef - a.b) * oran);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function acik(hex, oran) { return karistir(hex, 255, oran); }
  function koyu(hex, oran) { return karistir(hex, 0, oran); }

  function golgeli(fn, renk, bulanik, dx, dy) {
    ctx.save();
    ctx.shadowColor = renk;
    ctx.shadowBlur = bulanik;
    ctx.shadowOffsetX = dx || 0;
    ctx.shadowOffsetY = dy || 0;
    fn();
    ctx.restore();
  }

  /* ------------------------------ Çikolata ------------------------------- */

  function kapsul(x, y, cap, renk) {
    var r = cap * 1.24;
    golgeli(function () {
      ctx.beginPath();
      ctx.arc(x, y + cap * 0.06, r, 0, Math.PI * 2);
      ctx.fillStyle = renk;
      ctx.fill();
    }, 'rgba(40,22,12,0.38)', cap * 0.55, cap * 0.08, cap * 0.22);

    // Pilili kenar
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y + cap * 0.06, r, 0, Math.PI * 2);
    ctx.clip();
    var pili = 40;
    for (var i = 0; i < pili; i++) {
      var a = (Math.PI * 2 * i) / pili;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * cap * 0.98, y + cap * 0.06 + Math.sin(a) * cap * 0.98);
      ctx.lineTo(x + Math.cos(a) * r, y + cap * 0.06 + Math.sin(a) * r);
      ctx.strokeStyle = i % 2 ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.42)';
      ctx.lineWidth = Math.max(1.5, cap * 0.075);
      ctx.stroke();
    }
    // İç çukur gölgesi
    var ic = ctx.createRadialGradient(x, y + cap * 0.06, cap * 0.9, x, y + cap * 0.06, r);
    ic.addColorStop(0, 'rgba(0,0,0,0.0)');
    ic.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = ic;
    ctx.fillRect(x - r, y - r, r * 2, r * 2 + cap);
    ctx.restore();
  }

  function madlen(x, y, cap, dolgu, kenar) {
    if (!dolgu || typeof dolgu !== 'string') dolgu = '#7A4A2B';
    if (!kenar || typeof kenar !== 'string' || kenar === '#00000022') kenar = dolgu;

    // Gövde: temper parlaması sol üstte, kenarda koyulaşma
    golgeli(function () {
      var grad = ctx.createRadialGradient(x - cap * 0.38, y - cap * 0.42, cap * 0.04, x, y, cap * 1.05);
      grad.addColorStop(0, acik(dolgu, 0.34));
      grad.addColorStop(0.35, dolgu);
      grad.addColorStop(0.85, koyu(kenar, 0.22));
      grad.addColorStop(1, koyu(kenar, 0.42));
      ctx.beginPath();
      ctx.arc(x, y, cap, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }, 'rgba(30,15,8,0.45)', cap * 0.35, cap * 0.05, cap * 0.14);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, cap, 0, Math.PI * 2);
    ctx.clip();
    // Kalıp kabartması: eş merkezli halkalar
    for (var i = 1; i <= 3; i++) {
      var rr = cap * (0.3 + i * 0.19);
      ctx.beginPath();
      ctx.arc(x, y, rr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = Math.max(1.5, cap * 0.05);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y + cap * 0.03, rr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = Math.max(1, cap * 0.03);
      ctx.stroke();
    }
    // Speküler parlama
    var spek = ctx.createRadialGradient(x - cap * 0.42, y - cap * 0.46, 0, x - cap * 0.42, y - cap * 0.46, cap * 0.5);
    spek.addColorStop(0, 'rgba(255,255,255,0.55)');
    spek.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    spek.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spek;
    ctx.fillRect(x - cap, y - cap, cap * 2, cap * 2);
    // Kenar ışığı sağ altta
    ctx.beginPath();
    ctx.arc(x, y, cap * 0.93, Math.PI * 0.1, Math.PI * 0.6);
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = Math.max(1.5, cap * 0.06);
    ctx.stroke();

    if (fotograf && durum.ekstralar.indexOf('cikolataUzeriIsim') === -1) {
      ctx.beginPath();
      ctx.arc(x, y, cap * 0.58, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = 0.92;
      ctx.drawImage(fotograf.img, x - cap * 0.58, y - cap * 0.58, cap * 1.16, cap * 1.16);
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    if (durum.ekstralar.indexOf('cikolataUzeriIsim') > -1 && durum.isim) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, cap * 0.92, 0, Math.PI * 2);
      ctx.clip();
      var kisa = durum.isim.length > 12 ? durum.isim.substring(0, 12) : durum.isim;
      var punto = Math.max(11, Math.min(cap * 0.42, (cap * 1.7) / Math.max(6, kisa.length)));
      ctx.font = '600 ' + punto + 'px ' + fontCss();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Kabartma: koyu alt, açık üst
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillText(kisa, x, y + Math.max(1, cap * 0.03));
      ctx.fillStyle = metinRengi(dolgu) === '#3d2016' ? acik(dolgu, 0.55) : acik(dolgu, 0.78);
      ctx.fillText(kisa, x, y);
      ctx.restore();
    }
  }

  function fontCss() {
    var f = secili(durum.font, D.studyo.fontlar);
    return f ? f.css : 'serif';
  }

  function cikolata(sira, cik) {
    if (!cik) return { dolgu: '#7A4A2B', kenar: '#5C351C' };
    if (cik.dolgu === 'mix') {
      var dizi = D.studyo.cikolataTipleri.filter(function (x) { return x.dolgu !== 'mix'; });
      if (!dizi.length) return { dolgu: '#7A4A2B', kenar: '#5C351C' };
      var secilen = dizi[sira % dizi.length];
      return { dolgu: secilen.dolgu, kenar: secilen.kenar };
    }
    return { dolgu: cik.dolgu, kenar: cik.kenar };
  }

  /* --------------------------------- Ana çizim --------------------------- */

  function zeminCiz(tip) {
    var img = altlikImg[tip];
    if (img) {
      ctx.drawImage(img, 0, 0, OLCO, OLCO);
      return;
    }
    var grad = ctx.createRadialGradient(OLCO * 0.38, OLCO * 0.32, OLCO * 0.1, OLCO * 0.5, OLCO * 0.5, OLCO * 0.85);
    grad.addColorStop(0, '#fbf6ee');
    grad.addColorStop(0.6, '#efe6d7');
    grad.addColorStop(1, '#d6c9b4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, OLCO, OLCO);
  }

  function ciz() {
    var amb = secili(durum.ambalaj, D.studyo.ambalajRenkleri);
    var kur = secili(durum.kurdele, D.studyo.kurdeler);
    var kart = secili(durum.kart, D.studyo.kartlar);
    var urun = UI.urunBul(durum.urun);
    var cik = secili(durum.cikolata, D.studyo.cikolataTipleri);
    var tema = UI.temaBul(durum.tema);

    ctx.clearRect(0, 0, OLCO, OLCO);
    canvas.dataset.chocolateCount = '0';
    var tip = cizimTipi(urun);
    var alan = baskiAlani(urun, tip);
    var foto = sablonGorsel(urun);
    var sahne = fotoSahne(urun);
    var malzeme = sahne && tip === 'kutu' ? maketGorseli('/assets/img/studyo/photo-kutu-v1.webp') : true;
    var kurdeleGorsel = kur.renk ? maketGorseli('/assets/img/studyo/photo-ribbon-v1.webp') : true;
    var hazir = !!foto && !!malzeme && !!kurdeleGorsel;
    var hata = !foto && sablonImg[urun.altlik || sahne.yol] === false;
    if (malzeme === false || kurdeleGorsel === false) hata = true;
    canvas.dataset.renderMode = hazir ? (sahne ? 'photo-mockup' : 'product-photo') : hata ? 'error' : 'loading';
    var tekrar = document.getElementById('studio-scene-retry');
    if (tekrar) tekrar.hidden = !hata;
    var aciklama = document.getElementById('onizleme-aciklama');
    if (aciklama) aciklama.textContent = sahne
      ? 'Fotoğraf gerçekçiliğinde dijital maket; gerçek ürün çekimi değildir. İçerik, gramaj ve tepsi katları üretimde netleştirilir.'
      : 'Atölyenin ürün fotoğrafı üzerine dijital kişiselleştirme. Üretim öncesi son onay alınır.';
    if (!hazir) {
      ctx.fillStyle = '#f3ede4'; ctx.fillRect(0, 0, OLCO, OLCO);
      ctx.fillStyle = '#512730'; ctx.font = '26px Georgia'; ctx.textAlign = 'center';
      ctx.fillText(hata ? 'Ürün görseli yüklenemedi' : 'Ürün görseli hazırlanıyor…', OLCO / 2, OLCO / 2);
      katmanKutu.yazi = null; katmanKutu.foto = null;
      return;
    }
    kaplaCiz(foto, 0, 0, OLCO, OLCO);
    yuzeyRengi(sahne ? sahne.renk : alan, amb.zemin);
    if (sahne && tip === 'kutu') fotograflikCikolatalar(malzeme, amb, tema);
    if (sahne && tip === 'tepsi') tepsiEtiketleri(amb, tema);
    // Kişiselleştirme baskı yüzeyinden taşmaz; kâğıt dokusu korunur.
    ctx.save(); ctx.beginPath(); ctx.rect(alan.x, alan.y, alan.g, alan.h); ctx.clip();
    cerceveCiz(alan, amb);
    yaziKatmani(alan, amb, kart);
    fotoKatmani(alan);
    if (durum.mesaj && kart.zemin) {
      ctx.fillStyle = yaziRengi(amb); ctx.textAlign = 'center';
      sigdir(22, fontCss(), durum.mesaj, alan.g * 0.85);
      ctx.fillText(durum.mesaj, alan.x + alan.g / 2, alan.y + alan.h * 0.87);
    }
    ctx.restore();
    if (kur.renk) fotografikKurdele(kurdeleGorsel, kur.renk, sahne ? sahne.kurdele : { x: alan.x, y: alan.y + alan.h * 0.65, g: alan.g });

    // Filigran
    ctx.font = '400 14px Georgia';
    ctx.fillStyle = 'rgba(61,32,22,0.5)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(C.marka + ' · ' + (sahne ? 'dijital maket' : 'tasarım önizlemesi'), 32, OLCO - 22);
    ctx.textAlign = 'right';
    ctx.fillText(tasarimKodu(), OLCO - 32, OLCO - 22);
  }

  function kabartmaYazi(metin, x, y, acikRenk, koyuRenk) {
    ctx.fillStyle = koyuRenk;
    ctx.fillText(metin, x, y + 1.5);
    ctx.fillStyle = acikRenk;
    ctx.fillText(metin, x, y);
  }

  function ustBasliklar(tema, x, y, en, ortala, renk) {
    var ana = renk || '#3d2016';
    ctx.textAlign = ortala ? 'center' : 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '500 22px ' + fontCss();
    ctx.fillStyle = tema && tema.vurgu ? tema.vurgu : karistir(ana, 128, 0.35);
    var etiket = tema ? ((tema.ikon ? tema.ikon + '  ' : '') + tema.ad.toLocaleUpperCase('tr-TR')) : '';
    ctx.fillText(etiket, x, y);

    if (durum.isim) {
      var punto = sigdir(64, fontCss(), durum.isim, en);
      ctx.font = '500 ' + punto + 'px ' + fontCss();
      kabartmaYazi(durum.isim, x, y + 62, ana, 'rgba(255,255,255,0.55)');
    }
    if (durum.tarih) {
      ctx.font = '400 26px ' + fontCss();
      ctx.fillStyle = karistir(ana, 128, 0.2);
      ctx.fillText(tarihYaz(durum.tarih), x, y + (durum.isim ? 104 : 62));
    }
    ctx.textAlign = 'left';
  }

  function tarihYaz(iso) {
    var p = String(iso).split('-');
    if (p.length !== 3) return iso;
    var aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    var ay = aylar[parseInt(p[1], 10) - 1] || p[1];
    return parseInt(p[2], 10) + ' ' + ay + ' ' + p[0];
  }

  function tonla(yol, renk, guc) {
    // Altlık üzerindeki nötr kutuyu ambalaj rengine boyar (multiply), sonra ışığı geri verir.
    ctx.save();
    yol();
    ctx.clip();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = renk;
    ctx.globalAlpha = guc === undefined ? 1 : guc;
    ctx.fillRect(0, 0, OLCO, OLCO);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'soft-light';
    var isik = ctx.createLinearGradient(0, 0, OLCO, OLCO);
    isik.addColorStop(0, 'rgba(255,255,255,0.55)');
    isik.addColorStop(0.5, 'rgba(255,255,255,0)');
    isik.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = isik;
    ctx.fillRect(0, 0, OLCO, OLCO);
    ctx.restore();
  }

  function cizKutu(amb, kur, kart, cik, tema) {
    var g = geo('kutu');
    var dis = g.dis;
    var ic = g.ic;

    // Kutu gövdesini ambalaj rengine boya
    tonla(function () { yuvarlak(ctx, dis.x, dis.y, dis.g, dis.h, dis.r); }, amb.zemin);

    // Kapak içi baskılı kart (isim / tarih alanı)
    var kartY = ic.y + 22;
    var kartH = 150;
    golgeli(function () {
      yuvarlak(ctx, ic.x + 22, kartY, ic.g - 44, kartH, 8);
      ctx.fillStyle = '#fbf6ec';
      ctx.fill();
    }, 'rgba(30,15,8,0.35)', 14, 0, 6);
    yuvarlak(ctx, ic.x + 30, kartY + 8, ic.g - 60, kartH - 16, 6);
    ctx.strokeStyle = tema && tema.vurgu ? tema.vurgu : 'rgba(169,131,54,0.55)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Çikolata ızgarası
    var adet = parseInt(durum.boyut, 10);
    if (!adet || adet < 1) adet = 16;
    var kolon = Math.ceil(Math.sqrt(adet));
    var satir = Math.ceil(adet / kolon);
    var alanX = ic.x + 40;
    var alanY = kartY + kartH + 26;
    var alanG = ic.g - 80;
    var alanH = ic.y + ic.h - alanY - 40;
    var hucre = Math.min(alanG / kolon, alanH / satir);
    var cap = hucre * 0.36;
    var kapsulRenk = metinRengi(amb.zemin) === '#3d2016' ? '#f4ecdf' : '#5a3b2a';

    for (var i = 0; i < adet; i++) {
      var s = Math.floor(i / kolon);
      var k = i % kolon;
      var satirdakiAdet = Math.min(kolon, adet - s * kolon);
      var kaydirma = (alanG - satirdakiAdet * hucre) / 2;
      var cx = alanX + kaydirma + k * hucre + hucre / 2;
      var cy = alanY + (alanH - satir * hucre) / 2 + s * hucre + hucre / 2;
      kapsul(cx, cy, cap, kapsulRenk);
    }
    for (var j = 0; j < adet; j++) {
      var s2 = Math.floor(j / kolon);
      var k2 = j % kolon;
      var satirdaki2 = Math.min(kolon, adet - s2 * kolon);
      var kaydirma2 = (alanG - satirdaki2 * hucre) / 2;
      var renk = cikolata(s2 * kolon + k2, cik);
      madlen(alanX + kaydirma2 + k2 * hucre + hucre / 2, alanY + (alanH - satir * hucre) / 2 + s2 * hucre + hucre / 2, cap, renk.dolgu, renk.kenar);
    }

    if (kur.renk) serit(dis.x, dis.y, dis.g, dis.h, kur.renk);
    if (kart.zemin) kartCiz(kart, dis.x + dis.g - 330, dis.y + dis.h - 150, 300, 118);
  }

  function cizBar(amb, kur, kart, cik, tema) {
    var b = geo('bar').bar;
    var x = b.x, y = b.y, bG = b.g, bH = b.h, r = b.r || 18;
    var dolgu = cik.dolgu === 'mix' ? D.studyo.cikolataTipleri[0].dolgu : cik.dolgu;
    var kenar = cik.kenar === '#00000022' ? dolgu : cik.kenar;

    // Bar gövdesi
    golgeli(function () {
      yuvarlak(ctx, x, y, bG, bH, r);
      var grad = ctx.createLinearGradient(x, y, x + bG * 0.3, y + bH);
      grad.addColorStop(0, acik(dolgu, 0.18));
      grad.addColorStop(0.5, dolgu);
      grad.addColorStop(1, koyu(kenar, 0.3));
      ctx.fillStyle = grad;
      ctx.fill();
    }, 'rgba(20,10,5,0.5)', 28, 6, 14);

    // Kenar pah: üst/sol açık, alt/sağ koyu
    yuvarlak(ctx, x + 2, y + 2, bG - 4, bH - 4, r);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bölmeler (2 × 4) kabartmalı
    var kol = 4, sat = 2;
    var pad = 14;
    var bw = (bG - pad * (kol + 1)) / kol;
    var bh = (bH - pad * (sat + 1)) / sat;
    for (var sI = 0; sI < sat; sI++) {
      for (var kI = 0; kI < kol; kI++) {
        var bx = x + pad + kI * (bw + pad);
        var by = y + pad + sI * (bh + pad);
        // Oluk (koyu)
        yuvarlak(ctx, bx - 4, by - 4, bw + 8, bh + 8, 10);
        ctx.fillStyle = koyu(kenar, 0.35);
        ctx.fill();
        // Yükselti
        var g2 = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        g2.addColorStop(0, acik(dolgu, 0.22));
        g2.addColorStop(0.55, dolgu);
        g2.addColorStop(1, koyu(kenar, 0.18));
        yuvarlak(ctx, bx, by, bw, bh, 8);
        ctx.fillStyle = g2;
        ctx.fill();
        yuvarlak(ctx, bx + 1.5, by + 1.5, bw - 3, bh - 3, 7);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    // Yüzey parlaması
    ctx.save();
    yuvarlak(ctx, x, y, bG, bH, r);
    ctx.clip();
    var spek = ctx.createLinearGradient(x, y, x + bG, y + bH);
    spek.addColorStop(0, 'rgba(255,255,255,0.18)');
    spek.addColorStop(0.35, 'rgba(255,255,255,0.02)');
    spek.addColorStop(0.6, 'rgba(255,255,255,0.10)');
    spek.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spek;
    ctx.fillRect(x, y, bG, bH);
    ctx.restore();

    if (kur.renk) {
      // Barın etrafında saten kuşak
      satenBant(x + bG * 0.68, y - 18, 46, bH + 36, kur.renk, true);
      fiyonk(x + bG * 0.68 + 23, y - 6, 30, kur.renk);
    }
    if (kart.zemin) kartCiz(kart, x - 10, y + bH + 54, 300, 118);
  }

  function cizTepsi(amb, kur, kart, cik, tema) {
    var o = geo('tepsi').oval;
    var cx = o.cx, cy = o.cy, rg = o.rx, rh = o.ry;

    // Tepsi aynasına ambalaj rengi yansıması (hafif)
    tonla(function () { ctx.beginPath(); ctx.ellipse(cx, cy, rg, rh, 0, 0, Math.PI * 2); }, amb.zemin, 0.35);

    // Dizilim: kapsüller sonra çikolatalar (gölgeler doğru sırada)
    var sayi = 12;
    var cap = 58;
    var kapsulRenk = kur.renk && kur.renk !== '#EFE3D2' ? acik(kur.renk, 0.72) : '#f4ecdf';
    var i, aci, px, py;
    for (i = 0; i < sayi; i++) {
      aci = (Math.PI * 2 * i) / sayi - Math.PI / 2;
      px = cx + Math.cos(aci) * (rg - 100);
      py = cy + Math.sin(aci) * (rh - 92);
      kapsul(px, py, cap, kapsulRenk);
    }
    for (i = 0; i < sayi; i++) {
      aci = (Math.PI * 2 * i) / sayi - Math.PI / 2;
      px = cx + Math.cos(aci) * (rg - 100);
      py = cy + Math.sin(aci) * (rh - 92);
      var renk = cikolata(i, cik);
      madlen(px, py, cap, renk.dolgu, renk.kenar);
    }

    // Orta isim plakası (pleksi / ayna)
    var pG = 320;
    var pH = 140;
    golgeli(function () {
      yuvarlak(ctx, cx - pG / 2, cy - pH / 2, pG, pH, 16);
      var pg = ctx.createLinearGradient(cx - pG / 2, cy - pH / 2, cx + pG / 2, cy + pH / 2);
      pg.addColorStop(0, '#fffdf9');
      pg.addColorStop(1, '#efe6d8');
      ctx.fillStyle = pg;
      ctx.fill();
    }, 'rgba(30,15,8,0.4)', 20, 2, 8);
    yuvarlak(ctx, cx - pG / 2 + 6, cy - pH / 2 + 6, pG - 12, pH - 12, 12);
    ctx.strokeStyle = tema && tema.vurgu ? tema.vurgu : 'rgba(169,131,54,0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    if (kur.renk) fiyonk(cx, cy - rh + 8, 40, kur.renk);
    if (kart.zemin) kartCiz(kart, cx - 150, cy + rh + 44, 300, 118);
  }

  /* ------------------------------ Kurdele ve kart ------------------------ */

  function satenBant(x, y, g, h, renk, dikey) {
    golgeli(function () {
      var grad = dikey ? ctx.createLinearGradient(x, y, x + g, y) : ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, koyu(renk, 0.28));
      grad.addColorStop(0.22, renk);
      grad.addColorStop(0.42, acik(renk, 0.38));
      grad.addColorStop(0.6, renk);
      grad.addColorStop(1, koyu(renk, 0.32));
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, g, h);
    }, 'rgba(20,10,5,0.4)', 14, dikey ? 4 : 0, dikey ? 0 : 6);
  }

  function fiyonk(fx, fy, boy, renk) {
    function halka(dx, egim) {
      ctx.save();
      ctx.translate(fx + dx, fy);
      ctx.rotate(egim);
      var grad = ctx.createRadialGradient(-boy * 0.3, -boy * 0.3, boy * 0.1, 0, 0, boy);
      grad.addColorStop(0, acik(renk, 0.45));
      grad.addColorStop(0.6, renk);
      grad.addColorStop(1, koyu(renk, 0.4));
      ctx.beginPath();
      ctx.ellipse(0, 0, boy, boy * 0.62, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
    golgeli(function () {
      // Kuyruklar
      ctx.fillStyle = koyu(renk, 0.15);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx - boy * 0.55, fy + boy * 1.5);
      ctx.lineTo(fx - boy * 0.2, fy + boy * 1.35);
      ctx.lineTo(fx - boy * 0.1, fy + boy * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + boy * 0.6, fy + boy * 1.45);
      ctx.lineTo(fx + boy * 0.25, fy + boy * 1.3);
      ctx.lineTo(fx + boy * 0.1, fy + boy * 0.3);
      ctx.closePath();
      ctx.fill();
      halka(-boy * 0.95, -0.35);
      halka(boy * 0.95, 0.35);
    }, 'rgba(20,10,5,0.45)', 16, 3, 8);
    // Düğüm
    var dg = ctx.createRadialGradient(fx - boy * 0.12, fy - boy * 0.15, 1, fx, fy, boy * 0.45);
    dg.addColorStop(0, acik(renk, 0.5));
    dg.addColorStop(1, koyu(renk, 0.35));
    ctx.beginPath();
    ctx.ellipse(fx, fy, boy * 0.42, boy * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = dg;
    ctx.fill();
  }

  function serit(x, y, g, h, renk) {
    var ys = y + h * 0.64;
    satenBant(x - 4, ys, g + 8, 38, renk, false);
    fiyonk(x + g - 96, ys + 19, 30, renk);
  }

  function kartCiz(kart, x, y, g, h) {
    ctx.save();
    ctx.translate(x + g / 2, y + h / 2);
    ctx.rotate(-0.06);
    golgeli(function () {
      yuvarlak(ctx, -g / 2, -h / 2, g, h, 10);
      var grad = ctx.createLinearGradient(-g / 2, -h / 2, g / 2, h / 2);
      grad.addColorStop(0, acik(kart.zemin, 0.12));
      grad.addColorStop(1, koyu(kart.zemin, 0.06));
      ctx.fillStyle = grad;
      ctx.fill();
    }, 'rgba(30,15,8,0.42)', 18, 4, 10);
    yuvarlak(ctx, -g / 2 + 7, -h / 2 + 7, g - 14, h - 14, 6);
    ctx.strokeStyle = 'rgba(61,32,22,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    var mesaj = durum.mesaj || (durum.isim ? 'Sevgilerle, ' + durum.isim : 'Kart notu');
    ctx.font = '400 23px ' + fontCss();
    ctx.fillStyle = kart.metin;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    var satirlar = satirlaraBol(mesaj, g - 52).slice(0, 3);
    satirlar.forEach(function (sat, i) {
      ctx.fillText(sat, -g / 2 + 26, -h / 2 + 44 + i * 30);
    });
    ctx.restore();
  }

  /* ------------------------------ Şablon editörü (2.3b) ------------------ */
  // Zemin: panelden yüklenen boş ürün fotoğrafı (urun.altlik) ya da çizim tipine göre render sahne.
  // Baskı alanı: urun.baskiAlani ({x,y,w,h} 0–1) ya da çizim geometrisinden varsayılan. Yazı ve logo bu
  // alanın içinde sürüklenir; konumlar alana oranla saklanır, fotoğraf değişince yerleşim bozulmaz.
  var sablonImg = {};
  var katmanKutu = { yazi: null, foto: null }; // son çizimdeki piksel kutuları (isabet testi)
  var kurdeleDokulari = {};

  // Piksel alanları 1000×1000 maketlere göre ölçüldü; panel fotoğrafı bunların önüne geçer.
  function fotoSahne(urun) {
    if (urun.altlik) return null;
    var tip = cizimTipi(urun);
    if (tip === 'bar') return {
      yol: '/assets/img/studyo/photo-bar-v1.webp',
      baski: { x: 235, y: 330, g: 525, h: 330 },
      renk: { x: 216, y: 316, g: 563, h: 363 },
      kurdele: { x: 90, y: 540, g: 820 }
    };
    if (tip === 'tepsi') return {
      yol: '/assets/img/studyo/photo-tepsi-v1.webp',
      baski: { x: 266, y: 235, g: 453, h: 210 },
      renk: { x: 250, y: 217, g: 486, h: 241 },
      kurdele: { x: 220, y: 362, g: 560 }
    };
    return {
      yol: '/assets/img/studyo/photo-empty-v1.webp',
      baski: { x: 188, y: 95, g: 625, h: 270 },
      renk: { x: 177, y: 78, g: 645, h: 310 },
      kurdele: { x: 150, y: 268, g: 700 }
    };
  }

  function cerceveCiz(alan, amb) {
    var stil = (secili(durum.cerceve, D.studyo.cerceveler || []) || {}).stil || 'yok';
    if (stil === 'yok') return;
    var bosluk = Math.min(alan.g, alan.h) * 0.055;
    var x = alan.x + bosluk, y = alan.y + bosluk, w = alan.g - bosluk * 2, h = alan.h - bosluk * 2;
    ctx.save(); ctx.strokeStyle = yaziRengi(amb); ctx.globalAlpha = 0.65; ctx.lineWidth = 1.5;
    if (stil === 'ince' || stil === 'cift') {
      ctx.strokeRect(x, y, w, h);
      if (stil === 'cift') ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
    } else if (stil === 'kose' || stil === 'art-deco') {
      var kol = Math.min(w, h) * 0.22;
      [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(function (k) {
        ctx.beginPath(); ctx.moveTo(k[0], k[1] + k[3] * kol); ctx.lineTo(k[0], k[1]); ctx.lineTo(k[0] + k[2] * kol, k[1]); ctx.stroke();
        if (stil === 'art-deco') { ctx.beginPath(); ctx.moveTo(k[0] + k[2] * 5, k[1] + k[3] * kol * .7); ctx.lineTo(k[0] + k[2] * 5, k[1] + k[3] * 5); ctx.lineTo(k[0] + k[2] * kol * .7, k[1] + k[3] * 5); ctx.stroke(); }
      });
    }
    ctx.restore();
  }

  function yuzeyRengi(alan, renk) {
    if (!renk || !alan) return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = renk;
    ctx.fillRect(alan.x, alan.y, alan.g, alan.h);
    ctx.restore();
  }

  function etiketBaskisi(alan, amb, tema) {
    yuzeyRengi(alan, amb.zemin);
    ctx.save();
    ctx.beginPath(); ctx.rect(alan.x, alan.y, alan.g, alan.h); ctx.clip();
    ctx.fillStyle = yaziRengi(amb);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var isim = durum.isim || 'Beyza Blanc';
    sigdir(alan.h * 0.18, fontCss(), isim, alan.g * 0.84);
    ctx.fillText(isim, alan.x + alan.g / 2, alan.y + alan.h * 0.42);
    ctx.globalAlpha = 0.65;
    ctx.fillRect(alan.x + alan.g * 0.35, alan.y + alan.h * 0.59, alan.g * 0.3, 0.7);
    sigdir(alan.h * 0.095, 'Georgia', durum.tarih ? tarihYaz(durum.tarih) : tema.kisa, alan.g * 0.82);
    ctx.fillText(durum.tarih ? tarihYaz(durum.tarih) : tema.kisa, alan.x + alan.g / 2, alan.y + alan.h * 0.74);
    ctx.restore();
  }

  function fotograflikCikolatalar(img, amb, tema) {
    var sayi = [9, 16, 25].indexOf(Number(durum.boyut)) > -1 ? Number(durum.boyut) : 16;
    var kolon = Math.sqrt(sayi);
    var aralikX = 610 / kolon, aralikY = 475 / kolon;
    var kenar = Math.min(aralikX - 12, aralikY - 10);
    // Kaynak maketin sağ alt çikolatası gerçekçi folyo ve baskı yüzeyi sağlar.
    for (var i = 0; i < sayi; i++) {
      var x = 195 + (i % kolon) * aralikX + (aralikX - kenar) / 2;
      var y = 440 + Math.floor(i / kolon) * aralikY + (aralikY - kenar) / 2;
      ctx.save();
      ctx.shadowColor = 'rgba(67,44,16,.24)'; ctx.shadowBlur = 7; ctx.shadowOffsetY = 5;
      ctx.drawImage(img, 219, 440, 125, 112, x, y, kenar, kenar);
      ctx.restore();
      etiketBaskisi({ x: x + kenar * 0.105, y: y + kenar * 0.025, g: kenar * 0.77, h: kenar * 0.89 }, amb, tema);
    }
    canvas.dataset.chocolateCount = String(sayi);
  }

  function tepsiEtiketleri(amb, tema) {
    var xs = [246, 381, 512, 646], ys = [493, 606, 719];
    ys.forEach(function (y) { xs.forEach(function (x) { etiketBaskisi({ x: x, y: y, g: 86, h: 85 }, amb, tema); }); });
    canvas.dataset.chocolateCount = '12';
  }

  function fotografikKurdele(img, renk, alan) {
    if (!kurdeleDokulari[renk]) {
      var doku = document.createElement('canvas');
      doku.width = img.naturalWidth; doku.height = img.naturalHeight;
      var d = doku.getContext('2d');
      d.drawImage(img, 0, 0);
      d.globalCompositeOperation = 'multiply'; d.fillStyle = renk; d.fillRect(0, 0, doku.width, doku.height);
      d.globalCompositeOperation = 'destination-in'; d.drawImage(img, 0, 0);
      kurdeleDokulari[renk] = doku;
    }
    ctx.save();
    ctx.shadowColor = 'rgba(58,35,17,.17)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
    ctx.drawImage(kurdeleDokulari[renk], alan.x, alan.y, alan.g, alan.g * img.naturalHeight / img.naturalWidth);
    ctx.restore();
  }

  function cizimTipi(urun) { return urun.tip === 'bar' ? 'bar' : urun.tip === 'tepsi' ? 'tepsi' : 'kutu'; }

  // Ürün değişince yazı/logo başlangıç konumu: kutuda kapak plakası (üst), bar ve tepside orta.
  function yerlesimiSifirla() {
    var tip = cizimTipi(UI.urunBul(durum.urun));
    durum.yerlesim.yazi.x = 0.5;
    durum.yerlesim.yazi.y = 0.5;
    durum.yerlesim.foto.x = tip === 'bar' ? 0.5 : 0.76;
    durum.yerlesim.foto.y = tip === 'bar' ? 0.5 : 0.74;
  }

  function sablonGorsel(urun) {
    var yol = urun && (urun.altlik || fotoSahne(urun).yol);
    return maketGorseli(yol);
  }

  function maketGorseli(yol) {
    if (!yol) return null;
    if (sablonImg[yol] === undefined) {
      sablonImg[yol] = null;
      var img = new Image();
      img.onload = function () { sablonImg[yol] = img; if (canvas.isConnected) ciz(); };
      img.onerror = function () { sablonImg[yol] = false; if (canvas.isConnected) ciz(); };
      img.src = yol;
    }
    return sablonImg[yol];
  }

  function baskiAlani(urun, tip) {
    var a = urun && urun.baskiAlani;
    if (a && a.w > 0 && a.h > 0) return { x: a.x * OLCO, y: a.y * OLCO, g: a.w * OLCO, h: a.h * OLCO };
    var sahne = fotoSahne(urun);
    if (sahne) return sahne.baski;
    var g = geo(tip);
    if (tip === 'bar') return { x: g.bar.x, y: g.bar.y, g: g.bar.g, h: g.bar.h };
    if (tip === 'tepsi') return { x: g.oval.cx - g.oval.rx, y: g.oval.cy - g.oval.ry, g: g.oval.rx * 2, h: g.oval.ry * 2 };
    return { x: g.dis.x, y: g.dis.y, g: g.dis.g, h: g.dis.h };
  }

  function kaplaCiz(img, x, y, g, h) {
    var oran = Math.max(g / img.naturalWidth, h / img.naturalHeight);
    var sw = g / oran;
    var sh = h / oran;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, g, h);
  }

  function acikMi(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
    if (!m) return false;
    var n = parseInt(m[1], 16);
    return 0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255) > 215;
  }

  function yaziRengi(amb) { return durum.yaziRenk || (amb && amb.metin) || '#3d2016'; }

  function yaziKatmani(alan, amb, kart) {
    var isim = durum.isim || '';
    var tarih = durum.tarih ? tarihYaz(durum.tarih) : '';
    var not = (!kart || !kart.zemin) && durum.mesaj ? durum.mesaj : '';
    var bos = !isim && !tarih && !not;
    var olcek = durum.yerlesim.yazi.olcek || 1;
    var enFazla = alan.g * 0.84;
    var satirlar = [];
    var ana = isim || (bos ? 'İsminiz burada' : '');
    var punto = ana ? sigdir(Math.round(92 * olcek), fontCss(), ana, enFazla) : Math.round(40 * olcek);
    if (ana) satirlar.push({ m: ana, p: punto, a: 500 });
    if (tarih) satirlar.push({ m: tarih, p: Math.max(22, Math.round(punto * 0.36)), a: 400 });
    if (not) satirlar.push({ m: not, p: sigdir(Math.max(22, Math.round(punto * 0.32)), fontCss(), not, enFazla), a: 400 });
    var toplam = 0, genislik = 0;
    satirlar.forEach(function (sat, i) {
      ctx.font = sat.a + ' ' + sat.p + 'px ' + fontCss();
      genislik = Math.max(genislik, ctx.measureText(sat.m).width);
      toplam += sat.p * (i === satirlar.length - 1 ? 1 : 1.3);
    });
    var cx = alan.x + durum.yerlesim.yazi.x * alan.g;
    var cy = alan.y + durum.yerlesim.yazi.y * alan.h;
    var renk = yaziRengi(amb);
    var y = cy - toplam / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.globalAlpha = bos ? 0.5 : 1;
    satirlar.forEach(function (sat) {
      ctx.font = sat.a + ' ' + sat.p + 'px ' + fontCss();
      ctx.globalCompositeOperation = acikMi(renk) ? 'source-over' : 'multiply';
      ctx.fillStyle = renk;
      ctx.fillText(sat.m, cx, y);
      y += sat.p * 1.3;
    });
    ctx.restore();
    var g = Math.max(genislik, 140) + 32;
    katmanKutu.yazi = { x: cx - g / 2, y: cy - toplam / 2 - 14, g: g, h: toplam + 28 };
  }

  function fotoKatmani(alan) {
    if (!fotograf) { katmanKutu.foto = null; return; }
    var boy = Math.min(alan.g, alan.h) * 0.34 * (durum.yerlesim.foto.olcek || 1);
    var cx = alan.x + durum.yerlesim.foto.x * alan.g;
    var cy = alan.y + durum.yerlesim.foto.y * alan.h;
    var x = cx - boy / 2, y = cy - boy / 2;
    ctx.save();
    yuvarlak(ctx, x, y, boy, boy, 2);
    ctx.clip();
    ctx.globalCompositeOperation = 'multiply';
    kaplaCiz(fotograf.img, x, y, boy, boy);
    ctx.restore();
    katmanKutu.foto = { x: x - 6, y: y - 6, g: boy + 12, h: boy + 12 };
  }

  // Sürükleme: işaretçi hangi katmanın kutusundaysa o katman taşınır (fotoğraf yazının üstünde).
  function tuvalNoktasi(e) {
    var r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * OLCO / r.width, y: (e.clientY - r.top) * OLCO / r.height };
  }
  function icinde(k, p) { return !!k && p.x >= k.x && p.x <= k.x + k.g && p.y >= k.y && p.y <= k.y + k.h; }
  var surukleme = null;
  canvas.addEventListener('pointerdown', function (e) {
    var p = tuvalNoktasi(e);
    var katman = icinde(katmanKutu.foto, p) ? 'foto' : icinde(katmanKutu.yazi, p) ? 'yazi' : null;
    if (!katman) return;
    var urun = UI.urunBul(durum.urun);
    surukleme = { katman: katman, alan: baskiAlani(urun, cizimTipi(urun)), bas: p, ilk: { x: durum.yerlesim[katman].x, y: durum.yerlesim[katman].y } };
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('surukleniyor');
    e.preventDefault();
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!surukleme) return;
    var p = tuvalNoktasi(e);
    var yer = durum.yerlesim[surukleme.katman];
    yer.x = Math.min(1, Math.max(0, surukleme.ilk.x + (p.x - surukleme.bas.x) / surukleme.alan.g));
    yer.y = Math.min(1, Math.max(0, surukleme.ilk.y + (p.y - surukleme.bas.y) / surukleme.alan.h));
    ciz();
  });
  function suruklemeBitir() {
    if (!surukleme) return;
    surukleme = null;
    canvas.classList.remove('surukleniyor');
    ozetGuncelle();
  }
  canvas.addEventListener('pointerup', suruklemeBitir);
  canvas.addEventListener('pointercancel', suruklemeBitir);

  /* ------------------------------ Özet metni ---------------------------- */

  function etiketAd(id, liste) {
    var x = secili(id, liste);
    return x ? x.ad : id;
  }

  function tasarimKodu() {
    var urunKisa = { 'madlen-kutu': 'MAD', bar: 'BAR', tepsi: 'TPS', 'hediye-kutusu': 'KUT' }[durum.urun] || 'TAS';
    var temaKisa = (durum.tema || '').split('-')[0].substring(0, 3).toLocaleUpperCase('tr-TR');
    var adet = /^\d+$/.test(durum.boyut) ? durum.boyut : (durum.boyut || '').replace(/\s+/g, '');
    return 'BB-' + urunKisa + adet + '-' + temaKisa;
  }

  function ozetUret() {
    var tema = UI.temaBul(durum.tema);
    var urun = UI.urunBul(durum.urun);
    var amb = secili(durum.ambalaj, D.studyo.ambalajRenkleri);
    var kur = secili(durum.kurdele, D.studyo.kurdeler);
    var kart = secili(durum.kart, D.studyo.kartlar);
    var ekstraAdlari = D.studyo.ekstralar
      .filter(function (e) {
        return durum.ekstralar.indexOf(e.id) > -1;
      })
      .map(function (e) {
        return e.ad;
      });

    var satirlar = [];
    satirlar.push('Merhaba ' + C.marka + ', tasarımım için fiyat teklifi istiyorum.');
    satirlar.push('');
    satirlar.push('• Tasarım kodu: ' + tasarimKodu());
    satirlar.push('• Ürün: ' + (urun ? urun.ad : durum.urun));
    satirlar.push('• Boyut: ' + durum.boyut);
    satirlar.push('• Özel gün: ' + (tema ? tema.ad : durum.tema));
    satirlar.push('• Çikolata: ' + etiketAd(durum.cikolata, D.studyo.cikolataTipleri));
    satirlar.push('• Ambalaj: ' + etiketAd(durum.ambalaj, D.studyo.ambalajRenkleri));
    satirlar.push('• Kurdele: ' + etiketAd(durum.kurdele, D.studyo.kurdeler));
    satirlar.push('• Kart: ' + etiketAd(durum.kart, D.studyo.kartlar));
    satirlar.push('• Çerçeve: ' + etiketAd(durum.cerceve, D.studyo.cerceveler || []));
    if (durum.sablon) satirlar.push('• Şablon: ' + ((UI.tasarimBul(durum.sablon) || {}).ad || durum.sablon));
    if (durum.yaziRenk) satirlar.push('• Yazı rengi: ' + durum.yaziRenk);
    if (durum.isim) satirlar.push('• İsim: ' + durum.isim);
    if (durum.tarih) satirlar.push('• Tarih: ' + tarihYaz(durum.tarih));
    if (durum.mesaj) satirlar.push('• Kart notu: ' + durum.mesaj);
    if (durum.aliciAdi) satirlar.push('• Alıcı: ' + durum.aliciAdi);
    satirlar.push('• Teslim şekli: ' + etiketAd(durum.teslimSekli, D.studyo.teslimSekilleri));
    if (durum.teslimTarihi) satirlar.push('• Hedef teslim günü: ' + tarihYaz(durum.teslimTarihi));
    if (durum.teslimNotu) satirlar.push('• Teslim notu: ' + durum.teslimNotu);
    if (fotograf) satirlar.push('• Fotoğraf / logo: eklendi (görselde görünüyor)');
    if (ekstraAdlari.length) satirlar.push('• Ekstralar: ' + ekstraAdlari.join(', '));
    satirlar.push('• Sipariş adedi: ' + durum.adet);
    satirlar.push('• Teslim: ' + C.teslimatNotu);
    satirlar.push('');
    satirlar.push('Tasarım görselini bu mesajla birlikte gönderiyorum.');

    return satirlar.join('\n');
  }

  /* --------------------------- Fiyat tahmini (plan 2.2) ------------------ */
  // Panelde tanımlı kurallardan hesaplanır: ürün tipi (+boyut) ve adet aralığına uyan temel fiyat,
  // seçili ekstraların ücreti. Kural yoksa tahmin gösterilmez; kesin fiyat her zaman atölyeden.
  var fiyatEl = document.getElementById('fiyat-tahmini');

  function paraYaz(tutar, para) {
    var sayi = Math.round(tutar).toLocaleString('tr-TR');
    return para === 'TRY' || !para ? sayi + ' TL' : sayi + ' ' + para;
  }

  function adetUyar(k, adet) {
    return k.minAdet <= adet && (k.maxAdet === null || k.maxAdet === undefined || adet <= k.maxAdet);
  }

  function fiyatTahmini() {
    var kurallar = D.fiyatKurallari || [];
    var adet = parseInt(durum.adet, 10) || 1;
    var temel = kurallar.filter(function (k) {
      return k.tur === 'base' && k.urun === durum.urun && (k.boyut === '' || k.boyut === durum.boyut) && adetUyar(k, adet);
    }).sort(function (a, b) {
      // boyutu birebir eşleşen ve adet aralığı dar olan kural önce
      return (b.boyut === durum.boyut) - (a.boyut === durum.boyut) || b.minAdet - a.minAdet;
    })[0];
    if (!temel) return null;
    var toplam = temel.mod === 'per_order' ? temel.tutar : temel.tutar * adet;
    var ekstralar = [];
    D.studyo.ekstralar.forEach(function (e) {
      if (durum.ekstralar.indexOf(e.id) === -1) return;
      var k = kurallar.filter(function (x) { return x.tur === 'extra' && x.secenek === e.id && adetUyar(x, adet); })
        .sort(function (a, b) { return b.minAdet - a.minAdet; })[0];
      if (!k) return;
      var tutar = k.mod === 'per_order' ? k.tutar : k.tutar * adet;
      ekstralar.push({ ad: e.ad, tutar: tutar });
      toplam += tutar;
    });
    return { toplam: toplam, adet: adet, birim: toplam / adet, para: temel.para, ekstralar: ekstralar, temel: temel };
  }

  function fiyatGuncelle() {
    if (!fiyatEl) return null;
    var t = fiyatTahmini();
    if (!t) { fiyatEl.hidden = true; fiyatEl.innerHTML = ''; return null; }
    var ekstraMetin = t.ekstralar.length
      ? '<li>Ekstralar: ' + t.ekstralar.map(function (e) { return e.ad + ' (' + paraYaz(e.tutar, t.para) + ')'; }).join(', ') + '</li>'
      : '';
    fiyatEl.hidden = false;
    fiyatEl.innerHTML =
      '<p class="fiyat-tahmini__tutar"><span>Tahmini fiyat</span><strong>' + paraYaz(t.toplam, t.para) + '</strong></p>' +
      '<ul class="fiyat-tahmini__detay">' +
      '<li>' + t.adet + ' adet · adet başına yaklaşık ' + paraYaz(t.birim, t.para) + '</li>' + ekstraMetin +
      '</ul>' +
      '<p class="fiyat-tahmini__not">Kesin fiyat ve teslim günü atölyeden yazılı olarak bildirilir; tahmin baskı detayına göre değişebilir.</p>';
    return t;
  }

  /* ------------------------ Teslim: tarih ve hazırlık ------------------------ */
  // Bant başlığı "1–4 adet" / "50+ adet" biçiminde; metin "2–3 iş günü" içerir (lib/settings.js deliveryBands).
  function bantAdetAraligi(baslik) {
    var sayilar = (baslik.match(/\d+/g) || []).map(Number);
    if (!sayilar.length) return null;
    if (/\+|üzeri/i.test(baslik)) return { min: sayilar[0], max: Infinity };
    return { min: sayilar[0], max: sayilar[sayilar.length - 1] };
  }

  // Seçili adet için en az iş günü: eşleşen bandın metnindeki en büyük gün sayısı; bulunamazsa 0 (uyarı yok).
  function asgariHazirlikGunu(adet) {
    var bantlar = D.studyo.teslimBantlari || [];
    for (var i = 0; i < bantlar.length; i++) {
      var ar = bantAdetAraligi(bantlar[i].title);
      if (!ar || adet < ar.min || adet > ar.max) continue;
      var g = bantlar[i].text.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*iş günü/i);
      if (g) return parseInt(g[2] || g[1], 10);
    }
    return 0;
  }

  // Hafta sonu dışındaki günleri sayar: başlangıç hariç, hedef dahil (resmi tatiller sayılmaz).
  function isGunuFarki(baslangic, hedef) {
    var n = 0;
    var t = new Date(baslangic.getTime());
    while (t < hedef) {
      t.setDate(t.getDate() + 1);
      var g = t.getDay();
      if (g !== 0 && g !== 6) n++;
    }
    return n;
  }

  function yerelIsoTarih(d) {
    function pad(s) { return (s < 10 ? '0' : '') + s; }
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Geçmiş tarihi temizler; eşik içindeyse uyarı gösterir ama göndermeyi engellemez.
  function teslimKontrol() {
    var tarihEl = document.getElementById('teslimTarihi');
    var uyariEl = document.getElementById('teslim-uyari');
    if (!tarihEl || !uyariEl) return;
    var bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    tarihEl.min = yerelIsoTarih(bugun);
    var metin = '';
    if (tarihEl.value) {
      var hedef = new Date(tarihEl.value + 'T00:00:00');
      if (hedef < bugun) {
        tarihEl.value = '';
        durum.teslimTarihi = '';
        metin = 'Geçmiş bir gün seçilemez.';
      } else {
        var asgari = asgariHazirlikGunu(parseInt(durum.adet, 10) || 1);
        if (asgari > 0 && isGunuFarki(bugun, hedef) < asgari) {
          metin = 'Bu adet için en az ' + asgari + ' iş günü gerekir; atölyeyle teyit edin.';
        }
      }
    }
    uyariEl.textContent = metin;
    uyariEl.hidden = !metin;
  }

  function ozetGuncelle() {
    teslimKontrol();
    var metin = ozetUret();
    var t = fiyatGuncelle();
    if (t) metin = metin.replace('\n\nTasarım görselini', '\n• Sitedeki tahmini fiyat: ' + paraYaz(t.toplam, t.para) + ' (kesin teklif atölyeden)\n\nTasarım görselini');
    if (ozetEl) ozetEl.value = metin;
    editorGuncelle();
  }

  /* --------------------------- Adımlı tasarım editörü -------------------- */

  function editorGuncelle() {
    var ozet = document.getElementById('studio-live-summary');
    if (ozet) {
      ozet.textContent = [etiketAd(durum.urun, D.studyo.urunTipleri), durum.adet + ' adet',
        durum.isim || 'İsminizi ekleyin', etiketAd(durum.ambalaj, D.studyo.ambalajRenkleri)].join(' · ');
      canvas.setAttribute('aria-label', 'Canlı tasarım: ' + ozet.textContent);
    }
    ['yazi', 'foto'].forEach(function (katman) {
      ['x', 'y'].forEach(function (eksen) {
        var id = katman + '-' + eksen;
        var alan = document.getElementById(id);
        if (!alan) return;
        alan.value = Math.round(durum.yerlesim[katman][eksen] * 100);
        document.getElementById(id + '-deger').textContent = alan.value + '%';
      });
    });
    if (!gecmisHazir) return;
    var json = JSON.stringify(durum);
    var son = gecmis[gecmisKonum];
    if (!geriYukleniyor && (!son || son.json !== json || son.foto !== fotograf)) {
      var aktif = document.activeElement;
      var birlesebilir = aktif && aktif.matches('#studyo-form input[type="text"], #studyo-form textarea, #studyo-form input[type="range"]');
      var zaman = Date.now();
      var birlestir = birlesebilir && sonDuzenleme.alan === aktif && zaman - sonDuzenleme.zaman < 800 && gecmisKonum > 0 && gecmisKonum === gecmis.length - 1;
      gecmis = gecmis.slice(0, gecmisKonum + 1);
      var kayit = { json: json, foto: fotograf };
      if (birlestir) gecmis[gecmisKonum] = kayit;
      else { gecmis.push(kayit); if (gecmis.length > 40) gecmis.shift(); gecmisKonum = gecmis.length - 1; }
      sonDuzenleme = { alan: birlesebilir ? aktif : null, zaman: zaman };
    }
    document.getElementById('studio-undo').disabled = gecmisKonum <= 0;
    document.getElementById('studio-redo').disabled = gecmisKonum >= gecmis.length - 1;
  }

  function gecmisteGez(yon) {
    var hedef = gecmisKonum + yon;
    if (hedef < 0 || hedef >= gecmis.length) return;
    gecmisKonum = hedef;
    geriYukleniyor = true;
    durum = JSON.parse(gecmis[hedef].json);
    fotograf = gecmis[hedef].foto;
    kontrolleriYansit();
    ciz();
    ozetGuncelle();
    geriYukleniyor = false;
    sonDuzenleme.alan = null;
    durumYaz(yon < 0 ? 'Son değişiklik geri alındı.' : 'Değişiklik yeniden uygulandı.', true);
  }

  function taslagiDogrula(kayit) {
    if (!kayit || typeof kayit !== 'object' || Array.isArray(kayit)) throw new Error('Geçersiz taslak');
    var sonuc = JSON.parse(ilkTasarim.json);
    Object.keys(sonuc).forEach(function (ad) {
      if (typeof sonuc[ad] === 'string' && typeof kayit[ad] === 'string') sonuc[ad] = kayit[ad].slice(0, 1000);
    });
    var listeler = { urun: D.studyo.urunTipleri, tema: D.temalar, cikolata: D.studyo.cikolataTipleri,
      ambalaj: D.studyo.ambalajRenkleri, kurdele: D.studyo.kurdeler, kart: D.studyo.kartlar,
      font: D.studyo.fontlar, cerceve: D.studyo.cerceveler || [], teslimSekli: D.studyo.teslimSekilleri };
    Object.keys(listeler).forEach(function (ad) {
      if (listeler[ad].length && !secili(sonuc[ad], listeler[ad])) throw new Error('Seçenek artık sunulmuyor');
    });
    var urun = secili(sonuc.urun, D.studyo.urunTipleri);
    if (!urun || !urun.boyutlar.includes(sonuc.boyut) || !D.studyo.adetler.includes(sonuc.adet)) throw new Error('Ürün veya adet değişmiş');
    if (sonuc.yaziRenk && !/^#[\da-f]{6}$/i.test(sonuc.yaziRenk)) sonuc.yaziRenk = '';
    sonuc.isim = sonuc.isim.slice(0, C.studyo.isimKarakter);
    sonuc.mesaj = sonuc.mesaj.slice(0, C.studyo.mesajKarakter);
    sonuc.ekstralar = Array.isArray(kayit.ekstralar) ? D.studyo.ekstralar.filter(function (e) { return kayit.ekstralar.includes(e.id); }).map(function (e) { return e.id; }) : [];
    ['yazi', 'foto'].forEach(function (katman) {
      ['x', 'y', 'olcek'].forEach(function (eksen) {
        var v = kayit.yerlesim && kayit.yerlesim[katman] && kayit.yerlesim[katman][eksen];
        if (typeof v !== 'number' || !Number.isFinite(v)) return;
        sonuc.yerlesim[katman][eksen] = Math.max(eksen === 'olcek' ? 0.5 : 0, Math.min(eksen === 'olcek' ? (katman === 'yazi' ? 1.8 : 2) : 1, v));
      });
    });
    return sonuc;
  }

  function adimlariKur() {
    var paneller = Array.from(document.querySelectorAll('#studyo-form > .panel'));
    var gruplar = [0, 0, 1, 2, 2, 3, 4, 3];
    var adim = 0;
    var adlar = ['Başlangıç', 'Şablon', 'Kişiselleştir', 'Son dokunuş', 'Tamamla'];
    var sonraki = ['Şablona geç', 'Kişiselleştirmeye geç', 'Son dokunuşlara geç', 'Teslim ve özeti gör'];
    paneller.forEach(function (panel, i) { panel.dataset.editorStep = gruplar[i]; panel.querySelector('h2').tabIndex = -1; });
    document.getElementById('gonderim').dataset.editorStep = '4';
    document.getElementById('studio-guide').hidden = false;
    document.getElementById('studio-step-actions').hidden = false;
    adimaGit = function (hedef, odak) {
      adim = Math.max(0, Math.min(4, hedef));
      document.querySelectorAll('[data-editor-step]').forEach(function (panel) { panel.hidden = Number(panel.dataset.editorStep) !== adim; });
      document.querySelectorAll('[data-studio-step]').forEach(function (button) {
        if (Number(button.dataset.studioStep) === adim) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      document.getElementById('studio-step-count').textContent = (adim + 1) + ' / 5';
      var ilerleme = document.getElementById('studio-progress');
      ilerleme.value = adim + 1;
      ilerleme.setAttribute('aria-valuetext', (adim + 1) + '. adım: ' + adlar[adim]);
      document.getElementById('studio-back').hidden = adim === 0;
      document.getElementById('studio-next').hidden = adim === 4;
      document.getElementById('studio-next').textContent = (sonraki[adim] || '') + ' →';
      sonDuzenleme.alan = null;
      if (odak) {
        var baslik = document.querySelector('[data-editor-step="' + adim + '"] h2');
        baslik.focus({ preventScroll: true });
        document.getElementById('studio-guide').scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    };
    document.querySelectorAll('[data-studio-step]').forEach(function (b) { b.addEventListener('click', function () { adimaGit(Number(b.dataset.studioStep), true); }); });
    document.getElementById('studio-next').addEventListener('click', function () { adimaGit(adim + 1, true); });
    document.getElementById('studio-back').addEventListener('click', function () { adimaGit(adim - 1, true); });
    document.querySelectorAll('.studio-steps a').forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); adimaGit([0, 1, 4][i], true); });
    });
    document.getElementById('studyo-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (adim < 4) adimaGit(adim + 1, true);
      else document.getElementById('btn-paylas').click();
    });
    document.getElementById('studio-undo').addEventListener('click', function () { gecmisteGez(-1); });
    document.getElementById('studio-scene-retry').addEventListener('click', function () {
      Object.keys(sablonImg).forEach(function (yol) { if (sablonImg[yol] === false) delete sablonImg[yol]; });
      ciz();
    });
    document.getElementById('studio-redo').addEventListener('click', function () { gecmisteGez(1); });
    document.getElementById('studio-preview-toggle').addEventListener('click', function () {
      var buyuk = this.getAttribute('aria-pressed') !== 'true';
      this.setAttribute('aria-pressed', String(buyuk));
      this.textContent = buyuk ? 'Önizlemeyi küçült' : 'Önizlemeyi büyüt';
      document.querySelector('.studyo__onizleme').classList.toggle('studio-preview-expanded', buyuk);
    });
    document.querySelectorAll('[data-center]').forEach(function (b) {
      b.addEventListener('click', function () { durum.yerlesim[b.dataset.center].x = 0.5; ciz(); ozetGuncelle(); });
    });
    var paletler = [
      { ad: 'İmza krem', ambalaj: 'krem', kurdele: 'altin' },
      { ad: 'Romantik pudra', ambalaj: 'pudra', kurdele: 'altin' },
      { ad: 'Zamansız bordo', ambalaj: 'bordo', kurdele: 'altin' }
    ];
    var paletAlan = document.getElementById('studio-palettes');
    paletler.forEach(function (p) {
      var amb = secili(p.ambalaj, D.studyo.ambalajRenkleri);
      var kur = secili(p.kurdele, D.studyo.kurdeler);
      if (!amb || !kur) return;
      var b = document.createElement('button');
      b.type = 'button';
      var renk = document.createElement('span');
      renk.style.backgroundColor = amb.zemin;
      renk.style.borderColor = kur.renk;
      renk.setAttribute('aria-hidden', 'true');
      b.append(renk, document.createTextNode(p.ad));
      b.addEventListener('click', function () {
        durum.ambalaj = p.ambalaj; durum.kurdele = p.kurdele;
        kontrolleriYansit(); ciz(); ozetGuncelle();
        durumYaz(p.ad + ' renk uyumu uygulandı. Diğer seçimleriniz korundu.', true);
      });
      paletAlan.appendChild(b);
    });
    adimaGit(location.hash === '#gonderim' ? 4 : location.hash === '#sablon-baslik' ? 1 : tasarim ? 2 : 0, false);
  }

  /* --------------------------- PNG üretimi ve paylaşım ------------------- */

  function pngBlob(cb) {
    if (!/^(photo-mockup|product-photo)$/.test(canvas.dataset.renderMode || '')) {
      durumYaz('Önce ürün görselinin yüklenmesini bekleyin; hata varsa “Görseli yeniden yükle”yi kullanın.', false);
      return;
    }
    if (canvas.toBlob) {
      canvas.toBlob(cb, 'image/png');
    } else {
      var veri = canvas.toDataURL('image/png').split(',')[1];
      var ikili = atob(veri);
      var dizi = new Uint8Array(ikili.length);
      for (var i = 0; i < ikili.length; i++) dizi[i] = ikili.charCodeAt(i);
      cb(new Blob([dizi], { type: 'image/png' }));
    }
  }

  function dosyaAdi() {
    return 'beyza-blanc-' + tasarimKodu().toLowerCase() + '.png';
  }

  function durumYaz(metin, iyi) {
    var bildirim = document.getElementById('studio-feedback');
    if (bildirim) bildirim.textContent = metin;
    if (!durumEl) return;
    durumEl.textContent = metin;
    durumEl.style.color = iyi === false ? '#a32338' : '';
  }

  function indir() {
    pngBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = dosyaAdi();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 4000);
      durumYaz('Görsel indirildi. Instagram sohbetine ekleyebilirsin.', true);
    });
  }

  function paylasDugmesiDestekliMi() {
    try {
      var test = new File([new Blob(['a'], { type: 'image/png' })], 'a.png', { type: 'image/png' });
      return !!(navigator.canShare && navigator.canShare({ files: [test] }));
    } catch (e) {
      return false;
    }
  }

  function akilliPaylas(hazirMetin) {
    var metin = hazirMetin || ozetUret();
    if (!paylasDugmesiDestekliMi()) {
      indir();
      window.open(UI.waLink(metin + '\n\n(Görseli indirdim, sohbete ekliyorum.)'), '_blank', 'noopener');
      durumYaz('Görsel indirildi ve Instagram açıldı; görseli sohbete ekle.', true);
      return;
    }
    pngBlob(function (blob) {
      var dosya = new File([blob], dosyaAdi(), { type: 'image/png' });
      navigator
        .share({
          files: [dosya],
          text: metin,
          title: C.marka + ' tasarımım',
        })
        .then(function () {
          durumYaz('Paylaşım penceresi açıldı.', true);
        })
        .catch(function () {
          durumYaz('Paylaşım iptal edildi. Görseli indirip Instagram’dan gönderebilirsin.', false);
        });
    });
  }

  function sadeceMetin() {
    window.open(UI.waLink(ozetUret()), '_blank', 'noopener');
    durumYaz('Instagram açıldı. Tasarım özetini kopyalayıp sohbete ekleyebilirsin.', true);
  }

  /* ------------------------------- Kontroller --------------------------- */

  function secimHTML(ad, deger, etiket, seciliMi, ekSinif) {
    return (
      '<label class="secim' + (ekSinif ? ' ' + ekSinif : '') + '">' +
      '<input type="radio" name="' + ad + '" value="' + deger + '"' + (seciliMi ? ' checked' : '') + '>' +
      '<span>' + etiket + '</span></label>'
    );
  }

  function renkSecimHTML(ad, id, adi, renk, seciliMi) {
    return (
      '<label class="secim">' +
      '<input type="radio" name="' + ad + '" value="' + id + '"' + (seciliMi ? ' checked' : '') + '>' +
      '<span><span class="renk-nokta" style="background:' + renk + '"></span>' + adi + '</span></label>'
    );
  }

  function kontrolleriKur() {
    var urunAlan = document.getElementById('alan-urun');
    urunAlan.innerHTML = D.studyo.urunTipleri
      .map(function (u) {
        return secimHTML('urun', u.id, u.ad, u.id === durum.urun);
      })
      .join('');

    var temaAlan = document.getElementById('alan-tema');

    var cikAlan = document.getElementById('alan-cikolata');
    cikAlan.innerHTML = D.studyo.cikolataTipleri
      .map(function (c) {
        return secimHTML('cikolata', c.id, c.ad, c.id === durum.cikolata);
      })
      .join('');

    var fontAlan = document.getElementById('alan-font');
    fontAlan.innerHTML = D.studyo.fontlar
      .map(function (f) {
        return secimHTML('font', f.id, '<span style="font-family:' + f.css + '">' + f.ad + '</span>', f.id === durum.font);
      })
      .join('');

    var ambAlan = document.getElementById('alan-ambalaj');
    ambAlan.className = 'renk-secim';
    ambAlan.innerHTML = D.studyo.ambalajRenkleri
      .map(function (a) {
        return renkSecimHTML('ambalaj', a.id, a.ad, a.zemin, a.id === durum.ambalaj);
      })
      .join('');

    var kurAlan = document.getElementById('alan-kurdele');
    kurAlan.className = 'renk-secim';
    kurAlan.innerHTML = D.studyo.kurdeler
      .map(function (k) {
        return renkSecimHTML('kurdele', k.id, k.ad, k.renk || '#ffffff', k.id === durum.kurdele);
      })
      .join('');

    var kartAlan = document.getElementById('alan-kart');
    kartAlan.innerHTML = D.studyo.kartlar
      .map(function (k) {
        return secimHTML('kart', k.id, k.ad, k.id === durum.kart);
      })
      .join('');

    var teslimAlan = document.getElementById('alan-teslim');
    teslimAlan.innerHTML = D.studyo.teslimSekilleri
      .map(function (t) {
        return secimHTML('teslimSekli', t.id, t.ad, t.id === durum.teslimSekli);
      })
      .join('');

    var teslimYardim = document.getElementById('teslim-yardim');
    if (teslimYardim) {
      teslimYardim.textContent =
        'Hazırlık ve teslim zamanı atölyeyle görüşülerek netleştirilir. Geçmiş tarihler seçilemez.';
    }
    teslimKontrol();

    var ekstraAlan = document.getElementById('ekstra-liste');
    ekstraAlan.innerHTML = D.studyo.ekstralar
      .map(function (e) {
        return (
          '<li><input type="checkbox" id="ekstra-' +
          e.id +
          '" data-ekstra="' +
          e.id +
          '"' +
          (durum.ekstralar.indexOf(e.id) > -1 ? ' checked' : '') +
          '><label for="ekstra-' +
          e.id +
          '">' +
          e.ad +
          '</label></li>'
        );
      })
      .join('');

    var adetSecim = document.getElementById('adet');
    adetSecim.innerHTML = D.studyo.adetler
      .map(function (a) {
        return '<option value="' + a + '"' + (a === durum.adet ? ' selected' : '') + '>' + a + ' adet</option>';
      })
      .join('');

    var boyutAlan = document.getElementById('alan-boyut');
    function boyutlariCiz() {
      var u = UI.urunBul(durum.urun);
      if (u.boyutlar.indexOf(durum.boyut) === -1) durum.boyut = u.boyutlar[0];
      boyutAlan.innerHTML = u.boyutlar
        .map(function (b) {
          return secimHTML('boyut', b, b, b === durum.boyut);
        })
        .join('');
    }
    boyutlariCiz();

    /* Özel günler ürün tipine göre (panel: "uygun özel günler"; boşsa hepsi) */
    function urunTemalari(u) {
      return u.temalar && u.temalar.length ? D.temalar.filter(function (t) { return u.temalar.indexOf(t.id) > -1; }) : D.temalar;
    }
    function temaOnerisi() {
      var t = UI.temaBul(durum.tema);
      if (!t || !t.oneri) return;
      if (t.oneri.ambalaj) durum.ambalaj = t.oneri.ambalaj;
      if (t.oneri.kurdele) durum.kurdele = t.oneri.kurdele;
      if (t.oneri.cikolata && UI.urunBul(durum.urun).tip !== 'bar') durum.cikolata = t.oneri.cikolata;
      formaYansit();
    }
    function temalariCiz() {
      var liste = urunTemalari(UI.urunBul(durum.urun));
      if (liste.length && !liste.some(function (t) { return t.id === durum.tema; })) { durum.tema = liste[0].id; temaOnerisi(); }
      temaAlan.innerHTML = liste.map(function (t) { return secimHTML('tema', t.id, t.ikon + ' ' + t.kisa, t.id === durum.tema); }).join('');
    }
    // Durumdaki seçimleri form denetimlerine yansıt (şablon ve tema önerisi uygulanınca)
    function formaYansit() {
      ['ambalaj', 'kurdele', 'kart', 'font', 'cikolata', 'yaziRenk', 'cerceve'].forEach(function (ad) {
        var hepsi = document.querySelectorAll('input[name="' + ad + '"]');
        var var_ = false;
        hepsi.forEach(function (i) { i.checked = i.value === (durum[ad] || ''); if (i.checked) var_ = true; });
        if (!var_ && ad === 'yaziRenk') document.getElementById('yazi-renk-ozel').value = durum.yaziRenk || '#3d2016';
      });
      document.getElementById('isim').value = durum.isim;
      document.getElementById('mesaj').value = durum.mesaj;
    }

    /* Şablonlar: boş şablon + bu ürün (ve özel gün) için hazır tasarımlar */
    var sablonAlan = document.getElementById('alan-sablon');
    function sablonlariCiz() {
      var urunun = D.tasarimlar.filter(function (t) { return t.urun === durum.urun; });
      if (durum.sablon && !urunun.some(function (t) { return t.id === durum.sablon; })) durum.sablon = '';
      var aramaHam = document.getElementById('sablon-ara').value.trim();
      var arama = aramaHam.toLocaleLowerCase('tr');
      var yalnizGun = document.getElementById('sablon-gunum').checked;
      var izinliTemalar = urunTemalari(UI.urunBul(durum.urun)).map(function (t) { return t.id; });
      var sirala = function (a, b) {
        return Number(b.tema === durum.tema) - Number(a.tema === durum.tema) || Number(!!Object.keys(b.sablon || {}).length) - Number(!!Object.keys(a.sablon || {}).length);
      };
      var uygunlar = urunun.filter(function (t) {
        return izinliTemalar.indexOf(t.tema) > -1 && (!yalnizGun || t.tema === durum.tema);
      }).sort(sirala);
      var liste = uygunlar.filter(function (t) {
        if (!arama) return true;
        var tema = UI.temaBul(t.tema);
        var metin = [t.ad, t.ozet, (t.etiketler || []).join(' '), tema ? tema.ad : ''].join(' ').toLocaleLowerCase('tr');
        return metin.includes(arama);
      });
      var sonucEl = document.getElementById('sablon-sonuc');
      if (liste.length) {
        sonucEl.textContent = liste.length + ' şablon · Seçimleriniz her zaman düzenlenebilir.';
      } else {
        var onerilen = (uygunlar.length ? uygunlar : urunun.slice().sort(sirala)).slice(0, 6);
        liste = onerilen;
        sonucEl.innerHTML = '';
        if (aramaHam) {
          sonucEl.append('“' + aramaHam + '” için birebir şablon adı yok; ürününüze uygun ' + onerilen.length + ' önerilen şablon listeleniyor. ');
          var uygulaBtn = document.createElement('button');
          uygulaBtn.type = 'button';
          uygulaBtn.className = 'studio-template-apply';
          uygulaBtn.textContent = '“' + aramaHam.slice(0, C.studyo.isimKarakter) + '” yazısını tasarıma isim olarak ekle';
          uygulaBtn.addEventListener('click', function () {
            durum.isim = aramaHam.slice(0, C.studyo.isimKarakter);
            document.getElementById('isim').value = durum.isim;
            ciz();
            ozetGuncelle();
            durumYaz('“' + durum.isim + '” tasarımdaki isim alanına eklendi.', true);
          });
          sonucEl.appendChild(uygulaBtn);
        } else {
          sonucEl.textContent = onerilen.length + ' önerilen şablon gösteriliyor.';
        }
      }
      sablonAlan.innerHTML =
        '<label class="secim"><input type="radio" name="sablon" value=""' + (!durum.sablon ? ' checked' : '') + '><span><span class="sablon-bos" aria-hidden="true">✦</span>Serbest tasarım<small>Seçimlerinle devam et</small></span></label>' +
        liste.map(function (t) {
          return '<label class="secim"><input type="radio" name="sablon" value="' + UI.kacir(t.id) + '"' + (t.id === durum.sablon ? ' checked' : '') + '><span>' +
            (t.gorsel ? '<img src="' + UI.kacir(t.gorsel) + '" alt="" loading="lazy" width="320" height="320">' : '<span class="sablon-bos" aria-hidden="true">✦</span>') +
            UI.kacir(t.ad) + '<small>' + UI.kacir(t.ozet || '') + '</small></span></label>';
        }).join('');
    }
    function sablonUygula() {
      var t = UI.tasarimBul(durum.sablon);
      if (!t) return;
      var sb = t.sablon || {};
      durum.tema = t.tema;
      temalariCiz();
      if (t.boyut && UI.urunBul(durum.urun).boyutlar.indexOf(t.boyut) > -1) {
        durum.boyut = t.boyut;
        boyutlariCiz();
        if (/^\d+$/.test(t.boyut)) { durum.adet = t.boyut; adetSecim.value = t.boyut; }
      }
      if (t.cikolata) durum.cikolata = t.cikolata;
      var koru = document.getElementById('sablon-kisisel-koru').checked;
      if (sb.isim !== undefined && (!koru || !durum.isim.trim())) durum.isim = sb.isim;
      if (sb.not !== undefined && (!koru || !durum.mesaj.trim())) durum.mesaj = sb.not;
      if (sb.font) durum.font = sb.font;
      durum.yaziRenk = sb.renk || '';
      durum.cerceve = sb.cerceve || 'yok';
      if (sb.ambalaj) durum.ambalaj = sb.ambalaj;
      if (sb.kurdele) durum.kurdele = sb.kurdele;
      if (sb.kart) durum.kart = sb.kart;
      formaYansit();
      durumYaz('“' + t.ad + '” şablonu uygulandı; yazıyı, renkleri ve yerleşimi değiştirebilirsin.', true);
    }

    document.getElementById('sablon-ara').addEventListener('input', sablonlariCiz);
    document.getElementById('sablon-gunum').addEventListener('change', sablonlariCiz);
    document.getElementById('alan-cerceve').innerHTML = (D.studyo.cerceveler || []).map(function (c) { return secimHTML('cerceve', c.id, c.ad, c.id === durum.cerceve); }).join('');
    document.querySelectorAll('#alan-font input').forEach(function (i) { i.nextElementSibling.style.fontFamily = (secili(i.value, D.studyo.fontlar) || {}).css || ''; });

    var YAZI_RENKLERI = [['', 'Otomatik', '#d9c7b2'], ['#A98336', 'Altın', '#A98336'], ['#512730', 'Bordo', '#512730'], ['#3D2016', 'Kahve', '#3D2016'], ['#FFFAF2', 'Beyaz', '#FFFAF2'], ['#1A1A1A', 'Siyah', '#1A1A1A']];
    document.getElementById('alan-yazi-renk').innerHTML = YAZI_RENKLERI.map(function (r) {
      return renkSecimHTML('yaziRenk', r[0], r[1], r[2], (durum.yaziRenk || '') === r[0]);
    }).join('');

    temalariCiz();
    sablonlariCiz();

    // Tek bir eşitleme yolu: geri al/yinele ve taslak açma olay dinleyicilerini tekrar kurmaz.
    kontrolleriYansit = function () {
      fotoSurumu++;
      boyutlariCiz();
      temalariCiz();
      sablonlariCiz();
      document.querySelectorAll('#studyo-form input, #studyo-form textarea, #studyo-form select').forEach(function (alan) {
        if (alan.type === 'file') { alan.value = ''; return; }
        if (alan.dataset.ekstra) { alan.checked = durum.ekstralar.indexOf(alan.dataset.ekstra) > -1; return; }
        if (!Object.prototype.hasOwnProperty.call(durum, alan.name)) return;
        if (alan.type === 'radio') alan.checked = alan.value === String(durum[alan.name]);
        else alan.value = durum[alan.name];
      });
      document.getElementById('yazi-boyut').value = durum.yerlesim.yazi.olcek;
      document.getElementById('foto-boyut').value = durum.yerlesim.foto.olcek;
      document.getElementById('yazi-renk-ozel').value = durum.yaziRenk || '#3d2016';
      var onizleme = document.getElementById('foto-onizleme');
      onizleme.replaceChildren();
      if (fotograf) {
        var kucuk = document.createElement('img');
        kucuk.src = fotograf.img.src;
        kucuk.alt = 'Yüklenen fotoğraf önizlemesi';
        var ad = document.createElement('span');
        ad.textContent = fotograf.ad;
        onizleme.append(kucuk, ad);
      }
      document.getElementById('foto-kaldir').hidden = !fotograf;
      document.querySelectorAll('.studio-reference').forEach(function (b) { b.classList.toggle('studio-reference--selected', b.dataset.tema === durum.tema); });
    };

    var isimGirdi = document.getElementById('isim');
    isimGirdi.maxLength = C.studyo.isimKarakter;
    var mesajGirdi = document.getElementById('mesaj');
    mesajGirdi.maxLength = C.studyo.mesajKarakter;
    var tarihGirdi = document.getElementById('tarih');

    /* Olaylar */
    document.getElementById('studyo-form').addEventListener('input', function (olay) {
      var h = olay.target;
      if (h.dataset.layer && h.dataset.axis) {
        durum.yerlesim[h.dataset.layer][h.dataset.axis] = Number(h.value) / 100;
      } else if (h.name === 'urun') {
        durum.urun = h.value;
        yerlesimiSifirla();
        boyutlariCiz();
        temalariCiz();
        sablonlariCiz();
        var u = UI.urunBul(durum.urun);
        if (u.tip === 'bar' && /^\d+$/.test(durum.adet)) durum.adet = '1';
        if (u.tip === 'tepsi' && /^\d+$/.test(durum.adet)) durum.adet = '1';
        adetSecim.value = durum.adet;
        if (u.tip === 'bar') durum.cikolata = durum.cikolata === 'karisik' ? 'sutlu' : durum.cikolata;
        formaYansit();
      } else if (h.name === 'tema') {
        durum.tema = h.value;
        temaOnerisi();
        sablonlariCiz();
      } else if (h.name === 'sablon') {
        durum.sablon = h.value;
        sablonUygula();
      } else if (h.id === 'yazi-boyut') {
        durum.yerlesim.yazi.olcek = parseFloat(h.value) || 1;
      } else if (h.id === 'foto-boyut') {
        durum.yerlesim.foto.olcek = parseFloat(h.value) || 1;
      } else if (h.id === 'yazi-renk-ozel') {
        durum.yaziRenk = h.value.toUpperCase();
        document.querySelectorAll('input[name="yaziRenk"]').forEach(function (i) { i.checked = false; });
      } else if (h.name === 'boyut') {
        durum.boyut = h.value;
        if (/^\d+$/.test(h.value)) {
          durum.adet = h.value;
          adetSecim.value = h.value;
        }
      } else if (h.name) {
        durum[h.name] = h.value;
      } else if (h.id === 'isim') {
        durum.isim = h.value;
      } else if (h.id === 'tarih') {
        durum.tarih = h.value;
      } else if (h.id === 'aliciAdi') {
        durum.aliciAdi = h.value;
      } else if (h.id === 'teslimTarihi') {
        durum.teslimTarihi = h.value;
      } else if (h.id === 'teslimNotu') {
        durum.teslimNotu = h.value;
      } else if (h.id === 'mesaj') {
        durum.mesaj = h.value;
      } else if (h.id === 'adet') {
        durum.adet = h.value;
      } else if (h.getAttribute && h.getAttribute('data-ekstra')) {
        var id = h.getAttribute('data-ekstra');
        var yeri = durum.ekstralar.indexOf(id);
        if (h.checked && yeri === -1) durum.ekstralar.push(id);
        if (!h.checked && yeri > -1) durum.ekstralar.splice(yeri, 1);
      } else {
        return;
      }
      ciz();
      ozetGuncelle();
    });

    /* Fotoğraf yükleme */
    var fotoGirdi = document.getElementById('foto');
    var fotoOnizleme = document.getElementById('foto-onizleme');
    var fotoSurumu = 0;
    var fotoHata = document.getElementById('foto-hata');
    function fotoHatasi(metin) {
      fotoHata.textContent = metin;
      fotoHata.hidden = !metin;
      fotoGirdi.setAttribute('aria-invalid', String(!!metin));
      if (metin) { fotoGirdi.value = ''; durumYaz(metin, false); }
    }

    fotoGirdi.addEventListener('change', function () {
      var surum = ++fotoSurumu;
      var dosya = fotoGirdi.files && fotoGirdi.files[0];
      if (!dosya) return;
      fotoHatasi('');
      if (!/^image\/(jpeg|png|webp)$/.test(dosya.type)) {
        fotoHatasi('Lütfen JPG, PNG veya WebP biçiminde bir fotoğraf seçin.');
        return;
      }
      if (dosya.size > C.studyo.maksFotoMB * 1024 * 1024) {
        fotoHatasi('Fotoğraf çok büyük (en fazla ' + C.studyo.maksFotoMB + ' MB).');
        return;
      }
      var okuyucu = new FileReader();
      okuyucu.onload = function () {
        var img = new Image();
        img.onload = function () {
          if (surum !== fotoSurumu || !canvas.isConnected) return;
          fotograf = { img: img, ad: dosya.name };
          fotoOnizleme.innerHTML =
            '<img src="' + okuyucu.result + '" alt="Yüklenen fotoğraf önizlemesi">' +
            '<span>' + UI.kacir(dosya.name) + '</span>';
          document.getElementById('foto-kaldir').hidden = false;
          ciz();
          ozetGuncelle();
          durumYaz('Fotoğraf önizlemeye eklendi. Cihazından çıkmadı.', true);
        };
        img.onerror = function () { if (surum === fotoSurumu) fotoHatasi('Fotoğraf açılamadı. Başka bir JPG, PNG veya WebP dosyası deneyin.'); };
        img.src = okuyucu.result;
      };
      okuyucu.onerror = function () { if (surum === fotoSurumu) fotoHatasi('Dosya okunamadı. Lütfen yeniden seçin.'); };
      okuyucu.readAsDataURL(dosya);
    });

    document.getElementById('foto-kaldir').addEventListener('click', function () {
      fotoSurumu++;
      fotoHatasi('');
      fotograf = null;
      fotoGirdi.value = '';
      fotoOnizleme.innerHTML = '';
      this.hidden = true;
      ciz();
      ozetGuncelle();
      durumYaz('Fotoğraf kaldırıldı.', true);
    });

    /* --- Onay diyaloğu: üretim öncesi son kontrol --- */
    var diyalog = document.getElementById('onay-diyalog');
    var tasdik = document.getElementById('onay-tasdik');
    var gonderBtn = document.getElementById('btn-gonder');

    function onaySatirlari() {
      var tema = UI.temaBul(durum.tema);
      var urun = UI.urunBul(durum.urun);
      var amb = secili(durum.ambalaj, D.studyo.ambalajRenkleri);
      var kur = secili(durum.kurdele, D.studyo.kurdeler);
      var kart = secili(durum.kart, D.studyo.kartlar);
      var satirlar = [
        ['Ürün', (urun ? urun.ad : durum.urun) + ' · ' + durum.boyut],
        ['Özel gün', tema ? tema.ad : durum.tema],
        ['Çikolata', etiketAd(durum.cikolata, D.studyo.cikolataTipleri)],
        ['Ambalaj / kurdele', etiketAd(durum.ambalaj, D.studyo.ambalajRenkleri) + ' · ' + etiketAd(durum.kurdele, D.studyo.kurdeler)],
        ['Kart', etiketAd(durum.kart, D.studyo.kartlar)],
        ['Yazı / çerçeve', etiketAd(durum.font, D.studyo.fontlar) + ' · ' + etiketAd(durum.cerceve, D.studyo.cerceveler || [])],
        ['İsim', durum.isim || '—'],
        ['Tarih', durum.tarih ? tarihYaz(durum.tarih) : '—'],
        ['Kart notu', durum.mesaj || '—'],
        ['Fotoğraf / logo', fotograf ? fotograf.ad : 'eklenmedi'],
        ['Alıcı', durum.aliciAdi || '—'],
        ['Teslim şekli', etiketAd(durum.teslimSekli, D.studyo.teslimSekilleri)],
        ['Hedef teslim günü', durum.teslimTarihi ? tarihYaz(durum.teslimTarihi) : 'belirtilmedi'],
        ['Adet', durum.adet],
      ];
      if (durum.teslimNotu) satirlar.splice(satirlar.length - 1, 0, ['Teslim notu', durum.teslimNotu]);
      return satirlar;
    }

    function onayAc() {
      if (!/^(photo-mockup|product-photo)$/.test(canvas.dataset.renderMode || '')) {
        durumYaz('Tasarımı onaylamadan önce ürün görselinin yüklenmesini bekleyin.', false);
        return;
      }
      kanalEl.hidden = true;
      document.querySelector('.onay-tasdik').hidden = false;
      document.querySelector('.onay-eylem').hidden = false;
      document.getElementById('onay-son-siparis').hidden = false;
      var tuval = document.getElementById('onay-tuval');
      tuval.width = 480;
      tuval.height = 480;
      tuval.getContext('2d').drawImage(canvas, 0, 0, 480, 480);

      document.getElementById('onay-liste').innerHTML = onaySatirlari()
        .map(function (s) {
          return '<li><span>' + UI.kacir(s[0]) + '</span><span>' + UI.kacir(s[1]) + '</span></li>';
        })
        .join('');

      document.getElementById('onay-son-siparis').textContent = (D.studyo.sonSiparisNotu ? '📅 ' + D.studyo.sonSiparisNotu + ' ' : '') + 'Hazırlık ve teslim tarihini atölyeyle netleştirin.';
      tasdik.checked = false;
      gonderBtn.disabled = true;
      document.getElementById('onay-durum').textContent = '';

      if (typeof diyalog.showModal === 'function') diyalog.showModal();
      else diyalog.setAttribute('open', '');
      tasdik.focus();
    }

    tasdik.addEventListener('change', function () {
      gonderBtn.disabled = !tasdik.checked;
    });

    /* --- Teklif kaydı (plan 2.5) ve kanal seçimi (2.6) --- */
    var kanalEl = document.getElementById('onay-kanal');
    var sonTeklif = null;

    function teklifVerisi(tahmin) {
      return {
        tema: durum.tema, urun: durum.urun, boyut: durum.boyut, adet: durum.adet,
        tasarim: durum.sablon || '',
        teslimSekli: durum.teslimSekli, teslimTarihi: durum.teslimTarihi || '', aliciAdi: durum.aliciAdi || '',
        tahmin: tahmin ? tahmin.toplam : null,
        ozet: ozetEl ? ozetEl.value : ozetUret(),
        secimler: {
          cikolata: durum.cikolata, ambalaj: durum.ambalaj, kurdele: durum.kurdele, kart: durum.kart, font: durum.font,
          isim: durum.isim, tarih: durum.tarih, mesaj: durum.mesaj, ekstralar: durum.ekstralar, teslimNotu: durum.teslimNotu || '',
          fotograf: !!fotograf, sablon: durum.sablon, yaziRenk: durum.yaziRenk, yerlesim: durum.yerlesim, cerceve: durum.cerceve
        }
      };
    }

    function kanalIsaretle(kanal) {
      if (!sonTeklif) return;
      try {
        fetch('/api/teklif', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kod: sonTeklif.kod, anahtar: sonTeklif.anahtar, kanal: kanal }), keepalive: true });
      } catch (e) { /* sessiz */ }
    }

    function kanalGoster(t) {
      sonTeklif = t;
      document.getElementById('onay-kod').textContent = t.kod;
      var takip = document.getElementById('onay-takip');
      takip.href = t.takip;
      takip.textContent = t.takip.replace(/^https?:\/\//, '');
      var wa = document.getElementById('kanal-wa');
      wa.hidden = !t.whatsapp;
      if (t.whatsapp) wa.href = t.whatsapp;
      document.getElementById('kanal-ig').href = t.instagram;
      document.getElementById('kanal-paylas').hidden = !paylasDugmesiDestekliMi();
      document.querySelector('.onay-tasdik').hidden = true;
      document.querySelector('.onay-eylem').hidden = true;
      document.getElementById('onay-son-siparis').hidden = true;
      kanalEl.hidden = false;
      document.getElementById('kanal-ig').focus();
    }

    function teklifKaydet() {
      var tahmin = fiyatTahmini();
      var onayDurum = document.getElementById('onay-durum');
      gonderBtn.disabled = true;
      onayDurum.textContent = 'Tasarımınız kaydediliyor…';
      pngBlob(function (blob) {
        var fd = new FormData();
        fd.append('veri', JSON.stringify(teklifVerisi(tahmin)));
        fd.append('gorsel', blob, dosyaAdi());
        fetch('/api/teklif', { method: 'POST', body: fd })
          .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.hata || 'Kayıt başarısız'); return j; }); })
          .then(function (t) {
            onayDurum.textContent = '';
            kanalGoster(t);
          })
          .catch(function (e) {
            gonderBtn.disabled = false;
            onayDurum.textContent = (e.message || 'Kayıt yapılamadı.') + ' Görseli indirip doğrudan da gönderebilirsiniz.';
          });
      });
    }

    gonderBtn.addEventListener('click', function () {
      if (!tasdik.checked) return;
      teklifKaydet();
    });

    document.getElementById('kanal-wa').addEventListener('click', function () { kanalIsaretle('whatsapp'); });
    document.getElementById('kanal-ig').addEventListener('click', function () {
      kanalIsaretle('instagram');
      var metin = sonTeklif ? sonTeklif.mesaj : ozetUret();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(function () {
          document.getElementById('kanal-not').textContent = 'Özet ve takip kodu panoya kopyalandı; Instagram sohbetine yapıştırın. Görseli de indirip ekleyebilirsiniz.';
        }, function () {});
      }
    });
    document.getElementById('kanal-paylas').addEventListener('click', function () {
      kanalIsaretle('share');
      akilliPaylas(sonTeklif ? sonTeklif.mesaj : null);
    });
    document.getElementById('kanal-indir').addEventListener('click', function () {
      kanalIsaretle('download');
      indir();
    });
    document.getElementById('kanal-kapat').addEventListener('click', function () {
      if (typeof diyalog.close === 'function') diyalog.close();
      else diyalog.removeAttribute('open');
      durumYaz('Talebiniz ' + (sonTeklif ? sonTeklif.kod : '') + ' koduyla kaydedildi.', true);
    });

    document.getElementById('btn-duzenle').addEventListener('click', function () {
      if (typeof diyalog.close === 'function') diyalog.close();
      else diyalog.removeAttribute('open');
    });

    /* Eylemler */
    document.getElementById('btn-paylas').addEventListener('click', onayAc);
    document.getElementById('btn-indir').addEventListener('click', indir);
    document.getElementById('btn-wa').addEventListener('click', sadeceMetin);

    var sifirla = document.getElementById('btn-sifirla');
    sifirla.addEventListener('click', function () {
      durum = JSON.parse(ilkTasarim.json);
      fotograf = ilkTasarim.foto;
      kontrolleriYansit(); ciz(); ozetGuncelle(); adimaGit(0, true);
      durumYaz('Başlangıç tasarımına dönüldü. Geri al ile son tasarımınıza dönebilirsiniz.', true);
    });

    if (durum.sablon) sablonUygula();
  }

  /* --------------------------------- Başlat ----------------------------- */

  function basla() {
    canvas.width = OLCO;
    canvas.height = OLCO;

    kontrolleriKur();
    adimlariKur();
    ilkTasarim = { json: JSON.stringify(durum), foto: fotograf };
    gecmisHazir = true;
    document.querySelectorAll('.studio-reference').forEach(function (button) {
      button.addEventListener('click', function () {
        var choice = document.querySelector('input[name="tema"][value="' + button.dataset.tema + '"]');
        if (!choice) {
          document.getElementById('ilham-durum').textContent = 'Bu özel gün seçili ürün tipi için sunulmuyor; önce 1. adımda ürünü değiştirin.';
          return;
        }
        choice.click();
        adimaGit(1, true);
        document.querySelectorAll('.studio-reference').forEach(function (item) {
          item.classList.toggle('studio-reference--selected', item === button);
        });
        document.getElementById('ilham-durum').textContent = button.querySelector('span').childNodes[0].textContent.trim() + ' teması seçildi. Aşağıdaki ayarları değiştirebilirsiniz.';
      });
    });
    document.getElementById('alan-tema').addEventListener('change', function (event) {
      if (event.target.name !== 'tema') return;
      document.querySelectorAll('.studio-reference').forEach(function (item) {
        item.classList.toggle('studio-reference--selected', item.dataset.tema === event.target.value);
      });
    });
    var taslakAnahtar = 'beyza-studyo-taslak-v1';
    var taslakYukle = document.getElementById('taslak-yukle');
    var taslakSil = document.getElementById('taslak-sil');
    function taslakDugmeleriniGuncelle() {
      try {
        var varMi = !!localStorage.getItem(taslakAnahtar);
        taslakYukle.hidden = !varMi;
        taslakSil.hidden = !varMi;
      } catch (error) {
        taslakYukle.hidden = true;
        taslakSil.hidden = true;
      }
    }
    document.getElementById('taslak-kaydet').addEventListener('click', function () {
      try {
        var kayit = { version: 2, durum: durum, kayitZamani: new Date().toISOString() };
        localStorage.setItem(taslakAnahtar, JSON.stringify(kayit));
        taslakDugmeleriniGuncelle();
        durumYaz('Taslak bu cihazda kaydedildi. Fotoğrafı yeniden yüklemeniz gerekir.', true);
      } catch (error) {
        durumYaz('Taslak kaydedilemedi. Tarayıcı depolama ayarlarını kontrol edin.', false);
      }
    });
    taslakYukle.addEventListener('click', function () {
      try {
        var kayit = JSON.parse(localStorage.getItem(taslakAnahtar));
        if (kayit && kayit.version === 2) {
          var dogrulanan = taslagiDogrula(kayit.durum);
          durum = dogrulanan;
          fotograf = null;
          kontrolleriYansit(); ciz(); ozetGuncelle();
          adimaGit(2, true);
          durumYaz('Taslak, renkleri ve yerleşimiyle açıldı. Fotoğraf kullandıysanız yeniden yükleyin.', true);
          return;
        }
        if (!Array.isArray(kayit)) throw new Error('Geçersiz taslak');
        var eskiDurum = JSON.parse(ilkTasarim.json);
        eskiDurum.ekstralar = [];
        kayit.forEach(function (item) {
          if (!item || typeof item !== 'object') throw new Error('Geçersiz taslak alanı');
          if (item.extra && item.checked) eskiDurum.ekstralar.push(item.extra);
          var ad = item.name || item.id;
          if (Object.prototype.hasOwnProperty.call(eskiDurum, ad) && typeof eskiDurum[ad] === 'string' && typeof item.value === 'string') eskiDurum[ad] = item.value;
          if (item.id === 'yazi-renk-ozel' && !eskiDurum.yaziRenk) eskiDurum.yaziRenk = item.value;
          if (item.id === 'yazi-boyut') eskiDurum.yerlesim.yazi.olcek = Number(item.value);
          if (item.id === 'foto-boyut') eskiDurum.yerlesim.foto.olcek = Number(item.value);
        });
        durum = taslagiDogrula(eskiDurum);
        fotograf = null;
        kontrolleriYansit(); ciz(); ozetGuncelle(); adimaGit(2, true);
        durumYaz('Taslak açıldı. Fotoğraf kullandıysanız yeniden yükleyin.', true);
      } catch (error) {
        durumYaz('Taslak açılamadı; kayıt bozulmuş veya ürün seçenekleri değişmiş olabilir. Mevcut tasarımınız korundu.', false);
      }
    });
    taslakSil.addEventListener('click', function () {
      try {
        localStorage.removeItem(taslakAnahtar);
        taslakDugmeleriniGuncelle();
        durumYaz('Kaydedilen taslak bu cihazdan silindi.', true);
      } catch (error) {
        durumYaz('Taslak silinemedi.', false);
      }
    });
    taslakDugmeleriniGuncelle();
    document.getElementById('btn-kopyala').addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(ozetEl.value);
        durumYaz('Tasarım özeti kopyalandı. Instagram mesajınıza yapıştırabilirsiniz.', true);
      } catch (error) {
        ozetEl.focus();
        ozetEl.select();
        durumYaz('Özet seçildi. Kopyalamak için Ctrl+C veya cihazınızın kopyala komutunu kullanın.', true);
      }
    });
    ciz();
    ozetGuncelle();

    if (tasarim) {
      durumYaz('“' + tasarim.ad + '” tasarımından başladın; her şeyi değiştirebilirsin.', true);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        ciz();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }
})();
