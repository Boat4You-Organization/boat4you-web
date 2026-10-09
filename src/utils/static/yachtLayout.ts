import type { YachtImage } from '@/models/yacht.model';

/**
 * The boat's layout drawing (deck plan) apart from its photos (owner,
 * 9.10.2026: "moram pretraživat slike da nađem layout plovila"). The boat page
 * shows the layout on its own above Amenities and takes it out of the photo
 * gallery, the hero, the lightbox and the photo count; the PDF gives it its
 * own page. Most partner boats carry one (10,685 of 13,035 active on
 * 9.10.2026), some two or three (a bunk-bed variant).
 *
 * The backend flags the image (`layout: true`). The field name is not final,
 * so isLayoutImage is the only place that reads it: `layout === true`, or
 * `kind` / `type` "LAYOUT" in any case. No flag on any image (every boat until
 * the backend ships it) leaves the page exactly as before.
 */
export const isLayoutImage = (image: Pick<YachtImage, 'layout' | 'kind' | 'type'> | null | undefined): boolean => {
  if (!image) return false;

  if (image.layout === true) return true;

  return [image.kind, image.type].some(tag => typeof tag === 'string' && tag.trim().toUpperCase() === 'LAYOUT');
};

export interface YachtImageSplit<T> {
  /** What the gallery, the hero and the photo count show. */
  photos: T[];
  /** The layout drawings, in the partner's order (position). */
  layouts: T[];
}

/**
 * A boat's images split into photos and layout drawings.
 *
 *   - no layout: `photos` is the list as it came, `layouts` empty;
 *   - the main image is a layout: the first photo in gallery order (lowest
 *     position, then the partner's order) becomes the main image, so the
 *     hero, the share card, the favourite and the PDF cover show a photo;
 *   - only layouts, no photo: `photos` keeps them all (the hero shows the
 *     layout as before rather than nothing); `layouts` lists them too.
 */
export const splitLayoutImages = <T extends Pick<YachtImage, 'layout' | 'kind' | 'type' | 'position' | 'mainImage'>>(
  images: T[] | null | undefined
): YachtImageSplit<T> => {
  const all = images ?? [];
  const layouts = all.filter(isLayoutImage);

  if (layouts.length === 0) return { photos: all, layouts };

  const byPosition = [...layouts].sort((a, b) => a.position - b.position);
  const photos = all.filter(image => !isLayoutImage(image));

  if (photos.length === 0) return { photos: all, layouts: byPosition };

  if (photos.some(image => image.mainImage) || !layouts.some(image => image.mainImage)) {
    return { photos, layouts: byPosition };
  }

  const first = photos.reduce((min, image) => (image.position < min.position ? image : min));

  return {
    photos: photos.map(image => (image === first ? { ...image, mainImage: true } : image)),
    layouts: byPosition,
  };
};

/**
 * The yacht the boat page's client components get (gallery, hero, lightbox,
 * share, favourite, inquiry, booking, PDF): its photos only, and the layouts
 * beside it. Without a layout the yacht is returned as it came.
 */
export const withLayoutImagesApart = <Y extends { yachtImages: YachtImage[] }>(
  yacht: Y
): { yacht: Y; layoutImages: YachtImage[] } => {
  const { photos, layouts } = splitLayoutImages(yacht.yachtImages);

  if (layouts.length === 0 || photos === yacht.yachtImages) return { yacht, layoutImages: layouts };

  return { yacht: { ...yacht, yachtImages: photos }, layoutImages: layouts };
};
