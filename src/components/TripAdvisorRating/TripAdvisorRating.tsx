import { Box, Typography } from '@mui/material';

import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT, TRIPADVISOR_URL } from '@/config/tripadvisor';
import colors from '@/styles/themes/colors';

/**
 * TripAdvisor review-rating trust signal — "★★★★★ 4.9 · 145 reviews on
 * TripAdvisor" linking the group's real TripAdvisor profile (Europe Yachts
 * Charter, Split — Boat4You Group's operating brand). Mirrors the trust line on
 * the sister sites and the homepage hero; all read the shared
 * `@/config/tripadvisor` values so the footer, hero and JSON-LD can't drift.
 * Static text + link, deliberately NOT the TripAdvisor script widget (which
 * mounts unreliably under Next client navigation and re-renders).
 */
const TripAdvisorRating = () => (
  <Box
    component="a"
    href={TRIPADVISOR_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Rated ${TRIPADVISOR_RATING} out of 5 from ${TRIPADVISOR_REVIEW_COUNT} reviews on TripAdvisor`}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
      textDecoration: 'none',
      transition: 'opacity .2s ease',
      '&:hover': { opacity: 0.8 },
    }}
  >
    <Box component="span" aria-hidden sx={{ color: '#ffb400', fontSize: 13, letterSpacing: '1.5px', lineHeight: 1 }}>
      ★★★★★
    </Box>
    <Typography component="span" variant="body2" fontWeight={700} fontSize={13} color={colors.black900}>
      {TRIPADVISOR_RATING}
    </Typography>
    <Typography component="span" variant="caption" fontSize={12} color={colors.black600}>
      · {TRIPADVISOR_REVIEW_COUNT} reviews on TripAdvisor
    </Typography>
  </Box>
);

export default TripAdvisorRating;
