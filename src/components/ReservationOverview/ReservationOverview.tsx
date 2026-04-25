import { Box, Button, ButtonProps, Container, Divider, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import StatusChip from '@/components/StatusChip';
import ChevronRight from '@/components/SvgIcons/ChevronRight';
import Email from '@/components/SvgIcons/Contact/Email';
import Phone from '@/components/SvgIcons/Phone';
import { ReservationDetails } from '@/models/reservation.model';
import { clearDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';

import ContactCard from './ContactCard';
import styles from './ReservationOverview.module.scss';
import ReservationOverviewCard from './ReservationOverviewCard';

interface ReservationOverviewProps {
  title: string;
  description: React.ReactNode;
  descriptionIcon: React.ElementType;
  reservationData: ReservationDetails;
  /**
   * Optional secondary-action link at the bottom of the overview. Pass both
   * `linkTo` and `linkToText` to render the button; omit both to suppress it
   * entirely (e.g. on the payment-success page we hide it for guests so the
   * only next step is the "Create your account" CTA below).
   */
  linkTo?: string;
  linkToText?: string;
  actionText?: string;
  actionColor?: ButtonProps['color'];
  onClick?: () => void;
  isLoading?: boolean;
  showContactCard?: boolean;
  /** Optional content rendered in full-page width between the reservation
   *  card and the "Contact the support" card — used on /payment-success to
   *  surface the "Create your account" prompt as the next step. */
  children?: React.ReactNode;
}

const ReservationOverview = ({
  title,
  description,
  descriptionIcon: Icon,
  reservationData,
  linkTo,
  linkToText,
  actionText,
  actionColor = 'primary',
  onClick,
  showContactCard = false,
  children,
}: ReservationOverviewProps) => {
  const router = useRouter();
  const pahtname = usePathname();
  const {
    reservationNumber,
    yachtMainImage,
    modelName,
    yachtName,
    locationFrom,
    locationFromCountryCode,
    dateFrom,
    dateTo,
  } = reservationData;
  const t = useTranslations('common');
  const tYacht = useTranslations('yacht');

  const isPaymentPending = pahtname.includes('/payment-pending');

  const handleRedirect = () => {
    if (!linkTo) return;

    clearDataFromSessionStorage('reservationId');
    clearDataFromSessionStorage('activeStep');
    clearDataFromSessionStorage('selectedPaymentMethod');
    clearDataFromSessionStorage('selectedInstallment');
    clearDataFromLocalStorage('yachtReservation');

    router.push(linkTo);
  };

  const hasLink = Boolean(linkTo && linkToText);

  return (
    <Container
      component="section"
      maxWidth="lg"
      disableGutters
      className={cx(styles.container, { [styles.paddingBottom]: showContactCard })}
    >
      <Box className={styles.wrapper}>
        <Box className={styles.content}>
          <Box className={styles.reservationCard}>
            <Stack spacing={2} flex={1}>
              {(reservationNumber || isPaymentPending) && (
                <StatusChip
                  label={reservationNumber ? `#${reservationNumber}` : tYacht('preReserved')}
                  color={reservationNumber ? 'success' : 'warning'}
                />
              )}
              <Typography variant="h2" component="h1">
                {title}
              </Typography>
              <Stack direction="row" alignItems="flex-start" gap={1}>
                <Box sx={{ flexShrink: 0 }}>
                  <Icon variant="secondary" size={24} />
                </Box>
                <Typography variant="body1" component="div">
                  {description}
                </Typography>
              </Stack>
              {actionText && (
                <Button size="large" color={actionColor} fullWidth onClick={onClick} sx={{ mt: 'auto' }}>
                  {actionText}
                </Button>
              )}
            </Stack>
            <Divider
              orientation="vertical"
              sx={{ '&.MuiDivider-root': { marginInline: 3, marginBlock: 0 }, display: { xs: 'none', sm: 'block' } }}
            />
            <Divider
              orientation="horizontal"
              sx={{ '&.MuiDivider-root': { marginBlock: 4 }, display: { xs: 'block', sm: 'none' } }}
            />
            <Stack flex={1}>
              <ReservationOverviewCard
                mainImage={yachtMainImage}
                model={modelName}
                name={yachtName}
                locationFrom={locationFrom}
                locationFromCountryCode={locationFromCountryCode}
                dateFrom={dateFrom}
                dateTo={dateTo}
              />
            </Stack>
            {hasLink && (
              <Box className={styles.buttonWrapper} sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Button size="large" onClick={handleRedirect} fullWidth endIcon={<ChevronRight size={24} />}>
                  {linkToText}
                </Button>
              </Box>
            )}
          </Box>
          {children}
          {showContactCard && (
            <Box className={styles.contactCard}>
              <Typography variant="h3" fontWeight={700}>
                {t('contactTheSupport')}
              </Typography>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                spacing={3}
                mt={3}
              >
                <ContactCard
                  icon={Email}
                  title={t('email')}
                  description={t('contactTheSupportDescription')}
                  linkTo="mailto:info@boat4you.com"
                  linkText={t('sendEmail')}
                />
                <ContactCard
                  icon={Phone}
                  title={t('phone')}
                  description={t('callTheSupportDescription')}
                  linkTo="tel:+385913000009"
                  linkText="+385 91 3000 009"
                />
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
      {hasLink && (
        <Box className={styles.buttonWrapper} sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button size="large" onClick={handleRedirect} fullWidth endIcon={<ChevronRight size={24} />}>
            {linkToText}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ReservationOverview;
