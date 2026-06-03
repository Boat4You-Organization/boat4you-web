import { Box, Typography } from '@mui/material';

import colors from '@/styles/themes/colors';

/**
 * TripAdvisor review-rating trust signal — "★★★★★ 4.9 · 145 reviews on
 * TripAdvisor" linking the group's real TripAdvisor profile (Europe Yachts
 * Charter, Split — Boat4You Group's operating brand). Mirrors the trust line
 * already live on the sister sites (catamaran-* / europe-yachts) so the
 * social-proof reads the same everywhere. Static text + link, deliberately NOT
 * the TripAdvisor script widget (which mounts unreliably under Next client
 * navigation and re-renders); the static image+link counts toward the same
 * referrer signal.
 */
const TA_PROFILE_URL =
  'https://www.tripadvisor.com/Attraction_Review-g295370-d12422829-Reviews-Europe_Yachts_Charter-Split_Split_Dalmatia_County_Dalmatia.html';

const TripAdvisorRating = () => (
  <Box
    component="a"
    href={TA_PROFILE_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Rated 4.9 out of 5 from 145 reviews on TripAdvisor"
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
      4.9
    </Typography>
    <Typography component="span" variant="caption" fontSize={12} color={colors.black600}>
      · 145 reviews on TripAdvisor
    </Typography>
  </Box>
);

export default TripAdvisorRating;
