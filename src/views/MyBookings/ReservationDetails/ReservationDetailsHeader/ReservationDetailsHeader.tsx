import { Box, Icon, IconButton, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import ArrowLeft from '@/components/SvgIcons/ArrowLeft';
import Logo from '@/components/SvgIcons/Logo';
import colors from '@/styles/themes/colors';

import styles from './ReservationDetailsHeader.module.scss';

const ReservationDetailsHeader = () => {
  const t = useTranslations('common');

  return (
    <Box className={styles.container}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" className={styles.header}>
        <Link href="/my-bookings" className={styles.backButton}>
          <IconButton>
            <Icon>
              <ArrowLeft size={24} fill={colors.black950} />
            </Icon>
          </IconButton>
        </Link>
        <Box className={styles.logoWrapper}>
          <Link href="/" aria-label={t('home')}>
            <Logo />
          </Link>
        </Box>
        <Box className={styles.spacer} />
      </Stack>
    </Box>
  );
};

export default ReservationDetailsHeader;
