const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } = require('next/constants');
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
      './messages/en/catalogueLinks.json',
      './messages/en/siteFacts.json',
      './messages/en/landing.json',
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
      './messages/en/itineraryGermany.json',
      './messages/en/models.json',
      './messages/en/charterFacts.json',
      './messages/en/priceGuide.json',
      './messages/en/review.json',
      './messages/en/homeHub.json',
    ],
  },
});

// Page metadata (title, meta robots, canonical, hreflang, description) must sit
// inside <head> for EVERY request. Next 16 streams metadata into <body> for user
// agents that do not match htmlLimitedBots, and an ISR page caches whatever the
// first render produced — so a UA list is not enough: a cold ISR render served
// title/robots/canonical after </head> even to Googlebot (26.9.2026, 11 of 12
// cold blog posts; audit B06), and a page first rendered for a browser kept
// body metadata for every later crawler. /.*/ is Next's documented switch to
// disable metadata streaming entirely; the cost is a later first byte on a cold
// render only (warm ISR pages are served from cache either way).
const HTML_LIMITED_BOTS = /.*/;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  htmlLimitedBots: HTML_LIMITED_BOTS,
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
      // The one non-lower-case path of the site (audit 29.9.2026, R34): the
      // Sicily route was published as /itineraries/sicily/palermoLong. The
      // route id is now `palermo-long`; the old spelling 301s in every locale
      // (the un-prefixed EN form and the eight prefixed ones separately, so
      // the locale is kept — an optional `:locale?` cannot be re-used in the
      // destination without leaving a double slash when it is absent).
      {
        source: '/itineraries/sicily/palermoLong',
        destination: '/itineraries/sicily/palermo-long',
        permanent: true,
      },
      {
        source: '/:locale(de|es|fr|it|pt|hr|pl|nl)/itineraries/sicily/palermoLong',
        destination: '/:locale/itineraries/sicily/palermo-long',
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
  //
  // Gentle static generation: one export worker, two pages at a time, two
  // retries. The defaults (a worker per core, 8 pages each) fired ~2,100
  // API requests a minute at api.boat4you.com during a local build on
  // 29.9.2026 — sitemaps and landings — and emptied the backend's Hikari
  // pool (35/35, 99 waiting): the live sites answered 500 to visitors and
  // Googlebot at 11:11–11:13 UTC. Slower builds, no flood.
  //
  // No Turbopack build cache on disk: Next 16.3 turns it on by default and
  // writes it to .next/cache/turbopack, which the deploy would tar up and ship
  // to cusma1 with every build (1.10.2026, Next 16.3.8 upgrade). Deploy builds
  // start from rm -rf .next anyway, so the cache would never be reused.
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
    optimizeCss: true,
    cpus: 1,
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 2,
    turbopackFileSystemCacheForBuild: false,
    // Next 16.3 prefetches from route patterns it has already learned
    // (optimisticRouting, default on), and a <Link> whose href redirects
    // (redirects() or a proxy 308) is then prefetched again and again:
    // Catamaran Charter Italy's footer link /destinations/amalfi (308 to
    // /destinations/campania) fired ~2,200 RSC requests in 16 s from one idle
    // tab (review 1.10.2026; Next issue vercel/next.js#97329). Off: prefetches
    // ask the server, as on 16.1. Next 16.1 only warns about the unknown key.
    optimisticRouting: false,
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
      // Files in /public (audit 29.9.2026, R64): destination photos, icons,
      // favicons, the OG image and the self-hosted fonts were served with the
      // HTML rule above (max-age=0, or Next's bare max-age=0 for /favicons),
      // so every repeat visit revalidated each of them. They are not
      // content-hashed, so no `immutable` year: a day in the browser plus a
      // week of stale-while-revalidate (fonts: 30 days — they never change
      // without a new file name). The catch-all HTML rule is untouched.
      // promo = the animated banner loops and posters (30.9.2026).
      {
        source: '/:dir(images|favicons|icons|meta|promo)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }],
      },
      // Sitemaps (audit B09): the landing/yacht sitemaps regenerate hourly
      // (ISR), so a 60 s shared-cache window only invited cold re-renders.
      // Hours of s-maxage plus a day of stale-while-revalidate; overrides the
      // 60 s rule above (the last matching header wins).
      {
        source: '/:sitemap(sitemap\\.xml|sitemap-[a-z]+\\.xml)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }],
      },
      {
        source: '/sitemap-yachts/:page/yacht.xml',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' }],
      },
      // The curated SEO corpus is raw material for the /search landing pages
      // (read server-side into the SSR HTML since 25.9.2026). Served bare from
      // public/, each file is a full unstyled HTML document that would compete
      // with its own landing page in the index — keep it out.
      {
        source: '/seo-content/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Guest review form (/[locale/]review/<token>): the token in the URL is
      // the credential and the page shows the guest's booking. Never cached
      // by a shared cache (overrides the s-maxage rule above — the last
      // matching header wins), never sent on as a Referer, never indexed.
      {
        source: '/:locale(de|es|fr|it|pt|hr|pl|nl)?/review/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
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

// Deployment id (Next skew protection, audit 29.9.2026 R62): every build gets one
// id, used as `deploymentId`, so the client's asset URLs carry `?dpl=<id>` and
// its RSC and server-action requests an `x-deployment-id` header, and a stale
// tab is recognisable as such. `next start` on cusma1 loads this file at
// runtime, where the build's id is read back from
// .next/required-server-files.json (the config the build ran with) — the same
// value, without the deploy script having to pass anything. Not from
// .next/BUILD_ID: since Next 16.3 a build with a deploymentId ignores
// generateBuildId and writes the constant `build-TfctsWXpff2fKS` there, and a
// runtime id that differs from the build's one makes the client treat every
// RSC response as coming from another deployment, so each client-side
// navigation becomes a full page load (1.10.2026, Next 16.3.8 upgrade). No id
// in development. The git sha is the readable part; the time suffix keeps two
// builds of one commit apart (the deploy verifies the staged vs live id).
const buildDeploymentId = () => {
  let sha = 'nogit';

  try {
    sha = execSync('git rev-parse --short=12 HEAD', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    // not a git checkout (a shipped tree) — the time suffix alone is unique enough
  }

  return `${sha}-${Date.now().toString(36)}`;
};

const deployedDeploymentId = () => {
  try {
    const { config } = JSON.parse(fs.readFileSync(path.join(__dirname, '.next', 'required-server-files.json'), 'utf8'));

    return (config && config.deploymentId) || undefined;
  } catch {
    return undefined;
  }
};

const configForPhase = phase => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    return { ...nextConfig, deploymentId: buildDeploymentId() };
  }

  if (phase === PHASE_PRODUCTION_SERVER) {
    const id = deployedDeploymentId();

    return id ? { ...nextConfig, deploymentId: id } : nextConfig;
  }

  return nextConfig;
};

module.exports = phase => {
  const config = withNextIntl(configForPhase(phase));

  if (process.env.ANALYZE === 'true') {
    const bundleAnalyerLocal = '@next/bundle-analyzer';
    const withBundleAnalyzer = require(bundleAnalyerLocal)({
      enabled: true,
    });

    return withBundleAnalyzer(config);
  }

  return config;
};
