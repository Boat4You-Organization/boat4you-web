'use client';

import React, { useEffect, useState } from 'react';
import { Controller, type ControllerProps, type FieldError, type Validate, useFormContext } from 'react-hook-form';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import ChevronDown from '@/components/SvgIcons/ChevronDown';
import { PhoneCountry, phoneCountries } from '@/config/phone-countries.config';

import styles from './PhoneInput.module.scss';

export interface PhoneInputProps extends Omit<TextFieldProps, 'name'> {
  name: ControllerProps['name'];
  formLabel?: string | React.ReactElement;
  formLabelAction?: React.ReactElement;
  label?: string | React.ReactElement;
  validate?: Validate<string, unknown> | Record<string, Validate<string, unknown>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNestedError = (name: string, errors: any): FieldError | undefined =>
  name.split(/[.[\]]+/).reduce((acc, key) => acc?.[key], errors);

const getDefaultCountry = (): PhoneCountry => {
  const defaultCountry = phoneCountries.find(country => country.iso2Code === 'US');

  return defaultCountry || phoneCountries[0];
};

// MUI's default Autocomplete filter uses `getOptionLabel`, which we render as
// "🇭🇷 +385" — so typing "cro" or "croatia" wouldn't match anything. This filter
// searches the country name, ISO code, and dial code together.
const countryFilter = createFilterOptions<PhoneCountry>({
  matchFrom: 'any',
  ignoreCase: true,
  stringify: option => `${option.name} ${option.iso2Code} ${option.dialCode}`,
});

const detectUserCountry = (): Promise<PhoneCountry> =>
  // ipapi.co is third-party — ad-blockers / privacy extensions / corporate
  // proxies routinely block it. Some Chrome extensions even override
  // window.fetch and throw synchronously *before* the await runs ("Failed
  // to fetch" out of activeContent.js), which an `async` function leaks
  // as an uncaught rejection that the Next.js dev overlay surfaces.
  // Returning the chain instead of awaiting keeps every failure mode —
  // sync throw, network error, non-OK status, malformed body — funneled
  // through a single .catch that returns the default country.
  Promise.resolve()
    .then(() => fetch('https://ipapi.co/json/'))
    .then(response => (response.ok ? response.json() : null))
    .then((data: { country_code?: string } | null) => {
      const countryCode = data?.country_code;

      if (!countryCode) return getDefaultCountry();

      return phoneCountries.find(country => country.iso2Code === countryCode) ?? getDefaultCountry();
    })
    .catch(() => getDefaultCountry());

export const PhoneInput = ({
  name,
  formLabel,
  formLabelAction,
  validate,
  required,
  disabled,
  placeholder,
  ...textFieldProps
}: PhoneInputProps) => {
  const { control, formState } = useFormContext();
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(getDefaultCountry());
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const error = getNestedError(name, formState.errors);

  useEffect(() => {
    detectUserCountry().then(country => {
      setSelectedCountry(country);
    });
  }, []);

  const formatPhoneNumber = (value: string, country: PhoneCountry): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    if (country.iso2Code === 'US' || country.iso2Code === 'CA') {
      if (cleaned.length <= 3) return cleaned;

      if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;

      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

    if (cleaned.length <= 3) return cleaned;

    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;

    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  };

  const getE164Format = (country: PhoneCountry, number: string): string => {
    let cleaned = number.replace(/\D/g, '');

    if (!cleaned) return '';

    // People habitually type their number in NATIONAL format with the trunk
    // prefix ("0" in most of Europe): 098 360 398. In international format the
    // trunk zero is dropped — +385 98 360 398, NOT +385 098 360 398 (the
    // latter is undialable abroad). Exception: Italy (+39) and San Marino
    // (+378, Italian numbering plan) — their leading 0 is PART of the
    // subscriber number and must be kept (+39 06 … is a valid Rome number).
    if (country.iso2Code !== 'IT' && country.iso2Code !== 'SM') {
      cleaned = cleaned.replace(/^0+/, '');
    }

    if (!cleaned) return '';

    return `${country.dialCode}${cleaned}`;
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const inputValue = event.target.value;
    const formatted = formatPhoneNumber(inputValue, selectedCountry);

    setPhoneNumber(formatted);

    const e164 = getE164Format(selectedCountry, formatted);

    onChange(e164);
  };

  const handleCountryChange = (newCountry: PhoneCountry | null, onChange: (value: string) => void) => {
    if (newCountry) {
      setSelectedCountry(newCountry);

      const e164 = getE164Format(newCountry, phoneNumber);

      onChange(e164);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate }}
      render={({ field: { onChange } }) => (
        <FormControl fullWidth error={!!error} disabled={disabled}>
          {formLabel && (
            <Box className={styles.labelContainer}>
              <FormLabel required={required}>
                {formLabel}
                {required && <span className={styles.required}> *</span>}
              </FormLabel>
              {formLabelAction}
            </Box>
          )}

          <Box className={styles.container}>
            <Autocomplete
              value={selectedCountry}
              onChange={(_, newValue) => handleCountryChange(newValue, onChange)}
              options={phoneCountries}
              getOptionLabel={option => `${option.flag} ${option.dialCode}`}
              filterOptions={countryFilter}
              popupIcon={<ChevronDown props={{ className: styles.chevronIcon }} size={20} />}
              renderOption={(props, option) => {
                const { key, ...rest } = props as typeof props & { key?: React.Key };

                return (
                  <Box component="li" key={key} {...rest} className={styles.option}>
                    <Box component="span" className={styles.flag}>
                      {option.flag}
                    </Box>
                    <Box component="span" className={styles.countryName}>
                      {option.name}
                    </Box>
                    <Box component="span" className={styles.dialCode}>
                      {option.dialCode}
                    </Box>
                  </Box>
                );
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={styles.countrySelector}
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                    },
                  }}
                />
              )}
              disabled={disabled}
              disableClearable
              className={styles.autocomplete}
              slotProps={{
                paper: {
                  className: styles.dropdown,
                  sx: {
                    width: 'auto',
                    minWidth: '320px',
                  },
                },
                listbox: {
                  style: {
                    maxHeight: '300px',
                  },
                },
                popper: {
                  placement: 'bottom-start',
                  className: styles.dropdown,
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        padding: 8,
                      },
                    },
                  ],
                  sx: {
                    width: 'auto',
                  },
                },
              }}
            />

            <TextField
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePhoneChange(e, onChange)}
              placeholder={placeholder || 'Enter phone number'}
              variant="outlined"
              disabled={disabled}
              error={!!error}
              className={styles.phoneInput}
              {...textFieldProps}
            />
          </Box>

          {error && <FormHelperText error>{error.message}</FormHelperText>}
          {!error && textFieldProps.helperText && <FormHelperText>{textFieldProps.helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
