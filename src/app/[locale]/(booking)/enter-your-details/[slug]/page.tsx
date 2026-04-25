import dynamic from 'next/dynamic';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { UserRoleName } from '@/models/user.model';

const Booking = dynamic(() => import('@/views/Booking'));

// Guest checkout: the /enter-your-details page is public. An authenticated user
// gets their contact info pre-filled; an anonymous user fills the form manually
// and the backend creates the user at submit time (see PublicReservationController).
const EnterYourDetailsPage = async () => {
  const user = await getLoggedInUser();

  const isAdmin = user?.roles?.some(role => role.roleName === UserRoleName.SYSTEM_ADMIN) ?? false;

  return (
    <Layout>
      <Booking isAdmin={isAdmin} user={user} />
    </Layout>
  );
};

export default EnterYourDetailsPage;
