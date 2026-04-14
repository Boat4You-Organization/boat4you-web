import { getLoggedInUser } from '@/actions/auth.actions';
import Header from '@/components/Header/Header';

interface HeaderLayoutProps {
  children: React.ReactNode;
}

const HeaderLayout = async ({ children }: HeaderLayoutProps) => {
  const user = await getLoggedInUser();

  return (
    <>
      <Header user={user} />
      {children}
    </>
  );
};

export default HeaderLayout;
