import { Container, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import ListEmptyState from '@/components/ListEmptyState';
import { ReservationShortInfo } from '@/models/reservation.model';

import PastReservationCard from './PastReservationCard';
import styles from './PastReservationsSection.module.scss';

interface PastReservationsSectionProps {
  reservations: ReservationShortInfo[];
}

const PastReservationsSection = async ({ reservations }: PastReservationsSectionProps) => {
  const t = await getTranslations('common');

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(a.dateFrom).getTime();
    const dateB = new Date(b.dateFrom).getTime();

    return dateB - dateA;
  });

  return (
    <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
      <Typography component="h1" sx={{ typography: { xs: 'h2', sm: 'h1' }, fontWeight: '700 !important' }}>
        {t('pastReservations')}
      </Typography>
      <Grid container spacing={3} mt={5}>
        {sortedReservations.length === 0 ? (
          <ListEmptyState title={t('youHaveNoPastReservations')} />
        ) : (
          sortedReservations.map((reservation, index) => (
            <Grid key={`${index + 1}`} size={{ xs: 12, md: 6 }}>
              <PastReservationCard reservation={reservation} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default PastReservationsSection;
