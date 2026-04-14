import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { buildMetadata } from '@/utils/static/buildMetadata';
import SearchView from '@/views/Search/SearchView/SearchView';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.search');

  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

interface SearchPageProps {
  searchParams: Promise<AllSearchParams>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <Layout>
      <SearchView searchParams={params} />
    </Layout>
  );
}
