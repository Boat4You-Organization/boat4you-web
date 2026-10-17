import React from 'react';

import { Box, CardMedia, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Video from '@/components/SvgIcons/Video';
import { YachtModel } from '@/models/yacht.model';
import { getVideoEmbedUrl, yachtVideoUrl } from '@/utils/static/yachtMedia';
import { yachtPhotoName } from '@/utils/static/yachtPhotoName';

import styles from './VideoTab.module.scss';

interface VideoTabProps {
  yacht: YachtModel;
}

// Embeds the boat's video: our own, which the admin sets on any boat
// (yacht.videoUrl, YouTube or Vimeo — owner 17.10.2026, gulet Allure), else
// the custom boat's showreel (customDetails.videoUrl). Lives in its own tab
// right before FAQ so users can jump straight to the video instead of
// scrolling through the description block. A partner boat without a video
// has no Video tab (tabs.config, singleBoatTabsFor).
const VideoTab = ({ yacht }: VideoTabProps) => {
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');
  const videoUrl = yachtVideoUrl(yacht);

  if (!videoUrl) return null;

  // Named like the gallery's photos ("Lagoon 42 Masterpiece — Vidéo"), not the
  // raw partner name plus an English word ("IDILA  video").
  const videoTitle = [yachtPhotoName(yacht), tCommon('video')].filter(Boolean).join(' — ');

  return (
    <Stack direction="column" spacing={3}>
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Video variant="secondary" size={32} />
        {t('videoTitle')}
      </Typography>
      <Box className={styles.videoContainer}>
        <CardMedia
          component="iframe"
          src={getVideoEmbedUrl(videoUrl)}
          title={videoTitle}
          loading="lazy"
          allowFullScreen
          className={styles.media}
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </Box>
    </Stack>
  );
};

export default VideoTab;
