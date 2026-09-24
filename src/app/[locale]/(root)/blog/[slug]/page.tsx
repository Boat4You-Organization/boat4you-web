import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import RelatedItineraries from '@/components/RelatedItineraries';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import { getBlog, getBlogWithSEO } from '@/lib/api';
import { buildBlogPostingLd, extractFaqLd } from '@/utils/static/blogJsonLd';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { decodeHtmlEntities } from '@/utils/static/decodeHtmlEntities';
import { stripBrandSuffix } from '@/utils/static/stripBrandSuffix';
import RelatedBlogSection from '@/views/Blog/RelatedBlogSection';

const SingleBlogContent = dynamic(() => import('@/views/Blog/SingleBlogContent'));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  // WP outage must not 500 the route (the page body calls notFound()).
  const blog = await getBlogWithSEO(slug).catch(() => null);

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
  const { slug } = await params;

  // WP down / GraphQL error → 404, not a 500 across 9 locale URLs.
  const blog = await getBlog(slug, 10).catch(() => null);

  if (!blog?.post) {
    return notFound();
  }

  // BlogPosting (+ FAQPage when the body carries an FAQ section) structured
  // data — the boat/itinerary pages already describe themselves with schema,
  // blog posts were the one editorial surface without it (AI-guide audit 25.8).
  const blogPostingLd = buildBlogPostingLd(blog.post);
  const faqLd = extractFaqLd(blog.post.content);

  return (
    <Layout>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <SingleBlogContent {...blog.post} />
      <RelatedItineraries
        title={blog.post.title}
        slug={blog.post.slug}
        categories={blog.post.categories?.nodes?.map(c => `${c.slug} ${c.name}`)}
      />
      <RelatedBlogSection posts={blog.posts} />
    </Layout>
  );
};

export default SingleBlogPage;
