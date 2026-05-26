import { Suspense } from 'react';

import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import getCountriesCount from '@/actions/locations.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import { LocaleType } from '@/config/locales.config';
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

const BlogPage = async () => {
  const countriesCount = await getCountriesCount();

  return (
    <Suspense fallback={<LoadingSection />}>
      <Layout>
        <BlogHeroSection />
        <BlogsSection />
        <AllDestinationsSection countries={countriesCount} />
      </Layout>
    </Suspense>
  );
};

export default BlogPage;
