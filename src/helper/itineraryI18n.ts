import { ItineraryDay, ItineraryRoute } from '@/types/itinerary.type';

/**
 * i18n key helpers for the (config-driven) itinerary copy.
 *
 * Europe Yachts groups itineraries by COUNTRY (Croatia, Greece, Italy,
 * Spain, Türkiye), so each country gets its own next-intl namespace:
 * `itineraryCroatia`, `itineraryGreece`, `itineraryItaly`,
 * `itinerarySpain`, `itineraryTurkey`. The namespace is stamped onto
 * every area + route object at the `itineraries.config` aggregation
 * point (see COUNTRY_TO_NAMESPACE + stampItineraryNamespace below) so
 * the per-country config files stay edit-free and a generic render
 * component works for all five countries.
 *
 * Areas/routes are migrated to next-intl one country at a time; until a
 * country's namespace JSON carries a key, the raw config string is used
 * verbatim. Every helper therefore takes a `translate` function and
 * `t.has`-guards the lookup, falling back to the config value.
 *
 * KEY LAYOUT under each country namespace (e.g. `itineraryCroatia`):
 *   areas.<areaId>.{metaTitle,metaDesc,title,description}
 *   routes.<routeId>.{metaTitle,metaDesc}
 *   routes.<routeId>.days.<dayNumber>.{shortDescription,description,mooringTip}
 *   routes.<routeId>.days.<dayNumber>.thingsToDo   (string[])
 *
 * `<areaId>` / `<routeId>` are the config `id` fields (e.g. 'split',
 * 'split-vis-korcula-hvar-route'); `<dayNumber>` is the 1-based
 * `ItineraryDay.day`.
 */

/**
 * Country label (as it appears in `itineraries.config` `country`) →
 * per-country next-intl namespace. The single source of truth for the
 * mapping; both the stamper below and any caller that needs to derive a
 * namespace from a country read this. Keyed case-insensitively via
 * `namespaceForCountry`.
 */
export const COUNTRY_TO_NAMESPACE: Record<string, string> = {
  croatia: 'itineraryCroatia',
  greece: 'itineraryGreece',
  italy: 'itineraryItaly',
  spain: 'itinerarySpain',
  turkey: 'itineraryTurkey',
  caribbean: 'itineraryCaribbean',
};

/** Fallback namespace when a country has no mapping yet (keeps the
 *  `useTranslations(...)` hook call valid; resolve* helpers still
 *  t.has-guard, so an unmatched key falls back to the config string). */
export const DEFAULT_ITINERARY_NAMESPACE = 'itineraryCroatia';

/** Resolve a country label to its namespace, tolerant of case/accents
 *  ('Türkiye'/'Turkey'/'turkey' all map to itineraryTurkey). */
export const namespaceForCountry = (country: string | undefined): string => {
  if (!country) return DEFAULT_ITINERARY_NAMESPACE;

  const key = country.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); // strip accents (Türkiye → turkiye)
  const normalized = key === 'turkiye' || key === 'türkiye' ? 'turkey' : key;

  return COUNTRY_TO_NAMESPACE[normalized] ?? DEFAULT_ITINERARY_NAMESPACE;
};

/**
 * Union of the per-country itinerary namespaces registered in
 * `AppConfig.Messages` — lets a runtime `i18nNamespace` string be handed
 * to next-intl's strictly-typed `useTranslations`/`getTranslations`.
 */
export type ItineraryNamespace =
  | 'itineraryCroatia'
  | 'itineraryGreece'
  | 'itineraryItaly'
  | 'itinerarySpain'
  | 'itineraryTurkey'
  | 'itineraryCaribbean';

/** Narrow a stamped area/route to its typed namespace (config fallback). */
export const itineraryNamespace = (obj: { i18nNamespace?: string }): ItineraryNamespace =>
  (obj.i18nNamespace as ItineraryNamespace | undefined) ?? DEFAULT_ITINERARY_NAMESPACE;

/**
 * Minimal shape shared by next-intl's `useTranslations`/`getTranslations`.
 * `.raw` returns the untyped message value (used for array fields);
 * `.has` reports whether the key exists in the active namespace.
 *
 * Parameters are typed `never[]` so ANY strictly-typed next-intl
 * Translator is assignable (contravariance) — the resolve* helpers build
 * keys at runtime (`areas.<id>.<field>`), which the typed key unions can
 * never express; the `t.has` guard is the safety net. Internally the
 * helpers widen back to string keys via `loose()`.
 */
export type Translate = ((...args: never[]) => string) & {
  raw: (...args: never[]) => unknown;
  has: (...args: never[]) => boolean;
};

type LooseTranslate = ((key: string) => string) & {
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
};

const loose = (t: Translate): LooseTranslate => t as unknown as LooseTranslate;

const areaKey = (areaId: string, field: string) => `areas.${areaId}.${field}`;
const routeKey = (routeId: string, field: string) => `routes.${routeId}.${field}`;
const dayKey = (routeId: string, day: number, field: string) => `routes.${routeId}.days.${day}.${field}`;

/** Resolve an area-level field, falling back to the raw config value. */
export const resolveAreaText = (
  // index signature so any Itinerary-shaped object is assignable
  itinerary: { id?: string; i18nNamespace?: string; [key: string]: unknown },
  field: 'metaTitle' | 'metaDesc' | 'title' | 'description',
  fallback: string | undefined,
  t: Translate | undefined
): string | undefined => {
  if (!itinerary.i18nNamespace || !itinerary.id || !t) return fallback;

  const tt = loose(t);
  const key = areaKey(itinerary.id, field);

  return tt.has(key) ? tt(key) : fallback;
};

/** Resolve a route-level meta field, falling back to the raw config value. */
export const resolveRouteText = (
  route: Pick<ItineraryRoute, 'id'> & { i18nNamespace?: string },
  field: 'metaTitle' | 'metaDesc',
  fallback: string | undefined,
  t: Translate | undefined
): string | undefined => {
  if (!route.i18nNamespace || !t) return fallback;

  const tt = loose(t);
  const key = routeKey(route.id, field);

  return tt.has(key) ? tt(key) : fallback;
};

/** Resolve a per-day string field, falling back to the raw config value. */
export const resolveDayText = (
  route: Pick<ItineraryRoute, 'id'> & { i18nNamespace?: string },
  day: Pick<ItineraryDay, 'day'>,
  field: 'shortDescription' | 'description' | 'mooringTip',
  fallback: string | undefined,
  t: Translate | undefined
): string | undefined => {
  if (!route.i18nNamespace || !t) return fallback;

  const tt = loose(t);
  const key = dayKey(route.id, day.day, field);

  return tt.has(key) ? tt(key) : fallback;
};

/**
 * Resolve a per-day string-array field (e.g. `thingsToDo`). When the
 * country is migrated the array lives in messages and is read via
 * `t.raw`; otherwise the raw config array is used verbatim.
 */
export const resolveDayList = (
  route: Pick<ItineraryRoute, 'id'> & { i18nNamespace?: string },
  day: Pick<ItineraryDay, 'day'>,
  field: 'thingsToDo',
  fallback: string[] | undefined,
  t: Translate | undefined
): string[] | undefined => {
  if (!route.i18nNamespace || !t) return fallback;

  const tt = loose(t);
  const key = dayKey(route.id, day.day, field);

  if (tt.has(key)) {
    const value = tt.raw(key);

    return Array.isArray(value) ? (value as string[]) : fallback;
  }

  return fallback;
};
