import 'server-only';

import { Currency } from '@/models/user.model';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { LocationType } from '@/types/location.type';
import { PaginatedResponse } from '@/types/response.type';
import { Hub, countryPlaceFor, hubFor, localePrefix, regionHubAbove } from '@/utils/server/catalogueHubs';
import {
  DestinationIndex,
  ResolvedDestination,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { ScoredTarget, resolveItineraryTarget } from '@/utils/static/itinerarySearchHref';
import { buildDestinationHref, buildSearchLandingPath } from '@/utils/static/searchLandingPath';

/**
 * Itinerary → bookable boats. For a route's start base (port → sailing area
 * → country fallback, the same resolver as the itinerary CTA) this returns
 * up to 12 boats for the SSR card grid, the landing to "see all" (the base,
 * else its region, else its country — the nearest indexable one), and the
 * boat-type landings that pass the index gate there ("Best boat types for
 * this route").
 *
 * Every count is the `/public/yachts` total of the page it describes: the
 * heading counts the base's own listing, the "see all" link the landing it
 * opens (a region shows more boats than its base; the count endpoints do not
 * match the listing at all).
 */

const MAX_BOATS = 12;
const MIN_BOATS = 6;
const MAX_TYPES = 4;
// Boat types the curated corpus has pages for (others can never pass the gate).
const ROUTE_TYPES: VesselType[] = [
  VesselType.CATAMARAN,
  VesselType.SAILING_YACHT,
  VesselType.MOTOR_YACHT,
  VesselType.MOTORBOAT,
  VesselType.GULET,
  VesselType.POWER_CATAMARAN,
];

// Itinerary pages are ISR; the list is cached as long as the page.
const ITINERARY_BOATS_REVALIDATE_SECONDS = 3600;

export interface ItineraryBoats {
  /** Display name of the start base (catalogue name, localized for countries). */
  baseLabel: string;
  /** Boats the base's own listing shows. */
  fleet: number;
  boats: YachtModelShortInfo[];
  /** Where "see all" points (indexable base / region landing, else the base's
   *  filtered search), how many boats that page lists, and — when it is not
   *  the base itself — the area's label. */
  seeAll: { href: string; count: number; area: string | null };
  typeHubs: Hub[];
}

const kindOf = (did: string): LocationType => {
  if (did.startsWith('c-')) return LocationType.COUNTRY;

  return did.startsWith('r-') ? LocationType.REGION : LocationType.MARINA;
};

/** The catalogue place behind an itinerary target, by name when the name lands on it. */
const placeOfTarget = async (index: DestinationIndex, target: ScoredTarget): Promise<ResolvedDestination> => {
  const targetDids = target.id
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  const byName = await resolveDestinationName(index, target.name);

  // The catalogue name resolves to this very place (not a bigger namesake)
  // → use it (its landing URL filters to the same boats); else keep the did.
  return byName && targetDids.every(d => byName.dids.includes(d))
    ? byName
    : {
        dids: targetDids,
        name: target.name.trim(),
        count: target.count,
        kind: kindOf(targetDids[0] ?? ''),
        countryCode: locationForDid(index, targetDids[0] ?? '')?.countryCode,
      };
};

/** Nearest indexable landing for a place: itself, its region (a marina), its country. */
const nearestLanding = async (index: DestinationIndex, place: ResolvedDestination, locale: string) => {
  const base = await hubFor(index, place, null, locale);

  if (base?.href) return base;

  const region = await regionHubAbove(index, place, locale);

  if (region) return region;

  const country = await countryPlaceFor(index, place.countryCode);
  const countryHub = country && country.name !== place.name ? await hubFor(index, country, null, locale) : null;

  return countryHub?.href ? countryHub : null;
};

/**
 * "See the boats" CTA of an itinerary page (locale-less path for the
 * locale-aware Link): the nearest indexable landing above the route's start
 * base (base → region → country), trying the fallback names in turn when a
 * name has none ("Caribbean" → the area's country). Before 25.9.2026 it was
 * the base's own landing even when noindex (`/itineraries/split` →
 * `marina kaštela`) or its did form (`bvi-route` → `?did=l-436`). The did
 * form is the last resort when no name has an indexable landing.
 */
export const itinerarySearchPath = async (name: string, fallbacks: string[], locale: string): Promise<string> => {
  const index = await loadDestinationIndex().catch(() => null);
  const chain = [name, ...fallbacks].filter(Boolean);
  let first: ResolvedDestination | null = null;

  try {
    // Sequential on purpose: the first name with an indexable landing wins.
    // eslint-disable-next-line no-restricted-syntax
    for (const [i, candidate] of chain.entries()) {
      // eslint-disable-next-line no-await-in-loop
      const target = await resolveItineraryTarget(candidate, i === 0 ? chain.slice(1) : [], undefined, i > 0);

      if (index && target && target.count > 0) {
        // eslint-disable-next-line no-await-in-loop
        const place = await placeOfTarget(index, target);

        first = first ?? place;

        // eslint-disable-next-line no-await-in-loop
        const hub = await nearestLanding(index, place, locale);

        if (hub?.href) return buildSearchLandingPath(hub.name, null);
      }
    }
  } catch {
    // fall through to the did form / plain landing
  }

  return first ? buildDestinationHref(first.name, first.dids.join(',')) : buildSearchLandingPath(name);
};

export const itineraryBoats = async (
  startingPoint: string,
  fallbacks: string[],
  locale: string
): Promise<ItineraryBoats | null> => {
  const index = await loadDestinationIndex();
  const target = await resolveItineraryTarget(startingPoint, fallbacks, MIN_BOATS).catch(() => null);

  if (!index || !target || target.count < 1) return null;

  const resolved = await placeOfTarget(index, target);

  const [base, yachts, region] = await Promise.all([
    hubFor(index, resolved, null, locale),
    // Undated like the landings, so priced like them (audit B16): each boat's
    // cheapest bookable 7-night week (`priceBasis=week`). Without it the
    // cards mixed 3/4/5-day prices ("Preis für 3 Tage" on 7 of 12 cards).
    fetchYachts({ locations: [], did: resolved.dids, size: MAX_BOATS, priceBasis: 'week' }, Currency.EUR, 'en', {
      revalidate: ITINERARY_BOATS_REVALIDATE_SECONDS,
    }).catch((): PaginatedResponse<YachtModelShortInfo> => ({ content: [] })),
    regionHubAbove(index, resolved, locale),
  ]);

  if (!base) return null;

  const country = resolved.kind === LocationType.COUNTRY ? null : await countryPlaceFor(index, resolved.countryCode);

  // Per type, the most specific indexable landing: base → region → country.
  const levels = [resolved, region ? await resolveDestinationName(index, region.name) : null, country].filter(
    (r): r is ResolvedDestination => !!r
  );
  const typeHubs = (
    await Promise.all(
      ROUTE_TYPES.map(async type => {
        const hubs = await Promise.all(levels.map(level => hubFor(index, level, type, locale)));

        return hubs.find(h => !!h?.href) ?? null;
      })
    )
  )
    .filter((h): h is Hub => !!h)
    .sort((a, b) => b.fleet - a.fleet)
    .slice(0, MAX_TYPES);

  const listed = yachts.page?.totalElements ?? yachts.content?.length ?? 0;
  let seeAll: ItineraryBoats['seeAll'];

  if (base.href) seeAll = { href: base.href, count: listed, area: null };
  else if (region?.href) seeAll = { href: region.href, count: region.fleet, area: region.label };
  else {
    // No indexable base or region: the country landing (a promoted country
    // always is one), else the base's did form (noindex, but its boats).
    const countryHub = country ? await hubFor(index, country, null, locale) : null;

    seeAll = countryHub?.href
      ? { href: countryHub.href, count: countryHub.fleet, area: countryHub.label }
      : {
          href: `${localePrefix(locale)}${buildDestinationHref(resolved.name, resolved.dids.join(','))}`,
          count: listed,
          area: null,
        };
  }

  return {
    baseLabel: base.label,
    fleet: listed,
    boats: (yachts.content ?? []).slice(0, MAX_BOATS),
    seeAll,
    typeHubs,
  };
};
