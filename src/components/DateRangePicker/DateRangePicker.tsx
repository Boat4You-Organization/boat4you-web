import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, IconButton, Stack, Theme, useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import CustomDateCalendar from '@/components/CustomDateCalendar';
import ModalRoot from '@/components/ModalRoot';
import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import colors from '@/styles/themes/colors';
import { DateDisableReason } from '@/types/dateDisabledReason.type';
import { setActiveDate } from '@/valtio/yacht/yacht.actions';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface DateRangePickerProps {
  isBoatCalendar?: boolean;
  isModalOpen: boolean;
  toggleModal: () => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  handleDateChange: (dates: [Dayjs | null, Dayjs | null]) => void;
  onConfirm?: (dates: [Dayjs | null, Dayjs | null]) => void;
  monthsShown?: 1 | 2;
  unavailableDates?: string[];
  externalCurrentMonth?: Dayjs;
  externalHandlePrevMonth?: () => void;
  externalHandleNextMonth?: () => void;
  isLoadingAvailability?: boolean;
}

const DateRangePicker = ({
  isBoatCalendar = false,
  isModalOpen,
  toggleModal,
  startDate,
  endDate,
  handleDateChange,
  onConfirm,
  monthsShown = 1,
  unavailableDates = [],
  externalCurrentMonth,
  externalHandlePrevMonth,
  externalHandleNextMonth,
  isLoadingAvailability = false,
}: DateRangePickerProps) => {
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const t = useTranslations('common');

  const [localCurrentMonth, setLocalCurrentMonth] = useState<Dayjs>(dayjs());
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

  const useDraftMode = Boolean(onConfirm);
  const [draftStartDate, setDraftStartDate] = useState<Dayjs | null>(null);
  const [draftEndDate, setDraftEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (isModalOpen && useDraftMode) {
      setDraftStartDate(startDate);
      setDraftEndDate(endDate);
      setHoverDate(null);

      if (externalCurrentMonth && externalHandlePrevMonth && externalHandleNextMonth && startDate) {
        setActiveDate(startDate.startOf('month'));
      }
    }
  }, [isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeStartDate = useDraftMode ? draftStartDate : startDate;
  const activeEndDate = useDraftMode ? draftEndDate : endDate;

  const isUsingExternalStore = Boolean(externalCurrentMonth && externalHandlePrevMonth && externalHandleNextMonth);
  const currentMonth = isUsingExternalStore ? externalCurrentMonth! : localCurrentMonth;
  const unavailableDatesSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const nextUnavailableDate = useMemo(() => {
    if (!activeStartDate) return null;

    let current = activeStartDate.add(1, 'day');
    const maxDate = current.add(365, 'day');

    while (current.isBefore(maxDate)) {
      if (unavailableDatesSet.has(current.format('YYYY-MM-DD'))) {
        return current;
      }

      current = current.add(1, 'day');
    }

    return null;
  }, [activeStartDate, unavailableDatesSet]);

  const getDateDisableReason = useCallback(
    (date: Dayjs): DateDisableReason => {
      if (!isBoatCalendar) {
        return 'none';
      }

      const dateKey = date.format('YYYY-MM-DD');

      if (date.isBefore(dayjs(), 'day')) return 'past';

      const isUnavailable = unavailableDatesSet.has(dateKey);
      const isChangeoverDay = activeStartDate && nextUnavailableDate && date.isSame(nextUnavailableDate, 'day');

      if (isUnavailable && !isChangeoverDay) return 'unavailable';

      // Range constraints (2-day min, 28-day max, and blocked-by-unavailable)
      // only apply while picking the end date. Once both dates are set, the
      // next click restarts the range, so future dates must stay clickable.
      if (activeStartDate && !activeEndDate) {
        if (nextUnavailableDate && date.isAfter(nextUnavailableDate)) {
          return 'blocked_by_unavailable';
        }

        if (date.isAfter(activeStartDate) && date.isBefore(activeStartDate.add(2, 'day'))) {
          return 'min_constraint';
        }

        if (date.isAfter(activeStartDate.add(28, 'day'))) {
          return 'max_constraint';
        }
      }

      return 'none';
    },
    [isBoatCalendar, activeStartDate, activeEndDate, unavailableDatesSet, nextUnavailableDate]
  );

  const handlePrevMonth = isUsingExternalStore
    ? externalHandlePrevMonth!
    : () => setLocalCurrentMonth(prev => prev.subtract(1, 'month'));

  const handleNextMonth = isUsingExternalStore
    ? externalHandleNextMonth!
    : () => setLocalCurrentMonth(prev => prev.add(1, 'month'));

  const updateDates = useCallback(
    (dates: [Dayjs | null, Dayjs | null]) => {
      if (useDraftMode) {
        setDraftStartDate(dates[0]);
        setDraftEndDate(dates[1]);
      } else {
        handleDateChange(dates);
      }
    },
    [useDraftMode, handleDateChange]
  );

  const handleDayClick = useCallback(
    (date: Dayjs) => {
      if (!activeStartDate || (activeStartDate && activeEndDate)) {
        updateDates([date, null]);
        setHoverDate(null);
      } else if (date.isBefore(activeStartDate, 'day') || date.isSame(activeStartDate)) {
        updateDates([date, null]);
        setHoverDate(null);
      } else {
        updateDates([activeStartDate, date]);
        setHoverDate(null);
      }
    },
    [activeStartDate, activeEndDate, updateDates]
  );

  const handleDayHover = useCallback((date: Dayjs | null) => {
    setHoverDate(date);
  }, []);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm([activeStartDate, activeEndDate]);
    } else {
      handleDateChange([activeStartDate, activeEndDate]);
    }

    toggleModal();
  }, [activeStartDate, activeEndDate, onConfirm, handleDateChange, toggleModal]);

  const handleClear = useCallback(() => {
    if (useDraftMode) {
      setDraftStartDate(null);
      setDraftEndDate(null);
    } else {
      handleDateChange([null, null]);
    }

    setHoverDate(null);

    if (onConfirm) {
      onConfirm([null, null]);
    }
  }, [useDraftMode, handleDateChange, onConfirm]);

  useEffect(() => {
    if (!activeStartDate && !activeEndDate) {
      setHoverDate(null);
    }
  }, [activeStartDate, activeEndDate]);

  return (
    <ModalRoot
      title={t('changeDates')}
      open={isModalOpen}
      onOpen={toggleModal}
      onClose={toggleModal}
      onConfirm={handleConfirm}
      onCancel={handleClear}
      cancelBtnText={t('clearDates')}
      hideCancelButton={false}
    >
      <Stack
        direction={customBreakpoint ? 'column' : 'row'}
        spacing={customBreakpoint ? 2 : 0}
        width="100%"
        height="100%"
      >
        <Stack direction={customBreakpoint ? 'column' : 'row'} alignItems="center" height="100%" flex={1}>
          <Stack width="100%" position="relative" height="100%">
            <IconButton onClick={handlePrevMonth} sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
              <ChevronLeft size={28} fill={colors.black400} />
            </IconButton>
            {monthsShown === 1 && (
              <IconButton onClick={handleNextMonth} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <ChevronRight size={28} fill={colors.black400} />
              </IconButton>
            )}
            <CustomDateCalendar
              key={`${activeStartDate?.format('YYYY-MM-DD') || 'null'}-${activeEndDate?.format('YYYY-MM-DD') || 'null'}`}
              currentMonth={currentMonth}
              startDate={activeStartDate}
              endDate={activeEndDate}
              onDayClick={handleDayClick}
              hoverDate={hoverDate}
              onDayHover={handleDayHover}
              getDateDisableReason={getDateDisableReason}
            />
            {isLoadingAvailability && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
    </ModalRoot>
  );
};

export default DateRangePicker;
