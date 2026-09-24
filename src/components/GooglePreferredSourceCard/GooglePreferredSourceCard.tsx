import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import GoogleG from '@/components/SvgIcons/GoogleG';
import colors from '@/styles/themes/colors';
import { GOOGLE_PREFERRED_SOURCE_URL } from '@/utils/static/googlePreferredSource';

/** Brand as it reads mid-sentence ("Add Boat4you as a preferred source"). */
const BRAND = 'Boat4you';

/**
 * "Add us as a preferred source on Google" panel for the blog: rendered after
 * every article body and once under the blog listing, i.e. where a reader has
 * just finished a guide and is most likely to want the next one. Same
 * deeplink as the footer pill (GOOGLE_PREFERRED_SOURCE_URL) — Google's
 * publisher docs prescribe a plain link, so no script. Brand-tinted panel
 * (blue50/blue200) with the site's primary contained button; the G sits in a
 * white disc inside the button so its blue path stays legible on blue500.
 * Row on desktop, stacked on phones. Callers control outer spacing.
 */
const GooglePreferredSourceCard = () => {
  const t = useTranslations('common.googlePreferred');

  return (
    <Box
      component="aside"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: { xs: 2, md: 3 },
        p: { xs: 2.5, md: 3 },
        borderRadius: '16px',
        border: `1px solid ${colors.blue200}`,
        backgroundColor: colors.blue50,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: colors.white,
          border: `1px solid ${colors.blue100}`,
        }}
      >
        <GoogleG size={30} />
      </Box>
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h4" component="p" color={colors.black950}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color={colors.black700} sx={{ lineHeight: 1.6 }}>
          {t('body', { brand: BRAND })}
        </Typography>
      </Stack>
      <Button
        component="a"
        href={GOOGLE_PREFERRED_SOURCE_URL}
        target="_blank"
        rel="noopener noreferrer"
        size="large"
        startIcon={
          <Box
            component="span"
            sx={{ display: 'inline-flex', p: 0.375, borderRadius: '50%', backgroundColor: colors.white }}
          >
            <GoogleG size={16} />
          </Box>
        }
        sx={{ flexShrink: 0, width: { xs: '100%', md: 'fit-content' } }}
      >
        {t('button')}
      </Button>
    </Box>
  );
};

export default GooglePreferredSourceCard;
