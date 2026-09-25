import { cache } from 'react';

import { getTranslations } from 'next-intl/server';
import 'server-only';

import { routing } from '@/i18n/routing';
import { VESSEL_TYPE_LABEL_MAP, VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import {
  DestinationIndex,
  ResolvedDestination,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { evaluateLanding } from '@/utils/server/landingGate';
import { DESTINATION_KEY_BY_LABEL } from '@/utils/static/destinationLabelKey';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';

/**
 * Internal links from content pages (boat detail, blog, itineraries) UP to
 * the destination landing hubs. A hub is linked only when its landing passes
 * the index gate in the current locale (landingGate.ts — the same predicate
 * as the /search robots tag and the sitemaps), so these blocks never point
 * at a noindex URL; otherwise the caller shows the place as plain text or
 * leaves it out.
 */

export interface Hub {
  /** Catalogue name of the landing ("Split Region", "Croatia"). */
  name: string;
  /** Localized display name (12 countries + popular regions), else the catalogue name. */
  label: string;
  boatType: VesselType | null;
  /** Boats behind the landing (of the type, for a type hub). */
  fleet: number;
  /** Locale-prefixed landing path, or null when the landing is not indexable here. */
  href: string | null;
  kind: LocationType;
}

const REVALIDATE_SECONDS = 3600;

export const localePrefix = (locale: string): string => (locale === routing.defaultLocale ? '' : `/${locale}`);

/** Localized name for a catalogue place (the /search H1 uses the same map). */
export const placeLabel = async (locale: string, name: string): Promise<string> => {
  const key = DESTINATION_KEY_BY_LABEL[name.trim().toLowerCase()];

  if (!key) return name;

  const tHome = await getTranslations({ locale, namespace: 'home.destinationsSection.destinations' });

  try {
    return tHome(key as never);
  } catch {
    return name;
  }
};

/** Nominative plural of a boat type in `locale` ("Catamarans", "Katamarani"). */
export const boatTypePlural = async (locale: string, boatType: VesselType): Promise<string> => {
  const t = await getTranslations({ locale, namespace: 'common' });
  const key = `${VESSEL_TYPE_LABEL_MAP[boatType].replace(/^common\./, '')}Plural`;

  try {
    return t(key as never);
  } catch {
    return boatType;
  }
};

/** Gate + link for one resolved place (× boat type) in `locale`. */
export const hubFor = async (
  index: DestinationIndex,
  resolved: ResolvedDestination | null,
  boatType: VesselType | null,
  locale: string
): Promise<Hub | null> => {
  if (!resolved) return null;

  const gate = await evaluateLanding(resolved, boatType, index);

  return {
    name: resolved.name,
    label: await placeLabel(locale, resolved.name),
    boatType,
    fleet: gate.fleet,
    href: gate.indexableLocales.includes(locale)
      ? `${localePrefix(locale)}${buildSearchLandingPath(resolved.name, boatType)}`
      : null,
    kind: resolved.kind,
  };
};

/** Hub for a catalogue name (resolved with the /search resolver). */
export const hubForName = async (
  index: DestinationIndex,
  name: string,
  boatType: VesselType | null,
  locale: string
): Promise<Hub | null> => hubFor(index, await resolveDestinationName(index, name), boatType, locale);

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
};

/**
 * Regions of a country that contain a marina. The catalogue has no
 * marina → region field, so this reads the country's regions and each
 * region's marina list (the same lists the popular-destinations block
 * uses), all in the Data Cache for an hour and shared by every boat page of
 * that country. React `cache` dedupes within one render.
 */
export const regionsForMarina = cache(async (countryCode: string, marinaDid: string): Promise<string[]> => {
  const base = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const regions = await fetchJson<Array<{ id: string; realId?: number; name?: string }>>(
    `${base}/public/regions?countryCode=${encodeURIComponent(countryCode)}`
  );

  if (!regions?.length) return [];

  const hits = await Promise.all(
    regions.map(async region => {
      const realId = region.realId ?? Number(region.id.replace(/^r-/, ''));

      if (!region.name || !Number.isFinite(realId)) return null;

      const marinas = await fetchJson<Array<{ id: string }>>(
        `${base}/public/locations-count?regionId=${encodeURIComponent(String(realId))}`
      );

      return marinas?.some(m => m.id.split(',').includes(marinaDid)) ? region.name : null;
    })
  );

  return hits.filter((name): name is string => !!name);
});

export interface BoatHubs {
  country: Hub | null;
  /** Region of the boat's base (most specific indexable one), else the base itself. */
  area: Hub | null;
  /** Boat-type hub: area × type, else country × type (null when neither is indexable). */
  typeHub: Hub | null;
  /** Nominative plural of the boat's type, for the type crumb. */
  typeLabel: string | null;
}

/**
 * Hubs above one boat: Home › Country › Region (or base) › Type. Soft-fails
 * to nulls when the catalogue lists are unavailable.
 */
export const boatHubs = async (
  location: { id?: string; name?: string; countryCode?: string } | null | undefined,
  boatType: VesselType | null,
  locale: string
): Promise<BoatHubs> => {
  const empty: BoatHubs = { country: null, area: null, typeHub: null, typeLabel: null };
  const index = await loadDestinationIndex();
  const countryCode = location?.countryCode;

  if (!index || !countryCode) return empty;

  const countryRow = Array.from(index.byName.values())
    .flat()
    .find(l => l.kind === LocationType.COUNTRY && l.countryCode === countryCode);
  const marinaDid = location?.id?.trim() ?? '';

  const [country, regionNames, baseResolved] = await Promise.all([
    countryRow ? hubForName(index, countryRow.name, null, locale) : Promise.resolve(null),
    marinaDid ? regionsForMarina(countryCode, marinaDid) : Promise.resolve([] as string[]),
    (async () => {
      const row = marinaDid ? locationForDid(index, marinaDid) : null;
      const resolved = row ? await resolveDestinationName(index, row.name) : null;

      // Only when the name lands on this very base (not a namesake elsewhere).
      return resolved?.dids.includes(marinaDid) ? resolved : null;
    })(),
  ]);

  const regions = (await Promise.all(regionNames.map(name => hubForName(index, name, null, locale)))).filter(
    (h): h is Hub => !!h && h.kind !== LocationType.COUNTRY && h.name !== country?.name
  );

  // Most specific first: an indexable region with the smallest fleet, then
  // any region, then the base.
  regions.sort((a, b) => Number(!!b.href) - Number(!!a.href) || a.fleet - b.fleet);

  const base = baseResolved ? await hubFor(index, baseResolved, null, locale) : null;
  const area = regions[0] ?? base;

  if (!boatType) return { country, area, typeHub: null, typeLabel: null };

  const typeCandidates = [area, country].filter((h): h is Hub => !!h);
  const typeHubs = await Promise.all(typeCandidates.map(h => hubForName(index, h.name, boatType, locale)));
  const typeHub = typeHubs.find(h => !!h?.href) ?? null;

  return { country, area, typeHub, typeLabel: await boatTypePlural(locale, boatType) };
};
