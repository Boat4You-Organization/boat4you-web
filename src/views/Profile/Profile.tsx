'use client';

import { useMemo, useState } from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { logout, updatePassword } from '@/actions/auth.actions';
import { updateUser, updateUserPreferences } from '@/actions/user.actions';
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

  const handleSubmit = async (formValues: ProfileFormValues) => {
    setIsSubmitting(true);

    const hasPreferencesChanged = formValues.language !== user.language || formValues.currency !== user.currency;

    const hasNameSurnameChanged = formValues.name !== user.name || formValues.surname !== user.surname;

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

      if (hasNameSurnameChanged) {
        const { payload, message: nameSurnameMsg } = await updateUser({
          id: user.id,
          updateData: formValues,
          path: pathname,
        });

        success = !!payload;
        message = nameSurnameMsg || '';
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
      <Typography variant="h1" fontWeight={700} sx={{ mb: 4 }}>
        {t('accountSettings')}
      </Typography>
      <Form defaultValues={initialValues} onSubmit={handleSubmit} id={PROFILE_FORM}>
        <EditableField
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
          label={t('password')}
          value="********"
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
        <EditableField
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
          label={t('currency')}
          value={CURRENCY_LABEL_MAP[user.currency ?? Currency.EUR]}
          description={t('currencyDescription')}
          sx={{ borderBottom: 'none' }}
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
      </Form>
    </Container>
  );
};

export default Profile;
