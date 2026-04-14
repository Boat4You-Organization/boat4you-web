import React, { ElementType } from 'react';

import { IconButton } from '@mui/material';
import Link from 'next/link';

interface SocialIconProps {
  className?: string;
  icon: ElementType;
  url: string;
  ariaLabel: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ icon: Icon, url, className, ariaLabel }) => (
  <IconButton
    component={Link}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className={className}
    sx={{
      minWidth: 24,
      minHeight: 24,
      padding: 1,
    }}
  >
    <Icon size={24} />
  </IconButton>
);

export default SocialIcon;
