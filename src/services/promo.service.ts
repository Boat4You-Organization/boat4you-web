import { PromoCampaign, resolveFeaturedWeek } from '@/config/campaigns.config';

/**
 * Live "up to X%" for a campaign banner: the backend's maxDiscountPerc
 * aggregate (highest client-vs-list saving) over the campaign's featured
 * week, rounded DOWN to a step of 5 so the banner never overstates what a
 * visitor can actually find. Below 15% real discounts the number is not
 * worth advertising — fall back to the configured value (or null → the
 * banner hides the blob). Isomorphic: server pages pass the result as
 * initialPct, the search-listing banner calls it from the client.
 */
export async function fetchCampaignMaxPct(campaign: PromoCampaign): Promise<number | null> {
  try {
    const { startDate, endDate } = resolveFeaturedWeek(campaign);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/distribution?startDate=${startDate}&endDate=${endDate}`,
      { next: { revalidate: 900 } }
    );

    if (!response.ok) return campaign.fallbackPct;

    const raw = (await response.json())?.maxDiscountPerc;

    // Real aggregate present: advertise it floored to a step of 5 (never round
    // up). Below the 15% floor, or the backend's explicit `null` (nothing in
    // the set is discounted), HIDE the number rather than fall back — the
    // configured fallback is only for the "couldn't reach the API" path, so a
    // low real discount can never be overstated as the optimistic default.
    if (typeof raw === 'number') return raw >= 15 ? Math.floor(raw / 5) * 5 : null;

    if (raw === null) return null;

    return campaign.fallbackPct;
  } catch {
    return campaign.fallbackPct;
  }
}
