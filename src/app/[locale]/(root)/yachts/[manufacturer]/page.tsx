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
import { countryLandingPath } from '@/utils/server/landingLinks';
import { findCatalogBrand, loadModelCatalog, loadModelFleet } from '@/utils/server/modelCatalog';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { computeModelFleetStats } from '@/utils/static/modelFleetStats';
import { isModelSlug, manufacturerPath, yachtsIndexPath } from '@/utils/static/yachtModelKey';
import BrandHubView, { BrandHubModel, BrandWhereRow } from '@/views/Models/BrandHubView';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import { ModelsFaqEntry, modelsFaqSchema } from '@/views/Models/ModelsFaq';
import { COUNTRY_LABEL_KEY } from '@/views/Models/modelsText';

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

  // The brand's whole fleet (all its boats, the listing facets), not just the
  // boats of its model pages — the hub said "5 models, 1,156 boats" for
  // Lagoon's ~1,800 (audit B33). The model pages' sum is the floor.
  const modelBoats = models.reduce((sum, m) => sum + m.stats.boats, 0);

  return { brand, models, totalBoats: Math.max(brand.total, modelBoats) };
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

  const [t, tCommon, tHome] = await Promise.all([
    getTranslations({ locale, namespace: 'models' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'home' }),
  ]);
  const path = manufacturerPath(data.brand.brandSlug);
  const brandName = data.brand.brand;
  const list = (items: string[]) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
  const num = (n: number) => n.toLocaleString(locale);
  const eur = (n: number) => formatPriceWithCurrency({ clientPriceEur: Math.round(n), locale });

  // Where the brand's model pages have their boats: the model fleets summed
  // per promoted country (the same rows as each model page's table).
  const byCountry = new Map<string, number>();

  data.models.forEach(({ stats }) =>
    stats.countries.forEach(c => byCountry.set(c.countryCode, (byCountry.get(c.countryCode) ?? 0) + c.count))
  );

  const where: BrandWhereRow[] = await Promise.all(
    Array.from(byCountry.entries())
      .filter(([code]) => COUNTRY_LABEL_KEY[code])
      .sort((a, b) => b[1] - a[1])
      .map(async ([code, count]) => ({
        countryCode: code,
        label: tHome(`destinationsSection.destinations.${COUNTRY_LABEL_KEY[code]}` as never),
        count,
        href: await countryLandingPath(code, locale),
      }))
  );

  // Data-driven FAQ: fleet size, price band, bases and the booking rule.
  const faq: ModelsFaqEntry[] = [
    {
      question: t('brand.faqCountQ', { brand: brandName }),
      answer: t('brand.faqCountA', {
        brand: brandName,
        count: data.totalBoats,
        models: list(data.models.map(m => m.model.displayName)),
      }),
    },
  ];
  const priced = data.models.filter(m => m.stats.weeklyPrice);

  if (priced.length) {
    const cheapest = [...priced].sort((a, b) => a.stats.weeklyPrice!.p25 - b.stats.weeklyPrice!.p25)[0];

    faq.push({
      question: t('brand.faqPriceQ', { brand: brandName }),
      answer: t('brand.faqPriceA', {
        brand: brandName,
        low: eur(Math.min(...priced.map(m => m.stats.weeklyPrice!.p25))),
        high: eur(Math.max(...priced.map(m => m.stats.weeklyPrice!.p75))),
        cheapest: cheapest.model.displayName,
        cheapestLow: eur(cheapest.stats.weeklyPrice!.p25),
        cheapestHigh: eur(cheapest.stats.weeklyPrice!.p75),
      }),
    });
  }

  if (where.length) {
    faq.push({
      question: t('brand.faqWhereQ', { brand: brandName }),
      answer: t('brand.faqWhereA', {
        brand: brandName,
        countries: list(where.map(row => `${row.label} (${num(row.count)})`)),
        top: where[0].label,
        topCount: where[0].count,
      }),
    });
  }

  faq.push({ question: t('faqCancelQ', { name: brandName }), answer: t('faqCancelA') });

  const faqLd = modelsFaqSchema(faq);
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
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }} />}
      <BrandHubView
        locale={locale}
        brand={data.brand}
        models={data.models}
        totalBoats={data.totalBoats}
        breadcrumb={breadcrumb}
        where={where}
        faq={faq}
      />
    </Layout>
  );
};

export default BrandPage;
