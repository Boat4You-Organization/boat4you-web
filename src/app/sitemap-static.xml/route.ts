import { PROMO_CAMPAIGNS } from '@/config/campaigns.config';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const pages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.7', changefreq: 'daily' },
    { path: '/about-us', priority: '0.5', changefreq: 'weekly' },
    { path: '/contact-us', priority: '0.5', changefreq: 'monthly' },
    { path: '/faq', priority: '0.5', changefreq: 'monthly' },
    { path: '/how-we-work', priority: '0.3', changefreq: 'yearly' },
    { path: '/privacy-policy', priority: '0.4', changefreq: 'monthly' },
    { path: '/terms-and-conditions', priority: '0.4', changefreq: 'monthly' },
    { path: '/search', priority: '0.4', changefreq: 'monthly' },
    ...PROMO_CAMPAIGNS.map(({ slug }) => ({ path: `/deals/${slug}`, priority: '0.7', changefreq: 'daily' })),
  ];

  const urls = pages
    .flatMap(page =>
      routing.locales.map(locale => {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
        const loc = page.path === '/' ? `${baseUrl}${prefix || '/'}` : `${baseUrl}${prefix}${page.path}`;

        return `  <url>
    <loc>${loc}</loc>
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
