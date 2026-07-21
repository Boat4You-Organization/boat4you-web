/** srcset for repo-local /images statics — every raster has pre-generated
 *  -640/-960 siblings (generated blanket with withoutEnlargement, so the
 *  files are guaranteed to exist). The original is declared as 1600w — a
 *  close-enough ceiling for the 1440-2450px source files; exactness only
 *  shifts the browser's pick threshold. For the plain-<img> call sites
 *  (itinerary hub/area cards) that skip next/image. */
export const staticSrcSet = (src: string): string | undefined => {
  if (!src.startsWith('/images/')) return undefined;

  const dot = src.lastIndexOf('.');

  if (dot < 0) return undefined;

  const ext = src.slice(dot).toLowerCase();

  if (!['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) return undefined;

  const base = src.slice(0, dot);
  const tail = src.slice(dot);

  return `${base}-640${tail} 640w, ${base}-960${tail} 960w, ${src} 1600w`;
};
