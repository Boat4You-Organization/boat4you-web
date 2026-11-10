'use client';

import { useId, useMemo, useState } from 'react';

import { Box, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import {
  KLARNA_FIELD_MAX,
  KlarnaBilling,
  KlarnaBillingField,
  KlarnaCountry,
  klarnaBillingErrors,
} from '@/models/klarna.model';
import colors from '@/styles/themes/colors';

interface KlarnaBillingFormProps {
  value: KlarnaBilling;
  onChange: (next: KlarnaBilling) => void;
  /** Countries Klarna accepts for this amount (already filtered by the caller). */
  countries: readonly KlarnaCountry[];
  /** Show every field's error, not only the ones the customer has left (after a submit attempt). */
  showAllErrors?: boolean;
  /** Muted line under the form, given the localised list of countries ("Austria, Germany and Italy"). */
  note: (countryList: string) => string;
}

const AUTOCOMPLETE: Record<KlarnaBillingField, string> = {
  givenName: 'billing given-name',
  familyName: 'billing family-name',
  streetAndNumber: 'billing address-line1',
  postalCode: 'billing postal-code',
  city: 'billing address-level2',
  country: 'billing country',
};

/** Localised country name; falls back to the code where Intl.DisplayNames is missing. */
const countryNamer = (locale: string) => {
  try {
    const names = new Intl.DisplayNames([locale], { type: 'region' });

    return (code: string) => names.of(code) ?? code;
  } catch {
    return (code: string) => code;
  }
};

/**
 * Billing address Klarna needs (first and last name, street and number, postal code, city, country). Controlled:
 * the parent owns the values and decides when it is valid (klarnaBillingErrors). Errors show once a field has
 * been left, or all of them after a submit attempt; each error is tied to its field (aria-invalid +
 * aria-describedby via MUI's helper text).
 */
const KlarnaBillingForm = ({ value, onChange, countries, showAllErrors = false, note }: KlarnaBillingFormProps) => {
  const t = useTranslations('common.klarna');
  const locale = useLocale();
  const idPrefix = useId();
  const [touched, setTouched] = useState<Partial<Record<KlarnaBillingField, boolean>>>({});

  const nameOf = useMemo(() => countryNamer(locale), [locale]);
  const countryOptions = useMemo(
    () =>
      countries.map(c => ({ code: c.code, name: nameOf(c.code) })).sort((a, b) => a.name.localeCompare(b.name, locale)),
    [countries, nameOf, locale]
  );
  const countryList = useMemo(() => {
    const names = countryOptions.map(c => c.name);

    try {
      return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(names);
    } catch {
      return names.join(', ');
    }
  }, [countryOptions, locale]);
  const errors = klarnaBillingErrors(
    value,
    countries.map(c => c.code)
  );

  const errorText = (field: KlarnaBillingField): string | undefined => {
    const error = errors[field];

    if (!error || !(showAllErrors || touched[field])) return undefined;

    if (error === 'tooLong') return t('errors.tooLong', { max: String(KLARNA_FIELD_MAX[field]) });

    return t(`errors.${error}`);
  };

  const set = (field: KlarnaBillingField, next: string) => onChange({ ...value, [field]: next });
  const leave = (field: KlarnaBillingField) => setTouched(prev => ({ ...prev, [field]: true }));

  const renderText = (field: Exclude<KlarnaBillingField, 'country'>) => {
    const id = `${idPrefix}-${field}`;
    const error = errorText(field);

    return (
      <FormControl fullWidth key={field}>
        <FormLabel htmlFor={id} required sx={{ mb: 1 }}>
          {t(`labels.${field}`)}
        </FormLabel>
        <TextField
          id={id}
          value={value[field]}
          onChange={event => set(field, event.target.value)}
          onBlur={() => leave(field)}
          error={!!error}
          helperText={error}
          slotProps={{
            htmlInput: {
              autoComplete: AUTOCOMPLETE[field],
              maxLength: KLARNA_FIELD_MAX[field],
              'aria-required': true,
              ...(field === 'postalCode' ? { autoCapitalize: 'characters' } : {}),
            },
          }}
        />
      </FormControl>
    );
  };

  const countryId = `${idPrefix}-country`;
  const countryError = errorText('country');

  return (
    <Box data-clarity-mask="true">
      <Typography variant="body1" fontWeight={700} mb={1.5}>
        {t('billingTitle')}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          columnGap: 2,
          rowGap: 2,
          '& > .klarna-wide': { gridColumn: '1 / -1' },
        }}
      >
        {renderText('givenName')}
        {renderText('familyName')}
        <Box className="klarna-wide">{renderText('streetAndNumber')}</Box>
        {renderText('postalCode')}
        {renderText('city')}
        <FormControl fullWidth className="klarna-wide">
          <FormLabel htmlFor={countryId} required sx={{ mb: 1 }}>
            {t('labels.country')}
          </FormLabel>
          <TextField
            id={countryId}
            select
            value={value.country}
            onChange={event => {
              set('country', event.target.value);
              leave('country');
            }}
            onBlur={() => leave('country')}
            error={!!countryError}
            helperText={countryError}
            slotProps={{
              select: { native: true },
              htmlInput: { autoComplete: AUTOCOMPLETE.country, 'aria-required': true },
            }}
          >
            <option value="">{t('labels.countryPlaceholder')}</option>
            {countryOptions.map(c => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </TextField>
        </FormControl>
      </Box>
      <Typography variant="body2" color={colors.black500} mt={1.5}>
        {note(countryList)}
      </Typography>
    </Box>
  );
};

export default KlarnaBillingForm;
