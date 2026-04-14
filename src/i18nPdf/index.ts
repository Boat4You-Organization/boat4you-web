import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import hr from './hr';
import it from './it';
import pt from './pt';

export const i18n = {
  de,
  en,
  es,
  fr,
  hr,
  it,
  pt,
};

export type Locale = keyof typeof i18n;
