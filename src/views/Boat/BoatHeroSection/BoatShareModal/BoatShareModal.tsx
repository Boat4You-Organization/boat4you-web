'use client';

import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ModalRoot from '@/components/ModalRoot';
import Copy from '@/components/SvgIcons/Copy';
import Facebook from '@/components/SvgIcons/Socials/Facebook';
import Twitter from '@/components/SvgIcons/Socials/Twitter';
import { DEFAULT_IMAGE } from '@/config/constants.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import copyToClipboard from '@/utils/static/copyToClipboard';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './BoatShareModal.module.scss';

interface BoatShareModalProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  yacht: YachtModel;
}

const BoatShareModal = ({ open, onOpen, onClose, yacht }: BoatShareModalProps) => {
  const t = useTranslations('common');
  const tToast = useTranslations('toastMessages');
  const pathname = usePathname();

  const mainImage = yacht.yachtImages.find(image => image.mainImage);

  const handleCopyLink = () => {
    copyToClipboard(window.location.toString(), tToast('linkCopied'));
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const url = `${baseUrl}${pathname}`;

  const renderModalContent = () => (
    <>
      <Stack direction="row" alignItems="center" spacing={1.5} pb={3}>
        {mainImage && (
          <Box className={styles.imageWrapper}>
            <Image
              src={
                mainImage
                  ? `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/image/${mainImage.id}?width=200`
                  : DEFAULT_IMAGE
              }
              alt="Boat image"
              fill
              sizes="auto"
              className={styles.image}
            />
          </Box>
        )}
        <Stack direction="column" spacing={0.5}>
          <Typography variant="h4" color={colors.black950}>
            {yacht.model} | {toTitleCase(yacht.name)}
          </Typography>
          {yacht.location && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box className={styles.countryWrapper}>
                <Image
                  loading="lazy"
                  fill
                  sizes="auto"
                  src={`https://flagcdn.com/w80/${yacht.location.countryCode.toLowerCase()}.png`}
                  alt={`${yacht.location.countryCode} flag`}
                  className={styles.country}
                />
              </Box>
              <Typography variant="body1" color={colors.black950}>
                {yacht.location.name}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Divider />
      <Grid container spacing={2} pt={3}>
        <Grid size={{ xs: 6 }}>
          <Button startIcon={<Copy size={24} />} onClick={handleCopyLink} size="large" color="secondary" fullWidth>
            {t('copyLink')}
          </Button>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Link
            href={`mailto:?subject=Boat4You&body=Check out this yacht: %0D%0A%0D%0A ${url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={url}
          >
            <Button startIcon={<Copy size={24} />} size="large" color="secondary" fullWidth>
              Email
            </Button>
          </Link>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={url}
          >
            <Button startIcon={<Facebook size={24} />} size="large" color="secondary" fullWidth>
              Facebook
            </Button>
          </Link>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Link
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out this boat!')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={url}
          >
            <Button startIcon={<Twitter size={24} />} size="large" color="secondary" fullWidth>
              Twitter
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );

  return (
    <ModalRoot open={open} title={t('share')} onOpen={onOpen} onClose={onClose} hideCancelButton hideConfirmButton>
      {renderModalContent()}
    </ModalRoot>
  );
};

export default BoatShareModal;
