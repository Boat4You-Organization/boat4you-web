import { authStore } from './auth.store';

export function toggleLoginModal(isOpen?: boolean | React.MouseEvent): void {
  authStore.loginModalOpen = typeof isOpen === 'boolean' ? isOpen : !authStore.loginModalOpen;
}

export function toggleSignUpModal(isOpen?: boolean | React.MouseEvent): void {
  authStore.signUpModalOpen = typeof isOpen === 'boolean' ? isOpen : !authStore.signUpModalOpen;
}

export function toggleConfirmAccountModal(isOpen?: boolean | React.MouseEvent): void {
  authStore.confirmAccountModalOpen = typeof isOpen === 'boolean' ? isOpen : !authStore.confirmAccountModalOpen;
}

export function toggleRequestPasswordResetModal(isOpen?: boolean | React.MouseEvent): void {
  authStore.requestPasswordResetModal = typeof isOpen === 'boolean' ? isOpen : !authStore.requestPasswordResetModal;
}

export function setUserIdEmail(userId: number, userEmail: string): void {
  authStore.userId = userId;
  authStore.userEmail = userEmail;
}

export function setUserEmail(userEmail: string): void {
  authStore.userEmail = userEmail;
}

export function resetAuthModals(): void {
  authStore.loginModalOpen = false;
  authStore.signUpModalOpen = false;
  authStore.confirmAccountModalOpen = false;
  authStore.requestPasswordResetModal = false;
  authStore.userId = null;
  authStore.userEmail = null;
}
