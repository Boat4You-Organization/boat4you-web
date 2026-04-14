import { Box, Container, Grid, Icon, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Newsletter from '@/components/Newsletter';
import Info from '@/components/SvgIcons/Info';
import footerMenu from '@/config/footerMenu';
import colors from '@/styles/themes/colors';

import BusinessCard from './BusinessCard';
import styles from './Footer.module.scss';
import FooterBottomBar from './FooterBottomBar';
import FooterMenuItem from './FooterMenuItem';

const Footer = () => {
  const t = useTranslations('common');

  return (
    <Container component="footer" disableGutters classes={{ root: styles.root }} className={styles.container}>
      <Box className={styles.overlay} />
      <Container maxWidth="xl" disableGutters>
        <Grid container justifyContent="space-between" spacing={{ xs: 4, xl: 12 }}>
          <Grid container direction="column" size={{ xs: 12, xl: 6 }} spacing={3}>
            <BusinessCard />
            <Stack spacing={0.5}>
              <Typography variant="body1" color={colors.black950} fontWeight={600}>
                {t('newsletter.title')}
              </Typography>
              <Newsletter />
              <Stack direction="row" alignItems="center" pt={1} gap={1}>
                <Tooltip
                  title={t('newsletter.description')}
                  placement="right-end"
                  slotProps={{
                    transition: { timeout: 0 },
                  }}
                >
                  <Icon>
                    <Info size={24} fill={colors.blue500} />
                  </Icon>
                </Tooltip>
                <Typography variant="body2" color={colors.black950}>
                  {t('newsletter.subscribeDescription')}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid container size={{ xs: 12, xl: 5 }}>
            {footerMenu.map(menuItem => (
              <Grid key={menuItem.title} size={6}>
                <FooterMenuItem {...menuItem} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <FooterBottomBar />
      </Container>
    </Container>
  );
};

export default Footer;
