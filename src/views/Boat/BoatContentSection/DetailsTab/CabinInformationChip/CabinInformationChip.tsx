import React, { ElementType } from 'react';

import { Stack, Typography } from '@mui/material';

import colors from '@/styles/themes/colors';
import { MainSailType } from '@/types/main-sail.type';
import boatType from '@/views/Boat/boatType';

interface CabinInformationChipProps {
  icon: ElementType;
  label: string;
  value: number | MainSailType;
}

const CabinInformationChip = ({ value, label, icon: Icon }: CabinInformationChipProps) => (
  <Stack direction="row" alignItems="center" spacing={1.5}>
    <Icon size={52} />
    <Stack direction="column">
      <Typography component="p" variant="h3" color={colors.black950} sx={boatType.price}>
        x{value}
      </Typography>
      <Typography component="p" variant="body1" color={colors.black500} sx={boatType.body}>
        {label}
      </Typography>
    </Stack>
  </Stack>
);

export default CabinInformationChip;
