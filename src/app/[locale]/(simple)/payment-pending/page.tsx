'use client';

import { useEffect, useState } from 'react';

import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { getReservationDetails } from '@/actions/reservation.actions';
import CircularProgress from '@/components/CircularProgress';
import Layout from '@/components/Layout';
import ReservationOverview from '@/components/ReservationOverview';
import Information from '@/components/SvgIcons/Information';
import { ReservationDetails } from '@/models/reservation.model';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import ErrorPage from '@/views/ErrorPage';

const PaymentPendingPage = () => {
  const [reservationData, setReservationData] = useState<ReservationDetails | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations('common');

  const handleMyReservationsClick = () => {
    router.push('/my-bookings');
  };

  useEffect(() => {
    const id = getDataFromSessionStorage<string>('reservationId');

    setReservationId(id);

    if (!id) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId) {
        return;
      }

      try {
        const result = await getReservationDetails(Number(reservationId));

        if (result.payload) {
          setReservationData(result.payload);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching reservation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [reservationId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={64} />
      </Box>
    );
  }

  if (!reservationData || Object.keys(reservationData).length === 0) {
    return <ErrorPage />;
  }

  return (
    <Layout showFooter={false}>
      <ReservationOverview
        title={t('yourYachtHasBeenPreReserved')}
        description={t('yourYachtHasBeenPreReservedDescription')}
        descriptionIcon={Information}
        reservationData={reservationData}
        linkTo="/my-bookings"
        linkToText={t('yourReservations')}
        onClick={handleMyReservationsClick}
        showContactCard
      />
    </Layout>
  );
};

export default PaymentPendingPage;
