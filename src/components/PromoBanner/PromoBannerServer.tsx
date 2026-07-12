import { Container } from '@mui/material';

import { getActiveCampaign } from '@/config/campaigns.config';
import { fetchCampaignMaxPct } from '@/services/promo.service';

import PromoBanner from './PromoBanner';

/**
 * Server wrapper for the home page: resolves the calendar-active campaign and
 * its live "up to X%" during SSR so the banner arrives complete (no client
 * fetch flash). Renders nothing when no campaign is active.
 */
const PromoBannerServer = async () => {
  const campaign = getActiveCampaign();

  if (!campaign) return null;

  const pct = await fetchCampaignMaxPct(campaign);

  return (
    <Container component="section" maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: { xs: 2, md: 3 } }}>
      <PromoBanner campaign={campaign} initialPct={pct} />
    </Container>
  );
};

export default PromoBannerServer;
