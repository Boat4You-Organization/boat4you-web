import { Container, Grid, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

import WhyChooseUsItem from '@/components/WhyChooseUsItem';
import { HowWeWorkItem } from '@/config/howWeWork.config';
import { WhyChooseUsItem as WhyChooseUsItemType } from '@/config/whyChooseUs';
import colors from '@/styles/themes/colors';

import styles from './WhyChooseUsSection.module.scss';

interface WhyChooseUsSectionProps {
  translation: 'home' | 'howWeWork';
  data: WhyChooseUsItemType[] | HowWeWorkItem[];
}

const strong = (chunks: React.ReactNode) => (
  <Typography variant="h1" component="span" fontStyle="italic" fontWeight={700} color={colors.blue500}>
    {chunks}
  </Typography>
);

const WhyChooseUsSection = ({ translation, data }: WhyChooseUsSectionProps) => {
  const t = useTranslations(translation);

  return (
    <Container
      component="section"
      maxWidth="xl"
      disableGutters
      className={cx(styles.container, { [styles.howWeWork]: translation === 'howWeWork' })}
      // Side gutter so the section is not edge-to-edge on mobile (Mario).
      sx={{ px: { xs: 2, md: 3 } }}
    >
      <Typography variant="h1" component="h2" color={colors.blue950}>
        {t.rich('whyChooseUsSection.whyChoose', {
          strong,
        })}
      </Typography>
      <Grid container columnSpacing={{ xs: 2, md: 13 }} rowSpacing={{ xs: 8 }} className={styles.grid}>
        {data.map(({ icon: Icon, translationKey }) => (
          <WhyChooseUsItem
            key={translationKey}
            icon={Icon}
            title={t(`${translationKey}.title`)}
            description={t(`${translationKey}.description`)}
            translationKey={translationKey}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default WhyChooseUsSection;
