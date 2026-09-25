import { loadDestinationIndex } from '@/utils/server/destinationDid';
import { getLandingManifest } from '@/utils/server/landingManifest';
import { EMPTY_URLSET, XML_HEADERS, landingUrlRows, urlset } from '@/utils/server/sitemapXml';

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

  try {
    const index = await loadDestinationIndex();

    if (!index) return new Response(EMPTY_URLSET, { headers: XML_HEADERS });

    const manifest = await getLandingManifest(index);
    const rows = landingUrlRows(baseUrl, manifest.typed);

    return new Response(rows ? urlset(rows) : EMPTY_URLSET, { headers: XML_HEADERS });
  } catch {
    return new Response(EMPTY_URLSET, { headers: XML_HEADERS });
  }
}
