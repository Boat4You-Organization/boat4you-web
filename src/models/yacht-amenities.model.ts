import { Messages } from 'next-intl';

export enum YachtEquipmentCategoryType {
  SALOON_AND_CABINS = 'SALOON_AND_CABINS',
  NAVIGATION_AND_SAFETY = 'NAVIGATION_AND_SAFETY',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

export const YACHT_EQUIPMENT_CATEGORY_TYPE_LABEL_MAP = {
  [YachtEquipmentCategoryType.SALOON_AND_CABINS]: 'saloonAndCabins',
  [YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY]: 'navigationAndSafety',
  [YachtEquipmentCategoryType.ENTERTAINMENT]: 'entertainment',
} as const;

export const YACHT_EQUIPMENT_CATEGORY_TYPE_ARRAY = [
  { type: YachtEquipmentCategoryType.SALOON_AND_CABINS },
  { type: YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY },
  { type: YachtEquipmentCategoryType.ENTERTAINMENT },
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
  name: string;
  equipment: YachtAmenitiesEquipment;
}
