import { Messages } from 'next-intl';

// Mirrors backend CategoryEnum (hr.workspace.boat4you.domains.catalouge.enums.CategoryEnum).
// Legacy 3-bucket entries (SALOON_AND_CABINS, NAVIGATION_AND_SAFETY) stay
// declared so older yacht_equipment rows that pre-date the V1_73 migration
// still resolve, but the AmenitiesTab renders only the 9 modern categories
// below. JSON over the wire is the enum NAME (e.g. "DECK"), driven by JPA's
// default @Enumerated string serialisation through Jackson.
export enum YachtEquipmentCategoryType {
  SALOON_AND_CABINS = 'SALOON_AND_CABINS',
  NAVIGATION_AND_SAFETY = 'NAVIGATION_AND_SAFETY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  COMFORT = 'COMFORT',
  DECK = 'DECK',
  GALLEY = 'GALLEY',
  INTERIOR = 'INTERIOR',
  NAVIGATION = 'NAVIGATION',
  SAFETY = 'SAFETY',
  SAILS = 'SAILS',
  YACHT_ELECTRICS = 'YACHT_ELECTRICS',
}

export const YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP = {
  [YachtEquipmentCategoryType.SALOON_AND_CABINS]: 'saloonAndCabins',
  [YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY]: 'navigationAndSafety',
  [YachtEquipmentCategoryType.ENTERTAINMENT]: 'entertainment',
  [YachtEquipmentCategoryType.COMFORT]: 'comfort',
  [YachtEquipmentCategoryType.DECK]: 'deck',
  [YachtEquipmentCategoryType.GALLEY]: 'galley',
  [YachtEquipmentCategoryType.INTERIOR]: 'interior',
  [YachtEquipmentCategoryType.NAVIGATION]: 'navigation',
  [YachtEquipmentCategoryType.SAFETY]: 'safety',
  [YachtEquipmentCategoryType.SAILS]: 'sails',
  [YachtEquipmentCategoryType.YACHT_ELECTRICS]: 'yachtElectrics',
} as const;

// Render order on the yacht detail page. Matches the visual hierarchy of
// the reference design: Comfort → Deck → Entertainment → Galley → Interior
// → Navigation → Safety → Sails → Yacht electrics.
export const YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY = [
  { type: YachtEquipmentCategoryType.COMFORT },
  { type: YachtEquipmentCategoryType.DECK },
  { type: YachtEquipmentCategoryType.ENTERTAINMENT },
  { type: YachtEquipmentCategoryType.GALLEY },
  { type: YachtEquipmentCategoryType.INTERIOR },
  { type: YachtEquipmentCategoryType.NAVIGATION },
  { type: YachtEquipmentCategoryType.SAFETY },
  { type: YachtEquipmentCategoryType.SAILS },
  { type: YachtEquipmentCategoryType.YACHT_ELECTRICS },
];

type YachtEquipmentCategoryKey = keyof typeof YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP;

export type YachtAmenitiesKey = keyof Messages['yacht']['amenitiesList'];

export interface YachtAmenitiesEquipment {
  id: number;
  labelCode: string;
  category: YachtEquipmentCategoryKey;
  filterOrder: number;
}

export interface YachtAmenitiesModel {
  id: number;
  /**
   * Partner-emitted equipment name ("Coffee machine", "Towels", …) — set
   * even when no Equipment record matches. Used as the visible label
   * fallback for unmatched rows.
   */
  name: string | null;
  /** Null when the partner sync couldn't match this row to a predefined
   *  Equipment catalog entry. AmenitiesTab uses `name` + a DECK default
   *  category in that case (Deck is the broadest catch-all on partner data). */
  equipment: YachtAmenitiesEquipment | null;
  /** Partner-flagged premium item (NauSys-only). Renders with a yellow row
   *  background, mirroring the partner UI treatment. */
  highlight?: boolean;
  /** Per-item count when partner ships > 1 (e.g. 4 for "4 x Electric toilet").
   *  Backend returns BigDecimal serialised as string/number; cast as needed. */
  quantity?: number | string | null;
  /** Free-text qualifier — "Honda 20hp", "130 L", "at the flybridge". */
  comment?: string | null;
}
