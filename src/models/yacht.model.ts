import { PriceInfo } from '@/types/price-info.type';

import { AgencyModel } from './agency.model';
import { BoatLocation } from './boat.model';
import { ReservationStatus } from './reservation-status.model';
import { YachtAmenitiesModel } from './yacht-amenities.model';
import { MeasurementInfo, YachtFeatureModel } from './yacht-feature.model';
import { YachtOfferModel } from './yacht-offer.model';
import { YachtServiceModel } from './yacht-service.model';

/**
 * Per-offer availability status mirroring backend's OfferStatus enum.
 * Values match the raw ordinals sent by the API. The card groups these
 * into two user-facing badges (Available / Pre-reserved).
 */
export enum OfferStatus {
  UNKNOWN = 'UNKNOWN',
  FREE = 'FREE',
  OPTION = 'OPTION',
  OPTION_WAITING = 'OPTION_WAITING',
  UNAVAILABLE = 'UNAVAILABLE',
  RESERVED = 'RESERVED',
  CANCELLED = 'CANCELLED',
  SERVICE = 'SERVICE',
  OPTION_EXPIRED = 'OPTION_EXPIRED',
  INFO = 'INFO',
}

export enum CharterType {
  BAREBOAT = 'BAREBOAT',
  CRUISE = 'CRUISE',
  CREWED = 'CREWED',
  ALL_INCLUSIVE = 'ALL_INCLUSIVE',
}

export const CHARTER_TYPE_LABEL_MAP = {
  [CharterType.BAREBOAT]: 'common.bareboat',
  [CharterType.CRUISE]: 'common.cruise',
  [CharterType.CREWED]: 'common.crewed',
  [CharterType.ALL_INCLUSIVE]: 'common.allInclusive',
} as const;

export const CHARTER_TYPE_COLOR_MAP = {
  [CharterType.BAREBOAT]: 'info',
  [CharterType.CRUISE]: 'info',
  [CharterType.CREWED]: 'error',
  [CharterType.ALL_INCLUSIVE]: 'success',
} as const;

export const CHARTER_DESCRIPTION_LABEL_MAP = {
  [CharterType.BAREBOAT]: 'common.bareboatDescription',
  [CharterType.CRUISE]: 'common.cruiseDescription',
  [CharterType.CREWED]: 'common.crewedDescription',
  [CharterType.ALL_INCLUSIVE]: 'common.allInclusiveDescription',
} as const;

export const CHARTER_TYPE_ARRAY = [
  { type: CharterType.BAREBOAT },
  { type: CharterType.CREWED },
  { type: CharterType.ALL_INCLUSIVE },
];

export enum VesselType {
  CATAMARAN = 'CATAMARAN',
  GULET = 'GULET',
  HOUSE_BOAT = 'HOUSE_BOAT',
  LUXURY_MOTOR_YACHT = 'LUXURY_MOTOR_YACHT',
  MINI_CRUISER = 'MINI_CRUISER',
  MOTORBOAT = 'MOTORBOAT',
  MOTOR_YACHT = 'MOTOR_YACHT',
  MOTORSAILER = 'MOTORSAILER',
  POWER_CATAMARAN = 'POWER_CATAMARAN',
  SAILING_YACHT = 'SAILING_YACHT',
  TRIMARAN = 'TRIMARAN',
  RUBBER_BOAT = 'RUBBER_BOAT',
}

export const VESSEL_TYPE_LABEL_MAP = {
  [VesselType.CATAMARAN]: 'common.catamaran',
  [VesselType.GULET]: 'common.gulet',
  [VesselType.HOUSE_BOAT]: 'common.houseBoat',
  [VesselType.LUXURY_MOTOR_YACHT]: 'common.luxuryMotorYacht',
  [VesselType.MINI_CRUISER]: 'common.miniCruiser',
  [VesselType.MOTORBOAT]: 'common.motorboat',
  [VesselType.MOTOR_YACHT]: 'common.motorYacht',
  [VesselType.MOTORSAILER]: 'common.motorsailer',
  [VesselType.POWER_CATAMARAN]: 'common.powerCatamaran',
  [VesselType.SAILING_YACHT]: 'common.sailingYacht',
  [VesselType.TRIMARAN]: 'common.trimaran',
  [VesselType.RUBBER_BOAT]: 'common.rubberBoat',
} as const;

export const VESSEL_TYPE_LABEL_MAP_PLURAL = {
  [VesselType.CATAMARAN]: 'common.catamaranPlural',
  [VesselType.GULET]: 'common.guletPlural',
  [VesselType.HOUSE_BOAT]: 'common.houseBoatPlural',
  [VesselType.LUXURY_MOTOR_YACHT]: 'common.luxuryMotorYachtPlural',
  [VesselType.MINI_CRUISER]: 'common.miniCruiserPlural',
  [VesselType.MOTORBOAT]: 'common.motorboatPlural',
  [VesselType.MOTOR_YACHT]: 'common.motorYachtPlural',
  [VesselType.MOTORSAILER]: 'common.motorsailerPlural',
  [VesselType.POWER_CATAMARAN]: 'common.powerCatamaranPlural',
  [VesselType.SAILING_YACHT]: 'common.sailingYachtPlural',
  [VesselType.TRIMARAN]: 'common.trimaranPlural',
  [VesselType.RUBBER_BOAT]: 'common.rubberBoatPlural',
} as const;

