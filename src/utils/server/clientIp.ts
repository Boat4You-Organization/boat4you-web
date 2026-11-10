import { headers } from 'next/headers';
import 'server-only';

/**
 * The visitor's IP for X-Forwarded-For on server-side calls to /public
 * endpoints that the backend rate-limits per client IP — without it every
 * visitor would share the web server's one budget.
 */
export const clientIp = async (): Promise<string | null> => {
  const h = await headers();
  const realIp = h.get('x-real-ip')?.trim();

  if (realIp) return realIp;

  // Last element = the address our own nginx appended.
  return h.get('x-forwarded-for')?.split(',').pop()?.trim() || null;
};
