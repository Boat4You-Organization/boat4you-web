'use client';

import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import DateRangePicker from '@/components/DateRangePicker';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { YachtModel } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useReservedDaysByMonth from '@/utils/hooks/useReservedDaysByMonth';
import DateTime from '@/utils/static/DateTime';

interface ChangeDatesContentProps {
  yacht: YachtModel;
  open: boolean;
  onToggle: () => void;
}

/**
 * The phone's date sheet of the boat page: one sheet, the months in a list that scrolls down, and it closes with
 * the range as soon as the second day is tapped (Mario 19.11.2026). Before: a sheet with a red "no dates selected"
 * notice and two fields, a tap on a field opened a second sheet with one month and arrows, then Confirm twice. The
 * price and "not available on these dates" are the bar's to say, under the sheet.
 */
const ChangeDatesContent = ({ yacht, open, onToggle }: ChangeDatesContentProps) => {
  const { setMultipleParams } = useQueryParams();
  const { setValue, watch } = useFormContext<BoatCalendarFormValues>();
  const t = useTranslations('yacht');
  const tCommon = useTranslations('common');

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Reserved days, month by month as the list scrolls to them.
  const { reservedDays: unavailableDates, loadMonth: handleMonthShown } = useReservedDaysByMonth(yacht.slug);

  const handleConfirm = useCallback(
    (dates: [Dayjs | null, Dayjs | null]) => {
      const [start, end] = dates;

      setValue('startDate', start);
      setValue('endDate', end);

      if (start && end) {
        setMultipleParams({
          startDate: DateTime.formatFull(start),
          endDate: DateTime.formatFull(end),
        });
      } else {
        setMultipleParams({ startDate: '', endDate: '' });
      }
    },
    [setMultipleParams, setValue]
  );

  return (
    <DateRangePicker
      isBoatCalendar
      scrollMonths
      title={startDate && endDate ? tCommon('changeDates') : t('chooseDates')}
      isModalOpen={open}
      toggleModal={onToggle}
      startDate={startDate}
      endDate={endDate}
      handleDateChange={() => {}}
      onConfirm={handleConfirm}
      onMonthShown={handleMonthShown}
      unavailableDates={unavailableDates}
    />
  );
};

export default ChangeDatesContent;
