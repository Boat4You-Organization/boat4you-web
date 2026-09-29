/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { PRICE_GUIDE_HUB_PATH, priceGuideBySlug, priceGuidePath } from '@/config/priceGuides.config';
import { routing } from '@/i18n/routing';
import { guideBaseLanding, guideLandings, loadPriceGuide } from '@/utils/server/priceGuide';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { displayPlaceName } from '@/utils/static/croatianPlaceNames';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import { modelsFaqSchema } from '@/views/Models/ModelsFaq';
import PriceGuideView from '@/views/PriceGuide/PriceGuideView';
import { buildGuideText } from '@/views/PriceGuide/guideText';
import { factsBaseGroups, factsModelRows } from '@/views/Search/CharterFacts/factsContent';

/**
 * Yacht charter price guide of one country, e.g. /yacht-charter-prices/croatia.
 * ISR on the charter-facts window: the row is recomputed once a night
 * (08:00 UTC) and read through a six-hour Data Cache (charterFacts.ts).
 */
export const revalidate = 21600;

interface PriceGuidePageProps {
  params: Promise<{ locale: Locale; country: string }>;
}

/**
 * The guide's data, or a thrown error when the facts row cannot be read: a
 * guide without its figures is no page to show Google — a 500 is retried,
 * and an ISR regeneration that throws keeps serving the last good page.
 */
const loadGuide = async (slug: string) => {
  const guide = priceGuideBySlug(slug);

  if (!guide) notFound();

  const data = await loadPriceGuide(guide);

  if (!data) throw new Error(`Charter facts unavailable for the ${guide.slug} price guide`);

  return data;
};

export async function generateMetadata({ params }: PriceGuidePageProps): Promise<Metadata> {
  const { locale, country } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadGuide(country);
  const text = await buildGuideText(data, locale);

  return buildMetadata({
    locale: locale as LocaleType,
    title: text.title,
    titleAbsolute: text.title,
    description: text.description,
    path: priceGuidePath(data.guide.slug),
  });
}

const PriceGuidePage = async ({ params }: PriceGuidePageProps) => {
  const { locale, country } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const data = await loadGuide(country);
  const [text, landings, tCommon, t] = await Promise.all([
    buildGuideText(data, locale),
    guideLandings(data.guide, locale),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'priceGuide' }),
  ]);
  const placeDids = [data.guide.did];

  // Bases and models of the whole country: bases link to their landing when
  // it is in the landing manifest (never a noindex landing), models to their
  // /yachts page when one exists.
  const [models, bases] = await Promise.all([
    factsModelRows(data.facts, placeDids, null, false),
    factsBaseGroups(data.facts).then(groups =>
      Promise.all(
        groups.map(async g => ({
          // The catalogue's spelling may lack the diacritics ("Marina Kastela", R32).
          label: displayPlaceName(g.label),
          count: g.count,
          href: await guideBaseLanding(landings, g.label, g.dids, locale),
        }))
      )
    ),
  ]);

  const path = priceGuidePath(data.guide.slug);
  const url = localizedUrl(locale as LocaleType, path);
  const breadcrumb: Crumb[] = [
    { name: tCommon('home'), href: '/' },
    { name: t('hubCrumb'), href: PRICE_GUIDE_HUB_PATH },
    { name: text.countryName },
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
  // No Dataset markup: the figures carry no licence to declare (Google's
  // Dataset guidelines), so the page describes itself as a WebPage dated by
  // the nightly computation.
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: text.h1,
    description: text.description,
    inLanguage: locale,
    dateModified: data.facts.computedAt,
    isPartOf: { '@id': `${meta.url}/#website` },
    publisher: { '@id': `${meta.url}/#organization` },
    about: { '@type': 'Country', name: text.countryName },
  };
  const faqLd = modelsFaqSchema(text.faq);

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }} />}
      <PriceGuideView
        locale={locale}
        data={data}
        text={text}
        breadcrumb={breadcrumb}
        countryLanding={landings.country}
        typeLandings={landings.types}
        models={models}
        bases={bases}
      />
    </Layout>
  );
};

export default PriceGuidePage;
