'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  // Guided flow: destination confirm → calendar opens via `openSignal` bump →
  // once user picks an end date, we auto-open the boat-type modal. Matches
  // desktop's `handleLocationAdded` UX so mobile users don't have to find
  // each step manually.
  const [dateOpenSignal, setDateOpenSignal] = useState(0);
  const autoAdvanceToBoatTypeRef = useRef(false);

  const t = useTranslations('home');
  const tGeneral = useTranslations();

  const destinations = watch('did');
  const destinationsName = watch('destinations');
  const boatTypes = watch('boatTypes') || [];
  const startDate = watch('startDate');
  const endDate = watch('endDate');

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

  // Last step of the guided flow — after the user picks a boat type,
  // fire the search right away. Saves the extra tap on "Search boats"
  // at the bottom of the form. Close modal first so the list of results
  // isn't covered by the sheet.
  const handleBoatTypeConfirm = () => {
    handleModalClose();
    requestAnimationFrame(() => {
      const form = document.getElementById(GENERAL_SEARCH_FORM) as HTMLFormElement | null;

      form?.requestSubmit();
    });
  };

  // Confirm button inside destination modal: close modal + open calendar
  // (via openSignal bump). Only advances if the user actually selected at
  // least one destination — clicking without a pick just closes.
  const handleDestinationConfirm = () => {
    const hasDestination = (destinations || []).length > 0;

    handleModalClose();

    if (hasDestination) {
      autoAdvanceToBoatTypeRef.current = true;
      setDateOpenSignal(s => s + 1);
    }
  };

  // When the user picks an end date during the guided flow, open the
  // boat-type modal next. DatePickerDropdown closes its own modal on
  // range-complete, so we let that finish before opening ours.
  useEffect(() => {
    if (!endDate || !autoAdvanceToBoatTypeRef.current) return;

    autoAdvanceToBoatTypeRef.current = false;

    const timer = setTimeout(() => {
      setModalVariant('boatType');
      toggleModal();
    }, 250);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate?.valueOf?.() ?? null]);

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

      // Constraints only apply while picking the end date. Once both are set
      // the next click restarts the range — all future dates must be clickable.
      if (startDate && !endDate) {
        if (date.isAfter(startDate) && date.isBefore(startDate.add(2, 'day'))) {
          return 'min_constraint';
        }

        if (date.isAfter(startDate.add(28, 'day'))) {
          return 'max_constraint';
        }
      }

      return 'none';
    },
    [startDate, endDate]
  );

  const renderModalContent = () => {
    switch (modalVariant) {
      case 'destination':
        return <DestinationContent />;
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
              openSignal={dateOpenSignal}
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
          modalVariant === 'boatType' ? t('generalSearchBar.selectYacht') : t('generalSearchBar.chooseDestination')
        }
        open={isModalOpen}
        onOpen={toggleModal}
        onClose={handleModalClose}
        hideCancelButton
        // Destination uses full screen (long recent + popular + search
        // results lists). Boat-type + calendar sit in a bottom sheet —
        // compact content that shouldn't dominate the viewport.
        fullScreenOnMobile={modalVariant === 'destination'}
        customButton={
          <Button
            variant="contained"
            size="large"
            onClick={
              modalVariant === 'destination'
                ? handleDestinationConfirm
                : modalVariant === 'boatType'
                  ? handleBoatTypeConfirm
                  : handleModalClose
            }
            fullWidth
          >
            {modalVariant === 'boatType' ? t('generalSearchBar.selectYacht') : t('generalSearchBar.chooseDestination')}
          </Button>
        }
      >
        {renderModalContent()}
      </ModalRoot>
    </>
  );
};

export default GeneralSearchBarMobile;
