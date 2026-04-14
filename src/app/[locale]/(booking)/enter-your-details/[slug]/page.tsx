import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { UserRoleName } from '@/models/user.model';

const Booking = dynamic(() => import('@/views/Booking'));

const EnterYourDetailsPage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  const isAdmin = user.roles.some(role => role.roleName === UserRoleName.SYSTEM_ADMIN);

  return (
    <Layout>
      <Booking isAdmin={isAdmin} user={user} />
    </Layout>
  );
};

export default EnterYourDetailsPage;
