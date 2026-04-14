import { UserModel } from '@/models/user.model';

import { userStore } from './user.store';

export const setUser = (user: UserModel) => {
  userStore.user = user;
};

export const clearUser = () => {
  userStore.user = null;
};
