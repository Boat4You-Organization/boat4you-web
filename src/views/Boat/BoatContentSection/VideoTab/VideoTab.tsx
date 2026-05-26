import React from 'react';

import { Box, CardMedia, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import Video from '@/components/SvgIcons/Video';
import { YachtModel } from '@/models/yacht.model';
import getYouTubeEmbedUrl from '@/utils/static/getYoutubeEmbedUrlUtils';

import styles from './VideoTab.module.scss';

interface VideoTabProps {
  yacht: YachtModel;
}

// Custom-yacht only — embeds the YouTube showreel the admin pasted into
// customDetails.videoUrl. Lives in its own tab between Good to know and
// FAQ so users can jump straight to the video instead of scrolling
// through the description block. External yachts don't expose a video URL
// so the tab is hidden via tabs.config.
const VideoTab = ({ yacht }: VideoTabProps) => {
  const t = useTranslations('yacht');
  const videoUrl = yacht.customDetails?.videoUrl;

  if (!videoUrl) return null;

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
          src={getYouTubeEmbedUrl(videoUrl)}
          title={`${yacht.name} video`}
          allowFullScreen
          className={styles.media}
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </Box>
    </Stack>
  );
};

export default VideoTab;
