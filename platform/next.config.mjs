const config = {
  poweredByHeader: false,
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
    return [
      { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Frame-Options', value: 'DENY' }] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'private, no-store' }] },
    ];
  },
};

export default config;
