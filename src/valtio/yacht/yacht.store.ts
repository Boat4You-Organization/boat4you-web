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
  selectedOffer: YachtOfferModel | null;
  offersToDisplay: YachtOfferModel[];
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
});

export const useYachtStore = () => useSnapshot(yachtStore) as YachtStore;
