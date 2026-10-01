'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

/**
 * Rendered height of one compact month in the mobile date sheet
 * (`fixedWeekNumber={6}`, compact day cells) — the placeholder reserves exactly
 * this, so the list's scroll length never jumps when a month mounts.
 */
const MONTH_HEIGHT = 286;

/** Mount a month this far before it scrolls into view (~2 months ahead). */
const PREFETCH_MARGIN = '600px 0px';

const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  let node = el?.parentElement ?? null;

  while (node) {
    const { overflowY } = getComputedStyle(node);

    if (overflowY === 'auto' || overflowY === 'scroll') return node;

    node = node.parentElement;
  }

  return null;
};

interface LazyMonthProps {
  /** Render immediately (the first months the sheet shows on open). */
  eager: boolean;
  children: ReactNode;
}

/**
 * The mobile date sheet lists every month from now to the end of next year
 * (15+ MUI calendars, ~460 day cells). Mounting them all when the sheet opened
 * blocked the main thread for 4 s at 4x CPU (808 ms even on a fast laptop),
 * which is the "calendar opens terribly slowly" Mario reported on 1.10.2026.
 * Months below the fold render a same-height placeholder and mount once they
 * come within PREFETCH_MARGIN of the sheet's scroll viewport, then stay.
 */
const LazyMonth = ({ eager, children }: LazyMonthProps) => {
  const [visible, setVisible] = useState(eager);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = placeholderRef.current;

    if (visible || !el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);

      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root: findScrollParent(el), rootMargin: PREFETCH_MARGIN }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [visible]);

  if (visible) return children;

  return <Box ref={placeholderRef} aria-hidden sx={{ height: MONTH_HEIGHT, flexShrink: 0 }} />;
};

export default LazyMonth;
