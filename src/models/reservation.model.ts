import { PriceInfo } from '@/types/price-info.type';

import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationStatus,
} from './reservation-status.model';
import { YachtAmenitiesModel } from './yacht-amenities.model';
import { Unit, YachtServiceModel } from './yacht-service.model';
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
  paymentType: string | null;
}

export interface PaymentPhase {
  id: number;
  deadline: string;
  amount: number;
  paidOn: string;
  stripePaymentIntentId: string;
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
  // Pre-discount ("list") price from the external system. Present only when
  // the offer had an ext_base_price strictly higher than the final total, so
  // the card can render a strike-through and a discount badge.
  listPrice?: number | null;
  listPriceInfo?: PriceInfo | null;
  yachtSlug: string;
  cancellationRequestAt: string;
  /** Set by admin when the cancellation request is refused (charter agency
   *  policy doesn't allow it). Booking stays active. Customer's portal shows
   *  a "cancellation not approved" banner with the admin's explanation. */
  cancellationRejectedAt?: string | null;
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
  /** Admin's explanation when the cancellation request was rejected; rendered
   *  alongside `cancellationRejectedAt` on the customer's booking detail. */
  cancellationRejectedReason?: string | null;
  specialRequest?: string;
  // Full yacht-extras catalogue (same source as boat-detail page ExtrasTab) so
  // my-bookings can render obligatory extras + deposit insurance row even when
  // `selectedExtras` is empty (fictitious bookings / partner sync gaps).
  services?: YachtServiceModel[];
  obligatoryExtrasKeys?: string[];
  // Crew list link — partner-supplied (NauSys/MMK at confirmation) or
  // admin-entered manually for fictitious bookings.
  crewListUrl?: string | null;
  // Boat4You Trip PWA hub key — /trip/{token} ("Trip app" button, owner only).
  tripToken?: string | null;
  // Broker-written "Charter update" — negotiated extras arranged with the agency
  // (e.g. "Skipper: 1470 €"). Free text, shown below the Pay-now action; the
  // block hides when null/empty.
  charterUpdate?: string | null;
  // Admin-uploaded documents attached to the booking (PDF/DOC/DOCX). Customer
  // downloads via /secured/reservations/my-reservations/{id}/documents/{docId}.
  documents?: ReservationDocument[];
}

export type ReservationDocumentType = 'BOARDING_PASS' | 'CREW_LIST' | 'CONTRACT' | 'PREFERENCE_LIST' | 'OTHER';

export interface ReservationDocument {
  id: number;
  reservationId: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  uploadedBy: number | null;
  uploadedAt: string;
  /** Drives the human label ("Boarding pass") — OTHER/legacy docs fall back
   *  to the raw filename. */
  documentType?: ReservationDocumentType;
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
