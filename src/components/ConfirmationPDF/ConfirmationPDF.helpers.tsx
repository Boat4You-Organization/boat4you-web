import { JSX } from 'react';

import { Path, Svg, Text, View } from '@react-pdf/renderer';

import { PaymentPhase } from '@/models/reservation.model';
import { PriceInfo } from '@/types/price-info.type';
import DateTime from '@/utils/static/DateTime';
import { formatPrice } from '@/utils/static/formatNumber';

import { styles } from './ConfirmationPDF.styles';

export const LogoSVG = () => (
  <Svg width={72} height={25} viewBox="0 0 72 25">
    <Path d="M0 0h72v25H0z" fill="#141857" />
    <Path
      d="M8.098 13.263a4.468 4.468 0 0 1-.097-.839 4.54 4.54 0 0 1 .678-2.47 5.074 5.074 0 0 1 1.947-1.813 5.64 5.64 0 0 1 2.679-.655c.94.005 1.862.24 2.67.683A5.06 5.06 0 0 1 17.901 10c.452.758.676 1.613.647 2.477a4.47 4.47 0 0 1-.107.837 4.63 4.63 0 0 1-.701 1.6l-1.54-.892a3 3 0 0 0 .529-1.595 2.97 2.97 0 0 0-.424-1.622 3.313 3.313 0 0 0-1.261-1.2 3.689 3.689 0 0 0-1.75-.448 3.694 3.694 0 0 0-1.754.43 3.323 3.323 0 0 0-1.275 1.187 2.973 2.973 0 0 0-.444 1.618 2.99 2.99 0 0 0 .51 1.6l-1.551.876a4.621 4.621 0 0 1-.682-1.606Z"
      fill="#8EB2FF"
      fillRule="evenodd"
    />
    <Path
      d="m13.276 13.057 4.626 2.778c.447.27.58.831.297 1.256-.284.425-.876.55-1.324.282l-3.6-2.162-3.599 2.162a.99.99 0 0 1-1.324-.282.883.883 0 0 1 .297-1.256l4.627-2.778Zm8.919-3.982v6.84h.97l.047-.79c.159.237.355.432.59.585.337.214.732.322 1.185.322.482 0 .906-.108 1.272-.322.367-.216.65-.515.852-.9.208-.384.312-.83.312-1.338 0-.514-.104-.96-.312-1.338a2.205 2.205 0 0 0-.852-.9 2.474 2.474 0 0 0-1.272-.322c-.453 0-.848.108-1.186.323a2.04 2.04 0 0 0-.582.574V9.075h-1.024Zm1.024 4.397c0 .339.065.638.194.899.13.254.31.456.54.606.23.143.492.215.786.215.324 0 .607-.072.852-.215a1.57 1.57 0 0 0 .571-.606c.144-.26.216-.56.216-.899a1.85 1.85 0 0 0-.205-.89 1.485 1.485 0 0 0-.571-.605 1.596 1.596 0 0 0-.852-.225 1.462 1.462 0 0 0-1.337.83 1.984 1.984 0 0 0-.194.89Zm22.33.87v1.573h1.023v-1.573h1.477v-.85h-1.477V9.075h-1.1l-3.405 4.514v.753h3.481Zm0-.85H43.23l2.317-3.078v3.078Zm8.953 2.217c.41.216.884.323 1.423.323.525 0 .988-.107 1.39-.322.41-.222.73-.525.96-.91.23-.384.345-.826.345-1.328 0-.502-.115-.944-.345-1.329a2.384 2.384 0 0 0-.96-.899c-.41-.221-.88-.332-1.411-.332-.532 0-1.003.11-1.413.332a2.38 2.38 0 0 0-.959.9c-.23.384-.345.826-.345 1.328 0 .502.115.944.345 1.329.237.384.56.687.97.909Zm2.285-.742a1.711 1.711 0 0 1-.862.215 1.8 1.8 0 0 1-.884-.215 1.601 1.601 0 0 1-.603-.606 1.774 1.774 0 0 1-.216-.889c0-.339.072-.635.215-.89.144-.253.342-.452.593-.595.252-.15.543-.225.873-.225.324 0 .615.075.874.225.258.143.456.342.592.596.144.254.216.55.216.89 0 .338-.072.634-.216.888a1.54 1.54 0 0 1-.582.606Zm6.184.24.05.708h.949V11.03h-1.013v2.54c0 .508-.122.902-.367 1.182-.244.28-.585.42-1.024.42a1.74 1.74 0 0 1-.679-.146.983.983 0 0 1-.474-.489c-.108-.234-.162-.57-.162-1.006v-2.502h-1.024v2.747c0 .528.083.957.248 1.29.172.332.413.576.722.732.316.157.683.235 1.1.235.445 0 .823-.098 1.132-.293.215-.137.396-.314.541-.533Zm-13.954 2.78c-.158 0-.334-.027-.528-.08a4.892 4.892 0 0 1-.582-.204l.377-.762c.158.065.295.114.41.146.122.033.219.049.29.049.18 0 .331-.046.454-.137a.975.975 0 0 0 .312-.38l.337-.721-2.353-4.868h1.09l1.751 3.807 1.72-3.807h1.099l-2.555 5.49c-.137.3-.28.56-.431.782a1.55 1.55 0 0 1-.56.508c-.216.117-.493.176-.83.176Zm-8.077-1.955c-.54 0-.956-.124-1.25-.371-.295-.254-.443-.616-.443-1.085v-2.745h-.916v-.802h.916V9.505h1.024v1.524h1.53v.802h-1.53v2.608c0 .241.065.427.194.557.137.124.33.186.582.186a.806.806 0 0 0 .238-.04c.086-.025.19-.077.312-.155l.388.723c-.187.11-.366.192-.539.244a1.675 1.675 0 0 1-.506.078Zm-3.807-.758.032.64h.95l.01-2.657c.007-.508-.076-.935-.248-1.28a1.724 1.724 0 0 0-.755-.791c-.337-.183-.761-.274-1.272-.274a2.69 2.69 0 0 0-.959.156 2.064 2.064 0 0 0-.7.41 2.36 2.36 0 0 0-.486.587l.906.313a1.3 1.3 0 0 1 .507-.489 1.62 1.62 0 0 1 .732-.156c.302 0 .543.062.723.186.187.123.323.306.41.547.058.152.099.328.12.527h-1.447c-.66 0-1.178.134-1.552.4-.366.261-.55.643-.55 1.144 0 .469.176.837.529 1.104.359.26.858.39 1.498.39s1.114-.191 1.423-.575c.046-.058.09-.118.129-.182Zm-.01-1.548h-1.186c-.496 0-.845.072-1.046.215a.658.658 0 0 0-.302.576.62.62 0 0 0 .28.538c.195.124.46.186.798.186.295 0 .55-.056.765-.167a1.29 1.29 0 0 0 .507-.488c.122-.209.183-.446.183-.713v-.147Zm-6.529 2.306c-.539 0-1.013-.107-1.423-.322a2.532 2.532 0 0 1-.97-.91 2.539 2.539 0 0 1-.345-1.328c0-.502.115-.944.345-1.329.23-.384.55-.684.96-.899.41-.221.88-.332 1.412-.332.531 0 1.002.11 1.412.332.41.215.729.515.959.9.23.384.345.826.345 1.328 0 .502-.115.944-.345 1.329-.23.384-.55.687-.96.909-.402.214-.865.322-1.39.322Zm0-.85c.323 0 .61-.072.862-.215a1.54 1.54 0 0 0 .582-.606c.144-.254.216-.55.216-.889 0-.339-.072-.635-.215-.89a1.46 1.46 0 0 0-.593-.595 1.71 1.71 0 0 0-.873-.225c-.331 0-.622.075-.874.225a1.548 1.548 0 0 0-.592.596c-.144.254-.216.55-.216.89 0 .338.072.634.216.888.143.254.345.456.603.606.259.143.553.215.884.215Z"
      fill="#fff"
      fillRule="evenodd"
    />
  </Svg>
);

