'use client';

import React from 'react';

import { Box } from '@mui/material';

import ModalRoot from '@/components/ModalRoot';
import { displayBaseName } from '@/utils/static/croatianPlaceNames';
import { googleMapsQuery } from '@/utils/static/googleMapsUtils';

interface BoatLocationModalProps {
  open: boolean;
  onClose: () => void;
  locationName: string;
  /** Marina coordinates when the API sends them — the pin lands exactly there. */
  lat?: number | null;
  lon?: number | null;
}

const BoatLocationModal = ({ open, onClose, locationName, lat, lon }: BoatLocationModalProps) => {
  // `output=embed` gives a "light mode" map inside an iframe — no POI side panel,
  // no third-party Booking options (which is how competitor providers like
  // Boatscribe leak into Google Maps). Free, no API key required.
  // `t=k` opens the map in satellite view by default.
  // Coordinates when known, else the name without the "Marina | Town" pipe (googleMapsUtils.ts).
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(googleMapsQuery(locationName, lat, lon))}&t=k&output=embed`;
  // The heading reads like the link that opened it ("D-Marin Dalmacija Marina,
  // Sukošan"); the map still looks up the catalogue name.
  const shownName = displayBaseName(locationName);

  return (
    <ModalRoot
      open={open}
      onOpen={onClose}
      onClose={onClose}
      title={shownName}
      hideCancelButton
      hideConfirmButton
      hideDivider
      width={900}
    >
      {/* Only mount the Google Maps iframe while the modal is actually OPEN.
          The mobile path (SwipeableModal) uses `keepMounted`, so without this
          guard the embed loads and keeps a whole Google Maps renderer process
          alive on every boat-detail page that renders this modal — even before
          the user ever opens the map (confirmed in a mobile perf trace: the
          maps process ran the entire session). Gating here also tears the
          iframe down on close. */}
      {open && (
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
          title={`Google Maps — ${shownName}`}
        />
      )}
    </ModalRoot>
  );
};

export default BoatLocationModal;
