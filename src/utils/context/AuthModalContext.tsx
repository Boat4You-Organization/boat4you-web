'use client';

import React, { ReactNode, createContext, useContext, useMemo } from 'react';

import dynamic from 'next/dynamic';

import {
  toggleConfirmAccountModal,
  toggleLoginModal,
  toggleRequestPasswordResetModal,
  toggleSignUpModal,
} from '@/valtio/auth/auth.actions';
import { useAuthStore } from '@/valtio/auth/auth.store';

// Auth modals are lazy — they're closed on every initial page load (incl.
// the home) and only a small fraction of visits actually open one. Static
// imports bundled ~109 KB of MUI form code into the shell chunk that PSI
// flagged 95% unused on the homepage. Dynamic + conditional render defers
// the download until the user clicks Sign in / Register / etc.
const LoginModal = dynamic(() => import('@/components/Auth/LoginModal'), { ssr: false });
const SignUpModal = dynamic(() => import('@/components/Auth/SignUpModal'), { ssr: false });
const ConfirmAccountModal = dynamic(() => import('@/components/Auth/ConfirmAccountModal'), { ssr: false });
const RequestPasswordResetModal = dynamic(() => import('@/components/Auth/RequestPasswordResetModal'), { ssr: false });

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
      {loginModalOpen && (
        <LoginModal
          isOpen={loginModalOpen}
          onOpen={contextValue.openLoginModal}
          onClose={contextValue.closeLoginModal}
        />
      )}
      {signUpModalOpen && (
        <SignUpModal
          isOpen={signUpModalOpen}
          onOpen={contextValue.openSignUpModal}
          onClose={contextValue.closeSignUpModal}
        />
      )}
      {confirmAccountModalOpen && (
        <ConfirmAccountModal
          isOpen={confirmAccountModalOpen}
          onOpen={contextValue.openConfirmAccountModal}
          onClose={contextValue.closeConfirmAccountModal}
        />
      )}
      {requestPasswordResetModal && (
        <RequestPasswordResetModal
          isOpen={requestPasswordResetModal}
          onOpen={contextValue.openRequestPasswordResetModal}
          onClose={contextValue.closeRequestPasswordResetModal}
        />
      )}
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
