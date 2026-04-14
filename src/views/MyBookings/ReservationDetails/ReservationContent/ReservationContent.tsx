import { Box } from '@mui/material';

import { ReservationDetails } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';

import styles from './ReservationContent.module.scss';
import ReservationHeroSection from './ReservationHeroSection';
import ReservationInfoSection from './ReservationInfoSection';

interface ReservationContentProps {
  reservationDetails: ReservationDetails;
  userCurrency: Currency;
}

const ReservationContent = ({ reservationDetails, userCurrency }: ReservationContentProps) => (
  <Box className={styles.container}>
    <ReservationHeroSection reservationDetails={reservationDetails} />
    <ReservationInfoSection reservationDetails={reservationDetails} userCurrency={userCurrency} />
  </Box>
);

export default ReservationContent;
