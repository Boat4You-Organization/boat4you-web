'use client';

import { useEffect, useState } from 'react';

import { AppBar, Box, Button, Container, Stack } from '@mui/material';
import cx from 'clsx';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Form from '@/components/Forms/Form';
import Favorites from '@/components/Header/Favorites';
import LanguageCurrency from '@/components/Header/LanguageCurrency';
import ProfileDropdown from '@/components/ProfileDropdown';
import Logo from '@/components/SvgIcons/Logo';
import Search from '@/components/SvgIcons/Search';
import { SearchBarFormValues } from '@/config/form-models.config';
import { Currency, UserModel } from '@/models/user.model';
import { useAuthModal } from '@/utils/context/AuthModalContext';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';

import styles from './HeaderSearch.module.scss';
import HeaderSearchForm from './HeaderSearchForm';

const defaultValues: SearchBarFormValues = {
  destinations: [],
  startDate: null,
  endDate: null,
  boatTypes: [],
  did: [],
};

interface HeaderSearchProps {
  user: UserModel | null;
}

const HeaderSearch = ({ user }: HeaderSearchProps) => {
  const t = useTranslations('common');
  const tHome = useTranslations('home');
  const { params, createQueryParams } = useQueryParams();
  const navigation = useRouter();
  const { toggleLoginModal } = useAuthModal();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const initialValues = params
    ? {
        destinations: params.destinations,
        startDate: params.startDate ? dayjs(params.startDate) : null,
        endDate: params.endDate ? dayjs(params.endDate) : null,
        boatTypes: params.boatTypes,
        did: params.did,
      }
    : defaultValues;

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleSubmit = (formValues: SearchBarFormValues) => {
    const updates: Partial<{
      destinations: string[];
      startDate: string;
      endDate: string;
      boatTypes: string[];
      did: string[];
      currency: string;
    }> = {};

    if (formValues.destinations && formValues.destinations.length > 0) {
      updates.destinations = formValues.destinations;
    }

    if (formValues.did && formValues.did.length > 0) {
      updates.did = formValues.did;
    }

    if (formValues.boatTypes && formValues.boatTypes.length > 0) {
      updates.boatTypes = formValues.boatTypes;
    }

    if (formValues.startDate) {
      updates.startDate = DateTime.formatFull(formValues.startDate);
    }

    if (formValues.endDate) {
      updates.endDate = DateTime.formatFull(formValues.endDate);
    }

    if (params.currency && params.currency !== Currency.EUR) {
      updates.currency = params.currency;
    }

    const queryParams = createQueryParams(updates);

    navigation.replace(`/search${queryParams ? `?${queryParams}` : ''}`);
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isExpanded]);

  return (
    <>
      {isExpanded && <Box onClick={handleClose} className={styles.overlay} />}
      <AppBar elevation={0} classes={{ root: styles.root }} className={styles.container}>
        <Container disableGutters maxWidth="xl" className={cx(styles.header, { [styles.expanded]: isExpanded })}>
          <Link href="/" className={styles.logo} aria-label={t('home')}>
            <Logo />
          </Link>

          <>
            <Box className={styles.searchSection}>
              <Box
                className={cx(styles.searchBoxWrapper, {
                  [styles.expanded]: isExpanded,
                })}
              >
                <Box
                  onClick={handleSearchClick}
                  className={cx(styles.searchBox, {
                    [styles.expanded]: isExpanded,
                  })}
                >
                  <Form
                    defaultValues={initialValues}
                    onSubmit={handleSubmit}
                    className={cx(styles.form, { [styles.expanded]: isExpanded })}
                    resetDefaultValues
                  >
                    {({ watch }) => {
                      const destinations = watch('destinations');

                      return (
                        <>
                          <Stack direction="row" flex={1}>
                            <HeaderSearchForm
                              isExpanded={isExpanded}
                              translations={{
                                whereAreYouGoing: tHome('generalSearchBar.whereAreYouGoing'),
                                where: tHome('generalSearchBar.where'),
                                searchLocations: tHome('generalSearchBar.searchLocations'),
                              }}
                            />
                          </Stack>
                          <Box className={styles.buttonWrapper}>
                            <Button
                              type="submit"
                              size="small"
                              aria-label={t('search')}
                              className={cx(styles.button, { [styles.expanded]: isExpanded })}
                              disabled={destinations.length <= 0}
                            >
                              <Search size={20} />
                            </Button>
                          </Box>
                        </>
                      );
                    }}
                  </Form>
                </Box>
              </Box>
            </Box>

            <Box className={styles.actions}>
              <Stack direction="row" gap={1} display={{ xs: 'none', lg: 'flex' }}>
                <Favorites />
                <LanguageCurrency language={user?.language} currency={user?.currency} id={user?.id} />
              </Stack>
              {user ? (
                <ProfileDropdown user={user} />
              ) : (
                <Button color="secondary" onClick={toggleLoginModal}>
                  {t('signIn')}
                </Button>
              )}
            </Box>
          </>
        </Container>
      </AppBar>
    </>
  );
};

export default HeaderSearch;
