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
export enum MatchKind {
  EXACT = 'EXACT',
  SHIFTED = 'SHIFTED',
  SHORTER = 'SHORTER',
  LONGER = 'LONGER',
}

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

/**
 * Vessel-type form used inside the search-page H1 sentence — slots into
 * "Najam {boatType} u {destination}" (HR), "Location de {boatType} à
 * {destination}" (FR), etc. For locales that don't inflect nouns
 * (EN/FR/IT/ES/PT/NL/DE) the per-locale value mirrors the nominative
 * label. For HR/PL the per-locale value is the genitive form (e.g.
 * HR `catamaranForRental: "katamarana"`) so the sentence reads as
 * proper "rental of catamarans". Renamed from "Genitive" to keep it
 * neutral for non-inflecting locales — they just see a singular noun.
 */
export const VESSEL_TYPE_LABEL_MAP_FOR_RENTAL = {
  [VesselType.CATAMARAN]: 'common.catamaranForRental',
  [VesselType.GULET]: 'common.guletForRental',
  [VesselType.HOUSE_BOAT]: 'common.houseBoatForRental',
  [VesselType.LUXURY_MOTOR_YACHT]: 'common.luxuryMotorYachtForRental',
  [VesselType.MINI_CRUISER]: 'common.miniCruiserForRental',
  [VesselType.MOTORBOAT]: 'common.motorboatForRental',
  [VesselType.MOTOR_YACHT]: 'common.motorYachtForRental',
  [VesselType.MOTORSAILER]: 'common.motorsailerForRental',
  [VesselType.POWER_CATAMARAN]: 'common.powerCatamaranForRental',
  [VesselType.SAILING_YACHT]: 'common.sailingYachtForRental',
  [VesselType.TRIMARAN]: 'common.trimaranForRental',
  [VesselType.RUBBER_BOAT]: 'common.rubberBoatForRental',
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
  /**
   * Free-text "Saloon and Cabins" amenities — admin pastes a multi-line
   * list, AmenitiesTab splits on \n and renders each non-empty entry as
   * a checkmark item. Replaces the predefined Equipment dropdown for
   * custom yachts so owners' one-off specs (bed sizes, named brands…)
   * make it onto the public page verbatim.
   */
  amenitiesText: string | null;
  /** Free-text "Entertainment" toys block, same treatment. */
  toysText: string | null;
  /**
   * Free-text engine descriptor — admin types verbatim ("2x Volvo IPS
   * 1050"). DetailsTab renders this in the Engine row instead of
   * "{enginePower} kW" when present.
   */
  engineText: string | null;
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
   * Start/end of the REAL offer period that matched the user's search. When
   * `matchKind` != EXACT these carry the closest matched window (which may be
   * shifted/shorter/longer than the requested dates), so the card can show a
   * "closest dates: DD.MM - DD.MM" badge. Strings in ISO format (YYYY-MM-DD)
   * from the backend's LocalDate serialization.
   */
  offerDateFrom?: string | null;
  offerDateTo?: string | null;
  /**
   * How the returned offer window relates to the user's requested dates.
   * EXACT   → offer matches the requested period (no badge)
   * SHIFTED → same length, different start (closest-dates badge)
   * SHORTER → shorter than requested
   * LONGER  → longer than requested
   * null when the search had no date filter. Backend's MatchKind enum,
   * serialized by name.
   */
  matchKind?: MatchKind | null;
  /**
   * True for admin-managed (entry_type=2) yachts. Search card swaps the
   * green "Available" badge for a blue "On request" label so users know
   * they need to inquire instead of book directly.
   */
  custom?: boolean;
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
