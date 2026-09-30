import styles from './PromoBanner.module.scss';

/** One wave band 600 units wide (period 100) inside a 400-unit viewBox, so
 *  sliding it left by exactly one period loops without a seam. */
const wavePath = (y: number, amp: number) => {
  let d = `M0 ${y} Q25 ${y - amp} 50 ${y}`;

  for (let x = 100; x <= 600; x += 50) d += ` T${x} ${y}`;

  return `${d} V40 H0 Z`;
};

const BACK_WAVE = wavePath(16, 13);
const FRONT_WAVE = wavePath(20, 15);

export const SeaBack = () => (
  <svg className={`${styles.sea} ${styles.seaBack}`} viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
    <path className={styles.waveBack} d={BACK_WAVE} />
  </svg>
);

export const SeaFront = () => (
  <svg className={styles.sea} viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
    <path className={styles.waveFront} d={FRONT_WAVE} />
  </svg>
);

/** Sailboat crossing the banner between the two wave bands; hull in the
 *  campaign accent (--accent), sails white. */
export const Sailboat = () => (
  <div className={styles.boatLane} aria-hidden>
    <svg className={styles.boat} viewBox="0 0 60 56">
      <path className={styles.mast} d="M29.5 3 V44" />
      <path className={styles.sail} d="M31 6 Q45 22 52 41 H31 Z" />
      <path className={styles.jib} d="M28 13 Q20 27 12 41 H28 Z" />
      <path className={styles.hull} d="M5 44 H56 Q52 51 46 53 H15 Q9 51 5 44 Z" />
    </svg>
  </div>
);

export const Gulls = () => (
  <svg className={styles.gulls} viewBox="0 0 64 30" aria-hidden>
    <path className={styles.gull} d="M2 12 Q8 4 14 11 Q20 4 26 12" />
    <path className={styles.gull} d="M36 22 Q41 16 46 21 Q51 16 56 22" />
  </svg>
);
