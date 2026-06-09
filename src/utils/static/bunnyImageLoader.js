/**
 * Custom next/image loader.
 *
 * Yacht photos live at `<origin>/public/image/<id>` and the BACKEND already
 * resizes them on a `?width=` query param (OpenCV → webp). Routing them through
 * Next's built-in optimizer made cusma1 re-resize + cache every variant in
 * `.next/cache/images` — that cache has no size cap, grew to ~6 GB, filled the
 * 26 GB disk (recurring freeze) and meant images were served from cusma1 rather
 * than the Bunny edge. So for these we let <Image> point straight at the
 * CDN/backend with the width Next requests: the browser fetches the
 * correctly-sized image directly from Bunny's edge — no local optimizer, no
 * local cache, true CDN offload.
 *
 * Requires "Cache by query string" enabled on the Bunny pull zone, otherwise
 * Bunny serves one cached full-size original for every width.
 *
 * Anything that is NOT our `/public/image/` endpoint (country flags from
 * flagcdn, WordPress/blog media, locally-imported static assets) does not
 * expose a `?width=` resize, so it is returned unchanged and simply passes
 * through.
 *
 * @param {{ src: string, width: number, quality?: number }} params
 * @returns {string}
 */
const bunnyImageLoader = ({ src, width }) => {
  if (typeof src !== 'string' || !src.includes('/public/image/')) return src;

  const [base] = src.split('?');

  return `${base}?width=${width}`;
};

export default bunnyImageLoader;
