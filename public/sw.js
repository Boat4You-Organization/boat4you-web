/* boat4you PWA service worker — hand-rolled (no Workbox).
 *
 * Goals: make the site installable + give a clean offline fallback + speed up
 * repeat visits — WITHOUT ever serving stale prices/availability.
 *
 * Caching policy:
 *   - api.boat4you.com .............. NEVER cached (always network) — prices &
 *     availability must be live.
 *   - POST/non-GET .................. never touched (bookings, payments, forms).
 *   - /_next/static (immutable) ..... cache-first.
 *   - page navigations .............. network-first, fall back to cache, then
 *     /offline.html when truly offline (never stale when online).
 *   - same-origin images/fonts ...... stale-while-revalidate.
 *   - everything else (Bunny CDN …) . pass through to network.
 *
 * Bump VERSION to invalidate all caches on a breaking change.
 */
const VERSION = 'b4y-v1';
const STATIC_CACHE = VERSION + '-static';
const PAGE_CACHE = VERSION + '-pages';
const PRECACHE = ['/offline.html', '/manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Live data — never cache the backend API.
  if (url.hostname === 'api.boat4you.com') return;

  // Immutable build assets — cache-first.
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(
          hit =>
            hit ||
            fetch(request).then(res => {
              cache.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Page navigations — network-first (fresh when online), offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then(cache => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then(hit => hit || caches.match('/offline.html')))
    );
    return;
  }

  // Same-origin images/fonts — stale-while-revalidate.
  if (url.origin === self.location.origin && /\.(?:png|jpg|jpeg|webp|svg|gif|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(request).then(hit => {
          const network = fetch(request)
            .then(res => {
              cache.put(request, res.clone());
              return res;
            })
            .catch(() => hit);
          return hit || network;
        })
      )
    );
  }
});
