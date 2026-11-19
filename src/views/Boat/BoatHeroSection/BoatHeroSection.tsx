'use client';

import React, { useState } from 'react';

import { FileDownloadOutlined, OpenInNew } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Icon,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import BoatLocationModal from '@/components/BoatLocationModal';
import FavoriteButton from '@/components/FavoriteButton';
import Gallery from '@/components/Gallery';
import Crew from '@/components/SvgIcons/Crew';
import Download from '@/components/SvgIcons/Download';
import Share from '@/components/SvgIcons/Share';
import { singleBoatTabsFor } from '@/config/tabs.config';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import useYachtPdfDownload from '@/utils/hooks/useYachtPdfDownload';
import { countryDisplayName } from '@/utils/static/countryDisplayName';
import { displayBaseName } from '@/utils/static/croatianPlaceNames';
import { formatPriceWithCurrency, isPositivePrice } from '@/utils/static/formatPriceCurrency';
import { toTitleCase, yachtLabel } from '@/utils/static/toTitleCase';
import { heroImage } from '@/utils/static/yachtLayout';
import { crewProfileHref } from '@/utils/static/yachtMedia';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import type { BoatFromPrice } from '@/views/Boat/BoatMobileNavigation/BoatMobileNavigation';

import styles from './BoatHeroSection.module.scss';
import BoatShareModal from './BoatShareModal';

interface BoatHeroSectionProps {
  yacht: YachtModel;
  /** The cheapest bookable week (or period), as the phone bar quotes it; null → no price line. */
  fromPrice?: BoatFromPrice | null;
  /** The layout drawings, kept out of `yacht.yachtImages` (yachtLayout.ts) — for the PDF's layout page. */
  layoutImages?: YachtImage[];
}

