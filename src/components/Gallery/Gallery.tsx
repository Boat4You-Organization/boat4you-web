'use client';

import { useCallback, useState } from 'react';

import { ImageOutlined } from '@mui/icons-material';
import { Box, Button, ImageList, ImageListItem, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import Photos from '@/components/SvgIcons/Photos';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { isMarinaImage, marinaCaption, sortGalleryImages } from '@/utils/static/yachtLayout';
import { yachtPhotoName } from '@/utils/static/yachtPhotoName';

import styles from './Gallery.module.scss';
import PhotoCredit from './PhotoCredit';
import { galleryPhotoAlt } from './photoAlt';

// The lightbox (Swiper + its CSS) is fetched on the first open, not with
// the boat page: the page shipped 1.5 MB of JS on slow phones (audit B41).
const Lightbox = dynamic(() => import('./Lightbox'));

interface GalleryProps {
  yacht?: YachtModel;
  images?: YachtImage[];
  showShareAndFavorite?: boolean;
  maxDisplayedImages?: number;
  /** The boat as the photos' alt text names it when only `images` are passed (My bookings). */
  photoName?: string;
}

// A marina photo's caption and credit on its tile (PhotoCredit); nothing on any other photo.
const TileCredit = ({ image }: { image: YachtImage }) => {
  const credit = marinaCaption(image);

  return credit ? <PhotoCredit credit={credit} placement="tile" /> : null;
};

const Gallery = ({ yacht, images, showShareAndFavorite = false, maxDisplayedImages = 5, photoName }: GalleryProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const [imageIndex, setImageIndex] = useState<number>(0);
  // Mounted from the first open on (and kept, so it can animate closed).
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const t = useTranslations('common');

  // Every picture names the boat, "Fountaine Pajot Elba 45 Karina — photo 3"
  // (yachtPhotoName.ts): its own photos, its model's, the marina's and a
  // layout drawing alike (photoAlt.ts).
  const photoLabel = yachtPhotoName(yacht) || photoName || 'Yacht';
  const altWords = {
    photo: (label: string, n: string) => t('photoAlt' as never, { label, n } as never),
    layout: t('layoutTitle' as never),
  };
  const photoAlt = (image: YachtImage, index: number): string => galleryPhotoAlt(image, index, photoLabel, altWords);

  // The boat's photos, its model's, the marina's last (yachtLayout.ts). A
  // marina photo never takes the first tile (the boat's picture): a boat with
  // nothing but marina photos gets an empty tile there, the marina's beside it.
  const yachtImages = sortGalleryImages(images || yacht?.yachtImages);
  const placeholderHero = isMarinaImage(yachtImages[0]);
  const displayedSlides = yachtImages.slice(0, maxDisplayedImages - Number(placeholderHero));
  const isThreeImagesLayout = displayedSlides.length + Number(placeholderHero) === 3;
  // The photo on the first tile (none behind the empty one).
  const leadIndex = placeholderHero ? -1 : 0;

  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const {
        currentTarget: {
          dataset: { index },
        },
      } = event;
      const newIndex = Number(index);

      setImageIndex(newIndex);
      setLightboxMounted(true);
      toggeIsOpen();
    },
    [toggeIsOpen]
  );

  const handleButtonClick = useCallback(() => {
    setImageIndex(0);
    setLightboxMounted(true);
    toggeIsOpen();
  }, [toggeIsOpen]);

  return (
    <>
      {lightboxMounted && (
        <Lightbox
          open={isOpen}
          onClose={toggeIsOpen}
          {...(yacht ? { yacht } : { images })}
          selectedImage={imageIndex}
          showShareAndFavorite={showShareAndFavorite}
          photoName={photoLabel}
        />
      )}
      <Box position="relative" width="100%">
        <ImageList
          variant="quilted"
          component="div"
          cols={4}
          classes={{ root: styles.root }}
          className={cx(styles.imageList, { [styles.threeImagesLayout]: isThreeImagesLayout })}
          rowHeight="auto"
          gap={20}
        >
          {placeholderHero && (
            // The boat's place, empty (the theme's grey tile); a click opens
            // the marina photos, the only tile a phone shows.
            <ImageListItem
              key="placeholder"
              cols={1}
              rows={1}
              onClick={handleImageClick}
              data-index={0}
              component="div"
              className={cx(styles.imageItem, styles.firstItem)}
            >
              <ImageOutlined
                sx={{ position: 'absolute', inset: 0, m: 'auto', fontSize: 40, color: colors.black400, opacity: 0.5 }}
              />
            </ImageListItem>
          )}
          {displayedSlides.map((image, index) => (
            <ImageListItem
              key={image.id}
              cols={1}
              rows={1}
              onClick={handleImageClick}
              data-index={index}
              component="div"
              className={cx(styles.imageItem, {
                [styles.firstItem]: index === leadIndex,
              })}
            >
              <Image
                src={getBoatImageUrl(image.id, 1200)}
                alt={photoAlt(image, index)}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                draggable={false}
                className={styles.image}
                // The first photo is the boat page's LCP (painted at 8 s on
                // slow 4G while lazy-loaded, audit B41).
                preload={index === leadIndex}
                loading={index === leadIndex ? 'eager' : undefined}
                fetchPriority={index === leadIndex ? 'high' : undefined}
              />
              <TileCredit image={image} />
            </ImageListItem>
          ))}
        </ImageList>
        {yachtImages.length > displayedSlides.length && (
          <Stack position="absolute" bottom={12} right={12} zIndex={2}>
            <Button variant="outlinedSecondary" startIcon={<Photos size={24} />} onClick={handleButtonClick}>
              {t('showAllPhotos')}
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Gallery;
