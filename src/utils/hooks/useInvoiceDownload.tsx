import React from 'react';

import { pdf } from '@react-pdf/renderer';
import { useLocale } from 'next-intl';

import ConfirmationPDF from '@/components/ConfirmationPDF/ConfirmationPDF';
import { LocaleType } from '@/config/locales.config';
import { ReservationDetails } from '@/models/reservation.model';
import { useUserStore } from '@/valtio/user/user.store';

interface UseInvoiceDownloadProps {
  reservationDetails: ReservationDetails;
}

interface UseInvoiceDownloadPayload {
  downloadReservationPDF: () => Promise<void>;
  isDownloading: boolean;
}

const useInvoiceDownload = ({ reservationDetails }: UseInvoiceDownloadProps): UseInvoiceDownloadPayload => {
  const locale = useLocale();
  const { user } = useUserStore();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const getLocale = (lang: string): LocaleType => {
    const supportedLocales: LocaleType[] = ['en', 'hr', 'fr', 'de', 'pt', 'it', 'es', 'pl', 'nl'];
    const baseLocale = lang.split('-')[0] as LocaleType;

    return supportedLocales.includes(baseLocale) ? baseLocale : 'en';
  };

  const downloadReservationPDF = async (): Promise<void> => {
    if (!reservationDetails || !user) return;

    setIsDownloading(true);

    const currentLocale = getLocale(locale);
    const pdfDocument = <ConfirmationPDF reservationDetails={reservationDetails} user={user} locale={currentLocale} />;
    const blob = await pdf(pdfDocument).toBlob();

    const link = document.createElement('a');
    const formattedNumber = reservationDetails.reservationNumber?.replace(/_/g, '-') || 'confirmation';

    link.href = URL.createObjectURL(blob);
    link.download = `Invoice-${formattedNumber}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setIsDownloading(false);
  };

  return {
    downloadReservationPDF,
    isDownloading,
  };
};

export default useInvoiceDownload;
