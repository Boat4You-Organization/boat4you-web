import { routing } from './routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];

    Messages: {
      home: typeof import('../../messages/en/home.json').default;
      navigation: typeof import('../../messages/en/navigation.json').default;
      filters: typeof import('../../messages/en/filters.json').default;
      common: typeof import('../../messages/en/common.json').default;
      howWeWork: typeof import('../../messages/en/howWeWork.json').default;
      about: typeof import('../../messages/en/about.json').default;
      contact: typeof import('../../messages/en/contact.json').default;
      yacht: typeof import('../../messages/en/yacht.json').default;
      toastMessages: typeof import('../../messages/en/toastMessages.json').default;
      metadata: typeof import('../../messages/en/metadata.json').default;
      cookieConsent: typeof import('../../messages/en/cookieConsent.json').default;
      promo: typeof import('../../messages/en/promo.json').default;
      itinerary: typeof import('../../messages/en/itinerary.json').default;
      itineraryCroatia: typeof import('../../messages/en/itineraryCroatia.json').default;
      itineraryGreece: typeof import('../../messages/en/itineraryGreece.json').default;
      itineraryItaly: typeof import('../../messages/en/itineraryItaly.json').default;
      itinerarySpain: typeof import('../../messages/en/itinerarySpain.json').default;
      itineraryTurkey: typeof import('../../messages/en/itineraryTurkey.json').default;
      itineraryCaribbean: typeof import('../../messages/en/itineraryCaribbean.json').default;
    };
  }
}
