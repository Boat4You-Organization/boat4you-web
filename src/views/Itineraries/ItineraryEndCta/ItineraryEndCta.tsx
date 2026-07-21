'use client';

import { ReactNode } from 'react';

import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';

interface ItineraryEndCtaProps {
  title: ReactNode;
  lede: string;
  action: string;
  to: string;
  secondaryAction?: string;
  secondaryTo?: string;
}

/**
 * B4Y-styled end-of-page CTA for the itinerary pages — replaces EY's
 * CCEndCTA (cc/Tailwind chrome). Primary CTA leads into /search
 * (optionally pre-filtered by starting point), secondary to the plain
 * search page.
 */
const ItineraryEndCta = ({ title, lede, action, to, secondaryAction, secondaryTo }: ItineraryEndCtaProps) => (
  <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, my: { xs: 6, md: 10 } }}>
    <Box
      sx={{
        borderRadius: { xs: 3, md: 4 },
        backgroundColor: colors.blue50,
        border: `1px solid ${colors.blue100}`,
        p: { xs: 3, sm: 5, md: 7 },
        textAlign: 'center',
      }}
    >
      <Typography
        component="h2"
        sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800, color: colors.blue950, lineHeight: 1.2, m: 0 }}
      >
        {title}
      </Typography>
      <Typography sx={{ fontSize: { xs: 14, md: 15.5 }, color: colors.black700, mt: 1.5, mx: 'auto', maxWidth: 640 }}>
        {lede}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} justifyContent="center" sx={{ mt: 3.5 }}>
        <Button component={Link} href={to} variant="contained" size="large">
          {action}
        </Button>
        {secondaryAction && secondaryTo && (
          <Button component={Link} href={secondaryTo} variant="outlined" size="large">
            {secondaryAction}
          </Button>
        )}
      </Stack>
    </Box>
  </Container>
);

export default ItineraryEndCta;
