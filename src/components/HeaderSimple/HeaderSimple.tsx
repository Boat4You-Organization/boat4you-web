'use client';

import { AppBar, Container, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ArrowLeft from '@/components/SvgIcons/ArrowLeft';
import Logo from '@/components/SvgIcons/Logo';
import colors from '@/styles/themes/colors';

import styles from './HeaderSimple.module.scss';

const HeaderSimple = () => {
  const pathname = usePathname();
  const isForgotPassword = pathname === '/forgot-password';
  const isCancelBooking = pathname.includes('/cancel-booking');
  const isPaymentCancelled = pathname.includes('/payment-cancelled');
  const isPaymentSuccess = pathname.includes('/payment-success');
  const isMyProfile = pathname.includes('/my-profile');
  const t = useTranslations('common');

  const shouldRedirectToBookings = isCancelBooking;
  const showBackButton =
    !isForgotPassword && !isPaymentCancelled && !isPaymentSuccess && (isMyProfile || isCancelBooking);

  const backButtonHref = shouldRedirectToBookings ? '/my-bookings' : '/';

  return (
    <AppBar elevation={0} classes={{ root: styles.root }} className={styles.container}>
      <Container disableGutters maxWidth="xl" className={styles.header}>
        {showBackButton && (
          <Link href={backButtonHref} className={styles.backButton} aria-label={t('previous')}>
            <IconButton>
              <ArrowLeft size={24} fill={colors.black950} />
            </IconButton>
          </Link>
        )}
        <Link href="/" aria-label={t('home')}>
          <Logo />
        </Link>
      </Container>
    </AppBar>
  );
};

export default HeaderSimple;
