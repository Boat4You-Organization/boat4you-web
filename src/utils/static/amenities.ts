import { type YachtAmenitiesModel, YachtEquipmentCategoryType } from '@/models/yacht-amenities.model';
import { safePartnerText } from '@/utils/static/partnerText';

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

/** The row's free-text qualifier ("Honda 20hp", "130 L"), or null — partner prose never (partnerText.ts). */
export const amenityComment = (amenity: Pick<YachtAmenitiesModel, 'comment'>): string | null => {
  const comment = typeof amenity.comment === 'string' ? amenity.comment.trim() : '';

  return comment && !EMPTY.test(comment) && !ABSENT.test(comment) ? safePartnerText(comment) : null;
};

/** Whether the partner row means the boat has this equipment. */
export const isAmenityPresent = (amenity: Pick<YachtAmenitiesModel, 'comment' | 'quantity'>): boolean => {
  const comment = typeof amenity.comment === 'string' ? amenity.comment.trim() : '';

  if (ABSENT.test(comment)) return false;

  // An explicit quantity of 0 is "none on board" too.
  return !(amenity.quantity != null && String(amenity.quantity).trim() !== '' && Number(amenity.quantity) === 0);
};

/**
 * Equipment codes merged into one catalogue item (backend V9_75, 8.10.2026):
 * the old code → the surviving one. The old code stays resolvable — an ISR page
 * or a cached search row may still carry it — and reads as the surviving code
 * everywhere: boat page, card, PDF, filter. Its category is the surviving one's
 * (bow-thruster-deck was DECK, bow-thruster is NAVIGATION).
 */
const MERGED_EQUIPMENT: Readonly<Record<string, { labelCode: string; category: YachtEquipmentCategoryType }>> = {
  'bow-thruster-deck': { labelCode: 'bow-thruster', category: YachtEquipmentCategoryType.NAVIGATION },
  refrigerator: { labelCode: 'fridge', category: YachtEquipmentCategoryType.GALLEY },
  'sundeck-cushions': { labelCode: 'sun-pads', category: YachtEquipmentCategoryType.COMFORT },
};

/** The surviving catalogue code for an equipment label code (itself unless merged). */
export const canonicalEquipmentCode = (labelCode: string): string =>
  MERGED_EQUIPMENT[labelCode]?.labelCode ?? labelCode;

/**
 * The equipment the boat has, each with a display-safe comment. Only rows
 * linked to our catalogue are public (Mario 8.10.2026): a partner item the sync
 * could not link stays in the database and the admin, never on a public page —
 * no partner free text, no catch-all "Deck" bucket. Merged codes read as the
 * surviving code, and a code is listed once (the backend's public list is
 * distinct per equipment too).
 */
export const presentAmenities = <T extends YachtAmenitiesModel>(amenities: T[] | null | undefined): T[] => {
  const seen = new Set<string>();

  return (amenities ?? []).flatMap(amenity => {
    const { equipment } = amenity;

    if (!equipment?.labelCode || !isAmenityPresent(amenity)) return [];

    const merged = MERGED_EQUIPMENT[equipment.labelCode];
    const labelCode = merged?.labelCode ?? equipment.labelCode;

    if (seen.has(labelCode)) return [];

    seen.add(labelCode);

    return [{ ...amenity, equipment: { ...equipment, ...merged }, comment: amenityComment(amenity) }];
  });
};

/** The boat's equipment labels in one language (`labels` = that locale's yacht.amenitiesList) — the PDF. */
export const presentAmenityLabels = (
  amenities: YachtAmenitiesModel[] | null | undefined,
  labels: Readonly<Record<string, string>>
): string[] =>
  presentAmenities(amenities)
    .map(amenity => labels[amenity.equipment!.labelCode] ?? amenity.name?.trim() ?? '')
    .filter(Boolean);
