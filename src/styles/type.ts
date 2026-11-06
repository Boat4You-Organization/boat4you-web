/**
 * The site's type scale for MUI components (SCSS modules use `src/styles/mixins/_type.scss`, which explains the
 * scale). Same values: a section heading is 36 px on desktop and 28 px on a phone, weight 500, with an 800 italic
 * blue half.
 */
const siteType = {
  /** A section heading rendered as `<Typography variant="h1" component="h2">`. */
  sectionTitle: { fontSize: { xs: '28px', md: '36px' } },
  /** The blue italic half inside it: takes the heading's size instead of the variant's own 36 px. */
  emphasis: { fontSize: 'inherit', fontStyle: 'italic', fontWeight: 800 },
} as const;

export default siteType;
