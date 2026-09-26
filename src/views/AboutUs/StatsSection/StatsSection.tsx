import { Container, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import CounterNumber from '@/components/CounterNumber/CounterNumber';
import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT } from '@/config/tripadvisor';
import colors from '@/styles/themes/colors';

const Br = () => <br />;

interface StatsSectionProps {
  /** Live catalogue counts (siteStats.ts `display`). */
  catalogue?: { boats: number; countries: number; marinas: number } | null;
}

interface StatItem {
  key: string;
  target: number;
  suffix: string;
  decimals?: number;
  label: string;
}

const StatsSection = ({ catalogue }: StatsSectionProps) => {
  const t = useTranslations('about.stats');
  const tCommon = useTranslations('common');
  // Every counter has a source (audit B32/B34, 26.9.2026): the catalogue
  // counts from the one count source (siteStats.ts — home hero, checkout,
  // llms.txt read the same) and the TripAdvisor rating the footer links. The
  // static config ("23,982 yachts", "100 destinations", "10,000+ happy
  // customers", "500+ partners", "50+ years") had none and is gone.
  const items: StatItem[] = [
    ...(catalogue
      ? [
          { key: 'boats', target: catalogue.boats, suffix: '+', label: t('premiumYachtsFleet') },
          { key: 'countries', target: catalogue.countries, suffix: '', label: t('worldwideDestinations') },
          { key: 'marinas', target: catalogue.marinas, suffix: '+', label: t('marinas') },
        ]
      : []),
    {
      key: 'tripadvisor',
      target: Number(TRIPADVISOR_RATING),
      suffix: '★',
      decimals: 1,
      label: tCommon('tripadvisorReviews', { count: Number(TRIPADVISOR_REVIEW_COUNT) }),
    },
  ];

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
              {items.map(item => (
                <Grid size={{ xs: 6 }} key={item.key}>
                  <CounterNumber target={item.target} suffix={item.suffix} decimals={item.decimals} />
                  <Typography variant="body1" color={colors.black500}>
                    {item.label}
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