export const LineDivider = () => <View style={styles.lineDivider} />;

export const DoubleLineDivider = () => (
  <View style={styles.doubleDivider}>
    <View style={styles.lineDividerThin} />
    <View style={styles.lineDividerThin} />
  </View>
);

export const renderHeader = ({
  companyName,
  companyAddress,
  companyOib,
  companyIban,
  reservationNumber,
  reservationNumberLabel,
  statusLabel,
  status,
}: {
  companyName: string;
  companyAddress: string;
  companyOib: string;
  companyIban: string;
  reservationNumber: string;
  reservationNumberLabel: string;
  statusLabel: string;
  status: string;
}): JSX.Element => (
  <View style={styles.header}>
    <View style={styles.leftColumn}>
      <LogoSVG />
      <View style={styles.companyInfo}>
        <Text style={styles.companyText}>{companyName}</Text>
        <Text style={styles.companyText}>{companyAddress}</Text>
        <Text style={styles.companyText}>OIB: {companyOib}</Text>
        <Text style={styles.companyText}>IBAN: {companyIban}</Text>
      </View>
    </View>

    <View style={styles.rightColumn}>
      <View style={styles.invoiceBox}>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>{reservationNumberLabel}</Text>
          <Text style={styles.invoiceValue}>{reservationNumber || '-'}</Text>
        </View>
        <View style={styles.invoiceRow}>
          <Text style={styles.invoiceLabel}>{statusLabel}</Text>
          <Text style={styles.invoiceValue}>{status}</Text>
        </View>
      </View>
    </View>
  </View>
);

