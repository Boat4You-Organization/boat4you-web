import { proxy, useSnapshot } from 'valtio';

import { UserModel } from '@/models/user.model';

interface UserStore {
  user: UserModel | null;
}

export const userStore = proxy<UserStore>({
  user: null,
});

export const useUserStore = () => useSnapshot(userStore) as UserStore;
