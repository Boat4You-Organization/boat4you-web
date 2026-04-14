import { ElementType } from 'react';

type Link = {
  text?: string;
  textKey?: string;
  href: string;
  target?: '_self' | '_blank';
  icon?: ElementType;
};

export default Link;
