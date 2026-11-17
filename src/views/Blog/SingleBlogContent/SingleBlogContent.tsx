'use client';

/* eslint-disable react/no-danger */
import { useEffect, useRef } from 'react';

import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import GooglePreferredSourceCard from '@/components/GooglePreferredSourceCard';
import SocialIcon from '@/components/SocialIcon';
import LinkIcon from '@/components/SvgIcons/Link';
import Facebook from '@/components/SvgIcons/Socials/Facebook';
import Twitter from '@/components/SvgIcons/Socials/Twitter';
import { meta } from '@/config/meta';
import colors from '@/styles/themes/colors';
import { Blog } from '@/types/blog.type';
import DateTime from '@/utils/static/DateTime';
import { nocookieEmbedUrl } from '@/utils/static/blogVideo';
import copyToClipboard from '@/utils/static/copyToClipboard';

import styles from './SingleBlogContent.module.scss';
import './styles.scss';

const SingleBlogContent = ({ slug, title, date, categories, featuredImage, content }: Blog) => {
  const url = `${meta.url}/blog/${slug}`;
  const t = useTranslations('common');
  const locale = useLocale();

  const bodyRef = useRef<HTMLDivElement>(null);

  // Click-to-load YouTube (utils/static/blogVideo.ts): the facade's play button swaps itself for the
  // youtube-nocookie player, so nothing from YouTube loads or sets cookies before the visitor asks for it.
  useEffect(() => {
    const body = bodyRef.current;

    if (!body) return undefined;

    const play = (event: MouseEvent): void => {
      // Only the play button (not the credit line under it).
      const facade = (event.target as Element | null)?.closest?.('.b4y-yt__play')?.closest('.b4y-yt');
      const id = facade?.getAttribute('data-yt-id');

      if (!facade || !id || !/^[\w-]{11}$/u.test(id) || facade.querySelector('iframe')) return;

      event.preventDefault();

      const iframe = document.createElement('iframe');

      iframe.src = nocookieEmbedUrl(id, Number(facade.getAttribute('data-yt-start')) || undefined);
      iframe.title = facade.getAttribute('data-yt-title') || 'Video';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.className = 'b4y-yt__frame';
      facade.querySelector('.b4y-yt__play')?.replaceWith(iframe);
      iframe.focus();
    };

    body.addEventListener('click', play);

    return () => body.removeEventListener('click', play);
  }, [content]);

  const handleCopyLink = () => {
    copyToClipboard(window.location.toString(), 'Link copied to clipboard');
  };

  return (
    <Container component="section" maxWidth="xl" disableGutters className={clsx('wp-container ', styles.container)}>
      <Stack maxWidth={846} marginInline="auto" pb={4} spacing={3}>
        <Typography variant="h1" fontWeight={600}>
          {title}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="body1" component="span" color={colors.black500}>
            {DateTime.formatDayForBlog(dayjs(date), locale)}
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
      <div ref={bodyRef} dangerouslySetInnerHTML={{ __html: content }} className={styles.body} />
      {/* Google "preferred source" nudge right where the reader finishes the
          article, ahead of the itinerary / related-post strips. Same 846px
          column as the body so it reads as the article's closing block. */}
      <Box maxWidth={846} marginInline="auto" mt={{ xs: 5, md: 7 }}>
        <GooglePreferredSourceCard />
      </Box>
    </Container>
  );
};

export default SingleBlogContent;
