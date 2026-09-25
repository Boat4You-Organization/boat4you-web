import { loadDestinationIndex } from '@/utils/server/destinationDid';
import { getLandingManifest } from '@/utils/server/landingManifest';
import { EMPTY_URLSET, XML_HEADERS, landingUrlRows, urlset } from '@/utils/server/sitemapXml';

export const revalidate = 3600;

/**
 * Destination landings (country, region, base) — every place of the curated
 * corpus whose landing passes the shared index gate (landingGate.ts, the
 * same predicate as the /search robots tag), built from the corpus manifest
 * (landingManifest.ts). Before 25.9.2026 wave 2 this sitemap only tried the
 * countries and the marinas whose catalogue name happened to match a file
 * name (19 places), leaving the ~90 region overviews out.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const index = await loadDestinationIndex();

    if (!index) return new Response(EMPTY_URLSET, { headers: XML_HEADERS });

    const manifest = await getLandingManifest(index);

    // Ops hook: `SEO_MANIFEST_REPORT=1` logs the corpus files that produce no
    // landing (alias upkeep, see curatedSeoSlug.ts DESTINATION_ALIAS).
    if (process.env.SEO_MANIFEST_REPORT === '1') {
      // eslint-disable-next-line no-console
      console.info(`[seo-manifest] ${JSON.stringify(manifest.report)}`);
    }

    const rows = landingUrlRows(baseUrl, manifest.destinations);

    return new Response(rows ? urlset(rows) : EMPTY_URLSET, { headers: XML_HEADERS });
  } catch {
    return new Response(EMPTY_URLSET, { headers: XML_HEADERS });
  }
}
