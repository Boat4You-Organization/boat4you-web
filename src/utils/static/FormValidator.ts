import Validator from 'validator';

export const acceptedMimeTypes = '.pdf,application/pdf,image/heic,image/png,image/jpg,image/jpeg';

export const acceptedImageTypes = 'image/heic,image/png,image/jpg,image/jpeg';

export const acceptedAppendixTypes = '.pdf,application/pdf';

// Client mirror of the backend PasswordPolicy.MIN_LENGTH (12). Keep in sync with
// security/services/PasswordPolicy.kt — the server stays the source of truth; this only
// drives the inline requirement hint + pre-submit guard so users don't hit a server 400.
export const MIN_PASSWORD_LENGTH = 12;

type ValidationFn<T = string> = (value?: T) => string | true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslateFn = (key: any, values?: any) => string;

export class FormValidator {
  public static all<T = string>(...validationFns: ValidationFn<T>[]): ValidationFn<T> {
    return value => {
      const errors = validationFns.map(fn => fn(value));

      return errors.find(e => e !== true) || true;
    };
  }

  public static skipValidation: ValidationFn = () => true;

  // Backward compatible static methods (use English fallback)
  public static isNotEmpty: ValidationFn = value => (Validator.isEmpty(value || '') ? 'Required' : true);

  public static isValidEmail: ValidationFn = value => (Validator.isEmail(value || '') ? true : 'Invalid email address');

  public static isWholeNumber: ValidationFn = value => {
    const num = String(value);

    return /^\d+$/.test(num || '') ? true : 'Must be a whole number';
  };

  public static isValidPhoneNumber: ValidationFn = value => {
    if (!value || value.trim() === '') return 'Phone number is required';

    const cleanPhone = value.replace(/[^\d+]/g, '');

    if (!/^\+?\d+$/.test(cleanPhone)) {
      return 'Phone number can only contain digits and an optional + at the start';
    }

    const digitsOnly = cleanPhone.replace('+', '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return 'Phone number must be between 10 and 15 digits';
    }

    if (cleanPhone.startsWith('+')) {
      const countryCode = cleanPhone.slice(1).match(/^\d{1,4}/)?.[0];

      if (!countryCode || countryCode.length === 0) {
        return 'Please enter a valid phone number with country code';
      }
    }

    return true;
  };

  public static isValidPhoneNumberWithCountry =
    (countryDialCode: string): ValidationFn =>
    value => {
      if (!value || value.trim() === '') return 'Phone number is required';

      const cleanPhone = value.replace(/[^\d+]/g, '');

      if (!/^\+?\d+$/.test(cleanPhone)) {
        return 'Phone number can only contain digits and an optional + at the start';
      }

      if (!cleanPhone.startsWith(countryDialCode)) {
        return `Phone number must start with ${countryDialCode}`;
      }

      const digitsOnly = cleanPhone.replace('+', '');

      const phoneNumberLengths: Record<string, { min: number; max: number }> = {
        '+1': { min: 11, max: 11 },
        '+44': { min: 12, max: 13 },
        '+49': { min: 12, max: 14 },
        '+33': { min: 11, max: 12 },
        '+34': { min: 11, max: 11 },
        '+39': { min: 11, max: 13 },
        '+351': { min: 12, max: 12 },
        '+385': { min: 11, max: 12 },
        '+61': { min: 11, max: 11 },
      };

      const lengthConfig = phoneNumberLengths[countryDialCode] || { min: 10, max: 15 };

      if (digitsOnly.length < lengthConfig.min || digitsOnly.length > lengthConfig.max) {
        return `Phone number must be between ${lengthConfig.min} and ${lengthConfig.max} digits for ${countryDialCode}`;
      }

      return true;
    };

  public static matchesPassword =
    (passwordValue: string): ValidationFn =>
    (value?: string) => {
      if (!value) return 'Required';

      return value === passwordValue ? true : 'Passwords do not match';
    };

  public static minLength =
    (min: number): ValidationFn =>
    (value?: string) =>
      (value || '').length >= min ? true : `At least ${min} characters`;

  // New translated validation methods
  public static withTranslation(t: TranslateFn) {
    return {
      isNotEmpty: (value?: string) => (Validator.isEmpty(value || '') ? t('validation.required') : true),

      isValidEmail: (value?: string) => (Validator.isEmail(value || '') ? true : t('validation.invalidEmail')),

      isWholeNumber: (value?: string) => {
        const num = String(value);

        return /^\d+$/.test(num || '') ? true : t('validation.mustBeWholeNumber');
      },

      isValidPhoneNumber: (value?: string) => {
        if (!value || value.trim() === '') return t('validation.phoneNumberRequired');

        const cleanPhone = value.replace(/[^\d+]/g, '');

        if (!/^\+?\d+$/.test(cleanPhone)) {
          return t('validation.phoneNumberInvalidFormat');
        }

        const digitsOnly = cleanPhone.replace('+', '');

        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          return t('validation.phoneNumberInvalidLength');
        }

        if (cleanPhone.startsWith('+')) {
          const countryCode = cleanPhone.slice(1).match(/^\d{1,4}/)?.[0];

          if (!countryCode || countryCode.length === 0) {
            return t('validation.phoneNumberInvalidCountryCode');
          }
        }

        return true;
      },

      matchesPassword: (passwordValue: string) => (value?: string) => {
        if (!value) return t('validation.required');

        return value === passwordValue ? true : t('validation.passwordsDoNotMatchValidation');
      },

      minLength: (min: number) => (value?: string) =>
        (value || '').length >= min ? true : t('validation.passwordMinLength', { count: min }),

      isValidPhoneNumberWithCountry: (countryDialCode: string) => (value?: string) => {
        if (!value || value.trim() === '') return t('validation.phoneNumberRequired');

        const cleanPhone = value.replace(/[^\d+]/g, '');

        if (!/^\+?\d+$/.test(cleanPhone)) {
          return t('validation.phoneNumberInvalidFormat');
        }

        if (!cleanPhone.startsWith(countryDialCode)) {
          return t('validation.phoneNumberInvalidCountryCode');
        }

        const digitsOnly = cleanPhone.replace('+', '');

        const phoneNumberLengths: Record<string, { min: number; max: number }> = {
          '+1': { min: 11, max: 11 },
          '+44': { min: 12, max: 13 },
          '+49': { min: 12, max: 14 },
          '+33': { min: 11, max: 12 },
          '+34': { min: 11, max: 11 },
          '+39': { min: 11, max: 13 },
          '+351': { min: 12, max: 12 },
          '+385': { min: 11, max: 12 },
          '+61': { min: 11, max: 11 },
        };

        const lengthConfig = phoneNumberLengths[countryDialCode] || { min: 10, max: 15 };

        if (digitsOnly.length < lengthConfig.min || digitsOnly.length > lengthConfig.max) {
          return t('validation.phoneNumberInvalidLength');
        }

        return true;
      },
    };
  }
}
