import { Box, Skeleton, Stack } from '@mui/material';
import cx from 'clsx';

import styles from './BoatListingItemCard.module.scss';

interface BoatListingItemCardProps {
  isGridView: boolean;
}

const BoatListingItemCard = ({ isGridView }: BoatListingItemCardProps) => (
  <Box className={cx(styles.container, { [styles.gridView]: isGridView })}>
    <Skeleton variant="rounded" className={cx(styles.imageWrapper, { [styles.gridView]: isGridView })} />
    <Stack>
      <Skeleton variant="text" width={isGridView ? 200 : 300} height={38} />
      <Skeleton variant="text" width={100} height={28} sx={{ mt: 1 }} />
      <Skeleton variant="text" width={100} height={24} sx={{ mt: 1.5 }} />
      {!isGridView && <Skeleton variant="text" width={160} height={24} sx={{ mt: 3 }} />}
    </Stack>
  </Box>
);

export default BoatListingItemCard;
