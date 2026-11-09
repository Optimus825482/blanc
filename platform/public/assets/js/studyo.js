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
  function madlen(x, y, cap, dolgu, kenar) {
    // Güvenlik: eksik renk gelirse varsayılana düş (canvas gradyanı hata vermesin)
    if (!dolgu || typeof dolgu !== 'string') dolgu = '#7A4A2B';
    if (!kenar || typeof kenar !== 'string' || kenar === '#00000022') kenar = dolgu;
    var grad = ctx.createRadialGradient(x - cap * 0.25, y - cap * 0.3, cap * 0.1, x, y, cap);
    grad.addColorStop(0, dolgu);
    grad.addColorStop(1, kenar);
    ctx.beginPath();
    ctx.arc(x, y, cap, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, cap, 0, Math.PI * 2);
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = Math.max(2, cap * 0.06);
    for (var i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(x - cap * 0.15, y + cap * 0.1, cap * (0.22 + i * 0.2), Math.PI * 0.15, Math.PI * 1.05);
      ctx.stroke();
    }
    if (fotograf && durum.ekstralar.indexOf('cikolataUzeriIsim') === -1) {
      // fotoğraf varsa ve isim baskısı kapalıysa çikolatanın üstünde küçük fotoğraf
      ctx.beginPath();
      ctx.arc(x, y, cap * 0.55, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(fotograf.img, x - cap * 0.55, y - cap * 0.55, cap * 1.1, cap * 1.1);
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, cap, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(61,32,22,0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (durum.ekstralar.indexOf('cikolataUzeriIsim') > -1 && durum.isim) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, cap * 0.92, 0, Math.PI * 2);
      ctx.clip();
      var kisa = durum.isim.length > 12 ? durum.isim.substring(0, 12) : durum.isim;
      var punto = Math.max(11, Math.min(cap * 0.42, (cap * 1.7) / Math.max(6, kisa.length)));
      ctx.font = '600 ' + punto + 'px ' + fontCss();
      ctx.fillStyle = metinRengi(dolgu);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(kisa, x, y);
      ctx.restore();
    }
  }

  function fontCss() {
    var f = secili(durum.font, D.studyo.fontlar);
    return f ? f.css : 'serif';
  }

  /**
   * Madlen rengini verir.
   * @param {number} sira  Izgaradaki sıra numarası (karışık tipte renk döngüsü için)
   * @param {object} cik   Çikolata tipi kaydı (dolgu/kenar alanlarıyla)
   */
  function cikolata(sira, cik) {
    if (!cik) return { dolgu: '#7A4A2B', kenar: '#5C351C' };
    if (cik.dolgu === 'mix') {
      var dizi = D.studyo.cikolataTipleri.filter(function (x) {
        return x.dolgu !== 'mix';
      });
      if (!dizi.length) return { dolgu: '#7A4A2B', kenar: '#5C351C' };
      var secilen = dizi[sira % dizi.length];
      return { dolgu: secilen.dolgu, kenar: secilen.kenar };
    }
    return { dolgu: cik.dolgu, kenar: cik.kenar };
  }

  /* --------------------------------- Ana çizim --------------------------- */

  function ciz() {
    var amb = secili(durum.ambalaj, D.studyo.ambalajRenkleri);
    var kur = secili(durum.kurdele, D.studyo.kurdeler);
    var kart = secili(durum.kart, D.studyo.kartlar);
    var urun = UI.urunBul(durum.urun);
    var cik = secili(durum.cikolata, D.studyo.cikolataTipleri);
    var tema = UI.temaBul(durum.tema);

    ctx.clearRect(0, 0, OLCO, OLCO);
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, OLCO, OLCO);

    // Zemin dokusu: çok hafif dış çerçeve
    ctx.strokeStyle = 'rgba(207,181,106,0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, OLCO - 48, OLCO - 48);

    if (urun.tip === 'bar') {
      cizBar(amb, kur, kart, cik, tema);
    } else if (urun.tip === 'tepsi') {
      cizTepsi(amb, kur, kart, cik, tema);
    } else {
      cizKutu(amb, kur, kart, cik, tema);
    }

    // Filigran
    ctx.font = '400 20px ' + fontCss();
    ctx.fillStyle = 'rgba(61,32,22,0.45)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(C.marka + ' · tasarım önizlemesi', 56, OLCO - 52);
    ctx.textAlign = 'right';
    ctx.fillText(tasarimKodu(), OLCO - 56, OLCO - 52);
  }

  function ustBasliklar(tema, x, y, en, ortala) {
    ctx.textAlign = ortala ? 'center' : 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '500 24px ' + fontCss();
    ctx.fillStyle = 'rgba(61,32,22,0.6)';
    var etiket = tema ? tema.ad.toLocaleUpperCase('tr-TR') : '';
    ctx.fillText(etiket, x, y);

    if (durum.isim) {
      var punto = sigdir(64, fontCss(), durum.isim, en);
      ctx.font = '500 ' + punto + 'px ' + fontCss();
      ctx.fillStyle = '#3d2016';
      ctx.fillText(durum.isim, x, y + 62);
    }
    if (durum.tarih) {
      ctx.font = '400 26px ' + fontCss();
      ctx.fillStyle = 'rgba(61,32,22,0.75)';
      ctx.fillText(tarihYaz(durum.tarih), x, y + (durum.isim ? 104 : 62));
    }
    ctx.textAlign = 'left';
  }

  function tarihYaz(iso) {
    var p = String(iso).split('-');
    if (p.length !== 3) return iso;
    var aylar = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
    ];
    var ay = aylar[parseInt(p[1], 10) - 1] || p[1];
    return parseInt(p[2], 10) + ' ' + ay + ' ' + p[0];
  }

  function cizKutu(amb, kur, kart, cik, tema) {
    var x = 90;
    var y = 160;
    var g = OLCO - 180;
    var h = OLCO - 160 - 150;

    yuvarlak(ctx, x, y, g, h, 26);
    ctx.fillStyle = amb.zemin;
    ctx.fill();
    ctx.strokeStyle = amb.kenar;
    ctx.lineWidth = 3;
    ctx.stroke();

    yuvarlak(ctx, x + 16, y + 16, g - 32, h - 32, 18);
    ctx.strokeStyle = 'rgba(61,32,22,0.14)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ustBasliklar(tema, x + 44, y + 78, g - 88, false);

    // Çikolata ızgarası
    var adet = parseInt(durum.boyut, 10);
    if (!adet || adet < 1) adet = 16;
    var kolon = Math.ceil(Math.sqrt(adet));
    var satir = Math.ceil(adet / kolon);
    var alanX = x + 90;
    var alanY = y + 190;
    var alanG = g - 180;
    var alanH = h - 330;
    var hucre = Math.min(alanG / kolon, alanH / satir);
    var cap = (hucre * 0.42);

    for (var i = 0; i < adet; i++) {
      var s = Math.floor(i / kolon);
      var k = i % kolon;
      var satirdakiAdet = Math.min(kolon, adet - s * kolon);
      var kaydirma = (alanG - satirdakiAdet * hucre) / 2;
      var cx = alanX + kaydirma + k * hucre + hucre / 2;
      var cy = alanY + s * hucre + hucre / 2;
      var renk = cikolata(s * kolon + k, cik);
      madlen(cx, cy, cap, renk.dolgu, renk.kenar);
    }

    if (kur.renk) serit(x, y, g, h, kur.renk);
    if (kart.zemin) kartCiz(kart, x + g - 350, y + h - 158, 310, 122);
  }

  function cizBar(amb, kur, kart, cik, tema) {
    var bG = 620;
    var bH = 300;
    var x = (OLCO - bG) / 2;
    var y = 300;

    ustBasliklar(tema, x, y - 92, bG, false);

    yuvarlak(ctx, x, y, bG, bH, 22);
    var dolgu = cik.dolgu === 'mix' ? D.studyo.cikolataTipleri[0].dolgu : cik.dolgu;
    var kenar = cik.kenar === '#00000022' ? dolgu : cik.kenar;
    var grad = ctx.createLinearGradient(x, y, x, y + bH);
    grad.addColorStop(0, dolgu);
    grad.addColorStop(1, kenar);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(61,32,22,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bölmeler
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2;
    for (var i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x + (bG / 4) * i, y + 8);
      ctx.lineTo(x + (bG / 4) * i, y + bH - 8);
      ctx.stroke();
    }

    // Bar üstü yazı
    if (durum.isim || durum.mesaj) {
      var metin = durum.mesaj || durum.isim;
      ctx.save();
      ctx.beginPath();
      yuvarlak(ctx, x + 40, y + 60, bG - 80, bH - 120, 14);
      ctx.clip();
      sigdir(52, fontCss(), metin, bG - 120);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = metinRengi(dolgu);
      ctx.fillText(metin, x + bG / 2, y + bH / 2);
      ctx.restore();
    }

    if (fotograf) {
      var r = 112;
      var px = x + bG + 40;
      var py = y + bH + 40;
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(fotograf.img, px - r, py - r, r * 2, r * 2);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.strokeStyle = kur.renk || '#cfb56a';
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    if (kart.zemin) kartCiz(kart, x, y + bH + 40, 300, 118);
  }

  function cizTepsi(amb, kur, kart, cik, tema) {
    var cx = OLCO / 2;
    var cy = 470;
    var rg = 400;
    var rh = 300;

    ustBasliklar(tema, 120, 150, OLCO - 240, false);

    // Tepsi
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rg, rh, 0, 0, Math.PI * 2);
    var grad = ctx.createRadialGradient(cx - 80, cy - 90, 40, cx, cy, rg);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, amb.zemin);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = kur.renk || amb.kenar;
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    // Tepsi üzerine dizilim
    var sayi = 12;
    var cap = 62;
    for (var i = 0; i < sayi; i++) {
      var aci = (Math.PI * 2 * i) / sayi - Math.PI / 2;
      var px = cx + Math.cos(aci) * (rg - 110);
      var py = cy + Math.sin(aci) * (rh - 100);
      var renk = cikolata(i, cik);
      madlen(px, py, cap, renk.dolgu, renk.kenar);
    }

    // Orta isim plakası
    var pG = 300;
    var pH = 130;
    yuvarlak(ctx, cx - pG / 2, cy - pH / 2, pG, pH, 14);
    ctx.fillStyle = amb.metin === '#F6E7D8' || amb.metin === '#F0E7D6' || amb.metin === '#EFE3D2' ? '#fffdf9' : '#fffdf9';
    ctx.fill();
    ctx.strokeStyle = 'rgba(61,32,22,0.18)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var etiket = durum.isim || (tema ? tema.kisa : 'İsim');
    sigdir(44, fontCss(), etiket, pG - 48);
    ctx.fillStyle = '#3d2016';
    ctx.fillText(etiket, cx, cy - (durum.tarih ? 16 : 0));
    if (durum.tarih) {
      ctx.font = '400 24px ' + fontCss();
      ctx.fillStyle = 'rgba(61,32,22,0.72)';
      ctx.fillText(tarihYaz(durum.tarih), cx, cy + 30);
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    if (kart.zemin) kartCiz(kart, cx - 150, cy + rh + 40, 300, 118);
  }

  function serit(x, y, g, h, renk) {
    var ys = y + h * 0.62;
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = renk;
    ctx.fillRect(x + 6, ys, g - 12, 34);
    ctx.restore();

    // Fiyonk
    var fx = x + g - 70;
    var fy = ys + 17;
    ctx.fillStyle = renk;
    ctx.beginPath();
    ctx.ellipse(fx - 26, fy - 10, 26, 18, -0.4, 0, Math.PI * 2);
    ctx.ellipse(fx + 26, fy - 10, 26, 18, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx, fy, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  function kartCiz(kart, x, y, g, h) {
    yuvarlak(ctx, x, y, g, h, 12);
    ctx.fillStyle = kart.zemin;
    ctx.fill();
    ctx.strokeStyle = 'rgba(61,32,22,0.16)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    var mesaj = durum.mesaj || (durum.isim ? 'Sevgilerle, ' + durum.isim : 'Kart notu');
    ctx.font = '400 24px ' + fontCss();
    ctx.fillStyle = kart.metin;
    var satirlar = satirlaraBol(mesaj, g - 48).slice(0, 3);
    satirlar.forEach(function (s, i) {
      ctx.fillText(s, x + 24, y + 46 + i * 30);
    });
  }

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

  function ozetGuncelle() {
    var metin = ozetUret();
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

  function akilliPaylas() {
    var metin = ozetUret();
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

    gonderBtn.addEventListener('click', function () {
      if (!tasdik.checked) return;
      if (typeof diyalog.close === 'function') diyalog.close();
      else diyalog.removeAttribute('open');
      akilliPaylas();
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
