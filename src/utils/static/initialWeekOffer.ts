import type { YachtOfferModel } from '@/models/yacht-offer.model';
import type { YachtModel } from '@/models/yacht.model';
import { isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';

/**
 * The week a dated boat link names, when the boat has it: the page prices it
 * on the server, so the booking box and the phone bar carry the week's price
 * in the server HTML (it appeared only after hydration — readers without
 * JavaScript saw no price for the week, 25.10.2026). With dates the detail
 * API sends only that period's offers; the browser selects the first one
 * (BoatContentSection), so this is that one, and only when it is exactly
 * the period in the link. No dates, other dates or an inquiry-only boat: null,
 * and the browser decides as before.
 */
export const initialWeekOffer = (
  yacht: Pick<YachtModel, 'hasBookableFutureOffer' | 'offers'> | null | undefined,
  startDate?: string | null,
  endDate?: string | null
): YachtOfferModel | null => {
  const offer = Array.isArray(yacht?.offers) ? yacht.offers[0] : undefined;

  if (!offer || !startDate || !endDate || isInquiryOnlyBoat(yacht)) return null;

  return offer.dateFrom?.slice(0, 10) === startDate && offer.dateTo?.slice(0, 10) === endDate ? offer : null;
};
