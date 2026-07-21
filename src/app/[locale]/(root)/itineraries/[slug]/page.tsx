/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { itineraries } from '@/config/itineraries.config';
import { LocaleType } from '@/config/locales.config';
import { itineraryNamespace, resolveAreaText } from '@/helper/itineraryI18n';
import { buildBreadcrumbJsonLd, buildTouristTripJsonLd } from '@/utils/static/buildItineraryJsonLd';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { resolveBoatsSearchHref } from '@/utils/static/itinerarySearchHref';
import { serializeJsonLd } from '@/utils/static/serializeJsonLd';
import ItineraryArea from '@/views/Itineraries/ItineraryArea';
import ItineraryEndCta from '@/views/Itineraries/ItineraryEndCta';
import ItineraryHero from '@/views/Itineraries/ItineraryHero';

interface ItineraryAreaPageParams {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return itineraries.flatMap(group => group.itinerary.map(area => ({ slug: area.id })));
}

export async function generateMetadata({ params }: ItineraryAreaPageParams): Promise<Metadata> {
  const { locale, slug } = await params;

  setRequestLocale(locale);

  const itinerary = itineraries.flatMap(country => country.itinerary).find(item => item.id === slug);

  if (!itinerary) {
    return { title: 'Itinerary Not Found' };
  }

  // Absolute title — primary keyword + scope leads, avoiding the
  // " | Boat4You" template suffix that would push the title past 60
  // chars in the SERP and clip the "Sailing Routes" / "Itineraries"
  // keyword tail. metaTitle/metaDesc/title/description are per-country
  // namespace translations (itinerary.i18nNamespace); resolveAreaText
  // t.has-guards → config fallback for unmigrated countries.
  const tArea = await getTranslations({
    locale,
    namespace: itineraryNamespace(itinerary),
  });
  const metaTitle =
    resolveAreaText(itinerary, 'metaTitle', itinerary.metaTitle, tArea) ||
    resolveAreaText(itinerary, 'title', itinerary.title, tArea) ||
    itinerary.title;
  const metaDesc =
    resolveAreaText(itinerary, 'metaDesc', itinerary.metaDesc, tArea) ||
    resolveAreaText(itinerary, 'description', itinerary.description, tArea) ||
    itinerary.description;

  return buildMetadata({
    locale: locale as LocaleType,
    title: metaTitle,
    titleAbsolute: metaTitle,
    description: metaDesc,
    path: `/itineraries/${itinerary.id}`,
    image: {
      src: itinerary.backgroundImage.src,
      alt: itinerary.backgroundImage.alt,
    },
  });
}

const ItineraryAreaPage = async ({ params }: ItineraryAreaPageParams) => {
  const { locale, slug } = await params;

  // Required before any getTranslations call in a statically-rendered segment.
  setRequestLocale(locale);

  const country = itineraries.find(({ itinerary }) => itinerary.some(item => item.id === slug))?.country;
  const itinerary = itineraries.flatMap(i => i.itinerary).find(item => item.id === slug);

  if (!itinerary) {
    return notFound();
  }

  const t = await getTranslations('itinerary');

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumb.home'), url: '/' },
    { name: t('breadcrumb.itinerary'), url: '/itineraries' },
    { name: `${itinerary.sailingArea} ${t('breadcrumb.areaSuffix')}`, url: `/itineraries/${itinerary.id}` },
  ]);

  // Aggregate all routes within this sailing area into TouristTrip
  // JSON-LD entries so search engines can surface each as an indexable
  // trip option (rich Trip card in the SERP).
  const tripLds = itinerary.routes.map(route =>
    buildTouristTripJsonLd(route, itinerary.id, route.id, itinerary.sailingArea, country ?? 'Europe')
  );

  // Primary CTA — hand the visitor over to the boat search pre-filtered
  // on the area's main departure base.
  const primaryStart = itinerary.routes[0]?.startingPoint;

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      {tripLds.map(tripLd => (
        <script
          key={tripLd.url}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(tripLd) }}
        />
      ))}
      <ItineraryHero
        kicker={t('areaHero.kicker')}
        eyebrow={t('areaHero.eyebrow', { country: country ?? 'Europe' })}
        title={t('areaHero.title', { area: itinerary.sailingArea })}
        italic={t('areaHero.italic')}
        image={{ src: itinerary.backgroundImage.src, alt: itinerary.backgroundImage.alt }}
      />
      <ItineraryArea slug={slug} />
      <ItineraryEndCta
        title={t('areaCta.title')}
        lede={t('areaCta.lede')}
        action={primaryStart ? t('areaCta.action', { start: primaryStart }) : t('areaCta.actionFallback')}
        to={
          primaryStart ? await resolveBoatsSearchHref(primaryStart, [itinerary.sailingArea, country ?? '']) : '/search'
        }
        secondaryAction={t('areaCta.secondaryAction')}
        secondaryTo="/search"
      />
    </Layout>
  );
};

export default ItineraryAreaPage;
