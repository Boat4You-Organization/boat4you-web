import { itineraries } from '@/config/itineraries.config';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

/**
 * Sitemap for the config-driven itinerary pages: the /itineraries hub,
 * every /itineraries/{area} page and every /itineraries/{area}/{route}
 * detail — each in all 9 locales (mirrors sitemap-static's locale-prefix
 * scheme). The URL set is fully static (itineraries.config), so no
 * upstream fetch is needed.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const areas = itineraries.flatMap(group => group.itinerary);
  const pages = [
    { path: '/itineraries', priority: '0.7', changefreq: 'weekly' },
    ...areas.map(area => ({ path: `/itineraries/${area.id}`, priority: '0.6', changefreq: 'weekly' })),
    ...areas.flatMap(area =>
      area.routes.map(route => ({
        path: `/itineraries/${area.id}/${route.id}`,
        priority: '0.6',
        changefreq: 'monthly',
      }))
    ),
  ];

  const urls = pages
    .flatMap(page =>
      routing.locales.map(locale => {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

        return `  <url>
    <loc>${baseUrl}${prefix}${page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      })
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
