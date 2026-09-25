import 'server-only';

import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import {
  DestinationIndex,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { evaluateLanding } from '@/utils/server/landingGate';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';

/**
 * Internal links from generated blocks (model pages, the charter facts
 * block) to destination landings — ONLY to landings the index gate lets
 * Google index in this locale (landingGate.ts), in the one canonical URL
 * form. A place whose landing is noindex gets no link (plain text): a link
 * to a thin or noindexed page is what release A removed.
 */

/** Canonical landing path of a place, or null when it is not an indexable landing in `locale`. */
const gatedPath = async (
  index: DestinationIndex,
  name: string,
  did: string,
  locale: string,
  boatType: VesselType | null
): Promise<string | null> => {
  const hit = await resolveDestinationName(index, name);

  // The name must resolve back to (a superset of) this place — otherwise
  // `?destinations=<name>` would show another place's boats.
  if (!hit || !hit.dids.includes(did)) return null;

  const gate = await evaluateLanding(hit, boatType);

  return gate.indexableLocales.includes(locale) ? buildSearchLandingPath(hit.name, boatType) : null;
};

/** Landing of one catalogue place (by did), or null. */
export const gatedLandingPath = async (
  did: string,
  fallbackName: string,
  locale: string,
  boatType: VesselType | null = null
): Promise<string | null> => {
  try {
    const index = await loadDestinationIndex();

    if (!index) return null;

    const location = locationForDid(index, did);

    return await gatedPath(index, location?.name?.trim() || fallbackName, did, locale, boatType);
  } catch {
    return null;
  }
};

/** Country landing by ISO code (the promoted countries are always indexable), or null. */
export const countryLandingPath = async (
  countryCode: string,
  locale: string,
  boatType: VesselType | null = null
): Promise<string | null> => {
  try {
    const index = await loadDestinationIndex();

    if (!index) return null;

    const country = Array.from(index.byDid.values()).find(
      l => l.kind === LocationType.COUNTRY && l.countryCode === countryCode
    );

    return country ? await gatedPath(index, country.name.trim(), country.id, locale, boatType) : null;
  } catch {
    return null;
  }
};
