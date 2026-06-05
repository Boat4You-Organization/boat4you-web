'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useMemo, useState } from 'react';

import CakeIcon from '@mui/icons-material/CakeOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import PaidIcon from '@mui/icons-material/PaidOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import TranslateIcon from '@mui/icons-material/TranslateOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { deleteMyAccount, downloadMyData, logout, requestEmailChange, updatePassword } from '@/actions/auth.actions';
import { updateMyProfile, updateUserPreferences } from '@/actions/user.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { FormInputProps } from '@/components/Forms/FormInput/FormInput';
import SecuritySection from '@/components/Profile/SecuritySection';
import Select from '@/components/Select';
import currencies from '@/config/currencies.config';
import { ProfileFormValues } from '@/config/form-models.config';
import { PROFILE_FORM } from '@/config/form-names.config';
import locales from '@/config/locales.config';
import { usePathname, useRouter } from '@/i18n/navigation';
import { CURRENCY_LABEL_MAP, Currency, LANGUAGE_LABEL_MAP, Language, UserModel, UserStatus } from '@/models/user.model';
import { showToast } from '@/valtio/global/global.actions';

import AccountInfoSection from './AccountInfoSection';
import EditableField from './EditableField';
import styles from './Profile.module.scss';

const defaultValues: ProfileFormValues = {
  id: 0,
  name: '',
  surname: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  country: '',
  birthday: '',
  password: '',
  language: Language.ENGLISH,
  currency: Currency.EUR,
  userStatus: UserStatus.ACTIVE,
  roles: [],
  newPassword: '',
  repeatNewPassword: '',
};

interface ProfileProps {
  user: UserModel;
}

