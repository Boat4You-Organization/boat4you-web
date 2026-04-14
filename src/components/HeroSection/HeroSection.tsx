import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import LogoWithoutText from '@/components/SvgIcons/LogoWithoutText';
import colors from '@/styles/themes/colors';
import ImageType from '@/types/image.type';

import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  namespace: 'about' | 'howWeWork' | 'contact';
  image: ImageType;
}

const TitleBoldText = (chunks: React.ReactNode): React.ReactNode => (
  <Typography variant="hero" component="p" textAlign="center" fontWeight={800} fontStyle="italic" color="primary">
    {chunks}
  </Typography>
);

const LogoComponent = () => <LogoWithoutText />;

const DescriptionBoldText = (chunks: React.ReactNode): React.ReactNode => (
  <Typography variant="body1" component="span" fontWeight={700} color="primary">
    {chunks}
  </Typography>
);

const HeroSection = ({ namespace, image }: HeroSectionProps) => {
  const t = useTranslations(`${namespace}.hero`);

  return (
    <Container component="section" className={styles.container}>
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
      <Container maxWidth="xl" disableGutters className={styles.content}>
        <Typography variant="hero" component="h1" textAlign="center" color={colors.blue950}>
          {t.rich('title', {
            strong: TitleBoldText,
          })}
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mt: 4 }}>
          {t.rich('description', {
            logo: LogoComponent,
            companyName: DescriptionBoldText,
          })}
        </Typography>
      </Container>
      <Box className={styles.borderBox} />
    </Container>
  );
};

export default HeroSection;
