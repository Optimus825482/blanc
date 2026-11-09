#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Basit Markdown -> HTML dönüştürücü (araştırma raporları için).

Desteklenen sözdizimi: # / ## / ### başlıklar, paragraf, | tablo |,
> alıntı, - madde listesi, --- ayraç, **kalın**, `kod`, [link](url).

Kullanım:
    python -I md2html.py <kaynak.md> <hedef.html> "<Belge başlığı>" "<Alt başlık>"
"""

import html
import re
import sys


def satir_ici(metin: str) -> str:
    """Satır içi markdown ögelerini HTML'e çevirir."""
    metin = html.escape(metin, quote=False)
    metin = re.sub(
        r"\[([^\]]+)\]\(([^)\s]+)\)",
        lambda m: '<a href="%s" target="_blank" rel="noopener">%s</a>' % (m.group(2), m.group(1)),
        metin,
    )
    metin = re.sub(r"`([^`]+)`", r"<code>\1</code>", metin)
    metin = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", metin)
    return metin


def slug(metin: str) -> str:
    """Başlıktan çapa (anchor) kimliği üretir."""
    s = metin.lower()
    s = s.replace("ı", "i").replace("ğ", "g").replace("ü", "u")
    s = s.replace("ş", "s").replace("ö", "o").replace("ç", "c").replace("İ", "i")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:60] or "bolum"


def tablo_mu(satirlar):
    return len(satirlar) >= 2 and satirlar[0].lstrip().startswith("|") and re.match(
        r"^\|[\s:|-]+\|$", satirlar[1].strip()
    )


def hucreler(satir):
    return [h.strip() for h in satir.strip().strip("|").split("|")]


def donustur(md: str):
    satirlar = md.split("\n")
    govde = []
    icerik_ozeti = []
    i = 0
    ilk_baslik_atlandi = False

    while i < len(satirlar):
        satir = satirlar[i]
        kirp = satir.strip()

        # Boş satır
        if not kirp:
            i += 1
            continue

        # Yatay ayraç
        if re.match(r"^-{3,}$", kirp):
            govde.append("<hr>")
            i += 1
            continue

        # Başlıklar
        m = re.match(r"^(#{1,4})\s+(.*)$", kirp)
        if m:
            seviye = len(m.group(1))
            metin = m.group(2).strip()
            if seviye == 1 and not ilk_baslik_atlandi:
                ilk_baslik_atlandi = True
                govde.append('<p class="belge-ustbaslik">Araştırma raporu</p>')
                i += 1
                continue
            if seviye == 2:
                kimlik = slug(metin)
                icerik_ozeti.append((kimlik, metin))
                govde.append('<h2 id="%s">%s</h2>' % (kimlik, satir_ici(metin)))
            elif seviye == 3:
                govde.append("<h3>%s</h3>" % satir_ici(metin))
            else:
                govde.append("<h4>%s</h4>" % satir_ici(metin))
            i += 1
            continue

        # Tablo
        if kirp.startswith("|"):
            blok = []
            while i < len(satirlar) and satirlar[i].strip().startswith("|"):
                blok.append(satirlar[i])
                i += 1
            if tablo_mu(blok):
                basliklar = hucreler(blok[0])
                govde.append('<div class="tablo-sarmal"><table>')
                govde.append("<thead><tr>")
                for b in basliklar:
                    govde.append("<th>%s</th>" % satir_ici(b))
                govde.append("</tr></thead><tbody>")
                for govde_satiri in blok[2:]:
                    govde.append("<tr>")
                    for h in hucreler(govde_satiri):
                        govde.append("<td>%s</td>" % satir_ici(h))
                    govde.append("</tr>")
                govde.append("</tbody></table></div>")
            else:
                for b in blok:
                    govde.append("<p>%s</p>" % satir_ici(b))
            continue

        # Alıntı
        if kirp.startswith(">"):
            blok = []
            while i < len(satirlar) and satirlar[i].strip().startswith(">"):
                blok.append(satirlar[i].strip().lstrip(">").strip())
                i += 1
            govde.append(
                '<blockquote><p>%s</p></blockquote>' % satir_ici(" ".join(blok))
            )
            continue

        # Madde listesi
        if re.match(r"^[-*]\s+", kirp):
            ogeler = []
            while i < len(satirlar) and re.match(r"^[-*]\s+", satirlar[i].strip()):
                ogeler.append(re.sub(r"^[-*]\s+", "", satirlar[i].strip()))
                i += 1
            govde.append("<ul>")
            for o in ogeler:
                govde.append("<li>%s</li>" % satir_ici(o))
            govde.append("</ul>")
            continue

        # Paragraf (ardışık satırları birleştir)
        blok = []
        while i < len(satirlar):
            s = satirlar[i].strip()
            if (
                not s
                or s.startswith("|")
                or s.startswith(">")
                or s.startswith("#")
                or re.match(r"^[-*]\s+", s)
                or re.match(r"^-{3,}$", s)
            ):
                break
            blok.append(s)
            i += 1
        govde.append("<p>%s</p>" % satir_ici(" ".join(blok)))

    return "\n".join(govde), icerik_ozeti


