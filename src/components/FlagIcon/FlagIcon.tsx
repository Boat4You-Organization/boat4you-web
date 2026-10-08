'use client';

import { useState } from 'react';

import { Box } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import Location from '@/components/SvgIcons/Location';
import colors from '@/styles/themes/colors';
import { countryDisplayName } from '@/utils/static/countryDisplayName';

import styles from './FlagIcon.module.scss';

const isValidCountryCode = (code: string) => /^[a-zA-Z]{2}$/.test(code);

const FlagIcon = ({ countryCode }: { countryCode?: string | null }) => {
  const [hasError, setHasError] = useState(false);
  const t = useTranslations('common');
  const locale = useLocale();

  if (!countryCode || !isValidCountryCode(countryCode) || hasError) {
    return <Location fill={colors.blue300} size={24} />;
  }

  return (
    <Box className={styles.countryWrapper}>
      <Image
        loading="lazy"
        fill
        sizes="auto"
        src={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`}
        alt={t('a11y.flagOf', { country: countryDisplayName(countryCode, locale) })}
        className={styles.country}
        onError={() => setHasError(true)}
      />
    </Box>
  );
};

export default FlagIcon;
