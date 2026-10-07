/* eslint-disable no-await-in-loop */
import { getBlogs } from '@/lib/api';
import { BlogTeaser } from '@/types/blog.type';
import { lastmodElement, wpGmtLastmod } from '@/utils/static/sitemapLastmod';

export const dynamic = 'force-dynamic';

// Hard ceiling — protects the WP GraphQL endpoint from a runaway loop if
// pageInfo.hasNextPage somehow returns true forever. 5,000 posts = 5,000
// URLs, well under the per-sitemap 50k limit. If we ever cross
// this, paginate this sitemap into sitemap-blogs/[page]/blog.xml the same
// way sitemap-yachts is paginated.
const MAX_POSTS = 5000;
const POSTS_PER_PAGE = 100;

async function fetchAllBlogs(): Promise<BlogTeaser[]> {
  const all: BlogTeaser[] = [];
  let cursor: string | undefined;

  while (all.length < MAX_POSTS) {
    const data = await getBlogs(POSTS_PER_PAGE, undefined, cursor);
    const nodes = (data?.nodes || []) as BlogTeaser[];

    if (nodes.length === 0) break;

    all.push(...nodes);

    const { pageInfo } = data as unknown as { pageInfo?: { endCursor?: string; hasNextPage?: boolean } };

    if (!pageInfo?.hasNextPage) break;

    cursor = pageInfo.endCursor;

    if (!cursor) break;
  }

  return all;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const blogs = await fetchAllBlogs();

  // English URLs only. Post bodies are English-only, so the eight locale
  // copies canonicalise to the English original (see blog/[slug]/page.tsx) —
  // a sitemap must list canonical URLs, not their duplicates.
  //
  // <lastmod>: the later of WordPress's GMT publish and modify stamps (a
  // scheduled post was last modified before it went out), in UTC; left out
  // when WordPress sends neither (sitemapLastmod.ts). Never `date`, which is
  // WordPress local time, and never a throw: one bad stamp must not turn the
  // whole sitemap into a 500.
  const urls = blogs
    .map(
      (blog: BlogTeaser) => `  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>${lastmodElement(wpGmtLastmod(blog.dateGmt, blog.modifiedGmt))}
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
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
