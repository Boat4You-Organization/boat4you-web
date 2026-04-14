import { CharterType } from './yacht.model';

export enum AmenityCategory {
  SALOON_AND_CABINS = 'SALOON_AND_CABINS',
  NAVIGATION_AND_SAFETY = 'NAVIGATION_AND_SAFETY',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

export const AMENITY_CATEGORIES_LABEL_MAP = {
  [AmenityCategory.SALOON_AND_CABINS]: 'Saloon and Cabins',
  [AmenityCategory.NAVIGATION_AND_SAFETY]: 'Navigation and Safety',
  [AmenityCategory.ENTERTAINMENT]: 'Entertainment',
};

export interface ManufacturerModel {
  id: number;
  name: string;
}

export interface BoatModel {
  id: number;
  name: string;
}

export interface AmenityModel {
  id: number;
  labelCode: string;
  category: AmenityCategory;
  filterOrder: number;
}

export type CharterTypeModel = CharterType;

export type ServiceModel = {
  id: number;
  labelCode: string;
  filterOrder: number;
};

export interface CatalogueData {
  amenities: AmenityModel[];
  charterTypes: CharterTypeModel[];
  manufacturers: ManufacturerModel[];
  services: ServiceModel[];
}

export interface CatalogueFilterPrice {
  amount: number;
  currency: string;
  validAt: string;
  rate: number;
}

export interface CatalogueFilterLength {
  unit: string;
  amount: number | null;
}

export interface CatalogueFilters {
  minPrice: CatalogueFilterPrice;
  maxPrice: CatalogueFilterPrice;
  minCabins: number;
  maxCabins: number;
  minPersons: number;
  maxPersons: number;
  minBerths: number;
  maxBerths: number;
  minLength: CatalogueFilterLength;
  maxLength: CatalogueFilterLength;
  minYear: number;
  maxYear: number;
  minWc: number;
  maxWc: number;
  minEnginePower: number;
  maxEnginePower: number;
}
