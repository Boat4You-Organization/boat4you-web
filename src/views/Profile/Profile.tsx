'use client';

import { useMemo, useState } from 'react';

import EmailIcon from '@mui/icons-material/EmailOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import PaidIcon from '@mui/icons-material/PaidOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import TranslateIcon from '@mui/icons-material/TranslateOutlined';
import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { logout, updatePassword } from '@/actions/auth.actions';
import { updateMyProfile, updateUserPreferences } from '@/actions/user.actions';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import { FormInputProps } from '@/components/Forms/FormInput/FormInput';
import Select from '@/components/Select';
import currencies from '@/config/currencies.config';
import { ProfileFormValues } from '@/config/form-models.config';
import { PROFILE_FORM } from '@/config/form-names.config';
import locales from '@/config/locales.config';
import { usePathname, useRouter } from '@/i18n/navigation';
import { CURRENCY_LABEL_MAP, Currency, LANGUAGE_LABEL_MAP, Language, UserModel, UserStatus } from '@/models/user.model';
import { showToast } from '@/valtio/global/global.actions';

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

    const hasPreferencesChanged = formValues.language !== user.language || formValues.currency !== user.currency;

    const hasProfileChanged =
      formValues.name !== user.name ||
      formValues.surname !== user.surname ||
      formValues.email !== (user.email ?? '') ||
      formValues.phoneNumber !== (user.phoneNumber ?? '') ||
      formValues.address !== (user.address ?? '') ||
      formValues.city !== (user.city ?? '') ||
      formValues.country !== (user.country ?? '');

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
    </Container>
  );
};

export default Profile;
