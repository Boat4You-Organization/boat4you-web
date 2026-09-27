/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { PRICE_GUIDE_HUB_PATH, priceGuidePath } from '@/config/priceGuides.config';
import { routing } from '@/i18n/routing';
import { loadPriceGuides } from '@/utils/server/priceGuide';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { fitDescription } from '@/utils/static/metaLength';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import PriceGuideHubView, { HubRow } from '@/views/PriceGuide/PriceGuideHubView';
import { GUIDE_DESCRIPTION_MAX, buildGuideText, fitTitle } from '@/views/PriceGuide/guideText';

/** /yacht-charter-prices — the hub of the country price guides (same ISR window as the guides). */
export const revalidate = 21600;

interface PriceGuideHubPageProps {
  params: Promise<{ locale: Locale }>;
}

/** The guides with data, or a thrown error when no facts row can be read (see the guide route). */
const loadHub = async (locale: string) => {
  const guides = await loadPriceGuides();

  if (!guides.length) throw new Error('Charter facts unavailable for the price guides');

  const texts = await Promise.all(guides.map(data => buildGuideText(data, locale)));
  const list = new Intl.ListFormat(locale, { type: 'conjunction' }).format(texts.map(text => text.countryName));
  // Boats behind the figures (each guide's priced population), and the latest computation.
  const boats = guides.reduce((sum, g) => sum + (g.facts.boatsWithWeeklyPrices ?? g.facts.activeBoats), 0);
  const computedAt = guides.map(g => g.facts.computedAt).sort()[guides.length - 1];

  return { guides, texts, list, boats, computedAt };
};

export async function generateMetadata({ params }: PriceGuideHubPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [{ list, boats }, t] = await Promise.all([
    loadHub(locale),
    getTranslations({ locale, namespace: 'priceGuide' }),
  ]);
  const title = fitTitle([t('meta.hubTitle', { countries: list }), t('hub.h1')]);

  return buildMetadata({
    locale: locale as LocaleType,
    title,
    titleAbsolute: title,
    description: fitDescription(t('meta.hubDescription', { countries: list, boats }), GUIDE_DESCRIPTION_MAX),
    path: PRICE_GUIDE_HUB_PATH,
  });
}

const PriceGuideHubPage = async ({ params }: PriceGuideHubPageProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [{ guides, texts, list, boats, computedAt }, t, tCommon] = await Promise.all([
    loadHub(locale),
    getTranslations({ locale, namespace: 'priceGuide' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const rows: HubRow[] = guides.map((data, i) => ({ data, text: texts[i], href: priceGuidePath(data.guide.slug) }));
  const url = localizedUrl(locale as LocaleType, PRICE_GUIDE_HUB_PATH);
  const breadcrumb: Crumb[] = [{ name: tCommon('home'), href: '/' }, { name: t('hubCrumb') }];
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale as LocaleType, crumb.href ?? PRICE_GUIDE_HUB_PATH),
    })),
  };
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: t('hub.h1'),
    description: fitDescription(t('meta.hubDescription', { countries: list, boats }), GUIDE_DESCRIPTION_MAX),
    inLanguage: locale,
    dateModified: computedAt,
    isPartOf: { '@id': `${meta.url}/#website` },
    publisher: { '@id': `${meta.url}/#organization` },
    hasPart: rows.map(row => ({
      '@type': 'WebPage',
      url: localizedUrl(locale as LocaleType, row.href),
      name: row.text.h1,
    })),
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageLd) }} />
      <PriceGuideHubView locale={locale} rows={rows} boats={boats} computedAt={computedAt} breadcrumb={breadcrumb} />
    </Layout>
  );
};

export default PriceGuideHubPage;
