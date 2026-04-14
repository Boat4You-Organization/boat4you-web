import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import colors from '@/styles/themes/colors';

import styles from './ErrorPage.module.scss';

const ErrorPage = () => {
  const t = useTranslations('common');

  return (
    <Container maxWidth="xl" disableGutters sx={{ height: '100dvh' }}>
      <Stack className={styles.container} alignItems="center" spacing={3}>
        <Typography component="h1" variant="hero" fontWeight={700} color={colors.blue950} textAlign="center">
          {t('errorTitle')}
        </Typography>
        <Typography variant="body1" color={colors.black350} textAlign="center">
          {t('errorDescription')}
        </Typography>
        <Link href="/" aria-label="Go Back Home" className={styles.link}>
          <Button variant="contained" size="large" className={styles.button} sx={{ margin: 'auto' }}>
            {t('goBackHome')}
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default ErrorPage;
