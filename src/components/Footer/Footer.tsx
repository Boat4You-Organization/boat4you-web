import { Box, Container, Grid } from '@mui/material';

import footerMenu from '@/config/footerMenu';

import BusinessCard from './BusinessCard';
import styles from './Footer.module.scss';
import FooterBottomBar from './FooterBottomBar';
import FooterMenuItem from './FooterMenuItem';

const Footer = () => (
  <Container component="footer" disableGutters classes={{ root: styles.root }} className={styles.container}>
    <Box className={styles.overlay} />
    {/* Inner container — adds 16px horizontal gutters on mobile so text
        doesn't kiss the screen edges. On desktop the parent .container
        already provides enough padding through max-width: xl. */}
    <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3, lg: 0 } }}>
      <Grid container justifyContent="space-between" spacing={{ xs: 4, xl: 12 }}>
        <Grid size={{ xs: 12, xl: 5 }}>
          <BusinessCard />
        </Grid>
        {/* CSS-grid layout. Mobile (xs-sm): 2-col grid where Company sits
            top-left, Legal directly below it, Network spans both rows on
            the right column. Desktop (md+): 3 cols side-by-side per
            Mario's preference. Uses named grid-areas so the swap between
            modes is one declarative change instead of per-item ordering. */}
        <Grid size={{ xs: 12, xl: 7 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
              gridTemplateAreas: {
                xs: '"company network" "legal network"',
                md: '"company legal network"',
              },
              columnGap: 3,
              rowGap: 4,
            }}
          >
            {footerMenu.map(menuItem => (
              <Box key={menuItem.title} sx={{ gridArea: menuItem.title }}>
                <FooterMenuItem {...menuItem} />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <FooterBottomBar />
    </Container>
  </Container>
);

export default Footer;
