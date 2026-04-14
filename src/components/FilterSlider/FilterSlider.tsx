'use client';

import { useEffect, useId, useMemo, useState } from 'react';

import { Box, Slider, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './FilterSlider.module.scss';

interface FilterSliderProps {
  min: number;
  max: number;
  title: string;
  step?: number;
  unit?: string;
  showHistogram?: boolean;
  minParamKey: string;
  maxParamKey: string;
  formatValue?: (value: number) => string;
  unboundedMax?: boolean;
}

const FilterSlider = ({
  min,
  max,
  title,
  step = 1,
  unit,
  showHistogram,
  minParamKey,
  maxParamKey,
  formatValue,
  unboundedMax,
}: FilterSliderProps) => {
  const { setMultipleParams } = useQueryParams();
  const rawSearchParams = useSearchParams();
  const { searchResults } = useYachtStore();
  const labelId = useId();

  const [range, setRange] = useState<[number, number]>(() => {
    const rawMin = rawSearchParams.get(minParamKey);
    const rawMax = rawSearchParams.get(maxParamKey);

    return [rawMin !== null ? Number(rawMin) : min, rawMax !== null ? Number(rawMax) : max];
  });

  useEffect(() => {
    const rawMin = rawSearchParams.get(minParamKey);
    const rawMax = rawSearchParams.get(maxParamKey);

    setRange([rawMin !== null ? Number(rawMin) : min, rawMax !== null ? Number(rawMax) : max]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawSearchParams, minParamKey, maxParamKey]);

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    const newRange = newValue as [number, number];

    setRange(newRange);
  };

  const handleRangeChangeCommitted = (
    event: React.SyntheticEvent<Element, Event> | Event,
    newValue: number | number[]
  ) => {
    const newRange = newValue as [number, number];
    const [minValue, maxValue] = newRange;

    const updates: Record<string, number | undefined> = {};

    updates[minParamKey] = minValue === min ? undefined : minValue;
    updates[maxParamKey] = maxValue === max ? undefined : maxValue;
    updates.page = 1;

    setMultipleParams(updates);
  };

  const barsWithColors = useMemo(() => {
    if (!showHistogram) {
      return [];
    }

    const isPriceFilter = minParamKey === 'minPrice' && maxParamKey === 'maxPrice';
    const isLengthFilter = minParamKey === 'minLength' && maxParamKey === 'maxLength';

    if (isPriceFilter && searchResults?.length > 0) {
      const priceRange = max - min;
      const bucketCount = 20;
      const bucketSize = priceRange / bucketCount;

      const histogramData = new Array(bucketCount).fill(0);

      for (let i = 0; i < searchResults.length; i += 1) {
        const price = searchResults[i].clientPriceEur;

        if (price >= min && price <= max) {
          const bucketIndex = Math.min(Math.floor((price - min) / bucketSize), bucketCount - 1);

          histogramData[bucketIndex] += 1;
        }
      }

      const maxHeight = Math.max(...histogramData);

      const [minRange, maxRange] = range;

      return histogramData.map((height, index) => {
        const barPosition = min + (index / (histogramData.length - 1)) * (max - min);

        let color = '';

        if (barPosition >= minRange && barPosition <= maxRange) {
          color = colors.blue500;
        } else {
          color = colors.blue100;
        }

        return {
          height: (height / maxHeight) * 100,
          color,
          position: barPosition,
        };
      });
    }

    if (isLengthFilter && searchResults?.length > 0) {
      const lengthRange = max - min;
      const bucketCount = 20;
      const bucketSize = lengthRange / bucketCount;

      const histogramData = new Array(bucketCount).fill(0);

      for (let i = 0; i < searchResults.length; i += 1) {
        const { lengthInfo } = searchResults[i];

        if (!lengthInfo?.amount) continue;

        const length = lengthInfo.amount;

        if (length >= min && length <= max) {
          const bucketIndex = Math.min(Math.floor((length - min) / bucketSize), bucketCount - 1);

          histogramData[bucketIndex] += 1;
        }
      }

      const maxHeight = Math.max(...histogramData);

      if (maxHeight === 0) {
        return [];
      }

      const [minRange, maxRange] = range;

      return histogramData.map((height, index) => {
        const barPosition = min + (index / (histogramData.length - 1)) * (max - min);

        let color = '';

        if (barPosition >= minRange && barPosition <= maxRange) {
          color = colors.blue500;
        } else {
          color = colors.blue100;
        }

        return {
          height: (height / maxHeight) * 100,
          color,
          position: barPosition,
        };
      });
    }

    const histogramData = [0, 0, 0, 0, 5, 6, 1, 4, 5, 7, 5, 1, 5, 0, 0, 0, 0, 0, 0, 0];
    const maxHeight = Math.max(...histogramData);
    const [minRange, maxRange] = range;

    return histogramData.map((height, index) => {
      const barPosition = min + (index / (histogramData.length - 1)) * (max - min);

      let color = '';

      if (barPosition >= minRange && barPosition <= maxRange) {
        color = colors.blue500;
      } else {
        color = colors.blue100;
      }

      return {
        height: (height / maxHeight) * 100,
        color,
        position: barPosition,
      };
    });
  }, [range, min, max, showHistogram, searchResults, minParamKey, maxParamKey]);

  return (
    <Box className={styles.container}>
      <Typography id={labelId} variant="body1" fontWeight={600} mb={2} className={styles.title}>
        {title}
      </Typography>

      {showHistogram && (
        <Box className={styles.histogramContainer}>
          {barsWithColors.map((bar, index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={styles.histogramBar}
              style={{
                height: `${bar.height}%`,
                backgroundColor: bar.color,
              }}
            />
          ))}
        </Box>
      )}

      <Box className={styles.sliderContainer}>
        <Slider
          aria-labelledby={labelId}
          value={range}
          onChange={handleRangeChange}
          onChangeCommitted={handleRangeChangeCommitted}
          min={min}
          max={max}
          step={step}
          className={styles.slider}
          disableSwap
        />

        <Box className={styles.valueLabelsContainer}>
          <Box className={styles.minValueLabel}>
            <Typography variant="body1" fontWeight={600} className={styles.valueText}>
              {formatValue ? formatValue(range[0]) : range[0]} {unit}
            </Typography>
          </Box>

          <Box className={styles.maxValueLabel}>
            <Typography variant="body1" fontWeight={600} className={styles.valueText}>
              {formatValue ? formatValue(range[1]) : range[1]}
              {unboundedMax && range[1] === max ? '+' : ''} {unit}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterSlider;
