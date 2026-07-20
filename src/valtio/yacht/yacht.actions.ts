import { Dayjs } from 'dayjs';

import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModelShortInfo } from '@/models/yacht.model';

import { yachtStore } from './yacht.store';

export const handlePrevMonth = () => {
  yachtStore.activeDate = yachtStore.activeDate.subtract(1, 'month');
};

export const handleNextMonth = () => {
  yachtStore.activeDate = yachtStore.activeDate.add(1, 'month');
};

export const setActiveDate = (date: Dayjs) => {
  yachtStore.activeDate = date;
};

export const addExtra = (extraKey: string): string[] => {
  if (extraKey === undefined || extraKey === null) {
    return [...yachtStore.selectedExtrasKeys];
  }

  if (!yachtStore.selectedExtrasKeys.includes(extraKey)) {
    yachtStore.selectedExtrasKeys.push(extraKey);
  }

  return [...yachtStore.selectedExtrasKeys];
};

export const removeExtra = (extraKey: string): string[] => {
  if (extraKey === undefined || extraKey === null) {
    return [...yachtStore.selectedExtrasKeys];
  }

  yachtStore.selectedExtrasKeys = yachtStore.selectedExtrasKeys.filter(key => key !== extraKey);

  return [...yachtStore.selectedExtrasKeys];
};

export const setSelectedExtras = (extrasKeys: string[]) => {
  const validExtrasKeys = extrasKeys.filter(key => key !== undefined && key !== null);

  yachtStore.selectedExtrasKeys = validExtrasKeys;
};

export const setObligatoryExtras = (obligatoryExtrasKeys: string[]) => {
  const validExtrasKeys = obligatoryExtrasKeys.filter(key => key !== undefined && key !== null);

  yachtStore.selectedExtrasKeys = validExtrasKeys;
};

export const setCalculatedPrice = (price: PriceCalcDto | null) => {
  yachtStore.calculatedPrice = price;
};

export const setCalculatingPrice = (isCalculating: boolean) => {
  yachtStore.isCalculatingPrice = isCalculating;
};

export const clearSelectedExtras = () => {
  yachtStore.selectedExtrasKeys = [];
};

export const setSelectedYachtIds = (yachtIds: number[]) => {
  yachtStore.selectedYachtIds = yachtIds;
};

export const toggleYachtSelection = (yachtId: number) => {
  if (yachtStore.selectedYachtIds.includes(yachtId)) {
    yachtStore.selectedYachtIds = yachtStore.selectedYachtIds.filter(id => id !== yachtId);
  } else {
    yachtStore.selectedYachtIds = [...yachtStore.selectedYachtIds, yachtId];
  }
};

export const clearSelectedYachtIds = () => {
  yachtStore.selectedYachtIds = [];
};

export const toggleBoatInquiryModalOpen = (isOpen?: boolean | React.MouseEvent): void => {
  yachtStore.boatInquiryModalOpen = typeof isOpen === 'boolean' ? isOpen : !yachtStore.boatInquiryModalOpen;
};

export const toggleAdminInquiryModalOpen = (isOpen?: boolean | React.MouseEvent): void => {
  yachtStore.adminInquiryModalOpen = typeof isOpen === 'boolean' ? isOpen : !yachtStore.adminInquiryModalOpen;
};

export const setSearchResults = (results: YachtModelShortInfo[]) => {
  yachtStore.searchResults = results;
};

export const setSearchTotalCount = (totalCount: number) => {
  yachtStore.searchTotalCount = totalCount;
};

export const setselectedOffer = (offer: YachtOfferModel | null) => {
  yachtStore.selectedOffer = offer;
};

export const setOffersToDisplay = (offers: YachtOfferModel[]) => {
  // Belt-and-braces against duplicate offer rows (20.7.2026: the offer table
  // had 1.37M byte-identical duplicates — DB now has a unique guard, but the
  // UI must never render the same week/route twice regardless of data state).
  // Legit one-way variants survive: the key includes both route endpoints.
  const seen = new Set<string>();

  yachtStore.offersToDisplay = offers.filter(o => {
    const key = `${o.dateFrom}|${o.dateTo}|${o.status}|${o.locationFrom?.id ?? ''}|${o.locationTo?.id ?? ''}`;

    if (seen.has(key)) return false;

    seen.add(key);

    return true;
  });
};

export const resetData = () => {
  yachtStore.selectedOffer = null;
  yachtStore.calculatedPrice = null;
  yachtStore.selectedExtrasKeys = [];
  yachtStore.offersToDisplay = [];
};
