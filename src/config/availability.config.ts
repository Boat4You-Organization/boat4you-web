import dayjs from 'dayjs';

import DateTime from '@/utils/static/DateTime';

import { DATE_FORMAT_LONG_WITHOUT_DAY } from './date-time.config';

export interface Availability {
  startDate: string;
  endDate: string;
  price: number;
  isAvailable: boolean;
}

const START_DATE = dayjs(DateTime.startOfMonth(dayjs()));
const WEEKS = 10;

const availability: Availability[] = Array.from({ length: WEEKS }).map((_, index) => {
  const start = START_DATE.add(index, 'week');
  const end = start.add(7, 'day');

  return {
    startDate: start.format(DATE_FORMAT_LONG_WITHOUT_DAY),
    endDate: end.format(DATE_FORMAT_LONG_WITHOUT_DAY),
    price: 960 + index * 50,
    isAvailable: true,
  };
});

export default availability;
