import { PriceInfo } from '@/types/price-info.type';

import { Unit, YachtServiceModel } from './yacht-service.model';

export enum Status {
  FREE = 'FREE',
  OPTION = 'OPTION',
  RESERVATION = 'RESERVATION',
  SERVICE = 'SERVICE',
  // Retained as a legacy/fallback bucket. The backend no longer emits
  // UNAVAILABLE for offers (it now ships the honest 4-state FREE | OPTION |
  // RESERVATION | SERVICE), but keeping the member means any stale cached
  // client value still compiles and the gate routes it to "hard-blocked".
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface LocationFromTo {
  id: string;
  name: string;
  countryCode: string;
}

export interface SelectedExtras {
  id: number;
  name: string;
  labelCode: string;
  priceEur: number;
  priceInfo: PriceInfo;
  obligatory: boolean;
  payableInBase: boolean;
  unit: Unit;
  unitPriceEur: number;
  unitPriceInfo: PriceInfo;
  key: string;
  // Refined V1_57 payment classification — used by frontend to split the
  // historical "Paid at marina" header into Advance / Marina / Included
  // buckets. Falls back to legacy payableInBase grouping when null.
  paymentType?: 'INCLUDED' | 'WITH_BOOKING' | 'ADVANCE_TO_OPERATOR' | 'ON_SITE' | null;
}

export interface YachtOfferModel {
  id: number;
  dateFrom: string;
  dateTo: string;
  clientPriceEur: number;
  totalPriceEur: number;
  totalDiscountEur: number | null;
  totalDiscountInfo: PriceInfo;
  clientPriceInfo: PriceInfo;
  totalPriceCalcInfo: PriceInfo;
  clientPricePerDayEur: number;
  clientPricePerDayInfo: PriceInfo;
  numberOfDays?: number | null;
  listPriceEur?: number | null;
  listPriceInfo?: PriceInfo | null;
  status: Status;
  obligatoryExtrasKeys: string[];
  extras: YachtServiceModel[];
  locationFrom: LocationFromTo;
  locationTo: LocationFromTo;
  checkin: string;
  checkout: string;
}

export interface PriceCalcDto {
  offerId: number;
  yachtId: number;
  dateFrom: string;
  dateTo: string;
  clientPricePerDayEur: number;
  clientPricePerDayInfo: PriceInfo;
  numberOfDays: number;
  clientPriceEur: number;
  clientPriceInfo: PriceInfo;
  totalPriceEur: number;
  totalPriceInfo: PriceInfo;
  totalDiscountEur: number;
  totalDiscountInfo: PriceInfo;
  selectedExtrasAtBase: SelectedExtras[];
  selectedExtrasInPrice: SelectedExtras[];
  misalignment: boolean;
  securityDeposit: number;
  insuredSecurityDeposit: number;
  despositCurrency: string;
}
