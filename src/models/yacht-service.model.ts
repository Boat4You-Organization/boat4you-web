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
} as const;

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
}
