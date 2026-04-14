'use client';

import { Container, Skeleton, Stack } from '@mui/material';

const BoatHeroSection = () => (
  <Container component="section" maxWidth="xl" disableGutters>
    <Stack direction="row" justifyContent="space-between" alignItems="center" pt={11} pb={2}>
      <Stack direction="column" spacing={0.5}>
        <Skeleton variant="text" width={140} height={34} />
        <Skeleton variant="text" width={140} height={28} />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Skeleton variant="text" sx={{ width: { xs: 34, sm: 94 }, height: { xs: 34, sm: 46 } }} />
        <Skeleton variant="text" sx={{ width: { xs: 34, sm: 94 }, height: { xs: 34, sm: 46 } }} />
      </Stack>
    </Stack>
    <Skeleton variant="rounded" width="100%" height={418} sx={{ borderRadius: 5 }} />
  </Container>
);

export default BoatHeroSection;
