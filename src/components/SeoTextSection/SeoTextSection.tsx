'use client';

import { useState } from 'react';

import { Box, Button, Collapse, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

interface SeoTextSectionProps {
  /** Human-readable name of the searched destination — shown in the title. */
  destination?: string | null;
}

/**
 * Long-form SEO block rendered at the bottom of the search results list.
 *
 * Collapsed by default (shows ~3 lines + fade + "Show more"), expands on click.
 * Content is intentionally generic — for maximum SEO value each destination
 * should eventually get a curated paragraph (plan: `/api/seo/destination/{slug}`
 * or a CMS field per location). Until then, we interpolate the destination
 * name into a template that still reads naturally and carries the target
 * keyword ("Yacht Charter in {X}").
 */
const SeoTextSection = ({ destination }: SeoTextSectionProps) => {
  const t = useTranslations('common');
  const [expanded, setExpanded] = useState(false);

  const dest = destination?.trim() || t('yourDestination');
  const title = t('seoBlockTitle', { destination: dest });

  // Full body — first paragraph stays visible when collapsed (truncated by CSS),
  // remaining paragraphs reveal when expanded. Easily replaceable by a CMS field.
  const intro = t('seoBlockIntro', { destination: dest });
  const paragraphs: string[] = [
    t('seoBlockP1', { destination: dest }),
    t('seoBlockP2', { destination: dest }),
    // P3 is a brand-focused paragraph — no destination placeholder.
    t('seoBlockP3'),
  ];

  return (
    <Box component="section" sx={{ mt: 4, mb: 2 }} aria-label={title}>
      <Typography variant="h3" fontWeight={700} mb={1.5}>
        {title}
      </Typography>

      {/* Always-visible intro + fade-to-white mask when collapsed */}
      <Box sx={{ position: 'relative' }}>
        <Typography
          variant="body2"
          color={colors.black600}
          sx={{
            lineHeight: 1.6,
            ...(expanded
              ? {}
              : {
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }),
          }}
        >
          {intro}
        </Typography>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
        <Box mt={1.5}>
          {paragraphs.map((p, i) => (
            <Typography
              key={`p-${i + 1}`}
              variant="body2"
              color={colors.black600}
              sx={{ lineHeight: 1.6, mt: i === 0 ? 0 : 1.5 }}
            >
              {p}
            </Typography>
          ))}
        </Box>
      </Collapse>

      <Button
        onClick={() => setExpanded(prev => !prev)}
        aria-expanded={expanded}
        sx={{
          mt: 1,
          p: 0,
          minWidth: 'auto',
          color: colors.blue500,
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': { background: 'transparent', textDecoration: 'underline' },
        }}
      >
        {expanded ? t('showLess') : t('showMore')}
      </Button>
    </Box>
  );
};

export default SeoTextSection;
