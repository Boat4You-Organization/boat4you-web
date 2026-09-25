import { cache } from 'react';

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

import { routing } from '@/i18n/routing';
import { VesselType, isVesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import {
  DestinationIndex,
  IndexedLocation,
  ResolvedDestination,
  loadDestinationIndex,
  locationForDid,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { resolveCuratedSlugCandidates, sanitizeCuratedHtml } from '@/utils/static/curatedSeoSlug';
import {
  buildDidHref,
  buildSearchLandingPath,
  isLandingExpressible,
  normalizeDestinationName,
} from '@/utils/static/searchLandingPath';

/**
 * Server-side reader for the curated SEO corpus (`public/seo-content/`).
 *
 * Until 25.9.2026 the client SeoTextSection fetched the file in a useEffect
 * after hydration, so the server HTML (what Google indexes first) carried a
 * generic "…on the Adriatic" template on every destination, Greece and the
 * Caribbean included. Reading the file here puts the curated text into the
 * SSR markup.
 */

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const CONTENT_ROOT = path.join(process.cwd(), 'public', 'seo-content');
const SITE_ORIGIN = 'https://www.boat4you.com';

// The corpus is static per deploy — memoise per (locale, slug), misses
// included, so a landing request touches the disk at most once per file.
// Bounded so a crawler walking random slugs can't grow it without limit.
const MEMO_LIMIT = 2000;
const memo = new Map<string, string | null>();

const isLocale = (locale: string): boolean => (routing.locales as readonly string[]).includes(locale);

const readCuratedFile = async (locale: string, slug: string): Promise<string | null> => {
  // Path-traversal guard: both segments are whitelisted before they reach
  // path.join, and the resolved path must stay under CONTENT_ROOT.
  if (!isLocale(locale) || !SLUG_PATTERN.test(slug)) return null;

  const key = `${locale}/${slug}`;

  if (memo.has(key)) return memo.get(key) ?? null;

  const filePath = path.join(CONTENT_ROOT, locale, `${slug}.html`);
  let html: string | null = null;

  if (filePath.startsWith(CONTENT_ROOT + path.sep)) {
    try {
      html = await readFile(filePath, 'utf8');
    } catch {
      html = null;
    }
  }

  if (memo.size >= MEMO_LIMIT) memo.clear();

  memo.set(key, html);

  return html;
};

/**
 * Corpus link labels that are not catalogue names, mapped to the catalogue
 * place the text means (keys normalised, see normalizeDestinationName). The
 * link's did is no help for these: it is missing, stale, or a wrong country
 * (Mykonos → c-132 Madagascar).
 */
const CORPUS_LABEL_TARGET: Record<string, string> = {
  mykonos: 'Port of Mykonos',
  radazul: 'Puerto Deportivo Radazul',
  'las palmas': 'Las Palmas de Gran Canaria',
  tarragona: 'Catalonia',
  'san miguel': 'Canary Islands',
};

/** Boat-type value from any of the corpus spellings (boat_types=Sailing Yacht,
 *  boatType=MotorYacht, vesselType=CATAMARAN…), or null when not a known type. */
export const corpusBoatType = (params: URLSearchParams): VesselType | null => {
  const raw =
    params.get('boatTypes') ??
    params.get('boat_types') ??
    params.get('boat_type') ??
    params.get('boatType') ??
    params.get('vesselType');

  if (!raw || raw.includes(',')) return null;

  const value = raw
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toUpperCase();

  return isVesselType(value) ? value : null;
};

/** Landing href for a resolved destination: canonical form, or the did form
 *  when the catalogue name can't be carried by `?destinations=`. */
const hrefForResolved = (hit: ResolvedDestination, boatType: VesselType | null): string =>
  isLandingExpressible(hit.name)
    ? buildSearchLandingPath(hit.name, boatType)
    : buildDidHref(hit.name, hit.dids.join(','), boatType);

/** Landing href for one catalogue row. The canonical landing is used only if
 *  its name resolves back to (a superset of) this row's dids — otherwise
 *  `?destinations=<name>` would show another place, so link the did form. */
const hrefForLocation = async (
  index: DestinationIndex,
  location: IndexedLocation,
  dids: string[],
  boatType: VesselType | null
): Promise<string> => {
  const hit = await resolveDestinationName(index, location.name);

  if (hit && dids.every(d => hit.dids.includes(d))) return hrefForResolved(hit, boatType);

  return buildDidHref(location.name.trim(), dids.join(','), boatType);
};

/** First label spelling that resolves: the override, the whole label, then
 *  its comma parts ("Piso Livadi Port,Paros,Greece"). */
const resolveLabel = async (index: DestinationIndex, label: string): Promise<ResolvedDestination | null> => {
  const key = normalizeDestinationName(label);
  const override = Object.prototype.hasOwnProperty.call(CORPUS_LABEL_TARGET, key) ? CORPUS_LABEL_TARGET[key] : null;
  const spellings = [override, label, ...label.split(',')].filter((v): v is string => !!v && !!v.trim());

  // Sequential on purpose: the first spelling that resolves wins.
  return spellings.reduce<Promise<ResolvedDestination | null>>(
    async (found, spelling) => (await found) ?? resolveDestinationName(index, spelling),
    Promise.resolve(null)
  );
};

/**
 * Where one corpus search link should point, or null when it names no place
 * we can filter by (the anchor is then unwrapped to plain text — a link to
 * the unfiltered 13.6K catalogue is the defect this release removes).
 *
 * The did is the better signal (765 links say `French Riviera&did=r-184`,
 * the catalogue name being "French Riviera (Côte d'Azur)"; `Croatia&did=r-193`
 * means Istria / Kvarner). The label wins only when the did is missing or
 * stale, when it is in another country (`Montenegro&did=c-146` = Monaco), or
 * when the did is just the country of a more specific label
 * (`Calabria&did=c-110`).
 */
export const corpusLinkTarget = async (
  index: DestinationIndex,
  label: string,
  didParam: string,
  boatType: VesselType | null
): Promise<string | null> => {
  if (!label.trim() && !didParam.trim()) return buildSearchLandingPath(null, boatType);

  const labelHit = label.trim() ? await resolveLabel(index, label) : null;
  const dids = didParam
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);
  const location = dids.length === 1 ? locationForDid(index, dids[0]) : null;

  if (location) {
    const otherCountry =
      !!labelHit?.countryCode && !!location.countryCode && labelHit.countryCode !== location.countryCode;
    const labelIsNarrower =
      !!labelHit && location.kind === LocationType.COUNTRY && labelHit.kind !== LocationType.COUNTRY;

    if (labelHit && (otherCountry || labelIsNarrower)) return hrefForResolved(labelHit, boatType);

    return hrefForLocation(index, location, dids, boatType);
  }

  return labelHit ? hrefForResolved(labelHit, boatType) : null;
};

// One search anchor: attributes around href, the text, and the end — a
// closing tag (the corpus is prettier-formatted, so `</a\n  >` occurs) or,
// for the few invalid nested / unclosed anchors, the next `<a` or the end of
// the fragment (where browsers end it).
const SEARCH_ANCHOR =
  /<a\b([^>]*?)\shref="(?:https?:\/\/(?:www\.)?boat4you\.com)?(\/search[^"]*)"([^>]*)>((?:(?!<a\b|<\/a\s*>)[\s\S])*)(<\/a\s*>|(?=<a\b)|$)/g;

