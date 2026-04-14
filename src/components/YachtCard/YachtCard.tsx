import React from 'react';

import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import Image from 'next/image';

import FlagIcon from '@/components/FlagIcon';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './YachtCard.module.scss';

interface YachtCardProps {
  mainImageId: number;
  model: string;
  name: string;
  locationCountryCode: string;
  locationName: string;
  imgSize?: number;
  children?: React.ReactNode;
}

const YachtCard = ({
  mainImageId,
  model,
  name,
  locationCountryCode,
  locationName,
  imgSize,
  children,
}: YachtCardProps) => (
  <Card classes={{ root: styles.root }} className={styles.container}>
    <CardMedia className={styles.cardMedia}>
      <Image
        src={getBoatImageUrl(mainImageId, 256)}
        alt={`${model} ${name || ''} boat image`}
        width={imgSize || 104}
        height={imgSize || 104}
        className={styles.image}
      />
    </CardMedia>
    <CardContent className={styles.content}>
      <Typography variant="h3" fontWeight={700} whiteSpace="wrap">
        {model} | {name}
      </Typography>
      {locationName && (
        <Stack direction="row" alignItems="flex-start" gap={1} mt={0.5}>
          <FlagIcon countryCode={locationCountryCode} />
          <Typography variant="body1">{locationName}</Typography>
        </Stack>
      )}
      {children}
    </CardContent>
  </Card>
);

export default YachtCard;
