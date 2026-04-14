import { JSX } from 'react';

import CloseRounded from '@mui/icons-material/CloseRounded';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

interface ModalProps extends DialogProps {
  title: string | undefined;
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
  hideTitle?: boolean;
  hideCloseButton?: boolean;
  hideDivider?: boolean;
}

const Modal = ({
  open,
  title,
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
  scrollRef,
  arrowBack,
  onBack,
  hideTitle = false,
  hideCloseButton = false,
  hideDivider = false,
  children,
  ...props
}: ModalProps) => {
  const t = useTranslations('common');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      {...props}
      sx={{
        '& .MuiDialog-paper': {
          overflow: customButton ? 'visible' : 'hidden',
        },
      }}
    >
      {!hideTitle && (
        <DialogTitle component="div" display="flex" justifyContent="space-between" alignItems="center">
          {arrowBack && (
            <IconButton size="large" onClick={onBack} sx={{ color: colors.black400 }}>
              <KeyboardBackspaceIcon />
            </IconButton>
          )}
          <Stack>
            <Typography component="p" variant="h2" fontStyle="italic" fontWeight={800}>
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
        </DialogTitle>
      )}
      {children && (
        <DialogContent ref={scrollRef} dividers={!hideDivider} sx={{ pb: 3 }}>
          {children}
        </DialogContent>
      )}
      {(!hideCancelButton || !hideConfirmButton) && (
        <DialogActions disableSpacing sx={{ gap: customButton ? 1 : 2 }}>
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
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
