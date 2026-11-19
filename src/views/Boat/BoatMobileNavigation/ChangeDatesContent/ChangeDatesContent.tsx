'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import { getSingleYachtAvailability } from '@/actions/yacht.actions';
import DateRangePicker from '@/components/DateRangePicker';
import { BoatCalendarFormValues } from '@/config/form-models.config';
import { YachtModel } from '@/models/yacht.model';
import useQueryParams from '@/utils/hooks/useQueryParams';
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

  // Reserved days, month by month as the list scrolls to them (the endpoint answers one month at a time).
  const [reservedByMonth, setReservedByMonth] = useState<Record<string, string[]>>({});
  const requestedMonths = useRef(new Set<string>());

  const handleMonthShown = useCallback(
    async (month: Dayjs) => {
      const key = month.format('YYYY-MM');

      if (requestedMonths.current.has(key)) return;

      requestedMonths.current.add(key);

      const periods = await getSingleYachtAvailability(null, {
        yachtSlug: yacht.slug,
        month: month.month() + 1,
        year: month.year(),
      });
      const days: string[] = [];

      if (Array.isArray(periods)) {
        periods.forEach(period => {
          if (period.status !== 'RESERVATION') return;

          const end = dayjs(period.to);
          let current = dayjs(period.from);

          while (current.isBefore(end)) {
            days.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
          }
        });
      }

      setReservedByMonth(previous => ({ ...previous, [key]: days }));
    },
    [yacht.slug]
  );

  const unavailableDates = useMemo(() => [...new Set(Object.values(reservedByMonth).flat())], [reservedByMonth]);

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
