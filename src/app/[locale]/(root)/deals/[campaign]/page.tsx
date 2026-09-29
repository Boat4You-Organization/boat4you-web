import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { StaticBoatListingItemCard } from '@/components/BoatListingItemCard';
import Layout from '@/components/Layout';
import PromoBanner from '@/components/PromoBanner';
import { PROMO_CAMPAIGNS, getCampaignBySlug, resolveFeaturedWeek } from '@/config/campaigns.config';
import { YachtSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { routing } from '@/i18n/routing';
import { Currency } from '@/models/user.model';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchCampaignMaxPct } from '@/services/promo.service';
import { fetchYachts } from '@/services/yacht.service';
import { buildMetadata } from '@/utils/static/buildMetadata';

/**
 * Campaign deals landing (Boataround /promo pattern, Mario 12.7.2026): the
 * campaign hero, the featured Sat–Sat week's biggest genuine discounts
 * (sortBy=discount — client-vs-list price of the same offer the card shows)
 * and a "view all" hand-off into the filtered /search. Every configured
 * campaign stays reachable year-round; the home/listing banners only point
 * at the calendar-active one.
 */

interface DealsPageParams {
  params: Promise<{ locale: Locale; campaign: string }>;
}

// ISR (audit 29.9.2026, R11): rendered per request, a campaign page cost
// 0.5–2 s cold and 9–42 s in the worst cases (five dated catalogue queries
// per render, no route cache). The featured week comes from `new Date()` and
// the discounts move with the partner syncs, so the page is never frozen at
// build time (that would pin dates and prices to the deploy) — but half an
// hour of route cache is invisible next to the nightly price runs. The five
// list fetches share the same window in the Data Cache.
export const revalidate = 1800;

const DEALS_FETCH_REVALIDATE_SECONDS = 1800;
const LISTING_SIZE = 18;
// Main charter vessel types, interleaved so the deals grid shows variety.
const DEALS_VESSEL_TYPES = ['SAILING_YACHT', 'CATAMARAN', 'MOTORBOAT', 'MOTOR_YACHT', 'GULET'];
const PER_TYPE_SIZE = 6;

export async function generateMetadata({ params }: DealsPageParams): Promise<Metadata> {
  const { locale, campaign: slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) return {};

  const t = await getTranslations('promo');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t(`campaigns.${campaign.i18nKey}.metaTitle`),
    description: t(`campaigns.${campaign.i18nKey}.metaDescription`),
    path: `/deals/${campaign.slug}`,
  });
}

export function generateStaticParams() {
  return PROMO_CAMPAIGNS.map(({ slug }) => ({ campaign: slug }));
}

const DealsPage = async ({ params }: DealsPageParams) => {
  const { locale, campaign: slug } = await params;
  const campaign = getCampaignBySlug(slug);

  if (!campaign) notFound();

  const { startDate, endDate } = resolveFeaturedWeek(campaign);
  const [pct, perType, t] = await Promise.all([
    fetchCampaignMaxPct(campaign),
    // Fetch the biggest discounts of EACH vessel type in parallel — sorting the
    // whole catalogue by discount returns only sailing yachts (they carry the
    // deepest last-minute cuts), so the page looked like we only offer sailboats
    // (Mario 12.7.2026). Empty types just drop out of the interleave below.
    Promise.all(
      DEALS_VESSEL_TYPES.map(vesselType =>
        fetchYachts(
          { startDate, endDate, sortBy: 'discount', size: PER_TYPE_SIZE, boatTypes: [vesselType] } as YachtSearchParams,
          Currency.EUR,
          locale,
          { revalidate: DEALS_FETCH_REVALIDATE_SECONDS }
        )
          .then(res => res?.content ?? [])
          .catch((): null => null)
      )
    ),
    getTranslations('promo'),
  ]);

  // One type without boats just drops out of the interleave; every fetch
  // failing is a backend outage — throw (500, not cached) rather than cache
  // an empty "no boats" landing for the whole revalidate window.
  if (perType.every(list => list === null)) throw new Error('Deals listing unavailable');

  // Round-robin the per-type lists (rank 0 of every type, then rank 1, …) so the
  // grid mixes catamarans, motorboats, gulets and sailing yachts instead of
  // being a wall of one type.
  const boats = Array.from({ length: PER_TYPE_SIZE })
    .flatMap((_, rank) => perType.map(list => list?.[rank]).filter((y): y is YachtModelShortInfo => !!y))
    .slice(0, LISTING_SIZE);
  const formatDay = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

  // The distribution aggregate scans a ±3d padded window, but the cards' "-X%"
  // chip prefers the exact-week offer — so the aggregate can exceed the best
  // discount actually visible here. Clamp the hero figure to the top card so
  // the landing never advertises a percentage a visitor can't find on it.
  const topCardPct = boats.reduce((max, b) => {
    const list = b.listPriceEur;
    const client = b.clientPriceEur;

    return list && client && list > client ? Math.max(max, Math.floor(((1 - client / list) * 100) / 5) * 5) : max;
  }, 0);
  const bannerPct = pct != null && topCardPct > 0 ? Math.min(pct, topCardPct) : pct;

  return (
    <Layout>
      {/* mt clears the fixed AppBar (position:fixed, ~81px) — the landing is the
          only promo surface whose banner is the page's first element (home/search
          banners sit far below the header). Matches HeroSection's 88px offset. */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, mt: { xs: '96px', md: '104px' } }}>
        <PromoBanner campaign={campaign} initialPct={bannerPct} clickable={false} />

        <Typography component="h1" variant="h2" fontWeight={800} mt={{ xs: 3, md: 5 }}>
          {t(`campaigns.${campaign.i18nKey}.metaTitle`)}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={1.5} maxWidth="80ch">
          {t('landing.intro')}
        </Typography>

        <Typography component="h2" variant="h4" fontWeight={700} mt={{ xs: 3, md: 4 }} mb={2}>
          {t('landing.boatsTitle', { from: formatDay(startDate), to: formatDay(endDate) })}
        </Typography>

        {boats.length === 0 ? (
          <Typography variant="body1" color="text.secondary" my={6}>
            {t('landing.noBoats')}
          </Typography>
        ) : (
          <Grid container columnSpacing={2} rowSpacing={3}>
            {/* The static card (plain /boat/<slug> link, as on the itinerary
                pages): the search card reads useSearchParams, which bails a
                statically rendered page out to a 500 without a Suspense
                boundary — and the deals URL carries no dates anyway. */}
            {boats.map(yacht => (
              <Grid key={yacht.id} size={{ xs: 12, md: 4 }}>
                <StaticBoatListingItemCard isGridView {...yacht} user={null} />
              </Grid>
            ))}
          </Grid>
        )}

        <Box display="flex" justifyContent="center" my={{ xs: 4, md: 6 }}>
          {/* Plain href (not component={Link}) — a component reference can't
              cross the RSC boundary as a prop; localize the path manually. */}
          <Button
            href={`${locale === routing.defaultLocale ? '' : `/${locale}`}/search?startDate=${startDate}&endDate=${endDate}&sortBy=discount`}
            variant="contained"
            size="large"
          >
            {t('landing.viewAll')}
          </Button>
        </Box>

        <Box maxWidth="80ch" mb={{ xs: 5, md: 8 }}>
          <Typography component="h2" variant="h4" fontWeight={700} mb={1.5}>
            {t(`campaigns.${campaign.i18nKey}.seoTitle`)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t(`campaigns.${campaign.i18nKey}.seoText`)}
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default DealsPage;
