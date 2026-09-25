import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { CountryCountModel } from '@/models/locations.model';
import { VesselType } from '@/models/yacht.model';
import { loadDestinationIndex, resolveDestinationName } from '@/utils/server/destinationDid';
import { evaluateLanding, mapWithLimit } from '@/utils/server/landingGate';
import { buildSearchLandingPath, destinationSlug } from '@/utils/static/searchLandingPath';

export const revalidate = 3600;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

// XML-escape <loc> contents. Query-string URLs contain a literal `&`
// (the `destinations=…&boatTypes=…` separator), and `&` is reserved in
// XML — an unescaped one makes the whole sitemap unparseable (GSC
// "Sitemap can be read, but has errors → Parsing error, line 4"). Escape
// `&` first so we don't double-encode the entities we introduce.
const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Per-vessel-type × per-country SEO landings — Google rewards specific
// "catamaran charter Croatia" / "gulet rental Greece" style intent. Both
// `destinations` and `boatTypes` are canonical-aware in /search
// generateMetadata so each URL self-canonicalizes and stays index-eligible.
//
// Strategy:
//   * 12 vessel types × 12 promoted countries × 9 locales, filtered through
//     the shared landing gate (landingGate.ts, same predicate as the /search
//     robots tag): boats OF THAT TYPE in the country AND a boat-type-specific
//     curated page in that locale. A combo with only the country overview
//     text (the same body as the country landing) or with 0 boats of the
//     type ("No exact matches") is noindex, so it is not submitted.
//   * No global "boatTypes only" URLs — those would surface yachts from
//     non-promoted countries (Norway, Australia, …) and dilute the
//     promoted-country positioning. Country-anchored URLs always honour
//     the whitelist.
const VESSEL_TYPES = Object.values(VesselType);

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiBase = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const lastmod = new Date().toISOString();

  // Pull country names from /public/countries-count. We only emit URLs
  // for countries that (a) sit in the promoted whitelist AND (b) actually
  // exist in the catalogue today. Falls back to the empty sitemap on
  // backend hiccup so the build doesn't break.
  let promotedCountryNames: string[] = [];

  try {
    const res = await fetch(`${apiBase}/public/countries-count`, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json: CountryCountModel[] = await res.json();

      promotedCountryNames = (Array.isArray(json) ? json : [])
        .filter(c => c.countryCode && PROMOTED_COUNTRY_CODES.has(c.countryCode))
        .map(c => c.name)
        .filter((n): n is string => Boolean(n));
    }
  } catch {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  if (promotedCountryNames.length === 0) {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  const index = await loadDestinationIndex();

  if (!index) {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  const combos = VESSEL_TYPES.flatMap(type => promotedCountryNames.map(country => ({ country, type })));
  const gated = await mapWithLimit(combos, 6, async ({ country, type }) => {
    const resolved = await resolveDestinationName(index, country);

    // Only the canonical spelling is submitted.
    if (!resolved || destinationSlug(resolved.name) !== destinationSlug(country)) return [];

    const gate = await evaluateLanding(resolved, type);

    return gate.indexableLocales.map(locale => ({ name: resolved.name, type, locale }));
  });

  const urls = gated
    .flat()
    .map(({ name, type, locale }) => {
      const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
      // Same builder as the /search canonical + internal links.
      const loc = `${baseUrl}${prefix}${buildSearchLandingPath(name, type)}`;

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join('\n');

  if (!urls) {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, { headers: XML_HEADERS });
}
