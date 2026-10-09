'use client';

import { useMemo, useState } from 'react';

import { ZoomInOutlined } from '@mui/icons-material';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import FloorPlan from '@/components/SvgIcons/FloorPlan';
import { YachtImage } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { withoutMainImage } from '@/utils/static/yachtLayout';

import styles from './LayoutSection.module.scss';

// The gallery's lightbox, fetched on the first open like the gallery does.
const Lightbox = dynamic(() => import('@/components/Gallery/Lightbox'));

interface LayoutSectionProps {
  /** The boat's layout drawings (yachtLayout.ts); none renders nothing. */
  images: YachtImage[];
  /** The boat as its photos' alt text names it (yachtPhotoName.ts). */
  photoName: string;
}

/**
 * The boat's layout on its own, above Amenities (owner, 9.10.2026): the
 * drawing whole (contain, never cropped) in a box of fixed proportions, so
 * nothing moves while it loads; a click or tap opens it full screen. The
 * layouts are not in the photo gallery (yachtLayout.ts).
 */
const LayoutSection = ({ images, photoName }: LayoutSectionProps) => {
  const t = useTranslations('common');
  const [isOpen, setIsOpen] = useState(false);
  // Mounted from the first open on (and kept, so it can animate closed).
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const [selected, setSelected] = useState(0);
  // The lightbox in the block's order (it would put a main layout first).
  const lightboxImages = useMemo(() => withoutMainImage(images), [images]);

  if (images.length === 0) return null;

  const title = t('layoutTitle');
  // "Lagoon 55 The Moon — Layout", numbered when the boat has more than one.
  const imageAlt = (index: number): string =>
    `${photoName} — ${title}${images.length > 1 ? ` ${index + 1}` : ''}`.trim();

  const open = (index: number) => {
    setSelected(index);
    setLightboxMounted(true);
    setIsOpen(true);
  };

  return (
    <Stack component="section" aria-labelledby="boat-layout-title" direction="column" spacing={3}>
      <Typography
        id="boat-layout-title"
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <FloorPlan variant="secondary" size={32} />
        {title}
      </Typography>
      <Box className={cx(styles.grid, { [styles.multiple]: images.length > 1 })}>
        {images.map((image, index) => (
          <ButtonBase
            key={image.id}
            className={styles.tile}
            onClick={() => open(index)}
            aria-label={t('layoutEnlarge', { name: imageAlt(index) })}
            focusRipple
          >
            <Image
              src={getBoatImageUrl(image.id, 1200)}
              alt={imageAlt(index)}
              fill
              sizes={images.length > 1 ? '(max-width: 640px) 100vw, 440px' : '(max-width: 900px) 100vw, 880px'}
              draggable={false}
              className={styles.image}
            />
            <Box component="span" aria-hidden="true" className={styles.zoom}>
              <ZoomInOutlined sx={{ fontSize: 22, color: colors.black950 }} />
            </Box>
          </ButtonBase>
        ))}
      </Box>
      {lightboxMounted && (
        <Lightbox
          open={isOpen}
          onClose={() => setIsOpen(false)}
          images={lightboxImages}
          selectedImage={selected}
          showShareAndFavorite={false}
          photoName={photoName}
          imageAlt={imageAlt}
        />
      )}
    </Stack>
  );
};

export default LayoutSection;
