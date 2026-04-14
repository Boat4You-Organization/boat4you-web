import { useCallback } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { YachtModel } from '@/models/yacht.model';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { clearDataFromLocalStorage, saveDataToLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { toggleLoginModal } from '@/valtio/auth/auth.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import { useAuth } from './useAuth';

interface UseReservationProps {
  yacht: YachtModel;
}

export const useReservation = ({ yacht }: UseReservationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { selectedExtrasKeys, selectedOffer, calculatedPrice } = useYachtStore();

  const { name: yachtName, model, yachtImages, slug, agency, charterType } = yacht;
  const { locationFrom } = selectedOffer ?? {};
  const mainImage = yachtImages.find(image => image.mainImage);

  const handleReservation = useCallback(
    (customOfferId?: number) => {
      if (!isAuthenticated) {
        toggleLoginModal();

        return;
      }

      if (!calculatedPrice && !customOfferId) {
        return;
      }

      clearDataFromLocalStorage('yachtReservation');
      clearDataFromSessionStorage('reservationId');
      clearDataFromSessionStorage('activeStep');
      clearDataFromSessionStorage('selectedPaymentMethod');
      clearDataFromSessionStorage('selectedInstallment');

      const query = searchParams.toString();

      const offerId = customOfferId || calculatedPrice?.offerId;

      const reservationData: ReservationData = {
        name: yachtName,
        agencyName: agency?.name,
        locationFrom: locationFrom ?? { id: '', name: '', countryCode: '' },
        mainImage: mainImage ?? yachtImages[0],
        model,
        dateFrom: calculatedPrice?.dateFrom ?? '',
        dateTo: calculatedPrice?.dateTo ?? '',
        extras: selectedExtrasKeys,
        pricePerDayEur: calculatedPrice?.clientPricePerDayEur ?? 0,
        pricePerDayInfo: calculatedPrice?.clientPricePerDayInfo ?? null,
        numberOfDays: calculatedPrice
          ? DateTime.daysBetween(DateTime.date(calculatedPrice.dateFrom), DateTime.date(calculatedPrice.dateTo))
          : 0,
        totalPriceEur: calculatedPrice?.totalPriceEur ?? 0,
        totalPriceInfo: calculatedPrice?.totalPriceInfo ?? null,
        offerId: offerId ?? 0,
        yachtId: calculatedPrice?.yachtId ?? 0,
        selectedExtrasInPrice: calculatedPrice?.selectedExtrasInPrice ?? [],
        selectedExtrasAtBase: calculatedPrice?.selectedExtrasAtBase ?? [],
        charterType,
        savedAt: new Date().toISOString(),
      };

      try {
        saveDataToLocalStorage('yachtReservation', reservationData);
        router.push(`/enter-your-details/${slug}?${query}`);
        window.scrollTo(0, 0);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to save reservation data to localStorage:', error);
      }
    },
    [
      isAuthenticated,
      calculatedPrice,
      yachtName,
      locationFrom,
      mainImage,
      yachtImages,
      model,
      selectedExtrasKeys,
      slug,
      router,
      searchParams,
      agency,
      charterType,
    ]
  );

  return { handleReservation };
};
