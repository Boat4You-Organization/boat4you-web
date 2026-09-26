import { YachtAmenitiesModel } from '@/models/yacht-amenities.model';

/**
 * Partner equipment rows carry their value in `comment`, and the sync
 * stores booleans and nulls as text: "true" (present), "false" (absent),
 * "null" / "undefined" (no value). Rendered as-is, a boat page listed
 * "Air conditioning true", "Chart plotter null" and — worse — a Cervetti 44
 * with eight "… false" rows showed radar, generator and dishwasher it does
 * not have (audit B25, 208 of 1,798 boat pages).
 *
 * One place for every consumer (amenities tab, reservation tab, the
 * generated description, the PDF): a row whose value says "absent" is
 * dropped, and a comment that is only a boolean / null literal is cleared.
 */
const ABSENT = /^(false|no|0|none|n\/a)$/i;
const EMPTY = /^(true|yes|null|undefined|nan|-|—)?$/i;

/** The row's free-text qualifier ("Honda 20hp", "130 L"), or null. */
export const amenityComment = (amenity: Pick<YachtAmenitiesModel, 'comment'>): string | null => {
  const comment = typeof amenity.comment === 'string' ? amenity.comment.trim() : '';

  return comment && !EMPTY.test(comment) && !ABSENT.test(comment) ? comment : null;
};

/** Whether the partner row means the boat has this equipment. */
export const isAmenityPresent = (amenity: Pick<YachtAmenitiesModel, 'comment' | 'quantity'>): boolean => {
  const comment = typeof amenity.comment === 'string' ? amenity.comment.trim() : '';

  if (ABSENT.test(comment)) return false;

  // An explicit quantity of 0 is "none on board" too.
  return !(amenity.quantity != null && String(amenity.quantity).trim() !== '' && Number(amenity.quantity) === 0);
};

/** The equipment the boat has, each with a display-safe comment. */
export const presentAmenities = <T extends YachtAmenitiesModel>(amenities: T[] | null | undefined): T[] =>
  (amenities ?? []).filter(isAmenityPresent).map(amenity => ({ ...amenity, comment: amenityComment(amenity) }));
