import 'server-only';

import { isPromotedCountry } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { hasCuratedSeoFile } from '@/utils/server/curatedSeoContent';
import { ResolvedDestination, fleetCountForDid } from '@/utils/server/destinationDid';
import { isLandingExpressible } from '@/utils/static/searchLandingPath';

/**
 * ONE index predicate for the destination landing pages, shared by the
 * /search generateMetadata (robots + hreflang) and the location / category
 * sitemaps, so the sitemaps submit exactly the URLs the page lets Google
 * index (before, ~96% of sitemap-locations answered noindex).
 *
 * Owner rule (Mario, 25.9.2026):
 *   - a promoted-country landing (the 12 of promoted-countries.config, no
 *     boat type) is indexable in every locale as long as it has boats;
 *   - every other generated page — region, base / marina, destination ×
 *     boat type, and the /yachts model pages — needs at least
 *     MIN_LANDING_FLEET active boats AND unique content.
 *
 * For any other `/search?destinations=<name>[&boatTypes=<TYPE>]` landing:
 *   - the name resolves to a catalogue place whose name can carry the URL
 *     (no comma), and the URL spelling is that canonical name;
 *   - the fleet behind it is at least MIN_LANDING_FLEET — for a boat-type
 *     landing the fleet OF THAT TYPE (a 3-catamaran page is a thin list,
 *     not a landing);
 *   - the curated corpus has a page for it in that locale — for a boat-type
 *     landing a boat-type page, not the destination overview it falls back
 *     to for display (that would duplicate the destination landing).
 */
/** The one fleet threshold for generated pages (landings and /yachts model pages). */
export const MIN_LANDING_FLEET = 10;

export interface LandingGate {
  /** Fleet behind the landing (of the boat type, when there is one). */
  fleet: number;
  /** Locales whose landing passes the gate (empty → noindex everywhere). */
  indexableLocales: string[];
}

const NOT_INDEXABLE: LandingGate = { fleet: 0, indexableLocales: [] };

export const evaluateLanding = async (
  resolved: ResolvedDestination | null,
  boatType: VesselType | null
): Promise<LandingGate> => {
  if (!resolved || !isLandingExpressible(resolved.name)) return NOT_INDEXABLE;

  const fleet = boatType ? await fleetCountForDid(resolved.dids.join(','), boatType) : resolved.count;

  if (!boatType && resolved.kind === LocationType.COUNTRY && isPromotedCountry(resolved.countryCode)) {
    return { fleet, indexableLocales: fleet > 0 ? [...routing.locales] : [] };
  }

  if (fleet < MIN_LANDING_FLEET) return { fleet, indexableLocales: [] };

  const hasText = await Promise.all(
    routing.locales.map(locale => hasCuratedSeoFile(locale, resolved.name, boatType, { typeSpecificOnly: !!boatType }))
  );

  return { fleet, indexableLocales: routing.locales.filter((_, i) => hasText[i]) };
};

/**
 * Map with at most `limit` promises in flight — the sitemaps evaluate a few
 * hundred landings, and cusma2 (the only API node) should not get them all at
 * once on a cold Data Cache.
 */
export const mapWithLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next;

      next += 1;
      // Sequential per worker by design (bounded concurrency).
      // eslint-disable-next-line no-await-in-loop
      results[i] = await fn(items[i]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));

  return results;
};
