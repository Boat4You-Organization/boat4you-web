import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import { StaticBoatListingItemCard } from '@/components/BoatListingItemCard';
import colors from '@/styles/themes/colors';
import { boatTypePlural } from '@/utils/server/catalogueHubs';
import { itineraryBoats } from '@/utils/server/itineraryBoats';

/**
 * "Boats available from {start base} (N)" — up to 12 listing cards for the
 * route's start base, a link to the base / region landing, and "Best boat
 * types for this route" → boat-type landings that pass the index gate.
 * Server-rendered into the (ISR) itinerary HTML; renders nothing when the
 * base resolves to no boats.
 */

interface ItineraryBoatsProps {
  startingPoint: string;
  /** Fallback names when the port itself has too few boats (sailing area, country). */
  fallbacks: string[];
  locale: string;
}

const linkSx = {
  color: colors.blue500,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

const ItineraryBoats = async ({ startingPoint, fallbacks, locale }: ItineraryBoatsProps) => {
  const data = await itineraryBoats(startingPoint, fallbacks, locale).catch(() => null);

  if (!data?.boats.length) return null;

  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });
  const typeLabels = await Promise.all(
    data.typeHubs.map(async hub =>
      t('typedHubLink', {
        type: await boatTypePlural(locale, hub.boatType!),
        area: hub.label,
        count: hub.fleet,
      })
    )
  );

  return (
    <Container maxWidth="xl" component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'baseline' }}
        spacing={1}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Typography component="h2" variant="h3" fontWeight={700} color={colors.blue950}>
          {t('itinerary.boatsFromBase', { base: data.baseLabel, count: data.fleet })}
        </Typography>
        <Box component="a" href={data.seeAllHref} sx={linkSx}>
          {t('itinerary.seeAllBoats', { count: data.fleet })} →
        </Box>
      </Stack>
      <Grid container spacing={3}>
        {data.boats.map(boat => (
          <Grid key={boat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ height: '100%' }}>
              <StaticBoatListingItemCard {...boat} isGridView user={null} />
            </Box>
          </Grid>
        ))}
      </Grid>
      {data.typeHubs.length > 0 && (
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <Typography component="h3" variant="h4" fontWeight={700} color={colors.blue950}>
            {t('itinerary.bestTypes')}
          </Typography>
          <Stack
            component="ul"
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1.5}
            sx={{ listStyle: 'none', m: 0, mt: 2, p: 0 }}
          >
            {data.typeHubs.map((hub, i) => (
              <li key={hub.href}>
                <Box
                  component="a"
                  href={hub.href!}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: 40,
                    px: 2,
                    py: 1,
                    border: `1px solid ${colors.black200}`,
                    borderRadius: '999px',
                    color: colors.blue950,
                    textDecoration: 'none',
                    typography: 'body2',
                    fontWeight: 600,
                    '&:hover': { borderColor: colors.blue500, backgroundColor: colors.blue50 },
                  }}
                >
                  {typeLabels[i]}
                </Box>
              </li>
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
};

export default ItineraryBoats;
