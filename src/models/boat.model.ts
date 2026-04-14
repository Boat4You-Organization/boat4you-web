import { LocationType } from '@/types/location.type';

import { AgencyModel } from './agency.model';
import { BoatFeatureModel } from './boat-feature.model';

export interface Location {
  id: number;
  countryCode: string;
  lat: number;
  lon: number;
}

export interface BoatImage {
  id: number;
  url: string;
  position: number;
  mainImage: boolean;
}

export interface BoatLocation {
  id: number;
  realId: number;
  name: string;
  locationType: LocationType;
  countryCode: string;
}

export interface BoatModel extends BoatFeatureModel {
  id: number;
  name: string;
  model: string;
  clientPriceEur: number;
  totalPriceEur: number;
  clientPriceInfo: number;
  totalPriceCalcInfo: number;
  agency: AgencyModel;
  location: Location;
  yachtImages: BoatImage[];
  sysDescription: string;
  fixedPrice: number;
  locations: BoatLocation[];
}
