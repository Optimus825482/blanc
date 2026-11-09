/* ==========================================================================
   Beyza Blanc — tasarım stüdyosu
   Tarayıcıda çalışır: seçimler canvas üzerinde canlı önizlenir, tasarım PNG
   olarak üretilir ve özet metniyle birlikte Instagram'a aktarılır.
   Sunucuya hiçbir şey gönderilmez; yüklenen fotoğraf cihazdan çıkmaz.
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

  /* ----------------------------- Başlangıç durumu ----------------------- */

  var durum = {
    gorunum: 'gercek',
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
  altliklariYukle();

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
    var tip = urun.tip === 'bar' ? 'bar' : urun.tip === 'tepsi' ? 'tepsi' : 'kutu';
    var gercek = durum.gorunum === 'gercek' ? gercekGorsel(tema, tip) : null;
    if (gercek) {
      cizGercek(gercek, amb, kur, kart, cik, tema, urun, tip);
      return;
    }
    zeminCiz(tip);

    if (tip === 'bar') {
      cizBar(amb, kur, kart, cik, tema);
    } else if (tip === 'tepsi') {
      cizTepsi(amb, kur, kart, cik, tema);
    } else {
      cizKutu(amb, kur, kart, cik, tema);
    }

    // Filigran
    ctx.font = '400 20px ' + fontCss();
    ctx.fillStyle = 'rgba(61,32,22,0.5)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(C.marka + ' · tasarım önizlemesi', 56, OLCO - 44);
    ctx.textAlign = 'right';
    ctx.fillText(tasarimKodu(), OLCO - 56, OLCO - 44);
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
    ustBasliklar(tema, ic.x + 54, kartY + 54, ic.g - 108, false, '#3d2016');

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

    ustBasliklar(tema, x, y - 96, bG, false, '#3d2016');

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

    // Bar üstü yazı (kabartma)
    if (durum.isim || durum.mesaj) {
      var metin = durum.mesaj || durum.isim;
      ctx.save();
      yuvarlak(ctx, x + 30, y + 40, bG - 60, bH - 80, 14);
      ctx.clip();
      sigdir(54, fontCss(), metin, bG - 120);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillText(metin, x + bG / 2, y + bH / 2 + 2);
      ctx.fillStyle = metinRengi(dolgu) === '#3d2016' ? koyu(dolgu, 0.5) : acik(dolgu, 0.62);
      ctx.fillText(metin, x + bG / 2, y + bH / 2);
      ctx.restore();
    }

    if (fotograf) {
      var fr = 112;
      var px = x + bG - 20;
      var py = y + bH + 100;
      golgeli(function () {
        ctx.beginPath();
        ctx.arc(px, py, fr + 8, 0, Math.PI * 2);
        ctx.fillStyle = '#fffdf9';
        ctx.fill();
      }, 'rgba(30,15,8,0.4)', 22, 4, 10);
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, fr, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(fotograf.img, px - fr, py - fr, fr * 2, fr * 2);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(px, py, fr + 3, 0, Math.PI * 2);
      ctx.strokeStyle = kur.renk || '#cfb56a';
      ctx.lineWidth = 5;
      ctx.stroke();
    }

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
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var etiket = durum.isim || (tema ? tema.kisa : 'İsim');
    sigdir(44, fontCss(), etiket, pG - 56);
    kabartmaYazi(etiket, cx, cy - (durum.tarih ? 16 : 0), '#3d2016', 'rgba(255,255,255,0.7)');
    if (durum.tarih) {
      ctx.font = '400 24px ' + fontCss();
      ctx.fillStyle = 'rgba(61,32,22,0.72)';
      ctx.fillText(tarihYaz(durum.tarih), cx, cy + 30);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

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

  /* ------------------------------ Gerçek görsel modu --------------------- */
  // Özel güne (ve ürün tipine) göre atölyenin gerçek çalışmasının fotoğrafı altlık olur;
  // isim, tarih, kurdele rengi, kart ve yüklenen fotoğraf üstüne bindirilir.
  var gercekImg = {};

  function gercekYol(tema, tip) {
    var harita = (altlikGeo && altlikGeo.gercek) || {};
    var kayit = (tema && harita[tema.id]) || {};
    var varsayilan = harita.varsayilan || {};
    var urunTipi = D.studyo.urunTipleri.filter(function (u) { return u.id === durum.urun; })[0];
    var panelAltlik = urunTipi && urunTipi.altlik ? urunTipi.altlik : null;
    return kayit[tip] || panelAltlik || varsayilan[tip] || kayit.kutu || varsayilan.kutu || null;
  }

  function gercekGorsel(tema, tip) {
    var yol = gercekYol(tema, tip);
    if (!yol) return null;
    if (gercekImg[yol] === undefined) {
      gercekImg[yol] = null;
      var img = new Image();
      img.onload = function () { gercekImg[yol] = img; ciz(); };
      img.onerror = function () { gercekImg[yol] = false; ciz(); };
      img.src = yol;
    }
    return gercekImg[yol] || null;
  }

  function kaplaCiz(img, x, y, g, h) {
    var oran = Math.max(g / img.naturalWidth, h / img.naturalHeight);
    var sw = g / oran;
    var sh = h / oran;
    ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, g, h);
  }

  function camPanel(x, y, g, h, r) {
    golgeli(function () {
      yuvarlak(ctx, x, y, g, h, r);
      ctx.fillStyle = 'rgba(255,252,246,0.86)';
      ctx.fill();
    }, 'rgba(20,10,5,0.45)', 30, 0, 12);
    yuvarlak(ctx, x, y, g, h, r);
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function cizGercek(img, amb, kur, kart, cik, tema, urun, tip) {
    var vurgu = (tema && tema.vurgu) || '#a98336';
    kaplaCiz(img, 0, 0, OLCO, OLCO);

    // Alt ve üst karartma: yazı okunurluğu
    var ust = ctx.createLinearGradient(0, 0, 0, 220);
    ust.addColorStop(0, 'rgba(20,10,5,0.42)');
    ust.addColorStop(1, 'rgba(20,10,5,0)');
    ctx.fillStyle = ust;
    ctx.fillRect(0, 0, OLCO, 220);
    var alt = ctx.createLinearGradient(0, OLCO - 420, 0, OLCO);
    alt.addColorStop(0, 'rgba(20,10,5,0)');
    alt.addColorStop(1, 'rgba(20,10,5,0.55)');
    ctx.fillStyle = alt;
    ctx.fillRect(0, OLCO - 420, OLCO, 420);

    // Özel gün rozeti (sol üst)
    var etiket = tema ? ((tema.ikon ? tema.ikon + '  ' : '') + tema.ad.toLocaleUpperCase('tr-TR')) : '';
    ctx.font = '600 22px ' + fontCss();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var rg = ctx.measureText(etiket).width + 56;
    golgeli(function () {
      yuvarlak(ctx, 48, 44, rg, 50, 25);
      ctx.fillStyle = vurgu;
      ctx.fill();
    }, 'rgba(0,0,0,0.35)', 14, 0, 4);
    ctx.fillStyle = metinRengi(vurgu) === '#3d2016' ? '#2b1a12' : '#fffaf2';
    ctx.fillText(etiket, 76, 70);

    // Ürün ve seçim çipi (sağ üst)
    var adetMetin = /^\d+$/.test(durum.boyut) ? durum.boyut + ' adet' : durum.boyut;
    var cip = (urun ? urun.ad : '') + ' · ' + adetMetin + ' · ' + (cik ? cik.ad : '') + ' · ' + amb.ad + ' ambalaj';
    ctx.font = '500 19px ' + fontCss();
    var cg = ctx.measureText(cip).width + 44;
    if (48 + rg + 16 + cg < OLCO - 48) {
      yuvarlak(ctx, OLCO - 48 - cg, 44, cg, 50, 25);
      ctx.fillStyle = 'rgba(255,252,246,0.9)';
      ctx.fill();
      ctx.fillStyle = '#3d2016';
      ctx.fillText(cip, OLCO - 48 - cg + 22, 70);
    }

    // İsim plakası (sol alt)
    var pX = 56, pG = fotograf ? OLCO - 56 - 300 - 32 : OLCO - 112, pH = durum.tarih ? 190 : 150, pY = OLCO - 150 - pH - 24;
    camPanel(pX, pY, pG, pH, 18);
    ctx.fillStyle = vurgu;
    ctx.fillRect(pX, pY + 24, 6, pH - 48);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    var isim = durum.isim || 'İsminiz burada';
    var punto = sigdir(68, fontCss(), isim, pG - 80);
    ctx.font = '500 ' + punto + 'px ' + fontCss();
    kabartmaYazi(isim, pX + 36, pY + 92, durum.isim ? '#3d2016' : 'rgba(61,32,22,0.45)', 'rgba(255,255,255,0.8)');
    if (durum.tarih) {
      ctx.font = '400 26px ' + fontCss();
      ctx.fillStyle = 'rgba(61,32,22,0.75)';
      ctx.fillText(tarihYaz(durum.tarih), pX + 36, pY + 136);
    }
    ctx.font = '500 15px ' + fontCss();
    ctx.fillStyle = 'rgba(61,32,22,0.55)';
    ctx.fillText('ATÖLYEDEN GERÇEK ÇALIŞMA · KİŞİSELLEŞTİRME ÖN İZLEMESİ', pX + 36, pY + pH - 24);

    // Yüklenen fotoğraf (sağ alt, çerçeveli)
    if (fotograf) {
      var fG = 300, fX = OLCO - 56 - fG, fY = pY + pH - fG;
      golgeli(function () {
        yuvarlak(ctx, fX - 10, fY - 10, fG + 20, fG + 20, 16);
        ctx.fillStyle = '#fffdf9';
        ctx.fill();
      }, 'rgba(20,10,5,0.45)', 26, 0, 10);
      ctx.save();
      yuvarlak(ctx, fX, fY, fG, fG, 10);
      ctx.clip();
      kaplaCiz(fotograf.img, fX, fY, fG, fG);
      ctx.restore();
    }

    // Kurdele: alt kenarda saten bant + fiyonk (kart varsa fiyonk kartın yanında)
    if (kur.renk) {
      satenBant(0, OLCO - 118, OLCO, 40, kur.renk, false);
      fiyonk(OLCO - 120, OLCO - 98, 30, kur.renk);
    }
    // Kart notu (bandın üstünde, sağda; fotoğraf varsa sola kayar)
    if (kart.zemin) kartCiz(kart, fotograf ? pX + pG - 300 : OLCO - 56 - 300, pY - 118 - 24, 300, 112);

    // Filigran
    ctx.font = '400 20px ' + fontCss();
    ctx.fillStyle = 'rgba(255,250,242,0.85)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(C.marka + ' · tasarım önizlemesi', 56, OLCO - 44);
    ctx.textAlign = 'right';
    ctx.fillText(tasarimKodu(), OLCO - 56, OLCO - 44);
  }

  function gorunumDugmeleri() {
    var dugmeler = document.querySelectorAll('.onizleme-mod button[data-gorunum]');
    var aciklama = document.querySelector('.onizleme-alt span');
    function guncelle() {
      Array.prototype.forEach.call(dugmeler, function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-gorunum') === durum.gorunum ? 'true' : 'false');
      });
      if (aciklama) {
        aciklama.textContent = durum.gorunum === 'gercek'
          ? 'Gerçek görsel — atölyenin bu özel gün için yaptığı çalışma; isim, tarih, kurdele ve kart seçimleriniz üstüne işlendi.'
          : 'Taslak çizim — adet, çikolata tipi ve ambalaj rengini şematik gösterir; birebir üretim provası değildir.';
      }
    }
    Array.prototype.forEach.call(dugmeler, function (b) {
      b.addEventListener('click', function () {
        durum.gorunum = b.getAttribute('data-gorunum');
        guncelle();
        ciz();
      });
    });
    guncelle();
  }
  gorunumDugmeleri();

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

  function ozetGuncelle() {
    var metin = ozetUret();
    var t = fiyatGuncelle();
    if (t) metin = metin.replace('\n\nTasarım görselini', '\n• Sitedeki tahmini fiyat: ' + paraYaz(t.toplam, t.para) + ' (kesin teklif atölyeden)\n\nTasarım görselini');
    if (ozetEl) ozetEl.value = metin;
  }

  /* --------------------------- PNG üretimi ve paylaşım ------------------- */

  function pngBlob(cb) {
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
    temaAlan.innerHTML = D.temalar
      .map(function (t) {
        return secimHTML('tema', t.id, t.ikon + ' ' + t.kisa, t.id === durum.tema);
      })
      .join('');

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
        'Hazırlık ve teslim zamanı atölyeyle görüşülerek netleştirilir.';
    }

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

    var isimGirdi = document.getElementById('isim');
    isimGirdi.maxLength = C.studyo.isimKarakter;
    var mesajGirdi = document.getElementById('mesaj');
    mesajGirdi.maxLength = C.studyo.mesajKarakter;
    var tarihGirdi = document.getElementById('tarih');

    /* Olaylar */
    document.getElementById('studyo-form').addEventListener('input', function (olay) {
      var h = olay.target;
      if (h.name === 'urun') {
        durum.urun = h.value;
        boyutlariCiz();
        var u = UI.urunBul(durum.urun);
        if (u.tip === 'bar' && /^\d+$/.test(durum.adet)) durum.adet = '1';
        if (u.tip === 'tepsi' && /^\d+$/.test(durum.adet)) durum.adet = '1';
        adetSecim.value = durum.adet;
        if (u.tip === 'bar') durum.cikolata = durum.cikolata === 'karisik' ? 'sutlu' : durum.cikolata;
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

    fotoGirdi.addEventListener('change', function () {
      var dosya = fotoGirdi.files && fotoGirdi.files[0];
      if (!dosya) return;
      if (dosya.size > C.studyo.maksFotoMB * 1024 * 1024) {
        durumYaz('Fotoğraf çok büyük (en fazla ' + C.studyo.maksFotoMB + ' MB).', false);
        fotoGirdi.value = '';
        return;
      }
      var okuyucu = new FileReader();
      okuyucu.onload = function () {
        var img = new Image();
        img.onload = function () {
          fotograf = { img: img, ad: dosya.name };
          fotoOnizleme.innerHTML =
            '<img src="' + okuyucu.result + '" alt="Yüklenen fotoğraf önizlemesi">' +
            '<span>' + UI.kacir(dosya.name) + '</span>';
          document.getElementById('foto-kaldir').hidden = false;
          ciz();
          ozetGuncelle();
          durumYaz('Fotoğraf önizlemeye eklendi. Cihazından çıkmadı.', true);
        };
        img.src = okuyucu.result;
      };
      okuyucu.readAsDataURL(dosya);
    });

    document.getElementById('foto-kaldir').addEventListener('click', function () {
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
        ['İsim', durum.isim || '—'],
        ['Tarih', durum.tarih ? tarihYaz(durum.tarih) : '—'],
        ['Kart notu', durum.mesaj || '—'],
        ['Fotoğraf / logo', fotograf ? fotograf.ad : 'eklenmedi'],
        ['Alıcı', durum.aliciAdi || '—'],
        ['Teslim şekli', etiketAd(durum.teslimSekli, D.studyo.teslimSekilleri)],
        ['Hedef teslim günü', durum.teslimTarihi ? tarihYaz(durum.teslimTarihi) : 'belirtilmedi'],
        ['Adet', durum.adet],
      ];
      if (durum.teslimNotu) satirlar.splice(12, 0, ['Teslim notu', durum.teslimNotu]);
      return satirlar;
    }

    function onayAc() {
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

      document.getElementById('onay-son-siparis').textContent = 'Hazırlık ve teslim tarihini atölyeyle netleştirin.';
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
        tasarim: new URLSearchParams(location.search).get('tasarim') || '',
        teslimSekli: durum.teslimSekli, teslimTarihi: durum.teslimTarihi || '', aliciAdi: durum.aliciAdi || '',
        tahmin: tahmin ? tahmin.toplam : null,
        ozet: ozetEl ? ozetEl.value : ozetUret(),
        secimler: {
          cikolata: durum.cikolata, ambalaj: durum.ambalaj, kurdele: durum.kurdele, kart: durum.kart, font: durum.font,
          isim: durum.isim, tarih: durum.tarih, mesaj: durum.mesaj, ekstralar: durum.ekstralar, teslimNotu: durum.teslimNotu || '',
          fotograf: !!fotograf, gorunum: durum.gorunum
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
      location.href = '/studyo';
    });
  }

  /* --------------------------------- Başlat ----------------------------- */

  function basla() {
    canvas.width = OLCO;
    canvas.height = OLCO;

    kontrolleriKur();
    document.querySelectorAll('.studio-reference').forEach(function (button) {
      button.addEventListener('click', function () {
        var choice = document.querySelector('input[name="tema"][value="' + button.dataset.tema + '"]');
        if (!choice) return;
        choice.click();
        document.querySelectorAll('.studio-reference').forEach(function (item) {
          item.classList.toggle('studio-reference--selected', item === button);
        });
        document.getElementById('ilham-durum').textContent = button.querySelector('span').childNodes[0].textContent.trim() + ' teması seçildi. Aşağıdaki ayarları değiştirebilirsiniz.';
        document.getElementById('tasarim-alani').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        var alanlar = Array.from(document.querySelectorAll('#studyo-form input, #studyo-form select, #studyo-form textarea'));
        var kayit = alanlar.filter(function (alan) {
          return alan.type !== 'file' && (alan.name || alan.id || alan.dataset.ekstra) &&
            (alan.type !== 'radio' || alan.checked);
        }).map(function (alan) {
          return { name: alan.name, id: alan.id, extra: alan.dataset.ekstra || '', value: alan.value, checked: alan.checked, type: alan.type };
        });
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
        if (!Array.isArray(kayit)) throw new Error('Geçersiz taslak');
        kayit.forEach(function (item) {
          var alan = Array.from(document.querySelectorAll('#studyo-form input, #studyo-form select, #studyo-form textarea')).find(function (candidate) {
            if (item.extra) return candidate.dataset.ekstra === item.extra;
            if (item.type === 'radio') return candidate.type === 'radio' && candidate.name === item.name && candidate.value === item.value;
            return item.id && candidate.id === item.id;
          });
          if (!alan || alan.type === 'file') return;
          if (alan.type === 'radio' || alan.type === 'checkbox') alan.checked = !!item.checked;
          else alan.value = item.value;
          alan.dispatchEvent(new Event('input', { bubbles: true }));
          alan.dispatchEvent(new Event('change', { bubbles: true }));
        });
        durumYaz('Taslak açıldı. Fotoğraf kullandıysanız yeniden yükleyin.', true);
      } catch (error) {
        durumYaz('Taslak okunamadı.', false);
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
