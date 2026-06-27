'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import { Close } from '@mui/icons-material';
import { Button, IconButton, Menu, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import cx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import CustomDateCalendar from '@/components/CustomDateCalendar';
import ModalRoot from '@/components/ModalRoot';
import Calendar from '@/components/SvgIcons/Calendar';
import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import colors from '@/styles/themes/colors';
import { DateDisableReason } from '@/types/dateDisabledReason.type';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './DatePickerDropdown.module.scss';

interface DatePickerDropdownProps<T extends FieldValues> {
  startDateFieldName: Path<T>;
  endDateFieldName: Path<T>;
  isHeaderPicker?: boolean;
  isExpanded?: boolean;
  getDateDisableReason?: (date: Dayjs) => DateDisableReason;
  externalCurrentMonth?: Dayjs;
  externalHandlePrevMonth?: () => void;
  externalHandleNextMonth?: () => void;
  /**
   * Counter that, when changed, programmatically opens the date picker.
   * Useful for auto-advancing users from the location input to date selection.
   */
  openSignal?: number;
}

const DatePickerDropdown = <T extends FieldValues>({
  startDateFieldName,
  endDateFieldName,
  isHeaderPicker = false,
  isExpanded = true,
  getDateDisableReason,
  externalCurrentMonth,
  externalHandlePrevMonth,
  externalHandleNextMonth,
  openSignal,
}: DatePickerDropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isModalOpen, toggleModal] = useToggleState();
  const { setValue, watch } = useFormContext<T>();
  const startDate = watch(startDateFieldName);
  const endDate = watch(endDateFieldName);
  const open = Boolean(anchorEl);
  const t = useTranslations();
  const locale = useLocale();
  const customBreakpoint = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const isOpen = !customBreakpoint ? open : isModalOpen;

  const formatDateWithLocale = useCallback((date: Dayjs) => date.locale(locale).format('DD MMM'), [locale]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (customBreakpoint) {
      toggleModal();
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    toggleModal();
  }, [toggleModal]);

  const [localCurrentMonth, setLocalCurrentMonth] = useState<Dayjs>(dayjs());

  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);

  const isUsingExternalStore = Boolean(externalCurrentMonth && externalHandlePrevMonth && externalHandleNextMonth);
  const currentMonth = isUsingExternalStore ? externalCurrentMonth! : localCurrentMonth;

  const handlePrevMonth = isUsingExternalStore
    ? externalHandlePrevMonth!
    : () => setLocalCurrentMonth(prev => prev.subtract(1, 'month'));

  const handleNextMonth = isUsingExternalStore
    ? externalHandleNextMonth!
    : () => setLocalCurrentMonth(prev => prev.add(1, 'month'));

  // Programmatic open via external signal (e.g. after location select).
  const lastOpenSignal = useRef<number | undefined>(openSignal);

  useEffect(() => {
    if (openSignal === undefined) return;

    if (lastOpenSignal.current !== openSignal) {
      lastOpenSignal.current = openSignal;

      if (isOpen) return;

      if (customBreakpoint) {
        if (!isModalOpen) toggleModal();
      } else if (buttonRef.current) {
        setAnchorEl(buttonRef.current);
      }
    }
  }, [openSignal, isOpen, isModalOpen, customBreakpoint, toggleModal]);

  const handleDayClick = useCallback(
    (date: Dayjs) => {
      if (!startDate || (startDate && endDate)) {
        setValue(startDateFieldName, date as PathValue<T, typeof startDateFieldName>);
        setValue(endDateFieldName, null as PathValue<T, typeof endDateFieldName>);
        setHoverDate(null);
      } else if (date.isBefore(startDate, 'day') || date.isSame(startDate)) {
        setValue(startDateFieldName, date as PathValue<T, typeof startDateFieldName>);
        setValue(endDateFieldName, null as PathValue<T, typeof endDateFieldName>);
        setHoverDate(null);
      } else {
        setValue(startDateFieldName, startDate as PathValue<T, typeof startDateFieldName>);
        setValue(endDateFieldName, date as PathValue<T, typeof endDateFieldName>);
        setHoverDate(null);

        // Auto-close on range-complete on BOTH desktop and mobile so
        // downstream auto-advance (e.g. opening the boat-type modal on
        // mobile) sees a clean "dates picked + calendar gone" state.
        handleClose();
      }
    },
    [startDate, endDate, setValue, startDateFieldName, endDateFieldName, customBreakpoint, handleClose]
  );

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValue(startDateFieldName, null as PathValue<T, typeof startDateFieldName>);
    setValue(endDateFieldName, null as PathValue<T, typeof endDateFieldName>);
  };

  const handleDayHover = useCallback((date: Dayjs | null) => {
    setHoverDate(date);
  }, []);

  const renderSingleMonth = (month: Dayjs, showPrevArrow: boolean, showNextArrow: boolean) => (
    <Stack width="100%" position="relative" height="100%" key={month.format('YYYY-MM')}>
      {showPrevArrow && (
        <IconButton
          onClick={handlePrevMonth}
          sx={{ position: 'absolute', top: 0, left: customBreakpoint ? 24 : 0, zIndex: 1 }}
        >
          <ChevronLeft size={28} fill={colors.black400} />
        </IconButton>
      )}
      {showNextArrow && (
        <IconButton
          onClick={handleNextMonth}
          sx={{ position: 'absolute', top: 0, right: customBreakpoint ? 24 : 0, zIndex: 1 }}
        >
          <ChevronRight size={28} fill={colors.black400} />
        </IconButton>
      )}
      <CustomDateCalendar
        currentMonth={month}
        startDate={startDate}
        endDate={endDate}
        onDayClick={handleDayClick}
        hoverDate={hoverDate}
        onDayHover={handleDayHover}
        getDateDisableReason={getDateDisableReason}
      />
    </Stack>
  );

  // Mobile: render a vertical list of months from the current one through the
  // END of NEXT calendar year, so a customer can always pick a date up to the
  // whole next year ahead (Mario rule 27.6.2026 — was a fixed 6 months, which
  // ran out in Nov 2026 and hid all of 2027). Built once per mount.
  const mobileMonths = React.useMemo(() => {
    const start = dayjs().startOf('month');
    const end = dayjs().add(1, 'year').endOf('year').startOf('month');
    const count = end.diff(start, 'month') + 1;

    return Array.from({ length: count }, (_, i) => start.add(i, 'month'));
  }, []);

  const renderCalendarContent = () => {
    const nextMonth = currentMonth.add(1, 'month');
    const showDualCalendar = !customBreakpoint;

    if (customBreakpoint) {
      return (
        // `MuiDateCalendar` already renders its own month header — don't
        // double it. Narrow padding + small gap so months sit clean.
        // Compact each month (drop the 276px floor, tighten week gaps + day
        // cells) so the NEXT month's header peeks below the fold — signals the
        // list scrolls. Mobile-only; desktop/boat-detail keep roomier sizing.
        // Mario rule 27.6.2026.
        <Stack
          direction="column"
          spacing={1}
          width="100%"
          px={2}
          sx={{
            // Nest through `.MuiDateCalendar-root` to outrank the equal-
            // specificity defaults CustomDateCalendar sets on its own sx
            // (MUI's sx collapses `&&`, so an extra class is the reliable bump).
            // Compact fixed height (MUI absolutely-positions the month grid in
            // the slide transition, so it needs an explicit reserve — `unset`
            // collapses it). 6 rows × 32px + gaps ≈ 204, down from 276.
            '& .MuiDateCalendar-root .MuiPickersSlideTransition-root': { minHeight: '204px' },
            '& .MuiDateCalendar-root .MuiDayCalendar-monthContainer': { gap: '2px' },
            '& .MuiDateCalendar-root .MuiDayCalendar-header': { pb: '2px' },
            '& .MuiPickersDay-root, & .MuiPickersDay-hiddenDaySpacingFiller': {
              minWidth: '32px',
              minHeight: '32px',
            },
          }}
        >
          {mobileMonths.map(month => (
            <CustomDateCalendar
              key={month.format('YYYY-MM')}
              currentMonth={month}
              startDate={startDate}
              endDate={endDate}
              onDayClick={handleDayClick}
              hoverDate={hoverDate}
              onDayHover={handleDayHover}
              getDateDisableReason={getDateDisableReason}
            />
          ))}
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={4} paddingBlock={2} paddingInline={4} width="100%" height="100%">
        {showDualCalendar ? (
          <>
            {renderSingleMonth(currentMonth, true, false)}
            {renderSingleMonth(nextMonth, false, true)}
          </>
        ) : (
          renderSingleMonth(currentMonth, true, true)
        )}
      </Stack>
    );
  };

  return (
    <>
      <Button
        component="div"
        ref={buttonRef}
        id="calendar-button"
        aria-controls={isOpen ? 'calendar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        startIcon={<Calendar variant="secondary" size={!isExpanded ? 16 : 24} />}
        endIcon={
          isExpanded &&
          startDate &&
          endDate && (
            <IconButton onClick={handleClear} className={styles.iconButton}>
              <Close color="secondary" fontSize="small" />
            </IconButton>
          )
        }
        size="large"
        classes={{ root: styles.rootButton }}
        className={cx(
          styles.customButton,
          { [styles.isButtonActive]: isOpen },
          { [styles.isButtonExpanded]: !isExpanded },
          { [styles.hasValue]: startDate && endDate }
        )}
        fullWidth
        sx={{
          '& .MuiButton-endIcon': {
            marginLeft: 'auto',
          },
        }}
      >
        {startDate && endDate ? (
          <Typography
            variant={!isExpanded ? 'body2' : 'body1'}
            color={!isExpanded ? colors.black400 : colors.black950}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {`${formatDateWithLocale(startDate)} - ${formatDateWithLocale(endDate)}`}
          </Typography>
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {isHeaderPicker ? (
              <Typography
                variant={!isExpanded ? 'body2' : 'body1'}
                color={colors.black300}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('home.generalSearchBar.choosedates')}
              </Typography>
            ) : (
              <Stack direction="column" alignItems="start">
                <Typography variant="body1" fontWeight={600} color={colors.black950}>
                  {t('home.generalSearchBar.when')}
                </Typography>
                <Typography variant="body2" color={colors.black400}>
                  {t('home.generalSearchBar.choosedates')}
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Button>
      {!customBreakpoint && (
        <Menu
          id="calendar-menu"
          aria-labelledby="calendar-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          // Center the 2-month popover under the date button. Default
          // `left/left` anchored the 720px panel to the button's left edge,
          // so it spilled rightward across the header. Centering keeps both
          // months visible and balanced under the trigger.
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            marginTop: 1.5,
            '& .MuiMenu-list': {
              padding: 0,
            },
            '& .MuiPaper-root': {
              borderRadius: '10px',
              boxShadow: '0px 4px 14px 0px rgba(0, 0, 0, 0.15);',
              minWidth: '720px',
            },
          }}
        >
          {renderCalendarContent()}
        </Menu>
      )}
      {customBreakpoint && (
        <ModalRoot
          title={t('common.selectDates')}
          open={isModalOpen}
          onOpen={toggleModal}
          onClose={toggleModal}
          hideCancelButton
          // Bottom-sheet (80dvh) — calendar sits lower on screen, home
          // hero peeks through at the top, no visual "wall of white".
          customButton={
            <Button variant="contained" size="large" onClick={toggleModal} fullWidth>
              {t('common.selectDates')}
            </Button>
          }
        >
          {renderCalendarContent()}
        </ModalRoot>
      )}
    </>
  );
};

export default DatePickerDropdown;
