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
import { countryLandingPath, gatedLandingPath } from '@/utils/server/landingLinks';
import {
  findCatalogBrand,
  findCatalogModel,
  findModelBlogPost,
  loadModelCatalog,
  loadModelFleet,
  loadTypicalLayout,
} from '@/utils/server/modelCatalog';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { computeModelFleetStats } from '@/utils/static/modelFleetStats';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { isModelSlug, manufacturerPath, yachtsIndexPath } from '@/utils/static/yachtModelKey';
import ModelPageView, { WhereRow } from '@/views/Models/ModelPageView';
import { ModelsFaqEntry, modelsFaqSchema } from '@/views/Models/ModelsFaq';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import { COUNTRY_LABEL_KEY, formatRange } from '@/views/Models/modelsText';

/**
 * Model page, e.g. /yachts/lagoon/lagoon-42. Only the models modelCatalog.ts
 * ranks (top MODEL_PAGE_LIMIT, ≥ MIN_LANDING_FLEET active boats) exist;
 * anything else is a 404. ISR: the fleet behind a page is re-read at most
 * twice a day.
 */
// Same period as MODEL_FLEET_REVALIDATE_SECONDS (segment config must be a literal).
export const revalidate = 43200;

/** Boat cards on the page (the rest is one click away on /search). */
const GRID_SIZE = 24;
const BASES_PER_COUNTRY = 3;

interface ModelPageProps {
  params: Promise<{ locale: Locale; manufacturer: string; model: string }>;
}

const loadPageData = async (manufacturer: string, modelSlug: string) => {
  if (!isModelSlug(manufacturer) || !isModelSlug(modelSlug)) return null;

  const catalog = await loadModelCatalog();
  const model = findCatalogModel(catalog, manufacturer, modelSlug);

  if (!model) return null;

  const fleet = await loadModelFleet(model);

  // The catalogue ranks on a once-a-day aggregate; the page re-checks the
  // live fleet so a model that dropped under the threshold stops rendering.
  if (fleet.total < MIN_LANDING_FLEET) return null;

  const stats = computeModelFleetStats(fleet.boats, fleet.total, isPromotedCountry);
  const brand = findCatalogBrand(catalog, model.brandSlug);

  return { catalog, model, fleet, stats, brand };
};

export async function generateMetadata({ params }: ModelPageProps): Promise<Metadata> {
  const { locale, manufacturer, model: modelSlug } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadPageData(manufacturer, modelSlug);

  if (!data) notFound();

  const { model, stats } = data;
  const [t, tHome] = await Promise.all([
    getTranslations({ locale, namespace: 'models' }),
    getTranslations({ locale, namespace: 'home' }),
  ]);
  const countries = stats.countries
    .slice(0, 3)
    .map(c => tHome(`destinationsSection.destinations.${COUNTRY_LABEL_KEY[c.countryCode]}` as never))
    .join(', ');
  const values = {
    model: model.displayName,
    count: stats.boats,
    cabins: formatRange(stats.cabins) ?? '',
    years: formatRange(stats.buildYear) ?? '',
    countries,
  };
  // The typical band (p25–p75), as on the page — not "from p25", which the
  // cheaper boat cards on the same page would contradict.
  const description = stats.weeklyPrice
    ? t('meta.modelDescription', {
        ...values,
        p25: formatPriceWithCurrency({ clientPriceEur: stats.weeklyPrice.p25, locale }),
        p75: formatPriceWithCurrency({ clientPriceEur: stats.weeklyPrice.p75, locale }),
      })
    : t('meta.modelDescriptionNoPrice', values);

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('meta.modelTitle', { model: model.displayName, count: stats.boats }),
    description,
    path: model.path,
  });
}

