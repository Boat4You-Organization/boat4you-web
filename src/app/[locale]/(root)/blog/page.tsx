import { Suspense } from 'react';

import { Container } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import getCountriesCount from '@/actions/locations.actions';
import ExploreBoatsLinks from '@/components/ExploreBoatsLinks';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import blogCategories from '@/config/blogCategories.config';
import { BLOG_PAGE_SIZE } from '@/config/constants.config';
import { LocaleType } from '@/config/locales.config';
import { getBlogs } from '@/lib/api';
import { topCountryHubs } from '@/utils/server/blogCatalogueLinks';
import { loadDestinationIndex } from '@/utils/server/destinationDid';
import { buildMetadata } from '@/utils/static/buildMetadata';

const BlogsSection = dynamic(() => import('@/views/Blog/BlogsSection'));
const BlogHeroSection = dynamic(() => import('@/views/Blog/BlogHeroSection'));
const AllDestinationsSection = dynamic(() => import('@/views/Home/AllDestinationsSection'));

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('metadata.metadata.blog');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const BlogPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) => {
  const { locale } = await params;
  const { category } = await searchParams;
  const activeCategory = blogCategories.some(c => c.slug === category) ? category! : 'all';

  // Server-render the initial post list so the listing HTML carries real
  // /blog/... links (crawlable content + internal linking — Google AI-guide
  // audit 25.8.2026). The client hook takes over for tab switches and
  // pagination; on a WP hiccup the props stay null and it fetches as before.
  const [countriesCount, initialBlogs, exploreHubs] = await Promise.all([
    getCountriesCount(),
    getBlogs(BLOG_PAGE_SIZE, activeCategory === 'all' ? undefined : activeCategory).catch(() => null),
    // "Explore boats" under the post list: the promoted countries with the
    // biggest fleets (indexable landings only).
    loadDestinationIndex()
      .then(index => (index ? topCountryHubs(index, locale, 6) : []))
      .catch(() => []),
  ]);

  const initial = initialBlogs
    ? {
        category: activeCategory,
        blogs: initialBlogs.nodes,
        nextPage: initialBlogs.pageInfo.hasNextPage ? initialBlogs.pageInfo.endCursor : null,
        hasNextPage: initialBlogs.pageInfo.hasNextPage,
      }
    : undefined;

  return (
    <Suspense fallback={<LoadingSection />}>
      <Layout>
        <BlogHeroSection initialFeatured={activeCategory === 'all' ? initial?.blogs[0] : undefined} />
        <BlogsSection initial={initial} />
        <Container maxWidth="xl" sx={{ pb: { xs: 4, md: 6 } }}>
          <ExploreBoatsLinks hubs={exploreHubs} locale={locale} lead="leadIndex" />
        </Container>
        <AllDestinationsSection countries={countriesCount} />
      </Layout>
    </Suspense>
  );
};

export default BlogPage;
