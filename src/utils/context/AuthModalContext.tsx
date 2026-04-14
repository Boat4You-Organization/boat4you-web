'use client';

import React, { ReactNode, createContext, useContext, useMemo } from 'react';

import ConfirmAccountModal from '@/components/Auth/ConfirmAccountModal';
import LoginModal from '@/components/Auth/LoginModal';
import RequestPasswordResetModal from '@/components/Auth/RequestPasswordResetModal';
import SignUpModal from '@/components/Auth/SignUpModal';
import {
  toggleConfirmAccountModal,
  toggleLoginModal,
  toggleRequestPasswordResetModal,
  toggleSignUpModal,
} from '@/valtio/auth/auth.actions';
import { useAuthStore } from '@/valtio/auth/auth.store';

interface AuthModalContextType {
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
  openConfirmAccountModal: () => void;
  closeConfirmAccountModal: () => void;
  openRequestPasswordResetModal: () => void;
  closeRequestPasswordResetModal: () => void;
  toggleLoginModal: (isOpen?: boolean | React.MouseEvent) => void;
  toggleSignUpModal: (isOpen?: boolean | React.MouseEvent) => void;
  toggleConfirmAccountModal: (isOpen?: boolean | React.MouseEvent) => void;
  toggleRequestPasswordResetModal: (isOpen?: boolean | React.MouseEvent) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

interface AuthModalProviderProps {
  children: ReactNode;
}

export const AuthModalProvider = ({ children }: AuthModalProviderProps) => {
  const { loginModalOpen, signUpModalOpen, confirmAccountModalOpen, requestPasswordResetModal } = useAuthStore();

  const contextValue: AuthModalContextType = useMemo(
    () => ({
      openLoginModal: () => toggleLoginModal(true),
      closeLoginModal: () => toggleLoginModal(false),
      openSignUpModal: () => toggleSignUpModal(true),
      closeSignUpModal: () => toggleSignUpModal(false),
      openConfirmAccountModal: () => toggleConfirmAccountModal(true),
      closeConfirmAccountModal: () => toggleConfirmAccountModal(false),
      openRequestPasswordResetModal: () => toggleRequestPasswordResetModal(true),
      closeRequestPasswordResetModal: () => toggleRequestPasswordResetModal(false),
      toggleLoginModal,
      toggleSignUpModal,
      toggleConfirmAccountModal,
      toggleRequestPasswordResetModal,
    }),
    []
  );

  return (
    <AuthModalContext.Provider value={contextValue}>
      {children}
      <LoginModal isOpen={loginModalOpen} onOpen={contextValue.openLoginModal} onClose={contextValue.closeLoginModal} />
      <SignUpModal
        isOpen={signUpModalOpen}
        onOpen={contextValue.openSignUpModal}
        onClose={contextValue.closeSignUpModal}
      />
      <ConfirmAccountModal
        isOpen={confirmAccountModalOpen}
        onOpen={contextValue.openConfirmAccountModal}
        onClose={contextValue.closeConfirmAccountModal}
      />
      <RequestPasswordResetModal
        isOpen={requestPasswordResetModal}
        onOpen={contextValue.openRequestPasswordResetModal}
        onClose={contextValue.closeRequestPasswordResetModal}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);

  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }

  return context;
};
