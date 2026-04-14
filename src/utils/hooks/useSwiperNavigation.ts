import { useCallback, useEffect, useRef, useState } from 'react';

import { Swiper as SwiperType } from 'swiper';

import useBreakpoint from './useBreakpoint';

interface UseSwiperNavigationProps {
  totalItems: number;
  onSlideChange?: (startIndex: number, endIndex: number) => void;
  onPrefetch?: (startIndex: number, count: number) => void;
}

export const useSwiperNavigation = ({ totalItems, onSlideChange, onPrefetch }: UseSwiperNavigationProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [slidesPerGroup, setSlidesPerGroup] = useState(4);
  const { isMobile } = useBreakpoint();

  const swiperConfig = {
    allowTouchMove: isMobile,
    simulateTouch: isMobile,
    touchRatio: isMobile ? 1 : 0,
    followFinger: !isMobile,
    speed: 800,
  };

  const updateSlidesPerGroup = useCallback(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const containerWidth = swiper.width;
    const spaceBetween = 16;

    const slides = Array.from(swiper.slides);
    let totalWidth = 0;
    let slideCount = 0;

    slides.some(slide => {
      const slideWidth = slide.getBoundingClientRect().width;
      const nextTotalWidth = totalWidth + slideWidth + (slideCount > 0 ? spaceBetween : 0);

      if (nextTotalWidth <= containerWidth) {
        totalWidth = nextTotalWidth;
        slideCount += 1;

        return false;
      }

      return true;
    });

    setSlidesPerGroup(Math.max(1, slideCount));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateSlidesPerGroup, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [updateSlidesPerGroup]);

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
      updateSlidesPerGroup();
    },
    [updateSlidesPerGroup]
  );

  const handleSlideChange = useCallback(
    async (swiper: SwiperType) => {
      const newIndex = swiper.activeIndex;

      setCurrentSlide(newIndex);
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);

      const startIndex = newIndex;
      const endIndex = Math.min(startIndex + slidesPerGroup, totalItems);

      if (onSlideChange) {
        onSlideChange(startIndex, endIndex);
      }
    },
    [slidesPerGroup, totalItems, onSlideChange]
  );

  const slideTo = useCallback(
    (index: number) => {
      if (swiperRef.current) {
        const clampedIndex = Math.max(0, Math.min(index, totalItems - slidesPerGroup));

        swiperRef.current.slideTo(clampedIndex); // Remove hardcoded speed, use swiper config
        setCurrentSlide(clampedIndex);
      }
    },
    [totalItems, slidesPerGroup]
  );

  const handlePrevClick = useCallback(async () => {
    if (!isBeginning) {
      const newIndex = Math.max(0, currentSlide - slidesPerGroup);

      if (onPrefetch) {
        await onPrefetch(newIndex, slidesPerGroup);
      }

      slideTo(newIndex);

      const prefetchStartIndex = Math.max(0, newIndex - slidesPerGroup);

      if (prefetchStartIndex >= 0 && prefetchStartIndex < newIndex && onPrefetch) {
        onPrefetch(prefetchStartIndex, slidesPerGroup);
      }
    }
  }, [currentSlide, isBeginning, slidesPerGroup, slideTo, onPrefetch]);

  const handleNextClick = useCallback(async () => {
    if (!isEnd) {
      const newIndex = Math.min(totalItems - slidesPerGroup, currentSlide + slidesPerGroup);

      if (onPrefetch) {
        await onPrefetch(newIndex, slidesPerGroup);
      }

      slideTo(newIndex);

      const prefetchStartIndex = newIndex + slidesPerGroup;

      if (prefetchStartIndex < totalItems && onPrefetch) {
        onPrefetch(prefetchStartIndex, slidesPerGroup);
      }
    }
  }, [currentSlide, isEnd, totalItems, slidesPerGroup, slideTo, onPrefetch]);

  return {
    swiperRef,
    currentSlide,
    isBeginning,
    isEnd,
    slidesPerGroup,
    isMobile,
    swiperConfig,
    handleSwiper,
    handleSlideChange,
    handlePrevClick,
    handleNextClick,
    slideTo,
  };
};
