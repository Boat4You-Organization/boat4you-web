import { PriceInfo } from '@/types/price-info.type';

import { Unit, YachtServiceModel } from './yacht-service.model';

export enum Status {
  FREE = 'FREE',
  OPTION = 'OPTION',
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
  status: Status;
  obligatoryExtrasIds: number[];
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
