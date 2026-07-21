import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? (requested as Locale) : routing.defaultLocale;

  const messages = {
    home: (await import(`../../messages/${locale}/home.json`)).default,
    navigation: (await import(`../../messages/${locale}/navigation.json`)).default,
    filters: (await import(`../../messages/${locale}/filters.json`)).default,
    common: (await import(`../../messages/${locale}/common.json`)).default,
    howWeWork: (await import(`../../messages/${locale}/howWeWork.json`)).default,
    about: (await import(`../../messages/${locale}/about.json`)).default,
    contact: (await import(`../../messages/${locale}/contact.json`)).default,
    yacht: (await import(`../../messages/${locale}/yacht.json`)).default,
    toastMessages: (await import(`../../messages/${locale}/toastMessages.json`)).default,
    metadata: (await import(`../../messages/${locale}/metadata.json`)).default,
    cookieConsent: (await import(`../../messages/${locale}/cookieConsent.json`)).default,
    promo: (await import(`../../messages/${locale}/promo.json`)).default,
    itinerary: (await import(`../../messages/${locale}/itinerary.json`)).default,
    itineraryCroatia: (await import(`../../messages/${locale}/itineraryCroatia.json`)).default,
    itineraryGreece: (await import(`../../messages/${locale}/itineraryGreece.json`)).default,
    itineraryItaly: (await import(`../../messages/${locale}/itineraryItaly.json`)).default,
    itinerarySpain: (await import(`../../messages/${locale}/itinerarySpain.json`)).default,
    itineraryTurkey: (await import(`../../messages/${locale}/itineraryTurkey.json`)).default,
    itineraryCaribbean: (await import(`../../messages/${locale}/itineraryCaribbean.json`)).default,
    itineraryFrance: (await import(`../../messages/${locale}/itineraryFrance.json`)).default,
    itineraryMontenegro: (await import(`../../messages/${locale}/itineraryMontenegro.json`)).default,
    itinerarySeychelles: (await import(`../../messages/${locale}/itinerarySeychelles.json`)).default,
    itineraryThailand: (await import(`../../messages/${locale}/itineraryThailand.json`)).default,
    itineraryNetherlands: (await import(`../../messages/${locale}/itineraryNetherlands.json`)).default,
    itineraryGermany: (await import(`../../messages/${locale}/itineraryGermany.json`)).default,
  } as const;

  return {
    locale,
    messages,
  };
});
