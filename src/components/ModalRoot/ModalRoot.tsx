import React, { JSX } from 'react';

import { ButtonProps, DialogProps, Theme, useMediaQuery } from '@mui/material';

import Modal from './Modal';
import SwipeableModal from './SwipeableModal';

interface ModalRootProps extends DialogProps {
  title?: string | undefined;
  onOpen?: () => void;
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
  width?: number;
  arrowBack?: boolean;
  onBack?: () => void;
  hideTitle?: boolean;
  hideCloseButton?: boolean;
  hideDivider?: boolean;
  /**
   * Mobile only. Render as full-viewport height modal (100dvh, no drag
   * puller, no rounded top corners) instead of the default bottom-sheet
   * with maxHeight 80dvh. Desktop ignores this prop.
   */
  fullScreenOnMobile?: boolean;
}

const ModalRoot = ({
  open,
  title,
  onOpen,
  onClose,
  width,
  arrowBack,
  onBack,
  hideTitle,
  hideCloseButton,
  hideDivider,
  confirmBtnText,
  cancelBtnText,
  fullScreenOnMobile,
  children,
  ...props
}: ModalRootProps) => {
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  if (isTablet) {
    return (
      <SwipeableModal
        open={open}
        onClose={onClose}
        onOpen={onOpen || (() => {})}
        title={title}
        hideCancelButton
        arrowBack={arrowBack}
        onBack={onBack}
        hideTitle={hideTitle}
        hideCloseButton={hideCloseButton}
        hideDivider={hideDivider}
        confirmBtnText={confirmBtnText}
        cancelBtnText={cancelBtnText}
        fullScreen={fullScreenOnMobile}
        {...props}
      >
        {children}
      </SwipeableModal>
    );
  }

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      arrowBack={arrowBack}
      onBack={onBack}
      hideTitle={hideTitle}
      hideCloseButton={hideCloseButton}
      hideDivider={hideDivider}
      confirmBtnText={confirmBtnText}
      cancelBtnText={cancelBtnText}
      {...props}
      slotProps={{ paper: { sx: { maxWidth: width } } }}
    >
      {children}
    </Modal>
  );
};

export default ModalRoot;
