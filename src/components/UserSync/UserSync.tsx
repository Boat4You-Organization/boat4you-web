'use client';

import { useEffect } from 'react';

import { UserModel } from '@/models/user.model';
import { setUser } from '@/valtio/user/user.actions';
import { useUserStore } from '@/valtio/user/user.store';

/**
 * Hydrates the valtio user store from /api/me on first mount. Replaces the
 * old `user` prop chain — the server layout no longer reads cookies, which
 * lets the home (and any other anon-friendly route) render statically with
 * SWR. Logged-in users see a sub-second flash of the logged-out Header
 * before the swap; anon users see no change.
 */
const UserSync = () => {
  const { user: clientUser } = useUserStore();

  useEffect(() => {
    if (clientUser) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });

        if (!res.ok) return;

        const data: { user: UserModel | null } = await res.json();

        if (!cancelled && data.user) {
          setUser(data.user);
        }
      } catch {
        // Anon visitor or transient backend hiccup — leave store empty.
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default UserSync;
