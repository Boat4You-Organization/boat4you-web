import { Skeleton, Stack, Typography } from '@mui/material';
import cx from 'clsx';

import colors from '@/styles/themes/colors';

import styles from './FiltersSection.module.scss';

const FiltersSection = () => (
  <Stack className={cx(styles.container)} sx={{ display: { xs: 'none', lg: 'flex' }, gap: 3 }}>
    <Typography component="h2" variant="h4" color={colors.blue500}>
      <Skeleton variant="text" width={100} height={22} />
    </Typography>
    {Array.from({ length: 6 }, (_, index) => (
      <Stack key={index}>
        <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={index === 0 ? 100 : 44} />
      </Stack>
    ))}
    <Stack>
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />
      <Stack gap={3}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={22} />
        ))}
      </Stack>
    </Stack>
    {Array.from({ length: 3 }, (_, index) => (
      <Stack key={index}>
        <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={48} sx={{ borderRadius: 2 }} />
      </Stack>
    ))}
    <Stack>
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />
      <Stack gap={3}>
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={22} />
        ))}
      </Stack>
    </Stack>
    <Stack>
      <Skeleton variant="text" width={120} height={24} sx={{ mb: 3 }} />
      <Stack gap={3}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={22} />
        ))}
      </Stack>
    </Stack>
  </Stack>
);

export default FiltersSection;
