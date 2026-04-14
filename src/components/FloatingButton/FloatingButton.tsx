import React from 'react';

import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

import CheckList from '@/components/SvgIcons/CheckList';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import colors from '@/styles/themes/colors';

import styles from './FloatingButton.module.scss';

interface FloatingButtonProps {
  onClick: () => void;
  selectedItems: number;
}

const FloatingButton = ({ onClick, selectedItems }: FloatingButtonProps) => {
  const t = useTranslations('common');

  return (
    <Button
      classes={{ root: styles.root }}
      className={styles.container}
      startIcon={<CheckList size={20} />}
      endIcon={<ChevronRight size={20} />}
      size="large"
      sx={{
        '& .MuiButton-endIcon': {
          backgroundColor: colors.blue400,
          borderRadius: '50%',
          padding: '6px',
          marginLeft: '32px',
        },
      }}
      onClick={onClick}
    >
      {`${t('boatsSelected')}: ${selectedItems}`}
    </Button>
  );
};

export default FloatingButton;
