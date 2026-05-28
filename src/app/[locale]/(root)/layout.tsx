import Header from '@/components/Header/Header';

interface HeaderLayoutProps {
  children: React.ReactNode;
}

// Header reads user state from the client store (UserSync hydrates it
// from /api/me on mount), so this layout no longer needs cookies() — that
// removes the only reason (root)/* pages were forced dynamic and makes the
// home cacheable via the page-level revalidate.
const HeaderLayout = ({ children }: HeaderLayoutProps) => (
  <>
    <Header />
    {children}
  </>
);

export default HeaderLayout;
