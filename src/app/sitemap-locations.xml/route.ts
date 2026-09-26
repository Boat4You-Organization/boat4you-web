import { requireDestinationIndex } from '@/utils/server/destinationDid';
import { getLandingManifest } from '@/utils/server/landingManifest';
import { XML_HEADERS, landingUrlRows, urlset } from '@/utils/server/sitemapXml';

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

  // No catch (audit B08): ISR caches whatever this handler RETURNS for the
  // hour, so an empty <urlset> after a backend blip told Google every landing
  // was gone. A failure THROWS instead — a regeneration that throws keeps
  // serving the last good copy, a first render answers 500 (retried). Same
  // rule as sitemap-yachts. requireDestinationIndex and the landing gate
  // throw on an outage; an empty manifest is never a real answer either.
  const index = await requireDestinationIndex();
  const manifest = await getLandingManifest(index);

  // Ops hook: `SEO_MANIFEST_REPORT=1` logs the corpus files that produce no
  // landing (alias upkeep, see curatedSeoSlug.ts DESTINATION_ALIAS).
  if (process.env.SEO_MANIFEST_REPORT === '1') {
    // eslint-disable-next-line no-console
    console.info(`[seo-manifest] ${JSON.stringify(manifest.report)}`);
  }

  const rows = landingUrlRows(baseUrl, manifest.destinations);

  if (!rows) throw new Error('sitemap-locations: no indexable destination landing');

  return new Response(urlset(rows), { headers: XML_HEADERS });
}
