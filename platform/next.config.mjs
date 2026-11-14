const config = {
  poweredByHeader: false,
  output: 'standalone', // Docker imajı için (plan 0.6)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
  async rewrites() {
    return [
    ];
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/sss.html', destination: '/sss', permanent: true },
      { source: '/urun.html', destination: '/koleksiyonlar', permanent: true },
      { source: '/urun', has: [{ type: 'query', key: 'tasarim', value: '(?<slug>[a-z0-9-]+)' }], destination: '/tasarim/:slug', permanent: true },
      { source: '/urun', destination: '/koleksiyonlar', permanent: true },
      ...['koleksiyonlar','hakkimizda','kurumsal','iletisim'].map(name => ({
        source: '/' + name + '.html', destination: '/' + name, permanent: true,
      })),
    ];
  },
  async headers() {
    const gelistirme = process.env.NODE_ENV !== 'production';
    // Vitrin: satır içi betikler (Next önyükleme, JSON-LD) ve Google Fonts için izin verilir (plan 3.5 ilk adım).
    const vitrinCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com" + (gelistirme ? " 'unsafe-eval'" : ''),
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com" + (gelistirme ? ' ws:' : ''),
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    // Yönetim paneli: görseller yalnızca aynı kökenden (önizlemeler /admin/media altında).
    const yonetimCsp = vitrinCsp.replace('img-src \'self\' data: blob: https:', "img-src 'self' data: blob:");
    const guvenlik = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      { key: 'Content-Security-Policy', value: vitrinCsp },
    ];
    return [
      { source: '/:path*', headers: guvenlik },
      { source: '/admin/:path*', headers: [
        ...guvenlik.filter((h) => h.key !== 'Content-Security-Policy'),
        { key: 'Content-Security-Policy', value: yonetimCsp },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'Cache-Control', value: 'private, no-store' },
      ] },
    ];
  },
};

export default config;
