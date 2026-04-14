import { NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';

const PAGE_SIZE = 500;

export const revalidate = 3600;

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

export async function generateStaticParams() {
  try {
    const data = await fetchYachts({ locations: [], page: 1, size: 1 });
    const total = data.page?.totalElements ?? 0;
    const pages = Math.ceil(total / PAGE_SIZE);

    return Array.from({ length: pages }, (_, i) => ({
      page: String(i),
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const { page: pageParam } = await params;
    const page = parseInt(pageParam, 10);

    const yachtsData = await fetchYachts({
      locations: [],
      page: page + 1,
      size: PAGE_SIZE,
    });

    if (!yachtsData.content || yachtsData.content.length === 0) {
      return new NextResponse(EMPTY_SITEMAP, { headers: XML_HEADERS });
    }

    const lastmod = new Date().toISOString();

    const urls = yachtsData.content
      .flatMap((yacht: YachtModelShortInfo) =>
        routing.locales.map(locale => {
          const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

          return `  <url>
    <loc>${baseUrl}${prefix}/boat/${yacht.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        })
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(sitemap, { headers: XML_HEADERS });
  } catch {
    return new NextResponse(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }
}
