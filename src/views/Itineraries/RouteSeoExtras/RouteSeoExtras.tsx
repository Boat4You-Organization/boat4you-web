'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';
import { ItineraryRoute } from '@/types/itinerary.type';

interface RouteSeoExtrasProps {
  route: ItineraryRoute;
  sailingArea: string;
  itinerarySlug: string;
  /**
   * Optional click handler — when set, each Route summary row becomes
   * a button that activates the corresponding day in the map+panel
   * above and scrolls back to it. Falls back to a static SEO list when
   * not provided (server-only renders, no parent state).
   */
  onDaySelect?: (id: string) => void;
}

const StatPill = ({ kicker, value }: { kicker: string; value: string }) => (
  <Box>
    <Typography
      sx={{
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: colors.blue700,
        mb: 0.5,
        fontWeight: 600,
      }}
    >
      {kicker}
    </Typography>
    <Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 700, color: colors.blue950, lineHeight: 1.3 }}>
      {value}
    </Typography>
  </Box>
);

/**
 * SEO extras under the map surface (EY port, B4Y links) — "at a glance"
 * stats, the clickable Route summary and the "Plan this route" cards.
 * EY's did-based /catamarans and /destinations links are replaced with
 * B4Y's /search?destinations={startingPoint} hand-off (B4Y region ids
 * differ — dids are NOT carried over) + itinerary cross-links.
 */
const RouteSeoExtras = ({ route, sailingArea, itinerarySlug, onDaySelect }: RouteSeoExtrasProps) => {
  const t = useTranslations('itinerary');
  const days = route.routeDays ?? [];
  const numberOfDays = route.numberOfDays ?? days.length ?? 7;

  // Per-region "best months" copy lives in the namespace; guard the
  // lookup so unmapped slugs fall back to the generic season label. The
  // key is runtime-built so it can't satisfy next-intl's typed key union
  // — widen locally, the t.has guard is the safety net.
  const tLoose = t as unknown as ((key: string) => string) & { has: (key: string) => boolean };
  const bestMonthsKey = `extras.bestMonths.${itinerarySlug}`;
  const bestSeason = tLoose.has(bestMonthsKey) ? tLoose(bestMonthsKey) : t('extras.bestSeasonFallback');

  const planCards: Array<{ href: string; title: string; subtitle: string }> = [
    {
      href: `/search?destinations=${encodeURIComponent(route.startingPoint)}`,
      title: t('extras.browseYachtsTitle', { start: route.startingPoint }),
      subtitle: t('extras.browseYachtsSubtitle'),
    },
    {
      href: `/itineraries/${itinerarySlug}`,
      title: t('extras.allRoutesTitle', { area: sailingArea }),
      subtitle: t('extras.allRoutesSubtitle'),
    },
    {
      href: '/search',
      title: t('extras.searchAllTitle'),
      subtitle: t('extras.searchAllSubtitle'),
    },
  ];

  const cardSx = {
    display: 'block',
    textDecoration: 'none',
    backgroundColor: colors.white,
    border: `1px solid ${colors.black200}`,
    borderRadius: 2.5,
    p: { xs: 2, sm: 2.5 },
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    '&:hover': {
      borderColor: colors.blue500,
      boxShadow: '0 12px 32px -12px rgb(0 0 0 / 14%)',
    },
    '&:hover .plan-card-title': { color: colors.blue600 },
  };

  return (
    <Box component="section" sx={{ borderTop: `1px solid ${colors.black200}` }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } }}>
        <Stack gap={{ xs: 4, md: 6 }}>
          {/* Route at a glance */}
          <Box
            sx={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.black200}`,
              borderRadius: 3,
              p: { xs: 2.5, sm: 3.5 },
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: colors.blue700,
                mb: 1,
                fontWeight: 600,
              }}
            >
              {t('extras.atAGlanceKicker')}
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 19, md: 22 }, fontWeight: 700, color: colors.blue950, lineHeight: 1.3, mb: 2.5 }}
            >
              {t('extras.atAGlanceHeading')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: { xs: 2.5, sm: 3 },
              }}
            >
              <StatPill kicker={t('extras.bestSeasonLabel')} value={bestSeason} />
              <StatPill kicker={t('extras.durationLabel')} value={t('extras.durationValue', { days: numberOfDays })} />
              <StatPill kicker={t('extras.departureLabel')} value={route.startingPoint} />
              <StatPill kicker={t('extras.sailingAreaLabel')} value={sailingArea} />
            </Box>
          </Box>

          {/* Route summary */}
          <Box>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 21, md: 25 }, fontWeight: 700, color: colors.blue950, lineHeight: 1.3, mb: 1.5 }}
            >
              {t('extras.summaryHeading')}
            </Typography>
            {onDaySelect && (
              <Typography sx={{ color: colors.black600, fontSize: { xs: 13, sm: 14 }, lineHeight: 1.6, mb: 1.5 }}>
                {t('extras.summaryHint')}
              </Typography>
            )}
            <Box>
              {days.map((d, idx) => {
                const isLast = idx === days.length - 1;
                const rowSx = {
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: { xs: 1.5, sm: 2 },
                  py: 1.5,
                  width: '100%',
                  borderBottom: isLast ? 'none' : `1px solid ${colors.black200}`,
                };
                const dayLabel = (
                  <>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: 12, sm: 13 },
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        fontWeight: 700,
                        color: colors.black600,
                        minWidth: 60,
                      }}
                    >
                      {t('extras.dayLabel', { number: idx + 1 })}
                    </Typography>
                    <Typography
                      component="h3"
                      sx={{
                        fontSize: { xs: 14, sm: 15 },
                        fontWeight: 700,
                        color: colors.blue950,
                        m: 0,
                        flex: 1,
                        textAlign: 'left',
                      }}
                    >
                      {d.routeFrom} → {d.routeTo}
                    </Typography>
                  </>
                );

                if (onDaySelect) {
                  return (
                    <Box
                      key={d.id}
                      component="button"
                      type="button"
                      onClick={() => onDaySelect(d.id)}
                      sx={{
                        ...rowSx,
                        background: 'none',
                        border: 'none',
                        borderBottom: rowSx.borderBottom,
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease',
                        '&:hover': { backgroundColor: colors.black50 },
                      }}
                    >
                      {dayLabel}
                    </Box>
                  );
                }

                return (
                  <Box key={d.id} sx={rowSx}>
                    {dayLabel}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Plan this route */}
          <Box>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 19, md: 22 }, fontWeight: 700, color: colors.blue950, lineHeight: 1.3, mb: 2.5 }}
            >
              {t('extras.planHeading')}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {planCards.map(c => (
                <Box key={c.href} component={Link} href={c.href} sx={cardSx}>
                  <Typography
                    className="plan-card-title"
                    component="h3"
                    sx={{
                      fontSize: { xs: 14, sm: 15 },
                      fontWeight: 700,
                      color: colors.blue950,
                      lineHeight: 1.3,
                      m: 0,
                      transition: 'color 150ms ease',
                    }}
                  >
                    {c.title}
                  </Typography>
                  <Typography sx={{ color: colors.black600, fontSize: { xs: 12, sm: 13 }, lineHeight: 1.5, mt: 0.75 }}>
                    {c.subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default RouteSeoExtras;
