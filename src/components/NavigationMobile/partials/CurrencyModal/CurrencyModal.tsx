import { useEffect, useState } from 'react';

import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { updateUserPreferences } from '@/actions/user.actions';
import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import Check from '@/components/SvgIcons/Check';
import currencies from '@/config/currencies.config';
import { usePathname } from '@/i18n/navigation';
import { Currency, UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';

interface CurrencyModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  user?: UserModel;
}

const CurrencyModal = ({ isOpen, onOpen, onClose, user }: CurrencyModalProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { params } = useQueryParams();
  const t = useTranslations('common');

  const urlCurrency = params.currency as Currency;
  const currentCurrency = user?.currency || urlCurrency || Currency.EUR;

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currentCurrency);
  const [tempSelectedCurrency, setTempSelectedCurrency] = useState<Currency>(currentCurrency);

  useEffect(() => {
    setSelectedCurrency(currentCurrency);
    setTempSelectedCurrency(currentCurrency);
  }, [currentCurrency]);

  const handleConfirm = async () => {
    const currencyChanged = tempSelectedCurrency !== selectedCurrency;

    if (currencyChanged) {
      setSelectedCurrency(tempSelectedCurrency);
    }

    if (user?.id) {
      await updateUserPreferences({
        id: user.id,
        language: user.language,
        currency: tempSelectedCurrency,
        path: pathname,
      });
    }

    if (currencyChanged) {
      const currentParams = new URLSearchParams(searchParams.toString());

      if (tempSelectedCurrency === Currency.EUR) {
        currentParams.delete('currency');
      } else {
        currentParams.set('currency', tempSelectedCurrency);
      }

      const queryString = currentParams.toString();

      window.location.href = `${pathname}${queryString ? `?${queryString}` : ''}`;

      return;
    }

    onClose();
  };

  const handleCurrencySelect = (currencyId: string) => {
    setTempSelectedCurrency(currencyId as Currency);
  };

  return (
    <SwipeableModal
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={t('currency')}
      confirmBtnText={t('savePreferences')}
      onConfirm={handleConfirm}
      hideCancelButton
    >
      <List>
        {currencies.map(option => {
          const isSelected = tempSelectedCurrency === option.id;

          return (
            <ListItem
              key={option.id}
              sx={{ backgroundColor: isSelected ? colors.blue50 : 'transparent', borderRadius: '12px' }}
            >
              <ListItemButton onClick={() => handleCurrencySelect(option.id)}>
                <ListItemText primary={option.label} />
                {isSelected && <Check size={24} fill={colors.blue500} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </SwipeableModal>
  );
};

export default CurrencyModal;
