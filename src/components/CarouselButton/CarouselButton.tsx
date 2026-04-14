import { ElementType } from 'react';

import { Button } from '@mui/material';
import cx from 'clsx';

import styles from './CarouselButton.module.scss';

interface CarouselButtonProps {
  onClick?: () => void;
  icon: ElementType;
  style?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const CarouselButton = ({ onClick, style, icon: Icon, disabled, ariaLabel }: CarouselButtonProps) => (
  <Button
    classes={{ root: styles.root }}
    className={cx(styles.container, style)}
    disabled={disabled}
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Icon size={42} />
  </Button>
);

export default CarouselButton;
