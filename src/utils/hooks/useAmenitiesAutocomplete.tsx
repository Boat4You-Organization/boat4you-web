import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import AutocompleteMultiple from '@/components/AutocompleteMultiple';
import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { AmenityModel } from '@/models/catalogue.model';
import { YachtAmenitiesKey } from '@/models/yacht-amenities.model';

interface UseAmenityAutocompleteProps {
  selectedIds: number[];
  onChange: (value: SelectOption[]) => void;
  amenities: AmenityModel[];
}

const useAmenityAutocompleteMultiple = ({ selectedIds, onChange, amenities }: UseAmenityAutocompleteProps) => {
  const t = useTranslations('filters');
  const amenitiesT = useTranslations('yacht.amenitiesList');

  const selectedAmenities = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const amenity = amenities.find(a => a.id === id);

        return amenity
          ? [{ id: amenity.id.toString(), label: amenitiesT(amenity.labelCode as YachtAmenitiesKey) }]
          : [];
      }),
    [selectedIds, amenities, amenitiesT]
  );

  const renderAmenityInput = () => (
    <AutocompleteMultiple
      value={selectedAmenities}
      options={amenities.map(amenity => ({
        id: amenity.id.toString(),
        label: amenitiesT(amenity.labelCode as YachtAmenitiesKey),
      }))}
      onChange={onChange}
      label={t('amenities')}
      placeholder={t('searchAmenities')}
    />
  );

  return renderAmenityInput;
};

export default useAmenityAutocompleteMultiple;
