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
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import BoatLocationModal from '@/components/BoatLocationModal';
import FavoriteButton from '@/components/FavoriteButton';
import Gallery from '@/components/Gallery';
import Share from '@/components/SvgIcons/Share';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';
import useYachtPdfDownload from '@/utils/hooks/useYachtPdfDownload';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import styles from './BoatHeroSection.module.scss';
import BoatShareModal from './BoatShareModal';

interface BoatHeroSectionProps {
  yacht: YachtModel;
}

const BoatHeroSection = ({ yacht }: BoatHeroSectionProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const t = useTranslations('common');
  const { selectedOffer } = useYachtStore();
  const { downloadYachtPDF, isDownloading } = useYachtPdfDownload({ yacht, selectedOffer: selectedOffer ?? null });

  // One-way charters: the selected date's offer drops off at a different marina.
  // Show "pickup » drop-off" (each opens its own map) so it's clear the chosen
  // week is one-way. Round-trip / no selected offer falls back to the base marina.
  const pickup = selectedOffer?.locationFrom ?? null;
  const dropOff = selectedOffer?.locationTo ?? null;
  const isOneWay = Boolean(pickup?.name && dropOff?.name && pickup.name !== dropOff.name);
  const heroLocation = isOneWay && pickup ? pickup : yacht.location;

  // Map modal shows whichever marina was clicked (pickup or drop-off).
  const [mapMarinaName, setMapMarinaName] = useState<string | null>(null);
  const isMapOpen = mapMarinaName !== null;
  const closeMap = () => setMapMarinaName(null);
  const openMapFor = (name: string) => setMapMarinaName(name);

  return (
    <>
      <BoatShareModal open={isOpen} onOpen={toggeIsOpen} onClose={toggeIsOpen} yacht={yacht} />
      {mapMarinaName && <BoatLocationModal open={isMapOpen} onClose={closeMap} locationName={mapMarinaName} />}
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
              {yacht.model} | {toTitleCase(yacht.name)}
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
                      alt={`${heroLocation.countryCode} flag`}
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
                  {heroLocation.name}
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
                      {dropOff.name}
                      <OpenInNew sx={{ fontSize: 14 }} />
                    </MuiLink>
                  </>
                )}
              </Stack>
            )}
          </Stack>
          <Stack direction="row" spacing={2} className={styles.iconsDesktop}>
            <Button
              variant="containedInfo"
              startIcon={isDownloading ? <CircularProgress size={16} /> : <FileDownloadOutlined />}
              onClick={downloadYachtPDF}
              disabled={isDownloading}
              aria-label={t('pdfDownload')}
            >
              {t('pdfDownload')}
            </Button>
            <Button variant="containedInfo" startIcon={<Share />} onClick={toggeIsOpen} aria-label={t('share')}>
              {t('share')}
            </Button>
            <FavoriteButton
              yacht={{ ...yacht, mainImageId: yacht.yachtImages.find(el => el.mainImage)?.id || 0 }}
              buttonText={t('save')}
            />
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
            <IconButton className={styles.imageActionBtn} onClick={toggeIsOpen} aria-label={t('share')}>
              <Icon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Share size={18} fill={colors.black950} />
              </Icon>
            </IconButton>
            <FavoriteButton
              yacht={{ ...yacht, mainImageId: yacht.yachtImages.find(el => el.mainImage)?.id || 0 }}
              color={colors.black950}
              className={styles.imageActionBtn}
            />
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default BoatHeroSection;
