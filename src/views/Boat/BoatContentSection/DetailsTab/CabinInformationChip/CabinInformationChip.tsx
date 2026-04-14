import React, { ElementType } from 'react';

import { Stack, Typography } from '@mui/material';

import colors from '@/styles/themes/colors';
import { MainSailType } from '@/types/main-sail.type';

interface CabinInformationChipProps {
  icon: ElementType;
  label: string;
  value: number | MainSailType;
}

const CabinInformationChip = ({ value, label, icon: Icon }: CabinInformationChipProps) => (
  <Stack direction="row" alignItems="center" spacing={1.5}>
    <Icon size={52} />
    <Stack direction="column">
      <Typography component="p" variant="h3" fontWeight={700} color={colors.black950}>
        x{value}
      </Typography>
      <Typography component="p" variant="body1" color={colors.black500}>
        {label}
      </Typography>
    </Stack>
  </Stack>
);

export default CabinInformationChip;
