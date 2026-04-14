'use client';

/* eslint-disable react/no-danger */
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import SocialIcon from '@/components/SocialIcon';
import LinkIcon from '@/components/SvgIcons/Link';
import Facebook from '@/components/SvgIcons/Socials/Facebook';
import Twitter from '@/components/SvgIcons/Socials/Twitter';
import { meta } from '@/config/meta';
import colors from '@/styles/themes/colors';
import { Blog } from '@/types/blog.type';
import DateTime from '@/utils/static/DateTime';
import copyToClipboard from '@/utils/static/copyToClipboard';

import styles from './SingleBlogContent.module.scss';
import './styles.scss';

const SingleBlogContent = ({ slug, title, date, categories, featuredImage, content }: Blog) => {
  const url = `${meta.url}/blog/${slug}`;
  const t = useTranslations('common');

  const handleCopyLink = () => {
    copyToClipboard(window.location.toString(), 'Link copied to clipboard');
  };

  return (
    <Container component="section" maxWidth="xl" disableGutters className={clsx('wp-container ', styles.container)}>
      <Stack maxWidth={846} marginInline="auto" pb={4} spacing={3}>
        <Typography variant="h1" fontWeight={700}>
          {title}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body1" component="span" color={colors.black500}>
            {DateTime.formatDayForBlog(dayjs(date))}
          </Typography>
          <Stack direction="row" spacing={2}>
            {categories.nodes?.map(category => (
              <Typography
                key={category.id}
                component="span"
                variant="body1"
                color={colors.black500}
                className={styles.category}
              >
                {category.name}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" pt={1} spacing={1.5} className={styles.socials}>
          <SocialIcon
            className={styles.iconButton}
            icon={Facebook}
            url={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            ariaLabel={t('share')}
          />
          <SocialIcon
            className={styles.iconButton}
            icon={Twitter}
            url={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out this blog!')}`}
            ariaLabel={t('share')}
          />
          <IconButton onClick={handleCopyLink} className={styles.iconButton} aria-label={t('copyLink')}>
            <LinkIcon size={24} />
          </IconButton>
        </Stack>
        <Box className={styles.imageWrapper} pt={6}>
          <Image
            src={featuredImage.sourceUrl}
            alt={featuredImage.altText || title}
            fill
            sizes="(max-width: 899px) 100vw, 846px"
            className={styles.image}
          />
        </Box>
      </Stack>
      <div dangerouslySetInnerHTML={{ __html: content }} className={styles.body} />
    </Container>
  );
};

export default SingleBlogContent;
