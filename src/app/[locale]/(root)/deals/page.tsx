import { Locale } from 'next-intl';

import { PROMO_CAMPAIGNS, getActiveCampaign } from '@/config/campaigns.config';
import { redirect } from '@/i18n/navigation';

/**
 * /deals itself had no page — a 404 above the /deals/<campaign> landings
 * (audit 15.11.2026). It hands over to the campaign the home and listing
 * banners advertise today (getActiveCampaign), else to the first configured
 * campaign; every campaign page stays reachable year-round. A temporary
 * redirect, because the target moves with the promo calendar.
 *
 * Rendered per request: the active campaign comes from today's date, so a
 * build-time render would pin the redirect to the deploy day.
 */
export const dynamic = 'force-dynamic';

const DealsIndexPage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { locale } = await params;
  const campaign = getActiveCampaign() ?? PROMO_CAMPAIGNS[0];

  return redirect({ href: `/deals/${campaign.slug}`, locale });
};

export default DealsIndexPage;
