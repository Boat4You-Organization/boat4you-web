'use client';

/* eslint-disable consistent-return, no-nested-ternary */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Box, Button, Popover, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
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

import BoatTypeContent from './BoatTypeContent';
import DestinationContent from './DestinationContent';

type ActiveField = 'destination' | 'boatType' | null;

// Unified responsive search bar (was mobile-only; kept the filename so the
// home hero + the search-page mobile header modal imports stay put).
//
//  • DESKTOP (md+): one seamless bar of trigger buttons. Clicking a field
//    opens its picker as a Popover anchored DIRECTLY BELOW that field — no
//    modal, no "Choose destination" confirm button (Mario, Jun-2026).
//  • MOBILE: bottom-sheet / full-screen ModalRoot with the guided flow
//    (destination → dates → boat type → auto-submit). UNCHANGED.
//
// Pickers mount lazily — DestinationContent (the MUI Autocomplete) only renders
// when its dropdown opens, so the home no longer hydrates two always-open
// autocompletes above the fold.
const GeneralSearchBarMobile = () => {
  const { watch, setValue } = useFormContext<SearchBarFormValues>();
  // `noSsr` — evaluate matchMedia at render time instead of starting from the
  // SSR default. This bar is client-only (CSR bailout), so there's no hydration
  // to mismatch, and we must NOT briefly read as mobile on a desktop viewport
  // (that would open the field pickers as a modal instead of a dropdown).
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'), { noSsr: true });

  // Single source of truth for which field's picker is open. Drives BOTH the
  // desktop Popover and the mobile ModalRoot.
  const [activeField, setActiveField] = useState<ActiveField>(null);

  // Desktop popover anchors — point each dropdown under its own field box.
  const destAnchorRef = useRef<HTMLDivElement | null>(null);
  const boatAnchorRef = useRef<HTMLDivElement | null>(null);

  // Mobile guided flow: destination confirm → calendar opens via `dateOpenSignal`
  // bump → once the user picks an end date, auto-open the boat-type modal. Desktop
  // never sets these (no confirm buttons), so the guided flow is mobile-only.
  const [dateOpenSignal, setDateOpenSignal] = useState(0);
  const autoAdvanceToBoatTypeRef = useRef(false);

  const t = useTranslations('home');
  const tGeneral = useTranslations();

  const destinations = watch('did');
  const destinationsName = watch('destinations');
  const boatTypes = watch('boatTypes') || [];
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const handleDestinationOpen = () => setActiveField('destination');
  const handleBoatTypeOpen = () => setActiveField('boatType');
  const handleClose = () => setActiveField(null);

  // Guided flow (both viewports) — picking a location closes the destination
  // picker and opens the calendar (`dateOpenSignal` bump). Picking an end date
  // then advances to boat type via the `endDate` effect below. No confirm taps
  // between steps, so there's "not much clicking" (Mario) — same on mobile.
  const handleLocationAdvance = () => {
    autoAdvanceToBoatTypeRef.current = true;
    setActiveField(null);
    setDateOpenSignal(s => s + 1);
  };

  // Last step — after picking a boat type, fire the search right away (this is
  // the mobile equivalent of clicking the bar's Search button on desktop).
  // Close first so results aren't covered by the sheet.
  const handleBoatTypeConfirm = () => {
    handleClose();
    requestAnimationFrame(() => {
      const form = document.getElementById(GENERAL_SEARCH_FORM) as HTMLFormElement | null;

      form?.requestSubmit();
    });
  };

  // Guided flow — when the user picks an end date, open the boat-type picker
  // next. DatePickerDropdown closes its own popover/modal on range-complete, so
  // let that finish first.
  useEffect(() => {
    if (!endDate || !autoAdvanceToBoatTypeRef.current) return;

    autoAdvanceToBoatTypeRef.current = false;

    const timer = setTimeout(() => setActiveField('boatType'), 250);

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

  // Desktop popover Paper styling — shared between the two dropdowns. Portals to
  // <body> so the bar's `overflow: hidden` Paper never clips it.
  const popoverPaperSx = {
    mt: 1,
    maxWidth: 'calc(100vw - 32px)',
    maxHeight: '70vh',
    overflowY: 'auto',
    borderRadius: '10px',
    boxShadow: '0px 4px 14px 0px rgba(0, 0, 0, 0.15)',
  } as const;

  const renderMobilePickerContent = () => {
    if (activeField === 'destination') {
      return <DestinationContent onLocationAdded={handleLocationAdvance} />;
    }

    if (activeField === 'boatType') {
      return <BoatTypeContent onDeleteSingle={handleDeleteSingleBoatType} onSelect={handleBoatTypeConfirm} />;
    }

    return null;
  };

  return (
    <>
      <Stack width="100%" direction={{ xs: 'column', md: 'row' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} flex={1}>
          <Box ref={destAnchorRef} flex={1} minHeight="61px" sx={{ maxWidth: { md: 278 } }}>
            <ButtonWithChips
              isActive={activeField === 'destination'}
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
          <Box flex={1} minHeight="61px" sx={{ maxWidth: { md: 278 } }}>
            <DatePickerDropdown<SearchBarFormValues>
              startDateFieldName="startDate"
              endDateFieldName="endDate"
              getDateDisableReason={getDateDisableReason}
              openSignal={dateOpenSignal}
            />
          </Box>
          <Box ref={boatAnchorRef} flex={1} minHeight="61px" sx={{ maxWidth: { md: 278 } }}>
            <ButtonWithChips
              isActive={activeField === 'boatType'}
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
        <Box sx={{ p: { xs: 1, md: 0.75 }, display: 'flex', alignItems: 'stretch' }}>
          <Button
            type="submit"
            size="large"
            id={GENERAL_SEARCH_FORM}
            disabled={!destinations || destinations.length === 0}
            aria-label={t('generalSearchBar.searchBoats')}
            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 'auto' }}
          >
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' }, mr: 1 }}>
              {t('generalSearchBar.searchBoats')}
            </Box>
            <Search size={24} />
          </Button>
        </Box>
      </Stack>

      {/* DESKTOP: each picker opens as a dropdown anchored below its field. */}
      {!isMobile && (
        <>
          <Popover
            open={activeField === 'destination'}
            anchorEl={destAnchorRef.current}
            onClose={handleClose}
            // Don't let the Popover grab focus onto its Paper (a div) after the
            // open transition — that stole focus back from the search input and
            // made the field read as un-typeable. DestinationContent focuses the
            // input itself on mount, which is the better a11y target anyway.
            disableAutoFocus
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{ paper: { sx: { ...popoverPaperSx, width: 384, p: 1.5 } } }}
          >
            <DestinationContent onLocationAdded={handleLocationAdvance} />
          </Popover>
          <Popover
            open={activeField === 'boatType'}
            anchorEl={boatAnchorRef.current}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            slotProps={{ paper: { sx: { ...popoverPaperSx, width: 320, p: 1 } } }}
          >
            <BoatTypeContent onDeleteSingle={handleDeleteSingleBoatType} onSelect={handleBoatTypeConfirm} />
          </Popover>
        </>
      )}

      {/* MOBILE: bottom-sheet / full-screen modal with the guided flow. */}
      {isMobile && (
        <ModalRoot
          title={
            activeField === 'boatType' ? t('generalSearchBar.selectYacht') : t('generalSearchBar.chooseDestination')
          }
          open={activeField !== null}
          onOpen={() => {}}
          onClose={handleClose}
          hideCancelButton
          // Both pickers advance on selection (location → calendar, boat type →
          // search), so neither needs a confirm button — close via the X.
          hideConfirmButton
          // Destination uses full screen (long recent + popular + search
          // results lists). Boat-type sits in a bottom sheet — compact content
          // that shouldn't dominate the viewport.
          fullScreenOnMobile={activeField === 'destination'}
        >
          {renderMobilePickerContent()}
        </ModalRoot>
      )}
    </>
  );
};

export default GeneralSearchBarMobile;
