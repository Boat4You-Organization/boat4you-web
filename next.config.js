const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: [
      './messages/en/home.json',
      './messages/en/navigation.json',
      './messages/en/filters.json',
      './messages/en/common.json',
      './messages/en/howWeWork.json',
      './messages/en/about.json',
      './messages/en/contact.json',
      './messages/en/yacht.json',
      './messages/en/toastMessages.json',
      './messages/en/metadata.json',
      './messages/en/cookieConsent.json',
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next default gzip on. Nginx-level brotli (cusma1) handles modern UAs;
  // keeping Next compress=true is safe (it's only applied when no upstream
  // already encoded the response).
  compress: true,
  // Strip MUI tree at build time — pulls only the icons/components actually
  // imported instead of the full barrel (~200KB JS saved on home). optimizeCss
  // pulls Critters in to inline above-the-fold CSS into the prerendered HTML
  // so the 10 render-blocking <link> chunks on the home no longer add up to
  // 1.6s of paint delay.
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
    optimizeCss: true,
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  // HTML responses default to no-store under our middleware-less setup;
  // explicit SWR header lets Chrome's bf-cache restore the page on back/
  // forward nav (PSI mobile flags MainResourceHasCacheControlNoStore). The
  // 60s freshness window is short enough to pick up content updates and long
  // enough to absorb traffic spikes. /api/* stays uncached (auth-sensitive).
  async headers() {
    return [
      {
        source: '/((?!api/|_next/static/|_next/image|favicons/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  images: {
    // Custom loader: yacht photos (/public/image/<id>) are resized by the
    // backend on a ?width= param and served via Bunny CDN, so we skip Next's
    // built-in optimizer for them entirely — the browser fetches the
    // correctly-sized image straight from the Bunny edge. This stops cusma1
    // from re-resizing + caching every variant in .next/cache/images (that
    // cache had no size cap, grew to ~6 GB and filled the disk). Non-image
    // endpoints (flags, WP/blog media, static assets) pass through unchanged.
    // See src/utils/static/bunnyImageLoader.js. Requires "Cache by query
    // string" on the Bunny pull zone so each width is cached separately.
    loader: 'custom',
    loaderFile: './src/utils/static/bunnyImageLoader.js',
    // Local dev backend serves images with query strings (/public/image/123?width=800)
    // which Next.js 16 image optimizer's remotePatterns rejects ("url parameter
    // is not allowed") even with a matching host/port. Turning optimization off
    // in dev renders <Image> as plain <img> — OK locally. In production the
    // backend is behind api.boat4you.com with cleaner URLs so optimizer stays on.
    unoptimized: process.env.NODE_ENV !== 'production',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Next 16 restricts <Image quality> to the default 75 unless explicitly
    // allow-listed — anything else returns "q parameter not allowed" (400).
    // We use 65 on home thumbnails (DestinationCard, OurFleetCard, the
    // cookie-consent splash) where SSIM is well within perceptual tolerance
    // and saves ~25 % bytes per request. Keep 75 too for callers that
    // didn't opt in.
    qualities: [65, 75],
    remotePatterns: [
      // Backend dev serves images off http://localhost:8443. Next.js Image
      // optimizer only matches the default port (80/443) unless we spell the
      // port out explicitly — without this every /_next/image request for a
      // yacht photo returns 400 and the search listings render blank.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8443',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'boat4you-dev.workspace.hr',
      },
      {
        protocol: 'https',
        hostname: 'www.booking-manager.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'boat4you.com',
      },
      {
        // Blog/WP media is host-swapped wp.boat4you.com -> www.boat4you.com in
        // lib/api.ts (de-WordPress) and served via the cusma1 nginx /wp-content
        // proxy. The Next image optimizer matches hostname exactly, so the
        // bare boat4you.com entry above does NOT cover www — without this the
        // optimizer 400s and blog images render as broken alt text.
        protocol: 'https',
        hostname: 'www.boat4you.com',
      },
      {
        // Bunny CDN pull zone (NEXT_PUBLIC_IMAGE_CDN_URL) — yacht photos served via
        // boat4you.b-cdn.net/public/image/<id>. Without whitelisting this host the
        // Next image optimizer returns 400 and listings render blank once the CDN
        // env var is configured (the .env on the FE box now sets it).
        protocol: 'https',
        hostname: 'boat4you.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'ws.nausys.com',
      },
      {
        protocol: 'https',
        hostname: 'wp.boat4you.com',
      },
      {
        protocol: 'https',
        hostname: 'api.boat4you.com',
      },
    ],
  },
};

if (process.env.ANALYZE === 'true') {
  const bundleAnalyerLocal = '@next/bundle-analyzer';
  const withBundleAnalyzer = require(bundleAnalyerLocal)({
    enabled: true,
  });

  module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
} else {
  module.exports = withNextIntl(nextConfig);
}
