/**
 * Review link token: 32 random bytes as URL-safe base64 (43 characters,
 * backend ReviewTokens). Anything else is rejected before it reaches the
 * API, so a crafted path segment never becomes part of a backend URL.
 */
export const isReviewToken = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{20,128}$/.test(value);
