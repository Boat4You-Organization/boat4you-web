import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';

const CancelBooking = dynamic(() => import('@/views/CancelBooking'));

const CancelBookingPage = async ({ searchParams }: { searchParams: Promise<{ reservationId: string }> }) => {
  const { reservationId } = await searchParams;

  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  return <CancelBooking reservationId={reservationId} />;
};

export default CancelBookingPage;
