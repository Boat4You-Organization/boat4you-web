import { useEffect, useMemo, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, Container, Dialog, IconButton, Stack } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Keyboard, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CarouselButton from '@/components/CarouselButton';
import FavoriteButton from '@/components/FavoriteButton';
import ArrowLeft from '@/components/SvgIcons/ArrowLeft';
import Logo from '@/components/SvgIcons/Logo';
import Share from '@/components/SvgIcons/Share';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import BoatShareModal from '@/views/Boat/BoatHeroSection/BoatShareModal';

import styles from './Lightbox.module.scss';

interface LightboxProps {
  open: boolean;
  onClose: () => void;
  yacht?: YachtModel;
  images?: YachtImage[];
  selectedImage: number;
  showShareAndFavorite?: boolean;
}

const Lightbox = ({ yacht, images, open, onClose, selectedImage, showShareAndFavorite = true }: LightboxProps) => {
  const [isShareModalOpen, toggleShareModal] = useToggleState();
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(selectedImage);
  const t = useTranslations('common');

  const yachtImages = useMemo(
    () =>
      [...(images || yacht?.yachtImages || [])].sort((a, b) => {
        if (a.mainImage !== b.mainImage) return a.mainImage ? -1 : 1;

        return a.position - b.position;
      }),
    [images, yacht?.yachtImages]
  );
  const thumbnailSwiperRef = useRef<SwiperType | null>(null);

  const yachtWithMainImage = useMemo(() => {
    if (!yacht) return null;

    return {
      ...yacht,
      mainImageId: yachtImages.find(el => el.mainImage)?.id || 0,
    };
  }, [yacht, yachtImages]);

  const swiperRef = useRef<SwiperType | null>(null);

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    swiper.slideTo(selectedImage, 0);

    setCurrentSlide(selectedImage);
    setTimeout(() => {
      thumbnailSwiperRef.current?.slideTo(selectedImage, 0);
    }, 100);

    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);

    swiper.on('slideChange', () => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
      setCurrentSlide(swiper.activeIndex);
      thumbnailSwiperRef.current?.slideTo(swiper.activeIndex, 300);
    });
  };

  const handleThumbnailSwiper = (swiper: SwiperType) => {
    thumbnailSwiperRef.current = swiper;
  };

  const handleThumbnailClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    setCurrentSlide(index);
    thumbnailSwiperRef.current?.slideTo(index, 300);
  };

  const handleSwiperNext = () => {
    if (!isEnd) {
      swiperRef.current?.slideNext();
    }
  };

  const handleSwiperPrev = () => {
    if (!isBeginning) {
      swiperRef.current?.slidePrev();
    }
  };

  useEffect(() => {
    setCurrentSlide(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    if (open) {
      setCurrentSlide(selectedImage);
      setIsBeginning(selectedImage === 0);
      setIsEnd(selectedImage === yachtImages.length - 1);
    }
  }, [open, selectedImage, yachtImages.length]);

  return (
    <>
      {yacht && showShareAndFavorite && (
        <BoatShareModal open={isShareModalOpen} onOpen={toggleShareModal} onClose={toggleShareModal} yacht={yacht} />
      )}
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        sx={{
          '&.MuiDialog-root': {
            zIndex: 1500,
          },
          '& .MuiDialog-paper': {
            overflow: 'hidden',
            height: '100dvh',
            width: '100dvw',
            maxHeight: '100%',
            maxWidth: '100%',
            background: colors.white,
            margin: 0,
          },
        }}
      >
        <Container maxWidth="xl" className={styles.container}>
          <Box className={styles.headerWrapper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" className={styles.header}>
              <IconButton onClick={onClose}>
                <ArrowLeft size={24} fill={colors.black950} />
              </IconButton>
              {showShareAndFavorite && (
                <Link href="/" aria-label={t('home')}>
                  <Logo />
                </Link>
              )}
              {yacht && yachtWithMainImage && showShareAndFavorite && (
                <>
                  <Stack direction="row" spacing={2} className={styles.iconsMobile}>
                    <IconButton onClick={toggleShareModal}>
                      <Share fill={colors.black950} />
                    </IconButton>
                    <FavoriteButton yacht={yachtWithMainImage} color={colors.black950} />
                  </Stack>
                  <Stack direction="row" spacing={2} className={styles.iconsDesktop}>
                    <Button variant="containedInfo" startIcon={<Share />} onClick={toggleShareModal}>
                      {t('share')}
                    </Button>
                    <FavoriteButton yacht={yachtWithMainImage} buttonText="Save" />
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
          {/* Full Swiper (not the shared CSS scroll-snap HorizontalSlider) —
              the lightbox drives it via the Swiper API: slideTo, the
              slideChange listener, isBeginning/isEnd and thumbnail sync.
              The home rails use the lightweight scroll-snap version; the
              gallery needs the real thing. */}
          <Swiper
            className={styles.sliderWrapper}
            modules={[Keyboard, Mousewheel]}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
            onSwiper={handleSwiper}
          >
            {yachtImages.map(image => (
              <SwiperSlide key={image.id}>
                <Box className={styles.imageWrapper}>
                  <Image
                    src={getBoatImageUrl(image.id, 1920)}
                    alt={`Gallery image ${image.id}`}
                    fill
                    sizes="100vw"
                    className={styles.image}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            zIndex={3}
            className={styles.navigation}
          >
            <CarouselButton icon={ChevronLeft} onClick={handleSwiperPrev} disabled={isBeginning} />
            <CarouselButton icon={ChevronRight} onClick={handleSwiperNext} disabled={isEnd} />
          </Stack>
          <Box className={styles.thumbnailsWrapper}>
            <Box className={styles.thumbnailsContainer}>
              <Swiper
                className={styles.thumbnailSlider}
                slidesPerView="auto"
                spaceBetween={12}
                onSwiper={handleThumbnailSwiper}
              >
                {yachtImages.map((image, index) => (
                  <SwiperSlide key={image.id} style={{ width: 'auto' }}>
                    <Box
                      className={cx(styles.thumbnailSlide, {
                        [styles.active]: index === currentSlide,
                      })}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Box className={styles.box}>
                        <Image
                          src={getBoatImageUrl(image.id, 256)}
                          alt={`Thumbnail ${image.id}`}
                          fill
                          sizes="120px"
                          className={styles.thumbnailImage}
                        />
                      </Box>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Lightbox;
