import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import {
  getImageByCountryCode,
  getTranslationKeyByCountryCode,
  getTranslationKeyByDestinationName,
} from '@/config/destinations.config';
import { CountryCountModel } from '@/models/locations.model';

import styles from './DestinationCard.module.scss';

interface DestinationCardProps extends CountryCountModel {
  priority?: boolean;
}

// Plain HTML + CSS (no MUI). Rendered 40-60× in the destinations rail, so
// each MUI Card/CardMedia/Typography instance multiplied the home's hydration
// cost. As semantic markup it ships zero client JS — the LCP/TBT win that the
// section-level changes alone couldn't reach. Currency is no longer read off
// useSearchParams (see note: that also forced the whole home dynamic).
const DestinationCard = ({ id, name, countryCode, yachtCount, priority = false }: DestinationCardProps) => {
  const t = useTranslations('home');
  const image = getImageByCountryCode(countryCode);
  const alt = getTranslationKeyByCountryCode(countryCode);

  const translationKey = getTranslationKeyByCountryCode(countryCode) || getTranslationKeyByDestinationName(name);
  const localizedName = translationKey ? t(translationKey) : name;

  return (
    <Link href={`/search?destinations=${name}&did=${id}`} className={cx(styles.root, styles.container)}>
      <div className={styles.imageWrapper}>
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes="(max-width: 600px) 80vw, 305px"
          className={styles.image}
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          quality={65}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{localizedName}</h3>
        <p className={styles.count}>
          {yachtCount} {t('destinationsSection.yachts')}
        </p>
      </div>
      <div className={styles.overlay} />
    </Link>
  );
};

export default DestinationCard;
