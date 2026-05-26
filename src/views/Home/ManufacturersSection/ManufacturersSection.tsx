import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import type { ManufacturerCount } from '@/actions/catalogue.actions';
import colors from '@/styles/themes/colors';

import styles from './ManufacturersSection.module.scss';

interface ManufacturersSectionProps {
  manufacturers: ManufacturerCount[];
}

/**
 * "Most popular yacht manufacturers" — internal-link block placed near the
 * bottom of the home page (just above AllDestinationsSection).
 *
 * Visual gabarit matches `AllDestinationsSection`:
 *   - `<Container maxWidth="xl" disableGutters>` with the same vertical
 *     padding (42/60 desktop, 92/60 mobile)
 *   - Title is `variant="h1"` rendered as `<h2>` element, blue950 base
 *     with the emphasized half italic + 800-weight in blue500
 *   - Subtitle is `variant="body2"` in `colors.black350`
 * Mario asked for the gabarit alignment so the two trailing blocks read
 * as a matching pair instead of competing layouts.
 *
 * Each tile is a deep link into the search page filtered by `?mfid=`,
 * which:
 *   - Earns crawl budget for the brand-filtered listings (Lagoon,
 *     Bavaria, Beneteau, …) — they win on long-tail brand searches the
 *     home page itself never targets.
 *   - Concentrates internal link equity on a small number of high-value
 *     URLs instead of letting it leak across the whole catalogue.
 *   - Mirrors the equivalent section every competitor (Boataround,
 *     SamBoat, ClickAndBoat) ships — Google has come to expect it on a
 *     yacht charter home page, and its absence reads as a "thin" hub.
 *
 * Source data is fetched server-side in `app/[locale]/(root)/page.tsx`
 * via `getTopManufacturers()` and passed in here, so the rendered HTML
 * holds the names + counts on first paint and the crawler picks them up
 * without running JS.
 */
const ManufacturersSection = ({ manufacturers }: ManufacturersSectionProps) => {
  const t = useTranslations('home');
  // `home.hero.yachtsCount` is the same plural template the trust pills
  // use, so "{count} yachts" reads identically across the page.
  const tHome = t;

  if (!manufacturers.length) return null;

  return (
    <Container maxWidth="xl" component="section" disableGutters className={styles.container}>
      <Typography variant="h1" component="h2" color={colors.blue950}>
        {t('manufacturersSection.preTitle')}{' '}
        <Typography
          variant="h1"
          component="span"
          fontStyle="italic"
          fontWeight={800}
          color={colors.blue500}
          sx={{ pl: '0.1em', wordBreak: 'break-word' }}
        >
          {t('manufacturersSection.emphasizedTitle')}
        </Typography>
      </Typography>
      <Typography variant="body2" color={colors.black350}>
        {t('manufacturersSection.subtitle')}
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {manufacturers.map(m => (
          <Link
            key={m.id}
            href={`/search?mfid=${m.id}&manufacturers=${encodeURIComponent(m.name)}`}
            style={{ textDecoration: 'none' }}
          >
            <Stack
              gap={0.25}
              sx={{
                color: colors.blue500,
                fontWeight: 700,
                fontSize: 14,
                lineHeight: 1.2,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Box>{m.name}</Box>
              <Box sx={{ fontSize: 12, color: colors.black500, fontWeight: 500 }}>
                {tHome('hero.yachtsCount', { count: m.count.toLocaleString('en-US') })}
              </Box>
            </Stack>
          </Link>
        ))}
      </Box>
    </Container>
  );
};

export default ManufacturersSection;
