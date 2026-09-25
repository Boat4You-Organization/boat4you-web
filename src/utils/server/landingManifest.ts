import 'server-only';

import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { curatedFileFor, listCorpusSlugs } from '@/utils/server/curatedSeoContent';
import { DestinationIndex, ResolvedDestination, resolveDestinationName } from '@/utils/server/destinationDid';
import { directOwnersOf, evaluateLanding, mapWithLimit } from '@/utils/server/landingGate';
import {
  CORPUS_DEST_DENYLIST,
  aliasNamesForDestSlug,
  curatedDestSlugsFor,
  parseCuratedFileSlug,
} from '@/utils/static/curatedSeoSlug';
import { destinationSlug, isLandingExpressible } from '@/utils/static/searchLandingPath';

/**
 * Corpus manifest → the destination landings that pass the index gate.
 *
 * Built from the file list of `public/seo-content/en` (~1.4K pages: 12
 * country overviews, ~90 region overviews, ~600 area × boat type and ~700
 * base × boat type pages). Each file's place is resolved to its catalogue
 * landing (the same resolver /search uses, via its own slug or an alias in
 * curatedSeoSlug.ts) and the landing is emitted when landingGate passes, so
 * the sitemaps list regions, bases and their boat-type pages — not only the
 * 12 countries and the marinas whose catalogue name happens to match a file.
 *
 * The report lists the files that produce no landing and why (for the
 * deploy notes / alias upkeep): `unresolved` — no catalogue place reads the
 * file's prefix; `shadowed` — the place's landing reads another file (the
 * corpus has two texts for one place, e.g. `split` and `split-region`);
 * `gated` — a landing, but below the gate (fleet, offer, unique text).
 */

export interface LandingEntry {
  name: string;
  boatType: VesselType | null;
  fleet: number;
  locales: string[];
  /** The resolved place behind the landing (for the landing link blocks:
   *  which landings lie inside a country or a region). */
  dids: string[];
  kind: LocationType;
  countryCode?: string;
}

export interface ManifestReport {
  files: number;
  unresolved: string[];
  shadowed: string[];
  gated: string[];
}

export interface LandingManifest {
  /** Destination landings (no boat type), canonical name order. */
  destinations: LandingEntry[];
  /** Destination × boat type landings. */
  typed: LandingEntry[];
  report: ManifestReport;
}

const TTL_MS = 60 * 60 * 1000;
let memo: { at: number; value: Promise<LandingManifest> } | null = null;
/** Last manifest that finished building (served while the next one builds). */
let lastBuilt: LandingManifest | null = null;

/** The catalogue landing a file prefix names (via a catalogue name or an alias key), if any. */
const landingForDest = async (index: DestinationIndex, dest: string): Promise<ResolvedDestination | null> => {
  const names = [...directOwnersOf(index, dest), ...aliasNamesForDestSlug(dest)];
  const resolved = (await Promise.all(names.map(n => resolveDestinationName(index, n)))).filter(
    (r): r is ResolvedDestination => !!r && isLandingExpressible(r.name)
  );

  // Prefer the landing that actually reads this prefix.
  return resolved.find(r => curatedDestSlugsFor(r.name).includes(dest)) ?? resolved[0] ?? null;
};

