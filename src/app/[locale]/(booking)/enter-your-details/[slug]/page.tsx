import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { UserRoleName } from '@/models/user.model';
import { getSiteStatsWithin } from '@/utils/server/siteStats';

const Booking = dynamic(() => import('@/views/Booking'));

// The checkout carried the site's default title (audit B50): name the step.
// Never indexed (robots.txt disallows it too).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('common');

  return { title: t('yourBookingDetails'), robots: { index: false, follow: false } };
}

// Guest checkout: the /enter-your-details page is public. An authenticated user
// gets their contact info pre-filled; an anonymous user fills the form manually
// and the backend creates the user at submit time (see PublicReservationController).
const EnterYourDetailsPage = async () => {
  // Trust-bar counts from the one catalogue count source (siteStats.ts, the
  // home hero and /about-us read the same); never waits on a cold cache.
  const [user, siteStats] = await Promise.all([getLoggedInUser(), getSiteStatsWithin(1500)]);
  const trustStats = siteStats ? { boats: siteStats.display.boats, marinas: siteStats.display.marinas } : null;

  const isAdmin = user?.roles?.some(role => role.roleName === UserRoleName.SYSTEM_ADMIN) ?? false;

  return (
    <Layout>
      <Booking isAdmin={isAdmin} user={user} trustStats={trustStats} />
    </Layout>
  );
};

export default EnterYourDetailsPage;
