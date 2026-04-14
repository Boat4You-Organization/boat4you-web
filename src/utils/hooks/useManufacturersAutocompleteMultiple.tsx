import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import AutocompleteMultiple from '@/components/AutocompleteMultiple';
import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { ManufacturerModel } from '@/models/catalogue.model';

interface UseManufacturerAutocompleteProps {
  selectedIds: number[];
  onChange: (value: SelectOption[]) => void;
  manufacturers: ManufacturerModel[];
}

const useManufacturerAutocompleteMultiple = ({
  selectedIds,
  onChange,
  manufacturers,
}: UseManufacturerAutocompleteProps) => {
  const t = useTranslations('filters');

  const selectedManufacturers = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const manufacturer = manufacturers.find(m => m.id === id);

        return manufacturer ? [{ id: manufacturer.id.toString(), label: manufacturer.name }] : [];
      }),
    [selectedIds, manufacturers]
  );

  const renderManufacturerInput = () => (
    <AutocompleteMultiple
      value={selectedManufacturers}
      options={manufacturers.map(manufacturer => ({
        id: manufacturer.id.toString(),
        label: manufacturer.name,
      }))}
      onChange={onChange}
      label={t('manufacturer')}
      placeholder={t('searchManufacturer')}
    />
  );

  return renderManufacturerInput;
};

export default useManufacturerAutocompleteMultiple;
