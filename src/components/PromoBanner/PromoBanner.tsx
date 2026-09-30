'use client';

import { CSSProperties, MouseEvent, useCallback, useEffect, useId, useRef, useState } from 'react';

import cx from 'clsx';
import { useTranslations } from 'next-intl';

import { PromoCampaign, getActiveCampaign } from '@/config/campaigns.config';
import { Link } from '@/i18n/navigation';
import { fetchCampaignMaxPct } from '@/services/promo.service';

import CountUpPct from './CountUpPct';
import DeadlinePill from './DeadlinePill';
import styles from './PromoBanner.module.scss';
import PromoSky from './PromoSky';
import { DEALS_LIST_ID, PROMO_ART_SIZE, promoArtSrc, titleLongestWordEm } from './constants';

interface PromoBannerProps {
  /** Defaults to the calendar-active campaign; renders nothing when none is. */
  campaign?: PromoCampaign | null;
  /** Server-resolved "up to X%". Omit to fetch it client-side. */
  initialPct?: number | null;
  /** Shorter strip above the first boat of a listing (replaced RiskFreeCTA, 12.7.2026). */
  compact?: boolean;
  /** b4y home: a tile in the destinations grid, one card row tall (Mario 12.7.2026 — blend in). */
  tile?: boolean;
  /** Sister home: a full-width strip of content height. */
  strip?: boolean;
  /** The deals landing hero renders the banner without the self-link; its CTA scrolls to the deals list. */
  clickable?: boolean;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Parallax depth of each scene layer (how far it follows the pointer), as in the prototype. */
const depth = (d: number): Vars => ({ '--d': d });
const DEPTH = {
  sun: depth(0.15),
  sky: depth(0.25),
  seaFar: depth(0.3),
  boat: depth(0.45),
  seaMid: depth(0.6),
  dude: depth(1),
  seaNear: depth(0.8),
  blob: depth(0.5),
};

const SEA_FAR = (
  <svg className={cx(styles.sea, styles.far)} viewBox="0 0 800 60" preserveAspectRatio="none">
    <path d="M0 22 Q50 8 100 22 T200 22 T300 22 T400 22 T500 22 T600 22 T700 22 T800 22 V60 H0 Z" />
  </svg>
);
const SEA_MID = (
  <svg className={cx(styles.sea, styles.mid)} viewBox="0 0 800 40" preserveAspectRatio="none">
    <path d="M0 18 Q25 6 50 18 T100 18 T150 18 T200 18 T250 18 T300 18 T350 18 T400 18 T450 18 T500 18 T550 18 T600 18 T650 18 T700 18 T750 18 T800 18 V40 H0 Z" />
  </svg>
);
const SEA_NEAR = (
  <svg className={cx(styles.sea, styles.near)} viewBox="0 0 800 40" preserveAspectRatio="none">
    <path d="M0 20 Q25 5 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20 T450 20 T500 20 T550 20 T600 20 T650 20 T700 20 T750 20 T800 20 V40 H0 Z" />
  </svg>
);
const ARROW = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const saveData = () => (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/** Runs `cb` when the main thread is idle (Safari has no requestIdleCallback: short timeout). Returns a cancel. */
const whenIdle = (cb: () => void) => {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout: 3000 });

    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(cb, 400);

  return () => window.clearTimeout(id);
};

/** The deals landing CTA scrolls to the deals list by script: a native in-page jump would push a history entry that
 *  Next's router skips (null state), so Back after a later client navigation would change only the URL. The href
 *  stays for the no-JS case. */
