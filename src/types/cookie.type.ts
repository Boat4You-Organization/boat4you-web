export interface Cookie {
  name: string;
  domain: string;
  duration: string;
  description: string;
}

export interface CookieSettingConfig {
  key: 'essential' | 'analytics' | 'marketing';
  name: string;
  description: string;
  cookies: Cookie[];
  required: boolean;
}

export interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentData extends CookieSettings {
  consentGiven: boolean;
}

export type CookieSettingsConfigArray = CookieSettingConfig[];
