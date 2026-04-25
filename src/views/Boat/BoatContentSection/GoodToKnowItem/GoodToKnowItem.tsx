import React from 'react';

import { Box, Grid, Typography } from '@mui/material';
import Link from 'next/link';

import External from '@/components/SvgIcons/External';

import styles from './GoodToKnowItem.module.scss';

interface GoodToKnowItemProps {
  title: string;
  value: string;
  link?: string;
  onClick?: () => void;
}

const GoodToKnowItem = ({ title, value, link, onClick }: GoodToKnowItemProps) => {
  const renderValue = () => {
    if (onClick) {
      return (
        <Box
          component="button"
          type="button"
          onClick={onClick}
          className={styles.link}
          sx={{ background: 'none', border: 0, p: 0, cursor: 'pointer', font: 'inherit' }}
        >
          <Typography variant="body1">{value}</Typography>
          <External />
        </Box>
      );
    }
    if (link) {
      return (
        <Link href={link} target="_blank" className={styles.link}>
          <Typography variant="body1">{value}</Typography>
          <External />
        </Link>
      );
    }
    return <Typography variant="body1">{value}</Typography>;
  };

  return (
    <Grid container size={{ xs: 12 }} spacing={1}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h4" component="h3" fontWeight={700}>
          {title}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>{renderValue()}</Grid>
    </Grid>
  );
};

export default GoodToKnowItem;
