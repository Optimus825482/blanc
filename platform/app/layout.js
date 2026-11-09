import './platform.css';
import { siteUrl } from '../lib/seo';

export const metadata = {
  title: { default: 'Beyza Blanc', template: '%s | Beyza Blanc' },
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  robots: siteUrl ? undefined : { index: false, follow: false },
  icons: { icon: '/assets/img/instagram/marka/beyza-blanc-profil.webp' },
};

export default function Layout({ children }) {
  return <html lang="tr"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet" /><link rel="stylesheet" href="/assets/css/style.css" /><link rel="stylesheet" href="/assets/css/vitrin.css" /></head><body>{children}</body></html>;
}
