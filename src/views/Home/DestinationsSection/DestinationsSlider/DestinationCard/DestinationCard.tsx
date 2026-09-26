import { useTranslations } from 'next-intl';
import Image from 'next/image';

import {
  getImageByCountryCode,
  getTranslationKeyByCountryCode,
  getTranslationKeyByDestinationName,
} from '@/config/destinations.config';
import { Link } from '@/i18n/navigation';
import { CountryCountModel } from '@/models/locations.model';
import { buildDestinationHref } from '@/utils/static/searchLandingPath';

import styles from './DestinationCard.module.scss';

interface DestinationCardProps extends CountryCountModel {
  priority?: boolean;
}

// Plain HTML + CSS (no MUI), zero client JS. Jul-2026: back to an overlay
// card (Mario: image as tall as the promo tile, name + yacht count INSIDE
// the photo) — the taller image fills the whole grid cell, so the promo
// tile in the same row no longer towers over the destinations. A bottom
// scrim keeps the white text readable on any photo.
const DestinationCard = ({ id, name, countryCode, yachtCount, priority = false }: DestinationCardProps) => {
  const t = useTranslations('home');
  const image = getImageByCountryCode(countryCode);

  const translationKey = getTranslationKeyByCountryCode(countryCode) || getTranslationKeyByDestinationName(name);
  const localizedName = translationKey ? t(translationKey) : name;
  // The image alt used to leak the raw i18n KEY ("destinationsSection.
  // destinations.croatia") — use the localized destination name instead.
  const alt = localizedName;

  return (
    // Canonical landing URL (the sitemap form) — /search resolves the did
    // itself; the old `&did=` link pointed at a noindexed variant. The
    // locale-aware Link keeps /de/ visitors on the /de/ landing.
    <Link href={buildDestinationHref(name, id)} className={styles.card}>
      <Image
        src={image.src}
        alt={alt}
        fill
        sizes="(max-width: 600px) 50vw, 305px"
        className={styles.image}
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        quality={65}
      />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <h3 className={styles.title}>{localizedName}</h3>
        <p className={styles.count}>{t('destinationsSection.yachtsCount', { count: yachtCount })}</p>
      </div>
    </Link>
  );
};

export default DestinationCard;
