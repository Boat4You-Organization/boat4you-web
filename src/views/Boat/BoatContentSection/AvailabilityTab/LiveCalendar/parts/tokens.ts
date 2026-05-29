// Mario rule 12.5.2026 — explicit colour palette from the availability-widget
// design handoff. Kept local to the AvailabilitySlider so the broader app
// theme (`src/styles/themes/colors.ts`) is not affected. If the catamaran
// sister-sites later port this widget, they'll inherit these tokens too.
export const T = {
  navy: '#0F1E3E',
  ink: '#0B1424',
  body: '#374151',
  muted: '#6B7280',
  faint: '#9CA3AF',
  hair: '#E5E7EB',
  card: '#FFFFFF',
  page: '#F7F7F5',
  paneTint: '#F2F4F7',
  green: '#16A34A',
  greenDeep: '#15803D',
  greenSoft: '#DCFCE7',
  amber: '#D97706',
  amberSoft: '#FEF3C7',
  // Mario 12.5.2026 — original handoff `tierLow: #E8F2EC` bilo je
  // pre-svijetlo (ne ČIta se kao "dostupno"), pa cijela ramp pomjerena
  // dolje (saturated/darker greens). `tierPeak` stiscut malo da gap između
  // peak i high stays distinct after the shift.
  tierLow: '#C9E4D2',
  tierMid: '#86C49E',
  tierHigh: '#3FA968',
  tierPeak: '#0D6B36',
} as const;
