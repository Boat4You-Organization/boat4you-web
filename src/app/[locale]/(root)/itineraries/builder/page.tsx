import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import ItineraryMessages from '@/components/ItineraryMessages';
import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { ITINERARY_NAMESPACES } from '@/i18n/clientMessages';
import { buildMetadata } from '@/utils/static/buildMetadata';
import BuilderIntro from '@/views/Itineraries/CustomBuilder/BuilderIntro';
import CustomBuilder from '@/views/Itineraries/CustomBuilder/CustomBuilder';
import ItineraryHero from '@/views/Itineraries/ItineraryHero';

interface BuilderPageParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: BuilderPageParams): Promise<Metadata> {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('itinerary');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('builder.metaTitle'),
    titleAbsolute: t('builder.metaTitle'),
    description: t('builder.metaDesc'),
    path: '/itineraries/builder',
    image: { src: '/images/itinerary/banner.webp', alt: 'Itinerary builder' },
  });
}

const BuilderPage = async ({ params }: BuilderPageParams) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('itinerary');

  return (
    <ItineraryMessages namespaces={ITINERARY_NAMESPACES}>
      <Layout>
        <ItineraryHero
          kicker={t('builder.kicker')}
          eyebrow={t('builder.eyebrow')}
          title={t('builder.title')}
          italic={t('builder.italic')}
          lede={t('builder.lede')}
          image={{ src: '/images/itinerary/banner.webp', alt: 'Itinerary builder' }}
        />
        <BuilderIntro />
        <CustomBuilder />
      </Layout>
    </ItineraryMessages>
  );
};

export default BuilderPage;
