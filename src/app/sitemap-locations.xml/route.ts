/* eslint-disable no-restricted-syntax */
import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { CountryCountModel, LocationModel } from '@/models/locations.model';
import { loadDestinationIndex, resolveDestinationName } from '@/utils/server/destinationDid';
import { evaluateLanding, mapWithLimit } from '@/utils/server/landingGate';
import { buildSearchLandingPath, destinationSlug, isLandingExpressible } from '@/utils/static/searchLandingPath';

export const revalidate = 3600;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

// Single source of truth for the promoted-country whitelist lives in
// src/config/promoted-countries.config.ts. sitemap-yachts uses the same
// constant so the location sitemap and the yacht sitemap stay aligned.
const DISPLAY_COUNTRY_CODES = PROMOTED_COUNTRY_CODES;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const base = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

  try {
    const [countriesRes, marinasRes] = await Promise.all([
      fetch(`${base}/public/countries-count`, { next: { revalidate: 3600 } }),
      fetch(`${base}/public/locations-count`, { next: { revalidate: 3600 } }),
    ]);

    const countriesJson: CountryCountModel[] = countriesRes.ok ? await countriesRes.json() : [];
    const marinasJson: LocationModel[] = marinasRes.ok ? await marinasRes.json() : [];

    // Filter both lists to countries we actually serve. Country entries use
    // their own countryCode; marina entries inherit the country code of
    // their parent country.
    const countries = (Array.isArray(countriesJson) ? countriesJson : []).filter(
      c => c.countryCode && DISPLAY_COUNTRY_CODES.has(c.countryCode)
    );
    const marinas = (Array.isArray(marinasJson) ? marinasJson : []).filter(
      m => m.countryCode && DISPLAY_COUNTRY_CODES.has(m.countryCode)
    );

    // Merge to a single name list — countries first, marinas after. We dedupe
    // by lowercase name so a marina that shares its country's name (rare but
    // happens in some data sets) doesn't emit two near-identical entries.
    const seen = new Set<string>();
    const candidates: string[] = [];

    for (const item of [...countries, ...marinas]) {
      if (!item.name) continue;

      // A name with a comma reads as two destinations in `?destinations=`
      // (the page noindexes it as a multi-destination combo) — it can't be
      // a landing page, so don't submit it.
      if (!isLandingExpressible(item.name)) continue;

      const key = item.name.toLowerCase();

      if (seen.has(key)) continue;

      seen.add(key);
      candidates.push(item.name);
    }

    // Submit only what /search lets Google index: the shared landing gate
    // (resolves to a place with boats + curated text in that locale), and
    // only the canonical spelling ("Marina Kaštela" folds onto "Marina
    // Kastela", "Lavrion, main port" onto "Lavrion Main Port"). Before this,
    // ~96% of the submitted URLs answered noindex.
    const index = await loadDestinationIndex();

    if (!index) {
      return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
    }

    const gated = await mapWithLimit(candidates, 6, async name => {
      const resolved = await resolveDestinationName(index, name);

      if (!resolved || destinationSlug(resolved.name) !== destinationSlug(name)) return null;

      const gate = await evaluateLanding(resolved, null);

      return gate.indexableLocales.length ? { name: resolved.name, locales: gate.indexableLocales } : null;
    });
    const emitted = new Set<string>();
    const entries = gated.filter((e): e is { name: string; locales: string[] } => {
      if (!e || emitted.has(destinationSlug(e.name))) return false;

      emitted.add(destinationSlug(e.name));

      return true;
    });

    if (entries.length === 0) {
      return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
    }

    const lastmod = new Date().toISOString();

    // Each entry duplicates across the locales that pass the gate (its
    // curated text exists there), mirroring the pattern in
    // sitemap-yachts/sitemap-blogs/sitemap-static. Per-page hreflang is
    // already emitted from buildMetadata.alternates.languages, so we skip
    // inline xhtml:link alternates here (Boataround does the same — they
    // rely on head hreflang, not in-sitemap alternates).
    const urls = entries
      .flatMap(entry =>
        routing.locales
          .filter(locale => entry.locales.includes(locale))
          .map(locale => {
            const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
            // Same builder as the /search canonical + internal links, so the
            // <loc> matches <link rel="canonical"> byte for byte.
            const loc = `${baseUrl}${prefix}${buildSearchLandingPath(entry.name)}`;

            return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
          })
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(sitemap, { headers: XML_HEADERS });
  } catch {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }
}
