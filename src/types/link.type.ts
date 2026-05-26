import { ElementType } from 'react';

type Link = {
  text?: string;
  textKey?: string;
  href: string;
  target?: '_self' | '_blank';
  icon?: ElementType;
  // Raw label that overrides i18n lookup. Used for proper-noun links
  // (sister-site brand names) where translation isn't appropriate.
  displayName?: string;
};

export default Link;
