import React from 'react';

import { Grid, Typography } from '@mui/material';
import Link from 'next/link';

import External from '@/components/SvgIcons/External';

import styles from './GoodToKnowItem.module.scss';

interface GoodToKnowItemProps {
  title: string;
  value: string;
  link?: string;
}

const GoodToKnowItem = ({ title, value, link }: GoodToKnowItemProps) => (
  <Grid container size={{ xs: 12 }} spacing={1}>
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography variant="h4" component="h3" fontWeight={700}>
        {title}
      </Typography>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      {link ? (
        <Link href={link} target="_blank" className={styles.link}>
          <Typography variant="body1">{value}</Typography>
          <External />
        </Link>
      ) : (
        <Typography variant="body1">{value}</Typography>
      )}
    </Grid>
  </Grid>
);

export default GoodToKnowItem;
