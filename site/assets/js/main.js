/* ==========================================================================
   Beyza Blanc — ortak arayüz + vitrin mantığı
   Üst bar (mega menü), alt bilgi, vitrin, çok eksenli filtreler ve
   WhatsApp bağlantıları tek yerden üretilir.
   ========================================================================== */

(function () {
  'use strict';

  var C = window.BEYZA;
  var D = window.BEYZA_DATA;

  /* ------------------------------- Yardımcılar --------------------------- */

  function $(secici, kok) {
    return (kok || document).querySelector(secici);
  }

  function $$(secici, kok) {
    return Array.prototype.slice.call((kok || document).querySelectorAll(secici));
  }

  function kacir(metin) {
    return String(metin == null ? '' : metin)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function numaraHazirMi() {
    return C.whatsapp && C.whatsapp.indexOf('5000000000') === -1;
  }

  function waLink(metin) {
    return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(metin);
  }

  function temaBul(id) {
    return D.temalar.filter(function (t) {
      return t.id === id;
    })[0];
  }

  function kimeBul(id) {
    return D.kime.filter(function (k) {
      return k.id === id;
    })[0];
  }

  function segmentBul(id) {
    return D.segmentler.filter(function (s) {
      return s.id === id;
    })[0];
  }

  function urunBul(id) {
    return D.studyo.urunTipleri.filter(function (u) {
      return u.id === id;
    })[0];
  }

  function tasarimBul(id) {
    return D.tasarimlar.filter(function (t) {
      return t.id === id;
    })[0];
  }

  function kokTemalar(kok) {
    return D.temalar.filter(function (t) {
      return t.kok === kok;
    });
  }

  function adetSayisi(tema) {
    return D.tasarimlar.filter(function (t) {
      return t.tema === tema;
    }).length;
  }

  /** Kategori sayfalarına giden sorgu dizesini üretir. */
  function koleksiyonLink(ek) {
    var parcalar = [];
    Object.keys(ek || {}).forEach(function (k) {
      if (ek[k]) parcalar.push(k + '=' + encodeURIComponent(ek[k]));
    });
    return 'koleksiyonlar.html' + (parcalar.length ? '?' + parcalar.join('&') : '');
  }

  /* ------------------------------- Menü yapısı --------------------------- */

  function ozelGunOgeleri(kok) {
    return kokTemalar(kok).map(function (t) {
      return { ad: t.ikon + ' ' + t.kisa, href: koleksiyonLink({ gun: t.id }) };
    });
  }

  function menuYapisi() {
    var kimeOgeleri = D.kime.map(function (k) {
      return { ad: k.ad, href: koleksiyonLink({ kime: k.id }) };
    });
    var urunOgeleri = D.studyo.urunTipleri.map(function (u) {
      return { ad: u.ad, href: koleksiyonLink({ urun: u.id }) };
    });

    return [
      {
        ad: 'Özel Güne Göre',
        href: 'koleksiyonlar.html',
        kolonlar: [
          { baslik: 'Kişisel özel günler', ogeler: ozelGunOgeleri('ozel-gun') },
          { baslik: 'Mevsim & takvim', ogeler: ozelGunOgeleri('mevsim') },
          { baslik: 'Kurumsal & iş', ogeler: ozelGunOgeleri('kurumsal') },
        ],
        tumu: { ad: 'Tüm özel günler', href: 'koleksiyonlar.html' },
      },
      {
        ad: 'Kime Göre',
        href: koleksiyonLink({ kime: D.kime[0].id }),
        kolonlar: [{ baslik: 'Kime alıyorsun?', ogeler: kimeOgeleri }],
      },
      {
        ad: 'Ürün Tipi',
        href: 'koleksiyonlar.html',
        kolonlar: [{ baslik: 'Ürün tipleri', ogeler: urunOgeleri }],
        tumu: { ad: 'Tüm tasarımlar', href: 'koleksiyonlar.html' },
      },
      {
        ad: 'Kurumsal & İş',
        href: 'kurumsal.html',
        kolonlar: [
          { baslik: 'Kurumsal günler', ogeler: ozelGunOgeleri('kurumsal') },
          {
            baslik: 'Kurumsal çalışma',
            ogeler: [
              { ad: 'Kurumsal hediye sayfası', href: 'kurumsal.html' },
              { ad: 'Toplu sipariş için yaz', href: 'kurumsal.html' },
              { ad: 'Tasarım stüdyosu', href: 'studyo.html' },
            ],
          },
        ],
      },
      {
        ad: 'Yeni & Çok Satan',
        href: koleksiyonLink({ sirala: 'cok-satan' }),
        kolonlar: [
          {
            baslik: 'Keşfet',
            ogeler: [
              { ad: 'Çok satanlar', href: koleksiyonLink({ sirala: 'cok-satan' }) },
              { ad: 'Yeni tasarımlar', href: koleksiyonLink({ sirala: 'yeni' }) },
            ],
          },
        ],
      },
      { ad: 'Tasarım Stüdyosu', href: 'studyo.html' },
    ];
  }

  var IKINCIL_MENU = [
    ['hakkimizda.html', 'Hakkımızda'],
    ['sss.html', 'S.S.S.'],
    ['iletisim.html', 'İletişim'],
  ];

  /* ------------------------------- Üst bar ------------------------------ */

  function ustbarKur() {
    var yer = $('[data-bilesen="ustbar"]');
    if (!yer) return;

    var aktif = location.pathname.split('/').pop() || 'index.html';
    var menu = menuYapisi();

    var kokler = menu
      .map(function (m, sira) {
        var aktifMi = m.href.split('?')[0] === aktif ? ' aria-current="page"' : '';

        if (!m.kolonlar) {
          return (
            '<li class="menu__oge"><a class="menu__kok" href="' +
            m.href +
            '"' +
            aktifMi +
            '>' +
            kacir(m.ad) +
            '</a></li>'
          );
        }

        var kolonlar = m.kolonlar
          .map(function (k) {
            return (
              '<div><h3>' +
              kacir(k.baslik) +
              '</h3><ul>' +
              k.ogeler
                .map(function (o) {
                  return '<li><a href="' + o.href + '">' + kacir(o.ad) + '</a></li>';
                })
                .join('') +
              '</ul></div>'
            );
          })
          .join('');

        var tumu = m.tumu
          ? '<div class="mega__tumu"><a href="' + m.tumu.href + '">' + kacir(m.tumu.ad) + ' →</a></div>'
          : '';

        return (
          '<li class="menu__oge" data-menu-oge>' +
          '<button class="menu__kok" type="button" aria-expanded="false" aria-controls="mega-' +
          sira +
          '"' +
          aktifMi +
          '>' +
          kacir(m.ad) +
          ' <span aria-hidden="true">▾</span></button>' +
          '<div class="mega" id="mega-' +
          sira +
          '" hidden><div class="mega__izgara">' +
          kolonlar +
          '</div>' +
          tumu +
          '</div></li>'
        );
      })
      .join('');

    var ikincil = IKINCIL_MENU.map(function (m) {
      return '<a href="' + m[0] + '">' + kacir(m[1]) + '</a>';
    }).join('');

    /* Mobil menü akordeonu */
    var mobilOgeler = menu
      .map(function (m, sira) {
        if (!m.kolonlar) {
          return '<li><a href="' + m.href + '">' + kacir(m.ad) + '</a></li>';
        }
        var altOgeler = m.kolonlar
          .map(function (k) {
            return (
              '<li><span class="mikro">' +
              kacir(k.baslik) +
              '</span><ul class="mobil-menu__alt">' +
              k.ogeler
                .map(function (o) {
                  return '<li><a href="' + o.href + '">' + kacir(o.ad) + '</a></li>';
                })
                .join('') +
              '</ul></li>'
            );
          })
          .join('');
        return (
          '<li><button class="mobil-menu__kok" type="button" aria-expanded="false" aria-controls="mobil-alt-' +
          sira +
          '">' +
          kacir(m.ad) +
          '<span aria-hidden="true">▾</span></button>' +
          '<ul class="mobil-menu__alt" id="mobil-alt-' +
          sira +
          '" hidden>' +
          altOgeler +
          '</ul></li>'
        );
      })
      .join('');

    yer.className = 'ustbar';
    yer.innerHTML =
      '<div class="kap ustbar__ic">' +
      '<a class="marka" href="index.html">' +
      '<span class="marka__ad">' +
      kacir(C.marka) +
      '</span>' +
      '<span class="marka__slogan">' +
      kacir(C.slogan) +
      '</span></a>' +
      '<nav aria-label="Ana menü"><ul class="menu">' +
      kokler +
      '</ul></nav>' +
      '<div class="ustbar__eylem">' +
      '<div class="ustbar__ikincil">' +
      ikincil +
      '</div>' +
      '<a class="btn btn--wa btn--kucuk ustbar__wa" href="' +
      waLink('Merhaba, ' + C.marka + ' ürünleri hakkında bilgi almak istiyorum.') +
      '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<button class="menu-dugme" type="button" aria-expanded="false" aria-controls="mobil-menu" data-menu-dugme>' +
      '<span class="visually-hidden">Menüyü aç</span><span aria-hidden="true">☰</span>' +
      '</button>' +
      '</div></div>' +
      '<div class="mobil-menu" id="mobil-menu" data-acik="false">' +
      '<nav aria-label="Mobil menü"><ul>' +
      mobilOgeler +
      '<li><a href="' +
      waLink('Merhaba, sipariş vermek istiyorum.') +
      '" target="_blank" rel="noopener">WhatsApp’tan yaz</a></li>' +
      '</ul></nav></div>';

    megaMenuDavranisi(yer);

    var dugme = $('[data-menu-dugme]', yer);
    var panel = $('#mobil-menu', yer);

    dugme.addEventListener('click', function () {
      var acik = panel.getAttribute('data-acik') === 'true';
      panel.setAttribute('data-acik', acik ? 'false' : 'true');
      dugme.setAttribute('aria-expanded', acik ? 'false' : 'true');
      dugme.querySelector('.visually-hidden').textContent = acik ? 'Menüyü aç' : 'Menüyü kapat';
    });

    $$('.mobil-menu__kok', panel).forEach(function (b) {
      b.addEventListener('click', function () {
        var hedef = document.getElementById(b.getAttribute('aria-controls'));
        var acik = b.getAttribute('aria-expanded') === 'true';
        b.setAttribute('aria-expanded', acik ? 'false' : 'true');
        if (hedef) hedef.hidden = acik;
        b.querySelector('span[aria-hidden]').textContent = acik ? '▾' : '▴';
      });
    });

    document.addEventListener('keydown', function (olay) {
      if (olay.key !== 'Escape') return;
      if (panel.getAttribute('data-acik') === 'true') {
        panel.setAttribute('data-acik', 'false');
        dugme.setAttribute('aria-expanded', 'false');
        dugme.focus();
      }
      tumMegaKapat(yer);
    });
  }

  /* Mega menü: hover'da 300 ms gecikmeyle, klavyede tıklamayla açılır */
  function megaMenuDavranisi(kok) {
    var zamanlayici = null;

    function kapat(oge) {
      var panel = $('.mega', oge);
      var dugme = $('.menu__kok', oge);
      if (panel) panel.hidden = true;
      if (dugme) dugme.setAttribute('aria-expanded', 'false');
    }

    function ac(oge) {
      $$('[data-menu-oge]', kok).forEach(function (d) {
        if (d !== oge) kapat(d);
      });
      var panel = $('.mega', oge);
      var dugme = $('.menu__kok', oge);
      if (panel) panel.hidden = false;
      if (dugme) dugme.setAttribute('aria-expanded', 'true');
    }

    $$('[data-menu-oge]', kok).forEach(function (oge) {
      var dugme = $('.menu__kok', oge);

      oge.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: none)').matches) return;
        window.clearTimeout(zamanlayici);
        zamanlayici = window.setTimeout(function () {
          ac(oge);
        }, 300);
      });

      oge.addEventListener('mouseleave', function () {
        window.clearTimeout(zamanlayici);
        zamanlayici = window.setTimeout(function () {
          kapat(oge);
        }, 200);
      });

      dugme.addEventListener('click', function () {
        var acik = dugme.getAttribute('aria-expanded') === 'true';
        if (acik) kapat(oge);
        else ac(oge);
      });

      oge.addEventListener('focusout', function (olay) {
        if (!oge.contains(olay.relatedTarget)) kapat(oge);
      });
    });

    document.addEventListener('click', function (olay) {
      if (!kok.contains(olay.target)) tumMegaKapat(kok);
    });
  }

  function tumMegaKapat(kok) {
    $$('[data-menu-oge]', kok).forEach(function (oge) {
      var panel = $('.mega', oge);
      var dugme = $('.menu__kok', oge);
      if (panel) panel.hidden = true;
      if (dugme) dugme.setAttribute('aria-expanded', 'false');
    });
  }

  /* ------------------------------ Duyuru şeridi ------------------------- */

  function duyuruBandiKur() {
    var b = C.duyuruBandi;
    if (!b || !b.aktif || !b.metin) return;
    var yer = $('[data-bilesen="duyuru"]');
    if (!yer) return;

    yer.className = 'duyuru';
    yer.innerHTML =
      '<div class="kap duyuru__ic"><span>📅 ' +
      kacir(b.metin) +
      '</span>' +
      (b.baglanti
        ? '<a href="' + kacir(b.baglanti) + '">' + kacir(b.baglantiMetni || 'Detay') + '</a>'
        : '') +
      '</div>';
  }

  /* ------------------------------- Alt bilgi ---------------------------- */

  function altbilgiKur() {
    var yer = $('[data-bilesen="altbilgi"]');
    if (!yer) return;

    var gunLinkleri = D.temalar
      .slice(0, 8)
      .map(function (t) {
        return '<li><a href="' + koleksiyonLink({ gun: t.id }) + '">' + kacir(t.ad) + '</a></li>';
      })
      .join('');

    var kimeLinkleri = D.kime
      .slice(0, 6)
      .map(function (k) {
        return '<li><a href="' + koleksiyonLink({ kime: k.id }) + '">' + kacir(k.ad) + '</a></li>';
      })
      .join('');

    var saatler = C.calismaSaatleri
      .map(function (s) {
        return '<li>' + kacir(s[0]) + ': ' + kacir(s[1]) + '</li>';
      })
      .join('');

    yer.className = 'altbilgi';
    yer.innerHTML =
      '<div class="kap">' +
      '<div class="altbilgi__izgara">' +
      '<div><h2>' +
      kacir(C.marka) +
      '</h2><p>' +
      kacir(C.kisaTanitim) +
      '</p>' +
      '<ul>' +
      '<li>📍 ' +
      kacir(C.adres) +
      '</li><li>' +
      kacir(C.adresDetay) +
      '</li>' +
      '<li>💬 <a href="' +
      waLink('Merhaba, bilgi almak istiyorum.') +
      '" target="_blank" rel="noopener">' +
      kacir(C.whatsappGorunum) +
      '</a></li>' +
      '<li>✉️ <a href="mailto:' +
      kacir(C.eposta) +
      '">' +
      kacir(C.eposta) +
      '</a></li>' +
      '<li>📸 <a href="' +
      kacir(C.instagram) +
      '" target="_blank" rel="noopener">' +
      kacir(C.instagramKullanici) +
      '</a></li>' +
      '</ul></div>' +
      '<div><h2>Özel Günler</h2><ul>' +
      gunLinkleri +
      '</ul></div>' +
      '<div><h2>Kime Göre</h2><ul>' +
      kimeLinkleri +
      '</ul></div>' +
      '<div><h2>Çalışma Saatleri</h2><ul>' +
      saatler +
      '</ul>' +
      '<p class="kucuk" style="margin-top:0.75rem">' +
      kacir(C.sonSiparisNotu) +
      '</p></div>' +
      '</div>' +
      '<div class="altbilgi__alt"><span>© ' +
      new Date().getFullYear() +
      ' ' +
      kacir(C.marka) +
      '. Tüm hakları saklıdır.</span>' +
      '<span>Sitede online satış yoktur; sipariş ve fiyat teklifi WhatsApp üzerinden alınır.</span></div>' +
      '</div>';
  }

  /* --------------------------- Sabit WhatsApp butonu -------------------- */

  function waSabitKur() {
    var a = document.createElement('a');
    a.className = 'wa-sabit';
    a.href = waLink('Merhaba, ' + C.marka + ' için tasarım ve fiyat bilgisi almak istiyorum.');
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = '<span aria-hidden="true">💬</span><span>WhatsApp’tan fiyat iste</span>';
    document.body.appendChild(a);
  }

  /* ------------------------------ Vitrin parçaları ---------------------- */

  function gunKutusuHTML(tema) {
    var sayi = adetSayisi(tema.id);
    return (
      '<a class="gun-kutu" href="' +
      koleksiyonLink({ gun: tema.id }) +
      '">' +
      '<div class="gun-kutu__ust"><span class="gun-kutu__ad">' +
      tema.ikon +
      ' ' +
      kacir(tema.kisa) +
      '</span><span class="gun-kutu__sayi">' +
      (sayi > 0 ? sayi + ' tasarım' : 'Stüdyoda') +
      '</span></div>' +
      '<p class="gun-kutu__aciklama">' +
      kacir(tema.aciklama) +
      '</p></a>'
    );
  }

  function rozetlerHTML(t) {
    var r = '';
    if (t.cokSatan) r += '<span class="rozet rozet--satan">Çok satan</span> ';
    if (t.yeni) r += '<span class="rozet rozet--yeni">Yeni</span> ';
    return r;
  }

  function tasarimKartiHTML(t) {
    var urun = urunBul(t.urun);
    var tema = temaBul(t.tema);
    var segment = segmentBul(t.segment);
    var etiketler = (t.etiketler || [])
      .slice(0, 3)
      .map(function (e) {
        return '<span class="etiket">' + kacir(e) + '</span>';
      })
      .join('');

    return (
      '<article class="tasarim-kart">' +
      '<div class="tasarim-kart__gorsel"><img src="' +
      kacir(t.gorsel) +
      '" alt="' +
      kacir(t.ad) +
      ' — ' +
      kacir(tema ? tema.ad : '') +
      '" loading="lazy" width="800" height="800">' +
      (rozetlerHTML(t) ? '<div style="position:absolute;top:10px;left:10px">' + rozetlerHTML(t) + '</div>' : '') +
      '</div>' +
      '<div class="tasarim-kart__govde">' +
      '<p class="mikro mikro--altin" style="margin:0">' +
      kacir(tema ? tema.kisa : '') +
      ' · ' +
      kacir(segment ? segment.ad : '') +
      '</p>' +
      '<h3 class="tasarim-kart__baslik">' +
      kacir(t.ad) +
      '</h3>' +
      '<p class="tasarim-kart__ozet">' +
      kacir(t.ozet) +
      '</p>' +
      '<div class="tasarim-kart__meta"><span>' +
      kacir(urun ? urun.ad : '') +
      ' · ' +
      kacir(t.boyut) +
      '</span></div>' +
      '<div class="tasarim-kart__meta">' +
      etiketler +
      '</div>' +
      '<div class="tasarim-kart__eylem">' +
      '<a class="btn btn--cizgili btn--kucuk" href="urun.html?tasarim=' +
      t.id +
      '">Detay</a>' +
      '<a class="btn btn--birincil btn--kucuk" href="studyo.html?tasarim=' +
      t.id +
      '">Kendin tasarla</a>' +
      '</div></div></article>'
    );
  }

  /* ------------------------------- Sayfa kurulumları -------------------- */

  function anaSayfa() {
    var gunler = $('#ana-gunler');
    if (gunler) {
      gunler.innerHTML = D.temalar.slice(0, 8).map(gunKutusuHTML).join('');
    }

    var oneCikan = $('#ana-tasarimlar');
    if (oneCikan) {
      var puan = function (t) {
        return (t.cokSatan ? 0 : 1) * 10 + (t.yeni ? 0 : 1);
      };
      var liste = D.tasarimlar.slice().sort(function (a, b) {
        return puan(a) - puan(b);
      });
      oneCikan.innerHTML = liste.slice(0, 8).map(tasarimKartiHTML).join('');
    }

    var guven = $('#ana-guven');
    if (guven) {
      guven.innerHTML = D.guvenSeridi
        .map(function (g) {
          return (
            '<div class="guven__oge"><span class="guven__ikon" aria-hidden="true">' +
            g.ikon +
            '</span><p class="guven__baslik">' +
            kacir(g.baslik) +
            '</p><p class="guven__metin">' +
            kacir(g.metin) +
            '</p></div>'
          );
        })
        .join('');
    }

    var adimlar = $('#ana-adimlar');
    if (adimlar) {
      adimlar.innerHTML = D.nasilCalisir
        .map(function (a) {
          return (
            '<div class="adim"><span class="adim__no">' +
            kacir(a.adim) +
            '</span><h3>' +
            kacir(a.baslik) +
            '</h3><p>' +
            kacir(a.metin) +
            '</p></div>'
          );
        })
        .join('');
    }

    /* Taahhütler */
    var taahhut = $('#ana-taahhutler');
    if (taahhut) {
      taahhut.innerHTML = D.taahhutler
        .map(function (t) {
          return (
            '<div class="taahhut"><h3>' + kacir(t.baslik) + '</h3><p>' + kacir(t.metin) + '</p></div>'
          );
        })
        .join('');
    }

    /* Teslim bantları */
    var bantlar = $('#ana-teslim-bantlari');
    if (bantlar) {
      bantlar.innerHTML = C.teslimBantlari
        .map(function (b) {
          return (
            '<div class="taahhut"><p class="mikro">' +
            kacir(b.baslik) +
            '</p><h3 style="margin:0.35rem 0 0">' +
            kacir(b.metin) +
            '</h3></div>'
          );
        })
        .join('');
    }

    /* Son sipariş notu */
    var sonSiparis = $('#ana-son-siparis');
    if (sonSiparis) {
      sonSiparis.innerHTML = '📅 <strong>' + kacir(C.sonSiparisNotu) + '</strong>';
    }

    /* Müşteri yorumları — yalnızca gerçek yorum girilmişse görünür */
    var yorumBolumu = $('#ana-yorumlar-bolum');
    var yorumlar = $('#ana-yorumlar');
    if (yorumBolumu && yorumlar) {
      if (D.yorumlar && D.yorumlar.length) {
        yorumlar.innerHTML = D.yorumlar
          .map(function (y) {
            var yildiz = '★★★★★'.slice(0, Math.max(1, Math.min(5, y.puan || 5)));
            var urun = y.urun ? tasarimBul(y.urun) : null;
            return (
              '<figure class="yorum-kart"><div class="yorum-kart__ust"><span class="mikro mikro--altin">' +
              yildiz +
              '</span><span class="mikro">' +
              kacir(y.sehir || '') +
              '</span></div><blockquote style="border:0;padding:0;margin:0"><p>“' +
              kacir(y.metin) +
              '”</p></blockquote>' +
              '<figcaption class="yorum-kart__alt">' +
              kacir(y.ad || 'Bir müşteri') +
              (urun ? ' · ' + kacir(urun.ad) : '') +
              '</figcaption></figure>'
            );
          })
          .join('');
        yorumBolumu.hidden = false;
      } else {
        yorumBolumu.hidden = true;
      }
    }
  }

  /* --------------------------- Koleksiyon sayfası ----------------------- */

  function koleksiyonlar() {
    var izgara = $('#koleksiyon-izgara');
    if (!izgara) return;

    var parametreler = new URLSearchParams(location.search);
    var durum = {
      gun: parametreler.get('gun') || 'hepsi',
      kime: parametreler.get('kime') || 'hepsi',
      urun: parametreler.get('urun') || 'hepsi',
      segment: parametreler.get('segment') || 'hepsi',
      sirala: parametreler.get('sirala') || 'one-cikan',
    };

    var ray = $('#koleksiyon-filtre');
    var ozetAlan = $('#koleksiyon-sonuc');
    var siralamaAlan = $('#koleksiyon-siralama');
    var baslik = $('#koleksiyon-baslik');
    var aciklama = $('#koleksiyon-aciklama');
    var kirinti = $('#koleksiyon-kirinti');

    /* Eksenleri veriden üret: yalnızca en az bir tasarımı olan kategoriler */
    function eksenler() {
      var listeler = [];

      listeler.push({
        anahtar: 'gun',
        baslik: 'Özel gün',
        tumu: 'Tüm özel günler',
        ogeler: D.temalar
          .filter(function (t) {
            return adetSayisi(t) > 0;
          })
          .map(function (t) {
            return { id: t.id, ad: t.ikon + ' ' + t.kisa, sayi: adetSayisi(t) };
          }),
      });

      listeler.push({
        anahtar: 'kime',
        baslik: 'Kime',
        tumu: 'Herkes için',
        ogeler: D.kime
          .map(function (k) {
            var sayi = D.tasarimlar.filter(function (t) {
              return (t.kime || []).indexOf(k.id) > -1;
            }).length;
            return { id: k.id, ad: k.ad, sayi: sayi };
          })
          .filter(function (k) {
            return k.sayi > 0;
          }),
      });

      listeler.push({
        anahtar: 'urun',
        baslik: 'Ürün tipi',
        tumu: 'Tüm ürünler',
        ogeler: D.studyo.urunTipleri
          .map(function (u) {
            var sayi = D.tasarimlar.filter(function (t) {
              return t.urun === u.id;
            }).length;
            return { id: u.id, ad: u.ad, sayi: sayi };
          })
          .filter(function (u) {
            return u.sayi > 0;
          }),
      });

      listeler.push({
        anahtar: 'segment',
        baslik: 'Hediye büyüklüğü',
        tumu: 'Tüm boyutlar',
        ogeler: D.segmentler
          .map(function (s) {
            var sayi = D.tasarimlar.filter(function (t) {
              return t.segment === s.id;
            }).length;
            return { id: s.id, ad: s.ad, sayi: sayi };
          })
          .filter(function (s) {
            return s.sayi > 0;
          }),
      });

      return listeler;
    }

    function siralaListe(liste) {
      var kopya = liste.slice();
      if (durum.sirala === 'cok-satan') {
        kopya.sort(function (a, b) {
          return (b.cokSatan ? 1 : 0) - (a.cokSatan ? 1 : 0);
        });
      } else if (durum.sirala === 'yeni') {
        kopya.sort(function (a, b) {
          return (b.yeni ? 1 : 0) - (a.yeni ? 1 : 0);
        });
      } else if (durum.sirala === 'a-z') {
        kopya.sort(function (a, b) {
          return a.ad.localeCompare(b.ad, 'tr');
        });
      } else {
        kopya.sort(function (a, b) {
          var puan = function (t) {
            return (t.cokSatan ? 0 : 1) * 10 + (t.yeni ? 0 : 1);
          };
          return puan(a) - puan(b);
        });
      }
      return kopya;
    }

    function rayCiz() {
      ray.innerHTML = eksenler()
        .map(function (e) {
          var dugmeler =
            '<button class="filtre__dugme" type="button" data-eksen="' +
            e.anahtar +
            '" data-deger="hepsi" aria-pressed="' +
            (durum[e.anahtar] === 'hepsi' ? 'true' : 'false') +
            '">' +
            kacir(e.tumu) +
            '</button>' +
            e.ogeler
              .map(function (o) {
                return (
                  '<button class="filtre__dugme" type="button" data-eksen="' +
                  e.anahtar +
                  '" data-deger="' +
                  o.id +
                  '" aria-pressed="' +
                  (durum[e.anahtar] === o.id ? 'true' : 'false') +
                  '">' +
                  kacir(o.ad) +
                  ' <span class="sayac">' +
                  o.sayi +
                  '</span></button>'
                );
              })
              .join('');

          return (
            '<fieldset class="filtre-grup"><legend class="filtre-grup__baslik"><span class="mikro">' +
            kacir(e.baslik) +
            '</span></legend><div class="filtre">' +
            dugmeler +
            '</div></fieldset>'
          );
        })
        .join('');
    }

    function siralamaCiz() {
      var secenekler = [
        ['one-cikan', 'Öne çıkanlar'],
        ['cok-satan', 'Çok satanlar'],
        ['yeni', 'Yeni tasarımlar'],
        ['a-z', 'İsme göre (A–Z)'],
      ];
      siralamaAlan.innerHTML =
        '<span class="mikro">Sırala</span><label class="visually-hidden" for="sirala">Sıralama</label>' +
        '<select id="sirala">' +
        secenekler
          .map(function (s) {
            return (
              '<option value="' + s[0] + '"' + (durum.sirala === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'
            );
          })
          .join('') +
        '</select>';

      $('#sirala').addEventListener('change', function () {
        durum.sirala = this.value;
        ciz();
      });
    }

    function aktifEtiketler() {
      var etiketler = [];
      if (durum.gun !== 'hepsi') {
        var t = temaBul(durum.gun);
        if (t) etiketler.push(t.ad);
      }
      if (durum.kime !== 'hepsi') {
        var k = kimeBul(durum.kime);
        if (k) etiketler.push(k.ad);
      }
      if (durum.urun !== 'hepsi') {
        var u = urunBul(durum.urun);
        if (u) etiketler.push(u.ad);
      }
      if (durum.segment !== 'hepsi') {
        var s = segmentBul(durum.segment);
        if (s) etiketler.push(s.ad);
      }
      return etiketler;
    }

    /* Aktif kategoriye göre başlık ve açıklama metni */
    function baslikAciklama() {
      if (durum.gun !== 'hepsi') {
        var t = temaBul(durum.gun);
        if (t) return { baslik: t.ad, aciklama: t.aciklama };
      }
      if (durum.kime !== 'hepsi') {
        var k = kimeBul(durum.kime);
        if (k) return { baslik: k.ad, aciklama: k.aciklama };
      }
      if (durum.urun !== 'hepsi') {
        var u = urunBul(durum.urun);
        if (u) return { baslik: u.ad, aciklama: u.ozet };
      }
      if (durum.segment !== 'hepsi') {
        var s = segmentBul(durum.segment);
        if (s) return { baslik: s.ad, aciklama: s.aciklama };
      }
      return {
        baslik: 'Hazır Tasarımlar',
        aciklama:
          'Özel günlere hazırlanmış tasarımlar. Özel gün, kime ve ürün tipine göre filtreleyebilir; her tasarımı stüdyoda kendine göre kişiselleştirebilirsin.',
      };
    }

    function ciz() {
      var liste = D.tasarimlar.filter(function (t) {
        if (durum.gun !== 'hepsi' && t.tema !== durum.gun) return false;
        if (durum.kime !== 'hepsi' && (t.kime || []).indexOf(durum.kime) === -1) return false;
        if (durum.urun !== 'hepsi' && t.urun !== durum.urun) return false;
        if (durum.segment !== 'hepsi' && t.segment !== durum.segment) return false;
        return true;
      });

      liste = siralaListe(liste);
      izgara.innerHTML = liste.length
        ? liste.map(tasarimKartiHTML).join('')
        : '<div class="bos-durum"><p>Bu seçimle eşleşen hazır tasarım yok.</p>' +
          '<p class="kucuk">Filtreleri temizleyebilir ya da stüdyoda sıfırdan tasarlayabilirsin.</p>' +
          '<p><a class="btn btn--cizgili" href="koleksiyonlar.html">Filtreleri temizle</a> ' +
          '<a class="btn btn--birincil" href="studyo.html">Tasarım stüdyosu</a></p></div>';

      var etiketler = aktifEtiketler();
      var metin = baslikAciklama();
      baslik.textContent = metin.baslik;
      aciklama.textContent = metin.aciklama;
      ozetAlan.textContent = liste.length + ' tasarım';

      kirinti.innerHTML =
        '<a href="index.html">Ana sayfa</a> / <a href="koleksiyonlar.html">Özel günler</a>' +
        (etiketler.length ? ' / <span>' + kacir(etiketler.join(' · ')) + '</span>' : '');

      $$('[data-eksen]', ray).forEach(function (d) {
        d.setAttribute(
          'aria-pressed',
          durum[d.getAttribute('data-eksen')] === d.getAttribute('data-deger') ? 'true' : 'false'
        );
      });

      var sorgu = [];
      Object.keys(durum).forEach(function (k) {
        var varsayilan = k === 'sirala' ? 'one-cikan' : 'hepsi';
        if (durum[k] !== varsayilan) sorgu.push(k + '=' + encodeURIComponent(durum[k]));
      });
      history.replaceState(null, '', location.pathname + (sorgu.length ? '?' + sorgu.join('&') : ''));
    }

    ray.addEventListener('click', function (olay) {
      var dugme = olay.target.closest('[data-eksen]');
      if (!dugme) return;
      durum[dugme.getAttribute('data-eksen')] = dugme.getAttribute('data-deger');
      ciz();
    });

    /* Açıklama ve başlık, ciz() içinde aktif eksene göre yazılır */

    rayCiz();
    siralamaCiz();
    ciz();
  }

  /* ------------------------------ Ürün detayı --------------------------- */

  function urunDetay() {
    var kok = $('#detay');
    if (!kok) return;

    var id = new URLSearchParams(location.search).get('tasarim');
    var t = tasarimBul(id) || D.tasarimlar[0];

    document.title = t.ad + ' — ' + C.marka;

    var tema = temaBul(t.tema);
    var urun = urunBul(t.urun);
    var segment = segmentBul(t.segment);
    var cikolata = D.studyo.cikolataTipleri.filter(function (c) {
      return c.id === t.cikolata;
    })[0];
    var kimeAdlari = (t.kime || [])
      .map(function (k) {
        var x = kimeBul(k);
        return x ? x.ad : '';
      })
      .filter(Boolean)
      .join(', ');

    kok.innerHTML =
      '<div class="detay__gorsel"><img src="' +
      kacir(t.gorsel) +
      '" alt="' +
      kacir(t.ad) +
      '" width="800" height="800"></div>' +
      '<div>' +
      '<div class="kirinti"><a href="index.html">Ana sayfa</a> / <a href="koleksiyonlar.html">Özel günler</a> / <a href="' +
      koleksiyonLink({ gun: t.tema }) +
      '">' +
      kacir(tema ? tema.ad : '') +
      '</a></div>' +
      '<p class="hero__etiket">' +
      kacir(tema ? tema.ad : '') +
      '</p>' +
      '<h1>' +
      kacir(t.ad) +
      '</h1>' +
      '<p class="hero__metin">' +
      kacir(t.ozet) +
      '</p>' +
      '<ul class="detay__liste">' +
      '<li><span>Ürün</span><span>' +
      kacir(urun ? urun.ad : '') +
      '</span></li>' +
      '<li><span>Adet / boyut</span><span>' +
      kacir(t.boyut) +
      '</span></li>' +
      '<li><span>Hediye büyüklüğü</span><span>' +
      kacir(segment ? segment.ad : '') +
      '</span></li>' +
      '<li><span>Çikolata</span><span>' +
      kacir(cikolata ? cikolata.ad : '') +
      '</span></li>' +
      '<li><span>Kime uygun</span><span>' +
      kacir(kimeAdlari || 'Herkes') +
      '</span></li>' +
      '<li><span>Kişiselleştirme</span><span>İsim, tarih, fotoğraf ve logo baskısı eklenebilir</span></li>' +
      '<li><span>Teslim</span><span>' +
      kacir(C.teslimatNotu) +
      '</span></li>' +
      '</ul>' +
      '<div class="not-kutu">' +
      kacir(C.siparisNotu) +
      ' <strong>' +
      kacir(C.sonSiparisNotu) +
      '</strong></div>' +
      '<div class="hero__eylem">' +
      '<a class="btn btn--birincil" href="studyo.html?tasarim=' +
      t.id +
      '">Bu tasarımı kişiselleştir</a>' +
      '<a class="btn btn--wa" href="' +
      waLink(
        'Merhaba, “' +
          t.ad +
          '” tasarımı için fiyat almak istiyorum.\n' +
          '• Özel gün: ' +
          (tema ? tema.ad : '-') +
          '\n• Ürün: ' +
          (urun ? urun.ad : '-') +
          ' · ' +
          t.boyut +
          '\n• Kod: ' +
          t.id
      ) +
      '" target="_blank" rel="noopener">WhatsApp’tan fiyat iste</a>' +
      '</div>' +
      '<div class="taahhut-izgara" style="margin-top:1.5rem">' +
      D.taahhutler
        .map(function (x) {
          return '<div class="taahhut"><h3>' + kacir(x.baslik) + '</h3><p>' + kacir(x.metin) + '</p></div>';
        })
        .join('') +
      '</div>' +
      '</div>';

    /* Bunları da beğenebilirsin: aynı özel gün veya aynı kime grubundan */
    var benzer = $('#benzer');
    if (benzer) {
      var liste = D.tasarimlar
        .filter(function (x) {
          return x.id !== t.id && (x.tema === t.tema || (x.kime || []).some(function (k) {
            return (t.kime || []).indexOf(k) > -1;
          }));
        })
        .slice(0, 6);
      if (liste.length) {
        $('#benzer-bolum').hidden = false;
        benzer.innerHTML = liste.map(tasarimKartiHTML).join('');
      } else {
        $('#benzer-bolum').hidden = true;
      }
    }
  }

  function sssSayfasi() {
    var yer = $('#sss-listesi');
    if (!yer) return;
    yer.innerHTML = D.sss
      .map(function (s) {
        return '<details><summary>' + kacir(s.soru) + '</summary><p>' + kacir(s.cevap) + '</p></details>';
      })
      .join('');
  }

  function kurumsalSayfasi() {
    var fayda = $('#kurumsal-faydalar');
    if (fayda) {
      fayda.innerHTML = D.kurumsal.faydalar
        .map(function (f) {
          return '<div class="fayda"><h3>' + kacir(f.baslik) + '</h3><p>' + kacir(f.metin) + '</p></div>';
        })
        .join('');
    }
    var adim = $('#kurumsal-adimlar');
    if (adim) {
      adim.innerHTML = D.kurumsal.adimlar
        .map(function (a, i) {
          return (
            '<div class="adim"><span class="adim__no">' +
            (i + 1) +
            '</span><h3>' +
            kacir(a.baslik) +
            '</h3><p>' +
            kacir(a.metin) +
            '</p></div>'
          );
        })
        .join('');
    }
    var notu = $('#kurumsal-adet-notu');
    if (notu) notu.textContent = D.kurumsal.adetNotu;

    var gunler = $('#kurumsal-gunler');
    if (gunler) {
      gunler.innerHTML = kokTemalar('kurumsal').map(gunKutusuHTML).join('');
    }

    $$('[data-kurumsal-wa]').forEach(function (a) {
      a.href = waLink(
        'Merhaba, kurumsal hediye talebimiz var. Adet, bütçe ve teslim tarihini paylaşabilirim.'
      );
    });
  }

  function iletisimSayfasi() {
    var yer = $('#iletisim-bilgi');
    if (!yer) return;
    var bantlar = C.teslimBantlari
      .map(function (b) {
        return '<li><span>' + kacir(b.baslik) + '</span><span>' + kacir(b.metin) + '</span></li>';
      })
      .join('');
    yer.innerHTML =
      '<ul class="detay__liste">' +
      '<li><span>Adres</span><span>' + kacir(C.adres) + '<br>' + kacir(C.adresDetay) + '</span></li>' +
      '<li><span>WhatsApp</span><span><a href="' +
      waLink('Merhaba, bilgi almak istiyorum.') +
      '" target="_blank" rel="noopener">' +
      kacir(C.whatsappGorunum) +
      '</a></span></li>' +
      '<li><span>E-posta</span><span><a href="mailto:' +
      kacir(C.eposta) +
      '">' +
      kacir(C.eposta) +
      '</a></span></li>' +
      '<li><span>Instagram</span><span><a href="' +
      kacir(C.instagram) +
      '" target="_blank" rel="noopener">' +
      kacir(C.instagramKullanici) +
      '</a></span></li>' +
      bantlar +
      '</ul>';
  }

  /* ------------------------------- Başlat ------------------------------- */

  function basla() {
    duyuruBandiKur();
    ustbarKur();
    altbilgiKur();
    waSabitKur();

    var sayfa = document.body.getAttribute('data-sayfa');
    if (sayfa === 'ana') anaSayfa();
    if (sayfa === 'koleksiyonlar') koleksiyonlar();
    if (sayfa === 'urun') urunDetay();
    if (sayfa === 'sss') sssSayfasi();
    if (sayfa === 'kurumsal') kurumsalSayfasi();
    if (sayfa === 'iletisim') iletisimSayfasi();

    if (!numaraHazirMi()) {
      console.warn(
        '[Beyza Blanc] config.js içindeki WhatsApp numarası hâlâ örnek değerde. ' +
          'Yayına almadan önce gerçek numarayı yaz.'
      );
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', basla);
  } else {
    basla();
  }

  window.BEYZA_UI = {
    waLink: waLink,
    kacir: kacir,
    temaBul: temaBul,
    kimeBul: kimeBul,
    segmentBul: segmentBul,
    urunBul: urunBul,
    tasarimBul: tasarimBul,
    koleksiyonLink: koleksiyonLink,
  };
})();
