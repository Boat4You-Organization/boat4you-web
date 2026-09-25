import 'server-only';

import { itineraryAreaForBlogText } from '@/components/RelatedItineraries/RelatedItineraries';
import { itineraries } from '@/config/itineraries.config';
import { POPULAR_SEARCHES } from '@/config/popular-searches.config';
import { isPromotedCountry } from '@/config/promoted-countries.config';
import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { Hub, hubFor, localePrefix } from '@/utils/server/catalogueHubs';
import { corpusBoatType, corpusLinkTarget } from '@/utils/server/curatedSeoContent';
import {
  DestinationIndex,
  ResolvedDestination,
  loadDestinationIndex,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { normalizeDestinationName } from '@/utils/static/searchLandingPath';

/**
 * Blog → catalogue. The 56 posts (WordPress, English only) are the site's
 * biggest click source but linked into the catalogue only through a few
 * `?startDate=` boat links (robots-blocked since 24.9.2026) and noindex
 * `?did=` searches. Two server-side fixes:
 *   - rewriteBlogCatalogueLinks: those links in the post body point at the
 *     clean boat URL / the canonical landing instead;
 *   - blogExploreHubs: 3–6 landing hubs for the "Explore boats" block,
 *     detected from the post's title, categories and body against the
 *     catalogue names, plus the matching itinerary area.
 */

const SITE_ORIGIN = 'https://www.boat4you.com';
const LOCALE_SEGMENT = '(?:/(?:de|fr|it|es|pt|nl|pl|hr))?';
// href="…" to /boat/<slug>?… or /search?… on our origin (absolute or relative).
const CATALOGUE_HREF = new RegExp(
  `href="((?:https?://(?:www\\.)?boat4you\\.com)?${LOCALE_SEGMENT}/(?:boat/[^"?#]+\\?[^"]*|search\\?[^"]*))"`,
  'g'
);

const decodeHref = (href: string): string => href.replace(/&#0?38;/g, '&').replace(/&amp;/g, '&');

/** Where one catalogue link in a post should point (null = leave it). */
const targetFor = async (index: DestinationIndex | null, href: string, locale: string): Promise<string | null> => {
  let url: URL;

  try {
    url = new URL(decodeHref(href), SITE_ORIGIN);
  } catch {
    return null;
  }

  const prefix = localePrefix(locale);
  const boat = /^(?:\/[a-z]{2})?(\/boat\/[^/]+)$/.exec(url.pathname);

  // /boat/<slug>?startDate=… → the one canonical boat URL (robots.txt blocks
  // /boat/*? since 24.9.2026, so the dated copy is a dead end for crawlers).
  if (boat) return `${prefix}${boat[1]}`;

  if (!/^(?:\/[a-z]{2})?\/search$/.test(url.pathname)) return null;

  const label = url.searchParams.get('destinations') ?? '';
  const did = url.searchParams.get('did') ?? '';

  // Bare /search and ?boatTypes=X stay as they are; only destination links
  // (the noindex did form or a raw label) are mapped to their landing.
  if ((!label.trim() && !did.trim()) || !index) return null;

  const landing = await corpusLinkTarget(index, label, did, corpusBoatType(url.searchParams));

  return landing ? `${prefix}${landing}` : null;
};

export const rewriteBlogCatalogueLinks = async (html: string, locale: string): Promise<string> => {
  if (!html) return html;

  const matches = Array.from(html.matchAll(CATALOGUE_HREF));

  if (!matches.length) return html;

  const index = await loadDestinationIndex();
  const targets = await Promise.all(matches.map(([, href]) => targetFor(index, href, locale)));
  let cursor = 0;
  let out = '';

  matches.forEach((match, i) => {
    const start = match.index ?? 0;

    out += html.slice(cursor, start);
    out += targets[i] ? `href="${targets[i]!.replace(/&/g, '&amp;')}"` : match[0];
    cursor = start + match[0].length;
  });

  return out + html.slice(cursor);
};

/** Spellings in the posts that are not catalogue names. */
const EXTRA_NAMES: Record<string, string> = {
  türkiye: 'Turkey',
  turkiye: 'Turkey',
  bvi: 'British Virgin Islands',
  'virgin islands': 'British Virgin Islands',
  'french riviera': "French Riviera (Côte d'Azur)",
  'cote d azur': "French Riviera (Côte d'Azur)",
};

/** Boat type a post is about, from its title / categories / slug. Model
 *  brands map to their hull type (Lagoon, Bali → catamaran). */
const TYPE_PATTERNS: Array<[RegExp, VesselType]> = [
  [/\bpower ?catamarans?\b/, VesselType.POWER_CATAMARAN],
  [
    /\bcatamarans?\b|\blagoon\b|\bbali \d|\bleopard \d|\bfountaine pajot\b|\bexcess \d|\bnautitech\b/,
    VesselType.CATAMARAN,
  ],
  [/\bgulets?\b/, VesselType.GULET],
  [/\bmotor ?yachts?\b/, VesselType.MOTOR_YACHT],
  [/\bmotor ?boats?\b|\bspeedboats?\b|\bribs?\b/, VesselType.MOTORBOAT],
  [
    /\bsailing yachts?\b|\bsailboats?\b|\bmonohulls?\b|\boceanis\b|\bbeneteau first\b|\bsun odyssey\b|\bbavaria\b|\bdufour\b|\bhanse\b|\belan \d/,
    VesselType.SAILING_YACHT,
  ],
];

const detectBoatType = (text: string): VesselType | null => {
  const haystack = text.toLowerCase();

  return TYPE_PATTERNS.find(([pattern]) => pattern.test(haystack))?.[1] ?? null;
};

const stripHtml = (html: string): string =>
  html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#?[a-z0-9]+;/gi, ' ');

const countOccurrences = (haystack: string, needle: string): number => {
  let count = 0;
  let from = haystack.indexOf(needle);

  while (from !== -1) {
    count += 1;
    from = haystack.indexOf(needle, from + needle.length);
  }

  return count;
};

const namesByIndex = new WeakMap<DestinationIndex, Map<string, string>>();

/** Normalised spelling → catalogue name, for countries in the offer, their
 *  regions and the popular entries (bases are left out: "Marina", "Port"
 *  and town names shared across countries make body matches noisy). */
const placeNames = (index: DestinationIndex): Map<string, string> => {
  let names = namesByIndex.get(index);

  if (!names) {
    names = new Map();

    const add = (spelling: string, name: string) => {
      const key = normalizeDestinationName(spelling);

      if (key.length >= 4 && !names!.has(key)) names!.set(key, name);
    };

    index.byName.forEach(rows =>
      rows.forEach(row => {
        if (row.kind === LocationType.MARINA) return;

        if (row.countryCode ? isPromotedCountry(row.countryCode) : row.kind === LocationType.REGION) {
          add(row.name, row.name);
        }
      })
    );
    POPULAR_SEARCHES.forEach(spec => {
      add(spec.displayLabel, spec.displayLabel);
      spec.members.forEach(member => add(member.name, spec.displayLabel));
    });
    Object.entries(EXTRA_NAMES).forEach(([spelling, name]) => add(spelling, name));
    namesByIndex.set(index, names);
  }

  return names;
};

export interface ExploreLinks {
  hubs: Hub[];
  /** Itinerary area matching the post, when one exists. */
  itinerary: { href: string; area: string } | null;
}

const MIN_LINKS = 3;
const MAX_LINKS = 6;
const TITLE_WEIGHT = 5;
const MIN_BODY_MENTIONS = 2;

/** Promoted countries with an indexable landing, biggest fleet first. */
export const topCountryHubs = async (index: DestinationIndex, locale: string, limit: number): Promise<Hub[]> => {
  const countries = Array.from(index.byName.values())
    .flat()
    .filter(l => l.kind === LocationType.COUNTRY && isPromotedCountry(l.countryCode));
  const unique = Array.from(new Map(countries.map(c => [c.id, c])).values());
  const hubs = await Promise.all(
    unique.map(async c => hubFor(index, await resolveDestinationName(index, c.name), null, locale))
  );

  return hubs
    .filter((h): h is Hub => !!h?.href)
    .sort((a, b) => b.fleet - a.fleet)
    .slice(0, limit);
};

export const blogExploreHubs = async (
  post: { title: string; slug: string; content: string; categories?: string[] },
  locale: string
): Promise<ExploreLinks> => {
  const index = await loadDestinationIndex();
  const areaId = itineraryAreaForBlogText([post.slug, post.title, ...(post.categories ?? [])].join(' '));
  const area = areaId ? itineraries.flatMap(g => g.itinerary).find(a => a.id === areaId) : null;
  const itinerary = area ? { href: `${localePrefix(locale)}/itineraries/${area.id}`, area: area.sailingArea } : null;

  if (!index) return { hubs: [], itinerary };

  const heading = ` ${normalizeDestinationName([post.title, ...(post.categories ?? [])].join(' '))} `;
  const body = ` ${normalizeDestinationName(stripHtml(post.content))} `;
  const scores = new Map<string, number>();

  placeNames(index).forEach((name, key) => {
    const needle = ` ${key} `;
    const inHeading = countOccurrences(heading, needle);
    const inBody = countOccurrences(body, needle);

    // A single passing mention in the body ("unlike the Aegean…") is not
    // what the post is about.
    if (!inHeading && inBody < MIN_BODY_MENTIONS) return;

    scores.set(name, (scores.get(name) ?? 0) + inHeading * TITLE_WEIGHT + inBody);
  });

  // Same landing under several spellings ("Split", "Split Region") adds up.
  const ranked = new Map<string, { resolved: ResolvedDestination; score: number }>();

  await Promise.all(
    Array.from(scores.entries()).map(async ([name, score]) => {
      const resolved = await resolveDestinationName(index, name);

      if (!resolved) return;

      const entry = ranked.get(resolved.name) ?? { resolved, score: 0 };

      entry.score += score;
      ranked.set(resolved.name, entry);
    })
  );

  const top = Array.from(ranked.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_LINKS * 2);
  const destinationHubs = (await Promise.all(top.map(t => hubFor(index, t.resolved, null, locale)))).filter(
    (h): h is Hub => !!h?.href
  );

  const boatType = detectBoatType([post.title, post.slug, ...(post.categories ?? [])].join(' '));
  const typedHubs: Hub[] = [];

  if (boatType) {
    // The post's leading place × its boat type, else the country of it.
    const lead = top[0]?.resolved ?? null;
    const leadCountry = lead?.countryCode
      ? Array.from(index.byName.values())
          .flat()
          .find(l => l.kind === LocationType.COUNTRY && l.countryCode === lead.countryCode)
      : null;
    const candidates = [lead, leadCountry ? await resolveDestinationName(index, leadCountry.name) : null];

    // eslint-disable-next-line no-restricted-syntax
    for (const candidate of candidates) {
      // Sequential on purpose: the first indexable type landing wins.
      // eslint-disable-next-line no-await-in-loop
      const hub = candidate ? await hubFor(index, candidate, boatType, locale) : null;

      if (hub?.href) {
        typedHubs.push(hub);
        break;
      }
    }
  }

  const hubs = [...typedHubs, ...destinationHubs];

  if (hubs.length < MIN_LINKS) {
    const seen = new Set(hubs.map(h => h.href));

    (await topCountryHubs(index, locale, MAX_LINKS)).forEach(h => {
      if (hubs.length < MIN_LINKS && !seen.has(h.href)) hubs.push(h);
    });
  }

  return { hubs: hubs.slice(0, MAX_LINKS), itinerary };
};
