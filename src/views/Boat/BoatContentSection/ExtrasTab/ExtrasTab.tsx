import React, { useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import Checkbox from '@/components/Checkbox';
import ExtrasCard from '@/components/ExtrasCard';
import Extras from '@/components/SvgIcons/Extras';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { sortByObligatoryExtras } from '@/utils/static/sortUtils';
import { setObligatoryExtras } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

interface ExtrasTabProps {
  yacht: YachtModel;
}

const ExtrasTab = ({ yacht }: ExtrasTabProps) => {
  const { selectedOffer, calculatedPrice } = useYachtStore();
  const t = useTranslations('yacht');
  const tServices = useTranslations('yacht.servicesList');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    if (selectedOffer?.obligatoryExtrasKeys !== undefined) {
      setObligatoryExtras(selectedOffer.obligatoryExtrasKeys);
    }
  }, [selectedOffer?.obligatoryExtrasKeys, yacht.slug]);

  const sortedServices = yacht.services.sort(sortByObligatoryExtras(selectedOffer?.obligatoryExtrasKeys || []));

  // Split by obligatory flag so the list mirrors the competitor layout:
  // "Selected services" groups everything the client can't opt out of
  // (mandatory partner extras + refundable security deposit), "Optional
  // services" groups the rest. Partner obligatory flag is authoritative;
  // security deposit is always appended to the obligatory group because
  // it comes from yacht-level fields, not the services list.
  const obligatoryKeys = selectedOffer?.obligatoryExtrasKeys || [];
  // Extras the partner makes obligatory only because of the current selection
  // (e.g. Damage Waiver once a Skipper is added) come back flagged obligatory in
  // the live price calc — promote them into "Selected services" so they read as
  // mandatory (checked + locked, with their description) like the static ones.
  const dynamicObligatoryKeys = new Set(
    [...(calculatedPrice?.selectedExtrasInPrice ?? []), ...(calculatedPrice?.selectedExtrasAtBase ?? [])]
      .filter(extra => extra.obligatory)
      .map(extra => extra.key)
  );
  const obligatoryServices = sortedServices.filter(
    s => s.obligatory || obligatoryKeys.includes(s.key) || dynamicObligatoryKeys.has(s.key)
  );
  const optionalServices = sortedServices.filter(
    s => !s.obligatory && !obligatoryKeys.includes(s.key) && !dynamicObligatoryKeys.has(s.key)
  );

  const securityDepositPrice =
    yacht.securityDeposit > 0 ? formatPriceWithCurrency({ clientPriceEur: yacht.securityDeposit, locale }) : null;

  return (
    <Stack component="section" direction="column">
      <Typography
        component="h2"
        variant="h3"
        fontWeight={700}
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap={1}
      >
        <Extras variant="secondary" size={32} />
        {t('extrasTitle')}
      </Typography>
      <Stack spacing={0} pt={3}>
        {(obligatoryServices.length > 0 || securityDepositPrice) && (
          <Typography
            variant="body2"
            fontWeight={700}
            color={colors.black700}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12, mb: 1 }}
          >
            {t('selectedServices')}
          </Typography>
        )}
        {obligatoryServices.map(extra => {
          const { key, ...extraProps } = extra;

          return <ExtrasCard key={extra.id} {...extraProps} yachtSlug={yacht.slug} extraKey={key} />;
        })}
        {securityDepositPrice && (
          // Refundable Security Deposit comes from `yacht.securityDeposit`
          // (Nausys delivers it at yacht level, not a partner-sent extra).
          // Always mandatory + paid at the marina — rendered with the same
          // visual shape as an obligatory ExtrasCard: checked-disabled
          // checkbox on the left, title + description in the middle, price +
          // "per rental" + "mandatory" pill on the right. Keep in sync with
          // ExtrasCard layout so the list reads as one uniform column.
          //
          // Deposit insurance is a SEPARATE optional partner extra that
          // reduces the held amount — it stays in the normal list above.
          // Mirror the new ExtrasCard flex layout (Apr-2026 mobile fix) so this
          // virtual obligatory row visually aligns with the partner-sent ones
          // immediately above it. The previous MUI Grid wrapped the price
          // column inconsistently on long descriptions — flex with fixed
          // checkbox + flex-1 title + right-anchored vertical price stack
          // gives a deterministic 3-column layout at every viewport.
          <Box
            component="article"
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 1.25, sm: 1.5 },
              px: 2,
              py: 1.5,
              borderRadius: 1.5,
              backgroundColor: '#fff',
              borderBottom: `1px solid ${colors.black200}`,
              opacity: 0.7,
              cursor: 'not-allowed',
            }}
          >
            <Box sx={{ flexShrink: 0, mt: '-2px' }}>
              <Checkbox checked value disabled />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                component="h3"
                variant="body1"
                fontWeight={700}
                color={colors.black950}
                sx={{ wordBreak: 'break-word' }}
              >
                {tServices('refundable-security-deposit')}
              </Typography>
              <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
                {tCommon('refundableSecurityDepositDescription')}
              </Typography>
            </Box>
            <Stack
              direction="column"
              alignItems="flex-end"
              sx={{ flexShrink: 0, textAlign: 'right', minWidth: { xs: 64, sm: 80 } }}
            >
              <Typography
                color={colors.black950}
                component="p"
                variant="body1"
                fontWeight={700}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {securityDepositPrice}
              </Typography>
              <Typography variant="body2" color={colors.black500} sx={{ fontSize: 12, mt: 0.25 }}>
                {tCommon('extrasUnits.perBooking')}
              </Typography>
            </Stack>
          </Box>
        )}
        {optionalServices.length > 0 && (
          <Typography
            variant="body2"
            fontWeight={700}
            color={colors.black700}
            sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12, mt: 3, mb: 1 }}
          >
            {t('optionalServices')}
          </Typography>
        )}
        {optionalServices.map(extra => {
          const { key, ...extraProps } = extra;

          return <ExtrasCard key={extra.id} {...extraProps} yachtSlug={yacht.slug} extraKey={key} />;
        })}
      </Stack>
    </Stack>
  );
};

export default ExtrasTab;
