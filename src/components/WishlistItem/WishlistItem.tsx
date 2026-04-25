import { OpenInNew } from '@mui/icons-material';
import { Card, CardActions, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import BoatLocationModal from '@/components/BoatLocationModal';
import FavoriteButton from '@/components/FavoriteButton';
import FlagIcon from '@/components/FlagIcon';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useToggleState from '@/utils/hooks/useToggleState';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './WishlistItem.module.scss';

interface WishlistItemProps {
  yacht: YachtModelLocalStorage;
}

const WishlistItem = ({ yacht }: WishlistItemProps) => {
  const { queryParams } = useQueryParams();
  const [isMapOpen, toggleMap] = useToggleState();

  return (
    <>
      {yacht.location?.name && (
        <BoatLocationModal open={isMapOpen} onClose={toggleMap} locationName={yacht.location.name} />
      )}
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
              {yacht.model} | {toTitleCase(yacht.name)}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              {yacht.location && (
                <Stack direction="row" alignItems="center" gap={1} mt={1}>
                  <FlagIcon countryCode={yacht.location.countryCode} />
                  <Typography
                    variant="body1"
                    role="button"
                    tabIndex={0}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMap();
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMap();
                      }
                    }}
                    sx={{
                      color: colors.blue500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {yacht.location.name}
                    <OpenInNew sx={{ fontSize: 14 }} />
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>
          <CardActions className={styles.actions}>
            <FavoriteButton yacht={yacht} />
          </CardActions>
        </Card>
      </Link>
    </>
  );
};

export default WishlistItem;
