import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AssuranceBadges from '@/components/AssuranceBadges';
import CookieSettingsButton from '@/components/Footer/CookieSettingsButton';
import GoogleG from '@/components/SvgIcons/GoogleG';
import TripAdvisorRating from '@/components/TripAdvisorRating';
import colors from '@/styles/themes/colors';
import { GOOGLE_PREFERRED_SOURCE_URL } from '@/utils/static/googlePreferredSource';

import styles from './FooterBottomBar.module.scss';

const FooterBottomBar = () => {
  const t = useTranslations('common');

  return (
    <Box className={styles.footerBottomBar}>
      <Box>
        <Typography variant="body2" color={colors.black600} sx={{ whiteSpace: 'nowrap' }}>
          © {new Date().getFullYear()} boat4you. {t('allRightsReserved')}
        </Typography>
        {/* Impressum / company identity (audit C2): the legal entity behind the
            Boat4you brand, surfaced on every page. Language-neutral registration
            data (company name / address / OIB), so it isn't run through i18n. */}
        <Typography variant="caption" component="p" color={colors.black600} sx={{ mt: 0.5, opacity: 0.75 }}>
          Cusmanich d.o.o. · Vrboran 37, 21000 Split, Croatia · OIB 87394862517
        </Typography>
        {/* Agency credit (Mario 13.8.2026) — same line on every site in the
            family. Brand credit, deliberately not localized. */}
        <Typography variant="caption" component="p" color={colors.black600} sx={{ mt: 0.5, opacity: 0.75 }}>
          Made with{' '}
          <Box component="span" sx={{ color: '#e25555' }}>
            ♥
          </Box>{' '}
          by{' '}
          <a
            href="https://adriapixel.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}
          >
            AdriaPixel
          </a>
        </Typography>
        {/* Storyset free-licence attribution — REQUIRED while the promo-banner
            character illustration is live (storyset.com licence terms). */}
        <Typography variant="caption" component="p" sx={{ mt: 0.5, opacity: 0.45, fontSize: '0.62rem' }}>
          <a href="https://storyset.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            Illustrations by Storyset
          </a>
        </Typography>
        {/* Google "preferred source" deeplink — a signed-in reader can mark
            boat4you as a preferred source so our pages rank higher for them in
            Top Stories / AI Mode. An outlined pill with Google's "G" so it
            reads as an action (the plain caption link was barely visible),
            while the muted border and 12px text keep it secondary to the real
            CTAs. Plain link, no script; domain derives from
            NEXT_PUBLIC_BASE_URL at build time. */}
        <Box sx={{ mt: 1.5 }}>
          <Box
            component="a"
            href={GOOGLE_PREFERRED_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              maxWidth: '100%',
              px: 1.5,
              py: 0.75,
              borderRadius: '999px',
              border: `1px solid ${colors.black200}`,
              color: colors.black600,
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.3,
              textDecoration: 'none',
              transition: 'background-color .2s ease, border-color .2s ease',
              '&:hover': { backgroundColor: colors.blue50, borderColor: colors.blue200 },
            }}
          >
            <Box component="span" sx={{ display: 'inline-flex', flexShrink: 0 }}>
              <GoogleG size={16} />
            </Box>
            {t('googlePreferredSource')}
          </Box>
        </Box>
        {/* Cookie-consent withdrawal (audit C4) — re-opens the consent UI; GDPR Art. 7(3). */}
        <Box sx={{ mt: 0.5 }}>
          <CookieSettingsButton />
        </Box>
      </Box>
      {/* Trust column on the right: TripAdvisor review rating (social proof,
          mirrors the sister sites) above the four-commitment assurance strip.
          Right-aligned on desktop, centered when the row wraps on mobile. */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, gap: 1 }}>
        <TripAdvisorRating />
        <AssuranceBadges variant="footer" />
      </Box>
    </Box>
  );
};

export default FooterBottomBar;
