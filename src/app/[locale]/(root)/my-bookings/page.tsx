import { getLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getUserReservations } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { ReservationShortInfo } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import DateTime from '@/utils/static/DateTime';

const ActiveReservationsSection = dynamic(() => import('@/views/MyBookings/ActiveReservationsSection'));
const PastReservationsSection = dynamic(() => import('@/views/MyBookings/PastReservationsSection'));

const filterReservations = (reservations: ReservationShortInfo[]) => {
  const now = DateTime.now();

  // Drop anything missing the primary key or the dateTo we sort/filter by.
  // A failed reservation (e.g. caught by `ExternalOptionException` mid-flight)
  // can end up persisted with partial fields — rendering its card would
  // create a `/my-bookings/undefined` link on click.
  const validReservations = reservations.filter(r => r?.reservationId != null && Boolean(r?.dateTo));

  const activeReservations = validReservations.filter(reservation => {
    const endDate = DateTime.date(reservation.dateTo);

    return endDate.isAfter(now);
  });

  const pastReservations = validReservations.filter(reservation => {
    const endDate = DateTime.date(reservation.dateTo);

    return endDate.isBefore(now) || endDate.isSame(now);
  });

  return { activeReservations, pastReservations };
};

const MyBookingsPage = async ({ searchParams }: { searchParams: Promise<AllSearchParams> }) => {
  const locale = await getLocale();
  const user = await getLoggedInUser();
  const params = await searchParams;

  if (!user) {
    redirect('/');
  }

  const currency = user?.currency || (params.currency as Currency) || Currency.EUR;
  const { payload: reservations } = await getUserReservations(locale, currency);
  const { activeReservations, pastReservations } = filterReservations(reservations);

  return (
    <Layout>
      <ActiveReservationsSection reservations={activeReservations} />
      <PastReservationsSection reservations={pastReservations} />
    </Layout>
  );
};

export default MyBookingsPage;