const BoatHeroSection = ({ yacht, layoutImages, fromPrice = null }: BoatHeroSectionProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const t = useTranslations('common');
  const locale = useLocale();
  const tYacht = useTranslations('yacht');
  // The bar's own wording and amount (BoatMobileNavigation): "From … / week", or "Price for N days …" when no week
  // is bookable.
  const fromAmount =
    fromPrice && isPositivePrice(fromPrice.clientPriceInfo?.amount ?? fromPrice.clientPriceEur)
      ? formatPriceWithCurrency({
          clientPriceEur: fromPrice.clientPriceEur,
          clientPriceInfo: fromPrice.clientPriceInfo,
          locale,
        })
      : null;
  const weeklyLabel = fromAmount ? tYacht('fromPerWeek', { price: fromAmount }) : null;
  const fromPriceLabel =
    fromAmount && fromPrice && fromPrice.nights !== 7
      ? `${t('priceForXDays', { days: String(fromPrice.nights) })} ${fromAmount}`
      : weeklyLabel;
  const scrollToAvailability = () => {
    const index = (singleBoatTabsFor(yacht) as readonly string[]).indexOf('availability');
    const section = index < 0 ? null : document.getElementById(`section-${index}`);

    if (!section) return;

    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: section.getBoundingClientRect().top + window.scrollY - 96,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };
  const { selectedOffer } = useYachtStore();
  const { downloadYachtPDF, isDownloading } = useYachtPdfDownload({
    yacht,
    selectedOffer: selectedOffer ?? null,
    layoutImages,
  });

  // One-way charters: the selected date's offer drops off at a different marina.
  // Show "pickup » drop-off" (each opens its own map) so it's clear the chosen
  // week is one-way. Round-trip / no selected offer falls back to the base marina.
  const pickup = selectedOffer?.locationFrom ?? null;
  const dropOff = selectedOffer?.locationTo ?? null;
  const isOneWay = Boolean(pickup?.name && dropOff?.name && pickup.name !== dropOff.name);
  const heroLocation = isOneWay && pickup ? pickup : yacht.location;
  // The favourite's picture: the boat's hero, never a layout or a marina photo (yachtLayout.ts).
  const favoriteYacht = { ...yacht, mainImageId: heroImage(yacht.yachtImages)?.id || 0 };
  // The crew-profile PDF the admin uploaded (owner 17.10.2026, gulet Allure):
  // an action of its own next to the brochure PDF, opened in a new tab.
  const crewProfile = crewProfileHref(yacht);

  // Map modal shows whichever marina was clicked (pickup or drop-off).
  const [mapMarinaName, setMapMarinaName] = useState<string | null>(null);
  const isMapOpen = mapMarinaName !== null;
  const closeMap = () => setMapMarinaName(null);
  const openMapFor = (name: string) => setMapMarinaName(name);

  return (
    <>
      <BoatShareModal open={isOpen} onOpen={toggeIsOpen} onClose={toggeIsOpen} yacht={yacht} />
      {mapMarinaName && (
        <BoatLocationModal
          open={isMapOpen}
          onClose={closeMap}
          locationName={mapMarinaName}
          lat={yacht.location?.lat}
          lon={yacht.location?.lon}
        />
      )}
      <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
        {/* Mobile order flips via CSS (title below the photo, Boataround-style,
            Mario 20.7.2026) — single H1 in the DOM either way. */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={styles.titleRow}
          sx={{ pt: { xs: 2, sm: 11 }, pb: { xs: 1, sm: 2 } }}
        >
          <Stack direction="column" spacing={0.5}>
            <Typography component="h1" variant="h2" color={colors.black950}>
              {yachtLabel(yacht.model, toTitleCase(yacht.name))}
            </Typography>
            {heroLocation?.name && (
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                {heroLocation.countryCode && (
                  <Box className={styles.imageWrapper}>
                    <Image
                      loading="lazy"
                      fill
                      sizes="auto"
                      src={`https://flagcdn.com/w80/${heroLocation.countryCode.toLowerCase()}.png`}
                      alt={t('a11y.flagOf', { country: countryDisplayName(heroLocation.countryCode, locale) })}
                      className={styles.image}
                    />
                  </Box>
                )}
                <MuiLink
                  component="button"
                  type="button"
                  onClick={() => openMapFor(heroLocation.name)}
                  underline="hover"
                  aria-label={t('openInMap')}
                  sx={{
                    color: colors.blue500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: 16,
                    background: 'none',
                    border: 0,
                    p: 0,
                    cursor: 'pointer',
                  }}
                >
                  {displayBaseName(heroLocation.name)}
                  <OpenInNew sx={{ fontSize: 14 }} />
                </MuiLink>
                {isOneWay && dropOff?.name && (
                  <>
                    <Box component="span" aria-hidden="true" sx={{ color: colors.black500, fontWeight: 600 }}>
                      »
                    </Box>
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={() => openMapFor(dropOff.name)}
                      underline="hover"
                      aria-label={t('openInMap')}
                      sx={{
                        color: colors.blue500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: 16,
                        background: 'none',
                        border: 0,
                        p: 0,
                        cursor: 'pointer',
                      }}
                    >
                      {displayBaseName(dropOff.name)}
                      <OpenInNew sx={{ fontSize: 14 }} />
                    </MuiLink>
                  </>
                )}
              </Stack>
            )}
            {/* Phone: the price on the first screen (UX review 19.11.2026: it was 3.4 screens down, and the bar
                with it only slides in on scroll). The desktop has the price box beside the photos. A tap goes to
                the weeks. */}
            {fromPriceLabel && (
              <MuiLink
                component="button"
                type="button"
                underline="none"
                onClick={scrollToAvailability}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  width: 'fit-content',
                  pt: 0.5,
                  color: colors.green500,
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: 'left',
                  background: 'none',
                  border: 0,
                  p: 0,
                  cursor: 'pointer',
                }}
              >
                {fromPriceLabel}
              </MuiLink>
            )}
          </Stack>
          {/* Wraps instead of squeezing the title on a tablet when the crew-profile action makes four;
              every other boat keeps the one-line strip. */}
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            flexWrap={crewProfile ? 'wrap' : 'nowrap'}
            justifyContent="flex-end"
            className={styles.iconsDesktop}
          >
            <Button
              variant="containedInfo"
              startIcon={isDownloading ? <CircularProgress size={16} /> : <FileDownloadOutlined />}
              onClick={downloadYachtPDF}
              disabled={isDownloading}
              aria-label={t('pdfDownload')}
            >
              {t('pdfDownload')}
            </Button>
            {crewProfile && (
              <Button
                variant="containedInfo"
                href={crewProfile}
                target="_blank"
                rel="noopener nofollow"
                startIcon={<Download size={18} />}
              >
                {t('crewProfilePdf')}
              </Button>
            )}
            <Button variant="containedInfo" startIcon={<Share />} onClick={toggeIsOpen} aria-label={t('share')}>
              {t('share')}
            </Button>
            <FavoriteButton yacht={favoriteYacht} buttonText={t('save')} />
          </Stack>
        </Stack>
        <Box className={styles.galleryWrap}>
          <Gallery yacht={yacht} />
          {/* Boataround-style circular actions ON the photo (mobile only). */}
          <Stack direction="row" spacing={1} className={styles.imageActions}>
            <IconButton
              className={styles.imageActionBtn}
              onClick={downloadYachtPDF}
              disabled={isDownloading}
              aria-label={t('pdfDownload')}
            >
              {isDownloading ? (
                <CircularProgress size={18} sx={{ color: colors.black950 }} />
              ) : (
                <FileDownloadOutlined sx={{ fontSize: 20, color: colors.black950 }} />
              )}
            </IconButton>
            {/* The crew's cap, not a second download arrow next to the brochure's. */}
            {crewProfile && (
              <IconButton
                className={styles.imageActionBtn}
                href={crewProfile}
                target="_blank"
                rel="noopener nofollow"
                aria-label={t('crewProfilePdf')}
              >
                <Crew size={20} fill={colors.black950} />
              </IconButton>
            )}
            <IconButton className={styles.imageActionBtn} onClick={toggeIsOpen} aria-label={t('share')}>
              <Icon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share size={18} fill={colors.black950} />
              </Icon>
            </IconButton>
            <FavoriteButton yacht={favoriteYacht} color={colors.black950} className={styles.imageActionBtn} />
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default BoatHeroSection;
