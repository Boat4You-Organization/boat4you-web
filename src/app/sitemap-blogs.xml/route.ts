import { routing } from '@/i18n/routing';
import { getBlogs } from '@/lib/api';
import { BlogTeaser } from '@/types/blog.type';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const blogsData = await getBlogs(100);

  const urls = blogsData.nodes
    .flatMap((blog: BlogTeaser) =>
      routing.locales.map(locale => {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

        return `  <url>
    <loc>${baseUrl}${prefix}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
