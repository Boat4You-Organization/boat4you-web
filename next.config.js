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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
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
