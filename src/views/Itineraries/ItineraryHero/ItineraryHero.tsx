import { ReactNode } from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';

import colors from '@/styles/themes/colors';

interface ItineraryHeroProps {
  /** Tiny uppercase label above the eyebrow ("Itineraries", "Route · 7 days"). */
  kicker: string;
  /** Context line under the kicker ("Croatia sailing routes"). */
  eyebrow?: string;
  title: ReactNode;
  /** Italic tail appended to the title ("itineraries."). */
  italic?: ReactNode;
  lede?: string;
  image: { src: string; alt: string };
}

/**
 * B4Y-styled hero for the itinerary pages — replaces EY's CCPageHero
 * (cc/Tailwind chrome that doesn't exist in this repo). Rounded image
 * banner with a navy gradient overlay and the H1 stacked on top; the
 * top margin clears the fixed AppBar (same offset as the deals landing).
 */
const ItineraryHero = ({ kicker, eyebrow, title, italic, lede, image }: ItineraryHeroProps) => (
  <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: { xs: '96px', md: '104px' } }}>
    <Box
      sx={{
        position: 'relative',
        borderRadius: { xs: 3, md: 4 },
        overflow: 'hidden',
        minHeight: { xs: 340, md: 420 },
        display: 'flex',
        alignItems: 'flex-end',
        backgroundColor: colors.blue950,
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="(max-width: 1536px) 100vw, 1536px"
        style={{ objectFit: 'cover' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgb(20 24 87 / 25%) 0%, rgb(20 24 87 / 78%) 100%)',
        }}
      />
      <Stack gap={1} sx={{ position: 'relative', p: { xs: 3, sm: 5, md: 7 }, maxWidth: 860 }}>
        <Typography
          component="span"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.blue200,
          }}
        >
          {kicker}
        </Typography>
        {eyebrow && (
          <Typography component="span" sx={{ fontSize: { xs: 13, md: 15 }, fontWeight: 600, color: colors.blue100 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 32, sm: 42, md: 52 },
            fontWeight: 800,
            lineHeight: 1.1,
            color: colors.white,
            m: 0,
          }}
        >
          {title}
          {italic && (
            <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
              {' '}
              {italic}
            </Box>
          )}
        </Typography>
        {lede && (
          <Typography sx={{ fontSize: { xs: 14.5, md: 16 }, lineHeight: 1.6, color: colors.blue50, mt: 0.5 }}>
            {lede}
          </Typography>
        )}
      </Stack>
    </Box>
  </Container>
);

export default ItineraryHero;
