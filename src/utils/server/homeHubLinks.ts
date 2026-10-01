import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import 'server-only';

import { HOME_HUB_TABS, HomeHubLink, HomeHubLinkId, HomeHubTabKey } from '@/config/homeHub.config';
import { itineraries } from '@/config/itineraries.config';
import { PRICE_GUIDES, priceGuidePath } from '@/config/priceGuides.config';
import { loadDestinationIndex } from '@/utils/server/destinationDid';
import { landingManifestWithin } from '@/utils/server/landingManifest';
import { modelCatalogWithin } from '@/utils/server/modelCatalog';
import { buildSearchLandingPath, destinationSlug } from '@/utils/static/searchLandingPath';

/**
 * The home link hub's links that are indexable pages in `locale` right now
 * (homeHub.config.ts keeps the curated order; this only drops links):
 *
 *   - a destination landing only while the landing manifest lists it for
 *     the locale (the same entries and the same URL builder as the location
 *     and category sitemaps, so the href is the sitemap <loc> byte for byte);
 *   - an itinerary area or a price guide only while its config has it;
 *   - a /yachts model page only while the model catalogue has it (the
 *     catalogue already holds only models with >= MIN_LANDING_FLEET boats).
 *
 * Empty (no hub) during `next build` — the home is prerendered for 9
 * locales and a cold manifest build there is ~400 gate checks against the
 * production API.
 *
 * At runtime a slow or failing source never drops links on its own (review
 * 1.10.2026): each source falls back to the last list this process resolved
 * — the landing list per locale, the model paths — and a link is dropped
 * only when a fresh list leaves it out. The whole resolution is capped at
 * TOTAL_BUDGET_MS, after which the locale's last good tabs are served. Every
 * fallback logs a warning. Only a cold process with nothing resolved yet
 * renders no hub (the home revalidates every 60 s).
 */

/** Same budgets as the landing link blocks (landingNav.ts). */
const MANIFEST_BUDGET_MS = 2000;
const MODELS_BUDGET_MS = 1500;
/** Hard stop for the whole resolution, so the hub never holds the home render. */
const TOTAL_BUDGET_MS = 3000;

export interface HomeHubResolvedLink {
  id: HomeHubLinkId;
  /** Locale-less path; HomeLinkHub adds the locale prefix (getPathname). */
  href: string;
}

export interface HomeHubResolvedTab {
  key: HomeHubTabKey;
  links: HomeHubResolvedLink[];
}

const landingKey = (destinations: string, boatType?: string | null): string =>
  `${destinationSlug(destinations)}|${boatType ?? ''}`;

/** Last good sources and tabs of this process (served when a fresh one is late or fails). */
const lastLandings = new Map<string, ReadonlyMap<string, string>>();
let lastModelPaths: readonly string[] | null = null;
const lastTabs = new Map<string, HomeHubResolvedTab[]>();

// eslint-disable-next-line no-console
const warn = (locale: string, what: string) => console.warn(`[homeHub] ${locale}: ${what}`);

/** Linkable landing key → canonical path in `locale`, from a fresh manifest (null: no fresh manifest). */
const freshLandings = async (locale: string): Promise<Map<string, string> | null> => {
  const index = await loadDestinationIndex();

  if (!index) return null;

  const manifest = await landingManifestWithin(index, MANIFEST_BUDGET_MS);

  if (!manifest) return null;

  const landings = new Map<string, string>();

  [...manifest.destinations, ...manifest.typed].forEach(entry => {
    if (entry.locales.includes(locale)) {
      landings.set(landingKey(entry.name, entry.boatType), buildSearchLandingPath(entry.name, entry.boatType));
    }
  });

  return landings;
};

const resolveTabs = async (locale: string): Promise<HomeHubResolvedTab[]> => {
  const [fresh, catalog] = await Promise.all([
    freshLandings(locale).catch(() => null),
    modelCatalogWithin(MODELS_BUDGET_MS),
  ]);

  if (fresh) {
    lastLandings.set(locale, fresh);
  } else {
    warn(
      locale,
      lastLandings.has(locale) ? 'landing list late or failed, last good one served' : 'no landing list yet'
    );
  }

  if (catalog) {
    lastModelPaths = catalog.models.map(model => model.path);
  } else {
    warn(locale, lastModelPaths ? 'model catalogue late or failed, last good one served' : 'no model catalogue yet');
  }

  const landings = fresh ?? lastLandings.get(locale);

  if (!landings) return [];

  const paths = new Set<string>([
    ...itineraries.flatMap(group => group.itinerary.map(area => `/itineraries/${area.id}`)),
    ...PRICE_GUIDES.map(guide => priceGuidePath(guide.slug)),
    ...(lastModelPaths ?? []),
  ]);

  const hrefOf = (link: HomeHubLink): string | null => {
    if (link.kind === 'landing') return landings.get(landingKey(link.destinations, link.boatType)) ?? null;

    return paths.has(link.path) ? link.path : null;
  };

  const tabs = HOME_HUB_TABS.map(tab => ({
    key: tab.key,
    links: tab.links.flatMap(link => {
      const href = hrefOf(link);

      return href ? [{ id: link.id, href }] : [];
    }),
  })).filter(tab => tab.links.length > 0);

  lastTabs.set(locale, tabs);

  return tabs;
};

/** Tabs with their linkable entries in `locale` (empty → render no hub). */
export const homeHubTabs = async (locale: string): Promise<HomeHubResolvedTab[]> => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return [];

  const fallback = (why: string): HomeHubResolvedTab[] => {
    const last = lastTabs.get(locale);

    warn(locale, last ? `${why}, last good tabs served` : `${why}, no hub`);

    return last ?? [];
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<HomeHubResolvedTab[]>(resolve => {
    timer = setTimeout(() => resolve(fallback(`over ${TOTAL_BUDGET_MS} ms`)), TOTAL_BUDGET_MS);
  });

  try {
    return await Promise.race([resolveTabs(locale).catch(() => fallback('resolution failed')), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};
