import { useTranslations } from 'next-intl';

import { YachtEquipmentCategoryType } from '@/models/yacht-amenities.model';
import { MAIN_SAIL_TYPE_LABEL_MAP, MainSailType } from '@/models/yacht.model';
import { YachtDescriptionSource } from '@/types/yacht-description.type';

const formatEquipmentByCategory = (
  yacht: YachtDescriptionSource,
  category: YachtEquipmentCategoryType,
  amenitiesT: (key: string) => string
): string =>
  yacht.amenities
    ?.filter(amenity => amenity.equipment?.category === category)
    ?.map(amenity => amenitiesT(amenity.equipment.labelCode).toLowerCase())
    ?.filter(item => item && item.trim() !== '')
    ?.sort((a, b) => a.localeCompare(b))
    ?.join(', ') || '';

export const useBoatEquipmentDescription = (): ((yacht: YachtDescriptionSource) => string) => {
  const t = useTranslations();
  const amenitiesT = useTranslations('yacht.amenitiesList');

  const generateStructuredEquipmentDescription = (yacht: YachtDescriptionSource): string => {
    const sentences: string[] = [];

    if (yacht.mainSailType !== MainSailType.UNKNOWN) {
      const sailTypeKey = MAIN_SAIL_TYPE_LABEL_MAP[yacht.mainSailType];

      if (sailTypeKey) {
        const sailType = t(sailTypeKey);

        if (sailType && sailType !== sailTypeKey) {
          sentences.push(`${t('yacht.boatEquipmentFeatures')} ${sailType.toLowerCase()}`);
        }
      }
    }

    const navigationEquipment = formatEquipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.NAVIGATION_AND_SAFETY,
      amenitiesT as (key: string) => string
    );

    if (navigationEquipment) {
      if (sentences.length > 0) {
        sentences[sentences.length - 1] += ` ${t('yacht.includes')} ${navigationEquipment}`;
      } else {
        sentences.push(navigationEquipment);
      }
    }

    const saloonEquipment = formatEquipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.ENTERTAINMENT,
      amenitiesT as (key: string) => string
    );

    if (saloonEquipment) {
      sentences.push(`${t('yacht.itAlsoBoasts')} ${saloonEquipment}`);
    }

    const entertainmentEquipment = formatEquipmentByCategory(
      yacht,
      YachtEquipmentCategoryType.SALOON_AND_CABINS,
      amenitiesT as (key: string) => string
    );

    if (entertainmentEquipment) {
      sentences.push(`${t('yacht.fullyEquippedInclude')} ${entertainmentEquipment}`);
    }

    return sentences.join('. ') + (sentences.length > 0 ? '.' : '');
  };

  return generateStructuredEquipmentDescription;
};
