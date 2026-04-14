'use client';

import React, { useEffect, useState } from 'react';

import { Box, Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import BlogHeroSectionLoader from '@/components/Loaders/Blog/BlogHeroSectionLoader';
import { getBlogs } from '@/lib/api';
import colors from '@/styles/themes/colors';
import { BlogTeaser } from '@/types/blog.type';
import DateTime from '@/utils/static/DateTime';
import { selectFeatureBlog } from '@/valtio/blog/blog.actions';

import styles from './BlogHeroSection.module.scss';

const BlogHeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [featureBlog, setFeatureBlog] = useState<BlogTeaser | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('common');

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);

      const blogs = await getBlogs(1);

      if (blogs.nodes && blogs.nodes.length > 0) {
        const featuredBlog = blogs.nodes[0];

        setFeatureBlog(featuredBlog);
        selectFeatureBlog(featuredBlog.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (isLoading) {
    return <BlogHeroSectionLoader />;
  }

  if (!featureBlog) {
    return <Stack direction="column" minHeight={{ xs: 764, md: 798 }} justifyContent="center" alignItems="center" />;
  }

  return (
    <Container maxWidth="xl" disableGutters component="section" className={styles.container}>
      <Typography component="h1" className={styles.hidden}>
        {t('blog.mainTitle')}
      </Typography>

      <Grid
        container
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'baseline', md: 'center' }}
        spacing={3}
      >
        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <Stack direction="column" spacing={{ xs: 2, md: 3 }}>
            <Typography variant="body1" color={colors.black500}>
              {DateTime.formatDayForBlog(dayjs(featureBlog.date))}
            </Typography>
            <Link
              href={`/blog/${featureBlog.slug}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Typography variant="h2" fontWeight={700} className={clsx({ [styles.linkActive]: isHovered })}>
                {featureBlog.title}
              </Typography>
            </Link>
            <Link
              href={`/blog/${featureBlog.slug}`}
              className={styles.linkWrapper}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button size="large">{t('readMore')}</Button>
            </Link>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <Link
            href={`/blog/${featureBlog.slug}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Box className={styles.imageWrapper}>
              <Image
                src={featureBlog.featuredImage.sourceUrl}
                alt={featureBlog.featuredImage.altText}
                fill
                sizes="(max-width: 899px) 100vw, 58vw"
                className={styles.image}
              />
            </Box>
          </Link>
        </Grid>
      </Grid>
      <Divider classes={{ root: styles.root }} className={styles.divider} />
    </Container>
  );
};

export default BlogHeroSection;
