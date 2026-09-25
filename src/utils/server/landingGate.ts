import 'server-only';

import { routing } from '@/i18n/routing';
import { VesselType } from '@/models/yacht.model';
import { hasCuratedSeoFile } from '@/utils/server/curatedSeoContent';
import { ResolvedDestination, fleetCountForDid } from '@/utils/server/destinationDid';
import { isLandingExpressible } from '@/utils/static/searchLandingPath';

/**
 * ONE index predicate for the destination landing pages, shared by the
 * /search generateMetadata (robots + hreflang) and the location / category
 * sitemaps, so the sitemaps submit exactly the URLs the page lets Google
 * index (before, ~96% of sitemap-locations answered noindex).
 *
 * A landing `/search?destinations=<name>[&boatTypes=<TYPE>]` is indexable in
 * a locale when:
 *   - the name resolves to a catalogue place whose name can carry the URL
 *     (no comma), and the URL spelling is that canonical name;
 *   - the fleet behind it is at least MIN_LANDING_FLEET — for a boat-type
 *     landing the fleet OF THAT TYPE (a 0-catamaran page is "No exact
 *     matches", not a landing);
 *   - the curated corpus has a page for it in that locale — for a boat-type
 *     landing a boat-type page, not the destination overview it falls back
 *     to for display (that would duplicate the destination landing).
 */
export const MIN_LANDING_FLEET = 1;

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
