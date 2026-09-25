import { Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import colors from '@/styles/themes/colors';
import { localePrefix } from '@/utils/server/catalogueHubs';
import { LandingCrumb } from '@/utils/server/landingNav';

/**
 * Small visible breadcrumb above a landing's H1 — the same crumbs as the
 * page's BreadcrumbList JSON-LD (landingCrumbs), the boat page's trail style.
 * The last crumb is the page itself (not linked).
 */
const LandingBreadcrumb = async ({ crumbs, locale }: { crumbs: LandingCrumb[]; locale: string }) => {
  if (crumbs.length < 2) return null;

  const t = await getTranslations({ locale, namespace: 'catalogueLinks' });
  const prefix = localePrefix(locale);

  return (
    <Box component="nav" aria-label={t('breadcrumb.ariaLabel')} sx={{ mb: 1 }}>
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
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;

          return (
            <Box
              component="li"
              key={crumb.path}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, overflowWrap: 'anywhere' }}
              {...(isLast ? { 'aria-current': 'page' as const } : {})}
            >
              {isLast ? (
                <Box component="span" sx={{ color: colors.black950 }}>
                  {crumb.label}
                </Box>
              ) : (
                <>
                  <Box
                    component="a"
                    href={crumb.path === '/' ? prefix || '/' : `${prefix}${crumb.path}`}
                    sx={{ color: colors.blue500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {crumb.label}
                  </Box>
                  <span aria-hidden="true">›</span>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LandingBreadcrumb;
