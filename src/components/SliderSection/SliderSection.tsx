import { JSX, useRef } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import { Swiper as SwiperType } from 'swiper';

import CarouselButton from '@/components/CarouselButton';
import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import colors from '@/styles/themes/colors';
import useBreakpoint from '@/utils/hooks/useBreakpoint';

import styles from './SliderSection.module.scss';

interface SliderSectionProps {
  title: string;
  emphasizedTitle: string;
  subtitle: string;
  SliderComponent: (props: { handleSwiper: (swiper: SwiperType) => void }) => JSX.Element;
  customStyles?: {
    container?: string;
    overlay?: string;
  };
}

const SliderSection = ({ title, emphasizedTitle, subtitle, SliderComponent, customStyles }: SliderSectionProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { isMobile } = useBreakpoint();
  const t = useTranslations('common');

  const handleSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
  };

  const handleSwiperNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleSwiperPrev = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <Container
      component="section"
      maxWidth={false}
      disableGutters
      classes={{ root: styles.root }}
      className={cx(styles.container, customStyles?.container)}
    >
      <Container maxWidth="xl" disableGutters>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Typography variant="h1" component="h2" color={colors.blue950}>
              {title}{' '}
              <Typography variant="h1" component="span" fontStyle="italic" fontWeight={800} color={colors.blue500}>
                {emphasizedTitle}
              </Typography>
            </Typography>
            <Typography variant="body2" color={colors.black350}>
              {subtitle}
            </Typography>
          </Stack>
          {!isMobile && (
            <Stack direction="row" alignItems="center" gap={1.5} position="relative" zIndex={2}>
              <CarouselButton icon={ChevronLeft} onClick={handleSwiperPrev} ariaLabel={t('previous')} />
              <CarouselButton icon={ChevronRight} onClick={handleSwiperNext} ariaLabel={t('next')} />
            </Stack>
          )}
        </Stack>
        <SliderComponent handleSwiper={handleSwiper} />
      </Container>
      <Box className={cx(styles.overlay, customStyles?.overlay)} />
    </Container>
  );
};

export default SliderSection;
