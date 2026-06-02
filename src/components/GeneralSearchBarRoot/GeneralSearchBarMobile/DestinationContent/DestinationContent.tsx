'use client';

import { useFormContext } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import FormInput from '@/components/Forms/FormInput';
import { SearchBarFormValues } from '@/config/form-models.config';
import useLocationAutocomplete from '@/utils/hooks/useLocationAutocomplete';

interface DestinationContentProps {
  // Desktop guided flow: fires when a location is added so the parent can
  // close this dropdown and advance to the date picker. Mobile leaves it unset
  // (it advances via the modal's "Choose destination" confirm button instead).
  onLocationAdded?: () => void;
}

// Destination picker body. Shares the same hook + AutocompleteMultipleChip
// everywhere so that feature parity (geolocation, recent, popular, tags, flags,
// multi-level placeholder) is guaranteed. Chip management outside the dropdown
// is handled by ButtonWithChips in GeneralSearchBarMobile; this component only
// renders the autocomplete itself (inside the desktop popover or mobile modal).
const DestinationContent = ({ onLocationAdded }: DestinationContentProps) => {
  const { watch } = useFormContext<SearchBarFormValues>();
  const tHome = useTranslations('home');

  const locations = watch('did');

  const renderLocationInput = useLocationAutocomplete({
    isExpanded: true,
    variant: 'expanded',
    selectedValues: locations,
    // Keep the dropdown open so recent + popular suggestions are visible as
    // soon as the picker mounts, no tap on the input required.
    alwaysOpen: true,
    onLocationAdded,
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
