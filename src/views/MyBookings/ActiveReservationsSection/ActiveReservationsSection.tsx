import { Container, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import ListEmptyState from '@/components/ListEmptyState';
import { ReservationShortInfo } from '@/models/reservation.model';
import ActiveReservationCard from '@/views/MyBookings/ActiveReservationsSection/ActiveReservationCard';

import styles from './ActiveReservationsSection.module.scss';

interface ActiveReservationsSectionProps {
  reservations: ReservationShortInfo[];
}

const ActiveReservationsSection = async ({ reservations }: ActiveReservationsSectionProps) => {
  const t = await getTranslations('common');

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.dateFrom).getTime();
    const dateB = new Date(b.dateFrom).getTime();

    return dateB - dateA;
  });

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Typography component="h1" sx={{ typography: { xs: 'h2', sm: 'h1' }, fontWeight: '700 !important' }}>
        {t('reservations')}
      </Typography>
      <Stack gap={3} mt={3}>
        {sortedReservations.length === 0 ? (
          <ListEmptyState
            title={t('youHaveNoUpcomingReservations')}
            buttonConfig={{ text: t('searchBoatsNow'), href: '/search' }}
          />
        ) : (
          sortedReservations.map(reservation => (
            <ActiveReservationCard key={reservation.reservationId} reservation={reservation} />
          ))
        )}
      </Stack>
    </Container>
  );
};

export default ActiveReservationsSection;
