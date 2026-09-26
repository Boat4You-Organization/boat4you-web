import { requireDestinationIndex } from '@/utils/server/destinationDid';
import { getLandingManifest } from '@/utils/server/landingManifest';
import { XML_HEADERS, landingUrlRows, urlset } from '@/utils/server/sitemapXml';

export const revalidate = 3600;

/**
 * Destination × boat-type landings (`/search?destinations=x&boatTypes=Y`)
 * from the corpus manifest: every country, region or base with a boat-type
 * page in the curated corpus whose landing passes the shared index gate —
 * at least MIN_LANDING_FLEET boats of that type and the type page is its
 * own text (landingGate.ts). A combo with only the destination overview
 * (the same body as the destination landing) or too few boats of the type
 * is noindex, so it is not submitted. No "boat type only" URLs: those
 * surface boats from outside the promoted countries.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // No catch (audit B08) — see sitemap-locations: a failure throws, so ISR
  // keeps the last good copy instead of caching an empty <urlset> for an hour.
  const index = await requireDestinationIndex();
  const manifest = await getLandingManifest(index);
  const rows = landingUrlRows(baseUrl, manifest.typed);

  if (!rows) throw new Error('sitemap-categories: no indexable destination × boat type landing');

  return new Response(urlset(rows), { headers: XML_HEADERS });
}
