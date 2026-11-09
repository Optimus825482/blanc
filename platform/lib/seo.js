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
