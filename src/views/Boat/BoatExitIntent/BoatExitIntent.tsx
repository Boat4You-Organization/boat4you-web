'use client';

import { useEffect, useRef, useState } from 'react';

import CloseRounded from '@mui/icons-material/CloseRounded';
import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { watchExitIntent } from '@/lib/exitIntent';
import colors from '@/styles/themes/colors';
import { openBoatBooking } from '@/utils/static/boatBooking';
import { toggleBoatInquiryModalOpen } from '@/valtio/yacht/yacht.actions';

interface BoatExitIntentProps {
  boatId: number;
  /** Model + name, as in the page title. */
  boatName: string;
  imageUrl: string | null;
  /** No bookable offer: the inquiry is the only way on. */
  inquiryOnly: boolean;
}

/**
 * Exit-intent popup on the boat page (owner 3.11.2026, see lib/exitIntent.ts):
 * the boat's photo and name, why it may be gone later, and two ways on —
 * Reserve (the booking box, utils/static/boatBooking.ts) and the free
 * inquiry (BoatInquiryModal). An MUI Dialog: focus trap, Esc, close button.
 */
const BoatExitIntent = ({ boatId, boatName, imageUrl, inquiryOnly }: BoatExitIntentProps) => {
  const t = useTranslations('yacht.exitIntent');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);
  // Run once the dialog has closed and released its scroll lock — a scroll to the booking box would not move before.
  const afterClose = useRef<(() => void) | null>(null);

  useEffect(() => watchExitIntent(boatId, () => setOpen(true)), [boatId]);

  const close = () => setOpen(false);

  const reserve = () => {
    afterClose.current = openBoatBooking;
    close();
  };

  const inquire = () => {
    afterClose.current = () => toggleBoatInquiryModalOpen(true);
    close();
  };

  const onExited = () => {
    afterClose.current?.();
    afterClose.current = null;
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth={false}
      aria-labelledby="exit-intent-title"
      aria-describedby="exit-intent-body"
      slotProps={{ transition: { onExited } }}
      sx={{ '& .MuiDialog-paper': { m: 2 } }}
    >
      {/* The theme's Dialog paper is fit-content: this box sets the width, and scrolls when taller than the screen. */}
      <Box width="min(480px, calc(100vw - 32px))" maxHeight="min(80vh, calc(100dvh - 32px))" overflow="auto">
        {imageUrl && (
          <Box position="relative" width="100%" sx={{ aspectRatio: '16 / 9', backgroundColor: colors.black50 }}>
            <Image
              src={imageUrl}
              alt={boatName}
              fill
              sizes="(max-width: 480px) 100vw, 444px"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        <IconButton
          aria-label={tCommon('a11y.close')}
          onClick={close}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: colors.black400,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: '#fff' },
          }}
        >
          <CloseRounded />
        </IconButton>
        <Stack gap={2} p={{ xs: 2.5, sm: 3 }}>
          <Stack gap={1}>
            <Typography variant="body2" color={colors.blue500} fontWeight={600} textTransform="uppercase">
              {t('eyebrow')}
            </Typography>
            <Typography id="exit-intent-title" component="h2" variant="h2" fontStyle="italic" fontWeight={800}>
              {t('title', { name: boatName })}
            </Typography>
          </Stack>
          <Stack id="exit-intent-body" gap={1}>
            <Typography variant="body1">{t('body')}</Typography>
            <Typography variant="body2" color={colors.black600}>
              {t(inquiryOnly ? 'reassureInquiry' : 'reassure')}
            </Typography>
          </Stack>
          <Stack gap={1.5} pt={1}>
            {inquiryOnly ? (
              <Button size="large" fullWidth onClick={inquire}>
                {t('inquiry')}
              </Button>
            ) : (
              <>
                <Button size="large" fullWidth onClick={reserve}>
                  {t('reserve')}
                </Button>
                <Button size="large" fullWidth color="secondary" onClick={inquire}>
                  {t('inquiry')}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default BoatExitIntent;
