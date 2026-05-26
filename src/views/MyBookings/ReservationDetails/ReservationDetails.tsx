'use client';

import { Container, Stack } from '@mui/material';

import ReservationCTA from '@/components/ReservationCTA';
import { ReservationDetails as ReservationDetailsType } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import { togglePayNowModal } from '@/valtio/reservation/reservation.actions';
import { useReservationStore } from '@/valtio/reservation/reservation.store';
import PayNowModal from '@/views/MyBookings/partials/PayNowModal';

import ReservationContent from './ReservationContent';
import styles from './ReservationDetails.module.scss';
import ReservationDetailsHeader from './ReservationDetailsHeader';

interface ReservationDetailsProps {
  reservationDetails: ReservationDetailsType;
  userCurrency: Currency;
}

const ReservationDetails = ({ reservationDetails, userCurrency }: ReservationDetailsProps) => {
  const { payNowModalOpen } = useReservationStore();

  const { reservationId, reservationNumber, paymentPhases, dateFrom } = reservationDetails;

  return (
    <>
      <PayNowModal
        isOpen={payNowModalOpen}
        onOpen={togglePayNowModal}
        onClose={togglePayNowModal}
        reservationId={reservationId}
        reservationNumber={reservationNumber}
        paymentPhases={paymentPhases}
        dateFrom={dateFrom}
      />
      <Container maxWidth="xl" disableGutters classes={{ root: styles.root }} className={styles.container}>
        <ReservationDetailsHeader />
        <Stack className={styles.content}>
          <ReservationContent reservationDetails={reservationDetails} userCurrency={userCurrency} />
          <ReservationCTA reservationDetails={reservationDetails} />
        </Stack>
      </Container>
    </>
  );
};

export default ReservationDetails;
