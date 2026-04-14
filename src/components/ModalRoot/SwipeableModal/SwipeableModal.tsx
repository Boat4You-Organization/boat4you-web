import React, { JSX } from 'react';

import CloseRounded from '@mui/icons-material/CloseRounded';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, ButtonProps, DialogProps, IconButton, Stack, SwipeableDrawer, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './SwipeableModal.module.scss';

interface SwipeableModalProps extends DialogProps {
  title: string | undefined;
  onOpen: () => void;
  onClose: () => void;
  description?: string;
  onConfirm?: () => void;
  confirmBtnText?: string;
  ConfirmBtnProps?: ButtonProps;
  hideConfirmButton?: boolean;
  onCancel?: () => void;
  cancelBtnText?: string;
  CancelBtnProps?: ButtonProps;
  hideCancelButton?: boolean;
  titleActions?: JSX.Element | null;
  icon?: React.ReactNode;
  customButton?: React.ReactNode;
  scrollRef?: React.Ref<HTMLDivElement>;
  arrowBack?: boolean;
  onBack?: () => void;
  hideCloseButton?: boolean;
  removePadding?: boolean;
  hideTitle?: boolean;
  hideDivider?: boolean;
}

const SwipeableModal = ({
  open,
  title,
  onOpen,
  onClose,
  description,
  onConfirm,
  confirmBtnText,
  ConfirmBtnProps,
  hideConfirmButton = false,
  onCancel,
  cancelBtnText,
  CancelBtnProps,
  hideCancelButton = false,
  titleActions,
  customButton,
  arrowBack,
  onBack,
  hideCloseButton = false,
  hideDivider = false,
  removePadding,
  hideTitle,
  children,
}: SwipeableModalProps) => {
  const t = useTranslations('common');

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      keepMounted
      title={title}
      disableScrollLock={false}
      sx={{
        '&.MuiDrawer-root': {
          zIndex: 1300,
        },
        '.MuiDrawer-paper ': {
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          maxHeight: '80dvh',
          overflowY: 'hidden',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box className={styles.puller} />
      {!hideTitle && (
        <Stack
          component="div"
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          borderBottom={!hideDivider ? `1px solid ${colors.black200}` : 'none'}
          className={styles.swipeableContainer}
          sx={{ flexShrink: 0 }}
        >
          {arrowBack && (
            <IconButton size="large" onClick={onBack} sx={{ color: colors.black400 }}>
              <KeyboardBackspaceIcon />
            </IconButton>
          )}
          <Stack>
            <Typography component="p" variant="h2">
              {title}
            </Typography>
            {description && (
              <Typography variant="body1" color={colors.blue500}>
                {description}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={3}>
            {titleActions && <Box flex="none">{titleActions}</Box>}
            {!hideCloseButton && (
              <IconButton size="large" onClick={onClose} sx={{ color: colors.black400 }}>
                <CloseRounded />
              </IconButton>
            )}
          </Stack>
        </Stack>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          minHeight: 0,

          '@media (max-width: 768px)': {
            padding: removePadding ? '0px' : '16px',
          },
        }}
      >
        {children}
      </Box>
      {(!hideCancelButton || !hideConfirmButton) && (
        <Stack direction="column" spacing={2} className={styles.swipeableContainer} sx={{ flexShrink: 0 }}>
          {customButton ? (
            <Box sx={{ width: '100%' }}>{customButton}</Box>
          ) : (
            !hideConfirmButton && (
              <Button onClick={onConfirm} fullWidth size="large" {...ConfirmBtnProps}>
                {confirmBtnText || t('confirm')}
              </Button>
            )
          )}
          {!hideCancelButton && (
            <Button onClick={onCancel} size="large" color="secondary" fullWidth {...CancelBtnProps}>
              {cancelBtnText || t('cancel')}
            </Button>
          )}
        </Stack>
      )}
    </SwipeableDrawer>
  );
};

export default SwipeableModal;
