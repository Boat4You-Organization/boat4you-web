import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('@/views/SignUp'));

interface PageProps {
  searchParams: Promise<{
    inviteCode?: string;
    /** Guest-booking mode: the reservation id returned at booking time. */
    reservationId?: string;
    /** Guest-booking mode: email used for the reservation, pre-filled in the
     *  form so the user sees which account they're claiming. */
    email?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { inviteCode, reservationId, email } = await searchParams;

  return (
    <SignUp
      inviteCode={inviteCode}
      reservationId={reservationId ? Number(reservationId) : undefined}
      email={email}
    />
  );
}
