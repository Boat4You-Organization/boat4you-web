import { ElementType } from 'react';

import Facebook from '@/components/SvgIcons/Socials/Facebook';
import Instagram from '@/components/SvgIcons/Socials/Instagram';
import LinkedIn from '@/components/SvgIcons/Socials/LinkedIn';
import Twitter from '@/components/SvgIcons/Socials/Twitter';
import YouTube from '@/components/SvgIcons/Socials/YouTube';

export interface SocialLink {
  href: string;
  icon: ElementType;
  /** Network name — the link's accessible name (the icons have no text). */
  name: string;
}

const socials: SocialLink[] = [
  {
    // The "Boat4you" page (5.11.2026). The earlier page, facebook.com/boat4youcom, was deleted that day and
    // its link went dead. The new page has no username yet, so the link uses the permanent page id, which keeps
    // resolving after a username is set. Keep it in step with `sameAs` in utils/static/buildMetadata.ts.
    href: 'https://www.facebook.com/profile.php?id=61596356697045',
    icon: Facebook,
    name: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/boat4you_/',
    icon: Instagram,
    name: 'Instagram',
  },
  {
    // Company page (also linked from all six sister-site footers).
    href: 'https://www.linkedin.com/company/boat4you-com',
    icon: LinkedIn,
    name: 'LinkedIn',
  },
  {
    href: 'https://x.com/Boat4you_com',
    icon: Twitter,
    name: 'X',
  },
  {
    href: 'https://www.youtube.com/@Boat4you_com',
    icon: YouTube,
    name: 'YouTube',
  },
];

export default socials;
