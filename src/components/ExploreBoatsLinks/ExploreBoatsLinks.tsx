import { Box, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import colors from '@/styles/themes/colors';
import { Hub, boatTypePlural } from '@/utils/server/catalogueHubs';

/**
 * "Explore boats" — server-rendered links from editorial pages (blog posts,
 * the blog index) to indexable destination landing hubs, plus the matching
 * itinerary area. Plain anchors, so crawlers read them in the SSR HTML.
 * Renders nothing without hubs.
 */

interface ExploreBoatsLinksProps {
  hubs: Hub[];
  itinerary?: { href: string; area: string } | null;
  locale: string;
  lead: 'leadPost' | 'leadIndex';
}

const pillSx = {
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
  lineHeight: 1.3,
  '&:hover': { borderColor: colors.blue500, backgroundColor: colors.blue50 },
} as const;

const ExploreBoatsLinks = async ({ hubs, itinerary, locale, lead }: ExploreBoatsLinksProps) => {
  const linked = hubs.filter(h => !!h.href);

  if (!linked.length) return null;

  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });
  const labels = await Promise.all(
    linked.map(async hub =>
      hub.boatType
        ? t('typedHubLink', { type: await boatTypePlural(locale, hub.boatType), area: hub.label, count: hub.fleet })
        : t('hubLink', { area: hub.label, count: hub.fleet })
    )
  );

  return (
    <Box component="section" aria-labelledby="explore-boats-title" sx={{ mt: { xs: 5, md: 7 } }}>
      <Typography id="explore-boats-title" component="h2" variant="h4" fontWeight={700} color={colors.blue950}>
        {t('explore.title')}
      </Typography>
      <Typography variant="body1" color={colors.black500} sx={{ mt: 1 }}>
        {t(`explore.${lead}`)}
      </Typography>
      <Stack
        component="ul"
        direction="row"
        flexWrap="wrap"
        useFlexGap
        spacing={1.5}
        sx={{ listStyle: 'none', m: 0, mt: 2.5, p: 0 }}
      >
        {linked.map((hub, i) => (
          <li key={hub.href}>
            <Box component="a" href={hub.href!} sx={pillSx}>
              {labels[i]}
            </Box>
          </li>
        ))}
      </Stack>
      {itinerary && (
        <Typography variant="body1" sx={{ mt: 2.5 }}>
          <Box
            component="a"
            href={itinerary.href}
            sx={{
              color: colors.blue500,
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('explore.itineraryLink', { area: itinerary.area })} →
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default ExploreBoatsLinks;