const Profile = ({ user }: ProfileProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('common');
  // next-intl's strict key union doesn't surface freshly-added common keys at
  // compile time (TS widens the large literal); they exist in every locale.
  const tt = t as unknown as (k: string) => string;
  const tToastMessage = useTranslations('toastMessages');

  const initialValues: ProfileFormValues = useMemo(
    () =>
      user
        ? {
            id: user.id,
            name: user.name ?? '',
            surname: user.surname ?? '',
            email: user.email ?? '',
            phoneNumber: user.phoneNumber ?? '',
            address: user.address ?? '',
            city: user.city ?? '',
            country: user.country ?? '',
            birthday: user.birthday ?? '',
            password: '',
            language: user.language ?? Language.ENGLISH,
            currency: user.currency ?? Currency.EUR,
            userStatus: user.userStatus,
            roles: user.roles ?? [],
            newPassword: '',
            repeatNewPassword: '',
          }
        : defaultValues,
    [user]
  );

  const initials = useMemo(() => {
    const first = (user.name ?? '').trim()[0] ?? '';
    const last = (user.surname ?? '').trim()[0] ?? '';

    return `${first}${last}`.toUpperCase() || '?';
  }, [user]);

  const handleSubmit = async (formValues: ProfileFormValues) => {
    setIsSubmitting(true);

    // Email is the login identity — when the email section is edited it goes through the verified
    // flow, never a direct profile save. We fire on the section being edited (not on a value diff)
    // so re-submitting the SAME address reports an error instead of silently doing nothing.
    // Changing to a new address emails a confirmation link there; the email only changes once that
    // link is opened. The field resets to the current address via router.refresh().
    if (editingField === 'Email') {
      const newEmail = formValues.email.trim();

      if (newEmail.toLowerCase() === (user.email ?? '').toLowerCase()) {
        showToast({
          status: 'error',
          text: 'This is already your email address — enter a different one to change it.',
        });
        setIsSubmitting(false);

        return;
      }

      const { success: linkSent, message: linkMsg } = await requestEmailChange(newEmail);

      if (linkSent) {
        // next-intl's strict key union doesn't surface this freshly-added bundle key at compile
        // time (it widens the large message type); the key exists in all locales.
        showToast({
          status: 'success',
          text: (tToastMessage as unknown as (k: string) => string)('emailChangeLinkSent'),
        });
        setEditingField(null);
        router.refresh();
      } else {
        showToast({ status: 'error', text: linkMsg || tToastMessage('userUpdateFailed') });
      }

      setIsSubmitting(false);

      return;
    }

    const hasPreferencesChanged = formValues.language !== user.language || formValues.currency !== user.currency;

    const hasProfileChanged =
      formValues.name !== user.name ||
      formValues.surname !== user.surname ||
      formValues.email !== (user.email ?? '') ||
      formValues.phoneNumber !== (user.phoneNumber ?? '') ||
      formValues.address !== (user.address ?? '') ||
      formValues.city !== (user.city ?? '') ||
      formValues.country !== (user.country ?? '') ||
      formValues.birthday !== (user.birthday ?? '');

    const hasPasswordChanged = formValues.password && formValues.password.trim() !== '';

    try {
      let success = false;
      let message = '';

      if (hasPreferencesChanged) {
        const { payload, message: prefMsg } = await updateUserPreferences({
          id: user.id,
          language: formValues.language,
          currency: formValues.currency,
          path: pathname,
        });

        success = !!payload;
        message = prefMsg || '';

        if (formValues.language !== user.language && success) {
          const newLocale = formValues.language.toLowerCase();

          router.replace(pathname, { locale: newLocale });

          return;
        }
      }

      if (hasProfileChanged) {
        const { payload, message: profileMsg } = await updateMyProfile({
          id: user.id,
          name: formValues.name,
          surname: formValues.surname,
          email: formValues.email,
          phoneNumber: formValues.phoneNumber || undefined,
          address: formValues.address || undefined,
          city: formValues.city || undefined,
          country: formValues.country || undefined,
          birthday: formValues.birthday || null,
          path: pathname,
        });

        success = !!payload;
        message = profileMsg || '';
      }

      if (hasPasswordChanged) {
        if (formValues.newPassword !== formValues.repeatNewPassword) {
          showToast({
            status: 'error',
            text: t('passwordNotMatch'),
          });

          return;
        }

        const { payload, message: passwordMsg } = await updatePassword({
          oldPassword: formValues.password,
          newPassword: formValues.newPassword || '',
        });

        success = !!payload;
        message = passwordMsg || '';

        if (success) {
          await logout();

          window.location.href = '/';

          return;
        }
      }

      showToast({
        status: success ? 'success' : 'error',
        text: success ? tToastMessage('userUpdated') : message || tToastMessage('userUpdateFailed'),
      });

      if (success) {
        setEditingField(null);
        // Force a re-render against the latest server state — without this,
        // the EditableField "value" prop keeps showing the stale `user` snapshot
        // captured at page load and the customer thinks the save didn't take.
        // (Mario bug report 1.5.2026: birthday saved but UI still showed "Not set".)
        router.refresh();
      }
    } catch (error) {
      // Skip
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEdit = (fieldName: string) => {
    setEditingField(current => (current === fieldName ? null : fieldName));
  };

  const renderLanguagePicker: FormInputProps['renderInput'] = ({ field }) => (
    <Select value={field.value} onChange={field.onChange} options={locales} label={t('language')} />
  );

  const renderCurrencyPicker: FormInputProps['renderInput'] = ({ field }) => (
    <Select value={field.value} onChange={field.onChange} options={currencies} label={t('currency')} />
  );

  return (
    <Container component="section" maxWidth="md" className={styles.container}>
      <Typography variant="h1" fontWeight={700} sx={{ mb: 3 }}>
        {t('accountSettings')}
      </Typography>

      <Box className={styles.hero}>
        <Avatar className={styles.avatar}>{initials}</Avatar>
        <Stack className={styles.heroInfo}>
          <Typography variant="h3" fontWeight={700}>
            {user.name} {user.surname}
          </Typography>
          <Typography variant="body1" className={styles.heroEmail}>
            {user.email}
          </Typography>
        </Stack>
      </Box>

      <AccountInfoSection user={user} />

      <SecuritySection />

      <Form defaultValues={initialValues} onSubmit={handleSubmit} id={PROFILE_FORM}>
        <Box className={styles.sectionHeader}>
          <PersonIcon fontSize="small" />
          <Typography className={styles.sectionTitle}>{t('personalInformation')}</Typography>
        </Box>
        <Paper className={styles.card} elevation={0}>
          <EditableField
            icon={<PersonIcon fontSize="small" />}
            label={t('fullName')}
            value={`${user.name} ${user.surname}`}
            description={t('matchesNameWithID')}
            isEditing={editingField === 'Full Name'}
            onToggleEdit={() => handleToggleEdit('Full Name')}
            isAnotherEditing={editingField !== null && editingField !== 'Full Name'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="name" formLabel={t('name')} placeholder={t('name')} />
              <FormInput name="surname" formLabel={t('lastName')} placeholder={t('lastName')} />
            </Stack>
          </EditableField>
          <EditableField
            icon={<EmailIcon fontSize="small" />}
            label={t('email')}
            value={user.email ?? ''}
            description={t('emailDescription')}
            isEditing={editingField === 'Email'}
            onToggleEdit={() => handleToggleEdit('Email')}
            isAnotherEditing={editingField !== null && editingField !== 'Email'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="email" formLabel={t('email')} placeholder={t('email')} type="email" />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
          </EditableField>
          <EditableField
            icon={<PhoneIcon fontSize="small" />}
            label={t('phoneNumber')}
            value={user.phoneNumber ?? ''}
            description={t('phoneNumberDescription')}
            isEditing={editingField === 'Phone'}
            onToggleEdit={() => handleToggleEdit('Phone')}
            isAnotherEditing={editingField !== null && editingField !== 'Phone'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="phoneNumber" formLabel={t('phoneNumber')} placeholder={t('phoneNumber')} type="tel" />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
          </EditableField>
          <EditableField
            icon={<HomeIcon fontSize="small" />}
            label={t('address')}
            value={[user.address, user.city, user.country].filter(Boolean).join(', ')}
            description={t('addressDescription')}
            isEditing={editingField === 'Address'}
            onToggleEdit={() => handleToggleEdit('Address')}
            isAnotherEditing={editingField !== null && editingField !== 'Address'}
            isSubmitting={isSubmitting}
          >
            <Stack direction="column" gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="address" formLabel={t('address')} placeholder={t('addressPlaceholder')} />
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
                <FormInput name="city" formLabel={t('city')} placeholder={t('city')} />
                <FormInput name="country" formLabel={t('country')} placeholder={t('country')} />
              </Stack>
            </Stack>
          </EditableField>
          {/* Birthday — same EditableField pattern as the rest. We keep the
              CakeIcon as a soft visual hint that this is a personal/optional
              field, and the description text doubles as the consent line for
              the annual greeting cron. Empty value renders as a friendly
              "Not set" rather than blank, which would look broken. */}
          <EditableField
            icon={<CakeIcon fontSize="small" />}
            label={tt('birthday')}
            value={
              user.birthday
                ? new Date(user.birthday).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Not set'
            }
            description={tt('birthdayDescription')}
            isEditing={editingField === 'Birthday'}
            onToggleEdit={() => handleToggleEdit('Birthday')}
            isAnotherEditing={editingField !== null && editingField !== 'Birthday'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="birthday" formLabel={tt('birthday')} placeholder="YYYY-MM-DD" type="date" />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
          </EditableField>
        </Paper>

        <Box className={styles.sectionHeader}>
          <ShieldIcon fontSize="small" />
          <Typography className={styles.sectionTitle}>{t('security')}</Typography>
        </Box>
        <Paper className={styles.card} elevation={0}>
          <EditableField
            icon={<LockIcon fontSize="small" />}
            label={t('password')}
            value="••••••••"
            description={t('passwordDescription')}
            isEditing={editingField === 'Password'}
            onToggleEdit={() => handleToggleEdit('Password')}
            isAnotherEditing={editingField !== null && editingField !== 'Password'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput
                name="password"
                formLabel={t('currentPassword')}
                placeholder={t('inputPassword')}
                type="password"
              />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput
                name="newPassword"
                formLabel={t('newPassword')}
                placeholder={t('inputNewPassword')}
                type="password"
              />
              <FormInput
                name="repeatNewPassword"
                formLabel={t('repeatPassword')}
                placeholder={t('repeatNewPassword')}
                type="password"
              />
            </Stack>
          </EditableField>
        </Paper>

        <Box className={styles.sectionHeader}>
          <SettingsIcon fontSize="small" />
          <Typography className={styles.sectionTitle}>{t('preferences')}</Typography>
        </Box>
        <Paper className={styles.card} elevation={0}>
          <EditableField
            icon={<TranslateIcon fontSize="small" />}
            label={t('language')}
            value={LANGUAGE_LABEL_MAP[user.language ?? Language.ENGLISH]}
            description={t('languageDescription')}
            isEditing={editingField === 'Language'}
            onToggleEdit={() => handleToggleEdit('Language')}
            isAnotherEditing={editingField !== null && editingField !== 'Language'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="language" renderInput={renderLanguagePicker} />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
          </EditableField>
          <EditableField
            icon={<PaidIcon fontSize="small" />}
            label={t('currency')}
            value={CURRENCY_LABEL_MAP[user.currency ?? Currency.EUR]}
            description={t('currencyDescription')}
            isEditing={editingField === 'Currency'}
            onToggleEdit={() => handleToggleEdit('Currency')}
            isAnotherEditing={editingField !== null && editingField !== 'Currency'}
            isSubmitting={isSubmitting}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={{ xs: 2.5, sm: 3 }}>
              <FormInput name="currency" renderInput={renderCurrencyPicker} />
              <Stack width={1} display={{ xs: 'none', sm: 'flex' }} />
            </Stack>
          </EditableField>
        </Paper>
      </Form>

      {/* GDPR Article 17 — right to erasure. Customer-initiated account
          delete. Wrapped in a confirm modal that requires the literal word
          "DELETE" plus an explicit "I understand" checkbox so a stray click
          can't tank a real account. Backend anonymizes PII but keeps
          reservation history (Mario decision 1.5.2026: "ako je klijent
          rezervirao s nama plovilo, to se ne smije brisat"). */}
      <DangerZone />
    </Container>
  );
};

const DangerZone = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canDelete = confirmText.trim().toUpperCase() === 'DELETE' && acknowledged && !isDeleting;

  const handleClose = () => {
    if (isDeleting) return;

    setOpen(false);
    setConfirmText('');
    setAcknowledged(false);
    setErrorMsg(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    const result = await deleteMyAccount();

    if (!result.success) {
      setErrorMsg(result.message ?? 'Failed to delete account');
      setIsDeleting(false);

      return;
    }

    showToast({ status: 'success', text: 'Your account has been deleted.' });
    router.push('/');
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    const result = await downloadMyData();

    setIsDownloading(false);

    if (!result.success) {
      showToast({ status: 'error', text: result.message ?? 'Download failed' });

      return;
    }

    try {
      const { filename, body } = JSON.parse(result.message ?? '{}') as { filename: string; body: string };
      const blob = new Blob([body], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast({ status: 'success', text: 'Your data export has started downloading.' });
    } catch {
      showToast({ status: 'error', text: 'Could not parse export response.' });
    }
  };

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
      {/* GDPR Article 20 — right to data portability. Lets the customer
          download a JSON of everything we hold about them (profile,
          reservations, payments, GDPR activity log). Compact button, full
          explainer in the tooltip on hover. */}
      <Tooltip
        title={
          <Box sx={{ p: 0.5, maxWidth: 320 }}>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
              Download my data
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.5 }}>
              Exports everything we hold about you (profile, reservations, payment phases, custom offers, GDPR activity
              log) as a single JSON file. Useful if you want a copy for your records or to take elsewhere. No data is
              deleted by this action.
            </Typography>
          </Box>
        }
        placement="top-end"
        arrow
      >
        <span>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Preparing…' : 'Download my data'}
          </Button>
        </span>
      </Tooltip>

      {/* Compact CTA — explanatory text lives in the tooltip on hover so the
          page isn't dominated by a big red panel. The full warning still
          appears in the confirm modal before any destructive action runs. */}
      <Tooltip
        title={
          <Box sx={{ p: 0.5, maxWidth: 320 }}>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
              Delete my account
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.5 }}>
              Permanently anonymizes your personal data (name, email, phone, address) and signs you out. Past bookings
              remain in our records for accounting and partner-agency obligations, but are no longer linked to your
              identity. This cannot be undone.
            </Typography>
          </Box>
        }
        placement="top-end"
        arrow
      >
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteForeverIcon />}
          onClick={() => setOpen(true)}
        >
          Delete account
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#c62828', fontWeight: 700 }}>Delete account permanently?</DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ mt: 1 }}>
            <Typography variant="body2">
              This will anonymize your personal data immediately. Past bookings stay in our records (we are required to
              keep them for accounting and partner-agency reconciliation), but they will no longer carry your name,
              email, phone, or address.
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              You will be signed out and cannot log back in with this email.
            </Typography>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label='Type "DELETE" to confirm'
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              fullWidth
              autoFocus
              disabled={isDeleting}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={acknowledged}
                  onChange={e => setAcknowledged(e.target.checked)}
                  disabled={isDeleting}
                />
              }
              label="I understand this action cannot be undone."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!canDelete}>
            {isDeleting ? 'Deleting…' : 'Delete my account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
