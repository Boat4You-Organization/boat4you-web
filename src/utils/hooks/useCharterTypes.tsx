import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import MultipleCheckbox from '@/components/MultipleCheckbox';
import { CharterTypeModel } from '@/models/catalogue.model';
import { CHARTER_TYPE_LABEL_MAP } from '@/models/yacht.model';

interface UseCharterTypesProps {
  selectedIds: string[];
  onChange: (value: string[]) => void;
  charterTypes: CharterTypeModel[];
}

const useCharterTypes = ({ selectedIds, onChange, charterTypes }: UseCharterTypesProps) => {
  const t = useTranslations();

  const selectedCharterTypes = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const charterType = charterTypes.find(ct => ct === id);

        return charterType ? [id] : [];
      }),
    [selectedIds, charterTypes]
  );

  const renderCharterTypesInput = () => (
    <MultipleCheckbox
      title={t('filters.charterType')}
      options={charterTypes.map(charterType => ({
        id: charterType,
        label: t(CHARTER_TYPE_LABEL_MAP[charterType]),
      }))}
      selectedValues={selectedCharterTypes}
      onSelectionChange={onChange}
    />
  );

  return renderCharterTypesInput;
};

export default useCharterTypes;