export const renderBuyerSection = ({
  title,
  email,
  name,
}: {
  title: string;
  email: string;
  name: string;
}): JSX.Element => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.companyText}>{name}</Text>
    <Text style={styles.companyText}>{email}</Text>
  </View>
);

export const renderReservationTitle = ({
  title,
  reservationId,
}: {
  title: string;
  reservationId: number | string;
}): JSX.Element => (
  <View style={styles.invoiceTitleSection}>
    <Text style={styles.invoiceTitle}>
      {title} {`#${reservationId}` || '-'}
    </Text>
  </View>
);

export const renderServicesTable = ({
  title,
  locale,
  boatNameLabel,
  boatName,
  pickUpLabel,
  pickUp,
  dateFromLabel,
  dateFrom,
  dateToLabel,
  dateTo,
  specialRequestLabel,
  specialRequest,
}: {
  title: string;
  locale: string;
  boatNameLabel: string;
  boatName: string;
  pickUpLabel: string;
  pickUp: string;
  dateFromLabel: string;
  dateFrom: string;
  dateToLabel: string;
  dateTo: string;
  specialRequestLabel?: string;
  specialRequest?: string;
}): JSX.Element => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell]}>{title}</Text>
    </View>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnLabel]}>{boatNameLabel}</Text>
      <Text style={[styles.tableCell, styles.columnValue]}>{boatName}</Text>
    </View>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnLabel]}>{pickUpLabel}</Text>
      <Text style={[styles.tableCell, styles.columnValue]}>{pickUp}</Text>
    </View>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnLabel]}>{dateFromLabel}</Text>
      <Text style={[styles.tableCell, styles.columnValue]}>{DateTime.formatLong(DateTime.date(dateFrom), locale)}</Text>
    </View>
    <View style={[styles.tableRow, specialRequest ? {} : styles.lastTableRow]}>
      <Text style={[styles.tableCell, styles.columnLabel]}>{dateToLabel}</Text>
      <Text style={[styles.tableCell, styles.columnValue]}>{DateTime.formatLong(DateTime.date(dateTo), locale)}</Text>
    </View>
    {specialRequest && (
      <View style={[styles.tableRow, styles.lastTableRow]}>
        <Text style={[styles.tableCell, styles.columnLabel]}>{specialRequestLabel}</Text>
        <Text style={[styles.tableCell, styles.columnValue]}>{specialRequest}</Text>
      </View>
    )}
  </View>
);

