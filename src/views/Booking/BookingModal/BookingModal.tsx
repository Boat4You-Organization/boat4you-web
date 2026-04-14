import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import ModalRoot from '@/components/ModalRoot';
import BookingVector from '@/components/SvgIcons/Vector/BookingVector';
import colors from '@/styles/themes/colors';

interface BookingModalProps {
  isOpen: boolean;
}

const HighlightedText = (chunks: React.ReactNode) => (
  <Typography component="span" variant="h1" fontStyle="italic" fontWeight={800} color={colors.blue500}>
    {chunks}
  </Typography>
);

const BookingModal = ({ isOpen }: BookingModalProps) => {
  const t = useTranslations('common');

  const noop = () => {};

  return (
    <ModalRoot
      open={isOpen}
      onOpen={noop}
      onClose={noop}
      width={630}
      title=""
      hideCancelButton
      hideConfirmButton
      hideTitle
    >
      <Stack alignItems="center" p={4} spacing={8}>
        <Stack position="relative">
          <CircularProgress size={32} sx={{ position: 'absolute', top: 12, left: 86 }} />
          <BookingVector />
        </Stack>
        <Stack maxWidth={300} textAlign="center" spacing={2}>
          <Typography component="p" variant="h1" color={colors.blue950}>
            {t.rich('weAreGettingYourBoatReady', {
              highlight: HighlightedText,
            })}
          </Typography>
          <Typography variant="body2" color={colors.black400}>
            {t('pleaseDontCloseThisWindow')}
          </Typography>
        </Stack>
      </Stack>
    </ModalRoot>
  );
};

export default BookingModal;
