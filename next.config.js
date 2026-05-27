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
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    // Local dev backend serves images with query strings (/public/image/123?width=800)
    // which Next.js 16 image optimizer's remotePatterns rejects ("url parameter
    // is not allowed") even with a matching host/port. Turning optimization off
    // in dev renders <Image> as plain <img> — OK locally. In production the
    // backend is behind api.boat4you.com with cleaner URLs so optimizer stays on.
    unoptimized: process.env.NODE_ENV !== 'production',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
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
