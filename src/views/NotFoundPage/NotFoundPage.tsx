import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import colors from '@/styles/themes/colors';

import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  const t = useTranslations('common');

  return (
    <Container maxWidth="xl" disableGutters>
      <Stack className={styles.container} spacing={3}>
        <Typography component="h1" variant="hero" fontWeight={700} color={colors.blue950} textAlign="center">
          {t('notFoundTitle')}
        </Typography>
        <Typography variant="body1" color={colors.black350} textAlign="center">
          {t('notFoundDescription')}
        </Typography>
        <Link href="/" aria-label="Go Back Home" className={styles.link}>
          <Button variant="contained" size="large" className={styles.button}>
            {t('goBackHome')}
          </Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default NotFoundPage;
