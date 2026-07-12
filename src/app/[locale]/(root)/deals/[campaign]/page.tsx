import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import BoatListingItemCard from '@/components/BoatListingItemCard';
import Layout from '@/components/Layout';
import PromoBanner from '@/components/PromoBanner';
import { PROMO_CAMPAIGNS, getCampaignBySlug, resolveFeaturedWeek } from '@/config/campaigns.config';
import { YachtSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { routing } from '@/i18n/routing';
import { Currency } from '@/models/user.model';
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

// Rendered per request: the featured week is derived from `new Date()` and the
// discounted-boat list is fetched no-store, so the page must never be frozen at
// build time (would pin the dates + prices to the deploy moment).
export const dynamic = 'force-dynamic';

const LISTING_SIZE = 18;

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
  const [pct, yachts, t] = await Promise.all([
    fetchCampaignMaxPct(campaign),
    fetchYachts(
      { startDate, endDate, sortBy: 'discount', size: LISTING_SIZE } as YachtSearchParams,
      Currency.EUR,
      locale
    ),
    getTranslations('promo'),
  ]);
  const boats = yachts?.content ?? [];
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
            {boats.map(yacht => (
              <Grid key={yacht.id} size={{ xs: 12, md: 4 }}>
                <BoatListingItemCard isGridView {...yacht} user={null} />
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
