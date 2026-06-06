'use client';

import { useCallback, useEffect, useState } from 'react';

import { Box, ButtonBase, CircularProgress } from '@mui/material';

import { facebookLogin } from '@/actions/auth.actions';
import Facebook from '@/components/SvgIcons/Socials/Facebook';
import { UserModel } from '@/models/user.model';

interface FacebookSignInButtonProps {
  onSuccess: (user: UserModel) => void;
  onError?: (message: string) => void;
}

const FB_SCRIPT_ID = 'facebook-jssdk';
const FB_SRC = 'https://connect.facebook.net/en_US/sdk.js';
const FB_VERSION = 'v21.0';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * "Sign in with Facebook" — loads the Facebook JS SDK once (no extra npm
 * dependency), pops the FB login dialog and exchanges the returned access token
 * for our session via the `facebookLogin` server action. On success the parent
 * decides what to do (close modal, setUser, toast); this component owns only the
 * button + its pending state. Mirrors GoogleSignInButton.
 *
 * If NEXT_PUBLIC_FACEBOOK_APP_ID is not set at build time the component renders
 * nothing, so the surrounding email/password form (and the Google button) keep
 * working unchanged.
 */
const FacebookSignInButton = ({ onSuccess, onError }: FacebookSignInButtonProps) => {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!appId) return;

    const init = () => {
      const { FB } = window as any;

      if (!FB) return;

      FB.init({ appId, version: FB_VERSION, cookie: true, xfbml: false });
    };

    if ((window as any).FB) {
      init();

      return;
    }

    let script = document.getElementById(FB_SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = FB_SCRIPT_ID;
      script.src = FB_SRC;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }

    script.addEventListener('load', init);

    // eslint-disable-next-line consistent-return
    return () => script?.removeEventListener('load', init);
  }, [appId]);

  const handleClick = useCallback(() => {
    const { FB } = window as any;

    if (!FB) {
      onError?.('Facebook sign-in is not available');

      return;
    }

    FB.login(
      async (response: { authResponse?: { accessToken?: string } }) => {
        const accessToken = response?.authResponse?.accessToken;

        if (!accessToken) {
          onError?.('Facebook sign-in was cancelled');

          return;
        }

        setPending(true);
        try {
          const result = await facebookLogin(accessToken);

          if (result.success && result.user) {
            onSuccess(result.user);
          } else {
            onError?.(result.message ?? 'Facebook sign-in failed');
          }
        } finally {
          setPending(false);
        }
      },
      { scope: 'public_profile,email' }
    );
  }, [onSuccess, onError]);

  // No app id configured → render nothing (email/password + Google still work).
  if (!appId) return null;

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', minHeight: 44 }}>
      <ButtonBase
        onClick={handleClick}
        disabled={pending}
        sx={{
          width: '100%',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          px: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '4px',
          fontSize: 14,
          fontWeight: 500,
          color: 'text.primary',
          backgroundColor: '#fff',
          opacity: pending ? 0.5 : 1,
          pointerEvents: pending ? 'none' : 'auto',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        }}
      >
        <Box component="span" sx={{ position: 'absolute', left: 16, display: 'flex', alignItems: 'center' }}>
          <Facebook fill="#1877F2" size={20} />
        </Box>
        Sign in with Facebook
      </ButtonBase>
      {pending && <CircularProgress size={22} sx={{ position: 'absolute', top: 'calc(50% - 11px)' }} />}
    </Box>
  );
};

export default FacebookSignInButton;
