import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import RelatedItineraries from '@/components/RelatedItineraries';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { getBlog, getBlogWithSEO } from '@/lib/api';
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

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      // Author-supplied canonical (WP-CMS field) wins; otherwise fall back to
      // the locale-prefixed URL so each language indexes its own copy.
      canonical: seo?.canonical || localizedUrl(locale as LocaleType, path),
    },
    openGraph: {
      ...baseMetadata.openGraph,
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
    robots: seo?.robots && !seo.robots.includes('noindex') ? seo.robots : { index: true, follow: true },
  };
}

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const blog = await getBlog(slug, 10);

  if (!blog) {
    return notFound();
  }

  return (
    <Layout>
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
