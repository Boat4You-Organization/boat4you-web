import { Container, Divider, Grid, Skeleton, Stack } from '@mui/material';

import styles from './BlogHeroSectionLoader.module.scss';

const BlogHeroSectionLoader = () => (
  <Container maxWidth="xl" disableGutters component="section" className={styles.container}>
    <Grid
      container
      direction={{ xs: 'column-reverse', md: 'row' }}
      alignItems={{ xs: 'baseline', md: 'center' }}
      spacing={3}
    >
      <Grid size={{ xs: 12, md: 6, lg: 5 }}>
        <Stack direction="column" spacing={{ xs: 2, md: 3 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width="100%" height={68} />
          <Skeleton variant="rounded" width={116} height={48} sx={{ borderRadius: 2 }} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 7 }}>
        <Skeleton variant="rounded" className={styles.imageWrapper} sx={{ borderRadius: 4 }} />
      </Grid>
    </Grid>
    <Divider classes={{ root: styles.root }} className={styles.divider} />
  </Container>
);

export default BlogHeroSectionLoader;
