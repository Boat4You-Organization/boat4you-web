import { cache } from 'react';

import 'server-only';

import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { getBlogs } from '@/lib/api';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { MIN_LANDING_FLEET, mapWithLimit } from '@/utils/server/landingGate';
import {
  ModelIdentity,
  cleanModelName,
  foldName,
  modelDisplayName,
  modelIdentity,
  modelPagePath,
} from '@/utils/static/yachtModelKey';

/**
 * Which yacht models get a /yachts/{brand}/{model} page, and the fleet
 * behind each one.
 *
 * Ranking source: `/public/yachts/distribution` over the 12 promoted
 * countries (`byModel`: catalogue model id → active boats, the same boats
 * /search lists). It is the one catalogue-wide aggregate the API offers,
 * and a heavy one (~14 s cold), so it is read through the Data Cache once a
 * day. Model names come from `/public/catalogue/models` per manufacturer
 * (cached a day too); MMK / NauSys spellings of one model are folded with
 * yachtModelKey.ts before ranking, so a model split over two catalogue rows
 * counts once.
 *
 * A model gets a page when it is among the MODEL_PAGE_LIMIT biggest AND has
 * at least MIN_LANDING_FLEET active boats (owner rule 25.9.2026, the same
 * constant as the landing gate). The page re-checks the live fleet count.
 */

export const MODEL_PAGE_LIMIT = 30;

const CATALOG_REVALIDATE_SECONDS = 86400;
const COUNTS_REVALIDATE_SECONDS = 3600;

export const MODEL_FLEET_REVALIDATE_SECONDS = 43200;

const FLEET_PAGE_SIZE = 100;
/** Hard stop for one model's fleet walk (the biggest model has ~450 boats). */
const MAX_FLEET_PAGES = 10;
/** Boats whose detail is read for berths / heads (not in the list payload). */
const DETAIL_SAMPLE_SIZE = 6;

const apiBase = () => process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

const PROMOTED_CODES = Array.from(PROMOTED_COUNTRY_CODES).sort();

