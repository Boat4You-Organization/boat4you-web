import { ElementType } from 'react';

import Clock from '@/components/SvgIcons/Contact/Clock';
import Email from '@/components/SvgIcons/Contact/Email';
import EmergencyNumber from '@/components/SvgIcons/Contact/EmergencyNumber';
import TelephoneNumber from '@/components/SvgIcons/Contact/TelephoneNumber';
import Uk from '@/components/SvgIcons/Contact/Uk';
import Usa from '@/components/SvgIcons/Contact/Usa';
import Whatsapp from '@/components/SvgIcons/Contact/Whatsapp';
import Link from '@/types/link.type';

export interface ContactItem {
  titleKey: 'contact.telephoneNumber' | 'contact.email' | 'contact.emergencyNumber' | 'contact.workingHours';
  icon: ElementType;
  link: Link | 'contact.mondayToSunday';
}

export interface InternationalSupportItem extends Omit<ContactItem, 'link' | 'titleKey'> {
  titleKey: 'internationalSupport.usaOffice' | 'internationalSupport.ukOffice' | 'internationalSupport.croatiaHQ';
  link: Link;
}

export const contactItems: ContactItem[] = [
  {
    titleKey: 'contact.telephoneNumber',
    icon: TelephoneNumber,
    link: {
      href: 'tel:+38521553301',
      text: '+385 21 55 33 01 (Croatia HQ)',
    },
  },
  {
    titleKey: 'contact.email',
    icon: Email,
    link: {
      href: 'mailto:info@boat4you.com',
      text: 'info@boat4you.com',
    },
  },
  {
    titleKey: 'contact.emergencyNumber',
    icon: EmergencyNumber,
    link: {
      href: 'tel:+385913000009',
      text: '+385 91 3000 009',
    },
  },
  {
    titleKey: 'contact.workingHours',
    icon: Clock,
    link: 'contact.mondayToSunday',
  },
];

export const internationalSupportItems: InternationalSupportItem[] = [
  {
    titleKey: 'internationalSupport.usaOffice',
    icon: Usa,
    link: {
      href: 'tel:+16466612851',
      text: '+1 646 661 2851',
    },
  },
  {
    titleKey: 'internationalSupport.ukOffice',
    icon: Uk,
    link: {
      href: 'tel:+442033182329',
      text: '+44 203 318 2329',
    },
  },
  {
    titleKey: 'internationalSupport.croatiaHQ',
    icon: Whatsapp,
    link: {
      href: 'tel:+385913000009',
      text: '+385 91 3000 009',
    },
  },
];
