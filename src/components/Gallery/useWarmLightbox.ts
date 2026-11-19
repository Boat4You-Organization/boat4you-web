import { useEffect } from 'react';

/**
 * Fetches the lightbox's code ahead of the first tap, once the page is idle. It is loaded lazily (it carries the
 * swiper), so the first tap on a photo or on the layout drawing waited for a download before anything moved, and in
 * the recordings that read as a tap with no reaction: 97 of 543 taps on photos in the week to 19.11.2026. The
 * component still mounts on the first open only.
 */
const useWarmLightbox = () => {
  useEffect(() => {
    const warm = () => {
      import('./Lightbox').catch(() => {});
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 4000 });

      return () => window.cancelIdleCallback(id);
    }

    // Safari before 18 has no requestIdleCallback.
    const timer = window.setTimeout(warm, 2500);

    return () => window.clearTimeout(timer);
  }, []);
};

export default useWarmLightbox;
