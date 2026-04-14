import { proxy, useSnapshot } from 'valtio';

interface AuthStore {
  loginModalOpen: boolean;
  signUpModalOpen: boolean;
  confirmAccountModalOpen: boolean;
  requestPasswordResetModal: boolean;
  userId: number | null;
  userEmail: string | null;
}

export const authStore = proxy<AuthStore>({
  loginModalOpen: false,
  signUpModalOpen: false,
  confirmAccountModalOpen: false,
  requestPasswordResetModal: false,
  userId: null,
  userEmail: null,
});

export const useAuthStore = () => useSnapshot(authStore) as AuthStore;
