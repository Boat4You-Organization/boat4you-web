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
