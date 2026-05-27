/* eslint-disable @typescript-eslint/no-use-before-define */
import dayjs, { Dayjs } from 'dayjs';

export interface PaymentPhase {
  deadline: Dayjs;
  amount: number;
}

/**
 * Client-side mirror of `ReservationPaymentPhasesService.calculatePaymentPhases`
 * on the backend. Rules (owned by the charter team):
 *
 *   A) Charter within 2 months → 100% now.
 *   B) Charter later the SAME year (≥ 2 months out) → 50% now + 50% one month
 *      before charter.
 *   C) Charter in NEXT year (or later) → 25% now + 25% on January 15th of the
 *      charter year + 50% one month before charter.
 *
 *   Fallback to 50/50 if the Jan-15 instalment would collide with (or fall
 *   after) the "one month before charter" date — happens when the charter is
 *   in early January/February of next year.
 *
 * Rounding mirrors backend: second decimal, ROUND_UP for the raw splits; the
 * final bucket absorbs the rounding delta so the phases always sum to total.
 */
export const calculatePaymentPhases = (
  reservationStartDate: string | Dayjs,
  totalPrice: number,
  now: Dayjs = dayjs()
): PaymentPhase[] => {
  const charterDate = dayjs(reservationStartDate);

  if (!charterDate.isValid() || !Number.isFinite(totalPrice) || totalPrice <= 0) {
    return [];
  }

  const roundUp = (value: number) => Math.ceil(value * 100) / 100;
  const roundedTotal = roundUp(totalPrice);

  const monthBeforeCharter = charterDate.subtract(1, 'month').startOf('day');
  const today = now.startOf('day');
  const twoMonthsFromToday = today.add(2, 'month');

  // Rule A — charter within 2 months
  if (!charterDate.isAfter(twoMonthsFromToday)) {
    return [{ deadline: today, amount: roundedTotal }];
  }

  const isNextYearOrLater = charterDate.year() > today.year();

  if (isNextYearOrLater) {
    const januaryDeadline = dayjs(`${charterDate.year()}-01-15`).startOf('day');

    // Jan-15 must strictly precede "month before charter" AND come after today.
    if (januaryDeadline.isAfter(monthBeforeCharter) || januaryDeadline.isBefore(today)) {
      return fiftyFiftySplit(today, monthBeforeCharter, roundedTotal);
    }

    const quarter = roundUp(0.25 * totalPrice);
    const half = roundUp(roundedTotal - 2 * quarter);

    return [
      { deadline: today, amount: quarter },
      { deadline: januaryDeadline, amount: quarter },
      { deadline: monthBeforeCharter, amount: half },
    ];
  }

  // Rule B — charter later this same year
  return fiftyFiftySplit(today, monthBeforeCharter, roundedTotal);
};

const fiftyFiftySplit = (now: Dayjs, monthBeforeCharter: Dayjs, roundedTotal: number): PaymentPhase[] => {
  const half = Math.ceil(0.5 * roundedTotal * 100) / 100;

  return [
    { deadline: now, amount: half },
    { deadline: monthBeforeCharter, amount: Math.ceil((roundedTotal - half) * 100) / 100 },
  ];
};
