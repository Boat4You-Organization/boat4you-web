import { getTranslations } from 'next-intl/server';

import PromoBanner from '@/components/PromoBanner';
import { getActiveCampaign } from '@/config/campaigns.config';
import { CountryCountModel } from '@/models/locations.model';
import { fetchCampaignMaxPct } from '@/services/promo.service';

import styles from './DestinationsSection.module.scss';
import DestinationCard from './DestinationsSlider/DestinationCard';

interface DestinationsSectionProps {
  countries: CountryCountModel[];
}

// 4 x 3 static grid (Mario, Jun-2026) using the same card design as the fleet
// grid. The COMPLETE country list still renders in AllDestinationsSection.
const GRID_LIMIT = 12;
// With the promo tile in the grid it spans 3 desktop cells, so drop 3 countries
// to keep the 4×3 block whole (Mario 12.7.2026 — banner blends in among them).
const GRID_LIMIT_WITH_PROMO = 9;

// Desktop placements for the promo tile. Never the top row (row 1) so it reads
// as one of the destinations rather than a headline; it rotates through these
// day by day so it isn't always in the same spot. `dom` is where the tile is
// spliced into the card list for the single-column mobile flow.
const PROMO_ROTATIONS = [
  { row: 2, col: 1, dom: 4 },
  { row: 2, col: 2, dom: 5 },
  { row: 3, col: 1, dom: 6 },
  { row: 3, col: 2, dom: 7 },
];

const dayOfYear = (d: Date) =>
  Math.floor(
    (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86_400_000
  );

const DestinationsSection = async ({ countries }: DestinationsSectionProps) => {
  const t = await getTranslations('home');

  const campaign = getActiveCampaign();
  const pct = campaign ? await fetchCampaignMaxPct(campaign) : null;
  const showPromo = campaign != null;

  const visible = countries.slice(0, showPromo ? GRID_LIMIT_WITH_PROMO : GRID_LIMIT);

  if (!visible.length) return null;

  const rotation = PROMO_ROTATIONS[dayOfYear(new Date()) % PROMO_ROTATIONS.length];

  // Cards + the promo tile spliced in at the rotating mobile position. On
  // desktop the tile is placed explicitly (grid-row/column) and the cards
  // dense-flow around it, so this splice index only drives the mobile order.
  const cards = visible.map(country => <DestinationCard key={country.id} {...country} />);
  const items =
    showPromo && campaign
      ? [
          ...cards.slice(0, rotation.dom),
          <div
            key="promo"
            className={styles.promoCell}
            style={{ '--promo-row': rotation.row, '--promo-col': rotation.col } as React.CSSProperties}
          >
            <PromoBanner campaign={campaign} initialPct={pct} tile />
          </div>,
          ...cards.slice(rotation.dom),
        ]
      : cards;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('destinationsSection.theWorldIs')}{' '}
        <span className={styles.titleEmphasis}>{t('destinationsSection.yours')}</span>
      </h2>
      <p className={styles.subtitle}>{t('chooseFromFiveHundredLocations')}</p>

      {/* No `priority` on any card: these sit below the fold (hero + search bar
          fill the mobile viewport) and are never the LCP element. Default lazy
          loading fetches them when they scroll into view. */}
      <div className={styles.grid}>{items}</div>
    </section>
  );
};

export default DestinationsSection;
