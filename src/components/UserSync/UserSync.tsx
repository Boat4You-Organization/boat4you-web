'use client';

import { useEffect } from 'react';

import { UserModel } from '@/models/user.model';
import { setUser } from '@/valtio/user/user.actions';
import { useUserStore } from '@/valtio/user/user.store';

interface UserSyncProps {
  user: UserModel | null;
}

const UserSync = ({ user }: UserSyncProps) => {
  const { user: clientUser } = useUserStore();

  useEffect(() => {
    if (user && (!clientUser || clientUser.id !== user.id)) {
      setUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
};

export default UserSync;
