import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { VESSEL_TYPE_CONFIG } from '@/config/ourFleet.config';
import { Link } from '@/i18n/navigation';
import { YachtFleet } from '@/models/yacht.model';

import styles from './OurFleetCard.module.scss';

// Jul-2026 (Mario): same overlay treatment as the destination cards — the
// photo fills the whole tile and the vessel-type name + count sit inside it
// over a navy bottom scrim. Plain HTML (no MUI Card/Typography), so the home
// grid stays hydration-free; the AboutUs slider renders the same card.
//
// The type pages `/search?boatTypes=X` are noindex,follow (owner decision
// 26.9.2026, B04) and in no sitemap, so the card carries rel="nofollow" like
// the manufacturer tiles (audit 29.9.2026, R59) until the type pages are
// promoted with copy of their own — visitors still get the link.
const OurFleetCard = ({ vesselType, yachtCount }: YachtFleet) => {
  const t = useTranslations('home.ourFleetSection');

  const config = VESSEL_TYPE_CONFIG[vesselType as keyof typeof VESSEL_TYPE_CONFIG];

  return (
    <Link href={`/search?boatTypes=${config.slug}`} rel="nofollow" className={styles.card}>
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
        {yachtCount > 0 && <p className={styles.count}>{t('boatsCount', { count: yachtCount })}</p>}
      </div>
    </Link>
  );
};

export default OurFleetCard;
