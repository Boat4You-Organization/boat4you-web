import { LocationType } from '@/types/location.type';

export interface LocationModel {
  id: string;
  realId: number;
  name: string;
  locationType: LocationType;
  countryCode: string | null;
}
export interface CountryCountModel {
  id: string;
  countryCode: string;
  yachtCount: number;
  name: string;
  continent: string;
}
