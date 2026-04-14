import { cookies } from 'next/headers';
import 'server-only';

import { AuthKeys } from '@/config/constants.config';

export const authHeaders = async (token?: string) => {
  const headers = new Headers();

  const cookieToken = token || (await cookies()).get(AuthKeys.ACCESS_TOKEN)?.value;

  if (cookieToken) {
    headers.append('Authorization', `Bearer ${cookieToken}`);
  }

  return headers;
};
