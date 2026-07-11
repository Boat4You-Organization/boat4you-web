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
import { getBoatImageUrl } from '@/utils/static/imageUtils';
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
              src={mainImage ? getBoatImageUrl(mainImage.id, 200) : DEFAULT_IMAGE}
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
        <Grid size={{ xs: 6 }}>
          <Link
            href={`https://wa.me/?text=${encodeURIComponent(`Check out this yacht: ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={url}
          >
            <Button
              startIcon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.1 14.1c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-1.5-.5c-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.4l.9 2.1c.1.2.1.4 0 .6l-.3.5-.5.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4 0 .1 0 .7-.2 1.3Z" />
                </svg>
              }
              size="large"
              color="secondary"
              fullWidth
            >
              WhatsApp
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
