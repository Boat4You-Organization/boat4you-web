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
      './messages/en/promo.json',
      './messages/en/itinerary.json',
      './messages/en/itineraryCroatia.json',
      './messages/en/itineraryGreece.json',
      './messages/en/itineraryItaly.json',
      './messages/en/itinerarySpain.json',
      './messages/en/itineraryTurkey.json',
      './messages/en/itineraryCaribbean.json',
      './messages/en/itineraryFrance.json',
      './messages/en/itineraryMontenegro.json',
      './messages/en/itinerarySeychelles.json',
      './messages/en/itineraryThailand.json',
      './messages/en/itineraryNetherlands.json',
      './messages/en/itineraryGermany.json',
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Home SSG (9 locales, live API fetches) needs >60s per page when the
  // build machine is under load from parallel builds — the default 60s
  // limit killed three builds on 17.7.2026 alone. The pages themselves
  // build in seconds on an idle machine.
  staticPageGenerationTimeout: 180,
  async rewrites() {
    return [
      // Same-origin proxy for yacht photos used by the client-side yacht
      // PDF (useYachtPdfDownload): the canvas WEBP->JPEG conversion needs
      // CORS-clean pixels, and the Bunny pull zone serves cached copies
      // without Access-Control-Allow-Origin (no Vary: Origin). Proxying
      // through our origin sidesteps CORS entirely; Bunny still caches
      // the images upstream. Query params (?width=) pass through.
      {
        source: '/pdf-image/:imageId',
        destination: 'https://boat4you.b-cdn.net/public/image/:imageId',
      },
    ];
  },
  async redirects() {
    return [
      // Apex -> www canonical 301 (2026-06-11). nginx on the edge already
      // enforces this (see deploy/nginx/); this git-tracked backstop keeps the
      // rule alive even if the nginx conf is ever regenerated (certbot --nginx).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'boat4you.com' }],
        destination: 'https://www.boat4you.com/:path*',
        permanent: true,
      },
      // Legacy blog slug still reachable from old external links / stale
      // search results (reported by a visitor 25.7.2026). The article lives
      // on Europe Yachts nowadays; our own equivalent is the cost breakdown
      // pillar — 301 there so the visitor lands on live content and any
      // remaining link equity transfers. Locale-prefixed variants included
      // (pl/nl added 2.8.2026 — the original group missed them and access
      // logs show both locales being crawled).
      {
        source: '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/how-much-does-it-cost-to-charter-a-yacht',
        destination: '/blog/yacht-charter-cost-2026-full-breakdown',
        permanent: true,
      },
      // Meta's crawler farm (57.141.0.0/16) holds a stale URL inventory with
      // a literal "/boat/null" per locale — ~1.1k hits/day, ZERO real users
      // (measured 2.8.2026), and because that crawler executes JS it fired
      // our GA tag and pushed "Yacht Not Found" to the top of Analytics. No
      // real yacht slug can ever be "null" (slugs always end in -<id>), so a
      // blanket 301 to search is safe and teaches crawlers the URL is gone.
      {
        source: '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/boat/null',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/null',
        destination: '/',
        permanent: true,
      },
      // Legacy WordPress-era blog slugs (pre-2026 FAQ-style posts) still
      // crawled by bots and reachable from stale links — top 404 offenders
      // from access logs (2.8.2026), each mapped to the closest live
      // equivalent so visitors land on real content instead of a 404.
      {
        source:
          '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/how-much-does-it-cost-to-rent-a-boat-a-complete-price-guide',
        destination: '/blog/yacht-charter-cost-2026-full-breakdown',
        permanent: true,
      },
      {
        source:
          '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/do-i-need-a-license-to-rent-a-boat-a-country-by-country-guide',
        destination: '/blog/do-i-need-sailing-license-charter-yacht-croatia-greece-italy-spain-turkey-2026',
        permanent: true,
      },
      {
        source:
          '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/are-life-jackets-and-safety-equipment-provided-on-the-yacht',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/what-documentation-is-required-for-chartering-a-yacht',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/the-ultimate-guide-to-renting-a-boat-for-the-first-time',
        destination: '/how-we-work',
        permanent: true,
      },
      {
        source: '/:locale(de|es|fr|it|pt|hr|en|pl|nl)?/blog/what-should-i-pack-for-a-yacht-trip-in-the-mediterranean',
        destination: '/blog/provisioning-a-charter-yacht-galley-and-food-guide',
        permanent: true,
      },
    ];
  },
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
      // Baseline security headers on every response (audit 2.9.2026). No CSP/HSTS
      // here — HSTS is nginx's job, CSP needs a nonce pipeline first.
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
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
