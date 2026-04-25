import { ElementType, useState } from 'react';

import { useTranslations } from 'next-intl';

import AutocompleteMultipleChip from '@/components/AutocompleteMultipleChip';
import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import { FormInputProps } from '@/components/Forms/FormInput/FormInput';
import Boat from '@/components/SvgIcons/Boat';
import Catamaran from '@/components/SvgIcons/BoatTypes/Catamaran';
import Gulet from '@/components/SvgIcons/BoatTypes/Gulet';
import LuxuryMotoryacht from '@/components/SvgIcons/BoatTypes/LuxuryMotoryacht';
import LuxurySailingYacht from '@/components/SvgIcons/BoatTypes/LuxurySailingYacht';
import MiniCruiser from '@/components/SvgIcons/BoatTypes/MiniCruiser';
import MotorSailor from '@/components/SvgIcons/BoatTypes/MotorSailor';
import Motorboat from '@/components/SvgIcons/BoatTypes/Motorboat';
import Motoryacht from '@/components/SvgIcons/BoatTypes/Motoryacht';
import { VESSEL_TYPE_LABEL_MAP, VesselType } from '@/models/yacht.model';

export type OptionType = {
  icon: ElementType;
  label: string;
};

interface UseBoatTypeAutocompleteProps {
  isExpanded?: boolean;
  variant?: 'expanded' | 'compact';
}

const useBoatTypeAutocomplete = ({ isExpanded = true, variant = 'expanded' }: UseBoatTypeAutocompleteProps) => {
  const [searchString, setSearchString] = useState<string>('');
  const t = useTranslations();

  const handleInputChange = (value: string) => {
    setSearchString(value);
  };

  // Curated list + display order agreed with product. Trimaran, House boat and
  // Rubber boat are deliberately excluded from the picker (we don't broker those
  // categories). The VesselType enum still carries them so existing yachts with
  // those types keep rendering correctly on the boat detail / cards surfaces.
  const options: AutocompleteOption[] = [
    { id: VesselType.CATAMARAN, icon: <Catamaran />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.CATAMARAN]) },
    {
      id: VesselType.SAILING_YACHT,
      icon: <LuxurySailingYacht />,
      label: t(VESSEL_TYPE_LABEL_MAP[VesselType.SAILING_YACHT]),
    },
    {
      id: VesselType.POWER_CATAMARAN,
      icon: <Catamaran />,
      label: t(VESSEL_TYPE_LABEL_MAP[VesselType.POWER_CATAMARAN]),
    },
    { id: VesselType.GULET, icon: <Gulet />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.GULET]) },
    {
      id: VesselType.LUXURY_MOTOR_YACHT,
      icon: <LuxuryMotoryacht />,
      label: t(VESSEL_TYPE_LABEL_MAP[VesselType.LUXURY_MOTOR_YACHT]),
    },
    { id: VesselType.MINI_CRUISER, icon: <MiniCruiser />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.MINI_CRUISER]) },
    { id: VesselType.MOTORBOAT, icon: <Motorboat />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.MOTORBOAT]) },
    { id: VesselType.MOTOR_YACHT, icon: <Motoryacht />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.MOTOR_YACHT]) },
    { id: VesselType.MOTORSAILER, icon: <MotorSailor />, label: t(VESSEL_TYPE_LABEL_MAP[VesselType.MOTORSAILER]) },
  ];

  const renderLocationInput: FormInputProps['renderInput'] = ({ field }) => (
    <AutocompleteMultipleChip
      value={field.value || []}
      inputValue={searchString}
      options={options.map(option => ({
        id: option.id,
        label: option.label,
        icon: option.icon,
      }))}
      onChange={(newValue: string[]) => {
        field.onChange(newValue);
        setSearchString('');
      }}
      placeholder={
        variant === 'expanded'
          ? [t('home.generalSearchBar.withWhat'), t('home.generalSearchBar.chooseBoat')]
          : t('home.generalSearchBar.selectBoatType')
      }
      icon={Boat}
      valueField="id"
      onInputChange={handleInputChange}
      variant={isExpanded ? 'expanded' : 'compact'}
    />
  );

  return renderLocationInput;
};

export default useBoatTypeAutocomplete;
