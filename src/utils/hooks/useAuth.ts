import { useEffect, useState } from 'react';

import { getLoggedInUser } from '@/actions/auth.actions';
import { UserModel } from '@/models/user.model';
import { setUser } from '@/valtio/user/user.actions';
import { useUserStore } from '@/valtio/user/user.store';

interface UseAuthProps {
  serverUser?: UserModel | null;
  autoFetch?: boolean;
}

export const useAuth = ({ serverUser, autoFetch = true }: UseAuthProps = {}) => {
  const { user: clientUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedServer, setHasCheckedServer] = useState(false);

  const refreshUser = async () => {
    setIsLoading(true);

    try {
      const user = await getLoggedInUser();

      if (user) {
        setUser(user);
      }

      return user;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to refresh user:', error);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (serverUser && !clientUser) {
      setUser(serverUser);
    }
  }, [serverUser, clientUser]);

  useEffect(() => {
    if (autoFetch && !clientUser && !hasCheckedServer) {
      setHasCheckedServer(true);
      refreshUser();
    }
  }, [autoFetch, clientUser, hasCheckedServer]);

  const user = clientUser || serverUser;

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    refreshUser,
  };
};
