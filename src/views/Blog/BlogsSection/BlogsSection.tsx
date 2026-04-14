'use client';

import React from 'react';

import { Button, CircularProgress, Container, Grid, Stack, Tabs, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import BlogCard from '@/components/BlogCard';
import BlogsSectionLoader from '@/components/Loaders/Blog/BlogsSectionLoader';
import PillTab from '@/components/PillTab';
import blogCategories from '@/config/blogCategories.config';
import { useBlogStore } from '@/valtio/blog/blog.store';

import useBlogParams from './useBlogsParams';

const BlogsSection = () => {
  const { featureBlogId } = useBlogStore();

  const t = useTranslations('common.blog');
  const {
    filteredBlogs,
    isLoading,
    isLoadingMore,
    hasNextPage,
    activeCategory,
    handleCategoryChange,
    handlePageChange,
  } = useBlogParams();

  const handleTabsChange = (_: React.ChangeEvent<{}>, newValue: string) => {
    handleCategoryChange(newValue);
  };

  const blogsToDisplay = filteredBlogs?.filter(blog => blog.id !== featureBlogId) ?? [];

  if (!filteredBlogs) {
    return null;
  }

  // if (true) {
  //   return <BlogsSectionLoader />;
  // }

  return (
    <Container maxWidth="xl" component="section" disableGutters>
      <Typography variant="h2" fontWeight={700} pb={3}>
        {t('title')}
      </Typography>
      <Tabs
        value={activeCategory}
        onChange={handleTabsChange}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          '& .MuiTabs-flexContainer': {
            gap: '12px',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {blogCategories.map(({ slug, name }) => (
          <PillTab key={slug} value={slug} label={name} title={name} />
        ))}
      </Tabs>
      {isLoading ? (
        <Stack direction="column" justifyContent="center" alignItems="center" mt={4} mb="22px">
          <BlogsSectionLoader />
        </Stack>
      ) : (
        <>
          <Grid container pt={4} rowSpacing={{ xs: 3, md: 3.5 }} columnSpacing={2.5} mb="22px">
            {blogsToDisplay.map(blog => (
              <Grid key={blog.id} size={{ xs: 12, md: 6, lg: 3 }}>
                <BlogCard {...blog} />
              </Grid>
            ))}
          </Grid>
          {hasNextPage && (
            <Stack direction="column" justifyContent="center" alignItems="center" mb="22px">
              {isLoadingMore ? (
                <CircularProgress />
              ) : (
                <Button color="secondary" size="large" onClick={handlePageChange} disabled={isLoadingMore}>
                  {t('ctaButton')}
                </Button>
              )}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogsSection;
