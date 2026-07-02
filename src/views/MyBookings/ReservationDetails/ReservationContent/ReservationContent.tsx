import { Box } from '@mui/material';

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

const ReservationContent = ({ reservationDetails, userCurrency }: ReservationContentProps) => (
  <Box className={styles.container}>
    <ReservationHeroSection reservationDetails={reservationDetails} />
    {/* Travel documents directly under the images — first thing the customer
        sees (Mario 3.7.2026: "da se ne dogodi da nisu vidjeli"). */}
    <TravelDocumentsBar reservationDetails={reservationDetails} />
    <ReservationInfoSection reservationDetails={reservationDetails} userCurrency={userCurrency} />
  </Box>
);

export default ReservationContent;
