import { Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import FavoriteButton from '@/components/FavoriteButton';
import FlagIcon from '@/components/FlagIcon';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './WishlistItem.module.scss';

interface WishlistItemProps {
  yacht: YachtModelLocalStorage;
}

const WishlistItem = ({ yacht }: WishlistItemProps) => {
  const { queryParams } = useQueryParams();

  return (
    <Link href={`/boat/${yacht.slug}?${queryParams}`} className={styles.containerWrapper}>
      <Card classes={{ root: styles.root }} className={styles.container}>
        <CardMedia className={styles.cardMedia}>
          <Image
            src={getBoatImageUrl(yacht.mainImageId, 256)}
            alt={`${yacht.model} ${yacht.name || ''} boat image`}
            fill
            sizes="auto"
            className={styles.image}
          />
        </CardMedia>
        <CardContent className={styles.content}>
          <Typography variant="h3" fontWeight={700} whiteSpace="wrap" className={styles.title}>
            {yacht.model} | {yacht.name}
          </Typography>
          <Stack direction="row" alignItems="center" gap={1}>
            {yacht.location && (
              <Stack direction="row" alignItems="center" gap={1} mt={1}>
                <FlagIcon countryCode={yacht.location.countryCode} />
                <Typography variant="body1">{yacht.location.name}</Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
        <CardActions className={styles.actions}>
          <FavoriteButton yacht={yacht} />
        </CardActions>
      </Card>
    </Link>
  );
};

export default WishlistItem;
