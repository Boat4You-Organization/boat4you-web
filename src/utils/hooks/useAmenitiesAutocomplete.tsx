import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import AutocompleteMultiple from '@/components/AutocompleteMultiple';
import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { AmenityModel } from '@/models/catalogue.model';
import { YachtAmenitiesKey } from '@/models/yacht-amenities.model';
import { canonicalEquipmentCode } from '@/utils/static/amenities';

interface UseAmenityAutocompleteProps {
  selectedIds: number[];
  /** The URL's `amenityLabels`, index-aligned with `selectedIds`. */
  selectedLabels?: string[];
  onChange: (value: SelectOption[]) => void;
  amenities: AmenityModel[];
  /** Amenity IDs that have ≥1 yacht in the current filter context. */
  enabledIds?: Set<number>;
}

const useAmenityAutocompleteMultiple = ({
  selectedIds,
  selectedLabels,
  onChange,
  amenities,
  enabledIds,
}: UseAmenityAutocompleteProps) => {
  const t = useTranslations('filters');
  const amenitiesT = useTranslations('yacht.amenitiesList');

  // A merged code's id is no option (an old URL): it selects the surviving
  // item, found by code, and the next change writes that item's id instead.
  const selectedAmenities = useMemo(
    () =>
      Array.from(
        new Set(
          selectedIds.flatMap((id, i) => {
            const code = selectedLabels?.[i];
            const amenity =
              amenities.find(a => a.id === id) ??
              (code ? amenities.find(a => a.labelCode === canonicalEquipmentCode(code)) : undefined);

            return amenity ? [amenity] : [];
          })
        )
      ).map(amenity => ({ id: amenity.id.toString(), label: amenitiesT(amenity.labelCode as YachtAmenitiesKey) })),
    [selectedIds, selectedLabels, amenities, amenitiesT]
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
      getOptionDisabled={enabledIds ? opt => !enabledIds.has(Number(opt.id)) : undefined}
    />
  );

  return renderAmenityInput;
};

export default useAmenityAutocompleteMultiple;
