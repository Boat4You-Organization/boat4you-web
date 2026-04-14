import {
  Beam,
  Cabin,
  Dimensions,
  Engine,
  Fuel,
  Mainsail,
  People,
  SingleBed,
  Toilet,
  WaterTank,
} from '@/components/SvgIcons/BoatFeatures';
import Calendar from '@/components/SvgIcons/Calendar';
import Crew from '@/components/SvgIcons/Crew';
import { YachtFeatureDescriptor } from '@/models/yacht-feature.model';

export const yachtFeatureDescriptors: YachtFeatureDescriptor[] = [
  { key: 'buildYear', icon: Calendar },
  { key: 'cabins', label: 'features.cabins', icon: Cabin },
  { key: 'berths', label: 'features.berths', icon: SingleBed },
  { key: 'wc', label: 'features.wc', icon: Toilet },
  { key: 'maxPersons', label: 'features.maxPersons', icon: People },
  { key: 'length', label: 'features.length', icon: Dimensions },
  { key: 'fuelTank', label: 'features.fuelTank', icon: Fuel },
  { key: 'waterTank', label: 'features.waterTank', icon: WaterTank },
  { key: 'enginePower', label: 'features.enginePower', icon: Engine },
  { key: 'mainSailType', icon: Mainsail },
  { key: 'beam', label: 'features.beam', icon: Beam },
  { key: 'crewNumber', label: 'features.crewNumber', icon: Crew },
];

export const cabinFeaturesDescriptors: YachtFeatureDescriptor[] = yachtFeatureDescriptors.filter(
  ({ key }) => key === 'berths' || key === 'wc' || key === 'crewNumber'
);
