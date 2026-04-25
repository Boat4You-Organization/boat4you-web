import React, { useEffect } from 'react';

import { Grid, Stack, Typography } from '@mui/material';
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
  const { selectedOffer } = useYachtStore();
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
  const obligatoryServices = sortedServices.filter(
    s => s.obligatory || obligatoryKeys.includes(s.key),
  );
  const optionalServices = sortedServices.filter(
    s => !s.obligatory && !obligatoryKeys.includes(s.key),
  );

  const securityDepositPrice =
    yacht.securityDeposit > 0
      ? formatPriceWithCurrency({ clientPriceEur: yacht.securityDeposit, locale })
      : null;

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
          <Grid
            component="article"
            container
            alignItems="center"
            borderRadius={1.5}
            px={2}
            py={0.75}
            spacing={1.5}
            sx={{
              // Match the obligatory ExtrasCard visual: white bg + bottom
              // border + 0.7 opacity so the row blends seamlessly with the
              // mandatory partner rows above it in the "Selected services"
              // section (flagged by Mario 23.4.2026 — standalone styling
              // read too bold vs adjacent rows).
              backgroundColor: '#fff',
              borderBottom: `1px solid ${colors.black200}`,
              opacity: 0.7,
              cursor: 'not-allowed',
            }}
          >
            <Grid size={{ xs: 1 }}>
              <Checkbox checked value disabled />
            </Grid>
            <Grid size={{ xs: 7, lg: 8 }}>
              <Typography component="h3" variant="body1" fontWeight={700} color={colors.black950}>
                {tServices('refundable-security-deposit')}
              </Typography>
              <Typography
                variant="body2"
                color={colors.black500}
                sx={{ fontSize: 12, mt: 0.25 }}
              >
                {tCommon('refundableSecurityDepositDescription')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 4, lg: 3 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="baseline" gap={0.5} flexWrap="wrap">
                <Typography color={colors.black950} component="p" variant="body1" fontWeight={700}>
                  {securityDepositPrice}
                </Typography>
                <Typography variant="body2" color={colors.black500}>
                  {tCommon('extrasUnits.perBooking')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
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
