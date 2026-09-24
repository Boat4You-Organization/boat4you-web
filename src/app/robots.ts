import { MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';

const protectedPaths = [
  '/admin',
  '/my-profile',
  '/my-bookings',
  '/enter-your-details',
  '/cancel-booking',
  '/payment-success',
  '/payment-cancelled',
  '/payment-pending',
  '/forgot-password',
];

/**
 * Boat pages carrying ANY query string (`?startDate=…`, `?did=l-…`,
 * `?destinations=…`). Every such variant canonicalises to the clean
 * `/boat/<slug>`, but Google still crawled them one by one — 51.5K of them
 * in Search Console (24.9.2026) — while 2.6K genuinely new boats waited in
 * "Discovered – currently not indexed". The clean boat URLs in every language
 * (`/boat/<slug>`, `/de/boat/<slug>`, …) stay fully crawlable and in the
 * sitemap; only the parameter copies are closed, as on the sister sites.
 */
const boatQueryPattern = '/boat/*?';

export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.flatMap(locale => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

    return [...protectedPaths.map(path => `${prefix}${path}`), `${prefix}${boatQueryPattern}`];
  });

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    host: process.env.NEXT_PUBLIC_BASE_URL,
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
