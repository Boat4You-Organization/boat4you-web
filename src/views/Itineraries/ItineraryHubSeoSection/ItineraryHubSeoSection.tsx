'use client';

import { ReactNode, useState } from 'react';

import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';

// Stable rich-text tag handlers shared across the long-form SEO copy.
const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;
const inlineLink = (href: string) => (chunks: ReactNode) => (
  <Link href={href} style={{ color: colors.blue600, textDecorationLine: 'underline', textUnderlineOffset: 2 }}>
    {chunks}
  </Link>
);

const SectionH2 = ({ children }: { children: ReactNode }) => (
  <Typography
    component="h2"
    sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.15, pt: 5, pb: 1.5 }}
  >
    {children}
  </Typography>
);

const SectionH3 = ({ children }: { children: ReactNode }) => (
  <Typography
    component="h3"
    sx={{ fontSize: { xs: 17, md: 19 }, fontWeight: 700, color: colors.blue950, lineHeight: 1.2, pt: 3, pb: 0.5 }}
  >
    {children}
  </Typography>
);

const Para = ({ children }: { children: ReactNode }) => (
  <Typography sx={{ color: colors.black700, fontSize: { xs: 14.5, md: 15.5 }, lineHeight: 1.7, pb: 1.5 }}>
    {children}
  </Typography>
);

/**
 * Long-form SEO block for the /itineraries hub — B4Y-authored copy (NOT
 * copied from the sister sites), collapse logic ported from EY's
 * ItineraryHubSeoSection. Intro paragraphs are always in the DOM; the
 * per-region guide expands on demand but is server-rendered either way.
 */
const ItineraryHubSeoSection = () => {
  const t = useTranslations('itinerary');
  const [expanded, setExpanded] = useState(false);

  const toggleSx = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    color: colors.blue700,
    fontWeight: 700,
    fontSize: { xs: 14, md: 15 },
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    p: 0,
    '&:hover': { color: colors.blue500 },
  };

  return (
    <Container component="section" maxWidth="md" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 8 } }}>
      <SectionH2>{t('indexSeo.h2Choose')}</SectionH2>
      <Para>{t.rich('indexSeo.introPara1', { strong })}</Para>
      <Para>{t.rich('indexSeo.introPara2', { strong })}</Para>

      {!expanded && (
        <Box sx={{ pt: 2 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            aria-controls="itinerary-hub-seo-content"
            sx={toggleSx}
          >
            {t('indexSeo.readFullGuide')}
            <span aria-hidden="true">↓</span>
          </Box>
        </Box>
      )}

      <Box id="itinerary-hub-seo-content" hidden={!expanded}>
        <SectionH3>{t('indexSeo.h3Croatia')}</SectionH3>
        <Para>
          {t.rich('indexSeo.croatiaBody', { strong, croatiaLink: inlineLink('/search?destinations=Croatia') })}
        </Para>

        <SectionH3>{t('indexSeo.h3Greece')}</SectionH3>
        <Para>{t.rich('indexSeo.greeceBody', { strong, greeceLink: inlineLink('/search?destinations=Greece') })}</Para>

        <SectionH3>{t('indexSeo.h3Italy')}</SectionH3>
        <Para>{t.rich('indexSeo.italyBody', { strong, italyLink: inlineLink('/search?destinations=Italy') })}</Para>

        <SectionH3>{t('indexSeo.h3Spain')}</SectionH3>
        <Para>{t.rich('indexSeo.spainBody', { strong, spainLink: inlineLink('/search?destinations=Spain') })}</Para>

        <SectionH3>{t('indexSeo.h3Turkey')}</SectionH3>
        <Para>{t.rich('indexSeo.turkeyBody', { strong, turkeyLink: inlineLink('/search?destinations=Turkey') })}</Para>

        <SectionH3>{t('indexSeo.h3Caribbean')}</SectionH3>
        <Para>{t.rich('indexSeo.caribbeanBody', { strong, caribbeanLink: inlineLink('/itineraries/bvi') })}</Para>

        <SectionH2>{t('indexSeo.h2Quick')}</SectionH2>
        <Para>{t.rich('indexSeo.quickFirstTime', { strong })}</Para>
        <Para>{t.rich('indexSeo.quickPhotogenic', { strong })}</Para>
        <Para>{t.rich('indexSeo.quickTwoWeeks', { strong })}</Para>
        <Para>{t.rich('indexSeo.quickFood', { strong })}</Para>
        <Para>{t.rich('indexSeo.quickCrewed', { strong })}</Para>
        <Para>{t.rich('indexSeo.stillUnsure', { searchLink: inlineLink('/search') })}</Para>

        <Box sx={{ pt: 2 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setExpanded(false)}
            aria-expanded
            aria-controls="itinerary-hub-seo-content"
            sx={toggleSx}
          >
            {t('indexSeo.showLess')}
            <span aria-hidden="true">↑</span>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ItineraryHubSeoSection;
