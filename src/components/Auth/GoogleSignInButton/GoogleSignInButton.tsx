'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { googleLogin } from '@/actions/auth.actions';
import { UserModel } from '@/models/user.model';

interface GoogleSignInButtonProps {
  onSuccess: (user: UserModel) => void;
  onError?: (message: string) => void;
}

const GSI_SCRIPT_ID = 'google-gsi-client';
const GSI_SRC = 'https://accounts.google.com/gsi/client';
const GSI_MAX_WIDTH = 400;

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * "Continue with Google" — renders Google's official Identity Services button
 * (loads the GSI script once, no extra npm dependency) and exchanges the
 * returned ID token for our session via the `googleLogin` server action. On
 * success the parent decides what to do (close modal, setUser, toast); this
 * component owns only the button + its pending state.
 *
 * If NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set at build time the component renders
 * nothing, so the surrounding email/password form keeps working unchanged.
 */
const GoogleSignInButton = ({ onSuccess, onError }: GoogleSignInButtonProps) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const buttonRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);

  const handleCredential = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) {
        onError?.('Google sign-in was cancelled');

        return;
      }

      setPending(true);
      try {
        const result = await googleLogin(response.credential);

        if (result.success && result.user) {
          onSuccess(result.user);
        } else {
          onError?.(result.message ?? 'Google sign-in failed');
        }
      } finally {
        setPending(false);
      }
    },
    [onSuccess, onError]
  );

  useEffect(() => {
    if (!clientId) return undefined;

    const render = () => {
      const { google } = window as any;

      if (!google?.accounts?.id || !buttonRef.current) return;

      google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });

      const width = Math.min(GSI_MAX_WIDTH, buttonRef.current.parentElement?.clientWidth ?? 360);

      google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: String(width),
      });
    };

    if ((window as any).google?.accounts?.id) {
      render();

      return undefined;
    }

    let script = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = GSI_SCRIPT_ID;
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.addEventListener('load', render);

    return () => script?.removeEventListener('load', render);
  }, [clientId, handleCredential]);

  // No client id configured → render nothing (email/password form still works).
  if (!clientId) return null;

  return (
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', minHeight: 44 }}>
      <Box
        ref={buttonRef}
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: pending ? 0.5 : 1,
          pointerEvents: pending ? 'none' : 'auto',
        }}
      />
      {pending && <CircularProgress size={22} sx={{ position: 'absolute', top: 'calc(50% - 11px)' }} />}
    </Box>
  );
};

export default GoogleSignInButton;
