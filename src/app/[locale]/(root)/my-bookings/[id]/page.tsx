import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getReservationDetails } from '@/actions/reservation.actions';
import Layout from '@/components/Layout';

const ReservationDetails = dynamic(() => import('@/views/MyBookings/ReservationDetails'));

const ReservationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  const { payload: reservationDetails, message } = await getReservationDetails(Number(id));

  // `getReservationDetails` returns `{payload: {} as ReservationDetails, message}`
  // on any backend error (404 / 403 / 500). Rendering that empty object into
  // ReservationDetails crashes PayNowModal when it calls `reservationId.toString()`.
  // Treat missing data as a real 404 so Next's not-found boundary can take over.
  if (message || !reservationDetails?.reservationId) {
    notFound();
  }

  return (
    <Layout>
      <ReservationDetails reservationDetails={reservationDetails} userCurrency={user.currency} />
    </Layout>
  );
};

export default ReservationPage;
