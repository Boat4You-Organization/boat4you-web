'use client';

import { CSSProperties, Fragment, ReactNode, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useFormatter, useLocale, useTranslations } from 'next-intl';

import { PromoCampaign } from '@/config/campaigns.config';

import styles from './PromoBanner.module.scss';
import { campaignClock } from './campaignClock';

const DATE_FORMAT = { day: 'numeric', month: 'short', timeZone: 'UTC' } as const;

/** Day letter of the countdown ("3d 11:40:52"): the word for "day" starts with another letter in these
 *  languages (Tag, jour, giorno); every other locale keeps "d". */
const DAY_UNIT: Record<string, string> = { de: 'T', fr: 'j', it: 'g' };

/** Stands in for {time} in the translated sentence, which is then split around it (ASCII, never in a message). */
const TIME_SLOT = '@@time@@';

/** Every digit in a box one "0" wide: Raleway has no tabular figures, so a ticking clock would change width (and
 *  wobble in the centred pill) every second. */
const boxDigits = (text: string) =>
  [...text].map((ch, i) =>
    /\d/.test(ch) ? (
      // eslint-disable-next-line react/no-array-index-key -- fixed-length clock text, re-rendered every second
      <span key={i} className={styles.digit}>
        {ch}
      </span>
    ) : (
      // eslint-disable-next-line react/no-array-index-key -- see above
      <Fragment key={i}>{ch}</Fragment>
    )
  );

/** Clear space kept between the pill and the sticker's edge (px); the sticker morphs, so its curve moves a little. */
const EDGE_PX = 2;

/**
 * Scale (<= 1) at which the pill fits inside the sticker's curve. The sticker is close to an ellipse over its box
 * and the pill sits below its centre, where the curve narrows: the check is at 70% of the pill's half-height below
 * the pill's centre, where its rounded end is 0.286 of that half-height narrower than its box. Layout sizes (offset*)
 * are used, so the sticker's morph and tilt do not count (nor the pill's own scale). Re-measured whenever the pill
 * (new text, web font arrived) or the sticker (container resize) changes size; the ticking digits do not.
 */
const useStickerFit = (pillRef: RefObject<HTMLSpanElement | null>) => {
  const [fit, setFit] = useState(1);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    const sticker = pill?.offsetParent;

    if (!pill || !(sticker instanceof HTMLElement) || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const a = sticker.offsetWidth / 2;
      const b = sticker.offsetHeight / 2;
      const r = pill.offsetHeight / 2;
      const dy = pill.offsetTop + 1.7 * r - b;
      const room = 2 * (a * Math.sqrt(Math.max(0, 1 - (dy / b) ** 2)) - EDGE_PX);

      setFit(Math.min(1, room / (pill.offsetWidth - 0.572 * r)));
    };
    const ro = new ResizeObserver(measure);

    ro.observe(sticker);
    ro.observe(pill);

    return () => ro.disconnect();
  }, [pillRef]);

  return fit;
};

interface DeadlinePillProps {
  campaign: PromoCampaign;
  /** The page showed the campaign as the running one (not the deals landing): see campaignClock's 'ended'. */
  current?: boolean;
}

/**
 * The campaign clock in the discount sticker: "Book by 31 May", a ticking "Ends in 3d 11:40:52" in the last
 * 14 days, or "Starts 1 Jun" for a campaign that is not running. Rendered only after mount (the server's clock,
 * time zone and ISR cache age would not match the browser); until then an invisible placeholder keeps the
 * sticker's layout, so the percentage above it does not move. With days left, the seconds sit in their own span,
 * which the CSS hides below 900px, where the sticker is too narrow for "Mancano 8g 20:08:08".
 */
const DeadlinePill = ({ campaign, current = false }: DeadlinePillProps) => {
  const t = useTranslations('promo');
  const format = useFormatter();
  const dayUnit = DAY_UNIT[useLocale()] ?? 'd';
  const [now, setNow] = useState<number | null>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const clock = now == null ? null : campaignClock(campaign, now, current);
  const live = clock?.kind === 'endsIn';

  // Tick only while the countdown shows (last 14 days); otherwise the text is static.
  useEffect(() => {
    if (!live) return undefined;

    const id = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(id);
  }, [live]);

  let text: ReactNode = '\u00a0'; // no-break space: the placeholder keeps the pill's line height

  if (clock?.kind === 'startsOn') text = t('banner.startsOn', { date: format.dateTime(clock.date, DATE_FORMAT) });

  if (clock?.kind === 'bookBy') text = t('banner.bookBy', { date: format.dateTime(clock.date, DATE_FORMAT) });

  if (clock?.kind === 'endsIn' || clock?.kind === 'ended') {
    const [before, after = ''] = t('banner.endsIn', { time: TIME_SLOT }).split(TIME_SLOT);
    const { days, time } = clock.kind === 'endsIn' ? clock : { days: 0, time: '00:00:00' };
    const hhmm = time.slice(0, 5);
    const seconds = time.slice(5);

    // The clock in one no-wrap span: the boxed digits are inline-blocks, so a pill that wraps (below 900px) could
    // otherwise break inside the time ("Ends in 10d 1" / "1:59"); now it breaks only before the clock.
    text = (
      <>
        {before}
        <span className={styles.clock}>
          {days > 0 && boxDigits(`${days}${dayUnit} `)}
          {boxDigits(hhmm)}
          {days > 0 ? <span className={styles.secs}>{boxDigits(seconds)}</span> : boxDigits(seconds)}
        </span>
        {after}
      </>
    );
  }

  const fit = useStickerFit(pillRef);
  const style: CSSProperties & { '--fit'?: number } = clock ? {} : { visibility: 'hidden' };

  if (fit < 1) style['--fit'] = Math.floor(fit * 1000) / 1000;

  return (
    <span ref={pillRef} className={styles.when} style={style}>
      {live && <span className={styles.dot} />}
      <span>{text}</span>
    </span>
  );
};

export default DeadlinePill;
