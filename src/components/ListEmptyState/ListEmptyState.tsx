import { Box, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import EmptySearch from '@/components/SvgIcons/EmptySearch';
import colors from '@/styles/themes/colors';

import styles from './ListEmptyState.module.scss';

interface ListEmptyStateProps {
  title: string;
  description?: string;
  buttonConfig?: {
    text: string;
    href: string;
  };
}

const ListEmptyState = ({ title, description, buttonConfig }: ListEmptyStateProps) => (
  <Stack gap={3} justifyContent="center" alignItems="center" width="100%" mt={{ xs: '60px', sm: 5 }}>
    <Box className={styles.iconWrapper}>
      <EmptySearch size={64} variant="secondary" />
    </Box>
    <Stack gap={1}>
      <Typography
        component="h2"
        textAlign="center"
        sx={{ typography: { xs: 'h3', sm: 'h2' }, fontWeight: '700 !important' }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" textAlign="center" color={colors.black600}>
          {description}
        </Typography>
      )}
    </Stack>
    {buttonConfig && (
      <Link href={buttonConfig.href} className={styles.searchButton}>
        <Button size="large" variant="contained" sx={{ width: { xs: '100%', sm: 360 } }}>
          {buttonConfig.text}
        </Button>
      </Link>
    )}
  </Stack>
);

export default ListEmptyState;
