'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './FAQSection.module.scss';

/**
 * Home-page FAQ block.
 *
 * Visual gabarit matches `AllDestinationsSection` — same `<Container
 * maxWidth="xl" disableGutters>` shape, the H1-as-H2 split title (regular
 * blue950 + italic 800-weight blue500), `body2`/black350 subtitle. Mario
 * (Apr-2026) asked for the gabarit alignment so the FAQ block reads as a
 * matching pair with the destinations / manufacturers blocks beneath.
 *
 * Two reasons the FAQ lives on the home page (rather than only /faq):
 *   1. Google rewards FAQPage structured data on the page where the
 *      questions actually render — duplicating across both pages would
 *      double-mark the same content and trip the rich-result validator.
 *   2. Home is the primary brand-search landing — surfacing the most
 *      common booking concerns there reduces support volume and lifts
 *      conversion (the visitor scrolls past, sees their concern handled,
 *      and books).
 *
 * The matching `FAQPage` JSON-LD lives in
 * `app/[locale]/(root)/page.tsx` — kept server-rendered so Google sees
 * the schema on the first crawl, even before this client `Accordion`
 * hydrates. Question text in both places must stay verbatim — Google
 * silently drops the rich result when the schema and visible text
 * disagree.
 */
const FAQSection = () => {
  const t = useTranslations('home');
  // next-intl exposes `t.raw('questions')` to read an array verbatim
  // without going through the format pipeline. The schema is also
  // generated from the same source on the server side.
  const questions = t.raw('faqSection.questions') as Array<{ q: string; a: string }>;

  if (!Array.isArray(questions) || questions.length === 0) return null;

  return (
    <Container maxWidth="xl" component="section" disableGutters className={styles.container}>
      <Typography variant="h1" component="h2" color={colors.blue950}>
        {t('faqSection.preTitle')}{' '}
        <Typography
          variant="h1"
          component="span"
          fontStyle="italic"
          fontWeight={800}
          color={colors.blue500}
          sx={{ pl: '0.1em', wordBreak: 'break-word' }}
        >
          {t('faqSection.emphasizedTitle')}
        </Typography>
      </Typography>
      <Typography variant="body2" color={colors.black350}>
        {t('faqSection.subtitle')}
      </Typography>

      <Box mt={3}>
        {questions.map((qa, i) => (
          <Accordion
            key={`faq-${i + 1}`}
            disableGutters
            elevation={0}
            sx={{
              border: `1px solid ${colors.black200}`,
              borderRadius: 1.5,
              mb: 1,
              '&:before': { display: 'none' },
              '&.Mui-expanded': { mt: 0, mb: 1 },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ '& .MuiAccordionSummary-content': { my: 1.5 } }}>
              <Typography component="h3" variant="body1" fontWeight={700} color={colors.black950}>
                {qa.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color={colors.black700} sx={{ lineHeight: 1.6 }}>
                {qa.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQSection;
