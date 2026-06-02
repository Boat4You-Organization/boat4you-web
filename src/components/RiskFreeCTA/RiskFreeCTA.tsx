import { Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

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
      <Container
        maxWidth="xl"
        disableGutters
        className={cx(styles.container, { [styles.searchPage]: searchPage })}
        // Side gutter on the home banner so it is not edge-to-edge on mobile
        // (Mario); search page keeps its own layout untouched.
        sx={searchPage ? undefined : { px: { xs: 2, md: 3 } }}
      >
        <Card elevation={0} className={styles.card}>
          {/* Row layout on ALL viewports (text left, illustration right) —
              mobile previously stacked column-reverse which ate too much
              vertical space. Now one compact horizontal banner. */}
          <Grid container alignItems="stretch" direction="row">
            <Grid
              display="flex"
              flexDirection="column"
              alignSelf="center"
              gap={{ xs: 1, md: 1.5 }}
              size={{ xs: 8, md: 7 }}
              padding={{ xs: 1.5, md: searchPage ? 3 : 4 }}
            >
              <CardContent className={styles.content}>
                <Typography
                  component="p"
                  variant="hero"
                  fontWeight={800}
                  fontSize={{ xs: 20, md: searchPage ? 32 : 62 }}
                  fontStyle="italic"
                  color={colors.blue500}
                >
                  {t('riskFreeBooking')}
                </Typography>
                <Typography
                  variant="body2"
                  color={colors.black500}
                  mt={{ xs: 0.5, md: 1.5 }}
                  sx={{ fontSize: { xs: 11, md: 14 }, lineHeight: 1.35 }}
                >
                  {t('cancellingDescription')}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: { xs: 0, md: 1 }, px: { xs: 1, md: 2 } }}>
                <Typography
                  component="span"
                  sx={{
                    color: colors.blue500,
                    fontWeight: 800,
                    fontSize: { xs: 13, md: 16 },
                  }}
                >
                  {t('saveUpTo')}
                </Typography>
              </CardActions>
            </Grid>

            <Grid size={{ xs: 4, md: 5 }} pl={{ xs: 1, md: 0 }}>
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
