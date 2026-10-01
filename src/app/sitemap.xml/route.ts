import { fetchSitemapCatalogueTop, yachtShardCount } from '@/utils/server/yachtSitemapShards';

export const revalidate = 3600;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

// No <lastmod> on the child sitemaps: none of them has a real modification
// date (only the blog URLs do, inside sitemap-blogs), and a request-time
// stamp on every fetch teaches Google to ignore the field.
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // One yacht shard per fixed id range of the promoted catalogue, up to its
  // highest id (yachtSitemapShards.ts): the shard a boat sits in never
  // depends on when the index or the shard was rendered.
  //
  // Data Cache + ISR (audit B09, 26.9.2026): the count query used to be
  // `no-store`, which silently made this route dynamic — every fetch of the
  // index Google reads first cost a catalogue query (10.0 s cold, 2.1–2.6 s
  // warm). Now the index is regenerated at most hourly in the background.
  // No catch: ISR caches whatever the handler RETURNS (a 503 included) for
  // the hour; a failure THROWS, so a regeneration keeps the last good index
  // and a first render answers 500 (retried) — same rule as the shards.
  const { maxId } = await fetchSitemapCatalogueTop(revalidate);

  const yachtSitemaps = Array.from(
    { length: yachtShardCount(maxId) },
    (_, i) => `  <sitemap>
    <loc>${baseUrl}/sitemap-yachts/${i}/yacht.xml</loc>
  </sitemap>`
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blogs.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-locations.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-itineraries.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-models.xml</loc>
  </sitemap>
${yachtSitemaps}
</sitemapindex>`;

  return new Response(sitemap, { headers: XML_HEADERS });
}
