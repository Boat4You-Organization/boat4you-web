'use client';

import { useEffect, useState } from 'react';

import styles from './PromoBanner.module.scss';

const DURATION_MS = 1100;

interface CountUpPctProps {
  value: number;
  /** Starts the count from 0 (once the banner is in view); until then, and on the server, the final value shows. */
  play: boolean;
  onDone?: () => void;
  className?: string;
}

/**
 * The sticker's "30%", counted up from 0 with an ease-out when the banner scrolls into view (as in the
 * prototype). While it counts, every digit (and each missing leading digit) sits in a box one "0" wide, since
 * Raleway has no tabular figures: the text keeps its width and nothing in the centred sticker wobbles. At rest the
 * number is plain text again, with the font's own spacing.
 */
const CountUpPct = ({ value, play, onDone, className }: CountUpPctProps) => {
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (!play) return undefined;

    let frame = 0;
    const start = performance.now();
    const step = (time: number) => {
      // the first rAF timestamp can be earlier than `start`: never below 0 (no "-1%" frame)
      const k = Math.min(1, Math.max(0, (time - start) / DURATION_MS));

      if (k < 1) {
        setShown(Math.round(value * (1 - (1 - k) ** 3)));
        frame = requestAnimationFrame(step);
      } else {
        setShown(null);
        onDone?.();
      }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [play, value, onDone]);

  if (shown == null) return <span className={className}>{`${value}%`}</span>;

  const digits = String(shown).padStart(String(value).length, ' ');

  return (
    <span className={className}>
      {[...digits].map((ch, i) => (
        // eslint-disable-next-line react/no-array-index-key -- one box per digit position
        <span key={i} className={styles.digit}>
          {ch.trim()}
        </span>
      ))}
      %
    </span>
  );
};

export default CountUpPct;
