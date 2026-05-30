'use client';

import { useEffect, useState } from 'react';

import CookieConsent from '@/components/CookieConsent';
import { shouldShowBanner } from '@/lib/cookie-consent';

const CookieConsentController = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setShowConsent(shouldShowBanner());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleConsentChange = () => {
      setShowConsent(shouldShowBanner());
    };

    // GDPR Art. 7(3): withdrawing consent must be as easy as giving it. The
    // footer "Cookie settings" button dispatches this so the consent UI can be
    // re-opened at any time, even after consent was already given.
    const handleOpenSettings = () => {
      setShowConsent(true);
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('consentUpdated', handleConsentChange);
    window.addEventListener('openCookieSettings', handleOpenSettings);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('consentUpdated', handleConsentChange);
      window.removeEventListener('openCookieSettings', handleOpenSettings);
    };
  }, []);

  if (!isLoaded) return null;

  return <CookieConsent showConsent={showConsent} />;
};

export default CookieConsentController;
