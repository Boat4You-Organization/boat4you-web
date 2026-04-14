import DateTime from '@/utils/static/DateTime';

export type CalendarQuickFilterKey = 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';

export interface CalendarQuickFilter {
  label: string;
  getValue: () => [string, string];
}

export const calendarQuickFilters: Record<CalendarQuickFilterKey, CalendarQuickFilter> = {
  thisWeek: {
    label: 'common.this-week',
    getValue: () => {
      const now = DateTime.now();

      return [DateTime.startOfWeek(now), DateTime.endOfWeek(now)];
    },
  },
  lastWeek: {
    label: 'common.last-week',
    getValue: () => {
      const lastWeek = DateTime.subtractWeek(DateTime.now());

      return [DateTime.startOfWeek(lastWeek), DateTime.endOfWeek(lastWeek)];
    },
  },
  thisMonth: {
    label: 'common.this-month',
    getValue: () => {
      const now = DateTime.now();

      return [DateTime.startOfMonth(now), DateTime.endOfMonth(now)];
    },
  },
  lastMonth: {
    label: 'common.last-month',
    getValue: () => {
      const lastMonth = DateTime.now().subtract(1, 'month');

      return [DateTime.startOfMonth(lastMonth), DateTime.endOfMonth(lastMonth)];
    },
  },
  thisYear: {
    label: 'common.this-year',
    getValue: () => {
      const now = DateTime.now();

      return [DateTime.startOfYear(now), DateTime.endOfYear(now)];
    },
  },
  lastYear: {
    label: 'common.last-year',
    getValue: () => {
      const lastYear = DateTime.now().subtract(1, 'year');

      return [DateTime.startOfYear(lastYear), DateTime.endOfYear(lastYear)];
    },
  },
};
