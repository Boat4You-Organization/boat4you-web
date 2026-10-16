import { YachtImage } from '@/models/yacht.model';
import { imageKind } from '@/utils/static/yachtLayout';

export interface GalleryPhotoNames {
  /** The boat ("Lagoon 42 Masterpiece", yachtPhotoName). */
  boat: string;
  /** Its model only ("Lagoon 42", yachtModelPhotoName). */
  model: string;
}

/**
 * A gallery picture's alt text (the tiles and the lightbox): the boat's own
 * photo "Lagoon 42 Masterpiece — photo 3" as before; a photo of another boat
 * of the same model "Lagoon 42 — photo 1", the model only (it is not this
 * boat); a marina photo its caption ("ACI Marina Split"), else its credit
 * (never an empty alt while the API sent a text). `photoAlt` formats
 * common.photoAlt ("{label} — photo {n}").
 */
export const galleryPhotoAlt = (
  image: YachtImage,
  index: number,
  names: GalleryPhotoNames,
  photoAlt: (label: string, n: string) => string
): string => {
  const kind = imageKind(image);

  if (kind === 'MARINA') return image.caption?.trim() || image.credit?.trim() || '';

  return photoAlt(kind === 'MODEL_SAMPLE' ? names.model : names.boat, String(index + 1));
};
