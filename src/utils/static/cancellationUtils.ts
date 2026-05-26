import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import DateTime from '@/utils/static/DateTime';

dayjs.extend(isSameOrAfter);

/**
 * How long the customer keeps seeing the rejected-cancellation banner +
 * status chip after the admin marks the request as refused. After this
 * window the booking renders as a normal active booking — no banner, no
 * chip, no leftover "in progress" pill on the list page. Mario rule
 * (3.5.2026): "neka bude tako 10 dana i onda se vraca kao prije, da se
 * vise ne vidi cancelation request — to je bilo, odbiveno i idemo dalje".
 */
const REJECTED_VISIBILITY_DAYS = 10;

export type CancellationDisplayState = 'pending' | 'rejected' | 'none';

export interface CancellationDisplayInput {
  cancellationRequestAt?: string | null;
  cancellationRejectedAt?: string | null;
  /** True when the reservation itself is in the cancelled status. When
   *  cancelled, the standard cancelled chip wins and we skip the
   *  cancellation-request UI altogether. */
  isCancelled?: boolean;
}

/**
 * Resolves the customer-side cancellation surface state for a single
 * reservation. Used in 4 places: ActiveReservationCard chip,
 * PastReservationCard chip, ReservationHeroSection header chip + banner,
 * ReservationCTA banner. Same input → same answer everywhere so detail
 * page and list page can never disagree.
 */
export const getCancellationDisplayState = ({
  cancellationRequestAt,
  cancellationRejectedAt,
  isCancelled,
}: CancellationDisplayInput): CancellationDisplayState => {
  if (isCancelled) return 'none';

  if (!cancellationRequestAt) return 'none';

  if (cancellationRejectedAt) {
    const rejectedOn = dayjs(cancellationRejectedAt);

    if (!rejectedOn.isValid()) return 'none';

    const visibleUntil = rejectedOn.add(REJECTED_VISIBILITY_DAYS, 'day');

    return dayjs().isBefore(visibleUntil) ? 'rejected' : 'none';
  }

  return 'pending';
};

export interface CancellationTimelineItem {
  date: string;
  text: string;
  active?: boolean;
}

export const generateCancellationTimeline = (
  dateFrom: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: (key: any, values?: any) => string,
  locale?: string
): CancellationTimelineItem[] => {
  const today = dayjs();
  const reservationStartDate = dayjs(dateFrom);
  const fiveDaysFromToday = today.add(5, 'day');
  const daysUntilReservation = DateTime.daysBetween(today, reservationStartDate);
  const isWithin44DayPeriod = daysUntilReservation <= 44;
  const timeline: CancellationTimelineItem[] = [];

  if (isWithin44DayPeriod) {
    timeline.push({
      date: DateTime.formatWithMonthName(today, locale),
      text: t
        ? t('cancellationFee100Percent', { date: DateTime.formatLongWithoutDay(today, locale) })
        : `Cancellation fee is 100% if you cancel after ${DateTime.formatLongWithoutDay(today, locale)}.`,
      active: today.isSameOrAfter(today),
    });
  } else if (daysUntilReservation >= 45) {
    timeline.push({
      date: DateTime.formatWithMonthName(today, locale),
      text: t
        ? t('cancelAndRescheduleForFreeBefore', { date: DateTime.formatLongWithoutDay(fiveDaysFromToday, locale) })
        : `Cancel and reschedule for free before ${DateTime.formatLongWithoutDay(fiveDaysFromToday, locale)}`,
      active: today.isSameOrAfter(today),
    });

    const fiftyPercentStartDate = fiveDaysFromToday.add(1, 'day');
    const hundredPercentStartDate = reservationStartDate.subtract(44, 'day');

    timeline.push({
      date: DateTime.formatWithMonthName(fiftyPercentStartDate, locale),
      text: t
        ? t('cancellationFee50Percent', { date: DateTime.formatLongWithoutDay(fiftyPercentStartDate, locale) })
        : `Cancellation fee is 50% if you cancel after ${DateTime.formatLongWithoutDay(fiftyPercentStartDate, locale)}.`,
      active: today.isSameOrAfter(fiftyPercentStartDate),
    });

    if (hundredPercentStartDate.isAfter(fiftyPercentStartDate)) {
      timeline.push({
        date: DateTime.formatWithMonthName(hundredPercentStartDate, locale),
        text: t
          ? t('cancellationFee100Percent', { date: DateTime.formatLongWithoutDay(hundredPercentStartDate, locale) })
          : `Cancellation fee is 100% if you cancel after ${DateTime.formatLongWithoutDay(hundredPercentStartDate, locale)}.`,
        active: today.isSameOrAfter(hundredPercentStartDate),
      });
    }
  }

  timeline.push({
    date: DateTime.formatWithMonthName(reservationStartDate, locale),
    text: t ? t('yachtPickup') : 'Yacht Pick-up',
    active: today.isSameOrAfter(reservationStartDate),
  });

  return timeline;
};
