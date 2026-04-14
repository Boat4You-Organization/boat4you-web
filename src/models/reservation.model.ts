import { PriceInfo } from '@/types/price-info.type';

import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationStatus,
} from './reservation-status.model';
import { YachtAmenitiesModel } from './yacht-amenities.model';
import { Unit } from './yacht-service.model';
import { MainSailType, YachtImage } from './yacht.model';

export { RESERVATION_STATUS_COLOR_MAP, RESERVATION_STATUS_LABEL_MAP, ReservationStatus };

export enum PaymentStatus {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
}

export interface SelectedExtra {
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

export interface PaymentPhase {
  id: number;
  deadline: string;
  amount: number;
  paidOn: string;
  stripePaymentIntentId: string;
  vivaTransactionId: string;
}

export interface ReservationShortInfo {
  reservationId: number;
  reservationNumber: string;
  status: ReservationStatus;
  createdAt: string;
  yachtId: number;
  yachtName: string;
  modelName: string;
  yachtImage: number;
  dateFrom: string;
  dateTo: string;
  checkin: string;
  checkout: string;
  locationFrom: string;
  locationFromCountryCode: string;
  locationTo: string;
  locationToCountryCode: string;
  totalPrice: number;
  totalPriceInfo: PriceInfo;
  yachtSlug: string;
  cancellationRequestAt: string;
  agencyEmail: string;
  agencyPhone: string;
}

export interface DimensionInfo {
  unit: string;
  amount: number;
}

export interface ReservationDetails extends ReservationShortInfo {
  paymentPhases: PaymentPhase[];
  selectedExtras: SelectedExtra[];
  yachtImages: YachtImage[];
  description: string;
  highlights: string;
  maxPersons: number;
  cabins: number;
  wc: number;
  berths: number;
  enginePower: number;
  fuelTank: number;
  waterTank: number;
  beam: number;
  mainSailType: MainSailType;
  length: number;
  yachtMainImage: number;
  securityDeposit: number;
  insuredSecurityDeposit: number;
  depositCurrency: string;
  clientPriceEur: number;
  clientPriceInfo: PriceInfo;
  clientPricePerDayEur: number;
  clientPricePerDayInfo: PriceInfo;
  numberOfDays: number;
  manufacturerName: string;
  buildYear: number;
  beamInfo: DimensionInfo;
  lengthInfo: DimensionInfo;
  crewNumber: number;
  vesselType: string;
  charterType: string;
  amenities?: YachtAmenitiesModel[];
  cancellationRequest?: string;
  specialRequest?: string;
}

export interface CreateReservationResponse {
  id: number;
  reservationFlowId: number;
  yachtId: number;
  dateFrom: string;
  dateTo: string;
  totalPrice: number;
  paymentPhases: PaymentPhase[];
  currency: string;
  status: string;
  expiresAt: string;
  reservationNumber: string;
}
