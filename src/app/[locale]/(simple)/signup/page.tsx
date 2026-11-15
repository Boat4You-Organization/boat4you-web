import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('@/views/SignUp'));

interface PageProps {
  searchParams: Promise<{
    inviteCode?: string;
    /** "1" for a guest straight from a booking: told to open the password link e-mailed to them. */
    booking?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { inviteCode, booking } = await searchParams;

  return <SignUp inviteCode={inviteCode} fromBooking={booking === '1'} />;
}
