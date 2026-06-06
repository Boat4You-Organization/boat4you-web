import { Status } from '@/models/yacht-offer.model';

/**
 * Single source of truth for the reserve-vs-inquiry-vs-blocked decision used by
 * every yacht-detail booking surface (desktop calendar, mobile bottom bar).
 *
 * Honest 4-state status from the backend (Deploy 4):
 *   FREE        → customer can reserve directly
 *   OPTION      → live partner option — visible + selectable, but inquiry-only
 *   RESERVATION → partner reservation — hard-blocked (not selectable, no inquiry)
 *   SERVICE     → maintenance / owner block — hard-blocked
 *   UNAVAILABLE → legacy fallback — hard-blocked
 */

/** Customer can reserve directly. */
export const isReservable = (s?: Status | null): boolean => s === Status.FREE;

/** Visible + selectable, but inquiry-only (live option). */
export const isOptionInquiry = (s?: Status | null): boolean => s === Status.OPTION;

/** Hard-blocked: not selectable, no inquiry (reservation / service / legacy). */
export const isHardBlocked = (s?: Status | null): boolean =>
  s === Status.RESERVATION || s === Status.SERVICE || s === Status.UNAVAILABLE;

export type GateMode = 'reserve' | 'inquiry' | 'blocked';

/**
 * Resolve the gate decision. The `custom` / `inquireOnly` yacht-level flags are
 * orthogonal inquiry triggers (admin-managed yacht / option-approval) that force
 * the inquiry flow even when the slot itself is FREE.
 */
export const resolveGate = (
  status: Status | null | undefined,
  opts: { custom?: boolean; inquireOnly?: boolean }
): GateMode => {
  if (isHardBlocked(status)) return 'blocked';

  if (isOptionInquiry(status) || opts.custom || opts.inquireOnly) return 'inquiry';

  return 'reserve';
};
