import { getBlogsLastmodStamps } from '@/lib/api';
import { fetchSitemapCatalogueTop, yachtShardCount } from '@/utils/server/yachtSitemapShards';
import { lastmodElement, wpGmtLastmod } from '@/utils/static/sitemapLastmod';

export const revalidate = 3600;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

/** How long the index waits for WordPress before it goes out without the blog <lastmod>. */
const BLOGS_LASTMOD_TIMEOUT_MS = 3000;

/**
 * <lastmod> of the child sitemaps (audit 7.10.2026): only where it is both
 * true and cheap, and never the request time (a stamp that moves on every
 * fetch teaches Google to ignore the field).
 *
 *   - sitemap-blogs: the newest stamp in it — the later of the latest
 *     modified and the latest published post (WordPress GMT, the same
 *     wpGmtLastmod as the blog sitemap's own entries). One small GraphQL
 *     request per regeneration of this index (hourly); left out when
 *     WordPress fails or is slow — the index never waits on or fails for it.
 *   - the yacht shards: none. The newest `updatedAt` of a shard is the max
 *     over its up to ~770 boats; the list API cannot sort or aggregate by it,
 *     so the index would have to read every shard (~125 catalogue requests
 *     per regeneration, seconds of cold first render) — not cheap. Needs a
 *     backend aggregate (newest updatedAt per id range) first.
 *   - static, locations, categories, itineraries, models: none — their
 *     entries carry no modification date to take one from.
 */
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
  const [{ maxId }, blogStamps] = await Promise.all([
    fetchSitemapCatalogueTop(revalidate),
    getBlogsLastmodStamps(revalidate, BLOGS_LASTMOD_TIMEOUT_MS).catch((): string[] => []),
  ]);

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
    <loc>${baseUrl}/sitemap-blogs.xml</loc>${lastmodElement(wpGmtLastmod(...blogStamps))}
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
