import { CircularProgress as MuiCircularProgress, SxProps } from '@mui/material';

import colors from '@/styles/themes/colors';

interface CircularProgressProps {
  size?: number;
  sx?: SxProps;
}

const CircularProgress = ({ size = 32, sx }: CircularProgressProps) => (
  <MuiCircularProgress size={size} sx={{ color: colors.blue500, ...sx }} />
);

export default CircularProgress;
