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

export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.flatMap(locale => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

    return protectedPaths.map(path => `${prefix}${path}`);
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
