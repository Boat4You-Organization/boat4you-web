import {
  FormControl,
  FormControlLabel,
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';

import colors from '@/styles/themes/colors';

interface SwitchProps extends MuiSwitchProps {
  label?: string;
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  labelColor?: string;
  sx?: SxProps<Theme>;
}

const Switch = ({ value, onChange, label, labelPlacement = 'start', labelColor, sx, ...props }: SwitchProps) => (
  <FormControl fullWidth>
    <FormControlLabel
      control={<MuiSwitch value={value} onChange={onChange} {...props} />}
      label={
        <Typography variant="body1" fontWeight={600} color={labelColor || colors.blue950}>
          {label}
        </Typography>
      }
      labelPlacement={labelPlacement}
      sx={{
        ml: 0,
        justifyContent: 'space-between',
        ...sx,
      }}
    />
  </FormControl>
);

export default Switch;
