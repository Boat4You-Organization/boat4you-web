'use client';

import { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';

import colors from '@/styles/themes/colors';
import { formatNumber } from '@/utils/static/formatNumber';

const CounterNumber = ({ target, index }: { target: number; index: number }) => {
  // Start at the target so the server HTML carries the real number (it used
  // to render "0+" for crawlers and no-JS readers); the count-up restarts
  // from 0 once the counter scrolls into view.
  const [count, setCount] = useState(target);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

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
              setCount(Math.floor(current));
            }
          }, 20);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [target, started, index]);

  return (
    <Typography ref={ref} component="p" variant="h1" fontWeight={800} color={colors.blue500}>
      {formatNumber(count)}+
    </Typography>
  );
};

export default CounterNumber;