/**
 * The corpus links to search pages in the pre-25.9 `?destinations=Name&did=…`
 * form (some with stale or wrong ids, labels that are not catalogue names)
 * and always to the English origin. Each link is mapped to the landing URL of
 * the place it means (see corpusLinkTarget), under the active locale, so the
 * curated text sends readers and crawlers to the right, filtered page.
 */
const rewriteSearchLinks = async (html: string, locale: string): Promise<string> => {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const matches = Array.from(html.matchAll(SEARCH_ANCHOR));

  if (!matches.length) return html;

  const index = await loadDestinationIndex();
  const targets = await Promise.all(
    matches.map(async ([anchor, , target]) => {
      try {
        const url = new URL(target.replace(/&amp;/g, '&'), SITE_ORIGIN);

        if (url.pathname !== '/search') return anchor;

        // Without the catalogue (API down) keep the original link rather
        // than guess; the text still renders.
        if (!index) return anchor;

        const label = url.searchParams.get('destinations') ?? url.searchParams.get('destination') ?? '';
        const href = await corpusLinkTarget(
          index,
          label,
          url.searchParams.get('did') ?? '',
          corpusBoatType(url.searchParams)
        );

        return { href };
      } catch {
        return anchor;
      }
    })
  );

  let cursor = 0;
  let out = '';

  matches.forEach((match, i) => {
    const [anchor, before, , after, inner, closing] = match;
    const target = targets[i];
    const start = match.index ?? 0;

    out += html.slice(cursor, start);
    cursor = start + anchor.length;

    if (typeof target === 'string') {
      out += target;
    } else if (target.href === null) {
      out += inner;
    } else {
      out += `<a${before} href="${prefix}${target.href.replace(/&/g, '&amp;')}"${after}>${inner}${closing}`;
    }
  });

  return out + html.slice(cursor);
};

