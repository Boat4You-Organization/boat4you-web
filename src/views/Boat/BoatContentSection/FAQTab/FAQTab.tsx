import { startTransition, useActionState, useEffect } from 'react';

import { Divider, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { getFAQByCategoryAction } from '@/actions/faq.actions';
import { getYachtBrochureUrl } from '@/actions/yacht.actions';
import AccordionMenu from '@/components/AccordionMenu';
import FAQ from '@/components/SvgIcons/FAQ';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { licenceFaqCategory } from '@/utils/static/guletCrewed';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { YachtFaqEntry } from '@/utils/static/yachtFaq';
import BrochureDownloadBox from '@/views/Boat/BoatContentSection/BrochureDownloadBox';

interface FAQTabProps {
  yacht: YachtModel;
  yachtFaq?: YachtFaqEntry[];
}

const FAQTab = ({ yacht, yachtFaq }: FAQTabProps) => {
  const [brochureState, getBrochureAction] = useActionState(getYachtBrochureUrl, { success: false });
  const [faqAction, getFAQAction] = useActionState(getFAQByCategoryAction, undefined);
  const t = useTranslations('yacht');
  const locale = useLocale();

  // The general licence FAQ — none on a gulet, chartered only with its crew (guletCrewed.ts).
  const category = licenceFaqCategory(locale, yacht.vesselType);

  useEffect(() => {
    if (yacht.custom) {
      startTransition(() => {
        getBrochureAction(yacht.slug);
      });
    }
  }, [yacht.custom, yacht.slug]);

  useEffect(() => {
    if (!category) return;

    startTransition(() => {
      getFAQAction({ locale, category });
    });
  }, [category, locale]);

  const downloadBrochure = () => {
    if (!brochureState.success || !brochureState.url) return;

    const link = document.createElement('a');

    link.href = brochureState.url;
    link.download = `${yacht.slug}-brochure.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack component="section" direction="column" spacing={4} pt={4}>
      {/* Visual break before the FAQ block. Without it, the FAQ heading
          butts up against the Extras table (or the description body for
          non-custom yachts) and reads cramped. The brochure box already
          provides its own framing, so we only show the rule when the box
          isn't there. */}
      {yacht.custom && yacht.customDetails.hasBrochure ? (
        <BrochureDownloadBox yachtName={toTitleCase(yacht.name)} onDownload={downloadBrochure} />
      ) : (
        <Divider
          sx={{
            '&.MuiDivider-root': {
              // Slightly darker than the in-tab `black200` separators so
              // the FAQ section reads as a distinct block, not a row in
              // the Extras table above it.
              borderColor: colors.black300,
              my: 0,
            },
          }}
        />
      )}
      <Stack component="section" direction="column" spacing={3}>
        <Typography
          component="h2"
          variant="h3"
          fontWeight={700}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={1}
        >
          <FAQ variant="secondary" size={32} />
          {t('FAQTitle')}
        </Typography>
        {/* Per-yacht Q&A first (server-built, variant-rotated, mirrors the
            FAQPage JSON-LD) — the generic licence FAQ follows, except on a gulet. */}
        {yachtFaq && yachtFaq.length > 0 && (
          <AccordionMenu accordionList={yachtFaq.map(f => ({ title: f.question, content: f.answer }))} />
        )}
        {category && faqAction && <AccordionMenu accordionList={faqAction} />}
      </Stack>
    </Stack>
  );
};

export default FAQTab;
