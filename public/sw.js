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
const VERSION = 'b4y-v2';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
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
  const { request } = event;

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

/* Boat4You Trip push (phase 2). The backend sends a JSON payload
 * {title, body, url, tag}; the click opens the trip hub (focusing an already
 * open one when possible). The hub records PUSH_OPEN itself via the ?push=
 * query param in the URL, so the SW stays dumb. */
self.addEventListener('push', event => {
  if (!event.data) return;

  let payload;

  try {
    payload = event.data.json();
  } catch (_) {
    return;
  }
  event.waitUntil(
    self.registration.showNotification(payload.title || 'Boat4You', {
      body: payload.body || '',
      tag: payload.tag || 'boat4you-trip',
      icon: '/favicons/android-chrome-192x192.png',
      badge: '/favicons/favicon-32x32.png',
      data: { url: payload.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
      const open = windows.find(w => w.url.split('?')[0] === url.split('?')[0]);

      if (open) return open.focus();

      return self.clients.openWindow(url);
    })
  );
});
