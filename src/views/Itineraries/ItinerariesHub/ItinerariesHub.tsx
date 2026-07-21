'use client';

import { FC } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { itineraries } from '@/config/itineraries.config';
import { itineraryNamespace, resolveAreaText } from '@/helper/itineraryI18n';
import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';
import { Itinerary } from '@/types/itinerary.type';
import { staticSrcSet } from '@/utils/static/staticImageSrcSet';
import ItineraryHubSeoSection from '@/views/Itineraries/ItineraryHubSeoSection';

/**
 * `/itineraries` hub — port of EY's CCItinerary restyled with MUI (B4Y
 * carries no Tailwind). ALL content comes from `itineraries.config`
 * (country wrapper + sailingArea / image / description / routes per
 * area) verbatim; the grid iterates country groups (Croatia, Greece,
 * Türkiye, Spain, Italy + Caribbean) with a card per sailing area.
 */

// Day-count range across an area's routes; the label itself is built from
// ICU keys in the card so the "days" word is localized too.
const daysMinMax = (routes: { routeDays?: unknown[] }[]): { min: number; max: number } | null => {
  const lens = routes.map(r => r.routeDays?.length ?? 0).filter(n => n > 0);

  if (lens.length === 0) return null;

  return { min: Math.min(...lens), max: Math.max(...lens) };
};

/**
 * One hub card for a sailing area. Split into its own component so it
 * can call `useTranslations(area.i18nNamespace)` for its country's copy
 * (the hub mixes all six groups, so a single namespace at the parent
 * can't cover every card). `resolveAreaText` t.has-guards, so a card
 * whose namespace has no key falls back to the raw config description.
 */
const HubAreaCard: FC<{
  area: Itinerary;
  country: string;
  eager: boolean;
}> = ({ area, country, eager }) => {
  const tUi = useTranslations('itinerary');
  const t = useTranslations(itineraryNamespace(area));
  const routeCount = area.routes?.length ?? 0;
  const range = daysMinMax(area.routes ?? []);
  let days = '';

  if (range) {
    days = range.min === range.max ? tUi('hub.daysExact', { days: range.min }) : tUi('hub.daysRange', range);
  }

  const description = resolveAreaText(area, 'description', area.description, t) ?? '';

  return (
    <Box
      component={Link}
      href={`/itineraries/${area.id}`}
      sx={{
        display: 'block',
        height: '100%',
        textDecoration: 'none',
        backgroundColor: colors.white,
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${colors.black200}`,
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          borderColor: colors.blue500,
          boxShadow: '0 12px 32px -12px rgb(0 0 0 / 18%)',
        },
        '&:hover .hub-card-img': { transform: 'scale(1.04)' },
      }}
    >
      <Box sx={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={area.image.src}
          srcSet={staticSrcSet(area.image.src)}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          alt={area.image.alt}
          className="hub-card-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 700ms ease',
          }}
          loading={eager ? undefined : 'lazy'}
        />
        {routeCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgb(255 255 255 / 95%)',
              px: 1.5,
              py: 0.75,
              borderRadius: 99,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.blue950,
              fontWeight: 600,
            }}
          >
            {routeCount} {routeCount === 1 ? tUi('hub.routeSingular') : tUi('hub.routePlural')}
          </Box>
        )}
      </Box>
      <Stack sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography
          component="span"
          sx={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.blue700,
            fontWeight: 600,
            mb: 1,
          }}
        >
          {country}
          {days ? ` · ${days}` : ''}
        </Typography>
        <Typography component="h3" sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 700, color: colors.blue950, m: 0 }}>
          {tUi('hub.sailingAreaCardTitle', { area: area.sailingArea })}
        </Typography>
        <Typography
          sx={{
            mt: 1.5,
            color: colors.black700,
            fontSize: { xs: 13.5, sm: 14.5 },
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 2.5 }}>
          <Typography
            component="span"
            sx={{
              color: colors.blue600,
              fontSize: 12,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {tUi('hub.exploreRoutes', { area: area.sailingArea })} →
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

const ItinerariesHub: FC = () => {
  const t = useTranslations('itinerary');

  return (
    <>
      <Container maxWidth="xl" component="section" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          gap={2}
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          <Box>
            <Typography
              component="span"
              sx={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: colors.blue700,
                fontWeight: 600,
              }}
            >
              {t('hub.eyebrow')}
            </Typography>
            <Typography
              component="h2"
              sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.1, mt: 1 }}
            >
              {t('hub.title')}{' '}
              <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
                {t('hub.titleItalic')}
              </Box>
            </Typography>
            <Typography sx={{ mt: 2, color: colors.black700, maxWidth: 680, fontSize: { xs: 14.5, md: 16 } }}>
              {t('hub.lede')}
            </Typography>
          </Box>
          <Typography
            component={Link}
            href="/search"
            sx={{
              color: colors.blue700,
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {t('hub.tellUsLink')}
          </Typography>
        </Stack>

        <Stack gap={{ xs: 6, md: 9 }}>
          {itineraries.map(({ country, itinerary }, groupIdx) => (
            <Box key={country}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
                flexWrap="wrap"
                gap={1.5}
                sx={{ mb: { xs: 3, md: 4 }, pb: 2, borderBottom: `1px solid ${colors.black200}` }}
              >
                <Typography
                  component="h3"
                  sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.1, m: 0 }}
                >
                  {country}{' '}
                  <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
                    {t('hub.countryHeadingItalic')}
                  </Box>
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: colors.black600,
                    fontWeight: 600,
                  }}
                >
                  {itinerary.length} {itinerary.length === 1 ? t('hub.areaSingular') : t('hub.areaPlural')}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                  gap: { xs: 2.5, sm: 3.5 },
                }}
              >
                {itinerary.map((area, i) => (
                  <HubAreaCard key={area.id} area={area} country={country} eager={groupIdx === 0 && i === 0} />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
      <Box sx={{ borderTop: `1px solid ${colors.black200}` }}>
        <ItineraryHubSeoSection />
      </Box>
    </>
  );
};

export default ItinerariesHub;
