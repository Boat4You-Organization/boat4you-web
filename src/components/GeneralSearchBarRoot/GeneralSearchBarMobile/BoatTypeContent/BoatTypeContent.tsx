import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import FilterableChecklist from '@/components/FilterableChecklist';
import Catamaran from '@/components/SvgIcons/BoatTypes/Catamaran';
import Gulet from '@/components/SvgIcons/BoatTypes/Gulet';
import LuxuryMotoryacht from '@/components/SvgIcons/BoatTypes/LuxuryMotoryacht';
import LuxurySailingYacht from '@/components/SvgIcons/BoatTypes/LuxurySailingYacht';
import MiniCruiser from '@/components/SvgIcons/BoatTypes/MiniCruiser';
import MotorSailor from '@/components/SvgIcons/BoatTypes/MotorSailor';
import Motorboat from '@/components/SvgIcons/BoatTypes/Motorboat';
import Motoryacht from '@/components/SvgIcons/BoatTypes/Motoryacht';
import { SearchBarFormValues } from '@/config/form-models.config';
import { VESSEL_TYPE_LABEL_MAP, VesselType } from '@/models/yacht.model';

interface BoatTypeContentProps {
  maxDisplayedChips?: number;
  onDeleteSingle?: (option: string, index: number) => void;
  // Desktop: fires when a boat type is added so the bar can run the search
  // right away (no separate Search click — last step of the guided flow).
  // Mobile leaves it unset and submits via the "Select yacht" button instead.
  onSelect?: () => void;
}

const BoatTypeContent = ({ maxDisplayedChips, onDeleteSingle, onSelect }: BoatTypeContentProps) => {
  const { watch, setValue } = useFormContext<SearchBarFormValues>();
  const currentBoatTypes = watch('boatTypes') || [];
  const t = useTranslations();

  // Mirror the desktop picker (useBoatTypeAutocomplete.tsx). Trimaran, House
  // boat and Rubber boat are deliberately excluded — we don't broker those.
  // Enum still holds them so existing yachts keep rendering elsewhere.
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

  const handleAddBoatTypes = (option: AutocompleteOption) => {
    const isAlreadySelected = currentBoatTypes.some(boatTypeId => boatTypeId === option.id);
    let updatedBoatTypes;

    if (isAlreadySelected) {
      updatedBoatTypes = currentBoatTypes.filter(boatTypeId => boatTypeId !== option.id);
    } else {
      updatedBoatTypes = [...currentBoatTypes, option.id];
    }

    setValue('boatTypes', updatedBoatTypes);

    // Adding a type is the final step of the desktop guided flow — run the
    // search immediately. Deselecting (toggle off) must NOT search.
    if (!isAlreadySelected) {
      onSelect?.();
    }
  };

  const selectedLabels = currentBoatTypes.map(boatTypeId => {
    const option = options.find(opt => opt.id === boatTypeId);

    return option ? option.label : boatTypeId;
  });

  return (
    <FilterableChecklist
      options={options}
      searchValue=""
      setSearchValue={() => {}}
      handleAdd={handleAddBoatTypes}
      selectedOptions={selectedLabels}
      onDeleteSingle={onDeleteSingle}
      maxDisplayedChips={maxDisplayedChips}
      hideSearch
    />
  );
};

export default BoatTypeContent;
