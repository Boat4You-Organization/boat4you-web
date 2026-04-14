import { getLoggedInUser } from '@/actions/auth.actions';
import HeaderBooking from '@/components/HeaderBooking';
import { UserRoleName } from '@/models/user.model';

interface HeaderBookingProps {
  children: React.ReactNode;
}

const HeaderBookingLayout = async ({ children }: HeaderBookingProps) => {
  const user = await getLoggedInUser();

  const isAdmin = user?.roles.some(role => role.roleName === UserRoleName.SYSTEM_ADMIN);

  return (
    <>
      <HeaderBooking isAdmin={isAdmin} />
      {children}
    </>
  );
};

export default HeaderBookingLayout;
