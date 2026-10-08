import { useTranslations } from 'next-intl';

import { YachtAmenitiesKey, YachtAmenitiesModel } from '@/models/yacht-amenities.model';

/**
 * An equipment row's label in the page language: the translation of its
 * catalogue code (presentAmenities hands over linked rows only, merged codes
 * already canonical). A code this build has no translation for yet — the
 * backend can add one before the web ships it — shows the partner's name,
 * never next-intl's "yacht.amenitiesList.<code>" fallback.
 */
const useAmenityLabel = (): ((amenity: Pick<YachtAmenitiesModel, 'name' | 'equipment'>) => string) => {
  const amenitiesT = useTranslations('yacht.amenitiesList');

  return amenity => {
    const code = amenity.equipment?.labelCode as YachtAmenitiesKey | undefined;

    return code && amenitiesT.has(code) ? amenitiesT(code) : amenity.name?.trim() || '';
  };
};

export default useAmenityLabel;
