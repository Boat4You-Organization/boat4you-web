'use client';

import { useEffect } from 'react';

// Registers the PWA service worker (/public/sw.js) on production page load.
// Dev is skipped so HMR / fast-refresh aren't served from a stale cache. The
// SW itself never caches the backend API, so prices/availability stay live.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return undefined;

    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return undefined;

    const register = (): void => {
      // Registration failures are non-fatal — the site works without the SW.
      navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    };

    if (document.readyState === 'complete') {
      register();

      return undefined;
    }

    window.addEventListener('load', register, { once: true });

    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
