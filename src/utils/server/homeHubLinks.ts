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
 * production API — and while the manifest is cold (it builds in the
 * background; the home revalidates every 60 s). A cold model catalogue only
 * drops the models tab for that render.
 */

/** Same budgets as the landing link blocks (landingNav.ts). */
const MANIFEST_BUDGET_MS = 2000;
const MODELS_BUDGET_MS = 1500;
/** Hard stop for the whole resolution, so the hub never holds the home render. */
const TOTAL_BUDGET_MS = 3000;

export interface HomeHubResolvedLink {
  id: HomeHubLinkId;
  /** Locale-less path; the next-intl Link adds the locale prefix. */
  href: string;
}

export interface HomeHubResolvedTab {
  key: HomeHubTabKey;
  links: HomeHubResolvedLink[];
}

const landingKey = (destinations: string, boatType?: string | null): string =>
  `${destinationSlug(destinations)}|${boatType ?? ''}`;

const resolveTabs = async (locale: string): Promise<HomeHubResolvedTab[]> => {
  const index = await loadDestinationIndex();

  if (!index) return [];

  const [manifest, catalog] = await Promise.all([
    landingManifestWithin(index, MANIFEST_BUDGET_MS),
    modelCatalogWithin(MODELS_BUDGET_MS),
  ]);

  if (!manifest) return [];

  const landings = new Map<string, string>();

  [...manifest.destinations, ...manifest.typed].forEach(entry => {
    if (entry.locales.includes(locale)) {
      landings.set(landingKey(entry.name, entry.boatType), buildSearchLandingPath(entry.name, entry.boatType));
    }
  });

  const paths = new Set<string>([
    ...itineraries.flatMap(group => group.itinerary.map(area => `/itineraries/${area.id}`)),
    ...PRICE_GUIDES.map(guide => priceGuidePath(guide.slug)),
    ...(catalog?.models ?? []).map(model => model.path),
  ]);

  const hrefOf = (link: HomeHubLink): string | null => {
    if (link.kind === 'landing') return landings.get(landingKey(link.destinations, link.boatType)) ?? null;

    return paths.has(link.path) ? link.path : null;
  };

  return HOME_HUB_TABS.map(tab => ({
    key: tab.key,
    links: tab.links.flatMap(link => {
      const href = hrefOf(link);

      return href ? [{ id: link.id, href }] : [];
    }),
  })).filter(tab => tab.links.length > 0);
};

/** Tabs with their linkable entries in `locale` (empty → render no hub). */
export const homeHubTabs = async (locale: string): Promise<HomeHubResolvedTab[]> => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return [];

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<HomeHubResolvedTab[]>(resolve => {
    timer = setTimeout(() => resolve([]), TOTAL_BUDGET_MS);
  });

  try {
    return await Promise.race([resolveTabs(locale).catch((): HomeHubResolvedTab[] => []), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};
