import { YachtModelShortInfo } from '@/models/yacht.model';

type ListingPriceFields = Pick<YachtModelShortInfo, 'clientPriceEur' | 'numberOfDays'>;

/**
 * A search without travel dates — the landings and the bare catalogue. The
 * yacht fetch then asks the API for each boat's cheapest bookable week
 * (`priceBasis=week`, see yachtFetchParams).
 */
export const isUndatedSearch = ({ startDate, endDate }: { startDate?: unknown; endDate?: unknown }): boolean =>
  !startDate && !endDate;

/** Days the card's price covers ("Price for N days"); a week when the API leaves it out. */
export const listingPriceDays = ({ numberOfDays }: Pick<ListingPriceFields, 'numberOfDays'>): number =>
  numberOfDays && numberOfDays > 0 ? numberOfDays : 7;

/**
 * Whether a listing card shows a price — shared by the card and the search
 * page's Product JSON-LD, so the markup never prices a card that reads
 * "Price on request". No price (the API has no bookable week for the boat
 * on an undated search) or a total of 0 € or less (partner sync noise: Sun
 * Odyssey 479 "Sirius" read "7 days 0 €" on the Greece landing) is not a
 * price.
 */
export const hasListingPrice = (yacht: ListingPriceFields): boolean => {
  const perDay = Number(yacht.clientPriceEur);

  return Number.isFinite(perDay) && Math.round(perDay * listingPriceDays(yacht)) > 0;
};
