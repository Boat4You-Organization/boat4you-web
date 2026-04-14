import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import colors from '@/styles/themes/colors';

import styles from './OurPromiseSection.module.scss';

const OurPromiseSection = () => {
  const t = useTranslations('about.ourPromise');

  return (
    <Container component="section" maxWidth="xl" disableGutters>
      <Stack maxWidth={1064} spacing={6} justifyContent="center" alignItems="center" marginInline="auto" pt={20.5}>
        <Stack
          direction="column"
          alignContent="center"
          justifyContent="center"
          spacing={2}
          maxWidth={630}
          margin="auto"
        >
          <Typography
            component="h2"
            variant="h4"
            textAlign="center"
            fontWeight={800}
            fontStyle="italic"
            color={colors.blue500}
          >
            {t('title')}
          </Typography>
          <Typography variant="h2" component="h3" textAlign="center" fontWeight={500} color={colors.blue950}>
            {t('mainTitle')}
          </Typography>
          <Typography variant="body1" textAlign="center" color={colors.black500} pt={1}>
            {t('description')}
          </Typography>
        </Stack>
        <Box className={styles.imageWrapper}>
          <Image
            src="/images/about/our-team-test.webp"
            alt="Who we are"
            fill
            sizes="(max-width: 899px) 100vw, 1064px"
            className={styles.image}
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default OurPromiseSection;
