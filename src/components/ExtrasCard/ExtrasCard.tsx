'use client';

import { useId, useRef } from 'react';

import { Grid, Stack, Typography } from '@mui/material';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import Checkbox from '@/components/Checkbox';
import { UNIT_LABEL_MAP, YachtServiceExtrasKey, YachtServiceModel } from '@/models/yacht-service.model';
import colors from '@/styles/themes/colors';
import { useYachtPriceCalculation } from '@/utils/hooks/useYachtPriceCalculation';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { addExtra, removeExtra } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './ExtrasCard.module.scss';

interface ExtrasCardProps extends Omit<YachtServiceModel, 'key'> {
  yachtSlug: string;
  extraKey: string;
}

const ExtrasCard = ({
  name,
  priceEur,
  priceInfo,
  extras,
  yachtSlug,
  unit,
  extraKey,
  isStartingPrice,
}: ExtrasCardProps) => {
  const { selectedOffer, selectedExtrasKeys } = useYachtStore();
  const { calculatePrice } = useYachtPriceCalculation();
  const t = useTranslations('common');
  const servicesT = useTranslations('yacht.servicesList');
  const checkboxContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const labelId = useId();

  const isObligatoryExtras = selectedOffer?.obligatoryExtrasKeys.includes(extraKey);
  const isSelected = selectedExtrasKeys.includes(extraKey);
  const isDisabled = isObligatoryExtras || !selectedOffer;

  const displayPrice = formatPriceWithCurrency({
    clientPriceEur: priceEur,
    clientPriceInfo: priceInfo,
    locale,
  });

  const handleToggle = async () => {
    if (isObligatoryExtras) {
      return;
    }

    let newSelectedExtrasKeys: string[];

    if (isSelected) {
      newSelectedExtrasKeys = selectedExtrasKeys.filter(key => key !== extraKey);
      removeExtra(extraKey);
    } else {
      newSelectedExtrasKeys = [...selectedExtrasKeys, extraKey];
      addExtra(extraKey);
    }

    if (selectedOffer) {
      calculatePrice(yachtSlug, newSelectedExtrasKeys);
    }
  };

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) {
      return;
    }

    if (checkboxContainerRef.current && checkboxContainerRef.current.contains(event.target as Node)) {
      return;
    }

    handleToggle();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCheckboxChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) {
      return;
    }

    handleToggle();
  };

  const isChecked = isObligatoryExtras || isSelected;

  return (
    <Grid
      component="article"
      container
      alignItems={{ xs: 'flex-start', lg: 'center' }}
      borderRadius={3}
      p={3}
      spacing={2}
      onClick={handleContainerClick}
      className={clsx(styles.container, {
        [styles.selected]: isSelected,
        [styles.obligatory]: isObligatoryExtras,
        [styles.disabled]: !selectedOffer,
      })}
    >
      <Grid ref={checkboxContainerRef} size={{ xs: 2, lg: 1 }}>
        <Checkbox
          checked={isChecked}
          value={isChecked}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
          slotProps={{ input: { 'aria-labelledby': labelId } }}
        />
      </Grid>
      <Grid size={{ xs: 10, lg: 8 }}>
        <Typography id={labelId} component="h3" variant="h4" color={colors.black950}>
          {extras ? servicesT(extras.labelCode as YachtServiceExtrasKey) : name}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, lg: 3 }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1}>
          <Typography variant="body1" color={colors.black500} textAlign="end">
            {isStartingPrice && t('from')}
          </Typography>
          <Typography color={colors.green500} component="p" variant="h2" textAlign="end">
            {displayPrice}
          </Typography>
        </Stack>
        <Typography variant="body1" color={colors.black500} textAlign="end" pt={0.5}>
          {t(UNIT_LABEL_MAP[unit])}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ExtrasCard;
