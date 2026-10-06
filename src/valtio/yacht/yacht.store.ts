import dayjs, { Dayjs } from 'dayjs';
import { proxy, useSnapshot } from 'valtio';

import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModelShortInfo } from '@/models/yacht.model';

interface YachtStore {
  activeDate: Dayjs;
  selectedExtrasKeys: string[];
  calculatedPrice: PriceCalcDto | null;
  selectedYachtIds: number[];
  isCalculatingPrice: boolean;
  boatInquiryModalOpen: boolean;
  adminInquiryModalOpen: boolean;
  searchResults: YachtModelShortInfo[];
  /** Total candidate-set size for the current search (full count
   *  across all pages, not just the page currently in `searchResults`).
   *  Drives the V2 sidebar "live boats available" pill. Updated by the
   *  results loader on every fetch — see setSearchTotalCount. */
  searchTotalCount: number;
  selectedOffer: YachtOfferModel | null;
  offersToDisplay: YachtOfferModel[];
  /** `priceSettledKey` of the boat + offer whose price is known: the
   *  calculation finished or failed, or the dates have no offer. Until then a
   *  dated boat page reads "Checking availability…", never "not available"
   *  (that was in the server HTML and through hydration, re-audit 2.10.2026). */
  priceSettledFor: string | null;
}

export const yachtStore = proxy<YachtStore>({
  activeDate: dayjs(),
  selectedExtrasKeys: [],
  selectedOffer: null,
  offersToDisplay: [],
  calculatedPrice: null,
  selectedYachtIds: [],
  isCalculatingPrice: false,
  boatInquiryModalOpen: false,
  adminInquiryModalOpen: false,
  searchResults: [],
  searchTotalCount: 0,
  priceSettledFor: null,
});

/** Key of a settled price: the boat and its selected offer ("none" = no offer for the dates). */
export const priceSettledKey = (yachtSlug: string, offerId?: number | null): string =>
  `${yachtSlug}|${offerId ?? 'none'}`;

export const useYachtStore = () => useSnapshot(yachtStore) as YachtStore;
