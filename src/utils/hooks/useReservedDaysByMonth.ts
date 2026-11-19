import { useCallback, useMemo, useRef, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import { getSingleYachtAvailability } from '@/actions/yacht.actions';
import { ReservationStatus } from '@/models/reservation-status.model';

/**
 * The days a boat cannot be booked on, loaded month by month as the phone's scrolling date sheet reaches them (the
 * availability endpoint answers one month at a time). Hard-blocked days only: a partner RESERVATION and a SERVICE
 * block; an OPTION stays selectable (it leads to an inquiry).
 */
const useReservedDaysByMonth = (yachtSlug: string) => {
  const [reservedByMonth, setReservedByMonth] = useState<Record<string, string[]>>({});
  const requestedMonths = useRef(new Set<string>());

  const loadMonth = useCallback(
    async (month: Dayjs) => {
      const key = month.format('YYYY-MM');

      if (requestedMonths.current.has(key)) return;

      requestedMonths.current.add(key);

      const periods = await getSingleYachtAvailability(null, {
        yachtSlug,
        month: month.month() + 1,
        year: month.year(),
      });
      const days: string[] = [];

      if (Array.isArray(periods)) {
        periods.forEach(period => {
          if (period.status !== ReservationStatus.RESERVATION && period.status !== ReservationStatus.SERVICE) return;

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
    [yachtSlug]
  );

  const reservedDays = useMemo(() => [...new Set(Object.values(reservedByMonth).flat())], [reservedByMonth]);

  return { reservedDays, loadMonth };
};

export default useReservedDaysByMonth;
