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

/**
 * The promise on every boat page, FAQ and model page: "Free cancellation
 * within 72 hours of booking" (Mario rule 8.5.2026 — a cooling-off period from
 * the booking moment, never "before check-in").
 */
export const FREE_CANCELLATION_HOURS = 72;

/**
 * When the free-cancellation window closes. The partner option expiry when we
 * have one (Mario 2.7.2026: free exactly as long as our option at the charter
 * agency lasts); otherwise 72 hours after the booking moment — the promise
 * the boat page makes, never a generic "today + 5 days" estimate and never an
 * invented partner deadline. `bookedAt` is the reservation's creation time on
 * an existing booking; on the checkout, before the booking exists, it is now.
 */
export const freeCancellationEnd = (freeUntil?: string | null, bookedAt?: string | null): dayjs.Dayjs => {
  const partnerExpiry = freeUntil ? dayjs(freeUntil) : null;

  if (partnerExpiry?.isValid()) return partnerExpiry;

  const booked = bookedAt ? dayjs(bookedAt) : null;

  return (booked?.isValid() ? booked : dayjs()).add(FREE_CANCELLATION_HOURS, 'hour');
};

/** "2 October 2026, 15:00" in the page's language — a window closes at a time, not on a day. */
const formatDateTime = (date: dayjs.Dayjs, locale?: string): string =>
  `${DateTime.formatLongWithoutDay(date, locale)}, ${date.format('HH:mm')}`;

/**
 * The cancellation timeline shown on the checkout sidebar, the booking
 * conditions modal and My Bookings. Its first milestone is always the free
 * window (audit 29.9.2026, R04: the checkout used to print "Cancellation fee
 * is 100% if you cancel after <today>" for a charter within 44 days, beside a
 * boat page promising 72 hours of free cancellation). The fee legs start
 * where the free window closes and follow the offer's schedule: 50 % up to
 * 44 days before pick-up, 100 % from then on.
 */
export const generateCancellationTimeline = (
  dateFrom: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t?: (key: any, values?: any) => string,
  locale?: string,
  freeUntil?: string | null,
  bookedAt?: string | null
): CancellationTimelineItem[] => {
  const today = dayjs();
  const reservationStartDate = dayjs(dateFrom);
  const booked = bookedAt && dayjs(bookedAt).isValid() ? dayjs(bookedAt) : today;
  const windowEnd = freeCancellationEnd(freeUntil, bookedAt);
  // The window never outlasts the charter itself (a last-minute booking).
  const freeWindowEnd = windowEnd.isAfter(reservationStartDate) ? reservationStartDate : windowEnd;
  const freeWindowEndText = formatDateTime(freeWindowEnd, locale);
  const isPartnerWindow = !!freeUntil && dayjs(freeUntil).isValid();
  const daysUntilReservation = DateTime.daysBetween(today, reservationStartDate);
  const timeline: CancellationTimelineItem[] = [];

  const label = (date: dayjs.Dayjs) => DateTime.formatWithMonthName(date, locale);

  let freeText: string;

  if (t) {
    freeText = isPartnerWindow
      ? t('cancelAndRescheduleForFreeBefore', { date: freeWindowEndText })
      : t('freeCancellation72hUntil', { date: freeWindowEndText });
  } else {
    freeText = isPartnerWindow
      ? `Cancel and reschedule for free before ${freeWindowEndText}.`
      : `Free cancellation within ${FREE_CANCELLATION_HOURS} hours of booking — until ${freeWindowEndText}.`;
  }

  timeline.push({ date: label(booked), text: freeText, active: today.isSameOrAfter(booked) });

  const fee100Text = (date: string) =>
    t ? t('cancellationFee100Percent', { date }) : `Cancellation fee is 100% if you cancel after ${date}.`;
  const fee50Text = (date: string) =>
    t ? t('cancellationFee50Percent', { date }) : `Cancellation fee is 50% if you cancel after ${date}.`;

  if (freeWindowEnd.isBefore(reservationStartDate)) {
    if (daysUntilReservation <= 44) {
      timeline.push({
        date: label(freeWindowEnd),
        text: fee100Text(freeWindowEndText),
        active: today.isSameOrAfter(freeWindowEnd),
      });
    } else {
      const hundredPercentStartDate = reservationStartDate.subtract(44, 'day');

      timeline.push({
        date: label(freeWindowEnd),
        text: fee50Text(freeWindowEndText),
        active: today.isSameOrAfter(freeWindowEnd),
      });

      if (hundredPercentStartDate.isAfter(freeWindowEnd)) {
        timeline.push({
          date: label(hundredPercentStartDate),
          text: fee100Text(DateTime.formatLongWithoutDay(hundredPercentStartDate, locale)),
          active: today.isSameOrAfter(hundredPercentStartDate),
        });
      }
    }
  }

  timeline.push({
    date: label(reservationStartDate),
    text: t ? t('yachtPickup') : 'Yacht Pick-up',
    active: today.isSameOrAfter(reservationStartDate),
  });

  return timeline;
};
