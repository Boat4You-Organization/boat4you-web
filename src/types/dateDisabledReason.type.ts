import { Messages } from 'next-intl';

export type DateDisableReason =
  | 'none'
  | 'past'
  | 'unavailable'
  | 'min_constraint'
  | 'max_constraint'
  | 'blocked_by_unavailable';

type TooltipMessagesKey = keyof Messages['common']['tooltip'];

export const TOOLTIP_TRANSLATION_KEYS: Record<DateDisableReason, `common.tooltip.${TooltipMessagesKey}` | null> = {
  none: null,
  past: 'common.tooltip.pastDate',
  unavailable: 'common.tooltip.unavailable',
  min_constraint: 'common.tooltip.minConstraint',
  max_constraint: 'common.tooltip.maxConstraint',
  blocked_by_unavailable: 'common.tooltip.blockedByUnavailable',
} as const;
