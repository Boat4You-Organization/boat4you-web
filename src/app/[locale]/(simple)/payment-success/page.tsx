'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { getReservationDetails } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import ReservationOverview from '@/components/ReservationOverview';
import Check from '@/components/SvgIcons/Check';
import { ReservationDetails } from '@/models/reservation.model';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import ErrorPage from '@/views/ErrorPage';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const [reservationData, setReservationData] = useState<ReservationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      const id = searchParams.get('reservationId') || getDataFromSessionStorage<string>('reservationId');

      if (!id) {
        setHasError(true);
        setIsLoading(false);

        return;
      }

      try {
        const result = await getReservationDetails(Number(id));

        if (result.payload) {
          setReservationData(result.payload);
        } else {
          setHasError(true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch reservation:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [searchParams]);

  if (isLoading) {
    return <LoadingSection size={64} />;
  }

  if (hasError || !reservationData) {
    return <ErrorPage />;
  }

  return (
    <Layout showFooter={false}>
      <ReservationOverview
        title={t('yourYachHasBeenConfirmed')}
        description={t('yourConfirmationIsOnTheWay')}
        descriptionIcon={Check}
        reservationData={reservationData}
        linkTo="/my-bookings"
        linkToText={t('yourReservations')}
        showContactCard
      />
    </Layout>
  );
};

export default PaymentSuccessPage;
