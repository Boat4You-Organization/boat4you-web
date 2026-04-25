'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Divider } from '@mui/material';
import cx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

import DatePickerDropdown from '@/components/DatePickerDropdown';
import FormInput from '@/components/Forms/FormInput';
import { SearchBarFormValues } from '@/config/form-models.config';
import { DateDisableReason } from '@/types/dateDisabledReason.type';
import useBoatTypeAutocomplete from '@/utils/hooks/useBoatTypeAutocomplete';
import useLocationAutocomplete from '@/utils/hooks/useLocationAutocomplete';
import { handleNextMonth, handlePrevMonth } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './HeaderSearchForm.module.scss';

interface HeaderSearchFormProps {
  isExpanded: boolean;
  translations: {
    whereAreYouGoing: string;
    where: string;
    searchLocations: string;
  };
}

const HeaderSearchForm = ({ isExpanded, translations }: HeaderSearchFormProps) => {
  const { activeDate } = useYachtStore();

  const { watch } = useFormContext<SearchBarFormValues>();
  const locations = watch('did');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const renderLocationInput = useLocationAutocomplete({
    isExpanded,
    variant: 'compact',
    selectedValues: locations,
    translations,
  });
  const renderBoatTypeInput = useBoatTypeAutocomplete({ isExpanded, variant: 'compact' });

  const getDateDisableReason = useCallback(
    (date: Dayjs): DateDisableReason => {
      if (date.isBefore(dayjs(), 'day')) return 'past';

      // Constraints only apply while picking the end date (start set, end not yet).
      // Once both dates are set the next click starts a new range, so no dates
      // should be blocked — otherwise users can't re-pick a new start outside
      // the old 28-day window.
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
    <>
      <Box flex={1} width={isExpanded ? 248 : 'auto'}>
        <FormInput name="did" renderInput={renderLocationInput} />
      </Box>
      {!isExpanded && <Divider classes={{ root: styles.root }} className={styles.divider} />}
      <Box flex={1} width={isExpanded ? 248 : 'auto'} height="100%">
        <DatePickerDropdown<SearchBarFormValues>
          startDateFieldName="startDate"
          endDateFieldName="endDate"
          isHeaderPicker
          isExpanded={isExpanded}
          getDateDisableReason={getDateDisableReason}
          externalCurrentMonth={activeDate}
          externalHandlePrevMonth={handlePrevMonth}
          externalHandleNextMonth={handleNextMonth}
        />
      </Box>
      {!isExpanded && <Divider classes={{ root: styles.root }} className={cx(styles.divider, styles.lastItem)} />}
      <Box flex={1} width={isExpanded ? 248 : 'auto'}>
        <FormInput name="boatTypes" renderInput={renderBoatTypeInput} />
      </Box>
    </>
  );
};

export default HeaderSearchForm;
