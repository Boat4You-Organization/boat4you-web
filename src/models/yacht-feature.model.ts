import { ElementType } from 'react';

import { Messages } from 'next-intl';

import { MainSailType } from '@/types/main-sail.type';

export enum MeasurementUnit {
  METRE = 'METRE',
  FEET = 'FEET',
}

export interface MeasurementInfo {
  unit: MeasurementUnit;
  amount: number;
}

export interface YachtFeatureModel {
  buildYear: number | null;
  maxPersons: number | null;
  cabins: number | null;
  wc: number | null;
  berths: number | null;
  enginePower: number | null;
  fuelTank: number | null;
  waterTank: number | null;
  mainSailType: MainSailType;
  length: number | null;
  lengthInfo: MeasurementInfo;
  beam: number | null;
  beamInfo: MeasurementInfo;
  crewNumber: number | null;
}

export type YachtFeatureKey = keyof YachtFeatureModel;

type YachtFeatureDescriptorKey = keyof Messages['yacht']['features'];

export interface YachtFeatureDescriptor {
  key: YachtFeatureKey;
  label?: `features.${YachtFeatureDescriptorKey}`;
  icon: ElementType;
}
