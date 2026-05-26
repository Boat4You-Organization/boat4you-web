import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import GeneralSearchBarRoot from '@/components/GeneralSearchBarRoot';

import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  /** Trust pills shown between the H1 and search bar — "support · N yachts ·
   *  M marinas". Server-fetched in the page so the numbers render in the
   *  initial HTML and Google's crawler picks them up. Pass `null` (or omit)
   *  to hide the row entirely (e.g. when the upstream is degraded). */
  stats?: { yachts: number; marinas: number } | null;
}

const HeroSection = ({ stats }: HeroSectionProps) => {
  const t = useTranslations('home');

  // Show the trust line only when both numbers came back non-zero —
  // a partial signal ("0 yachts · 680 marinas") looks broken and erodes
  // trust faster than no signal at all.
  const showStats = !!stats && stats.yachts > 0 && stats.marinas > 0;
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <>
      <Container component="section" className={styles.container}>
        <Stack alignItems="center" gap={2}>
          <Typography variant="hero" component="h1">
            {t('hero.title')}{' '}
            <Typography
              variant="hero"
              component="span"
              fontWeight={800}
              fontStyle="italic"
              sx={{ pr: '0.08em', wordBreak: 'break-word' }}
            >
              {t('hero.ctaTitle')}
            </Typography>
          </Typography>
          {showStats && (
            <Stack
              direction="row"
              gap={{ xs: 1.5, md: 3 }}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ fontSize: { xs: 12, md: 14 }, fontWeight: 600, opacity: 0.95 }}
            >
              <TrustPill label={t('hero.support')} />
              <TrustPill label={t('hero.yachtsCount', { count: fmt(stats!.yachts) })} />
              <TrustPill label={t('hero.marinasCount', { count: fmt(stats!.marinas) })} />
            </Stack>
          )}
          <Typography variant="body1" fontWeight={500}>
            {t('hero.description')}
          </Typography>
        </Stack>
      </Container>
      <GeneralSearchBarRoot />
    </>
  );
};

/**
 * Single trust-line pill — "✓ {label}". Inline checkmark + label, scaled
 * to fit the hero typography weight. Kept private to the file because
 * it's only meaningful in this layout.
 */
const TrustPill = ({ label }: { label: string }) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, whiteSpace: 'nowrap' }}>
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1.5px solid currentColor',
        fontSize: 10,
        lineHeight: 1,
      }}
    >
      ✓
    </Box>
    {label}
  </Box>
);

export default HeroSection;
