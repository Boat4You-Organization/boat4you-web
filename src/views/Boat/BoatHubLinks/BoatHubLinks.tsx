import { Box, Container, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import colors from '@/styles/themes/colors';
import { BoatHubs, localePrefix } from '@/utils/server/catalogueHubs';

/**
 * Boat page → destination hubs (server-rendered, plain anchors):
 *   - a visible breadcrumb Home › Country › Region/Base › Type › Boat, each
 *     crumb linked only when its landing passes the index gate (plain text
 *     otherwise) — the BreadcrumbList JSON-LD uses the same URLs;
 *   - "More {type} in {area} ({N})" → the area × type (or country × type)
 *     landing.
 * Placed between the content and the similar-boats strip so the hero keeps
 * its design; it is in the SSR HTML, so nothing shifts on hydration.
 */

interface BoatHubLinksProps {
  hubs: BoatHubs;
  boatName: string;
  locale: string;
}

const linkSx = {
  color: colors.blue500,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

const BoatHubLinks = async ({ hubs, boatName, locale }: BoatHubLinksProps) => {
  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });
  const { country, area, typeHub, typeLabel } = hubs;
  const crumbs: Array<{ label: string; href: string | null }> = [
    { label: t('breadcrumb.home'), href: localePrefix(locale) || '/' },
    ...(country ? [{ label: country.label, href: country.href }] : []),
    ...(area ? [{ label: area.label, href: area.href }] : []),
    ...(typeLabel ? [{ label: typeLabel, href: typeHub?.href ?? null }] : []),
  ];

  return (
    <Container maxWidth="xl" component="section" sx={{ pt: { xs: 3, sm: 5 } }}>
      <Box component="nav" aria-label={t('breadcrumb.ariaLabel')}>
        <Box
          component="ol"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 0.75,
            listStyle: 'none',
            m: 0,
            p: 0,
            typography: 'body2',
            color: colors.black500,
          }}
        >
          {crumbs.map(crumb => (
            <Box
              component="li"
              key={`${crumb.label}|${crumb.href ?? ''}`}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
            >
              {crumb.href ? (
                <Box component="a" href={crumb.href} sx={linkSx}>
                  {crumb.label}
                </Box>
              ) : (
                <span>{crumb.label}</span>
              )}
              <span aria-hidden="true">›</span>
            </Box>
          ))}
          <Box component="li" aria-current="page" sx={{ color: colors.black950, overflowWrap: 'anywhere' }}>
            {boatName}
          </Box>
        </Box>
      </Box>
      {typeHub?.href && typeHub.boatType && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          <Box component="a" href={typeHub.href} sx={{ ...linkSx, fontWeight: 600 }}>
            {t('moreOfType', { type: typeHub.boatType, area: typeHub.label, count: typeHub.fleet })} →
          </Box>
        </Typography>
      )}
    </Container>
  );
};

export default BoatHubLinks;
