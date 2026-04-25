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
import { ReservationData } from '@/types/reservation.type';
import { getDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import ErrorPage from '@/views/ErrorPage';

const PaymentPendingPage = () => {
  const [reservationData, setReservationData] = useState<ReservationDetails | null>(null);
  const [guestFallback, setGuestFallback] = useState<ReservationData | null>(null);
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
        } else {
          // Guest flow: API call needs auth and won't return data. Read the
          // reservation we just saved during the booking flow from
          // localStorage so we can still show a meaningful "pre-reserved"
          // confirmation card.
          const saved = getDataFromLocalStorage<ReservationData>('yachtReservation');
          if (saved) setGuestFallback(saved);
        }
      } catch (error) {
        // Network/auth error — try the local payload as above.
        const saved = getDataFromLocalStorage<ReservationData>('yachtReservation');
        if (saved) setGuestFallback(saved);
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

  // Guest path: we have the local reservation payload, not the full
  // ReservationDetails from the API. Map the overlap so ReservationOverview
  // still renders a coherent card.
  if (!reservationData || Object.keys(reservationData).length === 0) {
    if (!guestFallback) return <ErrorPage />;

    const fallbackDetails = {
      id: Number(reservationId) || 0,
      yacht: {
        name: guestFallback.name,
        model: guestFallback.model,
        buildYear: guestFallback.buildYear ?? 0,
        mainImage: guestFallback.mainImage,
        yachtImages: guestFallback.yachtImages ?? [],
        location: {
          name: guestFallback.locationFrom?.name ?? '',
          countryCode: guestFallback.locationFrom?.countryCode ?? '',
        },
      },
      offer: { dateFrom: guestFallback.dateFrom, dateTo: guestFallback.dateTo },
    } as unknown as ReservationDetails;

    return (
      <Layout showFooter={false}>
        <ReservationOverview
          title={t('yourYachtHasBeenPreReserved')}
          description={t('yourYachtHasBeenPreReservedDescription')}
          descriptionIcon={Information}
          reservationData={fallbackDetails}
          linkTo="/"
          linkToText={t('backToHome')}
          onClick={() => router.push('/')}
          showContactCard
        />
      </Layout>
    );
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
