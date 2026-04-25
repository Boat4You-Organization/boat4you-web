'use client';

import { useFormContext } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import { SearchBarFormValues } from '@/config/form-models.config';
import useLocationAutocomplete from '@/utils/hooks/useLocationAutocomplete';

// Mobile modal content for destination picking. Shares the same hook +
// AutocompleteMultipleChip as desktop (GeneralSearchBarDesktop) so that
// feature parity (geolocation, recent, popular, tags, flags, multi-level
// placeholder) is guaranteed. Chip management outside the modal is still
// handled by ButtonWithChips in GeneralSearchBarMobile; this component
// only renders the autocomplete itself inside the modal body.
const DestinationContent = () => {
  const { watch } = useFormContext<SearchBarFormValues>();
  const tHome = useTranslations('home');

  const locations = watch('did');

  const renderLocationInput = useLocationAutocomplete({
    isExpanded: true,
    variant: 'expanded',
    selectedValues: locations,
    // Full-screen mobile modal — keep the dropdown open so recent +
    // popular suggestions are visible as soon as the modal mounts, no
    // tap on the input required.
    alwaysOpen: true,
    translations: {
      whereAreYouGoing: tHome('generalSearchBar.whereAreYouGoing'),
      where: tHome('generalSearchBar.where'),
      searchLocations: tHome('generalSearchBar.searchLocations'),
      aroundCurrentLocation: tHome('generalSearchBar.aroundCurrentLocation'),
      locating: tHome('generalSearchBar.locating'),
      locationError: tHome('generalSearchBar.locationError'),
    },
  });

  return <FormInput name="did" renderInput={renderLocationInput} />;
};

export default DestinationContent;
