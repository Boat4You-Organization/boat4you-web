import type { Messages } from 'next-intl';

/**
 * Namespaces that CLIENT components consume (useTranslations / useMessages) on pages all over the site.
 * Everything handed to NextIntlClientProvider is serialized into every page's HTML, so the root layout ships
 * only these instead of the full 2.2 MB catalogue. Server-only namespaces (metadata, contact) are read via
 * getTranslations and never reach the browser.
 *
 * A namespace that the client components of one page or segment read does NOT belong here: that page adds it
 * with <ExtraClientMessages> (about on /about-us, howWeWork on /how-we-work and /contact-us, review on
 * /review, the itinerary namespaces on /itineraries). 6.11.2026: about and howWeWork moved out that way and
 * itinerary was cut to SITE_CLIENT_KEYS, about 22 KB less in every page.
 */
export const CLIENT_NAMESPACES = [
  'capacity',
  'common',
  'cookieConsent',
  'filters',
  'home',
  'itinerary',
  'navigation',
  'promo',
  'toastMessages',
  'yacht',
] as const satisfies readonly (keyof Messages)[];

/**
 * For a namespace listed here, only these top-level keys go to every page. `itinerary`: the route cards under a
 * boat, a blog post and a booking (components/SuggestedItineraries) read `suggested`, `hub` and `area`; the rest
 * (builder, SEO sections, route panels: 13 of 15 KB) is read only on /itineraries, which gets the whole
 * namespace from ItineraryMessages.
 */
const SITE_CLIENT_KEYS = {
  itinerary: ['suggested', 'hub', 'area'],
} as const satisfies { [N in keyof Messages]?: readonly (keyof Messages[N])[] };

/** What the root layout hands the browser: CLIENT_NAMESPACES, cut down per SITE_CLIENT_KEYS. */
export const siteClientMessages = (messages: Messages): Partial<Messages> =>
  Object.fromEntries(
    CLIENT_NAMESPACES.map(namespace => {
      const keys: readonly string[] | undefined = (SITE_CLIENT_KEYS as Record<string, readonly string[]>)[namespace];
      const all = messages[namespace] as Record<string, unknown>;

      return [namespace, keys ? Object.fromEntries(keys.map(key => [key, all[key]])) : all];
    })
  ) as Partial<Messages>;

/** Per-country itinerary copy (~2 MB) — only the /itineraries segment needs it client-side (ItineraryMessages). */
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
  'itineraryGermany',
] as const satisfies readonly (keyof Messages)[];

/** Review form copy — only the /review segment needs it client-side. */
export const REVIEW_NAMESPACES = ['review'] as const satisfies readonly (keyof Messages)[];

/** Card payment form copy — only the secret /pay/<key> segment needs it client-side. */
export const PAY_NAMESPACES = ['pay'] as const satisfies readonly (keyof Messages)[];

export const pickMessages = (messages: Messages, keys: readonly (keyof Messages)[]): Partial<Messages> =>
  Object.fromEntries(keys.map(key => [key, messages[key]])) as Partial<Messages>;
