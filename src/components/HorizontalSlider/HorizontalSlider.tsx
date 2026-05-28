'use client';

import { useCallback, useEffect, useRef } from 'react';

import cx from 'clsx';
// Type-only — keeps the `handleSwiper` signature compatible with callers
// (SliderSection) without pulling Swiper's ~90KB runtime into the bundle.
import type { Swiper as SwiperType } from 'swiper';

import styles from './HorizontalSlider.module.scss';

interface HorizontalSliderProps<T> {
  data: T[];
  handleSwiper?: (swiper: SwiperType) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  customStyles?: {
    container?: string;
    slide?: string;
  };
  maxSlideWidth?: number;
  slidesPerView?: number | 'auto';
  enableKeyboard?: boolean;
}

/**
 * Native CSS scroll-snap carousel — replaces Swiper on the home page
 * (Destinations / OurFleet / Blog all funnel through here). Swiper added
 * ~90KB of JS plus a forced layout reflow on init that PSI flagged as the
 * dominant mobile TBT cost. A flex + `scroll-snap-type` row gives the same
 * swipe/drag behaviour for free (touch + trackpad), with the prev/next
 * arrows driven by a tiny controller that mimics Swiper's `slideNext` /
 * `slidePrev` so `SliderSection` needs no changes.
 */
const HorizontalSlider = <T,>({
  data,
  handleSwiper,
  renderItem,
  customStyles,
  maxSlideWidth,
}: HorizontalSliderProps<T>) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Expose a Swiper-shaped controller to the parent so its carousel buttons
  // keep working. One "page" = ~80% of the visible width, matching the feel
  // of Swiper's group advance.
  useEffect(() => {
    const el = scrollerRef.current;

    if (!el || !handleSwiper) return undefined;

    const page = () => Math.max(240, Math.round(el.clientWidth * 0.8));

    const controller = {
      slideNext: () => el.scrollBy({ left: page(), behavior: 'smooth' }),
      slidePrev: () => el.scrollBy({ left: -page(), behavior: 'smooth' }),
      get isBeginning() {
        return el.scrollLeft <= 1;
      },
      get isEnd() {
        return Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 1;
      },
    } as unknown as SwiperType;

    handleSwiper(controller);

    return undefined;
  }, [handleSwiper]);

  // Vertical wheel → horizontal scroll while the pointer is over the row,
  // releasing to normal page scroll at the edges (Swiper's forceToAxis +
  // releaseOnEdges). Native non-passive listener so preventDefault is honored.
  const onWheelNative = useCallback((event: WheelEvent) => {
    const el = scrollerRef.current;

    if (!el) return;

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const atStart = el.scrollLeft <= 0 && event.deltaY < 0;
    const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth && event.deltaY > 0;

    if (atStart || atEnd) return;

    event.preventDefault();
    el.scrollLeft += event.deltaY;
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;

    if (!el) return undefined;

    el.addEventListener('wheel', onWheelNative, { passive: false });

    return () => el.removeEventListener('wheel', onWheelNative);
  }, [onWheelNative]);

  return (
    <div ref={scrollerRef} className={cx(styles.scroller, customStyles?.container)}>
      {data.map((item, index) => (
        <div
          key={`${index + 1}`}
          className={cx(styles.slide, customStyles?.slide)}
          style={maxSlideWidth ? { maxWidth: maxSlideWidth } : undefined}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default HorizontalSlider;
