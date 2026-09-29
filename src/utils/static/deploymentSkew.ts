import { unstable_isUnrecognizedActionError } from 'next/navigation';

const RELOAD_MARK = 'b4y_deployment_reload';
const RELOAD_WINDOW_MS = 60_000;

/**
 * A tab opened before a deploy calls server actions the new build no longer
 * has: the server answers 404 + `x-nextjs-action-not-found` and the client
 * throws an UnrecognizedActionError (23 such failed form submits in the
 * nextapp journal on 29.9.2026, audit R62). The page just needs the new
 * build — reload it once; a second failure within a minute is a real error
 * and stays on the error page instead of looping.
 */
export const reloadForNewDeployment = (error: unknown): boolean => {
  if (typeof window === 'undefined' || !unstable_isUnrecognizedActionError(error)) return false;

  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_MARK) ?? 0);

    if (Date.now() - last < RELOAD_WINDOW_MS) return false;

    window.sessionStorage.setItem(RELOAD_MARK, String(Date.now()));
  } catch {
    // storage unavailable — reload anyway, the server will not answer 404 twice for a fresh page
  }

  window.location.reload();

  return true;
};
