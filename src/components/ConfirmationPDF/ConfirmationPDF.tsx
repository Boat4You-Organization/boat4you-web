import { Document, Page } from '@react-pdf/renderer';

import { LocaleType } from '@/config/locales.config';
import { Locale, i18n } from '@/i18nPdf';
import { ReservationDetails, ReservationStatus } from '@/models/reservation.model';
import { UserModel } from '@/models/user.model';
import DateTime from '@/utils/static/DateTime';
import { formatPrice } from '@/utils/static/formatNumber';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';

import {
  renderBuyerSection,
  renderFooter,
  renderHeader,
  renderPaymentPhasesTable,
  renderReservationTitle,
  renderServicesTable,
  renderSummary,
} from './ConfirmationPDF.helpers';
import { styles } from './ConfirmationPDF.styles';

interface ConfirmationPDFProps {
  reservationDetails: ReservationDetails;
  user: UserModel;
  locale: LocaleType;
}

const getStatusTranslation = (status: ReservationStatus, locale: Locale): string => {
  const translations = i18n[locale];

  switch (status) {
    case ReservationStatus.UNKNOWN:
      return translations.statusUnknown;
    case ReservationStatus.OPTION:
      return translations.statusOption;
    case ReservationStatus.RESERVATION:
      return translations.statusReservation;
    case ReservationStatus.SERVICE:
      return translations.statusService;
    case ReservationStatus.FREE:
      return translations.statusFree;
    default:
      return translations.statusUnknown;
  }
};

const getPluralizedDays = (count: number, locale: Locale): string => {
  const translations = i18n[locale];

  if (locale === 'hr') {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return translations.days;
    }

    if (lastDigit === 1) {
      return translations.day;
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return translations.days;
    }

    return translations.days;
  }

  return count === 1 ? translations.day : translations.days;
};

const ConfirmationPDF = ({ reservationDetails, user, locale }: ConfirmationPDFProps) => {
  const { name, surname, email, currency } = user;
  const {
    reservationId,
    reservationNumber,
    totalPrice,
    modelName,
    yachtName,
    locationFrom,
    status,
    dateFrom,
    dateTo,
    clientPricePerDayEur,
    clientPricePerDayInfo,
    paymentPhases,
    totalPriceInfo,
    specialRequest,
  } = reservationDetails || {};

  const numberOfDays = DateTime.daysBetween(DateTime.date(dateFrom), DateTime.date(dateTo));
  const t = i18n[locale as Locale];
  const computedPricePerDayEur = numberOfDays > 0 ? totalPrice / numberOfDays : clientPricePerDayEur;
  const computedPricePerDayInfo =
    totalPriceInfo && numberOfDays > 0
      ? { ...totalPriceInfo, amount: totalPriceInfo.amount / numberOfDays }
      : clientPricePerDayInfo;

  const formattedClientPricePerDay = formatPriceWithCurrency({
    clientPriceEur: computedPricePerDayEur,
    clientPriceInfo: computedPricePerDayInfo,
    locale,
  });

  const installmentsInfo =
    paymentPhases && paymentPhases.length > 1
      ? (() => {
          const paidCount = paymentPhases.filter(phase => phase.paidOn && phase.paidOn.trim() !== '').length;

          return {
            label: t.paidInstallments,
            value: `${paidCount}/${paymentPhases.length}`,
          };
        })()
      : undefined;

  return (
    <Document title={`Invoice-${reservationId}`}>
      <Page size="A4" style={styles.page}>
        {renderHeader({
          companyName: 'Cusmanich d.o.o.',
          companyAddress: 'Vrboran 37, HR-21000 Split',
          companyOib: '87394862517',
          companyIban: 'HR3924020061101202108',
          reservationNumber: reservationNumber || '',
          reservationNumberLabel: t.reservationNumber,
          statusLabel: t.status,
          status: getStatusTranslation(status, locale as Locale),
        })}
        {renderBuyerSection({
          title: t.customer,
          email,
          name: `${name} ${surname}`,
        })}
        {renderReservationTitle({ title: t.bookingReference, reservationId: reservationId || '' })}
        {renderServicesTable({
          title: t.details,
          locale,
          boatNameLabel: t.boatNameLabel,
          boatName: `${modelName} | ${yachtName}`,
          pickUpLabel: t.pickUp,
          pickUp: locationFrom,
          dateFromLabel: t.dateFromLabel,
          dateFrom,
          dateToLabel: t.dateToLabel,
          dateTo,
          specialRequestLabel: t.specialRequest,
          specialRequest,
        })}
        {paymentPhases &&
          paymentPhases.length > 1 &&
          renderPaymentPhasesTable({
            title: t.paymentSchedule,
            locale,
            paymentPhases,
            totalPriceEur: totalPrice,
            totalPriceInfo,
            currency,
            translations: {
              installment: t.installment,
              deadline: t.deadline,
              amount: t.amount,
              paid: t.paid,
              pending: t.pending,
              paidInstallments: t.paidInstallments,
            },
          })}
        {renderSummary({
          totalLabel: t.total,
          totalPrice: `${formatPrice(totalPrice)}`,
          priceBreakdown: `${formattedClientPricePerDay} x ${numberOfDays} ${getPluralizedDays(numberOfDays, locale as Locale)}`,
          currency,
          installmentsInfo,
        })}
        {renderFooter({
          text: t.footer,
        })}
      </Page>
    </Document>
  );
};

export default ConfirmationPDF;