SABLON = """<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{baslik}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {{
  --krem: #fff8f3;
  --krem-koyu: #f6ebdc;
  --kahve: #3d2016;
  --kahve-soluk: #6b4a3a;
  --altin: #cfb56a;
  --altin-koyu: #a98336;
  --cizgi: #e6d9c8;
  --beyaz: #fffdfa;
  --yesil: #2e5a4b;
  --serif: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}}
* {{ box-sizing: border-box; }}
html {{ scroll-behavior: smooth; }}
body {{
  margin: 0;
  background: var(--krem);
  color: var(--kahve);
  font-family: var(--sans);
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}}
a {{ color: var(--altin-koyu); text-decoration-thickness: 1px; text-underline-offset: 2px; }}
a:hover {{ color: var(--kahve); }}
code {{
  background: var(--krem-koyu);
  border: 1px solid var(--cizgi);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.86em;
}}
.duzen {{ max-width: 1420px; margin: 0 auto; padding: 0 24px; display: grid; gap: 40px; }}
@media (min-width: 1080px) {{ .duzen {{ grid-template-columns: 288px minmax(0, 1fr); }} }}

/* Kapak */
.kapak {{ border-bottom: 1px solid var(--cizgi); background: var(--beyaz); }}
.kapak__ic {{ max-width: 1420px; margin: 0 auto; padding: 40px 24px 32px; }}
.kapak__marka {{
  font-family: var(--serif); font-size: 0.95rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--altin-koyu); margin: 0 0 14px;
}}
.kapak h1 {{ font-family: var(--serif); font-weight: 600; font-size: clamp(1.9rem, 3.4vw, 2.9rem); line-height: 1.15; margin: 0 0 12px; }}
.kapak__alt {{ color: var(--kahve-soluk); max-width: 80ch; margin: 0; }}
.kapak__etiketler {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }}
.etiket {{
  font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
  border: 1px solid var(--cizgi); background: var(--krem-koyu);
  border-radius: 999px; padding: 4px 12px; color: var(--kahve-soluk);
}}

/* İçindekiler */
.icindekiler {{ position: sticky; top: 24px; align-self: start; padding: 24px 0; }}
.icindekiler h2 {{
  font-family: var(--sans); font-size: 0.74rem; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--kahve-soluk); margin: 0 0 12px;
}}
.icindekiler ol {{ list-style: none; margin: 0; padding: 0; counter-reset: toc; }}
.icindekiler li {{ counter-increment: toc; margin-bottom: 7px; }}
.icindekiler a {{
  color: var(--kahve); text-decoration: none; font-size: 0.92rem;
  display: flex; gap: 10px; padding: 5px 10px; border-radius: 8px;
  border-left: 2px solid transparent;
}}
.icindekiler a::before {{ content: counter(toc); color: var(--altin-koyu); font-size: 0.78rem; min-width: 14px; }}
.icindekiler a:hover {{ background: var(--krem-koyu); border-left-color: var(--altin); }}
.yazdirma-notu {{
  margin-top: 20px; padding: 12px 14px; border: 1px dashed var(--cizgi);
  border-radius: 10px; font-size: 0.8rem; color: var(--kahve-soluk); background: var(--beyaz);
}}

/* İçerik */
.icerik {{ padding: 24px 0 96px; min-width: 0; }}
.icerik h2 {{
  font-family: var(--serif); font-weight: 600; font-size: clamp(1.5rem, 2.4vw, 2.05rem);
  line-height: 1.2; margin: 56px 0 16px; padding-top: 20px; border-top: 1px solid var(--cizgi);
}}
.icerik h2:first-child {{ margin-top: 8px; border-top: 0; padding-top: 0; }}
.icerik h3 {{ font-family: var(--serif); font-weight: 600; font-size: 1.3rem; margin: 34px 0 10px; }}
.icerik h4 {{ font-family: var(--sans); font-size: 1rem; margin: 24px 0 8px; }}
.icerik p {{ margin: 0 0 16px; }}
.icerik ul {{ margin: 0 0 16px; padding-left: 22px; }}
.icerik li {{ margin-bottom: 8px; }}
.icerik hr {{ border: 0; border-top: 1px solid var(--cizgi); margin: 36px 0; }}
.belge-ustbaslik {{ display: none; }}
blockquote {{
  margin: 0 0 24px; padding: 16px 20px; background: var(--beyaz);
  border: 1px solid var(--cizgi); border-left: 3px solid var(--altin); border-radius: 10px;
}}
blockquote p {{ margin: 0; font-size: 0.94rem; color: var(--kahve-soluk); }}

/* Tablolar */
.tablo-sarmal {{ overflow-x: auto; margin: 0 0 28px; border: 1px solid var(--cizgi); border-radius: 12px; background: var(--beyaz); }}
table {{ border-collapse: collapse; width: 100%; font-size: 0.88rem; min-width: 560px; }}
thead th {{
  text-align: left; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--kahve-soluk); background: var(--krem-koyu);
  padding: 11px 14px; border-bottom: 1px solid var(--cizgi); white-space: nowrap;
}}
tbody td {{ padding: 11px 14px; border-bottom: 1px solid var(--cizgi); vertical-align: top; }}
tbody tr:last-child td {{ border-bottom: 0; }}
tbody tr:nth-child(even) {{ background: #fffaf5; }}

/* Alt bilgi */
.sayfa-alti {{ border-top: 1px solid var(--cizgi); background: var(--beyaz); }}
.sayfa-alti__ic {{
  max-width: 1420px; margin: 0 auto; padding: 24px;
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between;
  font-size: 0.82rem; color: var(--kahve-soluk);
}}

/* Yazdırma */
@media print {{
  @page {{ size: A4; margin: 14mm 12mm; }}
  body {{ background: #fff; font-size: 10.5pt; }}
  .duzen {{ display: block; max-width: none; padding: 0; }}
  .icindekiler, .yazdirma-notu, .kapak__etiketler {{ display: none; }}
  .kapak__ic {{ padding: 0 0 12px; }}
  .icerik {{ padding: 0; }}
  .icerik h2 {{ page-break-after: avoid; margin-top: 26px; }}
  .icerik h3, table {{ page-break-inside: avoid; }}
  .tablo-sarmal {{ overflow: visible; border-color: #ddd; }}
  table {{ min-width: 0; font-size: 9pt; }}
  thead th {{ background: #f2f2f2; }}
  a {{ color: #000; text-decoration: none; }}
  .sayfa-alti {{ display: none; }}
}}
</style>
</head>
<body>

<header class="kapak">
  <div class="kapak__ic">
    <p class="kapak__marka">Beyza Blanc — Araştırma dosyası</p>
    <h1>{baslik}</h1>
    <p class="kapak__alt">{alt}</p>
    <div class="kapak__etiketler">
      <span class="etiket">Türkçe</span>
      <span class="etiket">Kaynaklı</span>
      <span class="etiket">{tarih}</span>
      <span class="etiket">Yazdırmaya hazır</span>
    </div>
  </div>
</header>

<div class="duzen">
  <nav class="icindekiler" aria-label="İçindekiler">
    <h2>İçindekiler</h2>
    <ol>{icindekiler}</ol>
    <p class="yazdirma-notu">
      Yazdırmak için <strong>Ctrl+P</strong> (Mac: ⌘+P). Yazdırma düzeninde menü ve
      etiketler gizlenir, tablolar sayfa taşmasına karşı korunur.
    </p>
  </nav>
  <main class="icerik">
{govde}
  </main>
</div>

<footer class="sayfa-alti">
  <div class="sayfa-alti__ic">
    <span>Beyza Blanc — {baslik}</span>
    <span>Kaynak: araştırma notları (research_notes) · {tarih}</span>
  </div>
</footer>

</body>
</html>
"""


def main():
    if len(sys.argv) < 5:
        print(__doc__)
        raise SystemExit(1)

    kaynak, hedef, baslik, alt = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    tarih = sys.argv[5] if len(sys.argv) > 5 else ""

    with open(kaynak, encoding="utf-8") as f:
        md = f.read()

    govde, ozet = donustur(md)
    icindekiler = "\n".join(
        '<li><a href="#%s">%s</a></li>' % (k, html.escape(b)) for k, b in ozet
    )

    sayfa = SABLON.format(
        baslik=html.escape(baslik),
        alt=html.escape(alt),
        tarih=html.escape(tarih),
        icindekiler=icindekiler,
        govde=govde,
    )

    with open(hedef, "w", encoding="utf-8") as f:
        f.write(sayfa)

    print("Yazıldı:", hedef)
    print("Bölüm (h2):", len(ozet))
    print("Tablo:", sayfa.count("<table>"))
    print("Bağlantı:", sayfa.count("<a "), "| Paragraf:", sayfa.count("<p>"))
    print("Boyut (KB):", round(len(sayfa.encode("utf-8")) / 1024, 1))


if __name__ == "__main__":
    main()
