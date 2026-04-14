'use client';

import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import ButtonWithChips from '@/components/ButtonWithChips';
import DatePickerDropdown from '@/components/DatePickerDropdown';
import ModalRoot from '@/components/ModalRoot';
import Boat from '@/components/SvgIcons/Boat';
import Location from '@/components/SvgIcons/Location';
import Search from '@/components/SvgIcons/Search';
import { SearchBarFormValues } from '@/config/form-models.config';
import { GENERAL_SEARCH_FORM } from '@/config/form-names.config';
import { VESSEL_TYPE_LABEL_MAP, VesselType } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { DateDisableReason } from '@/types/dateDisabledReason.type';
import useToggleState from '@/utils/hooks/useToggleState';

import BoatTypeContent from './BoatTypeContent';
import DestinationContent from './DestinationContent';

const GeneralSearchBarMobile = () => {
  const { watch, setValue } = useFormContext<SearchBarFormValues>();
  const [isModalOpen, toggleModal] = useToggleState();
  const [modalVariant, setModalVariant] = useState<'destination' | 'boatType' | null>(null);

  const t = useTranslations('home');
  const tGeneral = useTranslations();

  const destinations = watch('did');
  const destinationsName = watch('destinations');
  const boatTypes = watch('boatTypes') || [];
  const startDate = watch('startDate');

  const handleDestinationOpen = () => {
    toggleModal();
    setModalVariant('destination');
  };

  const handleBoatTypeOpen = () => {
    toggleModal();
    setModalVariant('boatType');
  };

  const handleModalClose = () => {
    toggleModal();
    setModalVariant(null);
  };

  const handleDestinationClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValue('did', []);
    setValue('destinations', []);
  };

  const handleBoatTypeClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValue('boatTypes', []);
  };

  const handleDeleteSingleBoatType = (optionLabel: string) => {
    const vesselTypeId = Object.values(VesselType).find(
      vesselType => tGeneral(VESSEL_TYPE_LABEL_MAP[vesselType]) === optionLabel
    );

    if (vesselTypeId) {
      const updatedBoatTypes = boatTypes.filter((boatTypeId: string) => boatTypeId !== vesselTypeId);

      setValue('boatTypes', updatedBoatTypes);
    }
  };

  const handleDeleteSingleDestination = (option: string) => {
    const destinationIndex = destinationsName.findIndex((dest: string) => dest === option);

    if (destinationIndex !== -1) {
      const updatedDestinations = destinationsName.filter((_: string, idx: number) => idx !== destinationIndex);
      const updatedIds = destinations.filter((_: string, idx: number) => idx !== destinationIndex);

      setValue('destinations', updatedDestinations);
      setValue('did', updatedIds);
    }
  };

  const getBoatTypeLabels = (boatTypeIds: string[]): string[] =>
    boatTypeIds.map(id => {
      const vesselType = id as VesselType;

      return tGeneral(VESSEL_TYPE_LABEL_MAP[vesselType]);
    });

  const getDateDisableReason = useCallback(
    (date: Dayjs): DateDisableReason => {
      if (date.isBefore(dayjs(), 'day')) return 'past';

      if (startDate) {
        if (date.isAfter(startDate) && date.isBefore(startDate.add(2, 'day'))) {
          return 'min_constraint';
        }

        if (date.isAfter(startDate.add(28, 'day'))) {
          return 'max_constraint';
        }
      }

      return 'none';
    },
    [startDate]
  );

  const renderModalContent = () => {
    switch (modalVariant) {
      case 'destination':
        return <DestinationContent onDeleteSingle={handleDeleteSingleDestination} />;
      case 'boatType':
        return <BoatTypeContent onDeleteSingle={handleDeleteSingleBoatType} />;
      default:
        return '';
    }
  };

  return (
    <>
      <Stack width="100%" direction="column">
        <Stack direction="column" flex={1}>
          <Box flex={1} width={{ xs: 'auto', md: 278 }} minHeight="61px">
            <ButtonWithChips
              isActive={modalVariant === 'destination'}
              onClick={handleDestinationOpen}
              handleClear={handleDestinationClear}
              placeholder={
                <Stack direction="column" alignItems="start">
                  <Typography variant="body1" fontWeight={600} color={colors.black950}>
                    {t('generalSearchBar.where')}
                  </Typography>
                  <Typography variant="body2" color={colors.black400}>
                    {t('generalSearchBar.searchLocations')}
                  </Typography>
                </Stack>
              }
              icon={Location}
              values={destinationsName}
              onDeleteSingle={handleDeleteSingleDestination}
            />
          </Box>
          <Box flex={1} width={{ xs: 'auto', md: 278 }} height="100%">
            <DatePickerDropdown<SearchBarFormValues>
              startDateFieldName="startDate"
              endDateFieldName="endDate"
              getDateDisableReason={getDateDisableReason}
            />
          </Box>
          <Box flex={1} width={{ xs: 'auto', md: 278 }} minHeight="61px">
            <ButtonWithChips
              isActive={modalVariant === 'boatType'}
              onClick={handleBoatTypeOpen}
              handleClear={handleBoatTypeClear}
              placeholder={
                <Stack direction="column" alignItems="start">
                  <Typography variant="body1" fontWeight={600} color={colors.black950}>
                    {t('generalSearchBar.withWhat')}
                  </Typography>
                  <Typography variant="body2" color={colors.black400}>
                    {t('generalSearchBar.chooseBoat')}
                  </Typography>
                </Stack>
              }
              icon={Boat}
              values={getBoatTypeLabels(boatTypes)}
              onDeleteSingle={handleDeleteSingleBoatType}
            />
          </Box>
        </Stack>
        <Box padding={1}>
          <Button
            type="submit"
            size="large"
            endIcon={<Search size={24} />}
            fullWidth
            id={GENERAL_SEARCH_FORM}
            aria-label={t('generalSearchBar.searchBoats')}
          >
            {t('generalSearchBar.searchBoats')}
          </Button>
        </Box>
      </Stack>
      <ModalRoot
        title={
          modalVariant === 'boatType'
            ? t('generalSearchBar.chooseTransportation')
            : t('generalSearchBar.chooseDestination')
        }
        open={isModalOpen}
        onOpen={toggleModal}
        onClose={handleModalClose}
        hideCancelButton
        customButton={
          <Button variant="contained" size="large" onClick={handleModalClose} fullWidth>
            {modalVariant === 'boatType'
              ? t('generalSearchBar.chooseTransportation')
              : t('generalSearchBar.chooseDestination')}
          </Button>
        }
      >
        {renderModalContent()}
      </ModalRoot>
    </>
  );
};

export default GeneralSearchBarMobile;
