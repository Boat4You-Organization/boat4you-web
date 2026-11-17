/**
 * The boat page's type scale (Mario 3.11.2026): one font (Raleway), six
 * sizes and three weights for everything under the hero. Before it the page
 * mixed twelve sizes (10–32 px) and five weights, so the sections read as
 * different designs — compare Boataround's seven sizes.
 */
const boatType = {
  /** A section heading: Description, Amenities, Availability… */
  sectionTitle: { fontSize: 22, fontWeight: 600 },
  /** A sub-heading: Pick-up time, an extra's name, a FAQ question, a card title. */
  subtitle: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
  /** Running text, lists, values. */
  body: { fontSize: 14, fontWeight: 400 },
  /** A value next to its label, a price that is not the card's main one. */
  bodyStrong: { fontSize: 14, fontWeight: 600 },
  /** Small plain text: "Per booking", a hint under a date. */
  small: { fontSize: 12, fontWeight: 400 },
  /** A small label: a status pill, the legend, a month on the axis (sentence case, unslop 17.11.2026). */
  label: { fontSize: 12, fontWeight: 600 },
  /** The one highlighted price of a card. */
  price: { fontSize: 20, fontWeight: 600 },
} as const;

export default boatType;
