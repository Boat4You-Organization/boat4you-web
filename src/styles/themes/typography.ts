import { TypographyVariantsOptions } from '@mui/material';

const typography: TypographyVariantsOptions = {
  fontFamily: 'Raleway, sans-serif',
  hero: {
    fontSize: '62px',
    fontWeight: 500,
    '@media(max-width: 768px)': {
      // Smaller hero copy on phones so the search card stays above the
      // fold on 375×812 viewport — user feedback that the search wasn't
      // immediately visible on mobile.
      fontSize: '36px',
      lineHeight: 1.15,
    },
  },
  h1: {
    fontSize: '36px',
    fontWeight: 500,
  },
  h2: {
    fontSize: '28px',
    fontWeight: 700,
  },
  h3: {
    fontSize: '22px',
    fontWeight: 500,
  },
  h4: {
    fontSize: '18px',
    fontWeight: 700,
  },
  body1: {
    fontSize: '16px',
    fontWeight: 500,
  },
  body2: {
    fontSize: '14px',
    fontWeight: 500,
  },
  body3: {
    fontSize: '12px',
    fontWeight: 700,
  },
  button: {
    textTransform: 'none',
  },
};

export default typography;
