export type ReviewKind = 'BOOKING' | 'YACHT';

export interface ReviewValues {
  rating: number;
  scores: Record<string, number>;
  title: string | null;
  text: string | null;
  publishConsent: boolean;
  locale: string;
}

/** GET /public/reviews/request/{token} (backend ReviewFormDto). */
export interface ReviewFormContext {
  kind: ReviewKind;
  scoreKeys: string[];
  reservationNumber: string | null;
  yachtId: number | null;
  yachtFullLabel: string;
  yachtMainImageId: number | null;
  /** ISO dates (yyyy-MM-dd). */
  dateFrom: string | null;
  dateTo: string | null;
  baseName: string | null;
  baseCountry: string | null;
  customerFirstName: string | null;
  locale: string;
  linkExpiresAt: string;
  submitted: boolean;
  editable: boolean;
  editableUntil: string | null;
  review: ReviewValues | null;
}

/** Longest text the backend accepts (ReviewValidation.MAX_TEXT_LENGTH / MAX_TITLE_LENGTH). */
export const REVIEW_TEXT_MAX = 3000;
export const REVIEW_TITLE_MAX = 120;
