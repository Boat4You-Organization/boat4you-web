import { LocalizationProvider, DateCalendar as MuiDateCalendar, PickersDayProps } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/hr';
import 'dayjs/locale/it';
import 'dayjs/locale/nl';
import 'dayjs/locale/pl';
import 'dayjs/locale/pt';
import { useLocale } from 'next-intl';

import CustomDay from '@/components/CustomDateCalendar/CustomDay';
import colors from '@/styles/themes/colors';
import typography from '@/styles/themes/typography';
import { DateDisableReason } from '@/types/dateDisabledReason.type';

interface CustomDateCalendarProps {
  currentMonth: Dayjs;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDayClick: (date: Dayjs) => void;
  hoverDate: Dayjs | null;
  onDayHover: (date: Dayjs | null) => void;
  getDateDisableReason?: (date: Dayjs) => DateDisableReason;
}

const calendarStyles = {
  width: '100%',
  overflow: 'visible',
  height: 'fit-content',
  maxHeight: 'fit-content',
  minWidth: '336px',
  '& .MuiDayCalendar-header': {
    pb: '12px',
  },
  '& .MuiDayCalendar-header > *': {
    flex: 1,
    ...typography.body2,
    color: colors.black600,
    margin: 'auto',
    p: '6px',
    minWidth: '22px',
    minHeight: '22px',
    textTransform: 'capitalize',
  },
  '& .MuiPickersDay-hiddenDaySpacingFiller': {
    flex: 1,
    margin: 'auto',
    p: '6px',
    minWidth: '22px',
    minHeight: '22px',
  },
  '& .MuiDayCalendar-monthContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  '& .MuiDayCalendar-weekContainer': {
    margin: 0,
  },
  '& .MuiPickersSlideTransition-root': {
    height: 'auto',
    minHeight: '276px',
    overflow: 'visible',
  },
};

const headerStyles = {
  position: 'relative',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 'auto',
  margin: 0,
  '& .MuiPickersCalendarHeader-labelContainer': {
    margin: 'auto',
    flexDirection: 'row',
    gap: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'capitalize',
  },
  '& .MuiPickersCalendarHeader-label': {
    ...typography.h4,
    whiteSpace: 'nowrap',
    color: colors.black950,
    margin: 0,
    cursor: 'default',
  },
  '& .MuiPickersArrowSwitcher-root': {
    display: 'none',
  },
};

const getAdapterLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    en: 'en',
    'en-US': 'en',
    'en-GB': 'en-gb',
    es: 'es',
    'es-ES': 'es',
    fr: 'fr',
    'fr-FR': 'fr',
    de: 'de',
    'de-DE': 'de',
    hr: 'hr',
    'hr-HR': 'hr',
  };

  return localeMap[locale] || 'en';
};

const formatDayOfWeek = (date: Dayjs, locale: string): string => {
  let dayAbbr = date.format('ddd');

  dayAbbr = dayAbbr.replace(/\./g, '');

  if (locale.startsWith('hr')) {
    const croatianDays = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'];
    const dayIndex = date.day();

    dayAbbr = croatianDays[dayIndex];
  }

  return dayAbbr.charAt(0).toUpperCase() + dayAbbr.slice(1).toLowerCase();
};

interface CalendarDayExtraProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDayClick: (date: Dayjs) => void;
  hoverDate: Dayjs | null;
  onDayHover: (date: Dayjs | null) => void;
  getDateDisableReason: (date: Dayjs) => DateDisableReason;
}

// Module-level day slot: MUI must see the SAME component type on every render.
// The old inline `day: props => <CustomDay … />` was a brand-new component on
// each render, so React unmounted and re-created every day cell whenever the
// calendar re-rendered — ~460 cells per tap in the 15-month mobile sheet
// (1.7 s main-thread block at 4x CPU, 1.10.2026). The per-render values now
// travel through `slotProps.day`.
const CalendarDay = ({ getDateDisableReason, ...props }: PickersDayProps & CalendarDayExtraProps) => (
  <CustomDay {...props} disableReason={getDateDisableReason(props.day)} />
);

const CustomDateCalendar = ({
  currentMonth,
  startDate,
  endDate,
  onDayClick,
  hoverDate,
  onDayHover,
  getDateDisableReason = () => 'none',
}: CustomDateCalendarProps) => {
  const locale = useLocale();

  const adapterLocale = getAdapterLocale(locale);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
      <MuiDateCalendar
        key={currentMonth.format('YYYY-MM')}
        value={null}
        referenceDate={currentMonth}
        views={['day']}
        // Always lay out six week rows. Without it a five-row month sat on
        // the 276px floor below while a six-row one grew to 291px, so the
        // dialog gained 15px the first time the calendar reached such a
        // month and never gave it back. The extra row renders as empty
        // cells (days outside the month stay hidden), which is the space
        // the minHeight was already reserving.
        fixedWeekNumber={6}
        dayOfWeekFormatter={date => formatDayOfWeek(date, locale)}
        disableHighlightToday
        sx={calendarStyles}
        slots={{
          leftArrowIcon: () => null,
          rightArrowIcon: () => null,
          day: CalendarDay as React.ComponentType<PickersDayProps>,
        }}
        slotProps={{
          calendarHeader: {
            sx: headerStyles,
          },
          day: {
            startDate,
            endDate,
            onDayClick,
            hoverDate,
            onDayHover,
            getDateDisableReason,
          } as Partial<PickersDayProps>,
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateCalendar;
