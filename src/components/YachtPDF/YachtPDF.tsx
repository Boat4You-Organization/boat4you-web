import { Document, Image, Link, Page, Text, View } from '@react-pdf/renderer';

import { YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtModel } from '@/models/yacht.model';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { toTitleCase } from '@/utils/static/toTitleCase';

import { styles } from './YachtPDF.styles';

/**
 * Client-shareable yacht presentation PDF (2×A4) — generated fully in the
 * browser via @react-pdf (same pattern as ConfirmationPDF), so the
 * freeze-prone cusma1 box does zero PDF work. Design approved by Mario
 * 10.7.2026 (prototype: SOL MADININA / GOLDEN WATERS).
 *
 * Price rules honoured: headline is ALWAYS the total for the period (never
 * per-day) and is displayed from clientPriceInfo (the user's currency),
 * falling back to EUR. Without selected dates the card shows the lowest
 * FREE weekly rate from the next-12-months offers ("from …").
 */
interface YachtPDFProps {
  yacht: YachtModel;
  /** The user's selected offer (dated view) — null renders the season card. */
  offer: YachtOfferModel | null;
  /** Boat page URL; carries the selected dates when present. */
  pageUrl: string;
  /** Hero photo as a JPEG data-URL — the image API serves only WEBP, which
   *  @react-pdf can't decode, so the hook converts via canvas up front. */
  heroSrc: string;
  /** Up to 4 gallery photos, same JPEG data-URL treatment. */
  gallerySrcs: string[];
  /** QR png data-URL pointing at the clean (dateless) boat page URL. */
  qrDataUrl: string;
  /** window.location.origin — react-pdf needs absolute asset URLs. */
  baseUrl: string;
  /** Pre-formatted generation date, e.g. "10 July 2026". */
  generatedDate: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatDateRange = (dateFrom: string, dateTo: string): string => {
  const a = new Date(dateFrom);
  const b = new Date(dateTo);

  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} – ${b.getDate()} ${MONTHS[a.getMonth()]} ${a.getFullYear()}`;
  }

  return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
};

const nightsBetween = (dateFrom: string, dateTo: string): number =>
  Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000);

const COUNTRY_NAMES: Record<string, string> = {
  BS: 'Bahamas',
  ES: 'Spain',
  FR: 'France',
  GD: 'Grenada',
  GR: 'Greece',
  HR: 'Croatia',
  IT: 'Italy',
  ME: 'Montenegro',
  MQ: 'Martinique',
  SC: 'Seychelles',
  TR: 'Türkiye',
  VG: 'British Virgin Islands',
};

const VESSEL_LABEL: Record<string, string> = {
  CATAMARAN: 'Catamaran',
  POWER_CATAMARAN: 'Power Catamaran',
  SAILING_BOAT: 'Sailing Yacht',
  MOTOR_BOAT: 'Motor Yacht',
  GULET: 'Gulet',
};

const YachtPDF = ({
  yacht,
  offer,
  pageUrl,
  heroSrc,
  gallerySrcs,
  qrDataUrl,
  baseUrl,
  generatedDate,
}: YachtPDFProps) => {
  const name = toTitleCase(yacht.name).toUpperCase();
  const modelLine = [yacht.model, yacht.buildYear].filter(Boolean).join('  ·  ');
  const isCrewed = Boolean(yacht.crewNumber);
  const vessel = VESSEL_LABEL[yacht.vesselType] || 'Yacht';
  const countryCode = yacht.location?.countryCode || '';
  const country = COUNTRY_NAMES[countryCode] || countryCode;
  const kicker = [isCrewed ? 'Crewed' : 'Bareboat', vessel, country].filter(Boolean).join('  ·  ');
  const baseName = (yacht.location?.name || '').replace('|', '·');
  const guests = yacht.maxPersons || yacht.berths;

  // Dateless card: cheapest still-FREE weekly slot from the 12-month offers
  // the detail endpoint already returns.
  const freeOffers = (yacht.offers || []).filter(o => o.status === 'FREE' && o.clientPriceEur > 0);
  const cheapest = freeOffers.length
    ? freeOffers.reduce((min, o) => (o.clientPriceEur < min.clientPriceEur ? o : min))
    : null;

  const priceOf = (o: YachtOfferModel): string =>
    formatPriceWithCurrency({ clientPriceEur: o.clientPriceEur, clientPriceInfo: o.clientPriceInfo });

  const stats: Array<{ value: string; unit?: string; label: string }> = [
    { value: yacht.length ? yacht.length.toFixed(1) : '—', unit: yacht.length ? ' m' : '', label: 'LENGTH' },
    { value: yacht.beam ? yacht.beam.toFixed(1) : '—', unit: yacht.beam ? ' m' : '', label: 'BEAM' },
    { value: String(guests), label: 'GUESTS' },
    { value: String(yacht.cabins), label: 'CABINS' },
    { value: String(yacht.wc), label: 'BATHROOMS' },
    isCrewed ? { value: String(yacht.crewNumber), label: 'CREW' } : { value: String(yacht.buildYear), label: 'YEAR' },
  ];

  const specRows: Array<[string, string]> = [
    ['Model', yacht.model],
    ['Year', String(yacht.buildYear)],
    ['Length', `${yacht.length} m`],
  ];

  if (yacht.beam) specRows.push(['Beam', `${yacht.beam} m`]);

  specRows.push(['Cabins', String(yacht.cabins)], ['Berths', String(yacht.berths)], ['Bathrooms', String(yacht.wc)]);

  if (isCrewed) specRows.push(['Professional crew', String(yacht.crewNumber)]);

  if (yacht.mainSailType && yacht.mainSailType !== 'UNKNOWN') {
    specRows.push([
      'Mainsail',
      yacht.mainSailType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase()),
    ]);
  }

  if (yacht.enginePower) specRows.push(['Engine power', `${yacht.enginePower} HP`]);

  if (yacht.fuelTank) specRows.push(['Fuel tank', `${yacht.fuelTank.toLocaleString('en-US')} L`]);

  if (yacht.waterTank) specRows.push(['Water tank', `${yacht.waterTank.toLocaleString('en-US')} L`]);

  if (yacht.securityDeposit) {
    const depositFmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: yacht.depositCurrency || 'EUR',
      maximumFractionDigits: 0,
    }).format(yacht.securityDeposit);

    specRows.push(['Security deposit', depositFmt]);
  }

  if (yacht.defaultCheckin) {
    specRows.push(['Check-in / Check-out', `${yacht.defaultCheckin} / ${yacht.defaultCheckout}`]);
  }

  const amenities = (yacht.amenities || [])
    .map(a => a.name)
    .filter(Boolean)
    .slice(0, 9);

  const renderPriceCard = () => {
    if (offer) {
      const isFree = offer.status === 'FREE';
      let badgeLabel = 'CURRENTLY UNDER OPTION — INQUIRE';

      if (yacht.inquireOnly) badgeLabel = 'AVAILABLE ON REQUEST';
      else if (isFree) badgeLabel = 'AVAILABLE FOR THESE DATES';

      return (
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>SELECTED DATES</Text>
            <Text style={styles.priceDates}>{formatDateRange(offer.dateFrom, offer.dateTo)}</Text>
            <Text style={styles.priceSub}>
              {nightsBetween(offer.dateFrom, offer.dateTo)} nights · from {baseName}
            </Text>
            <View style={[styles.badge, !yacht.inquireOnly && isFree ? styles.badgeGreen : {}]}>
              <Text style={styles.badgeText}>{badgeLabel}</Text>
            </View>
          </View>
          <View style={styles.priceAmountWrap}>
            <Text style={styles.priceAmount}>{priceOf(offer)}</Text>
            <Text style={styles.pricePer}>total for the period · {isCrewed ? 'crewed' : 'bareboat'} charter</Text>
            {!yacht.inquireOnly && isFree && (
              <Text style={styles.pricePer}>✓ Free cancellation within 72 h of booking</Text>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.priceCard}>
        <View>
          <Text style={styles.priceLabel}>WEEKLY CHARTER RATES</Text>
          <Text style={styles.priceDates}>
            Season {new Date().getFullYear()} / {new Date().getFullYear() + 1}
          </Text>
          <Text style={styles.priceSub}>Departures from {baseName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CHOOSE YOUR DATES ONLINE</Text>
          </View>
        </View>
        <View style={styles.priceAmountWrap}>
          <Text style={styles.priceAmount}>{cheapest ? `from ${priceOf(cheapest)}` : 'On request'}</Text>
          <Text style={styles.pricePer}>per week · {isCrewed ? 'crewed' : 'bareboat'} charter</Text>
        </View>
      </View>
    );
  };

  return (
    <Document title={`${toTitleCase(yacht.name)} — Boat4You`} author="Boat4You">
      {/* PAGE 1 — cover */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar}>
          {/* Full-colour logo (public/images/pdf-logo.png, rasterised from
              SvgIcons/Logo) — the emails PNG is white and would vanish on
              this light band. */}
          <Image src={`${baseUrl}/images/pdf-logo.png`} style={styles.logo} />
          <Text style={styles.topSite}>WWW.BOAT4YOU.COM</Text>
        </View>

        <View style={styles.hero}>
          <Image src={heroSrc} style={styles.heroImage} />
          <View style={styles.heroCaption}>
            <Text style={styles.heroKicker}>{kicker.toUpperCase()}</Text>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src={pageUrl} style={styles.heroNameLink}>
              <Text style={styles.heroName}>{name}</Text>
            </Link>
            <Text style={styles.heroModel}>{modelLine}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>
                {s.value}
                {s.unit ? <Text style={styles.statUnit}>{s.unit}</Text> : null}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {renderPriceCard()}

        <View style={styles.trustRow}>
          <View style={styles.trust}>
            <Text style={styles.trustText}>Live availability & verified partner fleets</Text>
          </View>
          <View style={styles.trust}>
            <Text style={styles.trustText}>Personal charter support, 7 days a week</Text>
          </View>
          <View style={styles.trust}>
            <Text style={styles.trustText}>Trusted by sailors across Europe</Text>
          </View>
        </View>

        <View style={styles.footerLine}>
          <Text>Boat4You — Yacht charter & boat rental</Text>
          <Text>Page 1 / 2</Text>
        </View>
      </Page>

      {/* PAGE 2 — gallery, specs, amenities */}
      <Page size="A4" style={styles.page}>
        <View style={styles.page2Body}>
          <View style={styles.gallery}>
            {gallerySrcs.map(src => (
              <Image key={src.slice(-24)} src={src} style={styles.galleryImage} />
            ))}
          </View>

          <View style={styles.columns}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>SPECIFICATIONS</Text>
              {specRows.map(([label, value]) => (
                <View key={label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{label}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.column}>
              {amenities.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>AMENITIES</Text>
                  <View style={styles.chips}>
                    {amenities.map(a => (
                      <View key={a} style={styles.chip}>
                        <Text style={styles.chipText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
              <View style={styles.baseBox}>
                <Text style={styles.baseTitle}>Departure base</Text>
                <Text style={styles.baseText}>
                  {baseName}
                  {country ? `, ${country}` : ''}
                </Text>
                <Text style={styles.baseNote}>Same-port return · One-way on request</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footBand}>
          <Image src={qrDataUrl} style={styles.qr} />
          <View style={styles.footTextWrap}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src={pageUrl} style={styles.footTitleLink}>
              <Text style={styles.footTitle}>See live availability & all {yacht.yachtImages.length} photos</Text>
            </Link>
            <Text style={styles.footSub}>
              Scan the code or click the yacht name — dates, pricing and{'\n'}
              {yacht.inquireOnly ? 'instant inquiry' : 'instant booking'} for {toTitleCase(yacht.name)}.
            </Text>
          </View>
          <View style={styles.footRight}>
            <Image src={`${baseUrl}/images/emails/boat4you-logo-full.png`} style={styles.footLogo} />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src="https://www.boat4you.com" style={styles.footSiteLink}>
              <Text style={styles.footSite}>www.boat4you.com · Generated {generatedDate}</Text>
            </Link>
            <Text style={styles.footSite}>Prices & availability subject to change</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default YachtPDF;
