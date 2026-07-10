import { StyleSheet } from '@react-pdf/renderer';

/**
 * A4 @72dpi = 595×842pt. Palette mirrors the site theme (colors.ts blues):
 * navy #141857, accent #2856ff, light #eef3ff, ink #292929. Built-in
 * Helvetica family (regular/bold) — no font registration needed, keeps the
 * client-side bundle small.
 */
const NAVY = '#141857';
const ACCENT = '#2856ff';
const GREEN = '#0e9f6e';
const LIGHT = '#eef3ff';
const LINE = '#d9e4ff';
const INK = '#292929';
const MUTED = '#7a7f9a';
const SKY = '#8eb2ff';
const SKY_LIGHT = '#bcd0ff';

export const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', color: INK, backgroundColor: '#ffffff' },

  /* header */
  topBar: {
    backgroundColor: NAVY,
    paddingVertical: 18,
    paddingHorizontal: 37,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  logo: { height: 25, width: 99, objectFit: 'contain' },
  topSite: { fontSize: 9.5, letterSpacing: 1.6, color: SKY, fontFamily: 'Helvetica-Bold' },

  /* hero */
  hero: { marginHorizontal: 37, borderRadius: 14, overflow: 'hidden', height: 370, position: 'relative' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 24, 87, 0.72)',
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  heroKicker: { fontSize: 8.5, letterSpacing: 2.4, color: SKY_LIGHT, marginBottom: 5 },
  heroNameLink: { textDecoration: 'none' },
  heroName: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  heroModel: { fontSize: 12, color: '#d9e4ff', marginTop: 4 },

  /* stats */
  statsRow: { flexDirection: 'row', gap: 8, marginHorizontal: 37, marginTop: 17 },
  stat: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 14.5, color: NAVY, fontFamily: 'Helvetica-Bold' },
  statUnit: { fontSize: 9 },
  statLabel: { fontSize: 7, letterSpacing: 0.8, color: MUTED, marginTop: 3 },

  /* price card */
  priceCard: {
    marginHorizontal: 37,
    marginTop: 20,
    backgroundColor: NAVY,
    borderRadius: 11,
    paddingVertical: 22,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: { fontSize: 8, letterSpacing: 1.8, color: SKY },
  priceDates: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 5 },
  priceSub: { fontSize: 9, color: SKY_LIGHT, marginTop: 4 },
  badge: {
    backgroundColor: ACCENT,
    borderRadius: 99,
    paddingVertical: 5,
    paddingHorizontal: 11,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  badgeGreen: { backgroundColor: GREEN },
  badgeText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff', letterSpacing: 0.8 },
  priceAmountWrap: { alignItems: 'flex-end' },
  priceAmount: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  pricePer: { fontSize: 8.5, color: SKY_LIGHT, marginTop: 4, textAlign: 'right' },

  /* trust strip */
  trustRow: { flexDirection: 'row', gap: 8, marginHorizontal: 37, marginTop: 20 },
  trust: {
    flex: 1,
    backgroundColor: LIGHT,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  trustText: { fontSize: 8.6, color: NAVY, fontFamily: 'Helvetica-Bold', textAlign: 'center' },

  footerLine: {
    position: 'absolute',
    bottom: 23,
    left: 37,
    right: 37,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: MUTED,
  },

  /* page 2 */
  page2Body: { paddingHorizontal: 37, paddingTop: 31 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  galleryImage: { width: '48.9%', height: 156, objectFit: 'cover', borderRadius: 8 },
  columns: { flexDirection: 'row', gap: 23 },
  column: { flex: 1 },
  sectionTitle: { fontSize: 10, letterSpacing: 2, color: NAVY, fontFamily: 'Helvetica-Bold', marginBottom: 11 },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 0.7,
    borderBottomColor: '#e7e9f4',
  },
  specLabel: { fontSize: 9.6, color: MUTED },
  specValue: { fontSize: 9.6, color: NAVY, fontFamily: 'Helvetica-Bold' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { borderWidth: 1, borderColor: SKY_LIGHT, borderRadius: 99, paddingVertical: 5, paddingHorizontal: 12 },
  chipText: { fontSize: 9, color: NAVY, fontFamily: 'Helvetica-Bold' },
  baseBox: { marginTop: 17, backgroundColor: LIGHT, borderRadius: 8, padding: 14 },
  baseTitle: { fontSize: 9.6, color: NAVY, fontFamily: 'Helvetica-Bold' },
  baseText: { fontSize: 9.6, color: INK, marginTop: 4 },
  baseNote: { fontSize: 9, color: MUTED, marginTop: 3 },

  /* foot band */
  footBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NAVY,
    paddingVertical: 20,
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
});
