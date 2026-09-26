/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import ItineraryMessages from '@/components/ItineraryMessages';
import Layout from '@/components/Layout';
import { itineraries } from '@/config/itineraries.config';
import { LocaleType } from '@/config/locales.config';
import { isOneWayItinerary } from '@/helper/itineraryDaysHelper';
import { itineraryNamespace, resolveDayText, resolveRouteText } from '@/helper/itineraryI18n';
import { itinerarySearchPath } from '@/utils/server/itineraryBoats';
import { itineraryAreaName, itineraryCountryName } from '@/utils/server/itineraryPlaceNames';
import { buildBreadcrumbJsonLd, buildTouristTripJsonLd } from '@/utils/static/buildItineraryJsonLd';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { serializeJsonLd } from '@/utils/static/serializeJsonLd';
import ItineraryBoats from '@/views/Itineraries/ItineraryBoats';
import ItineraryEndCta from '@/views/Itineraries/ItineraryEndCta';
import ItineraryHero from '@/views/Itineraries/ItineraryHero';

const RouteDetailContent = dynamic(() => import('@/views/Itineraries/RouteDetailContent'));

interface ItineraryRoutePageParams {
  params: Promise<{ locale: Locale; slug: string; id: string }>;
}

// ISR: the "Boats available from …" grid lists live boats, so the static
// page is refreshed hourly (the boat list shares the same window).
export const revalidate = 3600;

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
  // Nearest indexable landing above the route's start base (itineraryBoats.ts).
  const boatsSearchHref = await itinerarySearchPath(
    itineraryRoute.startingPoint,
    [parent.sailingArea, country ?? ''],
    locale
  );
  // "Browse all boats" scoped to the route's country — a bare /search
  // shows the Croatia-heavy default fleet under a Greek route (Mario 22.7).
  // The Caribbean group is no country: its area's own country then.
  const countrySearchHref = country ? await itinerarySearchPath(country, [parent.sailingArea], locale) : '/search';
  // Per-route copy (metaDesc → hero lede) lives in the route's country
  // namespace; resolveRouteText t.has-guards → config fallback.
  const tRoute = await getTranslations({
    locale,
    namespace: itineraryNamespace(itineraryRoute),
  });
  const routeMetaDesc = resolveRouteText(itineraryRoute, 'metaDesc', itineraryRoute.metaDesc, tRoute);
  // The area and country in this locale for every visible label, the PDF and
  // the JSON-LD — the config's English names read "Alle Routen ab Cyclades"
  // on /de (audit B16, itineraryPlaceNames.ts).
  const [areaLabel, countryLabel] = await Promise.all([
    itineraryAreaName(locale, parent),
    itineraryCountryName(locale, country ?? 'Europe'),
  ]);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumb.home'), url: '/' },
    { name: t('breadcrumb.itinerary'), url: '/itineraries' },
    { name: `${areaLabel} ${t('breadcrumb.areaSuffix')}`, url: `/itineraries/${parent.id}` },
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
  const tripL10nName = t('tripLd.name', { days: tripDays, area: areaLabel, route: tripRouteTitle });
  const tripL10nDescription = t('tripLd.description', {
    days: tripDays,
    area: areaLabel,
    country: countryLabel,
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
    <ItineraryMessages namespaces={[itineraryNamespace(itineraryRoute)]}>
      <Layout>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(tripLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
        <ItineraryHero
          kicker={oneWay ? t('routeHero.kickerOneWay', { days }) : t('routeHero.kickerRoundTrip', { days })}
          eyebrow={t('routeHero.eyebrow', { area: areaLabel })}
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
          sailingArea={areaLabel}
          itinerarySlug={parent.id}
          country={countryLabel}
          boatsSearchHref={boatsSearchHref}
        />
        <ItineraryBoats
          startingPoint={itineraryRoute.startingPoint}
          fallbacks={[parent.sailingArea, country ?? '']}
          locale={locale}
        />
        <ItineraryEndCta
          title={t('routeCta.title')}
          lede={t('routeCta.lede')}
          action={t('routeCta.action', { start: itineraryRoute.startingPoint })}
          to={boatsSearchHref}
          secondaryAction={t('routeCta.secondaryAction')}
          secondaryTo={countrySearchHref}
        />
      </Layout>
    </ItineraryMessages>
  );
};

export default ItineraryRoutePage;
