import React from 'react';

import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

/**
 * PDF for the tailor-made itinerary builder (Mario 7.8.2026): the
 * visitor's own day-by-day plan, our branding, a schematic course map
 * (canvas-drawn by the hook — custom routes have no pre-rendered map)
 * and per-day copy pulled from the curated route day that sails the
 * same hop, when one exists.
 */

export interface CustomPdfDay {
  day: number;
  from: string;
  to: string;
  nm: number;
  blurb: string;
}

export interface CustomPdfData {
  title: string;
  subtitle: string;
  startLabel: string;
  totalNm: number;
  days: CustomPdfDay[];
  /** i18n chrome, resolved by the caller. */
  labels: { day: string; total: string; disclaimer: string; site: string };
}

const navy = '#141857';
const blue = '#2856ff';

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', fontSize: 10, color: navy, padding: 36, paddingBottom: 52 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { width: 110 },
  title: { fontSize: 19, fontWeight: 700, marginBottom: 2 },
  subtitle: { fontSize: 10.5, color: '#3c4257', marginBottom: 12 },
  map: { width: '100%', height: 250, borderRadius: 8, marginBottom: 14 },
  dayRow: {
    flexDirection: 'row',
    marginBottom: 9,
    paddingBottom: 8,
    borderBottomWidth: 0.7,
    borderBottomColor: '#e2e6f0',
  },
  dayBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: blue,
    color: '#fff',
    fontWeight: 700,
    fontSize: 11,
    textAlign: 'center',
    paddingTop: 8,
    marginRight: 10,
    flexShrink: 0,
  },
  dayBody: { flex: 1 },
  dayHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  dayRoute: { fontSize: 11.5, fontWeight: 600, flexShrink: 1, paddingRight: 8 },
  dayNm: { fontSize: 10, color: blue, fontWeight: 600, flexShrink: 0 },
  blurb: { fontSize: 9.5, lineHeight: 1.45, color: '#3c4257' },
  totals: { marginTop: 10, fontSize: 11, fontWeight: 700 },
  disclaimer: { marginTop: 8, fontSize: 8.5, color: '#6b7280', lineHeight: 1.4 },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: '#6b7280',
  },
});

interface Props {
  data: CustomPdfData;
  /** Schematic course map as a data-URL (hook-generated JPEG). */
  mapSrc: string;
  baseUrl: string;
}

const CustomItineraryPDF = ({ data, mapSrc, baseUrl }: Props) => (
  <Document title={data.title}>
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <Image src={`${baseUrl}/images/pdf-logo.png`} style={styles.logo} />
        <Text style={{ fontSize: 9, color: '#6b7280' }}>{data.labels.site}</Text>
      </View>
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.subtitle}>{data.subtitle}</Text>
      <Image src={mapSrc} style={styles.map} />
      {data.days.map(d => (
        <View key={d.day} style={styles.dayRow} wrap={false}>
          <Text style={styles.dayBadge}>{d.day}</Text>
          <View style={styles.dayBody}>
            <View style={styles.dayHead}>
              <Text style={styles.dayRoute}>
                {data.labels.day} {d.day}: {d.from} – {d.to}
              </Text>
              <Text style={styles.dayNm}>~{d.nm} NM</Text>
            </View>
            {d.blurb ? <Text style={styles.blurb}>{d.blurb}</Text> : null}
          </View>
        </View>
      ))}
      <Text style={styles.totals}>
        {data.labels.total}: ~{data.totalNm} NM · {data.days.length} × 24h
      </Text>
      <Text style={styles.disclaimer}>{data.labels.disclaimer}</Text>
      <View style={styles.footer} fixed>
        <Text>www.boat4you.com</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default CustomItineraryPDF;
