import { type YachtAmenitiesModel, YachtEquipmentCategoryType } from '@/models/yacht-amenities.model';

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

/**
 * Partner rows the sync could not match to a catalogue Equipment reach the
 * page with only their English partner name ("Wi-Fi & Internet", "Stove"),
 * so every locale showed them in English (audit B29). The frequent ones that
 * mean exactly a catalogue item are mapped to its label code — translated
 * and filed under the right category like a matched row. Anything not listed
 * keeps its partner name. Keys: lower case, single spaces.
 */
const PARTNER_NAME_ALIASES: Record<string, { labelCode: string; category: YachtEquipmentCategoryType }> = {
  'wi-fi & internet': { labelCode: 'wifi', category: YachtEquipmentCategoryType.COMFORT },
  'wi-fi': { labelCode: 'wifi', category: YachtEquipmentCategoryType.COMFORT },
  wifi: { labelCode: 'wifi', category: YachtEquipmentCategoryType.COMFORT },
  'cockpit cushions': { labelCode: 'cockpit-cushions', category: YachtEquipmentCategoryType.DECK },
  'radio-cd player': { labelCode: 'audio-system', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'radio cd player': { labelCode: 'audio-system', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'fusion radio': { labelCode: 'audio-system', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'cockpit speakers': { labelCode: 'outside-speakers', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'outdoor speakers': { labelCode: 'outside-speakers', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'wind instrument/anemometer': { labelCode: 'logge-speed-wind', category: YachtEquipmentCategoryType.NAVIGATION },
  'speedometer (speed log)': { labelCode: 'logge-speed-wind', category: YachtEquipmentCategoryType.NAVIGATION },
  stove: { labelCode: 'cooker', category: YachtEquipmentCategoryType.GALLEY },
  'distress flare box': { labelCode: 'distress-signals', category: YachtEquipmentCategoryType.SAFETY },
  'swimming platform': { labelCode: 'bathing-platform', category: YachtEquipmentCategoryType.DECK },
  'snorkeling equipment': { labelCode: 'snorkel-sets', category: YachtEquipmentCategoryType.ENTERTAINMENT },
  'black water tank': { labelCode: 'waste-tank', category: YachtEquipmentCategoryType.INTERIOR },
  'anchor with chain': { labelCode: 'main-anchor', category: YachtEquipmentCategoryType.DECK },
  'chart plotter in cockpit': { labelCode: 'outside-GPS-plotter', category: YachtEquipmentCategoryType.NAVIGATION },
  'gps chart plotter - cockpit': { labelCode: 'outside-GPS-plotter', category: YachtEquipmentCategoryType.NAVIGATION },
};

/** Marks an equipment record synthesised from PARTNER_NAME_ALIASES. */
const ALIAS_EQUIPMENT_ID = -1;

const withCatalogueMatch = <T extends YachtAmenitiesModel>(amenity: T): T => {
  if (amenity.equipment || !amenity.name) return amenity;

  const alias = PARTNER_NAME_ALIASES[amenity.name.trim().toLowerCase().replace(/\s+/g, ' ')];

  return alias ? { ...amenity, equipment: { id: ALIAS_EQUIPMENT_ID, filterOrder: 0, ...alias } } : amenity;
};

/**
 * The equipment the boat has, each with a display-safe comment. A partner
 * row mapped through the aliases is dropped when the boat already lists that
 * catalogue item (no "WiFi" twice).
 */
export const presentAmenities = <T extends YachtAmenitiesModel>(amenities: T[] | null | undefined): T[] => {
  const rows = (amenities ?? [])
    .filter(isAmenityPresent)
    .map(amenity => withCatalogueMatch({ ...amenity, comment: amenityComment(amenity) }));
  const matched = new Set(
    rows.filter(r => r.equipment && r.equipment.id !== ALIAS_EQUIPMENT_ID).map(r => r.equipment!.labelCode)
  );
  const aliased = new Set<string>();

  return rows.filter(row => {
    if (row.equipment?.id !== ALIAS_EQUIPMENT_ID) return true;

    const code = row.equipment.labelCode;

    if (matched.has(code) || aliased.has(code)) return false;

    aliased.add(code);

    return true;
  });
};