const build = async (index: DestinationIndex): Promise<LandingManifest> => {
  const slugs = await listCorpusSlugs();
  const report: ManifestReport = { files: slugs.length, unresolved: [], shadowed: [], gated: [] };
  const parsed = slugs.map(slug => ({ slug, key: parseCuratedFileSlug(slug) }));
  const dests = Array.from(
    new Set(parsed.flatMap(p => (p.key && !CORPUS_DEST_DENYLIST.has(p.key.dest) ? [p.key.dest] : [])))
  );
  const byDest = new Map<string, ResolvedDestination | null>();

  await mapWithLimit(dests, 6, async dest => {
    byDest.set(dest, await landingForDest(index, dest));
  });

  // Promoted countries are always candidates (their overview exists in the
  // corpus, but they must not depend on the file-name match).
  const countries = Array.from(index.byName.values())
    .flat()
    .filter(l => l.kind === LocationType.COUNTRY && l.countryCode && PROMOTED_COUNTRY_CODES.has(l.countryCode));
  const combos = new Map<string, { resolved: ResolvedDestination; boatType: VesselType | null }>();
  const addCombo = (resolved: ResolvedDestination, boatType: VesselType | null) =>
    combos.set(`${destinationSlug(resolved.name)}|${boatType ?? ''}`, { resolved, boatType });

  await Promise.all(
    countries.map(async c => {
      const resolved = await resolveDestinationName(index, c.name);

      if (resolved && isLandingExpressible(resolved.name)) addCombo(resolved, null);
    })
  );

  const fileCombo = new Map<string, string>();

  await mapWithLimit(parsed, 12, async ({ slug, key }) => {
    const resolved = key && !CORPUS_DEST_DENYLIST.has(key.dest) ? byDest.get(key.dest) : null;

    if (!key || !resolved) {
      report.unresolved.push(slug);

      return;
    }

    // The landing reads its first existing candidate; a file it does not
    // read is a second text for the same place (`split` vs `split-region`).
    const served = await curatedFileFor(routing.defaultLocale, resolved.name, key.boatType, {
      typeSpecificOnly: !!key.boatType,
    });

    if (served !== slug) {
      report.shadowed.push(slug);

      return;
    }

    addCombo(resolved, key.boatType);
    fileCombo.set(slug, `${destinationSlug(resolved.name)}|${key.boatType ?? ''}`);
  });

  const evaluated = new Map<string, LandingEntry>();

  await mapWithLimit(Array.from(combos.entries()), 6, async ([comboKey, { resolved, boatType }]) => {
    const gate = await evaluateLanding(resolved, boatType, index);

    evaluated.set(comboKey, {
      name: resolved.name,
      boatType,
      fleet: gate.fleet,
      locales: gate.indexableLocales,
      dids: resolved.dids,
      kind: resolved.kind,
      countryCode: resolved.countryCode,
    });
  });

  fileCombo.forEach((comboKey, slug) => {
    if (!evaluated.get(comboKey)?.locales.length) report.gated.push(slug);
  });

  const entries = Array.from(evaluated.values())
    .filter(e => e.locales.length)
    .sort((a, b) => a.name.localeCompare(b.name) || (a.boatType ?? '').localeCompare(b.boatType ?? ''));

  report.unresolved.sort();
  report.shadowed.sort();
  report.gated.sort();

  return {
    destinations: entries.filter(e => !e.boatType),
    typed: entries.filter(e => !!e.boatType),
    report,
  };
};

/** The manifest, rebuilt at most once an hour (shared by both sitemaps). */
export const getLandingManifest = (index: DestinationIndex): Promise<LandingManifest> => {
  if (!memo || Date.now() - memo.at > TTL_MS) {
    const value = build(index).then(
      manifest => {
        lastBuilt = manifest;

        return manifest;
      },
      error => {
        memo = null;
        throw error;
      }
    );

    memo = { at: Date.now(), value };
  }

  return memo.value;
};

/**
 * The manifest for a page render (the /search landing link blocks): the last
 * built one right away (stale while the hourly rebuild runs), else the first
 * build — but never longer than `budgetMs`, so a cold process does not hold
 * a landing on ~400 gate evaluations (the build keeps running and serves the
 * next request). null → no manifest yet (the caller renders no link block).
 */
export const landingManifestWithin = async (
  index: DestinationIndex,
  budgetMs: number
): Promise<LandingManifest | null> => {
  const pending = getLandingManifest(index).catch(() => null);

  if (lastBuilt) return lastBuilt;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>(resolve => {
    timer = setTimeout(() => resolve(null), budgetMs);
  });

  try {
    return await Promise.race([pending, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};
