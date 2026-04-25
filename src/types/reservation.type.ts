import { LocationFromTo, SelectedExtras } from '@/models/yacht-offer.model';
import { CharterType, VesselType, YachtImage } from '@/models/yacht.model';

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
  /** Pick-up / drop-off times (e.g. "17:00", "09:00") copied from the selected
   *  offer so the booking summary can show them without a backend round-trip. */
  checkin?: string | null;
  checkout?: string | null;
  /** Extra yacht metadata used by the booking hero banner (vessel type chip,
   *  "New yacht" badge based on buildYear, key stats row, image gallery). */
  vesselType?: VesselType | null;
  buildYear?: number | null;
  maxPersons?: number | null;
  berths?: number | null;
  cabins?: number | null;
  yachtImages?: YachtImage[];
  /** Refundable security deposit held at pick-up (paid at marina, returned
   *  on damage-free handover). Always shown under "Paid at marina" in the
   *  booking recap — independent of any partner-sent extras. */
  securityDeposit?: number | null;
};
