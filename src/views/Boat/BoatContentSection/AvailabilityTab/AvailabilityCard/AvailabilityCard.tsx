/* eslint-disable no-nested-ternary */
import { Button, Grid, Icon, List, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import Check from '@/components/SvgIcons/Check';
import Information from '@/components/SvgIcons/Information';
import { PolicyItem, availabilityCardConfig } from '@/config/availabilityCard.config';
import { YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

interface AvailabilityCardProps {
  yacht: YachtModel;
  offer: YachtOfferModel;
}

const AvailabilityCard = ({ yacht, offer }: AvailabilityCardProps) => {
  const { name, model, amenities } = yacht;
  const { clientPricePerDayEur, clientPriceEur, clientPriceInfo, listPriceEur, listPriceInfo, numberOfDays } = offer;
  const tCommon = useTranslations('common');
  const t = useTranslations('yacht');
  const locale = useLocale();

  // Compute days: use `numberOfDays` from backend when available, else derive
  // from the totals, else fall back to a 7-day assumption.
  const days =
    numberOfDays && numberOfDays > 0
      ? numberOfDays
      : clientPricePerDayEur > 0
        ? Math.round(clientPriceEur / clientPricePerDayEur)
        : 7;

  const showListPrice = typeof listPriceEur === 'number' && listPriceEur > clientPriceEur;
  const discountPercent = showListPrice ? Math.round(((listPriceEur! - clientPriceEur) / listPriceEur!) * 100) : 0;

  // Round to whole euros for cleaner display ("3,001 €" not "3,001.68 €")
  const roundedTotal = Math.round(clientPriceEur);
  const roundedTotalInfo = clientPriceInfo
    ? { ...clientPriceInfo, amount: Math.round(clientPriceInfo.amount) }
    : clientPriceInfo;
  const roundedListPrice = showListPrice ? Math.round(listPriceEur!) : null;
  const roundedListPriceInfo =
    showListPrice && listPriceInfo ? { ...listPriceInfo, amount: Math.round(listPriceInfo.amount) } : null;

  const formattedTotal = formatPriceWithCurrency({
    clientPriceEur: roundedTotal,
    clientPriceInfo: roundedTotalInfo,
    locale,
  });
  const formattedListPrice = showListPrice
    ? formatPriceWithCurrency({
        clientPriceEur: roundedListPrice!,
        clientPriceInfo: roundedListPriceInfo ?? undefined,
        locale,
      })
    : null;

  return (
    <Stack borderRadius={2.5} overflow="hidden" border={`1px solid ${colors.blue200}`}>
      <Stack
        padding={{ xs: 2, md: 3 }}
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ backgroundColor: colors.blue50 }}
      >
        <Typography variant="h3" fontWeight={700}>
          {model} | {toTitleCase(name)}
        </Typography>
        <Stack alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
          <Typography variant="body2" color={colors.black600}>
            {tCommon('priceForXDays', { days: String(days) })}
          </Typography>
          {showListPrice && (
            <Typography variant="body2" color={colors.black950} fontWeight={800} sx={{ mt: 0.25 }}>
              − {discountPercent}%
            </Typography>
          )}
          <Stack direction="row" alignItems="baseline" gap={1} sx={{ mt: 0.25 }}>
            {showListPrice && (
              <Typography variant="body2" color={colors.black500} sx={{ textDecoration: 'line-through' }}>
                {formattedListPrice}
              </Typography>
            )}
            <Typography variant="h3" component="p" fontWeight={700} color="success">
              {formattedTotal}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding={{ xs: 2, md: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700}>
              {t('paymentPolicies')}
            </Typography>
            <List sx={{ padding: 0, marginTop: 2 }}>
              {availabilityCardConfig.paymentPolicies.map((policy: PolicyItem, index: number) => (
                <ListItem
                  key={`${index + 1}`}
                  sx={{
                    color: policy.textColor === 'success' ? colors.green500 : 'inherit',
                    fontWeight: policy.textColor === 'success' ? 700 : 'normal',
                  }}
                >
                  {policy.title}{' '}
                  {policy.tooltip && (
                    <Tooltip
                      title={policy.tooltip}
                      placement="right-end"
                      slotProps={{
                        transition: { timeout: 0 },
                      }}
                    >
                      <Icon
                        sx={{
                          color: colors.black400,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { color: colors.black950 },
                        }}
                      >
                        <Information size={20} />
                      </Icon>
                    </Tooltip>
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700}>
              {t('priceIncludes')}
            </Typography>
            <List sx={{ padding: 0, marginTop: 2 }}>
              {amenities.slice(0, 3).map(amenity => (
                <ListItem key={amenity.id}>
                  <Check size={24} fill={colors.black300} />
                  {amenity.name}
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          mt={3}
          pt={3}
          borderTop={`1px solid ${colors.blue200}`}
        >
          <Typography variant="h4" fontWeight={700}>
            {t('anyQuestions')}
          </Typography>
          <Button size="medium" color="secondary" onClick={toggleBoatInquiryModalOpen}>
            {t('reachOut')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AvailabilityCard;
