import { useState } from 'react';

import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { updateUserPreferences } from '@/actions/user.actions';
import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import Check from '@/components/SvgIcons/Check';
import { usePathname } from '@/i18n/navigation';
import { Language, UserModel } from '@/models/user.model';
import colors from '@/styles/themes/colors';

interface LanguageModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  user?: UserModel;
}

const LanguageModal = ({ isOpen, onOpen, onClose, user }: LanguageModalProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const normalizedLocale = locale.toUpperCase() as Language;
  const defaultLanguage = user?.language || normalizedLocale;
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(defaultLanguage);
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<Language>(defaultLanguage);
  const t = useTranslations('common');
  const tHome = useTranslations('home');

  const locales = [
    { id: Language.ENGLISH, label: tHome('languageModal.languages.en') },
    { id: Language.FRENCH, label: tHome('languageModal.languages.fr') },
    { id: Language.GERMAN, label: tHome('languageModal.languages.de') },
    { id: Language.PORTUGUESE, label: tHome('languageModal.languages.pt') },
    { id: Language.ITALIAN, label: tHome('languageModal.languages.it') },
    { id: Language.SPANISH, label: tHome('languageModal.languages.es') },
    { id: Language.CROATIAN, label: tHome('languageModal.languages.hr') },
    { id: Language.POLISH, label: tHome('languageModal.languages.pl') },
    { id: Language.DUTCH, label: tHome('languageModal.languages.nl') },
  ];

  const handleLanguageSelect = (localeId: string) => {
    setTempSelectedLanguage(localeId as Language);
  };

  const handleConfirm = async () => {
    if (tempSelectedLanguage !== selectedLanguage) {
      setSelectedLanguage(tempSelectedLanguage);

      const queryString = searchParams.toString();

      window.location.href = `/${tempSelectedLanguage}${pathname}${queryString ? `?${queryString}` : ''}`;
    }

    if (user?.id) {
      await updateUserPreferences({
        id: user.id,
        language: tempSelectedLanguage,
        currency: user.currency,
        path: pathname,
      });
    }

    onClose();
  };

  return (
    <SwipeableModal
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={t('language')}
      confirmBtnText={t('savePreferences')}
      onConfirm={handleConfirm}
      hideCancelButton
    >
      <List>
        {locales.map(option => {
          const isSelected = tempSelectedLanguage === option.id;

          return (
            <ListItem
              key={option.id}
              sx={{ backgroundColor: isSelected ? colors.blue50 : 'transparent', borderRadius: '12px' }}
            >
              <ListItemButton onClick={() => handleLanguageSelect(option.id)}>
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

export default LanguageModal;
