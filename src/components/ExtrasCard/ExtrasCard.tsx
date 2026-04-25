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
  obligatory,
  description,
}: ExtrasCardProps) => {
  const { selectedOffer, selectedExtrasKeys } = useYachtStore();
  const { calculatePrice } = useYachtPriceCalculation();
  const t = useTranslations('common');
  const servicesT = useTranslations('yacht.servicesList');
  const checkboxContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const labelId = useId();

  // Offer-level `obligatoryExtrasKeys` is authoritative when present (it
  // folds in per-period partner logic), but a chunk of synced yachts sends
  // an empty array even when the item is obligatory at yacht level. Fall
  // back to the per-extra `obligatory` flag so Captain/Chef/APA on crewed
  // yachts don't silently flip to "optional".
  const isObligatoryExtras =
    selectedOffer?.obligatoryExtrasKeys.includes(extraKey) || obligatory === true;
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
      alignItems="center"
      borderRadius={1.5}
      px={2}
      py={0.75}
      spacing={1.5}
      onClick={handleContainerClick}
      className={clsx(styles.container, {
        [styles.selected]: isSelected,
        [styles.obligatory]: isObligatoryExtras,
        [styles.disabled]: !selectedOffer,
      })}
    >
      <Grid ref={checkboxContainerRef} size={{ xs: 1 }}>
        <Checkbox
          checked={isChecked}
          value={isChecked}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
          slotProps={{ input: { 'aria-labelledby': labelId } }}
        />
      </Grid>
      <Grid size={{ xs: 7, lg: 8 }}>
        <Typography id={labelId} component="h3" variant="body1" fontWeight={700} color={colors.black950}>
          {extras ? servicesT(extras.labelCode as YachtServiceExtrasKey) : name}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color={colors.black500}
            sx={{ fontSize: 12, mt: 0.25, whiteSpace: 'pre-line' }}
          >
            {description}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 4, lg: 3 }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="baseline" gap={0.5} flexWrap="wrap">
          {isStartingPrice && (
            <Typography variant="body2" color={colors.black500}>
              {t('from')}
            </Typography>
          )}
          <Typography color={colors.black950} component="p" variant="body1" fontWeight={700}>
            {displayPrice}
          </Typography>
          <Typography variant="body2" color={colors.black500}>
            {t(UNIT_LABEL_MAP[unit])}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ExtrasCard;
