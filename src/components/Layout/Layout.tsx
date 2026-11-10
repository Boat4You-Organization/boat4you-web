import { PropsWithChildren } from 'react';

import { Box } from '@mui/material';
import cx from 'clsx';

import Footer from '@/components//Footer';

import styles from './Layout.module.scss';

interface LayoutProps extends PropsWithChildren {
  isBoat?: boolean;
  showFooter?: boolean;
}

const Layout = ({ isBoat = false, children, showFooter = true }: LayoutProps) => (
  <>
    <main className={cx(styles.main, { [styles.showFooter]: !showFooter })}>{children}</main>
    {showFooter && <Footer />}
    {/* Room for the boat page's fixed booking bar on phones, in the footer's navy (Footer.module.scss $ink). */}
    {isBoat && <Box sx={{ height: { xs: '183px', sm: '0px' }, bgcolor: '#0a2540' }} />}
  </>
);

export default Layout;
