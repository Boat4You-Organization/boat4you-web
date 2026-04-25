import { useCallback } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { YachtModel } from '@/models/yacht.model';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { clearDataFromLocalStorage, saveDataToLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface UseReservationProps {
  yacht: YachtModel;
}

export const useReservation = ({ yacht }: UseReservationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedExtrasKeys, selectedOffer, calculatedPrice } = useYachtStore();

  const { name: yachtName, model, yachtImages, slug, agency, charterType, vesselType, buildYear, maxPersons, berths, cabins, securityDeposit } = yacht;
  const { locationFrom } = selectedOffer ?? {};
  const mainImage = yachtImages.find(image => image.mainImage);

  const handleReservation = useCallback(
    (customOfferId?: number) => {
      // Guest checkout: no login gate here. The /enter-your-details page accepts
      // anonymous users and the backend has a /public/reservations endpoint that
      // creates-or-finds the user by email at submit time. Logged-in users still
      // go through the same flow with their data pre-filled.
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
        checkin: yacht.defaultCheckin || selectedOffer?.checkin || null,
        checkout: yacht.defaultCheckout || selectedOffer?.checkout || null,
        vesselType,
        buildYear,
        maxPersons,
        berths,
        cabins,
        yachtImages,
        securityDeposit,
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
