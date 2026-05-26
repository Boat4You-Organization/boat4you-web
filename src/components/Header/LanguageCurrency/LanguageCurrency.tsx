'use client';

import React, { useEffect, useState } from 'react';

import { Icon, IconButton, SelectChangeEvent, Stack } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { updateUserPreferences } from '@/actions/user.actions';
import ModalRoot from '@/components/ModalRoot';
import Select from '@/components/Select/Select';
import LanguageIcon from '@/components/SvgIcons/Language';
import currencies from '@/config/currencies.config';
import { usePathname } from '@/i18n/navigation';
import { Currency, Language } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './LanguageCurrency.module.scss';

interface LanguageCurrencyProps {
  language?: Language;
  currency?: Currency;
  id?: number;
}

const LanguageCurrency = ({ language, currency, id }: LanguageCurrencyProps) => {
  const locale = useLocale();
  const normalizedLocale = locale.toUpperCase() as Language;
  const defaultLanguage = language || normalizedLocale;
  const pathname = usePathname();
  const { params } = useQueryParams();
  const searchParams = useSearchParams();
  const t = useTranslations('home');
  const [isOpen, toggleIsOpen] = useToggleState();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(defaultLanguage);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<Language>(defaultLanguage);

  const urlCurrency = params.currency as Currency;
  const currentCurrency = currency || urlCurrency || Currency.EUR;
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currentCurrency);
  const [tempSelectedCurrency, setTempSelectedCurrency] = useState<Currency>(currentCurrency);

  const locales = [
    { id: Language.ENGLISH, label: t('languageModal.languages.en') },
    { id: Language.FRENCH, label: t('languageModal.languages.fr') },
    { id: Language.GERMAN, label: t('languageModal.languages.de') },
    { id: Language.PORTUGUESE, label: t('languageModal.languages.pt') },
    { id: Language.ITALIAN, label: t('languageModal.languages.it') },
    { id: Language.SPANISH, label: t('languageModal.languages.es') },
    { id: Language.CROATIAN, label: t('languageModal.languages.hr') },
    { id: Language.POLISH, label: t('languageModal.languages.pl') },
    { id: Language.DUTCH, label: t('languageModal.languages.nl') },
  ];

  useEffect(() => {
    const currentLocale = locale.toUpperCase() as Language;

    setSelectedLanguage(currentLocale);
    setTempSelectedLanguage(currentLocale);
  }, [locale]);

  useEffect(() => {
    setSelectedCurrency(currentCurrency);
    setTempSelectedCurrency(currentCurrency);
  }, [currency, currentCurrency]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setTempSelectedLanguage(event.target.value as Language);
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setTempSelectedCurrency(event.target.value as Currency);
  };

  const handleConfirm = async () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    const currencyChanged = tempSelectedCurrency !== selectedCurrency;
    const languageChanged = tempSelectedLanguage !== selectedLanguage;

    if (currencyChanged) {
      setSelectedCurrency(tempSelectedCurrency);

      if (tempSelectedCurrency === Currency.EUR) {
        currentParams.delete('currency');
      } else {
        currentParams.set('currency', tempSelectedCurrency);
      }
    }

    if (languageChanged) {
      setSelectedLanguage(tempSelectedLanguage);
    }

    if (id) {
      await updateUserPreferences({
        id,
        language: tempSelectedLanguage,
        currency: tempSelectedCurrency,
        path: pathname,
      });
    }

    if (languageChanged) {
      const queryString = currentParams.toString();

      window.location.href = `/${tempSelectedLanguage}${pathname}${queryString ? `?${queryString}` : ''}`;

      return;
    }

    if (currencyChanged) {
      const queryString = currentParams.toString();

      window.location.href = `${pathname}${queryString ? `?${queryString}` : ''}`;

      return;
    }

    toggleIsOpen();
  };

  const handleClose = () => {
    setTempSelectedLanguage(selectedLanguage);
    setTempSelectedCurrency(selectedCurrency);
    toggleIsOpen();
  };

  return (
    <>
      <IconButton
        aria-label="language"
        classes={{ root: styles.iconButtonRoot }}
        className={styles.iconButton}
        onClick={toggleIsOpen}
      >
        <Icon>
          <LanguageIcon size={24} fill={colors.black950} />
        </Icon>
      </IconButton>
      <ModalRoot
        open={isOpen}
        title={t('languageModal.title')}
        onOpen={toggleIsOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmBtnText={t('languageModal.savePreferences')}
        hideCancelButton
        width={453}
      >
        <Stack gap={3}>
          <Select
            value={tempSelectedLanguage}
            options={locales}
            onChange={handleLanguageChange}
            label={t('languageModal.languageLabel')}
          />
          <Select
            value={tempSelectedCurrency}
            options={currencies}
            onChange={handleCurrencyChange}
            label={t('languageModal.currencyLabel')}
          />
        </Stack>
      </ModalRoot>
    </>
  );
};

export default LanguageCurrency;
