'use client';

import { AppBar, Container, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Stepper from '@/components/Stepper';
import ArrowLeft from '@/components/SvgIcons/ArrowLeft';
import { bookingStepMessageIds } from '@/config/stepper.config';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { handleBackStep } from '@/valtio/booking/booking.actions';
import { useBookingStore } from '@/valtio/booking/booking.store';

import styles from './HeaderBooking.module.scss';

interface HeaderBookingProps {
  isAdmin: boolean | undefined;
}

const HeaderBooking = ({ isAdmin }: HeaderBookingProps) => {
  const { activeStep } = useBookingStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile } = useBreakpoint();
  const t = useTranslations();

  const steps = isAdmin ? [bookingStepMessageIds[0]] : bookingStepMessageIds;
  const reservationId = getDataFromSessionStorage<number>('reservationId');

  const handleBackButtonClick = () => {
    if (activeStep > 0 && !reservationId) {
      handleBackStep();
    } else if (activeStep === 0) {
      const currentPath = pathname;
      const enterYourDetailsPrefix = '/enter-your-details';

      if (currentPath.includes(enterYourDetailsPrefix)) {
        const boatPagePath = currentPath.replace(enterYourDetailsPrefix, '/boat');

        const searchParamsString = searchParams.toString();
        const finalUrl = searchParamsString ? `${boatPagePath}?${searchParamsString}` : boatPagePath;

        router.push(finalUrl);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <AppBar elevation={0} classes={{ root: styles.root }} className={styles.container}>
      <Container disableGutters maxWidth="xl" className={styles.header}>
        <IconButton
          className={styles.backButton}
          size={isMobile ? 'large' : 'medium'}
          onClick={handleBackButtonClick}
          disabled={activeStep > 0 && !!reservationId}
        >
          <ArrowLeft size={24} />
        </IconButton>
        <Stepper activeStep={activeStep} steps={steps.map(id => t(id))} />
      </Container>
    </AppBar>
  );
};

export default HeaderBooking;
