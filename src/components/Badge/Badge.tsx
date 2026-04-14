import { ReactNode } from 'react';

import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';

interface BadgeProps {
  children: ReactNode;
  badgeContent: number;
  color?: MuiBadgeProps['color'];
}

const Badge = ({ children, badgeContent, color }: BadgeProps) => (
  <MuiBadge
    badgeContent={badgeContent}
    color={color}
    overlap="circular"
    slotProps={{
      badge: {
        sx: {
          minWidth: 12,
          height: 12,
          padding: 0,
          borderRadius: '50%',
          fontSize: 10,
        },
      },
    }}
  >
    {children}
  </MuiBadge>
);

export default Badge;
