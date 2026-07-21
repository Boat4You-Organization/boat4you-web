import { StyleSheet } from '@react-pdf/renderer';

/**
 * A4 @72dpi = 595×842pt. Same visual language as YachtPDF.styles —
 * palette mirrors the site theme (colors.ts blues): navy #141857,
 * accent #2856ff, light #eef3ff, ink #292929. Built-in Helvetica
 * family (regular/bold), no font registration.
 */
const NAVY = '#141857';
const ACCENT = '#2856ff';
const LIGHT = '#eef3ff';
const LINE = '#d9e4ff';
const INK = '#292929';
const MUTED = '#7a7f9a';
const SKY = '#8eb2ff';
const SKY_LIGHT = '#bcd0ff';

export const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', color: INK, backgroundColor: '#ffffff' },

  /* header — light band with the full-colour logo (same as YachtPDF) */
  topBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 15,
    paddingHorizontal: 37,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { height: 26, width: 102, objectFit: 'contain' },
  topSite: { fontSize: 9, letterSpacing: 1.6, color: MUTED, fontFamily: 'Helvetica-Bold' },

  /* cover hero — route card image with a navy caption band */
  hero: { marginHorizontal: 37, borderRadius: 14, overflow: 'hidden', height: 215, position: 'relative' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 24, 87, 0.72)',
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  heroKicker: { fontSize: 8, letterSpacing: 2.2, color: SKY_LIGHT, marginBottom: 4 },
  heroNameLink: { textDecoration: 'none' },
  heroName: { fontSize: 19, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  heroSub: { fontSize: 10, color: LINE, marginTop: 3 },

  /* cover body — static map on the left, day summary on the right */
  coverColumns: { flexDirection: 'row', gap: 16, marginHorizontal: 37, marginTop: 16, height: 360 },
  mapCard: {
    flex: 1.05,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: LIGHT,
  },
  mapImage: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' },
  summaryColumn: { flex: 1 },
  sectionTitle: { fontSize: 9.5, letterSpacing: 2, color: NAVY, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    paddingVertical: 3.6,
    borderBottomWidth: 0.7,
    borderBottomColor: '#e7e9f4',
  },
  summaryDay: { fontSize: 7.6, color: MUTED, fontFamily: 'Helvetica-Bold', width: 34, marginTop: 0.6 },
  summaryLeg: { fontSize: 8.6, color: NAVY, fontFamily: 'Helvetica-Bold', flex: 1 },

  /* totals box under the day summary */
  totalsBox: {
    marginTop: 12,
    backgroundColor: LIGHT,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    flexDirection: 'row',
    gap: 22,
  },
  totalCell: {},
  totalValue: { fontSize: 13.5, color: NAVY, fontFamily: 'Helvetica-Bold' },
  totalUnit: { fontSize: 8.5 },
  totalLabel: { fontSize: 6.8, letterSpacing: 0.8, color: MUTED, marginTop: 2.5 },

  /* cover foot band — navy, QR + link + logo (same as YachtPDF) */
  footBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NAVY,
    paddingVertical: 18,
    paddingHorizontal: 37,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  qr: { width: 62, height: 62, borderRadius: 6, backgroundColor: '#ffffff', padding: 4 },
  footTextWrap: { flexShrink: 1 },
  footTitleLink: { textDecoration: 'none' },
  footTitle: { fontSize: 11.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  footSub: { fontSize: 8.6, color: SKY_LIGHT, marginTop: 4, lineHeight: 1.45 },
  footRight: { marginLeft: 'auto', alignItems: 'flex-end' },
  footLogo: { height: 20, width: 79, objectFit: 'contain', marginBottom: 5 },
  footSiteLink: { textDecoration: 'none' },
  footSite: { fontSize: 8.6, color: SKY, textAlign: 'right', marginTop: 1 },

  /* day pages — auto-flow, 2-3 day cards per page */
  dayPage: { paddingTop: 0, paddingBottom: 64 },
  dayBody: { paddingHorizontal: 37 },
  dayCard: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 7 },
  dayBubble: {
    width: 21,
    height: 21,
    borderRadius: 99,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBubbleText: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  dayHeading: { fontSize: 12.5, fontFamily: 'Helvetica-Bold', color: NAVY, flexShrink: 1 },
  dayStats: { marginLeft: 'auto', fontSize: 8.4, color: MUTED, fontFamily: 'Helvetica-Bold' },
  dayDescription: { fontSize: 9.2, lineHeight: 1.55, color: INK },

  thingsTitle: { fontSize: 7.6, letterSpacing: 1.6, color: MUTED, fontFamily: 'Helvetica-Bold', marginTop: 9 },
  thingsList: { marginTop: 4.5 },
  thingsRow: { flexDirection: 'row', gap: 5, marginBottom: 2.5 },
  thingsBullet: { fontSize: 8.8, color: ACCENT },
  thingsText: { fontSize: 8.8, lineHeight: 1.4, color: INK, flex: 1 },

  mooringBox: {
    marginTop: 9,
    backgroundColor: LIGHT,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  mooringTitle: { fontSize: 7.6, letterSpacing: 1.6, color: NAVY, fontFamily: 'Helvetica-Bold' },
  mooringText: { fontSize: 8.8, lineHeight: 1.45, color: INK, marginTop: 3 },

  /* fixed footer on day pages — logo + site + page numbers */
  pageFooter: {
    position: 'absolute',
    left: 37,
    right: 37,
    bottom: 20,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageFooterLogo: { height: 14, width: 55, objectFit: 'contain' },
  pageFooterSite: { fontSize: 8, color: MUTED, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  pageFooterPage: { fontSize: 8, color: MUTED },
});
