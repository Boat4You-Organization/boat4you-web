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

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('consentUpdated', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('consentUpdated', handleConsentChange);
    };
  }, []);

  if (!isLoaded) return null;

  return <CookieConsent showConsent={showConsent} />;
};

export default CookieConsentController;
