import { Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import CounterNumber from '@/components/CounterNumber/CounterNumber';
import { stats } from '@/config/stats.config';
import colors from '@/styles/themes/colors';

const Br = () => <br />;

interface StatsSectionProps {
  /** Live catalogue counts (siteStats.ts `display`); the config values stay for the rest. */
  catalogue?: { boats: number; countries: number } | null;
}

const StatsSection = ({ catalogue }: StatsSectionProps) => {
  const t = useTranslations('about.stats');
  // Fleet and destination counters come from the one count source (the
  // backend catalogue), not from the static config (23,982 / 100 there).
  const liveValue = (description: string): number | null => {
    if (!catalogue) return null;

    if (description === 'premiumYachtsFleet') return catalogue.boats;

    return description === 'worldwideDestinations' ? catalogue.countries : null;
  };

  return (
    <Container component="section" maxWidth="xl" disableGutters>
      <Stack maxWidth="1064px" marginInline="auto" pt={20.5}>
        <Grid container spacing={{ xs: 10.5, lg: 16 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack direction="column" spacing={2}>
              <Typography component="h2" variant="h4" fontWeight={800} fontStyle="italic" color={colors.blue500}>
                {t('title')}
              </Typography>
              <Typography
                variant="h2"
                component="h3"
                fontWeight={500}
                color={colors.blue950}
                sx={{ typography: { xs: 'h3', sm: 'h2' }, fontWeight: '500 !important' }}
              >
                {t.rich('description', { br: Br })}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container columnSpacing={{ xs: 2, lg: 16 }} rowSpacing={8}>
              {stats.map(({ title, description }, index) => (
                <Grid size={{ xs: 6 }} key={description}>
                  <CounterNumber target={liveValue(description) ?? title} index={index} />
                  <Typography variant="body1" color={colors.black500}>
                    {t(description)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default StatsSection;
