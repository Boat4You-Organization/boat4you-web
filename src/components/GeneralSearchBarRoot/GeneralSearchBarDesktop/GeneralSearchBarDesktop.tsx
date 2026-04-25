'use client';

import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import DatePickerDropdown from '@/components/DatePickerDropdown';
import FormInput from '@/components/Forms/FormInput';
import Search from '@/components/SvgIcons/Search';
import { SearchBarFormValues } from '@/config/form-models.config';
import { GENERAL_SEARCH_FORM } from '@/config/form-names.config';
import { DateDisableReason } from '@/types/dateDisabledReason.type';
import useBoatTypeAutocomplete from '@/utils/hooks/useBoatTypeAutocomplete';
import useLocationAutocomplete from '@/utils/hooks/useLocationAutocomplete';

import styles from './GeneralSearchBarDesktop.module.scss';

const GeneralSearchBarDesktop = () => {
  const { watch } = useFormContext<SearchBarFormValues>();
  const locations = watch('did');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const tHome = useTranslations('home');
  const tCommon = useTranslations('common');

  // Counter bumped every time the user adds a location — this signals the
  // DatePickerDropdown to auto-open so the user is guided to pick dates next.
  const [dateOpenSignal, setDateOpenSignal] = useState(0);

  const handleLocationAdded = useCallback(() => {
    setDateOpenSignal(prev => prev + 1);
  }, []);

  const renderLocationInput = useLocationAutocomplete({
    isExpanded: true,
    variant: 'expanded',
    selectedValues: locations,
    translations: {
      whereAreYouGoing: tHome('generalSearchBar.whereAreYouGoing'),
      where: tHome('generalSearchBar.where'),
      searchLocations: tHome('generalSearchBar.searchLocations'),
      aroundCurrentLocation: tHome('generalSearchBar.aroundCurrentLocation'),
      locating: tHome('generalSearchBar.locating'),
      locationError: tHome('generalSearchBar.locationError'),
    },
    onLocationAdded: handleLocationAdded,
  });
  const renderBoatTypeInput = useBoatTypeAutocomplete({ isExpanded: true, variant: 'expanded' });

  const getDateDisableReason = useCallback(
    (date: Dayjs): DateDisableReason => {
      if (date.isBefore(dayjs(), 'day')) return 'past';

      // Constraints only apply while picking the end date. Once both are set
      // the next click restarts the range — all future dates must be clickable.
      if (startDate && !endDate) {
        if (date.isAfter(startDate) && date.isBefore(startDate.add(2, 'day'))) {
          return 'min_constraint';
        }

        if (date.isAfter(startDate.add(28, 'day'))) {
          return 'max_constraint';
        }
      }

      return 'none';
    },
    [startDate, endDate]
  );

  return (
    <Stack width="100%" direction="row">
      <Stack direction="row" flex={1}>
        <Box flex={1} maxWidth={{ xs: 'auto', md: 278 }}>
          <FormInput name="did" renderInput={renderLocationInput} />
        </Box>
        <Box flex={1} maxWidth={{ xs: 'auto', md: 278 }} height="100%">
          <DatePickerDropdown<SearchBarFormValues>
            startDateFieldName="startDate"
            endDateFieldName="endDate"
            getDateDisableReason={getDateDisableReason}
            openSignal={dateOpenSignal}
          />
        </Box>
        <Box flex={1} maxWidth={{ xs: 'auto', md: 278 }}>
          <FormInput name="boatTypes" renderInput={renderBoatTypeInput} />
        </Box>
      </Stack>
      <Box className={styles.buttonWrapper}>
        <Button
          type="submit"
          size="large"
          sx={{ minWidth: 'auto' }}
          id={GENERAL_SEARCH_FORM}
          disabled={locations.length <= 0}
          aria-label={tCommon('search')}
        >
          <Search size={24} />
        </Button>
      </Box>
    </Stack>
  );
};

export default GeneralSearchBarDesktop;
