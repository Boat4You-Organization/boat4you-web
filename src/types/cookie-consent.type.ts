export const CONSENT_COOKIE_NAME = 'boat4you_cookie_consent';
export const CONSENT_DURATION = 12 * 30 * 24 * 60 * 60 * 1000;
export const CONSENT_VERSION = '1.1';

export interface CookieConsentType {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  consentGiven: boolean;
  timestamp: number;
  version: string;
}
