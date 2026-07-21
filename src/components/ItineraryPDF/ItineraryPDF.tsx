import { Document, Image, Link, Page, Text, View } from '@react-pdf/renderer';

import { styles } from './ItineraryPDF.styles';

/**
 * Client-shareable itinerary route PDF — generated fully in the browser
 * via @react-pdf (clone of the YachtPDF pattern), so cusma1 does zero
 * PDF work. Cover = route hero + static route map + day summary + QR;
 * following pages auto-flow 2-3 day cards each (wrap={false} keeps a
 * day from splitting across a page break).
 *
 * The document is built purely from a pre-resolved `ItineraryPdfData`:
 * the CALLER resolves all localized copy via the itineraryI18n helpers
 * (resolveRouteText/resolveDayText/resolveDayList) because the resolve
 * step needs the next-intl translations context, which doesn't exist
 * inside the detached @react-pdf render tree.
 */

export interface ItineraryPdfDay {
  day: number;
  from: string;
  to: string;
  description: string;
  thingsToDo: string[];
  mooringTip: string;
  /** Approx great-circle leg distance (itineraryDayStats); null = unmapped port. */
  distanceNm: number | null;
  /** Estimated hours at 5 kn (itineraryDayStats); null = unmapped port. */
  sailingHours: number | null;
}

export interface ItineraryPdfData {
  /** Config route id — also the PDF filename slug. */
  routeId: string;
  /** Resolved metaTitle-ish display name of the route. */
  routeName: string;
  areaName: string;
  country: string;
  /** Canonical route page URL (www.boat4you.com) — QR + link target. */
  url: string;
  days: ItineraryPdfDay[];
  /** Route card image path (local webp — hook converts via canvas). */
  cardImageSrc: string;
  /** Static route map path (local webp — hook converts via canvas). */
  mapImageSrc: string;
}

interface ItineraryPDFProps {
  data: ItineraryPdfData;
  /** Card image as a JPEG data-URL — the itinerary assets are WEBP,
   *  which @react-pdf can't decode, so the hook converts via canvas. */
  heroSrc: string;
  /** Static route map, same JPEG data-URL treatment. */
  mapSrc: string;
  /** QR png data-URL pointing at the route page URL. */
  qrDataUrl: string;
  /** window.location.origin — react-pdf needs absolute asset URLs. */
  baseUrl: string;
  /** Pre-formatted generation date, e.g. "21 July 2026". */
  generatedDate: string;
}

