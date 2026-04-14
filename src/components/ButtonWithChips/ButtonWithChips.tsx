import React, { ElementType } from 'react';

import { Close } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material';
import cx from 'clsx';

import colors from '@/styles/themes/colors';

import styles from './ButtonWithChips.module.scss';

interface ButtonWithChipsProps {
  isActive?: boolean;
  onClick: () => void;
  handleClear: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder: React.ReactNode | string;
  icon: ElementType;
  values: string[];
  maxDisplayedChips?: number;
  onDeleteSingle?: (option: string, index: number) => void;
}

const ButtonWithChips = ({
  isActive,
  onClick,
  handleClear,
  placeholder,
  icon: Icon,
  values,
  maxDisplayedChips = 2,
  onDeleteSingle,
}: ButtonWithChipsProps) => {
  const displayedValues = values.slice(0, maxDisplayedChips);
  const remainingCount = values.length - (maxDisplayedChips ?? values.length);
  const hasRemaining = remainingCount > 0;

  const handleSingleDelete = (option: string, index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDeleteSingle) {
      onDeleteSingle(option, index);
    }
  };

  return (
    <Button
      component="div"
      onClick={onClick}
      variant="outlined"
      startIcon={<Icon variant="secondary" size={24} />}
      size="large"
      classes={{ root: styles.rootButton }}
      className={cx(styles.customButton, { [styles.isActive]: isActive })}
      fullWidth
      endIcon={
        values.length > 0 && (
          <IconButton onClick={handleClear} className={styles.iconButton}>
            <Close color="secondary" fontSize="small" />
          </IconButton>
        )
      }
      sx={{
        '& .MuiButton-endIcon': {
          marginLeft: 'auto',
        },
      }}
    >
      {values.length > 0 ? (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            cursor: 'pointer',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {displayedValues.map((value, index) => (
            <Chip
              key={`${value}-${index + 1}`}
              label={value}
              onDelete={onDeleteSingle ? handleSingleDelete(value, index) : undefined}
              sx={{
                color: colors.black500,
                borderRadius: '44px',
              }}
            />
          ))}
          {hasRemaining && (
            <Chip
              label={`+${remainingCount}`}
              sx={{
                minWidth: '40px',
                color: colors.black500,
                borderRadius: '44px',
              }}
            />
          )}
        </Stack>
      ) : (
        <Box>
          {typeof placeholder === 'string' ? (
            <Typography variant="body2" color={colors.black400}>
              {placeholder}
            </Typography>
          ) : (
            placeholder
          )}
        </Box>
      )}
    </Button>
  );
};

export default ButtonWithChips;
