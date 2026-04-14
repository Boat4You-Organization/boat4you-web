import { Chip, ChipProps } from '@mui/material';
import cx from 'clsx';

import styles from './StatusChip.module.scss';

const StatusChip = ({ color, label, sx }: ChipProps) => (
  <Chip color={color} label={label} classes={{ root: styles.root }} className={cx(color && styles[color])} sx={sx} />
);

export default StatusChip;
