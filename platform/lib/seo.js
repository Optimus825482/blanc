export const instagram = 'https://www.instagram.com/beyzablanc/';
export const contact = 'https://ig.me/m/beyzablanc';
export const socialImage = '/assets/img/instagram/nisan/altin-cikolata-aranjmani.webp';

const configuredUrl = process.env.SITE_URL?.trim();
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : null;

export function pageMetadata(title, description, path, image = socialImage) {
  const url = siteUrl ? new URL(path, siteUrl).href : undefined;
  const cover = siteUrl ? new URL(image, siteUrl).href : undefined;
  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: 'website', locale: 'tr_TR', siteName: 'Beyza Blanc',
      title, description, url, images: cover ? [{ url: cover }] : undefined,
    },
    twitter: cover ? { card: 'summary_large_image', title, description, images: [cover] } : undefined,
  };
}

export function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: siteUrl && path ? new URL(path, siteUrl).href : undefined,
    })),
  };
}

export function collectionJsonLd(name, description, path, items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: siteUrl ? new URL(path, siteUrl).href : undefined,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 30).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: siteUrl ? new URL(item.url || '/tasarim/' + item.slug, siteUrl).href : undefined,
      })),
    },
  };
}