const corpusListings = new Map<string, Promise<Set<string>>>();

/**
 * The corpus page slugs of one locale (a directory listing, static per
 * deploy, so read once per process and locale). The gate and the sitemaps
 * check existence against it instead of reading ~12.9K files.
 */
const corpusSlugSet = (locale: string): Promise<Set<string>> => {
  if (!isLocale(locale)) return Promise.resolve(new Set());

  let listing = corpusListings.get(locale);

  if (!listing) {
    listing = readdir(path.join(CONTENT_ROOT, locale))
      .then(
        names =>
          new Set(
            names
              .filter(name => name.endsWith('.html'))
              .map(name => name.slice(0, -'.html'.length))
              .filter(slug => SLUG_PATTERN.test(slug))
          )
      )
      .catch(() => {
        // Retry on the next call rather than caching a failed listing.
        corpusListings.delete(locale);

        return new Set<string>();
      });
    corpusListings.set(locale, listing);
  }

  return listing;
};

/** Every corpus page slug of the English folder (the other eight mirror it). */
export const listCorpusSlugs = async (): Promise<string[]> =>
  Array.from(await corpusSlugSet(routing.defaultLocale)).sort();

/**
 * Slug of the corpus file a (destination × boat type) landing reads in
 * `locale` — the first existing candidate — or null. The index gate uses it
 * to check that the text is this landing's own. `typeSpecificOnly` ignores
 * the overview fallback.
 */
export const curatedFileFor = async (
  locale: string,
  destination: string,
  boatType: string | null,
  options: { typeSpecificOnly?: boolean } = {}
): Promise<string | null> => {
  const type = isVesselType(boatType) ? boatType : null;
  const existing = await corpusSlugSet(locale);

  return resolveCuratedSlugCandidates(destination, type, options).find(slug => existing.has(slug)) ?? null;
};

/**
 * First existing curated file for (destination × boat type) in `locale`,
 * sanitised (body only, first <h1> dropped) and with search links mapped to
 * their landing pages. `null` when the corpus has no page for this query.
 * Wrapped in React `cache` so generateMetadata and the page share one lookup.
 */
export const getCuratedSeoHtml = cache(
  async (locale: string, destination: string, boatType: string | null): Promise<string | null> => {
    const candidates = resolveCuratedSlugCandidates(destination, isVesselType(boatType) ? boatType : null);
    // Priority order matters (first existing file wins); reads are memoised
    // and cheap, so read them all and take the first hit.
    const files = await Promise.all(candidates.map(slug => readCuratedFile(locale, slug)));
    const raw = files.find((f): f is string => !!f);

    return raw ? rewriteSearchLinks(sanitizeCuratedHtml(raw), locale) : null;
  }
);
