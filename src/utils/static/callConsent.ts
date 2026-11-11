/**
 * AI call center ("Nika"): what an inquiry tells the backend about consent.
 *
 * CALL_SITE is this site's key in the backend's CallSite. The version names
 * the checkbox text the visitor agreed to (messages: common.callConsent);
 * change the text, bump the version (at most 20 characters).
 */
export const CALL_SITE = 'boat4you';
export const CALL_CONSENT_TEXT_VERSION = 'calls-consent-v1';

export const callConsentFields = (agreed: boolean) =>
  agreed ? { contactConsent: true, consentTextVersion: CALL_CONSENT_TEXT_VERSION } : { contactConsent: false };
