/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Layout from '@/components/Layout';
import { itineraries } from '@/config/itineraries.config';
import { LocaleType } from '@/config/locales.config';
import { buildBreadcrumbJsonLd, buildItineraryCollectionJsonLd } from '@/utils/static/buildItineraryJsonLd';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { resolveBoatsSearchHref } from '@/utils/static/itinerarySearchHref';
import { serializeJsonLd } from '@/utils/static/serializeJsonLd';
import ItinerariesHub from '@/views/Itineraries/ItinerariesHub';
import ItineraryEndCta from '@/views/Itineraries/ItineraryEndCta';
import ItineraryHero from '@/views/Itineraries/ItineraryHero';

interface ItinerariesPageParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: ItinerariesPageParams): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'itinerary' });

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('meta.title'),
    titleAbsolute: t('meta.title'),
    description: t('meta.description'),
    path: '/itineraries',
    image: { alt: t('meta.imageAlt') },
  });
}

const ItinerariesPage = async ({ params }: ItinerariesPageParams) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('itinerary');
  // did-carrying country links for the SEO guide (bare ?destinations= does not filter).
  const [croatiaHref, greeceHref, italyHref, spainHref, turkeyHref] = await Promise.all(
    ['Croatia', 'Greece', 'Italy', 'Spain', 'Turkey'].map(resolveBoatsSearchHref)
  );
  const countrySearchHrefs = {
    croatia: croatiaHref,
    greece: greeceHref,
    italy: italyHref,
    spain: spainHref,
    turkey: turkeyHref,
  };

  // Flatten country-grouped itineraries → ListItems for the
  // CollectionPage schema. Each carries `id` and `sailingArea` + parent
  // country for the ItemList name ("Split yacht charter routes — Croatia").
  const flatItineraries = itineraries.flatMap(group =>
    group.itinerary.map(it => ({
      id: it.id,
      sailingArea: it.sailingArea,
      country: group.country,
    }))
  );

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumb.home'), url: '/' },
    { name: t('breadcrumb.itinerary'), url: '/itineraries' },
  ]);
  const collectionLd = buildItineraryCollectionJsonLd({
    itineraries: flatItineraries,
    description: t('meta.collectionDescription'),
  });

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionLd) }} />
      <ItineraryHero
        kicker={t('listHero.kicker')}
        eyebrow={t('listHero.eyebrow')}
        title={t('listHero.title')}
        italic={t('listHero.italic')}
        lede={t('listHero.lede')}
        image={{ src: '/images/itinerary/banner.webp', alt: t('listHero.imageAlt') }}
      />
      <ItinerariesHub countrySearchHrefs={countrySearchHrefs} />
      <ItineraryEndCta title={t('listCta.title')} lede={t('listCta.lede')} action={t('listCta.action')} to="/search" />
    </Layout>
  );
};

export default ItinerariesPage;
