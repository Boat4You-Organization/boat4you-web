'use client';

import { useCallback, useState } from 'react';

import { Box, Button, ImageList, ImageListItem, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import Photos from '@/components/SvgIcons/Photos';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import useToggleState from '@/utils/hooks/useToggleState';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './Gallery.module.scss';

// The lightbox (Swiper + its CSS) is fetched on the first open, not with
// the boat page: the page shipped 1.5 MB of JS on slow phones (audit B41).
const Lightbox = dynamic(() => import('./Lightbox'));

interface GalleryProps {
  yacht?: YachtModel;
  images?: YachtImage[];
  showShareAndFavorite?: boolean;
  maxDisplayedImages?: number;
}

const Gallery = ({ yacht, images, showShareAndFavorite = false, maxDisplayedImages = 5 }: GalleryProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const [imageIndex, setImageIndex] = useState<number>(0);
  // Mounted from the first open on (and kept, so it can animate closed).
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const t = useTranslations('common');

  // "Fountaine Pajot Elba 45 KARINA — photo 3" instead of the old
  // "Image slide 236378" (internal id says nothing to Google Images / AI).
  // Partners often bake the brand into the model ("Lagoon 46") — skip the
  // manufacturer when the model already starts with it, else "Lagoon Lagoon 46".
  const manufacturerPrefix =
    yacht?.manufacturerName && !yacht.modelName?.toLowerCase().startsWith(yacht.manufacturerName.toLowerCase())
      ? yacht.manufacturerName
      : undefined;
  const yachtLabel = [manufacturerPrefix, yacht?.modelName, yacht?.name].filter(Boolean).join(' ');
  const yachtPhotoLabel = (index: number) => `${yachtLabel || 'Yacht'} — photo ${index + 1}`;

  const yachtImages = [...(images || yacht?.yachtImages || [])].sort((a, b) => {
    if (a.mainImage !== b.mainImage) return a.mainImage ? -1 : 1;

    return a.position - b.position;
  });
  const displayedSlides = yachtImages.slice(0, maxDisplayedImages);
  const isThreeImagesLayout = displayedSlides.length === 3;

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
          {displayedSlides.map(({ id }, index) => (
            <ImageListItem
              key={id}
              cols={1}
              rows={1}
              onClick={handleImageClick}
              data-index={index}
              component="div"
              className={cx(styles.imageItem, {
                [styles.firstItem]: index === 0,
              })}
            >
              <Image
                src={getBoatImageUrl(id, 1200)}
                alt={yachtPhotoLabel(index)}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                draggable={false}
                className={styles.image}
                // The first photo is the boat page's LCP (painted at 8 s on
                // slow 4G while lazy-loaded, audit B41).
                preload={index === 0}
                loading={index === 0 ? 'eager' : undefined}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </ImageListItem>
          ))}
        </ImageList>
        {yachtImages.length > maxDisplayedImages && (
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
