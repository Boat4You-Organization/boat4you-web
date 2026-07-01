import { getLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getUserReservations } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { ReservationShortInfo, ReservationStatus } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import DateTime from '@/utils/static/DateTime';

const ActiveReservationsSection = dynamic(() => import('@/views/MyBookings/ActiveReservationsSection'));
const PastReservationsSection = dynamic(() => import('@/views/MyBookings/PastReservationsSection'));

// Number of days a CANCELLED reservation stays visible in the "Past" section
// before it's hidden from the customer dashboard entirely. Mario decision
// 1.5.2026: cancelled bookings should not clutter the list forever — 60 days
// is enough for the customer to see what happened, dispute if needed, and
// then move on. After this window the row is filtered client-side; it remains
// in the DB and accessible by direct /my-bookings/{id} link if needed.
const CANCELLED_RESERVATION_RETENTION_DAYS = 60;

const filterReservations = (reservations: ReservationShortInfo[]) => {
  const now = DateTime.now();

  // Drop anything missing the primary key or the dateTo we sort/filter by.
  // A failed reservation (e.g. caught by `ExternalOptionException` mid-flight)
  // can end up persisted with partial fields — rendering its card would
  // create a `/my-bookings/undefined` link on click.
  const validReservations = reservations.filter(r => r?.reservationId != null && Boolean(r?.dateTo));

  // Hide CANCELLED reservations whose cancellation timestamp is older than
  // the retention window. Falls back to dateTo if cancellationRequestAt is
  // missing (legacy rows from before the field was populated).
  const visible = validReservations.filter(reservation => {
    if (reservation.status !== ReservationStatus.CANCELLED) return true;

    const reference = reservation.cancellationRequestAt
      ? DateTime.date(reservation.cancellationRequestAt)
      : DateTime.date(reservation.dateTo);

    return now.diff(reference, 'day') < CANCELLED_RESERVATION_RETENTION_DAYS;
  });

  const activeReservations = visible.filter(reservation => {
    // CANCELLED reservations always go to "Past" regardless of dateTo — the
    // customer doesn't need to see a cancelled booking in their active list
    // for the months until the (now irrelevant) charter date passes.
    if (reservation.status === ReservationStatus.CANCELLED) return false;

    const endDate = DateTime.date(reservation.dateTo);

    return endDate.isAfter(now);
  });

  const pastReservations = visible.filter(reservation => {
    if (reservation.status === ReservationStatus.CANCELLED) return true;

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
      {/* Mario 2.7.2026: the "Past reservations" section only earns its place
          when there IS history to show. 99% of customers are on their first
          booking — greeting them with a big "You have no past reservations."
          empty state just makes the dashboard look bare. Returning customers
          still see their full history. */}
      {pastReservations.length > 0 && <PastReservationsSection reservations={pastReservations} />}
    </Layout>
  );
};

export default MyBookingsPage;
