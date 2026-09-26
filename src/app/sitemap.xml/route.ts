import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { fetchYachts } from '@/services/yacht.service';

// Must match PAGE_SIZE in [page]/yacht.xml/route.ts — backend caps at 100,
// so any larger value over-counts yacht-pages and emits 404s for trailing
// indices that never resolve to a non-empty page.
const PAGE_SIZE = 100;

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

  // Pass the promoted-country whitelist to the backend so totalElements
  // is the EXACT count we'll later index — every sub-sitemap fills up
  // (≈100 URLs per backend page, no empty pages).
  //
  // Data Cache + ISR (audit B09, 26.9.2026): the count query used to be
  // `no-store`, which silently made this route dynamic — every fetch of the
  // index Google reads first cost a catalogue query (10.0 s cold, 2.1–2.6 s
  // warm). Now the index is regenerated at most hourly in the background.
  // No catch: ISR caches whatever the handler RETURNS (a 503 included) for
  // the hour; a failure THROWS, so a regeneration keeps the last good index
  // and a first render answers 500 (retried) — same rule as the shards.
  const promoted = Array.from(PROMOTED_COUNTRY_CODES);
  const data = await fetchYachts({ locations: [], page: 1, size: 1, countryCodes: promoted }, undefined, undefined, {
    revalidate,
  });
  const total = data.page?.totalElements ?? 0;

  if (total <= 0) throw new Error('sitemap.xml: empty catalogue');

  const pages = Math.ceil(total / PAGE_SIZE);

  const yachtSitemaps = Array.from(
    { length: pages },
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
