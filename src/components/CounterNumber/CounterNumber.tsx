'use client';

import { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';
import { useLocale } from 'next-intl';

import colors from '@/styles/themes/colors';

interface CounterNumberProps {
  target: number;
  /** Text after the number ("+" for a rounded-down count, "★" for a rating). */
  suffix?: string;
  /** Fraction digits shown (1 for a 4.9 rating). */
  decimals?: number;
}

const CounterNumber = ({ target, suffix = '+', decimals = 0 }: CounterNumberProps) => {
  // Start at the target so the server HTML carries the real number (it used
  // to render "0+" for crawlers and no-JS readers); the count-up restarts
  // from 0 once the counter scrolls into view.
  const [count, setCount] = useState(target);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  // Page-locale digits ("12,000+" in EN, "12.000+" in DE/HR) — the counter
  // was pinned to hr-HR and printed "12.000 +" on the English page.
  const format = new Intl.NumberFormat(useLocale(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const step = 10 ** decimals;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          setCount(0);

          let current = 0;
          const increment = target / 100;

          const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current * step) / step);
            }
          }, 20);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [target, started, step]);

  return (
    <Typography ref={ref} component="p" variant="h1" fontWeight={800} color={colors.blue500}>
      {format.format(count)}
      {suffix}
    </Typography>
  );
};

export default CounterNumber;