const scrollToDeals = (event: MouseEvent<HTMLAnchorElement>) => {
  const target = document.getElementById(DEALS_LIST_ID);

  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

const formatOf = ({ compact, tile, strip }: Pick<PromoBannerProps, 'compact' | 'tile' | 'strip'>) => {
  if (compact) return 'fmt-compact';

  if (tile) return 'fmt-tile';

  if (strip) return 'fmt-strip';

  return 'fmt-hero';
};

/**
 * Animated campaign banner (Mario 30.9.2026): gradient sky with parallax layers, an animated character and boat
 * (public/promo loops), a morphing "up to X%" sticker with the campaign clock, and the copy with a CTA. Markup
 * and class names follow the approved prototype 1:1 (see PromoBanner.module.scss). The server renders the
 * complete scene with static posters; after mount, near the viewport and when the browser is idle, the posters
 * swap to the animated loops (not with reduced motion or data saver).
 */
const PromoBanner = ({
  campaign = getActiveCampaign(),
  initialPct,
  compact,
  tile,
  strip,
  clickable = true,
}: PromoBannerProps) => {
  const t = useTranslations('promo');
  const [pct, setPct] = useState<number | null>(initialPct ?? null);
  const [inView, setInView] = useState(false);
  const [popped, setPopped] = useState(false);
  const [animated, setAnimated] = useState({ dude: false, boat: false });
  const [paused, setPaused] = useState(false);
  const ids = useId();
  const bannerRef = useRef<HTMLAnchorElement & HTMLDivElement>(null);
  const dudeRef = useRef<HTMLSpanElement>(null);

  const shouldFetch = campaign != null && initialPct === undefined;

  useEffect(() => {
    if (!shouldFetch || !campaign) return;

    fetchCampaignMaxPct(campaign).then(setPct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, campaign?.slug]);

  // Count the percentage up once the banner is 45% in view (the prototype's threshold).
  useEffect(() => {
    const el = bannerRef.current;

    if (!el || !('IntersectionObserver' in window) || prefersReducedMotion()) return undefined;

    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;

        setInView(true);
        io.disconnect();
      },
      { threshold: 0.45 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, [campaign]);

  // Pause the scene's endless CSS animations (sun glow, sticker morph, CTA shine, sky, sea) while the banner is
  // off-screen: they would repaint every frame, e.g. while the visitor scrolls the listing under the strip.
  useEffect(() => {
    const el = bannerRef.current;

    if (!el || !('IntersectionObserver' in window) || prefersReducedMotion()) return undefined;

    const io = new IntersectionObserver(entries => setPaused(!entries[entries.length - 1].isIntersecting));

    io.observe(el);

    return () => io.disconnect();
  }, [campaign]);

  // Swap the posters for the animated loops (~200–460 KB each) once the banner nears the viewport and the
  // browser is idle. Each loop is decoded off-screen first, so the poster stays until the first frame is ready;
  // a missing or undecodable file keeps the poster. A character hidden by the layout (listing strip below
  // 900px) is not fetched at all.
  useEffect(() => {
    const el = bannerRef.current;

    if (!el || !campaign || !('IntersectionObserver' in window) || prefersReducedMotion() || saveData()) {
      return undefined;
    }

    let cancelled = false;
    let cancelIdle = () => {};
    const load = (part: 'dude' | 'boat') => {
      const img = new Image();

      img.src = promoArtSrc(part === 'dude' ? campaign.art.character : campaign.art.boat, true);
      img
        .decode()
        .then(() => {
          if (!cancelled) setAnimated(prev => ({ ...prev, [part]: true }));
        })
        .catch(() => {});
    };
    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;

        io.disconnect();
        cancelIdle = whenIdle(() => {
          load('boat');

          if (dudeRef.current && getComputedStyle(dudeRef.current).display !== 'none') load('dude');
        });
      },
      { rootMargin: '200px 0px' }
    );

    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cancelIdle();
    };
  }, [campaign]);

  // Parallax: the layers follow the pointer by their depth. Mouse/pen on hover-capable devices only; the CSS
  // variables are written straight to the banner (one write per frame), so moving the pointer never re-renders.
  useEffect(() => {
    const el = bannerRef.current;

    if (!el || prefersReducedMotion() || !window.matchMedia('(hover: hover)').matches) return undefined;

    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      const r = el.getBoundingClientRect();

      px = ((e.clientX - r.left) / r.width) * 2 - 1;
      py = ((e.clientY - r.top) / r.height) * 2 - 1;
      queue();
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      queue();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [campaign]);

  const handleCounted = useCallback(() => setPopped(true), []);

  if (!campaign) return null;

  const { i18nKey, colors, art } = campaign;
  const title = t(`campaigns.${i18nKey}.title`);
  // Width of the longest title word in em: the CSS steps a translated title down until that word fits its column.
  const titleVars: Vars = { '--tw': titleLongestWordEm(title) };
  const cta = t(`campaigns.${i18nKey}.cta`);
  const vars: Vars = { '--bg': colors.bg, '--blob': colors.blob, '--blobText': colors.blobText, '--sun': colors.sun };
  const format = formatOf({ compact, tile, strip });
  // The deals hero is the top of its page (poster may be the LCP image); elsewhere the banner sits lower.
  const loading = format === 'fmt-hero' ? 'eager' : 'lazy';
  const [dudeWidth, dudeHeight] = PROMO_ART_SIZE[art.character];
  const [boatWidth, boatHeight] = PROMO_ART_SIZE[art.boat];

  const scene = (
    <>
      <div className={styles.plx} style={DEPTH.sun} aria-hidden>
        {art.sky.glow && <div className={styles.glow} />}
        {art.sky.sun && <div className={cx(styles.sun, art.sky.sun !== 'plain' && styles[art.sky.sun])} />}
      </div>
      <div className={styles.plx} style={DEPTH.sky} aria-hidden>
        <PromoSky sky={art.sky} />
      </div>
      <div className={styles.plx} style={DEPTH.seaFar} aria-hidden>
        {SEA_FAR}
      </div>
      <div className={styles.plx} style={DEPTH.boat} aria-hidden>
        <span className={cx(styles.boat, art.wideBoat && styles.wide)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- animated WebP loop swapped in after mount; the image optimizer would re-encode it */}
          <img
            src={promoArtSrc(art.boat, animated.boat)}
            alt=""
            width={boatWidth}
            height={boatHeight}
            decoding="async"
            loading={loading}
          />
        </span>
      </div>
      <div className={styles.plx} style={DEPTH.seaMid} aria-hidden>
        {SEA_MID}
      </div>
      <div className={styles.plx} style={DEPTH.dude} aria-hidden>
        <span ref={dudeRef} className={styles.dude}>
          {/* eslint-disable-next-line @next/next/no-img-element -- animated WebP loop swapped in after mount; the image optimizer would re-encode it */}
          <img
            src={promoArtSrc(art.character, animated.dude)}
            alt=""
            width={dudeWidth}
            height={dudeHeight}
            decoding="async"
            loading={loading}
          />
        </span>
      </div>
      <div className={styles.plx} style={DEPTH.seaNear} aria-hidden>
        {SEA_NEAR}
      </div>
      <div className={styles.plx} style={DEPTH.blob}>
        {/* Below the 15% floor (pct null) the sticker stays for balance and carries only the campaign clock. */}
        <span className={cx(styles.blob, !pct && styles.solo, popped && styles.pop)}>
          {!!pct && (
            <>
              <span className={styles.upto}>{t('banner.upTo')}</span>
              <CountUpPct className={styles.pct} value={pct} play={inView} onDone={handleCounted} />
            </>
          )}
          <DeadlinePill campaign={campaign} current={clickable} />
        </span>
      </div>
      <div className={styles.copy}>
        <p id={`${ids}t`} className={styles.title}>
          <span className={styles.titleFit} style={titleVars}>
            {title}
          </span>
        </p>
        <p id={`${ids}s`} className={styles.sub}>
          {pct ? t(`campaigns.${i18nKey}.subtitle`, { pct: String(pct) }) : t(`campaigns.${i18nKey}.subtitleNoPct`)}
        </p>
        {clickable ? (
          <span id={`${ids}c`} className={styles.cta}>
            {cta}
            {ARROW}
          </span>
        ) : (
          <a className={styles.cta} href={`#${DEALS_LIST_ID}`} onClick={scrollToDeals}>
            {cta}
            {ARROW}
          </a>
        )}
      </div>
    </>
  );

  return (
    <div className={cx(styles.frame, styles[format])}>
      {clickable ? (
        // Named by the title and the CTA, described by the subtitle (it carries the percentage); the sticker and the
        // ticking clock stay out of the name.
        <Link
          ref={bannerRef}
          href={`/deals/${campaign.slug}`}
          className={cx(styles.banner, paused && styles.paused)}
          style={vars}
          aria-labelledby={`${ids}t ${ids}c`}
          aria-describedby={`${ids}s`}
        >
          {scene}
        </Link>
      ) : (
        <div ref={bannerRef} className={cx(styles.banner, styles.static, paused && styles.paused)} style={vars}>
          {scene}
        </div>
      )}
    </div>
  );
};

export default PromoBanner;
