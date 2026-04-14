import React from 'react';

import { Box, Grid, Typography } from '@mui/material';
import cx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import colors from '@/styles/themes/colors';
import { BlogTeaser } from '@/types/blog.type';
import DateTime from '@/utils/static/DateTime';

import styles from './BlogCard.module.scss';

interface BlogCardProps extends BlogTeaser {
  variant?: 'home' | 'blog';
}

const BlogCard = ({ variant = 'blog', slug, title, date, featuredImage }: BlogCardProps) => (
  <Link href={`/blog/${slug}`} className={styles.container}>
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: variant === 'home' ? 12 : 6, md: 12 }}>
        <Box className={cx(styles.imageWrapper, { [styles.blogWrapper]: variant === 'blog' })}>
          <Image
            src={featuredImage.sourceUrl}
            alt={featuredImage.sourceUrl}
            fill
            sizes="(max-width: 899px) 100vw, 400px"
            className={styles.image}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: variant === 'home' ? 12 : 6, md: 12 }}>
        <Typography
          component="h3"
          variant="h4"
          sx={{
            typography: { xs: 'h4', md: 'h3' },
            fontWeight: { xs: 700, md: 700 },
          }}
          className={styles.title}
        >
          {title}
        </Typography>
        <Typography pt={2} variant="body1" color={colors.black500}>
          {DateTime.formatDayForBlog(dayjs(date))}
        </Typography>
      </Grid>
    </Grid>
  </Link>
);

export default BlogCard;
