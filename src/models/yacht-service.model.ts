import { Messages } from 'next-intl';

import { PriceInfo } from '@/types/price-info.type';

export type YachtServiceExtrasKey = keyof Messages['yacht']['servicesList'];

export interface YachtServiceExtras {
  id: number;
  labelCode: string;
  filterOrder: number;
}

export enum Unit {
  UNKNOWN = 'UNKNOWN',
  AMOUNT = 'AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
  PER_WEEK = 'PER_WEEK',
  PER_WEEK_PERSON = 'PER_WEEK_PERSON',
  PER_BOOKING = 'PER_BOOKING',
  PER_BOOKING_PERSON = 'PER_BOOKING_PERSON',
  PER_NIGHT = 'PER_NIGHT',
  PER_NIGHT_PERSON = 'PER_NIGHT_PERSON',
  PER_BOAT = 'PER_BOAT',
  PER_HOUR = 'PER_HOUR',
  PER_PIECE = 'PER_PIECE',
  PER_LITRE = 'PER_LITRE',
  PER_MEAL = 'PER_MEAL',
  PER_NM = 'PER_NM',
  PER_PACK = 'PER_PACK',
  PER_PET = 'PER_PET',
  PER_SET = 'PER_SET',
  PER_BED = 'PER_BED',
  PER_TANK = 'PER_TANK',
  PER_TON = 'PER_TON',
  PER_TRIP = 'PER_TRIP',
  PER_GB = 'PER_GB',
  PER_BOTTLE = 'PER_BOTTLE',
  PER_CABIN = 'PER_CABIN',
  PER_LICENCE = 'PER_LICENCE',
}

export const UNIT_LABEL_MAP = {
  [Unit.UNKNOWN]: 'extrasUnits.unknown',
  [Unit.AMOUNT]: 'extrasUnits.amount',
  [Unit.PERCENTAGE]: 'extrasUnits.percentage',
  [Unit.PER_WEEK]: 'extrasUnits.perWeek',
  [Unit.PER_WEEK_PERSON]: 'extrasUnits.perWeekPerson',
  [Unit.PER_BOOKING]: 'extrasUnits.perBooking',
  [Unit.PER_BOOKING_PERSON]: 'extrasUnits.perBookingPerson',
  [Unit.PER_NIGHT]: 'extrasUnits.perNight',
  [Unit.PER_NIGHT_PERSON]: 'extrasUnits.perNightPerson',
  [Unit.PER_BOAT]: 'extrasUnits.perBoat',
  [Unit.PER_HOUR]: 'extrasUnits.perHour',
  [Unit.PER_PIECE]: 'extrasUnits.perPiece',
  [Unit.PER_LITRE]: 'extrasUnits.perLitre',
  [Unit.PER_MEAL]: 'extrasUnits.perMeal',
  [Unit.PER_NM]: 'extrasUnits.perNm',
  [Unit.PER_PACK]: 'extrasUnits.perPack',
  [Unit.PER_PET]: 'extrasUnits.perPet',
  [Unit.PER_SET]: 'extrasUnits.perSet',
  [Unit.PER_BED]: 'extrasUnits.perBed',
  [Unit.PER_TANK]: 'extrasUnits.perTank',
  [Unit.PER_TON]: 'extrasUnits.perTon',
  [Unit.PER_TRIP]: 'extrasUnits.perTrip',
  [Unit.PER_GB]: 'extrasUnits.perGb',
  [Unit.PER_BOTTLE]: 'extrasUnits.perBottle',
  [Unit.PER_CABIN]: 'extrasUnits.perCabin',
  [Unit.PER_LICENCE]: 'extrasUnits.perLicence',
} as const;

export enum ExtraPaymentType {
  INCLUDED = 'INCLUDED',
  WITH_BOOKING = 'WITH_BOOKING',
  ADVANCE_TO_OPERATOR = 'ADVANCE_TO_OPERATOR',
  ON_SITE = 'ON_SITE',
}

export interface YachtServiceModel {
  id: number;
  name: string;
  payableInBase: boolean;
  obligatory: boolean;
  priceEur: number;
  priceInfo: PriceInfo;
  unit: Unit;
  extras: YachtServiceExtras;
  key: string;
  isStartingPrice: boolean;
  // Free-form partner description shown as small print under the name.
  // Null/absent when partner sent none or the row predates V1_52 sync.
  description?: string | null;
  // Refined payment classification (V1_57). Frontend groups extras into
  // four buckets instead of the historical single "Paid at marina"
  // header (which mis-labelled APA / Skipper / Hostess / equipment as
  // marina-paid). Falls back to ON_SITE display if absent (matches
  // legacy behavior for un-backfilled rows).
  paymentType?: ExtraPaymentType | null;
}
