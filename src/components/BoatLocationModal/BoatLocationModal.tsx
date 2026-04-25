'use client';

import React from 'react';

import { Box } from '@mui/material';

import ModalRoot from '@/components/ModalRoot';

interface BoatLocationModalProps {
  open: boolean;
  onClose: () => void;
  locationName: string;
}

const BoatLocationModal = ({ open, onClose, locationName }: BoatLocationModalProps) => {
  // `output=embed` gives a "light mode" map inside an iframe — no POI side panel,
  // no third-party Booking options (which is how competitor providers like
  // Boatscribe leak into Google Maps). Free, no API key required.
  // `t=k` opens the map in satellite view by default.
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=k&output=embed`;

  return (
    <ModalRoot
      open={open}
      onOpen={onClose}
      onClose={onClose}
      title={locationName}
      hideCancelButton
      hideConfirmButton
      hideDivider
      width={900}
    >
      <Box
        component="iframe"
        src={embedSrc}
        sx={{
          width: '100%',
          height: { xs: 400, md: 550 },
          border: 0,
          borderRadius: 2,
          display: 'block',
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        title={`Google Maps — ${locationName}`}
      />
    </ModalRoot>
  );
};

export default BoatLocationModal;
