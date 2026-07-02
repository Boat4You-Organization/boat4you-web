'use client';

import { Button, Container, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import Download from '@/components/SvgIcons/Download';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import { ReservationDetails, ReservationDocument } from '@/models/reservation.model';

/**
 * Prominent travel-documents strip rendered directly UNDER the yacht images —
 * Mario rule (3.7.2026): the crew list / boarding pass / preference list must
 * be the FIRST thing the customer sees on the booking page so nobody misses
 * them. Order: crew list (partner editor link, then any uploaded crew form),
 * boarding pass / base info, preference list. Contract / untyped uploads stay
 * in the sidebar "Travel documents" list only. Renders nothing while no
 * document or link exists yet.
 */

interface TravelDocumentsBarProps {
  reservationDetails: ReservationDetails;
}

const TravelDocumentsBar = ({ reservationDetails }: TravelDocumentsBarProps) => {
  const t = useTranslations('common');
  const { reservationId, crewListUrl, documents } = reservationDetails;

  const byType = (type: ReservationDocument['documentType']) =>
    (documents ?? []).filter(doc => doc.documentType === type);

  const crewListDocs = byType('CREW_LIST');
  const boardingPassDocs = byType('BOARDING_PASS');
  const preferenceListDocs = byType('PREFERENCE_LIST');

  const hasAnything =
    Boolean(crewListUrl) || crewListDocs.length + boardingPassDocs.length + preferenceListDocs.length > 0;

  if (!hasAnything) return null;

  const buttonSx = {
    textTransform: 'none' as const,
    fontWeight: 700,
    fontSize: 15,
    px: 3,
    py: 1.25,
    width: { xs: '100%', sm: 'auto' },
    '& .MuiButton-startIcon': { marginRight: 1 },
  };

  const docHref = (doc: ReservationDocument) => `/api/my-bookings/${reservationId}/documents/${doc.id}`;

  const renderDocButtons = (docs: ReservationDocument[], label: string) =>
    docs.map((doc, idx) => (
      <Button
        key={doc.id}
        size="large"
        variant="contained"
        startIcon={<Download size={20} />}
        component="a"
        href={docHref(doc)}
        target="_blank"
        rel="noopener noreferrer"
        sx={buttonSx}
      >
        {label}
        {docs.length > 1 ? ` ${idx + 1}` : ''}
      </Button>
    ));

  return (
    <Container component="section" maxWidth="xl" disableGutters>
      <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={1.5} sx={{ mt: 3 }}>
        {crewListUrl && (
          <Button
            size="large"
            variant="contained"
            startIcon={<ExternalLink size={20} />}
            component="a"
            href={crewListUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={buttonSx}
          >
            {t('crewListTitle')}
          </Button>
        )}
        {renderDocButtons(crewListDocs, t('crewListTitle'))}
        {renderDocButtons(boardingPassDocs, t('docTypeBoardingPass'))}
        {renderDocButtons(preferenceListDocs, t('docTypePreferenceList'))}
      </Stack>
    </Container>
  );
};

export default TravelDocumentsBar;