export const renderSummary = ({
  totalLabel,
  totalPrice,
  priceBreakdown,
  currency,
  installmentsInfo,
}: {
  totalLabel: string;
  totalPrice: string;
  priceBreakdown: string;
  currency: string;
  installmentsInfo?: { label: string; value: string };
}): JSX.Element => (
  <View>
    <DoubleLineDivider />
    <View style={styles.summarySection}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel} />
        <Text style={styles.summaryValue}>{priceBreakdown}</Text>
      </View>
      {installmentsInfo && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{installmentsInfo.label}</Text>
          <Text style={styles.summaryValue}>{installmentsInfo.value}</Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{totalLabel}</Text>
        <Text style={styles.summaryValue}>
          {totalPrice} {currency}
        </Text>
      </View>
    </View>
  </View>
);

export const renderPaymentSection = ({
  deliveryDateLabel,
  deliveryDate,
}: {
  deliveryDateLabel: string;
  deliveryDate: string;
}): JSX.Element => (
  <View style={styles.paymentSection}>
    <View style={styles.paymentRow}>
      <View style={styles.paymentColumn}>
        <Text style={styles.paymentTitle}>{deliveryDateLabel}</Text>
        <Text style={styles.paymentText}>{deliveryDate}</Text>
      </View>
    </View>
  </View>
);

export const renderPaymentPhasesTable = ({
  title,
  locale,
  paymentPhases,
  totalPriceEur,
  totalPriceInfo,
  currency,
  translations,
}: {
  title: string;
  locale: string;
  paymentPhases: PaymentPhase[];
  totalPriceEur: number;
  totalPriceInfo: PriceInfo | undefined;
  currency: string;
  translations: {
    installment: string;
    deadline: string;
    amount: string;
    paid: string;
    pending: string;
    paidInstallments: string;
  };
}): JSX.Element => {
  const formatPhaseAmount = (phaseAmount: number): string => {
    if (totalPriceInfo && currency in totalPriceInfo) {
      const priceInfoRecord = totalPriceInfo as unknown as Record<string, number>;
      const convertedAmount = (phaseAmount / totalPriceEur) * priceInfoRecord[currency];

      return `${formatPrice(convertedAmount)} ${currency}`;
    }

    return `${formatPrice(phaseAmount)} EUR`;
  };

  return (
    <View style={[styles.table, { marginTop: 16 }]}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell]}>{title}</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.columnLabel, { width: '25%' }]}>{translations.installment}</Text>
        <Text style={[styles.tableCell, styles.columnLabel, { width: '30%' }]}>{translations.deadline}</Text>
        <Text style={[styles.tableCell, styles.columnLabel, { width: '25%' }]}>{translations.amount}</Text>
        <Text style={[styles.tableCell, styles.columnLabel, { width: '20%' }]}>Status</Text>
      </View>
      {paymentPhases.map((phase, index) => {
        const isPaid = phase.paidOn && phase.paidOn.trim() !== '';
        const formattedDeadline = DateTime.formatLong(DateTime.date(phase.deadline), locale);
        const formattedAmount = formatPhaseAmount(phase.amount);
        const isLastPhase = index === paymentPhases.length - 1;

        return (
          <View key={phase.id} style={isLastPhase ? { ...styles.tableRow, borderBottom: 'none' } : styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>
              {translations.installment} {index + 1}
            </Text>
            <Text style={[styles.tableCell, { width: '30%' }]}>{formattedDeadline}</Text>
            <Text style={[styles.tableCell, { width: '25%' }]}>{formattedAmount}</Text>
            <Text style={[styles.tableCell, { width: '20%', fontWeight: 700 }]}>
              {isPaid ? translations.paid : translations.pending}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export const renderFooter = ({ text }: { text: string }): JSX.Element => (
  <View style={styles.footer}>
    {text.split('\n').map((line, index) => (
      <Text key={`${index + 1}`} style={styles.footerText}>
        {line}
      </Text>
    ))}
  </View>
);
