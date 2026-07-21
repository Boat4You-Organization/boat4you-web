import { Box } from '@mui/material';
import dayjs from 'dayjs';

import SuggestedItineraries from '@/components/SuggestedItineraries';
import { ReservationDetails } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';

import styles from './ReservationContent.module.scss';
import ReservationHeroSection from './ReservationHeroSection';
import ReservationInfoSection from './ReservationInfoSection';
import TravelDocumentsBar from './TravelDocumentsBar';

interface ReservationContentProps {
  reservationDetails: ReservationDetails;
  userCurrency: Currency;
}

const ReservationContent = ({ reservationDetails, userCurrency }: ReservationContentProps) => {
  const { dateFrom, dateTo, locationFrom, locationFromCountryCode } = reservationDetails;

  // Charter length in nights steers the route suggestions (12+ nights
  // floats the 14-day routes first — see suggestedRoutesForArea).
  const nights = Math.max(0, dayjs(dateTo).diff(dayjs(dateFrom), 'day'));

  return (
    <Box className={styles.container}>
      <ReservationHeroSection reservationDetails={reservationDetails} />
      {/* Travel documents directly under the images — first thing the customer
          sees (Mario 3.7.2026: "da se ne dogodi da nisu vidjeli"). */}
      <TravelDocumentsBar reservationDetails={reservationDetails} />
      <SuggestedItineraries
        marinaName={locationFrom}
        countryCode={locationFromCountryCode}
        nights={nights}
        variant="compact"
      />
      <ReservationInfoSection reservationDetails={reservationDetails} userCurrency={userCurrency} />
    </Box>
  );
};

export default ReservationContent;
