import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';

import debounce from 'lodash.debounce';
import { useTranslations } from 'next-intl';

import { getModels } from '@/actions/catalogue.actions';
import AutocompleteMultiple from '@/components/AutocompleteMultiple';
import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { MODELS_PAGE_SIZE } from '@/config/constants.config';
import { BoatModel } from '@/models/catalogue.model';

interface UseModelAutocompleteProps {
  manufacturerIds: number[];
  selectedIds: number[];
  onChange: (value: SelectOption[]) => void;
}

interface ModelsState {
  models: BoatModel[];
  loading: boolean;
  error: string | null;
}

const useModelAutocompleteMultiple = ({ manufacturerIds, selectedIds, onChange }: UseModelAutocompleteProps) => {
  const [stateModels, actionModels] = useActionState(getModels, {
    models: [],
    loading: false,
    error: null,
  } as ModelsState);

  const [searchString, setSearchString] = useState<string>('');
  const t = useTranslations('filters');

  // Depend on the serialized list (string), not the array reference —
  // `manufacturerIds` is `params.mfid` from `useQueryParams`, which can produce
  // a new array reference on every parent render under Next.js 16 + Turbopack.
  // Using the reference would re-fire the server action every render and,
  // via setState, create an infinite POST loop.
  const manufacturerIdsKey = manufacturerIds.join(',');

  useEffect(() => {
    startTransition(() => {
      actionModels({
        manufacturerIds,
        searchString,
        pageable: { page: 0, size: MODELS_PAGE_SIZE },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturerIdsKey, searchString, actionModels]);

  const selectedModels = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const model = stateModels.models.find(m => m.id === id);

        return model ? [{ id: model.id.toString(), label: model.name }] : [];
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds]
  );

  const handleInputChange = (value: string) => {
    setSearchString(value);
  };

  const renderModelInput = () => (
    <AutocompleteMultiple
      value={selectedModels}
      options={stateModels.models.map((model: BoatModel) => ({
        id: model.id.toString(),
        label: model.name,
      }))}
      onChange={onChange}
      onInputChange={debounce(handleInputChange, 300)}
      label={t('model')}
      placeholder={manufacturerIds.length === 0 ? t('selectManufacturerFirst') : t('searchModel')}
      disabled={manufacturerIds.length === 0}
    />
  );

  return renderModelInput;
};

export default useModelAutocompleteMultiple;
