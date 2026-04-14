'use client';

import React, { useEffect, useState } from 'react';
import { Controller, type ControllerProps, type FieldError, type Validate, useFormContext } from 'react-hook-form';

import Autocomplete from '@mui/material/Autocomplete';
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

const detectUserCountry = async (): Promise<PhoneCountry> => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  const countryCode = data.country_code;

  if (countryCode) {
    const detectedCountry = phoneCountries.find(country => country.iso2Code === countryCode);

    if (detectedCountry) {
      return detectedCountry;
    }
  }

  return getDefaultCountry();
};

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
    const cleaned = number.replace(/\D/g, '');

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
              popupIcon={<ChevronDown props={{ className: styles.chevronIcon }} size={20} />}
              renderOption={(props, option) => (
                <Box component="li" {...props} className={styles.option}>
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
              )}
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