const ItineraryPDF = ({ data, heroSrc, mapSrc, qrDataUrl, baseUrl, generatedDate }: ItineraryPDFProps) => {
  const { routeName, areaName, country, url, days } = data;
  const numberOfDays = days.length;
  const kicker = [`${numberOfDays}-DAY SAILING ROUTE`, areaName.toUpperCase(), country.toUpperCase()].join('  ·  ');
  const startPoint = days[0]?.from || '';

  const totalNm = days.reduce((sum, d) => sum + (d.distanceNm ?? 0), 0);
  const totalHours = Math.round(days.reduce((sum, d) => sum + (d.sailingHours ?? 0), 0) * 10) / 10;

  const dayStatsLine = (d: ItineraryPdfDay): string | null => {
    if (d.distanceNm === null) return null;

    const hours = d.sailingHours !== null ? `  ·  ~${d.sailingHours} h at 5 kn` : '';

    return `${d.distanceNm} NM${hours}`;
  };

  return (
    <Document title={`${routeName} — Boat4You`} author="Boat4You">
      {/* PAGE 1 — cover: hero, static route map, day summary, QR band */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar}>
          {/* Full-colour logo (public/images/pdf-logo.png) — the emails PNG
              is white and would vanish on this light band. */}
          <Image src={`${baseUrl}/images/pdf-logo.png`} style={styles.logo} />
          <Text style={styles.topSite}>WWW.BOAT4YOU.COM</Text>
        </View>

        <View style={styles.hero}>
          <Image src={heroSrc} style={styles.heroImage} />
          <View style={styles.heroCaption}>
            <Text style={styles.heroKicker}>{kicker}</Text>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src={url} style={styles.heroNameLink}>
              <Text style={styles.heroName}>{routeName}</Text>
            </Link>
            <Text style={styles.heroSub}>Departing from {startPoint}</Text>
          </View>
        </View>

        <View style={styles.coverColumns}>
          <View style={styles.mapCard}>
            <Image src={mapSrc} style={styles.mapImage} />
          </View>
          <View style={styles.summaryColumn}>
            <Text style={styles.sectionTitle}>ROUTE SUMMARY</Text>
            {days.map(d => (
              <View key={d.day} style={styles.summaryRow}>
                <Text style={styles.summaryDay}>DAY {d.day}</Text>
                <Text style={styles.summaryLeg}>
                  {d.from} → {d.to}
                </Text>
              </View>
            ))}
            <View style={styles.totalsBox}>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>
                  {totalNm > 0 ? `≈ ${totalNm}` : '—'}
                  {totalNm > 0 ? <Text style={styles.totalUnit}> NM</Text> : null}
                </Text>
                <Text style={styles.totalLabel}>TOTAL DISTANCE</Text>
              </View>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>
                  {totalHours > 0 ? `≈ ${totalHours}` : '—'}
                  {totalHours > 0 ? <Text style={styles.totalUnit}> h</Text> : null}
                </Text>
                <Text style={styles.totalLabel}>SAILING AT 5 KN</Text>
              </View>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>{numberOfDays}</Text>
                <Text style={styles.totalLabel}>DAYS</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footBand}>
          <Image src={qrDataUrl} style={styles.qr} />
          <View style={styles.footTextWrap}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src={url} style={styles.footTitleLink}>
              <Text style={styles.footTitle}>Open this route online</Text>
            </Link>
            <Text style={styles.footSub}>
              Scan the code for the interactive day-by-day map, photos{'\n'}
              and boats bookable from {startPoint}.
            </Text>
          </View>
          <View style={styles.footRight}>
            <Image src={`${baseUrl}/images/emails/boat4you-logo-full.png`} style={styles.footLogo} />
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- react-pdf Link uses `src`, not a DOM anchor */}
            <Link src="https://www.boat4you.com" style={styles.footSiteLink}>
              <Text style={styles.footSite}>www.boat4you.com · Generated {generatedDate}</Text>
            </Link>
            <Text style={styles.footSite}>Distances are approximate planning estimates</Text>
          </View>
        </View>
      </Page>

      {/* PAGES 2+ — day cards auto-flow (2-3 per page), fixed footer */}
      <Page size="A4" style={[styles.page, styles.dayPage]}>
        <View style={styles.topBar} fixed>
          <Image src={`${baseUrl}/images/pdf-logo.png`} style={styles.logo} />
          <Text style={styles.topSite}>{routeName.toUpperCase()}</Text>
        </View>

        <View style={styles.dayBody}>
          {days.map(d => {
            const stats = dayStatsLine(d);

            return (
              <View key={d.day} style={styles.dayCard} wrap={false}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayBubble}>
                    <Text style={styles.dayBubbleText}>{d.day}</Text>
                  </View>
                  <Text style={styles.dayHeading}>
                    {d.from} → {d.to}
                  </Text>
                  {stats ? <Text style={styles.dayStats}>{stats}</Text> : null}
                </View>

                {d.description ? <Text style={styles.dayDescription}>{d.description}</Text> : null}

                {d.thingsToDo.length > 0 && (
                  <>
                    <Text style={styles.thingsTitle}>THINGS TO DO</Text>
                    <View style={styles.thingsList}>
                      {d.thingsToDo.map(item => (
                        <View key={item} style={styles.thingsRow}>
                          <Text style={styles.thingsBullet}>•</Text>
                          <Text style={styles.thingsText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {d.mooringTip ? (
                  <View style={styles.mooringBox}>
                    <Text style={styles.mooringTitle}>MOORING TIP</Text>
                    <Text style={styles.mooringText}>{d.mooringTip}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.pageFooter} fixed>
          <Image src={`${baseUrl}/images/pdf-logo.png`} style={styles.pageFooterLogo} />
          <Text style={styles.pageFooterSite}>WWW.BOAT4YOU.COM</Text>
          <Text
            style={styles.pageFooterPage}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

export default ItineraryPDF;
