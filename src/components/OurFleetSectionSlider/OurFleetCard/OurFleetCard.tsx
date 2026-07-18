import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { VESSEL_TYPE_CONFIG } from '@/config/ourFleet.config';
import { YachtFleet } from '@/models/yacht.model';

import styles from './OurFleetCard.module.scss';

// Jul-2026 (Mario): same overlay treatment as the destination cards — the
// photo fills the whole tile and the vessel-type name + count sit inside it
// over a navy bottom scrim. Plain HTML (no MUI Card/Typography), so the home
// grid stays hydration-free; the AboutUs slider renders the same card.
const OurFleetCard = ({ vesselType, yachtCount }: YachtFleet) => {
  const t = useTranslations('home.ourFleetSection');

  const config = VESSEL_TYPE_CONFIG[vesselType as keyof typeof VESSEL_TYPE_CONFIG];

  return (
    <Link href={`/search?boatTypes=${config.slug}`} className={styles.card}>
      <Image
        src={config.image.src}
        alt={t(config.image.alt)}
        fill
        sizes="(max-width: 600px) 80vw, 305px"
        className={styles.image}
        quality={65}
      />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <h3 className={styles.title}>{t(config.titleKey)}</h3>
        <p className={styles.count}>
          {yachtCount} {t('boat')}
        </p>
      </div>
    </Link>
  );
};

export default OurFleetCard;
