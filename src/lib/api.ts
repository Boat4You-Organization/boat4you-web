import { RankMathSEOData } from '@/types/blog.type';
import { CursorConnectionUtils } from '@/utils/static/CursorConnectionUtils';

import fetchAPI from './fetchApi';
import {
  GET_ALL_BLOGS,
  GET_BLOG,
  GetBlogAndRelatedBlogsResult,
  GetBlogsResult,
  GetUnwrapedBlogAndRelatedBlogsResult,
} from './queries';

// The blog content + images live on WordPress (wp.boat4you.com). We never want
// that origin to reach the browser or Google — every image src / content link /
// og:image is rewritten to the main domain, which proxies /wp-content/ back to
// WP via nginx (cusma1). Host-swap (not strip-to-relative) so og:image stays an
// absolute URL. Recurses through every string in the fetched payload. (Mario
// 1.6.2026: "wp. se ne smije nigdje vidit".)
const WP_HOST = 'wp.boat4you.com';
const PUBLIC_HOST = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boat4you.com')
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '');

function swapWpHost<T>(value: T): T {
  if (typeof value === 'string') {
    return value.split(WP_HOST).join(PUBLIC_HOST) as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map(swapWpHost) as unknown as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swapWpHost(v)])) as T;
  }

  return value;
}

export async function getRankMathSEO(url: string): Promise<RankMathSEOData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');

    if (!baseUrl) {
      return null;
    }

    const apiUrl = `${baseUrl}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.head) {
      return null;
    }

    const parseHtml = (html: string) => {
      const getMetaContent = (selector: string) => {
        const regex = new RegExp(`<${selector}\\s+[^>]*content=["']([^"']*)["']`, 'i');
        const match = html.match(regex);

        return match ? match[1] : undefined;
      };

      const getTitle = () => {
        const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);

        return match ? match[1] : undefined;
      };

      const getCanonical = () => {
        const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);

        return match ? match[1] : undefined;
      };

      const getRobots = () => {
        const match = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);

        return match ? match[1] : undefined;
      };

      const getJsonLd = () => {
        const matches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

        if (!matches) return undefined;

        return (
          matches
            .map(script => {
              const contentMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

              return contentMatch ? contentMatch[1].trim() : null;
            })
            .filter(Boolean)
            .join('\n') || undefined
        );
      };

      return {
        title: getTitle(),
        description: getMetaContent('meta name="description"'),
        canonical: getCanonical(),
        robots: getRobots(),
        og_title: getMetaContent('meta property="og:title"'),
        og_description: getMetaContent('meta property="og:description"'),
        og_image: getMetaContent('meta property="og:image"'),
        twitter_title: getMetaContent('meta name="twitter:title"'),
        twitter_description: getMetaContent('meta name="twitter:description"'),
        twitter_image: getMetaContent('meta name="twitter:image"'),
        jsonld: getJsonLd(),
      };
    };

    const result = parseHtml(data.head);

    return result;
  } catch (error) {
    return null;
  }
}

export async function getBlogs(pageSize: number, categoryName?: string, after?: string) {
  const variables = { categoryName, pageSize, after };

  const data = await fetchAPI<GetBlogsResult>(GET_ALL_BLOGS, { variables });

  return swapWpHost(CursorConnectionUtils.unwrapNodesAndEdges(data.posts));
}

export async function getBlog(id: string, pageSize: number): Promise<GetUnwrapedBlogAndRelatedBlogsResult | null> {
  const variables = { id, pageSize };

  const data = await fetchAPI<GetBlogAndRelatedBlogsResult>(GET_BLOG, { variables });

  if (!data.post) {
    return null;
  }

  const relatedData = data.posts.nodes.filter(post => post.id !== data.post.id);

  return swapWpHost({
    post: CursorConnectionUtils.unwrapNodesAndEdges(data.post),
    posts: CursorConnectionUtils.unwrapNodesAndEdges(relatedData),
  });
}

export async function getBlogWithSEO(slug: string) {
  const blogData = await getBlog(slug, 10);

  if (!blogData?.post) return blogData;

  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/graphql', '');
  const fullUrl = `${baseUrl}/blog/${slug}/`;

  const seoData = await getRankMathSEO(fullUrl);

  return {
    ...blogData,
    post: {
      ...blogData.post,
      seo: swapWpHost(seoData),
    },
  };
}
