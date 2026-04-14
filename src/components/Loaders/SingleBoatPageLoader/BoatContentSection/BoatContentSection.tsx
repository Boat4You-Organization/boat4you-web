import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';

import styles from './BoatContentSection.module.scss';

const BoatContentSection = () => (
  <Container
    component="section"
    maxWidth="xl"
    disableGutters
    classes={{ root: styles.root }}
    className={styles.container}
  >
    <Grid container pt={{ xs: 3, md: 4 }} spacing={2.5}>
      <Grid size={{ xs: 12, md: 7, lg: 8.5 }}>
        <Box className={styles.tabsWrapper}>
          <Skeleton variant="rounded" width="100%" height={48} />
        </Box>
        <Box pt={6} pb={8} className={styles.contentWrapper}>
          <Skeleton variant="text" width={80} height={42} />
          <Stack>
            <Skeleton variant="text" width="100%" height={42} />
            <Skeleton variant="text" width="100%" height={42} />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  </Container>
);

export default BoatContentSection;
