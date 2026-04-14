import { Container, Grid, Skeleton, Stack } from '@mui/material';

const BlogsSectionLoader = () => (
  <Container maxWidth="xl" component="section" disableGutters sx={{ paddingInline: 0 }}>
    <Grid container rowSpacing={{ xs: 3, md: 3.5 }} columnSpacing={2.5}>
      {Array.from({ length: 8 }, (_, index) => (
        <Grid key={index} size={{ xs: 12, md: 6, lg: 3 }}>
          <Stack spacing={{ xs: 1, md: 2 }}>
            <Skeleton
              variant="rounded"
              width="100%"
              sx={{
                borderRadius: 1.5,
                height: { xs: 108, md: 190 },
              }}
            />
            <Skeleton variant="text" width="100%" height={26} />
            <Skeleton variant="text" width="80%" height={24} />
          </Stack>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default BlogsSectionLoader;
