import { defineRouting } from 'next-intl/routing';

import { supportedLocales } from '@/models/user.model';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // localeDetection stays ON — a German customer in Berlin should land
  // on the DE site by default, not English. We rely on the Accept-Language
  // header + NEXT_LOCALE cookie negotiation that next-intl ships with.
});
