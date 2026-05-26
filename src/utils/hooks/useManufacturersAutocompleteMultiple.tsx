import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import AutocompleteMultiple from '@/components/AutocompleteMultiple';
import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { ManufacturerModel } from '@/models/catalogue.model';

interface UseManufacturerAutocompleteProps {
  selectedIds: number[];
  onChange: (value: SelectOption[]) => void;
  manufacturers: ManufacturerModel[];
  /** Optional set of manufacturer IDs that have ≥ 1 yacht in the current
   *  filter context. When provided, manufacturers absent from this set
   *  render disabled (greyed out) in the dropdown. */
  enabledIds?: Set<number>;
}

const useManufacturerAutocompleteMultiple = ({
  selectedIds,
  onChange,
  manufacturers,
  enabledIds,
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
      getOptionDisabled={enabledIds ? opt => !enabledIds.has(Number(opt.id)) : undefined}
    />
  );

  return renderManufacturerInput;
};

export default useManufacturerAutocompleteMultiple;
