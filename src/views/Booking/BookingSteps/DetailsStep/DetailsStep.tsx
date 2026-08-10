import { startTransition, useActionState, useEffect, useMemo, useState } from 'react';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { createReservation } from '@/actions/reservation.actions';
import { validateVoucher } from '@/actions/voucher.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import PhoneInput from '@/components/PhoneInput';
import VerifiedBadge from '@/components/SvgIcons/VerifiedBadge';
import { BookingFormValues } from '@/config/form-models.config';
import { trackBeginCheckout } from '@/lib/trackBeginCheckout';
import { PaymentPhase } from '@/models/reservation.model';
import { UserModel } from '@/models/user.model';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import { AppliedVoucher } from '@/types/voucher.type';
import { FormValidator } from '@/utils/static/FormValidator';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { clearDataFromSessionStorage, saveDataToSessionStorage } from '@/utils/static/sessionStorageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { toggleLoginModal } from '@/valtio/auth/auth.actions';
import { showToast } from '@/valtio/global/global.actions';
import { useUserStore } from '@/valtio/user/user.store';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import BoatInquiryModal from '@/views/Boat/BoatContentSection/BoatInquiryModal';
import BookingModal from '@/views/Booking/BookingModal';
import BookingReviewModal from '@/views/Booking/BookingReviewModal';
import TrustBadges from '@/views/Booking/TrustBadges';

import styles from './DetailsStep.module.scss';

interface DetailsStepProps {
  reservationData: ReservationData;
  isAdmin: boolean;
  user: UserModel | null;
  /** Partner-aware payment phases (lifted from Booking — the same data the
   *  sidebar Price-breakdown card uses) so the Booking-review modal shows the
   *  real MMK/NauSys schedule instead of a client-side approximation. */
  paymentPhases?: PaymentPhase[];
  isLoadingPhases?: boolean;
  /** Loyalty voucher — lifted to Booking so the sidebar shows the discount too. */
  appliedVoucher?: AppliedVoucher | null;
  onVoucherChange?: (voucher: AppliedVoucher | null) => void;
}

const defaultValues: BookingFormValues = {
  yachtId: 0,
  offerId: 0,
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  specialRequest: '',
  selectedExtras: [],
};

