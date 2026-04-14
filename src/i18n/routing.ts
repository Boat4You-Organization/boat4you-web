import { defineRouting } from 'next-intl/routing';

import { supportedLocales } from '@/models/user.model';

export const routing = defineRouting({
  locales: supportedLocales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
