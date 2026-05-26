import { LANGUAGE_LABEL_MAP, Language } from '@/models/user.model';

export type LocaleType = 'en' | 'hr' | 'fr' | 'de' | 'pt' | 'it' | 'es' | 'pl' | 'nl';

export type Locale = {
  id: Language;
  label: string;
};

const locales: Locale[] = [
  { id: Language.ENGLISH, label: LANGUAGE_LABEL_MAP[Language.ENGLISH] },
  { id: Language.FRENCH, label: LANGUAGE_LABEL_MAP[Language.FRENCH] },
  { id: Language.GERMAN, label: LANGUAGE_LABEL_MAP[Language.GERMAN] },
  { id: Language.PORTUGUESE, label: LANGUAGE_LABEL_MAP[Language.PORTUGUESE] },
  { id: Language.ITALIAN, label: LANGUAGE_LABEL_MAP[Language.ITALIAN] },
  { id: Language.SPANISH, label: LANGUAGE_LABEL_MAP[Language.SPANISH] },
  { id: Language.CROATIAN, label: LANGUAGE_LABEL_MAP[Language.CROATIAN] },
  { id: Language.POLISH, label: LANGUAGE_LABEL_MAP[Language.POLISH] },
  { id: Language.DUTCH, label: LANGUAGE_LABEL_MAP[Language.DUTCH] },
];

export default locales;
