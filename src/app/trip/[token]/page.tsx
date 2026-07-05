import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getReservationDetails, getUserReservations } from '@/actions/reservation.actions';
import { claimTripOwner } from '@/actions/trip.actions';
import { Currency } from '@/models/user.model';
import TripHub, { TripDto, TripOwnerPayment } from '@/views/Trip';

/**
 * Boat4You Trip — the /trip/{token} PWA hub. Unauthenticated by design (the
 * unguessable token is the key; the leader shares the link with his crew), so
 * the page itself carries NO prices. When the visitor happens to be the
 * logged-in OWNER of this reservation, we additionally resolve the next
 * installment server-side (existing my-bookings APIs) and show the
 * leader-only payments card.
 */

const API = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

async function fetchTrip(token: string): Promise<TripDto | null> {
  try {
    const res = await fetch(`${API}/public/trip/${encodeURIComponent(token)}`, { cache: 'no-store' });

    if (!res.ok) return null;

    return (await res.json()) as TripDto;
  } catch {
    return null;
  }
}

/** Leader detection — session cookie + reservation-number match. Fail-soft:
 *  any error just means the payments card stays hidden. */
async function resolveOwnerPayment(trip: TripDto): Promise<TripOwnerPayment | null> {
  try {
    const user = await getLoggedInUser();

    if (!user) return null;

    const { payload: reservations } = await getUserReservations('en', Currency.EUR);
    const mine = reservations?.find(r => r.reservationNumber === trip.reservationNumber);

    if (!mine) return null;

    const { payload: details } = await getReservationDetails(mine.reservationId);
    const nextUnpaid = [...(details?.paymentPhases ?? [])]
      .filter(p => !p.paidOn)
      .sort((a, b) => (a.deadline > b.deadline ? 1 : -1))[0];

    return {
      reservationId: mine.reservationId,
      nextAmountEur: nextUnpaid?.amount ?? null,
      nextDeadline: nextUnpaid?.deadline ?? null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;

  return {
    title: 'Boat4You Trip',
    description: 'Your charter trip companion — documents, crew, weather and more.',
    robots: { index: false, follow: false },
    manifest: `/trip/${token}/manifest.webmanifest`,
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'B4Y Trip' },
    icons: { apple: '/favicons/apple-touch-icon.png' },
  };
}

export const viewport: Viewport = {
  themeColor: '#0c2461',
  width: 'device-width',
  initialScale: 1,
};

const TripPage = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  const trip = await fetchTrip(token);

  if (!trip) notFound();

  const ownerPayment = await resolveOwnerPayment(trip);
  // Owner enters the closed group through his web session — his devices all
  // converge on the one OWNER participant. Guests join client-side by name.
  const ownerCredentials = ownerPayment ? await claimTripOwner(token) : null;

  return (
    <TripHub
      trip={trip}
      token={token}
      apiUrl={API ?? ''}
      ownerPayment={ownerPayment}
      ownerCredentials={ownerCredentials}
    />
  );
};

export default TripPage;
