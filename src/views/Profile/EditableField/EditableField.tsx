'use client';

import { type ReactNode } from 'react';

import { Box, Button, Collapse, Stack, type SxProps, type Theme, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from './EditableField.module.scss';

type EditableFieldProps = {
  label: string;
  value: ReactNode;
  description: string;
  children: ReactNode;
  icon?: ReactNode;
  onToggleEdit: () => void;
  isAnotherEditing?: boolean;
  isEditing: boolean;
  isSubmitting?: boolean;
  sx?: SxProps<Theme>;
};

const EditableField = ({
  label,
  value,
  description,
  children,
  icon,
  sx,
  isEditing,
  onToggleEdit,
  isAnotherEditing,
  isSubmitting,
}: EditableFieldProps) => {
  const t = useTranslations('common');

  return (
    <Box
      className={styles.container}
      sx={{
        ...(isAnotherEditing && {
          opacity: 0.5,
          pointerEvents: 'none',
        }),
        ...sx,
      }}
    >
      <Box className={styles.header}>
        {icon && <Box className={styles.iconWrapper}>{icon}</Box>}
        <Stack className={styles.textBlock}>
          <Typography className={styles.label}>{label}</Typography>
          <Typography className={styles.value}>
            {isEditing ? description : value || description}
          </Typography>
        </Stack>
        <Button variant="text" onClick={onToggleEdit} className={styles.editButton}>
          {isEditing ? t('cancel') : t('edit')}
        </Button>
      </Box>

      <Collapse in={isEditing}>
        <Box className={styles.action}>
          {children}
          <Button
            color="secondary"
            size="large"
            type="submit"
            disabled={isSubmitting}
            sx={{ width: { xs: '100%', sm: 120 } }}
          >
            {isSubmitting ? t('saving') : t('save')}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EditableField;