const ModelPage = async ({ params }: ModelPageProps) => {
  const { locale, manufacturer, model: modelSlug } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadPageData(manufacturer, modelSlug);

  if (!data) notFound();

  const { model, fleet, stats, brand } = data;
  const [t, tHome, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'models' }),
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const shownCountries = stats.countries.filter(c => COUNTRY_LABEL_KEY[c.countryCode]);
  const [where, layout, blogPost] = await Promise.all([
    mapWithLimit(
      shownCountries,
      4,
      async (country): Promise<WhereRow> => ({
        countryCode: country.countryCode,
        label: tHome(`destinationsSection.destinations.${COUNTRY_LABEL_KEY[country.countryCode]}` as never),
        // The model's boat-type landing where it is indexable ("catamaran
        // charter in Croatia"), else the place's own landing, else no link.
        href:
          (stats.vesselType && (await countryLandingPath(country.countryCode, locale, stats.vesselType))) ||
          (await countryLandingPath(country.countryCode, locale)),
        count: country.count,
        bases: await Promise.all(
          country.bases.slice(0, BASES_PER_COUNTRY).map(async base => ({
            name: base.name,
            count: base.count,
            href:
              (stats.vesselType && (await gatedLandingPath(base.did, base.name, locale, stats.vesselType))) ||
              (await gatedLandingPath(base.did, base.name, locale)),
          }))
        ),
      })
    ),
    loadTypicalLayout(fleet.boats),
    findModelBlogPost(model.displayName),
  ]);

  // Data-driven FAQ (audit B51): price band, bases, layout, build years and
  // the booking rule — from the same figures the page shows above.
  const list = (items: string[]) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
  const num = (n: number) => n.toLocaleString(locale);
  const eur = (n: number) => formatPriceWithCurrency({ clientPriceEur: Math.round(n), locale });
  const faq: ModelsFaqEntry[] = [];
  const name = model.displayName;

  if (stats.weeklyPrice) {
    faq.push({
      question: t('model.faqPriceQ', { model: name }),
      answer: t('model.faqPriceA', {
        model: name,
        p25: eur(stats.weeklyPrice.p25),
        p75: eur(stats.weeklyPrice.p75),
        n: stats.weeklyPrice.n,
      }),
    });
  }

  if (where.length) {
    const topBases = where
      .flatMap(row => row.bases)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(base => `${base.name} (${num(base.count)})`);

    faq.push({
      question: t('model.faqWhereQ', { model: name }),
      answer: [
        t('model.faqWhereA', { model: name, countries: list(where.map(row => `${row.label} (${num(row.count)})`)) }),
        topBases.length ? t('model.faqWhereBases', { bases: list(topBases) }) : null,
      ]
        .filter(Boolean)
        .join(' '),
    });
  }

  if (stats.cabins && stats.guests) {
    faq.push({
      question: t('model.faqLayoutQ', { model: name }),
      answer: [
        t('model.faqLayoutA', {
          model: name,
          cabins: formatRange(stats.cabins) ?? '',
          guests: formatRange(stats.guests) ?? '',
        }),
        layout.berths && layout.wc ? t('model.faqLayoutCommon', { berths: layout.berths, wc: layout.wc }) : null,
      ]
        .filter(Boolean)
        .join(' '),
    });
  }

  if (stats.buildYear) {
    faq.push({
      question: t('model.faqYearsQ', { model: name }),
      answer:
        stats.buildYear.min === stats.buildYear.max
          ? t('model.faqYearA', { model: name, year: String(stats.buildYear.min) })
          : t('model.faqYearsA', { model: name, from: String(stats.buildYear.min), to: String(stats.buildYear.max) }),
    });
  }

  faq.push({ question: t('faqCancelQ', { name }), answer: t('faqCancelA') });

  const faqLd = modelsFaqSchema(faq);

  const boats = fleet.boats.slice(0, GRID_SIZE);
  const brandHref = brand?.hasHub ? manufacturerPath(brand.brandSlug) : null;
  const breadcrumb: Crumb[] = [
    { name: tCommon('home'), href: '/' },
    { name: t('yachtModels'), href: yachtsIndexPath() },
    ...(brandHref && brand ? [{ name: brand.brand, href: brandHref }] : []),
    { name: model.displayName },
  ];
  const otherModels = (brand?.models ?? []).filter(m => m.path !== model.path);
  // /search has no country filter, so it lists the model worldwide — the
  // button therefore names no count (the page counts the 12 promoted countries).
  const showAllHref = `/search?mid=${model.modelIds.join(',')}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale as LocaleType, crumb.href ?? model.path),
    })),
  };
  // The boats shown on the page, as links — deliberately no Product/Offer
  // markup here (prices are per boat and per week; the boat pages carry it).
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('model.boatsHeading', { model: model.displayName }),
    numberOfItems: boats.length,
    itemListElement: boats.map((boat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localizedUrl(locale as LocaleType, `/boat/${boat.slug}`),
      name: [toTitleCase(boat.modelName), toTitleCase(boat.name)].filter(Boolean).join(' '),
    })),
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }} />}
      <ModelPageView
        locale={locale}
        model={model}
        stats={stats}
        layout={layout}
        boats={boats}
        where={where}
        otherModels={otherModels}
        brandName={brand?.brand ?? model.brand}
        blogPost={blogPost}
        showAllHref={showAllHref}
        breadcrumb={breadcrumb}
        faq={faq}
      />
    </Layout>
  );
};

export default ModelPage;
