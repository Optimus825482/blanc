import { Cormorant_Garamond, Inter, Pinyon_Script } from 'next/font/google';
import './platform.css';
import { siteUrl } from '../lib/seo';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-pinyon',
});

export const metadata = {
  title: { default: 'Beyza Blanc', template: '%s | Beyza Blanc' },
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  robots: siteUrl ? undefined : { index: false, follow: false },
  icons: { icon: '/assets/img/instagram/marka/beyza-blanc-profil.webp' },
};

export default function Layout({ children }) {
  const fontVars = `${cormorant.variable} ${inter.variable} ${pinyon.variable}`;
  return (
    <html lang="tr" className={fontVars} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/vitrin.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
