import { ReactNode } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import { pillSx } from '@/components/ExploreBoatsLinks/ExploreBoatsLinks';
import colors from '@/styles/themes/colors';
import { localePrefix } from '@/utils/server/catalogueHubs';
import { LandingLink, LandingNav } from '@/utils/server/landingNav';
import { yachtsIndexPath } from '@/utils/static/yachtModelKey';

/**
 * Compact link rows under a destination landing's listing (server-rendered
 * plain anchors, the "Explore boats" pill style): boat types in this place,
 * popular model pages here (+ the /yachts index, linked by its H1) and
 * sailing itineraries.
 * Every link is a page that returns 200 + index (landingNav.ts). A row
 * without links is left out; no rows → nothing.
 */

interface LandingLinksProps {
  nav: LandingNav;
  locale: string;
}

const Row = ({ title, links, after }: { title: string; links: LandingLink[]; after?: ReactNode }) => (
  <Box component="section" sx={{ mt: 3 }}>
    <Typography component="h2" variant="h4" fontWeight={700} color={colors.blue950} sx={{ fontSize: 16 }}>
      {title}
    </Typography>
    <Stack
      component="ul"
      direction="row"
      flexWrap="wrap"
      useFlexGap
      spacing={1}
      sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0 }}
    >
      {links.map(link => (
        <li key={link.href}>
          <Box component="a" href={link.href} sx={pillSx}>
            {link.label}
          </Box>
        </li>
      ))}
    </Stack>
    {after}
  </Box>
);

const LandingLinks = async ({ nav, locale }: LandingLinksProps) => {
  if (!nav.types.length && !nav.models.length && !nav.itineraries.length) return null;

  const [t, tModels] = await Promise.all([
    getTranslations({ locale, namespace: 'catalogueLinks' }),
    getTranslations({ locale, namespace: 'models' }),
  ]);

  return (
    <Box sx={{ mt: 4 }}>
      {nav.types.length > 0 && <Row title={t('landing.boatTypesIn', { where: nav.placeWhere })} links={nav.types} />}
      {nav.models.length > 0 && (
        <Row
          title={t('landing.popularModelsIn', { where: nav.placeWhere })}
          links={nav.models}
          after={
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              <Box
                component="a"
                href={`${localePrefix(locale)}${yachtsIndexPath()}`}
                sx={{
                  color: colors.blue500,
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {tModels('index.h1')} →
              </Box>
            </Typography>
          }
        />
      )}
      {nav.itineraries.length > 0 && <Row title={t('landing.itineraries')} links={nav.itineraries} />}
    </Box>
  );
};

export default LandingLinks;
