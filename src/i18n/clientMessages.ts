import type { Messages } from 'next-intl';

/**
 * Namespaces that CLIENT components consume (useTranslations / useMessages).
 * Everything handed to NextIntlClientProvider is serialized into every page's
 * HTML, so the root layout ships only these (~95 KB) instead of the full
 * 2.2 MB catalogue. Server-only namespaces (metadata, contact) are read via
 * getTranslations and never reach the browser.
 */
export const CLIENT_NAMESPACES = [
  'about',
  'common',
  'cookieConsent',
  'filters',
  'home',
  'howWeWork',
  'itinerary',
  'navigation',
  'promo',
  'toastMessages',
  'yacht',
] as const satisfies readonly (keyof Messages)[];

/** Per-country itinerary copy (~2 MB) — only the /itineraries segment needs it client-side. */
export const ITINERARY_NAMESPACES = [
  'itineraryCroatia',
  'itineraryGreece',
  'itineraryItaly',
  'itinerarySpain',
  'itineraryTurkey',
  'itineraryCaribbean',
  'itineraryFrance',
  'itineraryMontenegro',
  'itinerarySeychelles',
  'itineraryThailand',
  'itineraryNetherlands',
  'itineraryGermany',
] as const satisfies readonly (keyof Messages)[];

export const pickMessages = (messages: Messages, keys: readonly (keyof Messages)[]): Partial<Messages> =>
  Object.fromEntries(keys.map(key => [key, messages[key]])) as Partial<Messages>;