export enum MainSailType {
  UNKNOWN = 'UNKNOWN',
  CLASSIC_SAIL = 'CLASSIC_SAIL',
  ROLLING_SAIL = 'ROLLING_SAIL',
}

export const MAIN_SAIL_TYPE_LABEL_MAP = {
  [MainSailType.UNKNOWN]: 'yacht.unknown',
  [MainSailType.CLASSIC_SAIL]: 'yacht.classicMainsail',
  [MainSailType.ROLLING_SAIL]: 'yacht.rollingMainsail',
} as const;

export const MAIN_SAIL_TYPE_ARRAY = Object.values(MainSailType);

export interface YachtFleet {
  vesselType: VesselType;
  yachtCount: number;
}
export interface YachtAvailability {
  from: string;
  to: string;
  status: ReservationStatus;
}

export type Location = {
  name: string;
  countryCode: string;
};

export interface YachtImage {
  id: number;
  url: string;
  position: number;
  mainImage: boolean;
}

export interface YachtCustomDetails {
  lowPrice: number;
  lowPriceInfo: PriceInfo | null;
  priceDescription: string;
  videoUrl: string;
  hasBrochure: boolean;
}

export interface YachtModelShortInfo extends Pick<
  YachtFeatureModel,
  'cabins' | 'buildYear' | 'length' | 'lengthInfo' | 'maxPersons'
> {
  id: number;
  slug: string;
  name: string;
  location: Location;
  charterType: CharterType;
  vesselType: VesselType;
  totalLocations: number;
  isOption: boolean;
  /**
   * Full offer status from backend — exposes all 10 states (FREE, OPTION,
   * RESERVED, CANCELLED, SERVICE, OPTION_EXPIRED, INFO, UNAVAILABLE, etc.)
   * so the card can render an accurate availability badge. Optional because
   * the currently deployed backend only sends `isOption`.
   */
  offerStatus?: OfferStatus | null;
  /** Final per-day price the customer pays, in EUR. */
  clientPriceEur: number;
  clientPriceInfo: PriceInfo;
  /** Original list price (before discount), TOTAL for the booking period.
   *  Optional — backend may not always return it. When present, the card
   *  shows it crossed-out next to the discount badge. */
  listPriceEur?: number | null;
  listPriceInfo?: PriceInfo | null;
  /** Number of charter days (date_to - date_from). Used to compute the
   *  TOTAL displayed price ("Price for X days"). Falls back to 7 if missing. */
  numberOfDays?: number | null;
  modelName: string;
  mainImageId: number;
  agencyName: string;
  /**
   * Top-N equipment label_codes (kebab-case, e.g. "air-conditioning", "dinghy")
   * for this yacht, ordered by Equipment.filterOrder on the backend.
   * Used to render real amenity icons on the card. Optional: legacy deploys
   * don't populate this, in which case the card falls back to a demo pool.
   */
  amenityKeys?: string[] | null;
  /**
   * Start/end of the offer period that matched the user's search (±3 day flex
   * window). When these differ from the user's requested dates the card shows
   * a "Closest day" badge alongside the shifted period. Strings in ISO format
   * (YYYY-MM-DD) from the backend's LocalDate serialization.
   */
  offerDateFrom?: string | null;
  offerDateTo?: string | null;
}

export interface YachtModel
  extends
    Pick<
      YachtModelShortInfo,
      | 'id'
      | 'name'
      | 'location'
      | 'slug'
      | 'buildYear'
      | 'maxPersons'
      | 'cabins'
      | 'length'
      | 'modelName'
      | 'vesselType'
    >,
    YachtFeatureModel {
  wc: number;
  berths: number;
  enginePower: number;
  fuelTank: number;
  waterTank: number;
  beam: number;
  beamInfo: MeasurementInfo;
  lengthInfo: MeasurementInfo;
  mainSailType: MainSailType;
  model: string;
  agency: AgencyModel;
  yachtImages: YachtImage[];
  sysDescription: string | null;
  locations: BoatLocation[];
  custom: boolean;
  amenities: YachtAmenitiesModel[];
  services: YachtServiceModel[];
  offers: YachtOfferModel[];
  manufacturerName: string;
  description: string;
  highlights: string;
  customDetails: YachtCustomDetails;
  securityDeposit: number;
  insuredSecurityDeposit: number;
  depositCurrency: string;
  crewNumber: number;
  defaultCheckin: string;
  defaultCheckout: string;
  charterType: CharterType[];
  inquireOnly: boolean;
}

export interface YachtModelLocalStorage extends Pick<YachtModel, 'id' | 'name' | 'slug' | 'location' | 'model'> {
  mainImageId: number;
}
