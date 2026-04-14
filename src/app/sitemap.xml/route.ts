import { fetchYachts } from '@/services/yacht.service';

const PAGE_SIZE = 500;

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

    const data = await fetchYachts({ locations: [], page: 1, size: 1 });
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
${yachtSitemaps}
</sitemapindex>`;

    return new Response(sitemap, { headers: XML_HEADERS });
  } catch {
    return new Response(FALLBACK_SITEMAP, { headers: XML_HEADERS });
  }
}
