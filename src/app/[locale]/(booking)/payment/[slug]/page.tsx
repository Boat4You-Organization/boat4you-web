import dynamic from 'next/dynamic';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { UserRoleName } from '@/models/user.model';

const Booking = dynamic(() => import('@/views/Booking'));

// Step 2 of the public booking flow: payment method + installment + Pay now.
// Reuses the same <Booking> view as /enter-your-details — the only difference
// is `initialStep={1}`, which drives the wizard to render UnifiedPaymentStep
// instead of DetailsStep. Requires a reservation id in session storage
// (created by the /enter-your-details submit); if missing, <Booking> redirects.
const PaymentPage = async () => {
  const user = await getLoggedInUser();

  const isAdmin = user?.roles?.some(role => role.roleName === UserRoleName.SYSTEM_ADMIN) ?? false;

  return (
    <Layout>
      <Booking isAdmin={isAdmin} user={user} initialStep={1} />
    </Layout>
  );
};

export default PaymentPage;
