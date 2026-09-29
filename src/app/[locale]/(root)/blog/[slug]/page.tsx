import { Box, Container } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound, permanentRedirect } from 'next/navigation';

import ExploreBoatsLinks from '@/components/ExploreBoatsLinks';
import Layout from '@/components/Layout';
import RelatedItineraries from '@/components/RelatedItineraries';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import { getBlog, getBlogWithSEO } from '@/lib/api';
import { blogExploreHubs, rewriteBlogCatalogueLinks } from '@/utils/server/blogCatalogueLinks';
import { buildBlogBreadcrumbLd, buildBlogPostingLd, extractFaqLd } from '@/utils/static/blogJsonLd';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { decodeHtmlEntities } from '@/utils/static/decodeHtmlEntities';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { stripBrandSuffix } from '@/utils/static/stripBrandSuffix';
import RelatedBlogSection from '@/views/Blog/RelatedBlogSection';

const SingleBlogContent = dynamic(() => import('@/views/Blog/SingleBlogContent'));

// ISR (audit 29.9.2026, R11): a post cost ≈1.4 s on every request (WordPress
// GraphQL + the catalogue link blocks) and carried no route cache at all.
// The body is editorial, its link blocks read hourly-cached catalogue
// indexes — an hour of route cache changes nothing a reader can see. Rendered
// on demand per slug; a failed revalidation keeps the last good copy.
export const revalidate = 3600;

// No path is prerendered at build time (the list would cost a WordPress
// walk on every build); with an empty list the route is still static-capable,
// so every slug is rendered on first request and then served from the route
// cache (`x-nextjs-cache`). Without generateStaticParams the route stays
// dynamic and `revalidate` only ever applied to the fetches.
export function generateStaticParams() {
  return [];
}

/**
 * Blog bodies exist in English only (WordPress): a locale copy of a post
 * (`/de/blog/<slug>`) is the English article in a German shell. It answers
 * 308 to the English URL (audit R40, QA rule SE2 of 26.9.2026) — the
 * middleware serves `/blog/<slug>` to every visitor without locale
 * detection (englishOnlyRoutes.ts), so the redirect never loops.
 */
const redirectLocaleCopy = (locale: Locale, slug: string): void => {
  if (locale !== routing.defaultLocale) permanentRedirect(`/blog/${slug}`);
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  redirectLocaleCopy(locale, slug);

  // A WordPress outage throws (500, retried by Google; an ISR revalidation
  // keeps the last good copy) — swallowing it here would cache a 404 for a
  // live post for the whole revalidate window. Only an unknown slug is 404.
  const blog = await getBlogWithSEO(slug);

  if (!blog?.post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const { post } = blog;
  const { seo } = post;

  // RankMath ships the brand inside its own titles; the titles we return here
  // are RELATIVE, so the layout template appends it again. Strip it first and
  // the brand lands exactly once, whether or not RankMath included it.
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const titleTemplate = t(meta.titleTemplate);
  const stripBrand = (value: string) => stripBrandSuffix(value, titleTemplate);
  // RankMath output is decoded at the parse source, but the WP GraphQL title
  // used when RankMath is unavailable carries its own entities ("Galley &amp;
  // Food"), so decode the fallback too or that path still double-escapes.
  const postTitle = decodeHtmlEntities(post.title);

  const title = stripBrand(seo?.title || postTitle);
  const description = seo?.description || '';
  const path = `/blog/${post.slug}`;
  const image = {
    src: seo?.og_image || post.featuredImage?.sourceUrl,
    alt: post.featuredImage?.altText || postTitle,
  };

  const baseMetadata = buildMetadata({
    locale: locale as LocaleType,
    title,
    description,
    path,
    image,
  });

  // Blog bodies come from WordPress in ENGLISH ONLY — /nl/blog/<slug> is the
  // same English article inside a Dutch page shell. Self-canonical locale
  // copies made Search Console file 1.3K of them as "Duplicate without
  // user-selected canonical" (24.9.2026). Every locale now points at the one
  // English original, and hreflang lists only that (no fake language
  // versions). Author-supplied canonical (WP-CMS field) still wins. If posts
  // ever get real translations, switch back to per-locale canonicals.
  const canonical = seo?.canonical || localizedUrl(routing.defaultLocale as LocaleType, path);

  return {
    ...baseMetadata,
    alternates: {
      canonical,
      languages: { en: canonical, 'x-default': canonical },
    },
    openGraph: {
      ...baseMetadata.openGraph,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      title: stripBrand(seo?.og_title || seo?.title || postTitle),
      description: seo?.og_description || seo?.description || description,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: stripBrand(seo?.twitter_title || seo?.og_title || seo?.title || postTitle),
      description: seo?.twitter_description || seo?.og_description || seo?.description || description,
      images: seo?.twitter_image ? [seo.twitter_image] : baseMetadata.twitter?.images,
    },
  };
}

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string; locale: Locale }> }) => {
  const { slug, locale } = await params;

  redirectLocaleCopy(locale, slug);

  // Unknown slug → 404; a WordPress error throws (see generateMetadata).
  const blog = await getBlog(slug, 10);

  if (!blog?.post) {
    return notFound();
  }

  // BlogPosting (+ FAQPage when the body carries an FAQ section) structured
  // data — the boat/itinerary pages already describe themselves with schema,
  // blog posts were the one editorial surface without it (AI-guide audit 25.8).
  const blogPostingLd = buildBlogPostingLd(blog.post);
  const breadcrumbLd = buildBlogBreadcrumbLd(blog.post);
  const faqLd = extractFaqLd(blog.post.content);
  const categoryText = blog.post.categories?.nodes?.map(c => `${c.slug} ${c.name}`);

  // Blog → catalogue: dated boat links and noindex `?did=` searches in the
  // WordPress body point at the canonical boat / landing URL, and an
  // "Explore boats" block links the landing hubs the post is about.
  const [content, explore] = await Promise.all([
    rewriteBlogCatalogueLinks(blog.post.content, locale),
    blogExploreHubs(
      { title: blog.post.title, slug: blog.post.slug, content: blog.post.content, categories: categoryText },
      locale
    ).catch(() => null),
  ]);

  return (
    <Layout>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <SingleBlogContent {...blog.post} content={content} />
      {explore && (
        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
          <Box maxWidth={846} marginInline="auto" pb={{ xs: 4, md: 6 }}>
            <ExploreBoatsLinks
              hubs={explore.hubs}
              itinerary={explore.itinerary}
              priceGuides={explore.priceGuides}
              locale={locale}
              lead="leadPost"
            />
          </Box>
        </Container>
      )}
      <RelatedItineraries title={blog.post.title} slug={blog.post.slug} categories={categoryText} locale={locale} />
      <RelatedBlogSection posts={blog.posts} />
    </Layout>
  );
};

export default SingleBlogPage;
