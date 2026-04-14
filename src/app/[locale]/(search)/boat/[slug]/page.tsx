import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getSingleYacth } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency } from '@/models/user.model';
import { CHARTER_TYPE_LABEL_MAP, CharterType } from '@/models/yacht.model';
import { buildMetadata } from '@/utils/static/buildMetadata';
import BoatContentSection from '@/views/Boat/BoatContentSection';
import BoatHeroSection from '@/views/Boat/BoatHeroSection';
import BoatMobileNavigation from '@/views/Boat/BoatMobileNavigation';
import { BoatTransitionProvider } from '@/views/Boat/BoatTransitionProvider';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<AllSearchParams>;
}): Promise<Metadata> {
  const tBoat = await getTranslations('metadata.boat');
  const t = await getTranslations();
  const { slug } = await params;

  const searchParamsData = await searchParams;

  if (searchParamsData.startDate) {
    searchParamsData.dateFrom = searchParamsData.startDate;
  }

  if (searchParamsData.endDate) {
    searchParamsData.dateTo = searchParamsData.endDate;
  }

  const yacht = await getSingleYacth(slug, searchParamsData);

  if (!yacht) {
    return {
      title: 'Yacht Not Found',
    };
  }

  const getCharterTypeLabel = (charterType: string) => {
    const labelKey = CHARTER_TYPE_LABEL_MAP[charterType as CharterType];

    if (!labelKey) return '';

    const label = t(labelKey);

    return label && label !== labelKey ? label : '';
  };

  const charterTypeLabel = getCharterTypeLabel(yacht.charterType[0]);

  return buildMetadata({
    title: `${charterTypeLabel} ${yacht.model || ''} ${yacht.name || ''} ${tBoat('forRent')} - ${yacht.location.name}`,
    description: `${charterTypeLabel} ${yacht.model || ''} ${yacht.name || ''} ${tBoat('forRent')} - ${yacht.location.name}. Best price guarantee. &#9989; Customer service. &#9989; No booking fees. &#9989;`,
    path: `/boat/${yacht.slug}`,
    image: {
      src: yacht.yachtImages.find(el => el.mainImage)?.url,
      alt: `${yacht.modelName} ${yacht.name || ''} boat image`,
    },
  });
}

const BoatPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<AllSearchParams>;
}) => {
  const user = await getLoggedInUser();
  const { slug, locale } = await params;

  const searchParamsData = await searchParams;

  if (searchParamsData.startDate) {
    searchParamsData.dateFrom = searchParamsData.startDate;
  }

  if (searchParamsData.endDate) {
    searchParamsData.dateTo = searchParamsData.endDate;
  }

  const currency = user?.currency || (searchParamsData.currency as Currency) || Currency.EUR;

  const yacht = await getSingleYacth(slug, searchParamsData, currency, locale);

  if (!yacht) {
    return notFound();
  }

  return (
    <Layout isBoat>
      <BoatTransitionProvider>
        <BoatHeroSection yacht={yacht} />
        <BoatContentSection yacht={yacht} />
        <BoatMobileNavigation yacht={yacht} />
      </BoatTransitionProvider>
    </Layout>
  );
};

export default BoatPage;
