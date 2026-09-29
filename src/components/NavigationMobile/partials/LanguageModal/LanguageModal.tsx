import { useState } from 'react';

import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { updateUserPreferences } from '@/actions/user.actions';
import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import Check from '@/components/SvgIcons/Check';
import { usePathname } from '@/i18n/navigation';
import { LANGUAGE_ARRAY, LANGUAGE_NATIVE_NAME_MAP, Language, UserModel } from '@/models/user.model';
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
  const t = useTranslations('common');

  // Native names, and the switch happens on the tap itself — the sheet used
  // to list English exonyms and need a third tap on "Save preferences"
  // (audit 29.9.2026, R54).
  const locales = LANGUAGE_ARRAY.map(language => ({ id: language, label: LANGUAGE_NATIVE_NAME_MAP[language] }));

  const handleLanguageSelect = async (language: Language) => {
    if (language === selectedLanguage) {
      onClose();

      return;
    }

    setSelectedLanguage(language);

    if (user?.id) {
      await updateUserPreferences({
        id: user.id,
        language,
        currency: user.currency,
        path: pathname,
      });
    }

    const queryString = searchParams.toString();

    window.location.href = `/${language.toLowerCase()}${pathname}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <SwipeableModal
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={t('language')}
      hideConfirmButton
      hideCancelButton
    >
      <List>
        {locales.map(option => {
          const isSelected = selectedLanguage === option.id;

          return (
            <ListItem
              key={option.id}
              sx={{ backgroundColor: isSelected ? colors.blue50 : 'transparent', borderRadius: '12px' }}
            >
              <ListItemButton
                onClick={() => handleLanguageSelect(option.id)}
                lang={option.id.toLowerCase()}
                aria-current={isSelected ? 'true' : undefined}
              >
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
