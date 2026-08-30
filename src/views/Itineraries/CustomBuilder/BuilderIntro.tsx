import { Box, Container, Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import colors from '@/styles/themes/colors';

/**
 * Server-rendered promo + instructions above the interactive builder —
 * Mario 30.8.2026: the bare tool didn't tell visitors to start with a
 * departure marina, and the page should sell the feature (it's in the
 * sitemap, so this copy is also its indexable content).
 */
const BuilderIntro = async () => {
  const t = await getTranslations('itinerary');

  const steps = [1, 2, 3].map(n => ({
    title: t(`builder.step${n}Title` as never),
    text: t(`builder.step${n}Text` as never),
  }));
  const highlights = [1, 2, 3, 4].map(n => t(`builder.hl${n}` as never));

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, pt: 4 }}>
      <Stack gap={1.2} sx={{ maxWidth: 880 }}>
        <Typography sx={{ fontSize: { xs: 15, md: 16 }, lineHeight: 1.65, color: '#3c4257' }}>
          {t('builder.promoP1')}
        </Typography>
        <Typography sx={{ fontSize: { xs: 15, md: 16 }, lineHeight: 1.65, color: '#3c4257' }}>
          {t('builder.promoP2')}
        </Typography>
      </Stack>

      <Typography
        component="h2"
        sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 800, color: colors.blue950, mt: 4, mb: 2 }}
      >
        {t('builder.howTitle')}
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
        {steps.map((step, i) => (
          <Box key={step.title} sx={{ flex: 1, p: 2.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e6f0' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: colors.blue600,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.2,
              }}
            >
              {i + 1}
            </Box>
            <Typography sx={{ fontSize: 15.5, fontWeight: 700, color: colors.blue950, mb: 0.6 }}>
              {step.title}
            </Typography>
            <Typography sx={{ fontSize: 13.5, lineHeight: 1.6, color: '#3c4257' }}>{step.text}</Typography>
          </Box>
        ))}
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1.2} sx={{ mt: 3 }}>
        {highlights.map(highlight => (
          <Stack
            key={highlight}
            direction="row"
            alignItems="center"
            gap={0.8}
            sx={{ px: 1.6, py: 0.9, bgcolor: '#eef1fb', borderRadius: 999 }}
          >
            <Typography component="span" sx={{ color: colors.blue600, fontWeight: 800, fontSize: 14 }}>
              ✓
            </Typography>
            <Typography component="span" sx={{ fontSize: 13, fontWeight: 600, color: colors.blue950 }}>
              {highlight}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
};

export default BuilderIntro;
