import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import HowWeWorkVector from '@/components/SvgIcons/Vector/HowWeWorkVector';
import colors from '@/styles/themes/colors';

import styles from './ContactUsSection.module.scss';

const ContactUsSection = () => {
  const t = useTranslations('howWeWork.cta');

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Grid container direction={{ xs: 'column-reverse', md: 'row' }} className={styles.card}>
        <Grid size={{ xs: 12, md: 7 }} className={styles.content}>
          <Typography
            variant="hero"
            component="h2"
            fontWeight={800}
            fontStyle="italic"
            color={colors.blue500}
            className={styles.title}
          >
            {t('title')}
          </Typography>
          <Stack className={styles.description}>
            <Typography variant="body2" color={colors.black500} mt={2}>
              {t('description')}
            </Typography>
          </Stack>
          <Link href="/contact-us">
            <Button size="large" sx={{ mt: 2 }}>
              {t('cta')}
            </Button>
          </Link>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }} className={styles.vector}>
          <HowWeWorkVector width="100%" />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUsSection;
