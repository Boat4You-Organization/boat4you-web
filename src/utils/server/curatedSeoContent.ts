import { cache } from 'react';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import 'server-only';

import { routing } from '@/i18n/routing';
import { VesselType } from '@/models/yacht.model';
import { resolveCuratedSlugCandidates, sanitizeCuratedHtml } from '@/utils/static/curatedSeoSlug';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';

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
 * The corpus links to search pages in the pre-25.9 `?destinations=Name&did=…`
 * form (some with stale ids, e.g. Croatia → c-98) and always to the English
 * origin. Rewrite those links to the one canonical landing form, under the
 * active locale, so the curated text doesn't feed link equity to noindexed
 * did= URLs.
 */
const rewriteSearchLinks = (html: string, locale: string): string => {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return html.replace(/href="(?:https?:\/\/(?:www\.)?boat4you\.com)?(\/search[^"]*)"/g, (match, target: string) => {
    try {
      const url = new URL(target.replace(/&amp;/g, '&'), SITE_ORIGIN);

      if (url.pathname !== '/search') return match;

      const boatTypes = url.searchParams.get('boatTypes');
      const singleBoatType = boatTypes && !boatTypes.includes(',') ? boatTypes : null;
      const clean = buildSearchLandingPath(url.searchParams.get('destinations'), singleBoatType);

      return `href="${prefix}${clean.replace(/&/g, '&amp;')}"`;
    } catch {
      return match;
    }
  });
};

/**
 * First existing curated file for (destination × boat type) in `locale`,
 * sanitised (body only, first <h1> dropped) and with search links
 * canonicalised. `null` when the corpus has no page for this query.
 * Wrapped in React `cache` so generateMetadata and the page share one lookup.
 */
export const getCuratedSeoHtml = cache(
  async (locale: string, destination: string, boatType: string | null): Promise<string | null> => {
    const candidates = resolveCuratedSlugCandidates(destination, (boatType as VesselType | null) ?? null);
    // Priority order matters (first existing file wins); reads are memoised
    // and cheap, so read them all and take the first hit.
    const files = await Promise.all(candidates.map(slug => readCuratedFile(locale, slug)));
    const raw = files.find((f): f is string => !!f);

    return raw ? rewriteSearchLinks(sanitizeCuratedHtml(raw), locale) : null;
  }
);
