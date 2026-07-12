'use client';

import { useEffect, useState } from 'react';

import cx from 'clsx';
import { useTranslations } from 'next-intl';

import { PromoCampaign, getActiveCampaign } from '@/config/campaigns.config';
import { Link } from '@/i18n/navigation';
import { fetchCampaignMaxPct } from '@/services/promo.service';

import styles from './PromoBanner.module.scss';
import { SAILOR_SVG_INNER, SAILOR_VIEWBOX, SHIRT_SOURCE_COLOR } from './sailorPaths';

interface PromoBannerProps {
  /** Defaults to the calendar-active campaign; renders nothing when none is. */
  campaign?: PromoCampaign | null;
  /** Server-resolved "up to X%". Omit to fetch client-side (search listing). */
  initialPct?: number | null;
  /** Shorter strip for the search listing (replaced RiskFreeCTA, 12.7.2026). */
  compact?: boolean;
  /** The landing hero renders the banner itself, without the self-link. */
  clickable?: boolean;
}

const PromoBanner = ({ campaign = getActiveCampaign(), initialPct, compact, clickable = true }: PromoBannerProps) => {
  const t = useTranslations('promo');
  const [pct, setPct] = useState<number | null>(initialPct ?? null);

  const shouldFetch = campaign != null && initialPct === undefined;

  useEffect(() => {
    if (!shouldFetch || !campaign) return;

    fetchCampaignMaxPct(campaign).then(setPct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, campaign?.slug]);

  if (!campaign) return null;

  const banner = (
    <div className={cx({ [styles.compact]: compact })}>
      <div className={styles.banner} style={{ background: campaign.colors.bg }}>
        <p className={styles.title}>{t(`campaigns.${campaign.i18nKey}.title`)}</p>
        <p className={styles.sub}>
          {pct
            ? t(`campaigns.${campaign.i18nKey}.subtitle`, { pct: String(pct) })
            : t(`campaigns.${campaign.i18nKey}.subtitleNoPct`)}
        </p>
        <svg
          className={styles.dude}
          viewBox={SAILOR_VIEWBOX}
          aria-hidden
          // Static bundled artwork (Storyset character), recolored per campaign.
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: SAILOR_SVG_INNER.replaceAll(SHIRT_SOURCE_COLOR, campaign.colors.shirt) }}
        />
        {pct != null && (
          <div className={styles.blob} style={{ background: campaign.colors.blob, color: campaign.colors.blobText }}>
            <span className={styles.upto}>{t('banner.upTo')}</span>
            <span className={styles.pct}>{pct}%</span>
          </div>
        )}
        <svg className={styles.sea} viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
          <path d="M0 20 Q25 5 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20 V40 H0 Z" />
        </svg>
      </div>
    </div>
  );

  if (!clickable) return banner;

  return (
    <Link
      href={`/deals/${campaign.slug}`}
      className={styles.wrapper}
      aria-label={t(`campaigns.${campaign.i18nKey}.title`)}
    >
      {banner}
    </Link>
  );
};

export default PromoBanner;
