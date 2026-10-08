import type { YachtModel } from '@/models/yacht.model';

/**
 * The one place a boat page decides it is inquiry-only: the backend says the
 * boat has no bookable future offer (`hasBookableFutureOffer === false`).
 * Such a page keeps its content and inquiry form but shows no price, no
 * availability calendar and no booking button. A backend that does not send
 * the field yet (undefined / null) means bookable, as before — so the web and
 * the backend can deploy in either order. The web never works this out from
 * the offers itself.
 */
export const isInquiryOnlyBoat = (yacht?: Pick<YachtModel, 'hasBookableFutureOffer'> | null): boolean =>
  yacht?.hasBookableFutureOffer === false;

/**
 * The boat is booked by inquiry, not online: it has no bookable future offer
 * (isInquiryOnlyBoat), or its agency takes inquiries only (`inquireOnly`) —
 * the booking bar of such a boat says "Price on inquiry" and "Inquire now"
 * (offerStatusGate.ts). The page's Product JSON-LD, meta description, FAQ,
 * description call to action and weekly price summary follow this one, so
 * none of them quotes a price or promises the online checkout the bar does
 * not offer (live check 7.10.2026: Yvonne 3664 published an InStock offer and
 * "complete the secure online checkout"). The calendar keeps
 * isInquiryOnlyBoat: an inquiry-only agency's boat still shows its dates.
 */
export const isBookedByInquiry = (
  yacht?: (Pick<YachtModel, 'hasBookableFutureOffer'> & Partial<Pick<YachtModel, 'inquireOnly'>>) | null
): boolean => isInquiryOnlyBoat(yacht) || yacht?.inquireOnly === true;
