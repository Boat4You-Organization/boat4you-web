import { DEFAULT_IMAGE } from '@/config/constants.config';

export const getBoatImageUrl = (imageId: number | undefined | null, width?: number): string => {
  if (!imageId) return DEFAULT_IMAGE;

  const base = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/image/${imageId}`;

  return width ? `${base}?width=${width}` : base;
};
