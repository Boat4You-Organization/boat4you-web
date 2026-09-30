import { CSSProperties, ReactNode, memo } from 'react';

import { PromoSky as PromoSkyConfig } from '@/config/campaigns.config';

import styles from './PromoBanner.module.scss';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// Same palettes and markup as the prototype's sky().
const CONFETTI = ['#ffd60a', '#ffffff', '#ffb3d1', '#7ee0ff', '#b9f59b'];
const BALLOONS = ['#ffd60a', '#ffffff', '#ffb3d1', '#7ee0ff'];
const FIREWORKS = ['#ffd60a', '#ffffff', '#ff9ad5', '#7ee0ff'];
const RAYS = 12;

const CLOUD_PATH = 'M18 34h84a14 14 0 0 0 0-28 20 20 0 0 0-37-4 16 16 0 0 0-29 10A11 11 0 0 0 18 34z';

/** Park–Miller generator: the prototype's rnd(), so a campaign's seed gives the approved layout. Pure and
 *  deterministic, so the server and the browser render the same markup (no hydration mismatch). */
const seeded = (seed: number) => {
  let s = seed;

  return () => {
    s = (s * 16807) % 2147483647;

    return s / 2147483647;
  };
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const pct = (n: number) => `${r2(n)}%`;
const sec = (n: number) => `${r2(n)}s`;

/** Clouds, gulls, stars, snow, confetti, balloons, price tags, lightning, fireworks and heat shimmer, drawn
 *  in the prototype's order so every random draw lands on the same element. */
const skyNodes = (sky: PromoSkyConfig): ReactNode[] => {
  const rnd = seeded(sky.seed);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < (sky.clouds ?? 0); i += 1) {
    const style: Vars = { top: pct(6 + rnd() * 30), '--t': sec(48 + rnd() * 40), '--dl': sec(-rnd() * 60) };

    style['--s'] = (0.6 + rnd() * 0.8).toFixed(2);
    nodes.push(
      <svg key={`cloud${i}`} className={styles.cloud} style={style} viewBox="0 0 120 40" width="120" height="40">
        <path d={CLOUD_PATH} />
      </svg>
    );
  }

  for (let i = 0; i < (sky.gulls ?? 0); i += 1) {
    const style: Vars = { top: pct(14 + rnd() * 26), '--t': sec(14 + rnd() * 10), '--dl': sec(-rnd() * 20) };

    style.width = `${r2(20 + rnd() * 14)}px`;
    nodes.push(
      <div key={`gull${i}`} className={styles.gull} style={style}>
        <svg viewBox="0 0 36 14">
          <path d="M2 10 Q10 1 18 9 Q26 1 34 10" />
        </svg>
      </div>
    );
  }

  for (let i = 0; i < (sky.stars ?? 0); i += 1) {
    const style: Vars = { top: pct(4 + rnd() * 58), left: pct(2 + rnd() * 94) };

    style['--t'] = sec(2 + rnd() * 3);
    style['--dl'] = sec(-rnd() * 4);
    nodes.push(<i key={`star${i}`} className={styles.star} style={style} />);
  }

  for (let i = 0; i < (sky.snow ?? 0); i += 1) {
    const style: Vars = { left: pct(rnd() * 100), '--s': `${r2(3 + rnd() * 4)}px` };

    style['--t'] = sec(7 + rnd() * 7);
    style['--dl'] = sec(-rnd() * 12);
    style.opacity = (0.5 + rnd() * 0.45).toFixed(2);
    nodes.push(<i key={`flake${i}`} className={styles.flake} style={style} />);
  }

  for (let i = 0; i < (sky.confetti ?? 0); i += 1) {
    const style: Vars = { left: pct(rnd() * 100), '--c': CONFETTI[i % CONFETTI.length] };

    style['--t'] = sec(6 + rnd() * 6);
    style['--dl'] = sec(-rnd() * 10);
    nodes.push(<i key={`conf${i}`} className={styles.conf} style={style} />);
  }

  for (let i = 0; i < (sky.balloons ?? 0); i += 1) {
    const style: Vars = { left: pct(36 + rnd() * 34), '--c': BALLOONS[i % BALLOONS.length] };

    style['--t'] = sec(10 + rnd() * 6);
    style['--dl'] = sec(-rnd() * 14);
    nodes.push(<i key={`balloon${i}`} className={styles.balloon} style={style} />);
  }

  for (let i = 0; i < (sky.tags ?? 0); i += 1) {
    const style: Vars = { top: pct(8 + rnd() * 55), left: pct(40 + rnd() * 55) };

    style['--t'] = sec(6 + rnd() * 5);
    style['--dl'] = sec(-rnd() * 8);
    nodes.push(
      <div key={`tag${i}`} className={styles.tag} style={style}>
        <svg viewBox="0 0 26 16">
          <path d="M1 3a2 2 0 0 1 2-2h14l8 7-8 7H3a2 2 0 0 1-2-2z" fill="#FFB703" />
          <circle cx="18" cy="8" r="1.8" fill="#3b2f70" />
        </svg>
      </div>
    );
  }

  for (let i = 0; i < (sky.bolts ?? 0); i += 1) {
    const style: Vars = { top: pct(6 + rnd() * 30), left: pct(48 + rnd() * 42) };

    style['--t'] = sec(2.6 + rnd() * 2);
    style['--dl'] = sec(-rnd() * 3);
    nodes.push(
      <div key={`bolt${i}`} className={styles.bolt} style={style}>
        <svg viewBox="0 0 30 52">
          <path d="M18 0 2 30h11L8 52 28 18H16L22 0z" />
        </svg>
      </div>
    );
  }

  for (let i = 0; i < (sky.fireworks ?? 0); i += 1) {
    const color = FIREWORKS[i % FIREWORKS.length];
    const delay = sec(-(rnd() * 2.8));
    const rays: ReactNode[] = [];

    for (let r = 0; r < RAYS; r += 1) {
      rays.push(<i key={r} style={{ '--r': `${r * 30}deg`, '--c': color, '--dl': delay } as Vars} />);
    }

    nodes.push(
      <div key={`fw${i}`} className={styles.fw} style={{ top: pct(2 + rnd() * 30), left: pct(44 + rnd() * 46) }}>
        {rays}
      </div>
    );
  }

  if (sky.heat) nodes.push(<div key="heat" className={styles.heat} />);

  return nodes;
};

/** The sky layer of the banner scene. Memoised: the config object is static, so the up to ~80 elements are built
 *  once per banner and skipped by every later render (count-up, countdown ticks). */
const PromoSky = memo(({ sky }: { sky: PromoSkyConfig }) => <>{skyNodes(sky)}</>);

PromoSky.displayName = 'PromoSky';

export default PromoSky;
