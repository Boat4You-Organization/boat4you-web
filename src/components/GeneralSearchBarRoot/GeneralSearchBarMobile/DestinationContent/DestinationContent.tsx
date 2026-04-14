'use client';

import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getLocations } from '@/actions/locations.actions';
import { AutocompleteOption } from '@/components/AutocompleteMultipleChip/AutocompleteMultipleChip';
import FilterableChecklist from '@/components/FilterableChecklist';
import FlagIcon from '@/components/FlagIcon';
import Marina from '@/components/SvgIcons/Marina';
import { SearchBarFormValues } from '@/config/form-models.config';
import { LocationModel } from '@/models/locations.model';
import colors from '@/styles/themes/colors';
import { LOCATION_TYPE_LABEL_MAP } from '@/types/location.type';

interface DestinationContentProps {
  maxDisplayedChips?: number;
  onDeleteSingle?: (option: string, index: number) => void;
}

const transformLocationToOption = (location: LocationModel, isSelected: boolean): AutocompleteOption => {
  const baseGroup = LOCATION_TYPE_LABEL_MAP[location.locationType];

  return {
    id: location.id,
    label: location.name,
    icon:
      baseGroup === 'Marina' ? (
        <Marina fill={colors.blue300} size={24} />
      ) : (
        <FlagIcon countryCode={location.countryCode} />
      ),
    group: isSelected ? 'Selected' : baseGroup,
  };
};

const DestinationContent = ({ maxDisplayedChips, onDeleteSingle }: DestinationContentProps) => {
  const [stateLocation, actionLocation] = useActionState(getLocations, undefined);
  const { watch, setValue } = useFormContext<SearchBarFormValues>();

  const [searchString, setSearchString] = useState<string>('');

  const currentDestinations = watch('destinations') || [];

  const watchedDid = watch('did');
  const currentDestinationIds = useMemo(() => watchedDid || [], [watchedDid]);

  useEffect(() => {
    startTransition(() => {
      actionLocation({
        name: searchString,
        selected: currentDestinationIds,
      });
    });
  }, [searchString, currentDestinationIds]);

  const handleInputChange = (value: string) => {
    setSearchString(value);
  };

  const handleAddDestination = (option: AutocompleteOption) => {
    if (!stateLocation?.content) return;

    const isAlreadySelected = currentDestinations.includes(option.label);

    if (isAlreadySelected) {
      const destinationIndex = currentDestinations.findIndex((dest: string) => dest === option.label);

      if (destinationIndex !== -1) {
        const updatedDestinations = currentDestinations.filter(
          (_: string, index: number) => index !== destinationIndex
        );
        const updatedIds = currentDestinationIds.filter((_: string, index: number) => index !== destinationIndex);

        setValue('destinations', updatedDestinations);
        setValue('did', updatedIds);
      }
    } else {
      const location = stateLocation.content.find(loc => loc.id === option.id);

      if (location) {
        const updatedDestinations = [...currentDestinations, location.name];
        const updatedIds = [...currentDestinationIds, location.id];

        setValue('destinations', updatedDestinations);
        setValue('did', updatedIds);
      }
    }

    setSearchString('');
  };

  const getOptionsWithSelected = (): AutocompleteOption[] => {
    if (!stateLocation?.content) return [];

    const searchResults = stateLocation.content;
    const selectedDestinationNames = currentDestinations;

    const combinedLocations = [...searchResults];

    const uniqueLocations = combinedLocations.reduce((acc, current) => {
      if (!acc.find(item => item.id === current.id)) {
        acc.push(current);
      }

      return acc;
    }, [] as LocationModel[]);

    return uniqueLocations.map(location => {
      const isSelected = selectedDestinationNames.includes(location.name);

      return transformLocationToOption(location, isSelected);
    });
  };

  const handleDeleteSingle = (option: string, index: number) => {
    const destinationIndex = currentDestinations.findIndex((dest: string) => dest === option);

    if (destinationIndex !== -1) {
      const updatedDestinations = currentDestinations.filter((_: string, idx: number) => idx !== destinationIndex);
      const updatedIds = currentDestinationIds.filter((_: string, idx: number) => idx !== destinationIndex);

      setValue('destinations', updatedDestinations);
      setValue('did', updatedIds);
    }

    onDeleteSingle?.(option, index);
  };

  return (
    <FilterableChecklist
      options={getOptionsWithSelected()}
      searchValue={searchString}
      setSearchValue={handleInputChange}
      handleAdd={handleAddDestination}
      selectedOptions={currentDestinations}
      onDeleteSingle={handleDeleteSingle}
      maxDisplayedChips={maxDisplayedChips}
      groupBy={option => option.group || ''}
    />
  );
};

export default DestinationContent;
