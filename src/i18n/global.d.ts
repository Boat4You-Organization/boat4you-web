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
    };
  }
}
