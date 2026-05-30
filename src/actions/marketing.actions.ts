'use server';

/**
 * One-click email unsubscribe (audit B2). Hits the public backend endpoint
 * that flips `marketing_opt_out = true` for the user owning the token, so the
 * birthday cron skips them. Runs on the Next server (no CORS), and the backend
 * is idempotent + enumeration-safe, so we only surface a coarse success flag.
 */
export async function unsubscribeFromEmails(token: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/users/unsubscribe/${encodeURIComponent(token)}`,
      { method: 'POST', cache: 'no-store' }
    );

    return { success: response.ok };
  } catch (error) {
    return { success: false };
  }
}
