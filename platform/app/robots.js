import { siteUrl } from '../lib/seo';

export default function robots() {
  return siteUrl
    ? { rules: { userAgent: '*', allow: '/', disallow: '/admin' }, sitemap: siteUrl + '/sitemap.xml' }
    : { rules: { userAgent: '*', disallow: '/' } };
}
