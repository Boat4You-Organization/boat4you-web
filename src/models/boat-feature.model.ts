import { ElementType } from 'react';

import { MainSailType } from '@/types/main-sail.type';

export interface BoatFeatureModel {
  buildYear: number;
  maxPersons: number;
  cabins: number;
  wc: number;
  berths: number;
  enginePower: number;
  fuelTank: number;
  waterTank: number;
  mainSailType: MainSailType;
  length: number;
  beam: number;
}

export type BoatFeatureKey = keyof BoatFeatureModel;

export interface BoatFeatureDescriptor {
  key: BoatFeatureKey;
  label?: string;
  icon: ElementType;
}
