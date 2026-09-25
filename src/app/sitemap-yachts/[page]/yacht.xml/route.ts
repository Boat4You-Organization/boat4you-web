import { NextResponse } from 'next/server';

import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { Currency } from '@/models/user.model';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';

const PROMOTED = Array.from(PROMOTED_COUNTRY_CODES);

// Backend `/public/yachts` silently caps page size at 100 — passing 500
// returned only the first 100 entries per page, dropping the other 80% of
// the catalogue from the sitemap. Match the cap exactly so every yacht
// emits exactly once across the paginated set.
const PAGE_SIZE = 100;

/**
 * ISR, like the other sitemaps (25.9.2026). The shards used to render on
 * every request (build: ƒ) — the list fetch was `no-store` — so each crawl
 * of a shard cost a 100-boat catalogue query: 2–4 s, up to 7.9 s measured.
 * Now a shard renders on its first request, is served from the ISR cache
 * for an hour, and then regenerates in the background.
 *
 * `generateStaticParams` returns nothing on purpose: no build-time render
 * (113 backend queries per build), every shard on demand. `dynamicParams`
 * stays true (the default) — false would turn every shard into a 404 (and
 * break on-demand revalidation, NoFallbackError).
 */
export const revalidate = 3600;
export const dynamicParams = true;

/** Plain shard numbers only; anything else is a small, stable 404. */
const SHARD_PATTERN = /^\d{1,4}$/;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

export async function generateStaticParams() {
  return [];
}

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const { page: pageParam } = await params;

  if (!SHARD_PATTERN.test(pageParam)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const page = Number(pageParam);

  // No catch: ISR caches whatever this handler RETURNS for the hour, a 503
  // included. A backend failure therefore THROWS — a regeneration that
  // throws keeps serving the last good copy, and a first render answers 500
  // (retried by Google) without caching anything. fetchYachts throws on a
  // non-2xx answer, and the Data Cache below stores 200s only.
  //
  // Push the promoted-country whitelist down to the backend so the page
  // returns exactly PAGE_SIZE matching yachts (no client-side trim, no
  // partially-empty pages). Mario decision 4.5.2026. Locale and currency
  // pinned: the XML carries neither.
  const yachtsData = await fetchYachts(
    { locations: [], page: page + 1, size: PAGE_SIZE, countryCodes: PROMOTED },
    Currency.EUR,
    'en',
    { revalidate }
  );

  if (!yachtsData.content || yachtsData.content.length === 0) {
    const total = yachtsData.page?.totalElements ?? 0;

    // A shard past the end of a non-empty catalogue is really gone (the
    // index lists fewer shards now): 404, NOT a 200 with an empty <urlset>,
    // which GSC rejects ("Missing XML tag: parent urlset, tag url").
    if (total > 0 && page * PAGE_SIZE >= total) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // An empty page inside the catalogue — or an empty catalogue — is a
    // backend blip, not a fact to cache for an hour: throw (see above).
    throw new Error(`sitemap-yachts/${page}: empty page, catalogue total ${total}`);
  }

  // No <lastmod>: the list API exposes no per-boat modification date, and
  // a request-time stamp marks every URL as changed on every fetch.
  const urls = yachtsData.content
    .flatMap((yacht: YachtModelShortInfo) =>
      routing.locales.map(locale => {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

        return `  <url>
    <loc>${baseUrl}${prefix}/boat/${yacht.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      })
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(sitemap, { headers: XML_HEADERS });
}
