import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';

const Profile = dynamic(() => import('@/views/Profile'));

const MyProfilePage = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/');
  }

  return (
    <Layout>
      <Profile user={user} />
    </Layout>
  );
};

export default MyProfilePage;
