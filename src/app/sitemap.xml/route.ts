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

const FALLBACK_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>`;

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const lastmod = new Date().toISOString();

    // Pass the promoted-country whitelist to the backend so totalElements
    // is the EXACT count we'll later index — every sub-sitemap fills up
    // (≈100 URLs per backend page, no empty pages).
    const promoted = Array.from(PROMOTED_COUNTRY_CODES);
    const data = await fetchYachts({ locations: [], page: 1, size: 1, countryCodes: promoted });
    const total = data.page?.totalElements ?? 0;
    const pages = Math.ceil(total / PAGE_SIZE);

    const yachtSitemaps = Array.from(
      { length: pages },
      (_, i) => `  <sitemap>
    <loc>${baseUrl}/sitemap-yachts/${i}/yacht.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    ).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blogs.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-locations.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-itineraries.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
${yachtSitemaps}
</sitemapindex>`;

    return new Response(sitemap, { headers: XML_HEADERS });
  } catch {
    return new Response(FALLBACK_SITEMAP, { headers: XML_HEADERS });
  }
}
