'use client';

import { CSSProperties, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'b4y_install_dismissed';

const wrap: CSSProperties = {
  position: 'fixed',
  left: 16,
  bottom: 16,
  zIndex: 1100,
  maxWidth: 380,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  background: '#fff',
  border: '1px solid #e6ebf0',
  borderRadius: 14,
  boxShadow: '0 8px 30px rgba(10,37,64,0.18)',
  padding: '12px 14px',
};

const btn: CSSProperties = {
  flexShrink: 0,
  background: '#f0c34f',
  color: '#0a2540',
  border: 0,
  borderRadius: 10,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
};

const close: CSSProperties = {
  flexShrink: 0,
  background: 'transparent',
  border: 0,
  color: '#9aa7b4',
  cursor: 'pointer',
  fontSize: 15,
  lineHeight: 1,
  padding: 4,
};

// Custom PWA install affordance: a dismissible chip that appears only when the
// app is installable. On Android / desktop Chrome it captures the native
// `beforeinstallprompt` and triggers it on click; on iOS Safari (which has no
// install API) it shows the "Share → Add to Home Screen" hint. Hidden when the
// app is already running standalone or the user dismissed it.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (standalone || localStorage.getItem(DISMISS_KEY) === '1') return undefined;

    const onBeforeInstall = (e: Event): void => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = (): void => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    const ua = window.navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);

    if (isIos && isSafari) {
      setIosHint(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!deferred) return;

    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  };

  const dismiss = (): void => {
    setVisible(false);

    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // private mode — ignore storage errors
    }
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Install Boat4You app" style={wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/favicons/android-chrome-192x192.png" alt="" width={40} height={40} style={{ borderRadius: 8 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#0a2540' }}>Install Boat4You</div>
        <div style={{ fontSize: 12, color: '#5b6b7b' }}>
          {iosHint ? 'Tap Share, then “Add to Home Screen”.' : 'Add to your home screen for one-tap access.'}
        </div>
      </div>
      {!iosHint && (
        <button type="button" onClick={install} style={btn}>
          Install
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label="Dismiss" style={close}>
        ✕
      </button>
    </div>
  );
}
