import { YachtAmenitiesModel } from '@/models/yacht-amenities.model';
import { MainSailType } from '@/models/yacht.model';

export type YachtDescriptionSource = {
  mainSailType: MainSailType;
  amenities?: YachtAmenitiesModel[];
};
