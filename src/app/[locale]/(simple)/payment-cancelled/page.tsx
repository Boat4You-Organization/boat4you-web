'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { getReservationDetails } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import ReservationOverview from '@/components/ReservationOverview';
import StatusChip from '@/components/StatusChip';
import Information from '@/components/SvgIcons/Information';
import { ReservationDetails } from '@/models/reservation.model';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import ErrorPage from '@/views/ErrorPage';

const PreReservedChip = (chunks: React.ReactNode): React.ReactNode => (
  <StatusChip component="span" color="warning" label={chunks} />
);

const PaymentCancelledPage = () => {
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
    if (reservationId === null) {
      return;
    }

    if (!reservationId) {
      setLoading(false);

      return;
    }

    const abortController = new AbortController();

    const fetchReservationData = async () => {
      try {
        const result = await getReservationDetails(Number(reservationId));

        if (abortController.signal.aborted) return;

        if (result.payload) {
          setReservationData(result.payload);
        }
      } catch (err) {
        if (abortController.signal.aborted) return;

        // eslint-disable-next-line no-console
        console.error('Error fetching reservation data:', err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchReservationData();

    // eslint-disable-next-line consistent-return
    return () => {
      abortController.abort();
    };
  }, [reservationId]);

  if (loading) {
    return <LoadingSection size={64} />;
  }

  if (!reservationData || Object.keys(reservationData).length === 0) {
    return <ErrorPage />;
  }

  // The cancel_url from Stripe is identical for first-instalment and
  // subsequent-instalment payments, but the user-facing message must NOT be.
  // If any phase is already paidOn, the reservation is already confirmed —
  // showing the "Pre-Reserved, you have 48h" warning would be alarming and
  // factually wrong (the boat stays booked, the unpaid instalment can wait
  // until its own deadline).
  const isConfirmedReservation = reservationData.paymentPhases?.some(p => p.paidOn) ?? false;

  return (
    <Layout showFooter={false}>
      <ReservationOverview
        title={isConfirmedReservation ? t('paymentInterruptedTitle') : t('youDidNotFinishYourPayment')}
        description={
          isConfirmedReservation
            ? t('paymentInterruptedDescription')
            : t.rich('itLooksLikeYouHaveNotCompletedYourPayment', {
                preReservedChip: PreReservedChip,
              })
        }
        descriptionIcon={Information}
        reservationData={reservationData}
        actionText={t('yourReservations')}
        linkTo="/"
        linkToText={t('goBackHome')}
        onClick={handleMyReservationsClick}
      />
    </Layout>
  );
};

export default PaymentCancelledPage;
