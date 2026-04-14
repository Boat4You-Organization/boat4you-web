import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import RiskFreeBookingVector from '@/components/SvgIcons/Vector/RiskFreeBookingVector';
import colors from '@/styles/themes/colors';

import styles from './RiskFreeCTA.module.scss';

interface RiskFreeCTAProps {
  searchPage?: boolean;
  disableGutters?: boolean;
}

const RiskFreeCTA = ({ searchPage, disableGutters }: RiskFreeCTAProps) => {
  const t = useTranslations('home.riskFreeBooking');

  return (
    <Container
      component="section"
      classes={{ root: styles.root }}
      className={styles.containerWrapper}
      disableGutters={disableGutters}
    >
      <Container maxWidth="xl" disableGutters className={cx(styles.container, { [styles.searchPage]: searchPage })}>
        <Card elevation={0} className={styles.card}>
          <Grid container alignItems="stretch" direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid
              display="flex"
              flexDirection="column"
              alignSelf="center"
              gap={1.5}
              size={{ xs: 12, md: 7 }}
              padding={{ xs: 2, md: searchPage ? 3 : 4 }}
            >
              <CardContent className={styles.content}>
                <Typography
                  component="h2"
                  variant="hero"
                  fontWeight={800}
                  fontSize={searchPage ? 32 : 62}
                  fontStyle="italic"
                  color={colors.blue500}
                >
                  {t('riskFreeBooking')}
                </Typography>
                <Typography variant="body2" color={colors.black500} mt={1.5}>
                  {t('cancellingDescription')}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href="/search">
                  <Button>{t('save15Now')}</Button>
                </Link>
              </CardActions>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }} pl={{ xs: 1, md: 0 }}>
              <CardMedia className={styles.vector}>
                <RiskFreeBookingVector />
              </CardMedia>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Container>
  );
};

export default RiskFreeCTA;
