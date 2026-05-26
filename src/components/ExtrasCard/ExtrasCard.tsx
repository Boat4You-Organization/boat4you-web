'use client';

import { useId, useRef } from 'react';

import { Box, Stack, Typography } from '@mui/material';
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
  const isObligatoryExtras = selectedOffer?.obligatoryExtrasKeys.includes(extraKey) || obligatory === true;
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
    // Flex row instead of MUI Grid: the previous 1/7/4 grid wrapped the
    // price column inconsistently — short titles ("Seabob fast charger")
    // left "50 € Per week" inline on a single baseline, while long titles
    // ("Portable refrigerator…") forced the price + period to wrap onto two
    // lines. Mario flagged this on mobile (Apr-2026): rows looked uneven
    // and the checkbox sat too close to the title because the 1-col cell
    // was only ~8% wide.
    //
    // The flex layout fixes both:
    //   - checkbox is a fixed 24px box flush-left with deterministic gap
    //   - title takes the remaining flex space (multi-line wrap is fine
    //     since the price column is independent)
    //   - price column is a vertical stack (amount on top, period below)
    //     anchored top-right so it never re-wraps based on title length
    <Box
      component="article"
      onClick={handleContainerClick}
      className={clsx(styles.container, {
        [styles.selected]: isSelected,
        [styles.obligatory]: isObligatoryExtras,
        [styles.disabled]: !selectedOffer,
      })}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 1.25, sm: 1.5 },
        px: 2,
        py: 1.5,
        borderRadius: 1.5,
      }}
    >
      <Box ref={checkboxContainerRef} sx={{ flexShrink: 0, mt: '-2px' /* visual centering vs title */ }}>
        <Checkbox
          checked={isChecked}
          value={isChecked}
          onChange={handleCheckboxChange}
          disabled={isDisabled}
          slotProps={{ input: { 'aria-labelledby': labelId } }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          id={labelId}
          component="h3"
          variant="body1"
          fontWeight={700}
          color={colors.black950}
          sx={{ wordBreak: 'break-word' }}
        >
          {extras ? servicesT(extras.labelCode as YachtServiceExtrasKey) : name}
        </Typography>
        {description && (
          <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25, whiteSpace: 'pre-line' }}>
            {description}
          </Typography>
        )}
      </Box>
      <Stack
        direction="column"
        alignItems="flex-end"
        sx={{ flexShrink: 0, textAlign: 'right', minWidth: { xs: 64, sm: 80 } }}
      >
        <Stack direction="row" alignItems="baseline" gap={0.5} flexWrap="nowrap">
          {isStartingPrice && (
            <Typography variant="body2" color={colors.black500}>
              {t('from')}
            </Typography>
          )}
          <Typography
            color={colors.black950}
            component="p"
            variant="body1"
            fontWeight={700}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {displayPrice}
          </Typography>
        </Stack>
        <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
          {t(UNIT_LABEL_MAP[unit])}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ExtrasCard;
