'use client';

import { CSSProperties, PointerEvent, useEffect, useRef, useState } from 'react';

import cx from 'clsx';
import { useTranslations } from 'next-intl';

import { PromoCampaign, getActiveCampaign } from '@/config/campaigns.config';
import { Link } from '@/i18n/navigation';
import { fetchCampaignMaxPct } from '@/services/promo.service';

import styles from './PromoBanner.module.scss';
import Sailor from './Sailor';
import { Gulls, Sailboat, SeaBack, SeaFront } from './Scenery';

interface PromoBannerProps {
  /** Defaults to the calendar-active campaign; renders nothing when none is. */
  campaign?: PromoCampaign | null;
  /** Server-resolved "up to X%". Omit to fetch client-side (search listing). */
  initialPct?: number | null;
  /** Shorter strip for the search listing (replaced RiskFreeCTA, 12.7.2026). */
  compact?: boolean;
  /** Grid-cell variant: fills its cell height, sits among the destination
   *  cards on the home page (Mario 12.7.2026 — banner should blend in). */
  tile?: boolean;
  /** The landing hero renders the banner itself, without the self-link. */
  clickable?: boolean;
}

/** Playback speed of the whole scene while a mouse is over the banner. */
const HOVER_TEMPO = 1.8;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Speeds every running animation inside the banner up or back down. Uses
 *  updatePlaybackRate so the walk cycle keeps its phase instead of jumping. */
const setTempo = (el: HTMLElement, rate: number) => {
  if (typeof el.getAnimations !== 'function') return;

  el.getAnimations({ subtree: true }).forEach(animation => animation.updatePlaybackRate(rate));
};

const PromoBanner = ({
  campaign = getActiveCampaign(),
  initialPct,
  compact,
  tile,
  clickable = true,
}: PromoBannerProps) => {
  const t = useTranslations('promo');
  const [pct, setPct] = useState<number | null>(initialPct ?? null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const shouldFetch = campaign != null && initialPct === undefined;

  useEffect(() => {
    if (!shouldFetch || !campaign) return;

    fetchCampaignMaxPct(campaign).then(setPct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, campaign?.slug]);

  // Freeze the scene while the banner is scrolled out of view (the search
  // listing keeps it mounted far above the fold). A data attribute rather than
  // state so toggling it never re-renders the banner.
  useEffect(() => {
    const el = bannerRef.current;

    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => el.toggleAttribute('data-paused', !entry.isIntersecting));

    observer.observe(el);

    return () => observer.disconnect();
  }, [campaign?.slug]);

  if (!campaign) return null;

  // Mouse parallax: layers read --px/--py (-1…1) and shift by their own depth.
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;

    const rect = e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.setProperty('--px', (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty('--py', (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
  };

  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && !prefersReducedMotion()) setTempo(e.currentTarget, HOVER_TEMPO);
  };

  const handlePointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--px', '0');
    e.currentTarget.style.setProperty('--py', '0');
    setTempo(e.currentTarget, 1);
  };

  const banner = (
    <div className={cx({ [styles.compact]: compact, [styles.tile]: tile })}>
      <div
        ref={bannerRef}
        className={styles.banner}
        style={
          {
            background: campaign.colors.bg,
            '--accent': campaign.colors.blob,
            '--accent-text': campaign.colors.blobText,
          } as CSSProperties
        }
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <Gulls />
        <p className={styles.title}>{t(`campaigns.${campaign.i18nKey}.title`)}</p>
        <p className={styles.sub}>
          {pct
            ? t(`campaigns.${campaign.i18nKey}.subtitle`, { pct: String(pct) })
            : t(`campaigns.${campaign.i18nKey}.subtitleNoPct`)}
        </p>
        {clickable && (
          <span className={styles.cta}>
            {t('banner.cta')}
            <svg className={styles.ctaArrow} viewBox="0 0 24 24" aria-hidden>
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
        <SeaBack />
        <Sailboat />
        <SeaFront />
        <Sailor shirt={campaign.colors.shirt} />
        {pct != null && (
          <div className={styles.blob} style={{ background: campaign.colors.blob, color: campaign.colors.blobText }}>
            <span className={styles.upto}>{t('banner.upTo')}</span>
            <span className={styles.pct}>{pct}%</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!clickable) return banner;

  return (
    <Link
      href={`/deals/${campaign.slug}`}
      className={cx(styles.wrapper, { [styles.wrapperTile]: tile })}
      aria-label={t(`campaigns.${campaign.i18nKey}.title`)}
    >
      {banner}
    </Link>
  );
};

export default PromoBanner;
