import { Box, Container, Grid, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import BoatListingItemCard from '@/components/BoatListingItemCard';
import { Currency, UserModel } from '@/models/user.model';
import { MeasurementInfo, MeasurementUnit } from '@/models/yacht-feature.model';
import { YachtModel, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';

/**
 * "You might also like" — up to 3 boats from the SAME marina, sized like
 * the current one. Pool comes from the regular /public/yachts listing
 * filtered by the marina's did; the ±5 ft closest-length pick mirrors the
 * sister-site RelatedYachts rule (Mario 12.5.2026). Renders nothing when
 * the marina id is unknown or the pool is empty — never an empty shell.
 */

const M_PER_FT = 0.3048;
const TOLERANCE_FT = 5;

const yachtLengthFt = (info: MeasurementInfo | null | undefined, metric: number | null | undefined): number | null => {
  if (info && info.unit === MeasurementUnit.FEET && Number.isFinite(info.amount)) return info.amount;

  if (info && info.unit === MeasurementUnit.METRE && Number.isFinite(info.amount)) return info.amount / M_PER_FT;

  if (typeof metric === 'number' && Number.isFinite(metric)) return metric / M_PER_FT;

  return null;
};

interface RelatedBoatsProps {
  yacht: YachtModel;
  user: UserModel | null;
  locale: string;
  currency: Currency;
}

const RelatedBoats = async ({ yacht, user, locale, currency }: RelatedBoatsProps) => {
  // Detail payloads ship `locations: []` — the usable did lives on
  // `location.id` ("l-2026"-style, marina-prefixed).
  const marinaDid = yacht.location?.id ?? yacht.locations?.[0]?.id;

  if (marinaDid == null) return null;

  const { content: pool = [] } = await fetchYachts(
    { locations: [], did: [String(marinaDid)], size: 12 },
    currency,
    locale
  );

  const currentLenFt = yachtLengthFt(yacht.lengthInfo, yacht.length);

  const related: YachtModelShortInfo[] = pool
    .filter(candidate => candidate.id !== yacht.id)
    .filter(candidate => {
      if (currentLenFt == null) return true;

      const candidateLenFt = yachtLengthFt(candidate.lengthInfo, candidate.length);

      if (candidateLenFt == null) return true;

      return Math.abs(candidateLenFt - currentLenFt) <= TOLERANCE_FT;
    })
    .sort((a, b) => {
      if (currentLenFt == null) return 0;

      const aFt = yachtLengthFt(a.lengthInfo, a.length);
      const bFt = yachtLengthFt(b.lengthInfo, b.length);

      if (aFt == null) return 1;

      if (bFt == null) return -1;

      return Math.abs(aFt - currentLenFt) - Math.abs(bFt - currentLenFt);
    })
    .slice(0, 3);

  if (related.length === 0) return null;

  const t = await getTranslations('yacht');

  return (
    <Container maxWidth="xl" component="section" sx={{ pt: { xs: 3, sm: 5 }, pb: { xs: 1, sm: 2 } }}>
      <Typography component="h2" variant="h3" fontWeight={700} sx={{ mb: { xs: 2, sm: 3 } }}>
        {t('relatedHeading')}
      </Typography>
      <Grid container spacing={3}>
        {related.map(boat => (
          <Grid key={boat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ height: '100%' }}>
              <BoatListingItemCard {...boat} isGridView user={user} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RelatedBoats;
