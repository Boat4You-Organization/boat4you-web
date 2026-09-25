import { defineRouting } from 'next-intl/routing';

import { supportedLocales } from '@/models/user.model';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // localeDetection stays ON — a German customer in Berlin should land
  // on the DE site by default, not English. We rely on the Accept-Language
  // header + NEXT_LOCALE cookie negotiation that next-intl ships with.
  // No hreflang in the HTTP `Link` header. The middleware builds it from the
  // pathname alone, so every /search landing announced the bare `/search`
  // (query dropped) in all 9 locales, contradicting the page's own
  // <link rel="alternate"> tags (query kept, gated locales only), and blog
  // posts announced 9 locale URLs while their HTML lists EN only. Every
  // indexable page sets its alternates in the HTML head (buildMetadata /
  // the locale layout), which stays the one hreflang source.
  alternateLinks: false,
});
