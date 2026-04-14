import { Button, Grid, Icon, List, ListItem, Stack, Tooltip, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import FlagIcon from '@/components/FlagIcon';
import Check from '@/components/SvgIcons/Check';
import Information from '@/components/SvgIcons/Information';
import { PolicyItem, availabilityCardConfig } from '@/config/availabilityCard.config';
import { Status, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { useReservation } from '@/utils/hooks/useReservation';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

interface AvailabilityCardProps {
  yacht: YachtModel;
  offer: YachtOfferModel;
}

const AvailabilityCard = ({ yacht, offer }: AvailabilityCardProps) => {
  const { name, model, amenities, inquireOnly } = yacht;
  const { clientPricePerDayEur, clientPricePerDayInfo, locationFrom } = offer;
  const tCommon = useTranslations('common');
  const t = useTranslations('yacht');
  const locale = useLocale();

  const isInquireOnly = offer.status === Status.OPTION || inquireOnly;

  const displayPrice = formatPriceWithCurrency({
    clientPriceEur: clientPricePerDayEur,
    clientPriceInfo: clientPricePerDayInfo,
    locale,
  });

  const { handleReservation } = useReservation({ yacht });

  const handleBookNow = () => {
    if (isInquireOnly) {
      toggleBoatInquiryModalOpen();

      return;
    }

    handleReservation(offer.id);
  };

  return (
    <Stack borderRadius={2.5} overflow="hidden" border={`1px solid ${colors.blue200}`}>
      <Stack
        padding={{ xs: 2, md: 3 }}
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 3 }}
        justifyContent="space-between"
        sx={{ backgroundColor: colors.blue50 }}
      >
        <Stack>
          <Typography variant="h3" fontWeight={700}>
            {model} | {name}
          </Typography>
          {locationFrom.name && (
            <Stack direction="row" alignItems="center" gap={1} mt={1}>
              <FlagIcon countryCode={locationFrom.countryCode} />
              <Typography variant="body1">{locationFrom.name}</Typography>
            </Stack>
          )}
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1.5}>
          <Stack>
            <Typography variant="h2" component="p" fontWeight={700} color="success">
              {displayPrice}
            </Typography>
            <Typography variant="body2" textAlign={{ sx: 'start', md: 'end' }} color={colors.black600}>
              {tCommon('perDay')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" width="auto" gap={1}>
            <Button size="large" sx={{ ml: 0 }} onClick={handleBookNow}>
              {isInquireOnly ? t('inquireNow') : tCommon('bookNow')}
            </Button>
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
      </Stack>
    </Stack>
  );
};

export default AvailabilityCard;
