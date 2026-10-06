import { ElementType } from 'react';

import { Cabin, Draught, Engine, Mainsail, People, SingleBed, Toilet } from '@/components/SvgIcons/BoatFeatures';
import Crew from '@/components/SvgIcons/Crew';
import type { RowKey } from '@/utils/static/yachtCapacity';

/** Spec-grid icon for each capacityRows() row (boat page, my-bookings). */
export const CAPACITY_ROW_ICONS: Record<RowKey, ElementType> = {
  cabins: Cabin,
  crewCabins: Cabin,
  berths: SingleBed,
  heads: Toilet,
  crewHeads: Toilet,
  showers: Toilet,
  crewShowers: Toilet,
  maxPeople: People,
  recommendedPeople: People,
  crew: Crew,
  mainsail: Mainsail,
  headsail: Mainsail,
  engine: Engine,
  draught: Draught,
};

/** The accommodation rows (left column); the rest are the boat's own specs. */
export const ACCOMMODATION_ROW_KEYS: readonly RowKey[] = [
  'cabins',
  'crewCabins',
  'berths',
  'heads',
  'crewHeads',
  'showers',
  'crewShowers',
  'maxPeople',
  'recommendedPeople',
  'crew',
];
