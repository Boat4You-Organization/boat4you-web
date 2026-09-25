import 'server-only';

import { Currency } from '@/models/user.model';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { LocationType } from '@/types/location.type';
import { Hub, hubFor, localePrefix, regionsForMarina } from '@/utils/server/catalogueHubs';
import {
  ResolvedDestination,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { resolveItineraryTarget } from '@/utils/static/itinerarySearchHref';
import { buildDestinationHref } from '@/utils/static/searchLandingPath';

/**
 * Itinerary → bookable boats. For a route's start base (port → sailing area
 * → country fallback, the same resolver as the itinerary CTA) this returns
 * up to 12 boats for the SSR card grid, the landing to "see all" (the base,
 * else its region, when indexable), and the boat-type landings that pass the
 * index gate there ("Best boat types for this route").
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
export const ITINERARY_BOATS_REVALIDATE_SECONDS = 3600;

export interface ItineraryBoats {
  /** Display name of the start base (catalogue name, localized for countries). */
  baseLabel: string;
  fleet: number;
  boats: YachtModelShortInfo[];
  /** Where "see all" points (indexable base / region landing, else the base's filtered search). */
  seeAllHref: string;
  typeHubs: Hub[];
}

const kindOf = (did: string): LocationType => {
  if (did.startsWith('c-')) return LocationType.COUNTRY;

  return did.startsWith('r-') ? LocationType.REGION : LocationType.MARINA;
};

export const itineraryBoats = async (
  startingPoint: string,
  fallbacks: string[],
  locale: string
): Promise<ItineraryBoats | null> => {
  const index = await loadDestinationIndex();
  const target = await resolveItineraryTarget(startingPoint, fallbacks, MIN_BOATS).catch(() => null);

  if (!index || !target || target.count < 1) return null;

  const targetDids = target.id
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  const byName = await resolveDestinationName(index, target.name);
  // The catalogue name resolves to this very place (not a bigger namesake)
  // → use it (its landing URL filters to the same boats); else keep the did.
  const resolved: ResolvedDestination =
    byName && targetDids.every(d => byName.dids.includes(d))
      ? byName
      : {
          dids: targetDids,
          name: target.name.trim(),
          count: target.count,
          kind: kindOf(targetDids[0] ?? ''),
          countryCode: locationForDid(index, targetDids[0] ?? '')?.countryCode,
        };

  const [base, yachts, regionNames] = await Promise.all([
    hubFor(index, resolved, null, locale),
    fetchYachts({ locations: [], did: resolved.dids, size: MAX_BOATS }, Currency.EUR, 'en', {
      revalidate: ITINERARY_BOATS_REVALIDATE_SECONDS,
    }).catch(() => ({ content: [] as YachtModelShortInfo[] })),
    resolved.kind === LocationType.MARINA && resolved.countryCode
      ? regionsForMarina(resolved.countryCode, resolved.dids[0])
      : Promise.resolve([] as string[]),
  ]);

  if (!base) return null;

  const regions = (
    await Promise.all(
      regionNames.map(async name => hubFor(index, await resolveDestinationName(index, name), null, locale))
    )
  )
    .filter((h): h is Hub => !!h?.href && h.kind !== LocationType.COUNTRY)
    .sort((a, b) => a.fleet - b.fleet);
  const region = regions[0] ?? null;
  const countryRow = resolved.countryCode
    ? Array.from(index.byName.values())
        .flat()
        .find(l => l.kind === LocationType.COUNTRY && l.countryCode === resolved.countryCode)
    : null;
  const country = countryRow ? await resolveDestinationName(index, countryRow.name) : null;

  // Per type, the most specific indexable landing: base → region → country.
  const levels = [
    resolved,
    region ? await resolveDestinationName(index, region.name) : null,
    resolved.kind === LocationType.COUNTRY ? null : country,
  ].filter((r): r is ResolvedDestination => !!r);
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

  return {
    baseLabel: base.label,
    fleet: resolved.count,
    boats: (yachts.content ?? []).slice(0, MAX_BOATS),
    seeAllHref:
      base.href ??
      region?.href ??
      `${localePrefix(locale)}${buildDestinationHref(resolved.name, resolved.dids.join(','))}`,
    typeHubs,
  };
};
