import type { Fmt } from '@/utils/static/yachtCapacity';

/**
 * next-intl's `t` for the `capacity` namespace as the formatter's `Fmt`
 * (yachtCapacity.ts builds the keys at run time: 'label.cabins',
 * `sail.${kind}`, so the typed `t` is called through this one cast).
 */
export const capacityFmt =
  (t: unknown): Fmt =>
  (key, values) =>
    (t as Fmt)(key, values);
