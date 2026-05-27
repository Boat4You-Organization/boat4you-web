'use client';

import { useCallback, useState } from 'react';

import { Box, Button, ImageList, ImageListItem, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Photos from '@/components/SvgIcons/Photos';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import useToggleState from '@/utils/hooks/useToggleState';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './Gallery.module.scss';
import Lightbox from './Lightbox';

interface GalleryProps {
  yacht?: YachtModel;
  images?: YachtImage[];
  showShareAndFavorite?: boolean;
  maxDisplayedImages?: number;
}

const Gallery = ({ yacht, images, showShareAndFavorite = false, maxDisplayedImages = 5 }: GalleryProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const [imageIndex, setImageIndex] = useState<number>(0);
  const t = useTranslations('common');

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
      toggeIsOpen();
    },
    [toggeIsOpen]
  );

  const handleButtonClick = useCallback(() => {
    setImageIndex(0);
    toggeIsOpen();
  }, [toggeIsOpen]);

  return (
    <>
      <Lightbox
        open={isOpen}
        onClose={toggeIsOpen}
        {...(yacht ? { yacht } : { images })}
        selectedImage={imageIndex}
        showShareAndFavorite={showShareAndFavorite}
      />
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
                alt={`Image slide ${id}`}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                draggable={false}
                className={styles.image}
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
