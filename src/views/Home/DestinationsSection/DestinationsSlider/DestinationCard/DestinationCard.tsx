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

// Plain HTML + CSS (no MUI), zero client JS. Jun-2026: restyled to match the
// fleet (OurFleet) card — landscape image on top, name + yacht count below in
// dark text — so the destinations grid reads identically to the vessel-type
// grid (Mario: "isti dizajn kao plovila"). Was an overlay-text card.
const DestinationCard = ({ id, name, countryCode, yachtCount, priority = false }: DestinationCardProps) => {
  const t = useTranslations('home');
  const image = getImageByCountryCode(countryCode);
  const alt = getTranslationKeyByCountryCode(countryCode);

  const translationKey = getTranslationKeyByCountryCode(countryCode) || getTranslationKeyByDestinationName(name);
  const localizedName = translationKey ? t(translationKey) : name;

  return (
    <Link href={`/search?destinations=${name}&did=${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
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
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{localizedName}</h3>
        <p className={styles.count}>
          {yachtCount} {t('destinationsSection.yachts')}
        </p>
      </div>
    </Link>
  );
};

export default DestinationCard;
