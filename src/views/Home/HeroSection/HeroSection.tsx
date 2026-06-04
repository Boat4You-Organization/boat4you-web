/* eslint-disable @typescript-eslint/no-use-before-define */
import { Suspense } from 'react';

import { useTranslations } from 'next-intl';

import GeneralSearchBarRoot from '@/components/GeneralSearchBarRoot';
import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT, TRIPADVISOR_URL } from '@/config/tripadvisor';

import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  /** Trust pills shown between the H1 and search bar — "support · N yachts ·
   *  M marinas". Server-fetched in the page so the numbers render in the
   *  initial HTML and Google's crawler picks them up. Pass `null` (or omit)
   *  to hide the row entirely (e.g. when the upstream is degraded). */
  stats?: { yachts: number; marinas: number } | null;
}

// Plain HTML + CSS-module hero (no MUI). The hero is the LCP element; MUI's
// Typography/Box/Stack are client components whose Emotion runtime re-runs at
// hydration and dominated mobile TBT. Rendering it as server-only markup means
// the LCP text paints from static HTML with zero JS attached.
const HeroSection = ({ stats }: HeroSectionProps) => {
  const t = useTranslations('home');

  // Show the trust line only when both numbers came back non-zero —
  // a partial signal ("0 yachts · 680 marinas") looks broken and erodes
  // trust faster than no signal at all.
  const showStats = !!stats && stats.yachts > 0 && stats.marinas > 0;
  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <>
      <section className={styles.container}>
        <div className={styles.inner}>
          <h1 className={styles.title}>
            {t('hero.title')} <span className={styles.titleEmphasis}>{t('hero.ctaTitle')}</span>
          </h1>
          {showStats && (
            <div className={styles.stats}>
              <TrustPill label={t('hero.support')} />
              <TrustPill label={t('hero.yachtsCount', { count: fmt(stats!.yachts) })} />
              <TrustPill label={t('hero.marinasCount', { count: fmt(stats!.marinas) })} />
            </div>
          )}
          {/* TripAdvisor review rating — plain markup (no MUI) so the LCP hero
              stays JS-free; reads the shared @/config/tripadvisor values. */}
          <a
            className={styles.tripadvisor}
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Rated ${TRIPADVISOR_RATING} out of 5 from ${TRIPADVISOR_REVIEW_COUNT} reviews on TripAdvisor`}
          >
            <span className={styles.taStars} aria-hidden>
              ★★★★★
            </span>
            <span className={styles.taScore}>{TRIPADVISOR_RATING}</span>
            <span className={styles.taCount}>· {TRIPADVISOR_REVIEW_COUNT} reviews on TripAdvisor</span>
          </a>
          <p className={styles.description}>{t('hero.description')}</p>
        </div>
      </section>
      {/* GeneralSearchBarRoot reads useSearchParams() via useSyncUserPreferences
          — Suspense lets the home prerender as SSG; the search bar hydrates
          when the client mount sees the actual query string. The fallback
          height reserves space so the hero composition doesn't shift. */}
      <Suspense fallback={<div className={styles.searchFallback} />}>
        <GeneralSearchBarRoot />
      </Suspense>
    </>
  );
};

/**
 * Single trust-line pill — "✓ {label}". Inline checkmark + label, scaled
 * to fit the hero typography weight.
 */
const TrustPill = ({ label }: { label: string }) => (
  <span className={styles.pill}>
    <span className={styles.pillCheck} aria-hidden>
      ✓
    </span>
    {label}
  </span>
);

export default HeroSection;
