import { meta } from '@/config/meta';

const SITE_URL = meta.url;

/**
 * Single Person reference for AEO / AI Overview author signals — hoisted
 * so every TouristTrip / CollectionPage builder references the same
 * broker entity instead of duplicating literals.
 */
export const BROKER_AUTHOR = {
  '@type': 'Person' as const,
  name: 'Mario Kuzmanić',
  jobTitle: 'Charter broker',
  worksFor: {
    '@type': 'Organization' as const,
    name: meta.name,
    url: SITE_URL,
  },
  knowsAbout: [
    'Croatia yacht charter',
    'Greece yacht charter',
    'Italy yacht charter',
    'Spain yacht charter',
    'Türkiye yacht charter',
    'Caribbean yacht charter',
  ],
};

/** ISO date stamp for content authority signal — bump on meaningful refresh. */
export const CONTENT_LAST_REVIEWED = '2026-07-21';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbListLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): BreadcrumbListLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export interface TouristTripLd {
  '@context': 'https://schema.org';
  '@type': 'TouristTrip';
  name: string;
  description?: string;
  url: string;
  touristType?: string;
  image?: string[];
  itinerary: Array<{
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      item: {
        '@type': 'Place';
        name: string;
        description?: string;
      };
    }>;
  }>;
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  datePublished: string;
  dateModified: string;
  author: typeof BROKER_AUTHOR;
}

interface RouteShape {
  startingPoint: string;
  otherPoints: string[];
  numberOfDays?: number;
  cardImage?: { src?: string };
  routeDays?: Array<{ day: number; routeFrom: string; routeTo: string; description?: string }>;
}

/**
 * Optional locale-aware overrides for `buildTouristTripJsonLd`. Supplied
 * by the route-detail page (which holds the active locale + the route's
 * i18nNamespace + the shared `itinerary` namespace) so the machine-facing
 * JSON-LD matches the locale the visitor actually sees instead of the
 * hardcoded EN config copy.
 *
 *  - `name`        — fully-localized TouristTrip name (overrides EN template)
 *  - `description` — fully-localized trip summary (overrides EN template)
 *  - `dayDescriptions` — resolved per-day prose keyed by 1-based day number,
 *    produced via the SAME `resolveDayText` path the visible page uses, so
 *    the itinerary `Place.description` entries match the rendered narrative.
 *
 * All fields optional; anything omitted falls back to the EN behaviour.
 */
export interface TouristTripL10n {
  name?: string;
  description?: string;
  dayDescriptions?: Record<number, string | undefined>;
}

/**
 * TouristTrip JSON-LD per route — helps Google recognise each route as
 * an indexable trip option (rich Trip card in the SERP). Boat4You is
 * multi-vessel-type so generic "yacht charter" copy. When `l10n` comes
 * from the page, title/description/day prose are localized (match the
 * visible page); otherwise EN config fallback.
 */
export const buildTouristTripJsonLd = (
  route: RouteShape,
  slug: string,
  routeId: string,
  sailingArea: string,
  country: string,
  l10n: TouristTripL10n = {}
): TouristTripLd => {
  const url = `${SITE_URL}/itineraries/${slug}/${routeId}`;
  const routeTitle = [route.startingPoint, ...route.otherPoints].join(' – ');
  const days = route.routeDays ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: l10n.name ?? `${route.numberOfDays ?? 7}-day ${sailingArea} yacht charter route — ${routeTitle}`,
    description:
      l10n.description ??
      `Sample ${route.numberOfDays ?? 7}-day yacht charter itinerary in ${sailingArea}, ${country}. Departure from ${route.startingPoint}${route.otherPoints.length ? ` via ${route.otherPoints.join(', ')}` : ''}.`,
    url,
    touristType: 'Yacht charter',
    image: route.cardImage?.src
      ? [route.cardImage.src.startsWith('http') ? route.cardImage.src : `${SITE_URL}${route.cardImage.src}`]
      : undefined,
    itinerary: [
      {
        '@type': 'ItemList',
        numberOfItems: days.length,
        itemListElement: days.map((d, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Place',
            name: `${d.routeFrom} → ${d.routeTo}`,
            // Prefer the locale-resolved day prose (matches visible page);
            // fall back to the raw EN config description when not supplied.
            description: l10n.dayDescriptions?.[d.day] ?? d.description,
          },
        })),
      },
    ],
    provider: {
      '@type': 'Organization',
      name: meta.name,
      url: SITE_URL,
    },
    datePublished: CONTENT_LAST_REVIEWED,
    dateModified: CONTENT_LAST_REVIEWED,
    author: BROKER_AUTHOR,
  };
};

interface ItineraryCollectionInput {
  itineraries: Array<{ id: string; sailingArea: string; country: string }>;
  description: string;
}

/**
 * CollectionPage + ItemList JSON-LD for the /itineraries hub. Google uses
 * it for the "Sites linked from this page" rich snippet and it helps the
 * individual route-detail pages rank for "{country} yacht charter route"
 * queries.
 */
export const buildItineraryCollectionJsonLd = ({ itineraries, description }: ItineraryCollectionInput) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Boat4You Yacht Charter Itineraries',
  description,
  url: `${SITE_URL}/itineraries`,
  inLanguage: 'en-US',
  isPartOf: { '@type': 'WebSite', url: SITE_URL },
  datePublished: CONTENT_LAST_REVIEWED,
  dateModified: CONTENT_LAST_REVIEWED,
  author: BROKER_AUTHOR,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: itineraries.length,
    itemListElement: itineraries.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/itineraries/${it.id}`,
      name: `${it.sailingArea} yacht charter routes — ${it.country}`,
    })),
  },
});
