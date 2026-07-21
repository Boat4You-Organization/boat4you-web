/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { itineraries } from '@/config/itineraries.config';
import { LocaleType } from '@/config/locales.config';
import { isOneWayItinerary } from '@/helper/itineraryDaysHelper';
import { itineraryNamespace, resolveDayText, resolveRouteText } from '@/helper/itineraryI18n';
import { buildBreadcrumbJsonLd, buildTouristTripJsonLd } from '@/utils/static/buildItineraryJsonLd';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { resolveBoatsSearchHref } from '@/utils/static/itinerarySearchHref';
import { serializeJsonLd } from '@/utils/static/serializeJsonLd';
import ItineraryEndCta from '@/views/Itineraries/ItineraryEndCta';
import ItineraryHero from '@/views/Itineraries/ItineraryHero';

const RouteDetailContent = dynamic(() => import('@/views/Itineraries/RouteDetailContent'));

interface ItineraryRoutePageParams {
  params: Promise<{ locale: Locale; slug: string; id: string }>;
}

export function generateStaticParams() {
  return itineraries.flatMap(group =>
    group.itinerary.flatMap(area => area.routes.map(route => ({ slug: area.id, id: route.id })))
  );
}

export async function generateMetadata({ params }: ItineraryRoutePageParams): Promise<Metadata> {
  const { locale, slug, id } = await params;

  setRequestLocale(locale);

  const itineraryRoute = itineraries
    .flatMap(country => country.itinerary)
    .find(item => item.id === slug)
    ?.routes.find(route => route.id === id);

  if (!itineraryRoute) {
    return { title: 'Itinerary Not Found' };
  }

  const routeTitle = [itineraryRoute.startingPoint, ...itineraryRoute.otherPoints].join(' - ');
  // metaTitle/metaDesc are per-country namespace translations
  // (route.i18nNamespace); resolveRouteText t.has-guards → config
  // fallback. titleAbsolute avoids the " | Boat4You" template suffix so
  // the SERP title stays < 60 chars.
  const tRoute = await getTranslations({
    locale,
    namespace: itineraryNamespace(itineraryRoute),
  });
  const metaTitle = resolveRouteText(itineraryRoute, 'metaTitle', itineraryRoute.metaTitle, tRoute) || routeTitle;
  const metaDesc = resolveRouteText(itineraryRoute, 'metaDesc', itineraryRoute.metaDesc, tRoute) || routeTitle;

  return buildMetadata({
    locale: locale as LocaleType,
    title: metaTitle,
    titleAbsolute: metaTitle,
    description: metaDesc,
    path: `/itineraries/${slug}/${id}`,
    image: {
      src: itineraryRoute.cardImage.src,
      alt: itineraryRoute.cardImage.alt,
    },
  });
}

const ItineraryRoutePage = async ({ params }: ItineraryRoutePageParams) => {
  const { locale, slug, id } = await params;

  // Required before any getTranslations call in a statically-rendered segment.
  setRequestLocale(locale);

  const country = itineraries.find(({ itinerary }) => itinerary.some(item => item.id === slug))?.country;
  const parent = itineraries.flatMap(c => c.itinerary).find(item => item.id === slug);
  const itineraryRoute = parent?.routes.find(route => route.id === id);

  if (!itineraryRoute || !parent) {
    return notFound();
  }

  const t = await getTranslations('itinerary');
  // did-carrying search link — a bare ?destinations= does NOT filter.
  const boatsSearchHref = await resolveBoatsSearchHref(itineraryRoute.startingPoint);
  // Per-route copy (metaDesc → hero lede) lives in the route's country
  // namespace; resolveRouteText t.has-guards → config fallback.
  const tRoute = await getTranslations({
    locale,
    namespace: itineraryNamespace(itineraryRoute),
  });
  const routeMetaDesc = resolveRouteText(itineraryRoute, 'metaDesc', itineraryRoute.metaDesc, tRoute);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumb.home'), url: '/' },
    { name: t('breadcrumb.itinerary'), url: '/itineraries' },
    { name: `${parent.sailingArea} ${t('breadcrumb.areaSuffix')}`, url: `/itineraries/${parent.id}` },
    {
      name: [itineraryRoute.startingPoint, ...itineraryRoute.otherPoints].join(' – '),
      url: `/itineraries/${parent.id}/${itineraryRoute.id}`,
    },
  ]);
  // Per-day prose resolved through the SAME path the visible deep-read
  // section uses (resolveDayText against the route's country namespace), so
  // the TouristTrip JSON-LD `Place.description` entries match the rendered
  // page in the active locale instead of the hardcoded EN config copy.
  const tripDayDescriptions: Record<number, string | undefined> = {};

  (itineraryRoute.routeDays ?? []).forEach(day => {
    tripDayDescriptions[day.day] = resolveDayText(itineraryRoute, day, 'description', day.description, tRoute);
  });

  // Localized TouristTrip name/summary from the shared `itinerary`
  // namespace so the machine-facing JSON-LD matches the active locale.
  const tripDays = itineraryRoute.numberOfDays ?? itineraryRoute.routeDays?.length ?? 7;
  const tripRouteTitle = [itineraryRoute.startingPoint, ...itineraryRoute.otherPoints].join(' – ');
  const tripL10nName = t('tripLd.name', { days: tripDays, area: parent.sailingArea, route: tripRouteTitle });
  const tripL10nDescription = t('tripLd.description', {
    days: tripDays,
    area: parent.sailingArea,
    country: country ?? 'Europe',
    start: itineraryRoute.startingPoint,
  });

  // TouristTrip schema — Google can surface this specific route as an
  // indexable trip option in the SERP (rich Trip card possibility).
  const tripLd = buildTouristTripJsonLd(
    itineraryRoute,
    parent.id,
    itineraryRoute.id,
    parent.sailingArea,
    country ?? 'Europe',
    {
      name: tripL10nName,
      description: tripL10nDescription,
      dayDescriptions: tripDayDescriptions,
    }
  );

  const routePath = [itineraryRoute.startingPoint, ...itineraryRoute.otherPoints].join(' – ');
  const days = itineraryRoute.routeDays?.length ?? 7;
  const oneWay = isOneWayItinerary(itineraryRoute);

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(tripLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <ItineraryHero
        kicker={oneWay ? t('routeHero.kickerOneWay', { days }) : t('routeHero.kickerRoundTrip', { days })}
        eyebrow={t('routeHero.eyebrow', { area: parent.sailingArea })}
        title={itineraryRoute.startingPoint}
        italic={
          itineraryRoute.otherPoints?.length
            ? t('routeHero.italicVia', { points: itineraryRoute.otherPoints.slice(0, 2).join(' & ') })
            : t('routeHero.italicRoundTrip')
        }
        lede={routeMetaDesc || routePath}
        image={{
          src: itineraryRoute.cardImage.src,
          alt: itineraryRoute.cardImage.alt,
        }}
      />
      <RouteDetailContent
        route={itineraryRoute}
        sailingArea={parent.sailingArea}
        itinerarySlug={parent.id}
        country={country ?? 'Europe'}
        boatsSearchHref={boatsSearchHref}
      />
      <ItineraryEndCta
        title={t('routeCta.title')}
        lede={t('routeCta.lede')}
        action={t('routeCta.action', { start: itineraryRoute.startingPoint })}
        to={boatsSearchHref}
        secondaryAction={t('routeCta.secondaryAction')}
        secondaryTo="/search"
      />
    </Layout>
  );
};

export default ItineraryRoutePage;
