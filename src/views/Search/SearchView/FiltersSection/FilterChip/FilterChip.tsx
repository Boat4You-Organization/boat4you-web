import { Chip } from '@mui/material';

import ChipDeleteIcon from '@/components/SvgIcons/ChipDeleteIcon';

import styles from './FilterChip.module.scss';

interface FilterChipProps {
  label: string;
  onDelete: () => void;
}

const FilterChip = ({ label, onDelete }: FilterChipProps) => (
  <Chip
    label={label}
    onDelete={onDelete}
    deleteIcon={<ChipDeleteIcon size={18} />}
    classes={{ root: styles.root }}
    className={styles.container}
  />
);

export default FilterChip;
