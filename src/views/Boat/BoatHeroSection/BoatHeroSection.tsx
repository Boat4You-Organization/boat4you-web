'use client';

import React from 'react';

import { Box, Button, Container, Icon, IconButton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import FavoriteButton from '@/components/FavoriteButton';
import Gallery from '@/components/Gallery';
import Share from '@/components/SvgIcons/Share';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './BoatHeroSection.module.scss';
import BoatShareModal from './BoatShareModal';

interface BoatHeroSectionProps {
  yacht: YachtModel;
}

const BoatHeroSection = ({ yacht }: BoatHeroSectionProps) => {
  const [isOpen, toggeIsOpen] = useToggleState();
  const t = useTranslations('common');

  return (
    <>
      <BoatShareModal open={isOpen} onOpen={toggeIsOpen} onClose={toggeIsOpen} yacht={yacht} />
      <Container component="section" maxWidth="xl" disableGutters className={styles.container}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" pt={11} pb={2}>
          <Stack direction="column" spacing={0.5}>
            <Typography component="h1" variant="h2" color={colors.black950}>
              {yacht.model} | {yacht.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box className={styles.imageWrapper}>
                <Image
                  loading="lazy"
                  fill
                  sizes="auto"
                  src={`https://flagcdn.com/w80/${yacht.location.countryCode.toLowerCase()}.png`}
                  alt={`${yacht.location.countryCode} flag`}
                  className={styles.image}
                />
              </Box>
              <Typography variant="body1" color={colors.black950}>
                {yacht.location.name}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} className={styles.iconsMobile}>
            <IconButton onClick={toggeIsOpen} aria-label={t('share')}>
              <Icon>
                <Share size={20} fill={colors.black950} />
              </Icon>
            </IconButton>
            <FavoriteButton
              yacht={{ ...yacht, mainImageId: yacht.yachtImages.find(el => el.mainImage)?.id || 0 }}
              color={colors.black950}
            />
          </Stack>
          <Stack direction="row" spacing={2} className={styles.iconsDesktop}>
            <Button variant="containedInfo" startIcon={<Share />} onClick={toggeIsOpen} aria-label={t('share')}>
              {t('share')}
            </Button>
            <FavoriteButton
              yacht={{ ...yacht, mainImageId: yacht.yachtImages.find(el => el.mainImage)?.id || 0 }}
              buttonText={t('save')}
            />
          </Stack>
        </Stack>
        <Gallery yacht={yacht} />
      </Container>
    </>
  );
};

export default BoatHeroSection;
