import type { PayloadResponse } from '@/types/response.type';

type InquiryResult = PayloadResponse<boolean>;

/** The same inquiry again within this window gets the first one's answer. */
export const INQUIRY_DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

/** A different inquiry from the same IP this soon after the last is a burst. */
export const INQUIRY_BURST_WINDOW_MS = 5 * 1000;

export interface InquiryIdentity {
  yachtId: unknown;
  dateFrom: unknown;
  dateTo: unknown;
  name: unknown;
  surname: unknown;
  email: unknown;
  phone: unknown;
  message: unknown;
}

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

const nameKey = (value: unknown): string => text(value).trim().toLowerCase();

/**
 * What makes two inquiries "the same": boat, dates, name, e-mail, phone and
 * message. A double tap or a network retry sends identical data and is
 * caught; a visitor who reopens the form to correct the phone number or the
 * name sends a new inquiry, and the correction reaches us.
 */
export const inquiryFingerprint = ({
  yachtId,
  dateFrom,
  dateTo,
  name,
  surname,
  email,
  phone,
  message,
}: InquiryIdentity): string =>
  JSON.stringify([
    Number(yachtId) || 0,
    text(dateFrom).slice(0, 10),
    text(dateTo).slice(0, 10),
    nameKey(name),
    nameKey(surname),
    text(email).trim().toLowerCase(),
    text(phone).replace(/\D/g, ''),
    text(message).replace(/\s+/g, ' ').trim(),
  ]);

/**
 * One inquiry, one e-mail (27.9.2026: an inquiry on a sister site reached the
 * owner six times in the same second). Wraps the call that forwards an
 * inquiry to the backend:
 *  - the same inquiry (fingerprint) again within 10 minutes — in flight or
 *    already sent — gets the first call's answer and is not forwarded again;
 *  - a different inquiry from the same IP within 5 seconds of the last one is
 *    turned away (`payload: false`) as an accidental burst.
 * A failed call is forgotten at once, so the visitor can simply retry.
 * In-memory: the site runs as one Node process, and a restart only forgets
 * the last few minutes.
 */
export const createInquiryGuard = (now: () => number = Date.now) => {
  const recent = new Map<string, { at: number; result: Promise<InquiryResult> }>();
  const lastByIp = new Map<string, { at: number; key: string }>();

  const prune = (time: number) => {
    recent.forEach((entry, key) => {
      if (time - entry.at >= INQUIRY_DUPLICATE_WINDOW_MS) recent.delete(key);
    });
    lastByIp.forEach((entry, ip) => {
      if (time - entry.at >= INQUIRY_BURST_WINDOW_MS) lastByIp.delete(ip);
    });
  };

  return (key: string, ip: string | null, send: () => Promise<InquiryResult>): Promise<InquiryResult> => {
    const time = now();

    prune(time);

    const same = recent.get(key);

    if (same) return same.result;

    const last = ip ? lastByIp.get(ip) : undefined;

    if (last && last.key !== key) return Promise.resolve({ payload: false });

    const entry = { at: time, result: Promise.resolve<InquiryResult>({ payload: false }) };

    entry.result = send()
      .catch((): InquiryResult => ({ payload: false }))
      .then(result => {
        if (!result.payload) {
          if (recent.get(key) === entry) recent.delete(key);

          if (ip && lastByIp.get(ip)?.key === key) lastByIp.delete(ip);
        }

        return result;
      });

    recent.set(key, entry);

    if (ip) lastByIp.set(ip, { at: time, key });

    return entry.result;
  };
};

/** The site-wide guard for the boat inquiry. */
export const guardInquiry = createInquiryGuard();
