import { LocationFromTo, SelectedExtras } from '@/models/yacht-offer.model';
import { CharterType, YachtImage } from '@/models/yacht.model';

import { PriceInfo } from './price-info.type';

export type ReservationData = {
  name: string;
  agencyName: string;
  locationFrom: LocationFromTo;
  mainImage: YachtImage;
  model: string;
  dateFrom: string;
  dateTo: string;
  extras: string[];
  pricePerDayEur: number;
  pricePerDayInfo: PriceInfo | null;
  numberOfDays: number;
  totalPriceEur: number;
  totalPriceInfo: PriceInfo | null;
  offerId: number;
  yachtId: number;
  selectedExtrasInPrice: SelectedExtras[];
  selectedExtrasAtBase: SelectedExtras[];
  charterType: CharterType[];
  savedAt: string;
};
