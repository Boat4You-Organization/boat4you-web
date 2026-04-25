'use client';

import { useEffect, useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { getReservationDetails } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import ReservationOverview from '@/components/ReservationOverview';
import Check from '@/components/SvgIcons/Check';
import { ReservationDetails } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import { getDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import ErrorPage from '@/views/ErrorPage';

interface BookingContact {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
}

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const locale = useLocale();

  const [reservationData, setReservationData] = useState<ReservationDetails | null>(null);
  const [guestFallback, setGuestFallback] = useState<ReservationData | null>(null);
  const [contact, setContact] = useState<BookingContact | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      const id = searchParams.get('reservationId') || getDataFromSessionStorage<string>('reservationId');

      setReservationId(id ? String(id) : null);
      setContact(getDataFromSessionStorage<BookingContact>('bookingContact'));

      if (!id) {
        // No reservation id in URL or session — most likely a stale visit
        // (user reloaded the success page after clearing storage). Fall back
        // to the error page so we don't render an empty confirmation card.
        setHasError(true);
        setIsLoading(false);

        return;
      }

      try {
        const result = await getReservationDetails(Number(id));

        if (result.payload && Object.keys(result.payload).length > 0) {
          setReservationData(result.payload);
        } else {
          // Guest flow: `/secured/reservations/my-reservations/{id}` needs an
          // auth token. Fall back to the local booking payload we saved during
          // /enter-your-details so the confirmation page still shows yacht +
          // pick-up info + totals.
          const saved = getDataFromLocalStorage<ReservationData>('yachtReservation');
          if (saved) setGuestFallback(saved);
          else setHasError(true);
        }
      } catch (error) {
        const saved = getDataFromLocalStorage<ReservationData>('yachtReservation');
        if (saved) setGuestFallback(saved);
        else setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [searchParams]);

  if (isLoading) {
    return <LoadingSection size={64} />;
  }

  if (hasError || (!reservationData && !guestFallback)) {
    return <ErrorPage />;
  }

  // Map the local ReservationData shape onto the slice of ReservationDetails
  // that ReservationOverview renders. Kept narrow — we only populate what the
  // overview actually reads (yacht name/model/image, location, dates).
  const overviewData =
    reservationData && Object.keys(reservationData).length > 0
      ? reservationData
      : (({
          id: Number(reservationId) || 0,
          yacht: {
            name: guestFallback!.name,
            model: guestFallback!.model,
            buildYear: guestFallback!.buildYear ?? 0,
            mainImage: guestFallback!.mainImage,
            yachtImages: guestFallback!.yachtImages ?? [],
            location: {
              name: guestFallback!.locationFrom?.name ?? '',
              countryCode: guestFallback!.locationFrom?.countryCode ?? '',
            },
          },
          offer: { dateFrom: guestFallback!.dateFrom, dateTo: guestFallback!.dateTo },
          dateFrom: guestFallback!.dateFrom,
          dateTo: guestFallback!.dateTo,
          totalPrice: guestFallback!.totalPriceEur,
          yachtName: guestFallback!.name,
          modelName: guestFallback!.model,
          locationFrom: guestFallback!.locationFrom?.name ?? '',
          locationFromCountryCode: guestFallback!.locationFrom?.countryCode ?? '',
        } as unknown) as ReservationDetails);

  const isGuest = !reservationData || Object.keys(reservationData).length === 0;
  // Carry the email + invite context forward into the signup flow. Guest users
  // land on /signup with their email pre-filled; once the invite email lands
  // and they click the link it merges with the flow they started here.
  const signupHref = contact?.email
    ? `/${locale}/signup?email=${encodeURIComponent(contact.email)}${reservationId ? `&reservationId=${reservationId}` : ''}`
    : `/${locale}/signup`;

  // Prominent "next step" card for guests. Placed between the reservation
  // overview and the contact-support block so it's the first thing the eye
  // hits after "Your yacht has been confirmed" — user has explicitly signaled
  // they want this to look unmissable.
  const createAccountCta = isGuest ? (
    <Box
      sx={{
        width: '100%',
        mt: { xs: 3, md: 4 },
        backgroundColor: colors.blue500,
        color: colors.white,
        borderRadius: 2,
        px: { xs: 3, md: 5 },
        py: { xs: 3, md: 4 },
        boxShadow: '0 6px 20px rgba(40, 86, 255, 0.18)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        gap={{ xs: 2.5, md: 4 }}
      >
        <Box flex={1}>
          <Typography variant="h2" component="h2" fontWeight={700} mb={1} sx={{ color: colors.white }}>
            {t('createAccountToManageBooking')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
            {t('createAccountDescription', { email: contact?.email ?? '' })}
          </Typography>
        </Box>
        <Button
          component={Link}
          href={signupHref}
          size="large"
          sx={{
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            backgroundColor: colors.white,
            color: colors.blue500,
            fontWeight: 700,
            '&:hover': { backgroundColor: colors.blue50 },
          }}
        >
          {t('createYourPassword')}
        </Button>
      </Stack>
    </Box>
  ) : null;

  // Greeting preference: full name from the booking contact first, then the
  // logged-in reservation's yacht name as a last-resort fallback. We stop
  // there — no "Thank you for choosing us, Guest" — the comma + generic word
  // reads worse than just the brand thank-you line.
  const fullName = contact ? `${contact.name} ${contact.surname}`.trim() : '';
  const thankYouLine = fullName
    ? t('thankYouForChoosingUsNamed', { name: fullName })
    : t('thankYouForChoosingUs');

  return (
    <Layout showFooter={false}>
      <ReservationOverview
        title={t('yourBookingIsConfirmed')}
        description={thankYouLine}
        descriptionIcon={Check}
        reservationData={overviewData}
        // For guests the primary next step is setting a password (rendered as
        // the "Create your account" CTA below this card). We intentionally
        // suppress the secondary link — a "Back to home" here would lead the
        // user away from the one remaining action they have to take.
        linkTo={isGuest ? undefined : '/my-bookings'}
        linkToText={isGuest ? undefined : t('yourReservations')}
        showContactCard
      >
        {createAccountCta}
      </ReservationOverview>
    </Layout>
  );
};

export default PaymentSuccessPage;