const DetailsStep = ({
  reservationData,
  isAdmin,
  user,
  paymentPhases = [],
  isLoadingPhases = false,
  appliedVoucher = null,
  onVoucherChange,
}: DetailsStepProps) => {
  const { name, model, locationFrom } = reservationData;
  const [state, createReservationAction, createReservationPending] = useActionState(createReservation, undefined);
  const t = useTranslations('common');
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const validator = FormValidator.withTranslation(t);
  const { boatInquiryModalOpen } = useYachtStore();
  const [bookingReviewOpen, setBookingReviewOpen] = useState(false);
  // Loyalty voucher input — local UI state; the applied voucher itself lives
  // in Booking (lifted) + sessionStorage so the sidebar and /payment see it.
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherChecking, setVoucherChecking] = useState(false);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  // `user` prop comes from the SSR `getLoggedInUser()` snapshot at page-load.
  // After the "Sign in to pre-fill" link opens LoginModal and the user logs in,
  // the new profile lands in `useUserStore` (Valtio) immediately — so we prefer
  // the store value over the prop so the form re-prefills without a reload.
  const { user: storeUser } = useUserStore();
  const effectiveUser = storeUser ?? user;

  // Minimal yacht shape for BoatInquiryModal — we only have ReservationData in
  // the booking flow, but the modal only reads a handful of yacht fields
  // (id, yachtImages, model, name, location). Cast is safe in practice.
  const yachtForInquiry = useMemo(
    () =>
      ({
        id: reservationData.yachtId,
        yachtImages: reservationData.yachtImages ?? [],
        model,
        name,
        location: {
          name: locationFrom?.name ?? '',
          countryCode: locationFrom?.countryCode ?? '',
        },
      }) as unknown as YachtModel,
    [reservationData, model, name, locationFrom]
  );

  const selectedExtrasKeys = reservationData
    ? [
        ...reservationData.selectedExtrasInPrice.map(item => item.key),
        ...reservationData.selectedExtrasAtBase.map(item => item.key),
      ]
    : [];

  useEffect(() => {
    if (state?.payload && !state?.message) {
      saveDataToSessionStorage('reservationId', state.payload.id);

      // Customer-facing booking number (e.g. "100176/2026") — shown in bank
      // transfer payment reference, emails, and Stripe checkout instead of the
      // internal numeric id.
      if (state.payload.reservationNumber) {
        saveDataToSessionStorage('reservationNumber', state.payload.reservationNumber);
      }

      // Persist the backend-computed payment phases so /payment can render the
      // real schedule (matches what Stripe / bank transfer will charge) instead
      // of falling back to a client-side approximation.
      if (state.payload.paymentPhases?.length) {
        saveDataToSessionStorage('paymentPhases', state.payload.paymentPhases);
      }

      // Real option-expiry timestamp from the partner API (MMK
      // `expirationDate` / NauSys `optionTill`). Drives the bank-transfer
      // deadline banner so the customer sees the actual window — anywhere from
      // ~24 h (last-minute charters) up to several days (charters months out).
      // We deliberately do NOT fall back to a fixed 48 h: showing a longer
      // window than the partner granted risks the customer paying after the
      // option already lapsed and the yacht was rebooked.
      if (state.payload.expiresAt) {
        saveDataToSessionStorage('reservationExpiresAt', state.payload.expiresAt);
      }

      // Admins skip the public payment screen — their action in the admin
      // panel represents an already-settled or manually-handled booking.
      // Everyone else (guest or logged-in customer) continues to the
      // unified payment step on /payment/[slug].
      if (isAdmin) {
        router.push('/payment-pending');
      } else {
        // Conversion: a real customer filled in their details and a reservation
        // was created — fire BEFORE navigating away so gtag runs on this page.
        // Consent Mode gates it; transaction_id de-dupes. Admin bookings above
        // are intentionally excluded.
        trackBeginCheckout({ ref: state.payload.id, value: reservationData.totalPriceEur, currency: 'EUR' });
        router.push(`/payment/${params?.slug ?? ''}`);
        showToast({
          status: 'success',
          text: t('reservationCreated'),
        });
      }
    }

    if (state?.message) {
      let errorMessage = state.message;

      if (state.message.includes('phoneNumber') && state.message.includes('must match')) {
        errorMessage = t('validation.phoneNumberInvalidLength');
      }

      // Voucher raced out between apply and submit (expired / someone else
      // redeemed it) — drop it so the retry books without the discount.
      if (state.message.toLowerCase().includes('vouchercode') || state.message.toLowerCase().includes('voucher code')) {
        errorMessage = t('voucherInvalid');
        clearDataFromSessionStorage('appliedVoucher');
        onVoucherChange?.(null);
      }

      showToast({
        status: 'error',
        text: errorMessage || t('reservationCreationFailed'),
      });
    }
  }, [createReservationPending, t, state, isAdmin, router]);

  const initialValues: BookingFormValues = reservationData
    ? {
        yachtId: reservationData.yachtId,
        offerId: reservationData.offerId,
        // Pre-fill from effective user (store takes precedence after mid-flow
        // login); empty for guests. `resetDefaultValues` on <Form/> makes the
        // form re-hydrate whenever `effectiveUser` changes.
        name: effectiveUser?.name ?? '',
        surname: effectiveUser?.surname ?? '',
        email: effectiveUser?.email ?? '',
        phoneNumber: effectiveUser?.phoneNumber ?? '',
        specialRequest: '',
        selectedExtras: selectedExtrasKeys,
      }
    : defaultValues;

  const applyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();

    if (!code) return;

    setVoucherChecking(true);
    setVoucherError(null);

    const result = await validateVoucher(code, reservationData.totalPriceEur);

    if (result.valid && result.value) {
      const voucher = { code, value: result.value };

      saveDataToSessionStorage('appliedVoucher', voucher);
      onVoucherChange?.(voucher);
      setVoucherOpen(false);
      setVoucherInput('');
    } else if (result.reason === 'MIN_TOTAL_NOT_MET') {
      setVoucherError(t('voucherMinTotal', { amount: formatPriceWithCurrency({ clientPriceEur: 1500 }) }));
    } else {
      setVoucherError(t('voucherInvalid'));
    }

    setVoucherChecking(false);
  };

  const removeVoucher = () => {
    clearDataFromSessionStorage('appliedVoucher');
    onVoucherChange?.(null);
    setVoucherError(null);
  };

  const handleSubmit = async (data: BookingFormValues) => {
    const invalidData =
      data.name === '' ||
      data.surname === '' ||
      data.email === '' ||
      data.phoneNumber === '' ||
      !data.email.includes('@');

    if (invalidData) {
      showToast({
        status: 'error',
        text: t('pleaseFillAllFields'),
      });

      return;
    }

    // Persist the contact block so /payment can render a read-only "Your
    // details" card without needing to refetch the reservation (which guests
    // can't do — no auth token).
    saveDataToSessionStorage('bookingContact', {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      specialRequest: data.specialRequest ?? '',
    });

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'selectedExtras') {
        const extrasArray = Array.isArray(value) ? value : [];

        formData.append(key, JSON.stringify(extrasArray));
      } else {
        formData.append(key, String(value));
      }
    });

    if (appliedVoucher) {
      formData.append('voucherCode', appliedVoucher.code);
    }

    startTransition(() => {
      createReservationAction(formData);
    });
  };

  const getButtonText = () => {
    if (createReservationPending) {
      return t('processing');
    }

    if (isAdmin) {
      return t('bookNow');
    }

    return t('nextLastDetails');
  };

  return (
    <>
      <BookingModal isOpen={createReservationPending} />
      <BoatInquiryModal
        isOpen={boatInquiryModalOpen}
        onOpen={toggleBoatInquiryModalOpen}
        onClose={toggleBoatInquiryModalOpen}
        yacht={yachtForInquiry}
      />
      <BookingReviewModal
        open={bookingReviewOpen}
        onClose={() => setBookingReviewOpen(false)}
        yachtName={name}
        yachtModel={model}
        dateFrom={reservationData.dateFrom}
        totalPriceEur={reservationData.totalPriceEur}
        totalPriceInfo={reservationData.totalPriceInfo}
        paymentPhases={paymentPhases}
        isLoadingPhases={isLoadingPhases}
        appliedVoucher={appliedVoucher}
      />
      <Box className={styles.container}>
        {/* "This is a rare find" scarcity card — kept for conversion psychology,
            but the "Your Trip" (dates + pick-up location) block was removed
            because the BookingHero banner and the sidebar BookingSummaryCard
            already surface that information. */}
        <Box className={styles.card}>
          <Stack gap={0.5}>
            <Typography variant="h3" component="p" fontWeight={700} color={colors.blue500}>
              {t('thisIsARareFind')}
            </Typography>
            <Typography variant="body1" color={colors.black500}>
              {toTitleCase(name)} {model} - {t('usuallyBooked')}.
            </Typography>
          </Stack>
          <VerifiedBadge size={52} variant="secondary" />
        </Box>
        <Box sx={{ mt: 4 }} />
        <Form defaultValues={initialValues} onSubmit={handleSubmit} resetDefaultValues>
          <Stack gap={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Typography variant="h2">{t('yourDetails')}</Typography>
              {!effectiveUser && (
                <Typography variant="body2" color={colors.black600}>
                  {t('haveAccount')}{' '}
                  <Box
                    component="button"
                    type="button"
                    onClick={toggleLoginModal}
                    sx={{
                      background: 'none',
                      border: 0,
                      p: 0,
                      color: colors.blue500,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      font: 'inherit',
                    }}
                  >
                    {t('signInToPreFill')}
                  </Box>
                </Typography>
              )}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={{ xs: 3, sm: 2 }}>
              <FormInput
                name="name"
                formLabel={t('firstName')}
                placeholder={t('inputYourFirstName')}
                validate={validator.isNotEmpty}
              />
              <FormInput
                name="surname"
                formLabel={t('lastName')}
                placeholder={t('inputYourLastName')}
                validate={validator.isNotEmpty}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={{ xs: 3, sm: 2 }}>
              <FormInput
                name="email"
                type="email"
                formLabel={t('emailAddress')}
                placeholder={t('inputYourEmailAddress')}
                validate={FormValidator.all(validator.isNotEmpty, validator.isValidEmail)}
                helperText={t('emailConfirmationNotice')}
              />
              <PhoneInput
                name="phoneNumber"
                formLabel={t('phoneNumber')}
                placeholder={t('inputPhoneNumber')}
                validate={FormValidator.all(validator.isNotEmpty, validator.isValidPhoneNumber)}
              />
            </Stack>
            <FormInput
              name="specialRequest"
              formLabel={t('specialRequest')}
              placeholder={t('inputSpecialRequest')}
              multiline
            />
            {/* Loyalty voucher — collapsed link → code input → green applied chip.
                Applied BEFORE the reservation exists so the backend can absorb
                the discount into the first installment (Stripe + wire emails). */}
            <Box>
              {!appliedVoucher && !voucherOpen && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setVoucherOpen(true)}
                  sx={{
                    background: 'none',
                    border: 0,
                    p: 0,
                    color: colors.blue500,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    font: 'inherit',
                    fontSize: '0.875rem',
                  }}
                >
                  {t('voucherHaveOne')}
                </Box>
              )}
              {!appliedVoucher && voucherOpen && (
                <Stack gap={1}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5}>
                    <TextField
                      value={voucherInput}
                      onChange={event => {
                        setVoucherInput(event.target.value.toUpperCase());
                        setVoucherError(null);
                      }}
                      placeholder={t('voucherCodePlaceholder')}
                      size="small"
                      error={!!voucherError}
                      helperText={voucherError}
                      inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 20 }}
                      sx={{ minWidth: { sm: 260 } }}
                    />
                    <Button
                      type="button"
                      size="medium"
                      onClick={applyVoucher}
                      disabled={voucherChecking || !voucherInput.trim()}
                      sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {voucherChecking ? t('processing') : t('voucherApply')}
                    </Button>
                  </Stack>
                </Stack>
              )}
              {appliedVoucher && (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.25,
                    width: 'fit-content',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 700 }}>
                    ✓ {t('voucherApplied')} · {appliedVoucher.code} · −
                    {formatPriceWithCurrency({ clientPriceEur: appliedVoucher.value })}
                  </Typography>
                  <Box
                    component="button"
                    type="button"
                    onClick={removeVoucher}
                    sx={{
                      background: 'none',
                      border: 0,
                      p: 0,
                      color: colors.black600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      font: 'inherit',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {t('voucherRemove')}
                  </Box>
                </Stack>
              )}
            </Box>
            <Stack gap={2}>
              <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" gap={2}>
                <Button
                  size="large"
                  color="secondary"
                  onClick={toggleBoatInquiryModalOpen}
                  disabled={createReservationPending}
                  sx={{ width: { xs: '100%', sm: 210 } }}
                  type="button"
                >
                  {t('requestAQuote')}
                </Button>
                <Button
                  size="large"
                  disabled={createReservationPending}
                  sx={{ width: { xs: '100%', sm: 210 } }}
                  type="submit"
                >
                  {getButtonText()}
                </Button>
              </Stack>
              <Typography variant="body2" color={colors.black600} textAlign="end">
                {t('youWonTBeChargedYet')}
              </Typography>
              <Box textAlign="end">
                <Box
                  component="button"
                  type="button"
                  onClick={() => setBookingReviewOpen(true)}
                  sx={{
                    background: 'none',
                    border: 0,
                    p: 0,
                    color: colors.blue500,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    font: 'inherit',
                    fontSize: '0.875rem',
                  }}
                >
                  {t('whatAreMyBookingConditions')}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Form>
        <TrustBadges />
      </Box>
    </>
  );
};

export default DetailsStep;
