import { cache } from 'react';

import { getTranslations } from 'next-intl/server';
import 'server-only';

import type { PopularDestination } from '@/actions/locations.actions';
import { itineraries } from '@/config/itineraries.config';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import {
  Hub,
  boatTypePlural,
  countryPlaceFor,
  hubFor,
  localePrefix,
  placeLabel,
  regionHubAbove,
  regionsForMarina,
} from '@/utils/server/catalogueHubs';
import {
  DestinationIndex,
  ResolvedDestination,
  fleetCountForDid,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { itineraryAreaName } from '@/utils/server/itineraryPlaceNames';
import { landingHeading } from '@/utils/server/landingCopy';
import { evaluateLanding } from '@/utils/server/landingGate';
import { LandingEntry, landingManifestWithin } from '@/utils/server/landingManifest';
import { CatalogModel, modelCatalogWithin } from '@/utils/server/modelCatalog';
import { placeText } from '@/utils/server/placeText';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';
import { modelIdentity } from '@/utils/static/yachtModelKey';

/**
 * Link blocks of a destination landing (`/search?destinations=x[&boatTypes=Y]`),
 * all pointing at pages Google may index, in their one canonical URL:
 *
 *   - breadcrumb Home › Country › Region › Place [› Type] — each crumb is an
 *     indexable landing (landingGate); shared by the visible trail and the
 *     BreadcrumbList JSON-LD, so both name the same pages;
 *   - "popular destinations" — landings of the corpus manifest (the list the
 *     location / category sitemaps are built from) that lie inside this
 *     place, of the same boat type (an overview with too few adds its
 *     bases' boat-type landings); a place with fewer than MIN_POPULAR_LINKS
 *     of them shows the other landings of its country;
 *   - "boat types in {place}" — this place's indexable × type landings;
 *   - "popular models" — /yachts model pages with boats here (live facet
 *     counts of this landing), led by a model the listed cards pile up on;
 *   - "sailing itineraries" — /itineraries areas that start in this place.
 *
 * Before 25.9.2026 the popular block listed the catalogue's regions and
 * biggest marinas of the country or region by raw name: 31 of 65 links on
 * ten landings were in no sitemap (Split Region: 10 of 10 noindex).
 */

const POPULAR_LIMIT = 10;
/** The block renders only from this many links (SeoTextSection). */
const MIN_POPULAR_LINKS = 4;
const POPULAR_TEMPLATE_COUNT = 8;
const MODEL_LIMIT = 6;
const MIN_MODEL_BOATS_HERE = 3;
/** A card model this common in the listed page links its model page first. */
const DOMINANT_CARD_SHARE = 1 / 3;
const MANIFEST_BUDGET_MS = 2000;
const MODELS_BUDGET_MS = 1500;
const DISTRIBUTION_REVALIDATE_SECONDS = 21600;
const REGION_REVALIDATE_SECONDS = 3600;

export interface LandingCrumb {
  label: string;
  /** Locale-less canonical landing path (`/` for Home). */
  path: string;
}

export interface LandingLink {
  href: string;
  label: string;
}

export interface LandingNav {
  /** Area the popular-destinations links cover, as its localized phrase
   *  ("in Croatia", "na Kornatima": placeText.ts `where`), and the links. */
  popular: { where: string; links: PopularDestination[] };
  /** This place as its localized phrase (placeText.ts `where`) for the row headings. */
  placeWhere: string;
  types: LandingLink[];
  models: LandingLink[];
  itineraries: LandingLink[];
}

const apiBase = () => process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

/** Cheap hash → stable phrase template per destination (same text on every crawl). */
const stableTemplateIdx = (s: string): number => {
  let h = 0;

  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;

  return Math.abs(h) % POPULAR_TEMPLATE_COUNT;
};

const withinBudget = async <T>(promise: Promise<T>, budgetMs: number): Promise<T | null> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>(resolve => {
    timer = setTimeout(() => resolve(null), budgetMs);
  });

  try {
    return await Promise.race([promise.catch(() => null), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const fetchJson = async <T>(url: string, revalidate: number): Promise<T | null> => {
  try {
    const response = await fetch(url, { next: { revalidate } });

    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
};

/** Marinas (single dids) of the regions among `dids` — the catalogue has no marina → region field. */
const marinasInRegions = async (dids: string[]): Promise<Set<string>> => {
  const lists = await Promise.all(
    dids
      .filter(d => d.startsWith('r-'))
      .map(d =>
        fetchJson<Array<{ id: string }>>(
          `${apiBase()}/public/locations-count?regionId=${encodeURIComponent(d.slice(2))}`,
          REGION_REVALIDATE_SECONDS
        )
      )
  );

  return new Set(lists.flatMap(list => (list ?? []).flatMap(m => m.id.split(',').map(id => id.trim()))));
};

const hubPath = (hub: Hub): string => buildSearchLandingPath(hub.name, hub.boatType);

/**
 * The catalogue place a search by `did` stands for (a destination picked in
 * the search dropdown carries its own did), when the dids are exactly one
 * place's — so those searches get the same link blocks as its landing.
 */
export const placeForDids = async (dids: string[]): Promise<ResolvedDestination | null> => {
  const index = dids.length ? await loadDestinationIndex() : null;
  const row = index ? locationForDid(index, dids[0]) : null;
  const place = index && row ? await resolveDestinationName(index, row.name) : null;

  return place && dids.every(d => place.dids.includes(d.trim())) ? place : null;
};

/**
 * Breadcrumb of a landing: Home › Country › Region › Place [› Type]. Only
 * indexable landings are crumbs; the last one is the page itself (its
 * canonical path). React `cache` shares it between the page's JSON-LD and
 * the visible trail within one request.
 */
export const landingCrumbs = cache(
  async (name: string, boatType: VesselType | null, locale: string): Promise<LandingCrumb[]> => {
    const index = await loadDestinationIndex();
    const place = index ? await resolveDestinationName(index, name) : null;

    if (!index || !place) return [];

    const t = await getTranslations({ locale, namespace: 'catalogueLinks' });
    const country = place.kind === LocationType.COUNTRY ? null : await countryPlaceFor(index, place.countryCode);
    const [countryHub, regionHub, placeHub] = await Promise.all([
      country && country.name !== place.name ? hubFor(index, country, null, locale) : Promise.resolve(null),
      regionHubAbove(index, place, locale),
      hubFor(index, place, null, locale),
    ]);
    const crumbs: LandingCrumb[] = [{ label: t('breadcrumb.home'), path: '/' }];

    [countryHub, regionHub].forEach(hub => {
      if (hub?.href) crumbs.push({ label: hub.label, path: hubPath(hub) });
    });

    const placeCrumb = { label: placeHub?.label ?? place.name, path: buildSearchLandingPath(place.name) };

    if (!boatType) return [...crumbs, placeCrumb];

    // Type landing: the place overview is a crumb when it is indexable, the
    // type page is the last crumb.
    if (placeHub?.href) crumbs.push(placeCrumb);

    crumbs.push({ label: await boatTypePlural(locale, boatType), path: buildSearchLandingPath(place.name, boatType) });

    return crumbs;
  }
);

/** Whether the manifest entry `entry` lies inside `parent` (not the same landing). */
const liesInside = async (
  entry: LandingEntry,
  parent: ResolvedDestination,
  regionMarinas: Set<string>
): Promise<boolean> => {
  if (entry.name === parent.name) return false;

  if (parent.kind === LocationType.COUNTRY) {
    if (entry.kind === LocationType.COUNTRY || !parent.countryCode) return false;

    if (entry.countryCode) return entry.countryCode === parent.countryCode;

    // A region the catalogue lists without a country ("Dubrovnik /
    // Montenegro"): inside when it has boats in this country (cached count).
    return (await fleetCountForDid(entry.dids.join(','), null, parent.countryCode)) > 0;
  }

  if (parent.kind === LocationType.REGION) {
    return entry.kind === LocationType.MARINA && entry.dids.every(d => regionMarinas.has(d));
  }

  return false;
};

const popularFor = async (
  pools: { destinations: LandingEntry[]; typed: LandingEntry[] },
  place: ResolvedDestination,
  country: ResolvedDestination | null,
  boatType: VesselType | null,
  locale: string
): Promise<LandingNav['popular']> => {
  const regionMarinas = place.kind === LocationType.REGION ? await marinasInRegions(place.dids) : new Set<string>();
  const inside = async (pool: LandingEntry[], parent: ResolvedDestination, marinas: Set<string>) => {
    const flags = await Promise.all(pool.map(entry => liesInside(entry, parent, marinas)));

    return pool.filter((entry, i) => flags[i] && entry.name !== place.name);
  };
  const samePool = boatType ? pools.typed.filter(e => e.boatType === boatType) : pools.destinations;

  let area = place;
  let entries = await inside(samePool, place, regionMarinas);

  // A place overview whose bases have no overview landing of their own
  // (Split Region: every marina is noindex) links their boat-type landings
  // (ACI Marina Split × catamarans, …) instead.
  if (!boatType && entries.length < MIN_POPULAR_LINKS && place.kind !== LocationType.MARINA) {
    entries = [...entries, ...(await inside(pools.typed, place, regionMarinas))];
  }

  // Still too few: the landings of its country (the page itself left out).
  if (entries.length < MIN_POPULAR_LINKS && country && country.name !== place.name) {
    area = country;
    entries = await inside(samePool, country, new Set());
  }

  const top = entries.sort((a, b) => b.fleet - a.fleet || a.name.localeCompare(b.name)).slice(0, POPULAR_LIMIT);

  const links = await Promise.all(
    top.map(async (entry): Promise<PopularDestination> => ({
      name: await placeLabel(locale, entry.name),
      href: buildSearchLandingPath(entry.name, entry.boatType),
      templateIdx: stableTemplateIdx(entry.name),
      // A type landing is linked by its own H1 ("Catamaran charter in the
      // Split Region" — landingCopy.ts), not by a yacht-charter phrase.
      ...(entry.boatType ? { label: await landingHeading(locale, entry.name, entry.boatType) } : {}),
    }))
  );

  return { where: (await placeText(locale, area.name)).where, links };
};

interface Distribution {
  byModel?: Record<string, number>;
}

/** Model pages with boats in this landing, biggest first; a model the listed cards pile up on leads. */
const modelsFor = async (
  place: ResolvedDestination,
  boatType: VesselType | null,
  cardsPromise: Promise<YachtModelShortInfo[]>,
  locale: string
): Promise<LandingLink[]> => {
  const did = [...place.dids].sort().join(',');
  const typeQuery = boatType ? `&boatTypes=${encodeURIComponent(boatType)}` : '';
  const [catalog, distribution] = await Promise.all([
    modelCatalogWithin(MODELS_BUDGET_MS),
    withinBudget(
      fetchJson<Distribution>(
        `${apiBase()}/public/yachts/distribution?did=${encodeURIComponent(did)}${typeQuery}`,
        DISTRIBUTION_REVALIDATE_SECONDS
      ),
      MODELS_BUDGET_MS
    ),
  ]);

  if (!catalog?.models.length || !distribution?.byModel) return [];

  const cards = await cardsPromise.catch((): YachtModelShortInfo[] => []);
  const { byModel } = distribution;
  // Boats of each model page here: the facet counts of this very landing
  // (did + boat type), summed over the catalogue rows folded into the model.
  const here = catalog.models
    .map(model => ({ model, count: model.modelIds.reduce((sum, id) => sum + (byModel[String(id)] ?? 0), 0) }))
    .filter(m => m.count >= MIN_MODEL_BOATS_HERE)
    .sort((a, b) => b.count - a.count);

  // The listed cards carry only the model name: fold it with each model's
  // brand (the same identity rules as the model pages).
  const cardCounts = new Map<CatalogModel, number>();

  cards.forEach(card => {
    const hit = catalog.models.find(m => modelIdentity(m.brand, card.modelName)?.key === m.key);

    if (hit) cardCounts.set(hit, (cardCounts.get(hit) ?? 0) + 1);
  });

  const [dominant] = Array.from(cardCounts.entries()).sort((a, b) => b[1] - a[1]);

  if (dominant && cards.length && dominant[1] / cards.length >= DOMINANT_CARD_SHARE) {
    const i = here.findIndex(m => m.model === dominant[0]);

    if (i > 0) here.unshift(...here.splice(i, 1));
  }

  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });

  return here.slice(0, MODEL_LIMIT).map(({ model, count }) => ({
    href: `${localePrefix(locale)}${model.path}`,
    label: t('landing.countedLink', { name: model.displayName, count }),
  }));
};

/** Itinerary areas that start in this place (by the area's catalogue place). */
const itinerariesFor = async (
  index: DestinationIndex,
  place: ResolvedDestination,
  locale: string
): Promise<LandingLink[]> => {
  const areas = itineraries.flatMap(group => group.itinerary.map(area => ({ area, country: group.country })));
  const regionNames =
    place.kind === LocationType.MARINA && place.countryCode
      ? await regionsForMarina(place.countryCode, place.dids[0])
      : [];
  const regionLandings = new Set(
    (await Promise.all(regionNames.map(name => resolveDestinationName(index, name)))).map(r => r?.name)
  );

  const matches = await Promise.all(
    areas.map(async ({ area, country }) => {
      const [resolvedArea, resolvedCountry] = await Promise.all([
        resolveDestinationName(index, area.sailingArea),
        resolveDestinationName(index, country),
      ]);

      if (resolvedArea?.name === place.name) return true;

      if (place.kind === LocationType.COUNTRY) {
        return (
          resolvedCountry?.name === place.name ||
          (!!resolvedArea?.countryCode && resolvedArea.countryCode === place.countryCode)
        );
      }

      return !!resolvedArea && regionLandings.has(resolvedArea.name);
    })
  );

  // The area's name in this locale, as the itinerary page heads it (audit B16).
  return Promise.all(
    areas
      .filter((_, i) => matches[i])
      .map(async ({ area }) => ({
        href: `${localePrefix(locale)}/itineraries/${area.id}`,
        label: await itineraryAreaName(locale, area),
      }))
  );
};

/**
 * All link blocks of one landing. null when the place does not resolve or
 * the manifest is not built yet (cold process — the page then renders
 * without them rather than wait).
 */
export const landingNav = async (
  name: string,
  boatType: VesselType | null,
  locale: string,
  /** The listed cards (the page's own yacht fetch). */
  cards: Promise<YachtModelShortInfo[]>
): Promise<LandingNav | null> => {
  const index = await loadDestinationIndex();
  const place = index ? await resolveDestinationName(index, name) : null;

  if (!index || !place) return null;

  const manifest = await landingManifestWithin(index, MANIFEST_BUDGET_MS);

  if (!manifest) return null;

  const indexable = (entry: LandingEntry) => entry.locales.includes(locale);
  const pools = { destinations: manifest.destinations.filter(indexable), typed: manifest.typed.filter(indexable) };
  const country = place.kind === LocationType.COUNTRY ? place : await countryPlaceFor(index, place.countryCode);
  const gate = await evaluateLanding(place, boatType, index);
  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });

  const [popular, typeEntries, models, itineraryLinks, { where: placeWhere }] = await Promise.all([
    popularFor(pools, place, country, boatType, locale),
    Promise.all(
      manifest.typed
        .filter(e => e.name === place.name && e.boatType && e.boatType !== boatType && indexable(e))
        .sort((a, b) => b.fleet - a.fleet)
        .map(async e => ({
          href: `${localePrefix(locale)}${buildSearchLandingPath(e.name, e.boatType)}`,
          label: t('landing.countedLink', { name: await boatTypePlural(locale, e.boatType!), count: e.fleet }),
        }))
    ),
    // The facet query runs for indexable landings only (bounded Data Cache keys).
    gate.indexableLocales.includes(locale) ? modelsFor(place, boatType, cards, locale) : Promise.resolve([]),
    itinerariesFor(index, place, locale),
    placeText(locale, place.name),
  ]);

  return { popular, placeWhere, types: typeEntries, models, itineraries: itineraryLinks };
};
