import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import MultipleCheckbox from '@/components/MultipleCheckbox';
import { MAIN_SAIL_TYPE_ARRAY, MAIN_SAIL_TYPE_LABEL_MAP } from '@/models/yacht.model';

interface UseMainSailTypeProps {
  selectedIds: string[];
  onChange: (value: string[]) => void;
}

const useMainSailType = ({ selectedIds, onChange }: UseMainSailTypeProps) => {
  const t = useTranslations();

  const selectedMainSailTypes = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const mainSailType = MAIN_SAIL_TYPE_ARRAY.find(mst => mst === id);

        return mainSailType ? [id] : [];
      }),
    [selectedIds]
  );

  const renderMainSailTypeInput = () => (
    <MultipleCheckbox
      title={t('yacht.mainSailType')}
      options={MAIN_SAIL_TYPE_ARRAY.map(mainSailType => ({
        id: mainSailType,
        label: t(MAIN_SAIL_TYPE_LABEL_MAP[mainSailType]),
      }))}
      selectedValues={selectedMainSailTypes}
      onSelectionChange={onChange}
    />
  );

  return renderMainSailTypeInput;
};

export default useMainSailType;