const fetchJson = async <T>(url: string, revalidate: number): Promise<T> => {
  const response = await fetch(url, {
    next: { revalidate },
    headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`${url.replace(/\?.*$/, '')} → ${response.status}`);

  return (await response.json()) as T;
};

export interface CatalogModel extends ModelIdentity {
  displayName: string;
  /** Catalogue model ids folded into this model (`mid` filter). */
  modelIds: number[];
  /** Active boats in the promoted countries (distribution count). */
  fleet: number;
  path: string;
}

export interface CatalogBrand {
  brand: string;
  brandSlug: string;
  /** Model pages of this brand, biggest first. */
  models: CatalogModel[];
  /** A brand hub exists only with at least two model pages (else it would
   *  repeat its one model page). */
  hasHub: boolean;
}

export interface ModelCatalog {
  models: CatalogModel[];
  brands: CatalogBrand[];
}

interface Distribution {
  byManufacturer?: Record<string, number>;
  byModel?: Record<string, number>;
}

interface CountryCountRow {
  id: string;
  countryCode?: string;
}

interface Paged<T> {
  content?: T[];
}

const buildCatalog = async (): Promise<ModelCatalog> => {
  const countries = await fetchJson<CountryCountRow[]>(
    `${apiBase()}/public/countries-count`,
    COUNTS_REVALIDATE_SECONDS
  );
  const promotedDids = (Array.isArray(countries) ? countries : [])
    .filter(c => c.countryCode && PROMOTED_COUNTRY_CODES.has(c.countryCode) && c.id?.startsWith('c-'))
    .map(c => c.id)
    .sort();

  if (!promotedDids.length) throw new Error('No promoted countries in /public/countries-count');

  const [distribution, manufacturers] = await Promise.all([
    fetchJson<Distribution>(
      `${apiBase()}/public/yachts/distribution?did=${encodeURIComponent(promotedDids.join(','))}`,
      CATALOG_REVALIDATE_SECONDS
    ),
    fetchJson<Paged<{ id: number; name?: string }>>(
      `${apiBase()}/public/catalogue/manufacturers?size=3000`,
      CATALOG_REVALIDATE_SECONDS
    ),
  ]);

  const byManufacturer = distribution.byManufacturer ?? {};
  const byModel = distribution.byModel ?? {};

  // Brand totals first: a brand listed under two manufacturer rows ("Lagoon"
  // + "Lagoon-Bénéteau") can pass the threshold only together.
  const rows = (manufacturers.content ?? [])
    .map(m => ({ id: m.id, name: m.name ?? '', boats: byManufacturer[String(m.id)] ?? 0 }))
    .filter(m => m.boats > 0);
  const brandTotals = new Map<string, number>();

  rows.forEach(row => {
    const identity = modelIdentity(row.name, 'x');

    if (identity) brandTotals.set(identity.brandSlug, (brandTotals.get(identity.brandSlug) ?? 0) + row.boats);
  });

  const candidates = rows.filter(row => {
    const identity = modelIdentity(row.name, 'x');

    return !!identity && (brandTotals.get(identity.brandSlug) ?? 0) >= MIN_LANDING_FLEET;
  });

  const modelLists = await mapWithLimit(candidates, 6, async row => {
    const page = await fetchJson<Paged<{ id: number; name?: string }>>(
      `${apiBase()}/public/catalogue/models?manufacturerIds=${row.id}&size=2000`,
      CATALOG_REVALIDATE_SECONDS
    );

    return { row, models: page.content ?? [] };
  });

  interface Group {
    identity: ModelIdentity;
    modelIds: number[];
    fleet: number;
    spellings: Map<string, number>;
  }

  const groups = new Map<string, Group>();

  modelLists.forEach(({ row, models }) => {
    models.forEach(model => {
      const boats = byModel[String(model.id)] ?? 0;
      const identity = boats > 0 && model.name ? modelIdentity(row.name, model.name) : null;

      if (!identity || !model.name) return;

      const group: Group = groups.get(identity.key) ?? { identity, modelIds: [], fleet: 0, spellings: new Map() };
      const spelling = cleanModelName(model.name);

      group.modelIds.push(model.id);
      group.fleet += boats;
      group.spellings.set(spelling, (group.spellings.get(spelling) ?? 0) + boats);
      groups.set(identity.key, group);
    });
  });

  const seenSlugs = new Set<string>();
  const models: CatalogModel[] = Array.from(groups.values())
    .filter(g => g.fleet >= MIN_LANDING_FLEET)
    .sort((a, b) => b.fleet - a.fleet || a.identity.key.localeCompare(b.identity.key))
    .filter(g => {
      const slug = `${g.identity.brandSlug}/${g.identity.modelSlug}`;

      if (seenSlugs.has(slug)) return false;

      seenSlugs.add(slug);

      return true;
    })
    .slice(0, MODEL_PAGE_LIMIT)
    .map(g => {
      // Most common provider spelling (ties: alphabetical) for the H1.
      const [spelling] = Array.from(g.spellings.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];

      return {
        ...g.identity,
        displayName: modelDisplayName(g.identity.brand, spelling),
        modelIds: g.modelIds.sort((a, b) => a - b),
        fleet: g.fleet,
        path: modelPagePath(g.identity.brandSlug, g.identity.modelSlug),
      };
    });

  const brandMap = new Map<string, CatalogBrand>();

  models.forEach(model => {
    const brand = brandMap.get(model.brandSlug) ?? {
      brand: model.brand,
      brandSlug: model.brandSlug,
      models: [],
      hasHub: false,
    };

    brand.models.push(model);
    brand.hasHub = brand.models.length >= 2;
    brandMap.set(model.brandSlug, brand);
  });

  const brands = Array.from(brandMap.values()).sort(
    (a, b) =>
      b.models.reduce((s, m) => s + m.fleet, 0) - a.models.reduce((s, m) => s + m.fleet, 0) ||
      a.brand.localeCompare(b.brand)
  );

  return { models, brands };
};

/**
 * Process-level memo: the boat page asks for the catalogue on every view
 * (12K boats × 9 locales), and rebuilding it — even from the Data Cache —
 * is ~50 cache reads. Rebuilt at most every MEMO_TTL_MS; concurrent callers
 * share one build; a failed rebuild keeps serving the previous catalogue.
 */
const MEMO_TTL_MS = 30 * 60 * 1000;
let memo: { catalog: ModelCatalog; builtAt: number } | null = null;
let building: Promise<ModelCatalog> | null = null;

const memoisedCatalog = async (): Promise<ModelCatalog> => {
  if (memo && Date.now() - memo.builtAt < MEMO_TTL_MS) return memo.catalog;

  if (!building) {
    building = buildCatalog()
      .then(catalog => {
        memo = { catalog, builtAt: Date.now() };

        return catalog;
      })
      .finally(() => {
        building = null;
      });
  }

  try {
    return await building;
  } catch (error) {
    if (memo) return memo.catalog;

    throw error;
  }
};

/**
 * The model catalogue (throws when the API cannot build it and nothing was
 * built before — callers that must not fail, like the boat page link, use
 * findModelForYacht). React `cache` dedupes metadata + page within a request.
 */
export const loadModelCatalog = cache(memoisedCatalog);

export const findCatalogModel = (catalog: ModelCatalog, brandSlug: string, modelSlug: string): CatalogModel | null =>
  catalog.models.find(m => m.brandSlug === brandSlug && m.modelSlug === modelSlug) ?? null;

export const findCatalogBrand = (catalog: ModelCatalog, brandSlug: string): CatalogBrand | null =>
  catalog.brands.find(b => b.brandSlug === brandSlug) ?? null;

export const findModelByIdentity = (
  catalog: ModelCatalog,
  rawManufacturer?: string | null,
  rawModel?: string | null
): CatalogModel | null => {
  const identity = modelIdentity(rawManufacturer, rawModel);

  return identity ? (catalog.models.find(m => m.key === identity.key) ?? null) : null;
};

/**
 * Model page of one boat, or null — never throws and never waits longer
 * than `budgetMs` (the boat page must not hang on a cold catalogue build;
 * the build keeps running and fills the Data Cache for the next request).
 */
export const findModelForYacht = async (
  rawManufacturer?: string | null,
  rawModel?: string | null,
  budgetMs = 1500
): Promise<CatalogModel | null> => {
  if (!modelIdentity(rawManufacturer, rawModel)) return null;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>(resolve => {
    timer = setTimeout(() => resolve(null), budgetMs);
  });

  try {
    const catalog = await Promise.race([loadModelCatalog().catch(() => null), timeout]);

    return catalog ? findModelByIdentity(catalog, rawManufacturer, rawModel) : null;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

// ---------------------------------------------------------------------------
// One model's fleet
// ---------------------------------------------------------------------------

interface YachtPage {
  content?: YachtModelShortInfo[];
  page?: { totalElements?: number; totalPages?: number };
}

const fleetUrl = (model: CatalogModel, page: number): string => {
  const query = new URLSearchParams({
    mid: model.modelIds.join(','),
    countryCodes: PROMOTED_CODES.join(','),
    currency: 'EUR',
    size: String(FLEET_PAGE_SIZE),
    page: String(page),
  });

  return `${apiBase()}/public/yachts?${query.toString()}`;
};

export interface ModelFleet {
  total: number;
  boats: YachtModelShortInfo[];
}

/** Every active boat of the model in the promoted countries (search order). */
export const loadModelFleet = cache(async (model: CatalogModel): Promise<ModelFleet> => {
  const first = await fetchJson<YachtPage>(fleetUrl(model, 0), MODEL_FLEET_REVALIDATE_SECONDS);
  const total = first.page?.totalElements ?? first.content?.length ?? 0;
  const pages = Math.min(first.page?.totalPages ?? 1, MAX_FLEET_PAGES);
  const rest = await mapWithLimit(
    Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => i + 1),
    3,
    page => fetchJson<YachtPage>(fleetUrl(model, page), MODEL_FLEET_REVALIDATE_SECONDS)
  );
  const seen = new Set<number>();
  const boats = [first, ...rest]
    .flatMap(p => p.content ?? [])
    .filter(boat => {
      if (seen.has(boat.id)) return false;

      seen.add(boat.id);

      return true;
    });

  return { total, boats };
});

interface YachtDetailSpecs {
  berths?: number | null;
  wc?: number | null;
}

/** Most common value, or null (ties → the smaller value). */
const mode = (values: number[]): number | null => {
  const counts = new Map<number, number>();

  values.forEach(v => counts.set(v, (counts.get(v) ?? 0) + 1));

  const best = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];

  return best ? best[0] : null;
};

/**
 * Berths and heads are only in the boat detail payload. Read a few boats
 * spread over the fleet (cached a day) and report the most common layout.
 */
export const loadTypicalLayout = async (
  boats: YachtModelShortInfo[]
): Promise<{ berths: number | null; wc: number | null }> => {
  if (!boats.length) return { berths: null, wc: null };

  const step = Math.max(1, Math.floor(boats.length / DETAIL_SAMPLE_SIZE));
  const sample = boats.filter((_, i) => i % step === 0).slice(0, DETAIL_SAMPLE_SIZE);
  const details = await mapWithLimit(sample, 3, boat =>
    fetchJson<YachtDetailSpecs>(
      `${apiBase()}/public/yachts/${encodeURIComponent(boat.slug)}`,
      CATALOG_REVALIDATE_SECONDS
    ).catch(() => null)
  );
  const berths = details.map(d => d?.berths).filter((v): v is number => typeof v === 'number' && v > 0);
  const wc = details.map(d => d?.wc).filter((v): v is number => typeof v === 'number' && v > 0);

  return { berths: mode(berths), wc: mode(wc) };
};

/**
 * Newest blog post whose title names the model ("Lagoon 42 …"), or null.
 * The WP list is cached five minutes by fetchAPI; a WP outage just hides
 * the link.
 */
export const findModelBlogPost = async (displayName: string): Promise<{ slug: string; title: string } | null> => {
  try {
    const data = await getBlogs(100);
    const nodes = ((data as unknown as { nodes?: Array<{ slug?: string; title?: string }> })?.nodes ?? []).filter(
      (n): n is { slug: string; title: string } => !!n?.slug && !!n?.title
    );
    const needle = ` ${foldName(displayName)} `;
    const hit = nodes.find(n => ` ${foldName(n.title)} `.includes(needle));

    return hit ? { slug: hit.slug, title: hit.title } : null;
  } catch {
    return null;
  }
};
