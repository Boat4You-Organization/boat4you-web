import { timingSafeEqual } from 'node:crypto';
import 'server-only';

/**
 * The secret path segment of /pay/<key> (the link printed in contracts).
 * PAY_LINK_KEYS is a comma-separated, server-only list (two keys while one is
 * rotated out); it must match the backend's CUSTOM_PAYMENT_LINK_KEYS for
 * boat4you. Empty or unset = every /pay URL is a 404.
 */
export const isPayLinkKey = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value || value.length > 256) return false;

  const candidate = Buffer.from(value, 'utf8');

  // Every configured key is compared (no early exit), each in constant time.
  return (process.env.PAY_LINK_KEYS ?? '')
    .split(',')
    .map(key => Buffer.from(key.trim(), 'utf8'))
    .reduce(
      (match, expected) =>
        (expected.length > 0 && expected.length === candidate.length && timingSafeEqual(expected, candidate)) || match,
      false
    );
};
