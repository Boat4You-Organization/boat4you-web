/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { routing } from '@/i18n/routing';
import { loadModelCatalog } from '@/utils/server/modelCatalog';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { yachtsIndexPath } from '@/utils/static/yachtModelKey';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import ModelsIndexView from '@/views/Models/ModelsIndexView';

/** /yachts — the index of model pages, grouped by brand. */
export const revalidate = 43200;

interface ModelsIndexPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ModelsIndexPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const catalog = await loadModelCatalog();

  if (!catalog.models.length) notFound();

  const t = await getTranslations({ locale, namespace: 'models' });

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('meta.indexTitle', { models: catalog.models.length }),
    description: t('meta.indexDescription', { models: catalog.models.length }),
    path: yachtsIndexPath(),
  });
}

const ModelsIndexPage = async ({ params }: ModelsIndexPageProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const catalog = await loadModelCatalog();

  if (!catalog.models.length) notFound();

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'models' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const breadcrumb: Crumb[] = [{ name: tCommon('home'), href: '/' }, { name: t('yachtModels') }];
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale as LocaleType, crumb.href ?? yachtsIndexPath()),
    })),
  };
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('index.h1'),
    numberOfItems: catalog.models.length,
    itemListElement: catalog.models.map((model, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localizedUrl(locale as LocaleType, model.path),
      name: model.displayName,
    })),
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListLd) }} />
      <ModelsIndexView locale={locale} catalog={catalog} breadcrumb={breadcrumb} />
    </Layout>
  );
};

export default ModelsIndexPage;
