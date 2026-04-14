import dayjs from 'dayjs';

export interface Period {
  id: string;
  dateFrom: string;
  dateTo: string;
}

export const generateSaturdayToSaturdayPeriods = (startDate: dayjs.Dayjs, count: number): Period[] => {
  const periods: Period[] = [];
  let currentDate = startDate.day(6);

  for (let i = 0; i < count; i += 1) {
    const dateFrom = currentDate.format('YYYY-MM-DD');
    const dateTo = currentDate.add(7, 'day').format('YYYY-MM-DD');

    periods.push({
      id: `${dateFrom}-${dateTo}`,
      dateFrom,
      dateTo,
    });

    currentDate = currentDate.add(7, 'day');
  }

  return periods;
};
