import { DEFAULT_IMAGE } from '@/config/constants.config';

// Image origin: prefer the CDN (Bunny pull zone) when NEXT_PUBLIC_IMAGE_CDN_URL
// is set, otherwise fall back to the API origin. Unset/empty keeps the previous
// behaviour, so shipping this is a no-op until the CDN env var is configured.
const imageOrigin = process.env.NEXT_PUBLIC_IMAGE_CDN_URL || process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

export const getBoatImageBaseUrl = (imageId: number): string => `${imageOrigin}/public/image/${imageId}`;

export const getBoatImageUrl = (imageId: number | undefined | null, width?: number): string => {
  if (!imageId) return DEFAULT_IMAGE;

  const base = getBoatImageBaseUrl(imageId);

  return width ? `${base}?width=${width}` : base;
};
