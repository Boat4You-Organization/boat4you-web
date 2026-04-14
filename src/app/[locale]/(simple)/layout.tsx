import HeaderSimple from '@/components/HeaderSimple';

interface HeaderSimpleLayoutProps {
  children: React.ReactNode;
}

const HeaderSimpleLayout = ({ children }: HeaderSimpleLayoutProps) => (
  <>
    <HeaderSimple />
    {children}
  </>
);

export default HeaderSimpleLayout;
