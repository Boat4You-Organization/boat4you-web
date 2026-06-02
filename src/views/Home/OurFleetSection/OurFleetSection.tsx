import { useTranslations } from 'next-intl';

import OurFleetCard from '@/components/OurFleetSectionSlider/OurFleetCard';
import { VESSEL_TYPE_CONFIG } from '@/config/ourFleet.config';
import { VesselType, YachtFleet } from '@/models/yacht.model';

import styles from './OurFleetSection.module.scss';

interface OurFleetSectionProps {
  fleet: YachtFleet[];
}

// Fixed display order (Mario, Jun-2026): 4 per row — Catamarans, Sailing yachts,
// Motorboats, Motor sailors / Motor yachts, Power catamarans, Luxury motor
// yachts, Gulets / Mini cruisers. Only types present in BOTH the curated config
// and the live fleet render.
const DISPLAY_ORDER: VesselType[] = [
  VesselType.CATAMARAN,
  VesselType.SAILING_YACHT,
  VesselType.MOTORBOAT,
  VesselType.MOTORSAILER,
  VesselType.MOTOR_YACHT,
  VesselType.POWER_CATAMARAN,
  VesselType.LUXURY_MOTOR_YACHT,
  VesselType.GULET,
  VesselType.MINI_CRUISER,
];

/**
 * "Get to know our fleet" — was a Swiper carousel (client + Swiper hydration,
 * one of the heaviest mobile costs). Replaced (Jun-2026) with a static 4-per-row
 * grid so the section is a server component with NO Swiper: same vessel-type
 * cards, no carousel JS. Mario: "makni karusel, stavi 4 vrste po redu".
 */
const OurFleetSection = ({ fleet }: OurFleetSectionProps) => {
  const t = useTranslations('home');

  const allowed = new Set(Object.keys(VESSEL_TYPE_CONFIG));
  const byType = new Map(fleet.map(entry => [entry.vesselType, entry]));
  const visible = DISPLAY_ORDER.filter(type => allowed.has(type) && byType.has(type)).map(type => byType.get(type)!);

  if (!visible.length) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {t('ourFleetSection.getToKnow')} <span className={styles.titleEmphasis}>{t('ourFleetSection.ourFleet')}</span>
      </h2>
      <p className={styles.subtitle}>{t('ourFleetSection.boatSelection')}</p>

      <div className={styles.grid}>
        {visible.map(boat => (
          <OurFleetCard key={boat.vesselType} {...boat} />
        ))}
      </div>
    </section>
  );
};

export default OurFleetSection;
