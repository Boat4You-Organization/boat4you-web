import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import MultipleCheckbox from '@/components/MultipleCheckbox';
import { ServiceModel } from '@/models/catalogue.model';
import { YachtServiceExtrasKey } from '@/models/yacht-service.model';

interface UseServicesProps {
  selectedIds: number[];
  onChange: (value: SelectOption[]) => void;
  services: ServiceModel[];
}

const useServices = ({ selectedIds, onChange, services }: UseServicesProps) => {
  const t = useTranslations('filters');
  const servicesT = useTranslations('yacht.servicesList');

  const selectedServices = useMemo(
    () =>
      selectedIds.flatMap(id => {
        const service = services.find(s => s.id === id);

        return service
          ? [{ id: service.id.toString(), label: servicesT(service.labelCode as YachtServiceExtrasKey) }]
          : [];
      }),
    [selectedIds, services, servicesT]
  );

  const renderServicesInput = () => (
    <MultipleCheckbox
      title={t('services')}
      options={services.map(service => ({
        id: service.id.toString(),
        label: servicesT(service.labelCode as YachtServiceExtrasKey),
      }))}
      selectedValues={selectedServices.map(service => service.id)}
      onSelectionChange={selectedServiceIds => {
        const selectedOptions = selectedServiceIds.map(id => {
          const service = services.find(s => s.id.toString() === id);

          return {
            id,
            label: service ? servicesT(service.labelCode as YachtServiceExtrasKey) : id,
          };
        });

        onChange(selectedOptions);
      }}
    />
  );

  return renderServicesInput;
};

export default useServices;
