'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import colors from '@/styles/themes/colors';

interface ItineraryBuilderPromoProps {
  kicker: string;
  eyebrow: string;
  title: string;
  italic: string;
  lede: string;
  action: string;
}

/** Decorative course line with numbered pins — echoes the builder's live
 *  map so the banner reads as "plan a route", not just another photo. */
const CourseArt = () => (
  <Box
    component="svg"
    viewBox="0 0 520 300"
    aria-hidden
    sx={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: { xs: 0.35, md: 0.5 },
      pointerEvents: 'none',
    }}
  >
    <path
      d="M -20 240 C 90 150 150 250 240 200 S 380 60 460 110 S 560 30 640 60"
      fill="none"
      stroke={colors.blue300}
      strokeWidth="2.5"
      strokeDasharray="9 8"
      strokeLinecap="round"
    />
    {[
      { cx: 60, cy: 205, n: '1' },
      { cx: 240, cy: 200, n: '2' },
      { cx: 402, cy: 92, n: '3' },
    ].map(p => (
      <g key={p.n}>
        <circle cx={p.cx} cy={p.cy} r="13" fill={colors.blue950} stroke={colors.blue200} strokeWidth="2" />
        <text
          x={p.cx}
          y={p.cy + 4.5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fontFamily="inherit"
          fill={colors.white}
        >
          {p.n}
        </text>
      </g>
    ))}
  </Box>
);

/**
 * Rich promo banner for the tailor-made itinerary builder, shown right
 * under the hub hero (Mario 7.8: the builder deserves the top slot and
 * a designed treatment, not the plain end-of-page CTA box). Navy panel
 * with a dashed-course motif and a postcard stack of real destination
 * photos; all copy reuses the existing `builder.*` messages, so no new
 * translation keys.
 */
const ItineraryBuilderPromo = ({ kicker, eyebrow, title, italic, lede, action }: ItineraryBuilderPromoProps) => (
  <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: { xs: 3, md: 4 } }}>
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 3, md: 4 },
        background: `linear-gradient(115deg, ${colors.blue950} 0%, #1a2470 58%, ${colors.blue700} 125%)`,
      }}
    >
      <CourseArt />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        gap={{ xs: 3, md: 6 }}
        sx={{ position: 'relative', p: { xs: 3, sm: 4.5, md: 6 } }}
      >
        <Stack gap={1.25} sx={{ flex: 1, minWidth: 0 }}>
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
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 28, sm: 34, md: 40 },
              fontWeight: 800,
              lineHeight: 1.12,
              color: colors.white,
              m: 0,
            }}
          >
            {title}
            <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 400 }}>
              {' '}
              {italic}
            </Box>
          </Typography>
          <Typography sx={{ fontSize: { xs: 14, md: 15.5 }, lineHeight: 1.6, color: colors.blue100, maxWidth: 560 }}>
            {lede}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={2}
            sx={{ mt: 1.5 }}
          >
            <Button
              component={Link}
              href="/itineraries/builder"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: colors.white,
                color: colors.blue950,
                fontWeight: 700,
                px: 3.5,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                '&:hover': { backgroundColor: colors.blue50 },
              }}
            >
              {action}
            </Button>
            <Typography component="span" sx={{ fontSize: 13, fontWeight: 600, color: colors.blue200 }}>
              {eyebrow}
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            flexShrink: 0,
            width: { xs: '100%', sm: 340, md: 380 },
            height: { xs: 190, sm: 220, md: 240 },
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 18,
              left: 0,
              width: '58%',
              height: '82%',
              borderRadius: 2.5,
              overflow: 'hidden',
              border: `4px solid ${colors.white}`,
              boxShadow: '0 14px 34px rgb(5 8 40 / 55%)',
              transform: 'rotate(-5deg)',
            }}
          >
            <Image
              src="/images/itinerary/croatia/destinations/krknjasi.webp"
              alt="Krknjasi Blue Lagoon anchorage, Croatia"
              fill
              sizes="240px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '58%',
              height: '88%',
              borderRadius: 2.5,
              overflow: 'hidden',
              border: `4px solid ${colors.white}`,
              boxShadow: '0 16px 38px rgb(5 8 40 / 60%)',
              transform: 'rotate(3.5deg)',
            }}
          >
            <Image
              src="/images/itinerary/croatia/destinations/hvar.webp"
              alt="Hvar town waterfront, Croatia"
              fill
              sizes="240px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          {/* Orange preview pin — the builder's hover accent. */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              right: '46%',
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: '#e8622a',
              border: `3px solid ${colors.white}`,
              boxShadow: '0 4px 12px rgb(5 8 40 / 60%)',
            }}
          />
        </Box>
      </Stack>
    </Box>
  </Container>
);

export default ItineraryBuilderPromo;
