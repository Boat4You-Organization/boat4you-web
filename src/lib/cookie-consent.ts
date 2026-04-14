import { CONSENT_COOKIE_NAME, CONSENT_DURATION, CONSENT_VERSION, CookieConsentType } from '@/types/cookie-consent.type';

export function getCookieConsent(): CookieConsentType | null {
  try {
    if (typeof window === 'undefined') return null;

    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${CONSENT_COOKIE_NAME}=`));

    if (!cookie) return null;

    const cookieValue = cookie.split('=')[1];

    if (!cookieValue) return null;

    const consent = JSON.parse(decodeURIComponent(cookieValue));

    if (
      typeof consent !== 'object' ||
      typeof consent.essential !== 'boolean' ||
      typeof consent.analytics !== 'boolean' ||
      typeof consent.marketing !== 'boolean' ||
      typeof consent.consentGiven !== 'boolean' ||
      typeof consent.timestamp !== 'number' ||
      typeof consent.version !== 'string'
    ) {
      return null;
    }

    return consent;
  } catch (error) {
    return null;
  }
}

export function hasValidConsent(): boolean {
  const consent = getCookieConsent();

  if (!consent || !consent.consentGiven) return false;

  const isExpired = Date.now() - consent.timestamp > CONSENT_DURATION;

  if (isExpired) return false;

  return consent.version === CONSENT_VERSION;
}

export function shouldShowAnalytics(): boolean {
  const consent = getCookieConsent();

  return hasValidConsent() && consent?.analytics === true;
}

export function shouldShowBanner(): boolean {
  return !hasValidConsent();
}

export function shouldShowMarketing(): boolean {
  const consent = getCookieConsent();

  return hasValidConsent() && consent?.marketing === true;
}

export function shouldLoadMarketingScripts(): boolean {
  return shouldShowMarketing();
}

export function setCookieConsent(consent: Omit<CookieConsentType, 'timestamp' | 'version'>): void {
  const fullConsent: CookieConsentType = {
    ...consent,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  const cookieValue = encodeURIComponent(JSON.stringify(fullConsent));
  const maxAge = CONSENT_DURATION / 1000;

  document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; path=/; max-age=${maxAge}; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;

  window.dispatchEvent(new CustomEvent('consentUpdated', { detail: fullConsent }));
}
