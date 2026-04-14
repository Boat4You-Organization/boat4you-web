import { ElementType } from 'react';

import Facebook from '@/components/SvgIcons/Socials/Facebook';
import Instagram from '@/components/SvgIcons/Socials/Instagram';
import Twitter from '@/components/SvgIcons/Socials/Twitter';
import YouTube from '@/components/SvgIcons/Socials/YouTube';

export interface SocialLink {
  href: string;
  icon: ElementType;
}

const socials: SocialLink[] = [
  {
    href: 'https://www.facebook.com/boat4youcom',
    icon: Facebook,
  },
  {
    href: 'https://www.instagram.com/boat4you_/',
    icon: Instagram,
  },
  {
    href: 'https://x.com/Boat4you_com',
    icon: Twitter,
  },
  {
    href: 'https://www.youtube.com/@Boat4you_com',
    icon: YouTube,
  },
];

export default socials;
