/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { isPromotedCountry } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { MIN_LANDING_FLEET, mapWithLimit } from '@/utils/server/landingGate';
import { findCatalogBrand, loadModelCatalog, loadModelFleet } from '@/utils/server/modelCatalog';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { computeModelFleetStats } from '@/utils/static/modelFleetStats';
import { isModelSlug, manufacturerPath, yachtsIndexPath } from '@/utils/static/yachtModelKey';
import BrandHubView, { BrandHubModel } from '@/views/Models/BrandHubView';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';

/**
 * Brand hub, e.g. /yachts/lagoon. Exists only for a brand with at least two
 * model pages (a one-model hub would repeat that page); every model shown
 * links to its model page. Figures come from the same cached fleet reads as
 * the model pages.
 */
export const revalidate = 43200;

interface BrandPageProps {
  params: Promise<{ locale: Locale; manufacturer: string }>;
}

const loadBrandData = async (brandSlug: string) => {
  if (!isModelSlug(brandSlug)) return null;

  const catalog = await loadModelCatalog();
  const brand = findCatalogBrand(catalog, brandSlug);

  if (!brand?.hasHub) return null;

  const models: BrandHubModel[] = (
    await mapWithLimit(brand.models, 2, async model => {
      const fleet = await loadModelFleet(model);

      return { model, stats: computeModelFleetStats(fleet.boats, fleet.total, isPromotedCountry) };
    })
  ).filter(m => m.stats.boats >= MIN_LANDING_FLEET);

  if (models.length < 2) return null;

  return { brand, models, totalBoats: models.reduce((sum, m) => sum + m.stats.boats, 0) };
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { locale, manufacturer } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadBrandData(manufacturer);

  if (!data) notFound();

  const t = await getTranslations({ locale, namespace: 'models' });
  const values = { brand: data.brand.brand, models: data.models.length, count: data.totalBoats };

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('meta.brandTitle', values),
    description: t('meta.brandDescription', values),
    path: manufacturerPath(data.brand.brandSlug),
  });
}

const BrandPage = async ({ params }: BrandPageProps) => {
  const { locale, manufacturer } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadBrandData(manufacturer);

  if (!data) notFound();

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'models' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const path = manufacturerPath(data.brand.brandSlug);
  const breadcrumb: Crumb[] = [
    { name: tCommon('home'), href: '/' },
    { name: t('yachtModels'), href: yachtsIndexPath() },
    { name: data.brand.brand },
  ];
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale as LocaleType, crumb.href ?? path),
    })),
  };
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('brand.modelsHeading', { brand: data.brand.brand }),
    numberOfItems: data.models.length,
    itemListElement: data.models.map(({ model }, i) => ({
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
      <BrandHubView
        locale={locale}
        brand={data.brand}
        models={data.models}
        totalBoats={data.totalBoats}
        breadcrumb={breadcrumb}
      />
    </Layout>
  );
};

export default BrandPage;
