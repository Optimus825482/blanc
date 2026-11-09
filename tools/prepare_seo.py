"""Generate production SEO URLs in a copy of the static site."""
import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

PAGES = (
    'index.html', 'koleksiyonlar.html', 'kurumsal.html', 'hakkimizda.html',
    'studyo.html', 'iletisim.html', 'sss.html',
)
SOCIAL_IMAGE = 'assets/img/instagram/nisan/altin-cikolata-aranjmani.webp'
LOGO = 'assets/img/instagram/marka/beyza-blanc-profil.webp'


def prepare(site, origin):
    pages = {name: (site / name).read_text(encoding='utf-8-sig') for name in PAGES}
    for asset in (SOCIAL_IMAGE, LOGO):
        if not (site / asset).is_file():
            raise FileNotFoundError(asset)

    sitemap = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for name, page in pages.items():
        url = origin + ('/' if name == 'index.html' else '/' + name)
        ET.SubElement(ET.SubElement(sitemap, 'url'), 'loc').text = url
        page = re.sub(r'(?ms)^[ \t]*<!-- seo:yayin -->.*?<!-- /seo:yayin -->\n', '', page)
        metadata = [f'<link rel="canonical" href="{url}">']
        if name == 'index.html':
            image = f'{origin}/{SOCIAL_IMAGE}'
            metadata += [
                f'<meta property="og:url" content="{url}">',
                f'<meta property="og:image" content="{image}">',
                '<meta property="og:image:alt" content="Beyza Blanc altın ambalajlı çikolata aranjmanı">',
                '<meta name="twitter:card" content="summary_large_image">',
            ]
            pattern = r'(<script type="application/ld\+json" id="beyza-isletme">)(.*?)(</script>)'
            match = re.search(pattern, page, re.S)
            if match is None:
                raise ValueError('Beyza Blanc işletme işaretlemesi bulunamadı.')
            business = json.loads(match[2])
            business.update(url=url, image=image, logo=f'{origin}/{LOGO}')
            page = page[:match.start(2)] + '\n' + json.dumps(business, ensure_ascii=False, indent=2) + '\n  ' + page[match.end(2):]
        block = '\n'.join(['<!-- seo:yayin -->', *metadata, '<!-- /seo:yayin -->', '</head>'])
        pages[name] = page.replace('</head>', block, 1)

    for name, page in pages.items():
        (site / name).write_text(page, encoding='utf-8')
    ET.indent(sitemap, space='  ')
    ET.ElementTree(sitemap).write(site / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    (site / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {origin}/sitemap.xml\n', encoding='utf-8')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('site', type=Path, help='Yayınlanacak site klasörünün kopyası')
    parser.add_argument('origin', help='Yayın adresi, ör. https://ornek.example')
    args = parser.parse_args()
    url = urlsplit(args.origin)
    if (url.scheme != 'https' or url.path not in ('', '/') or url.query or url.fragment
            or not re.fullmatch(r'[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', url.netloc)):
        parser.error('Yol içermeyen bir HTTPS alan adı girin.')
    prepare(args.site, f'https://{url.netloc.lower()}')
