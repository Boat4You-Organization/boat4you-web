import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { HowWeWorkStep as HowWeWorkStepType } from '@/config/howWeWork.config';
import colors from '@/styles/themes/colors';

import styles from './HowWeWorkStep.module.scss';

const HowWeWorkStep = ({ step, titleKey, subtitleKey, itemsKeys, questionKey, answerKey, link }: HowWeWorkStepType) => {
  const t = useTranslations('howWeWork');

  return (
    <Box className={styles.container}>
      <Box className={styles.step}>
        <Typography variant="body2" color={colors.blue500} whiteSpace="nowrap">
          {t('step')} {step}
        </Typography>
      </Box>
      <Stack>
        <Typography variant="h2">{t(titleKey)}</Typography>
        <Stack>
          <Typography variant="body1" color={colors.black800}>
            {t(subtitleKey)}
          </Typography>
          <Stack className={styles.itemsContainer}>
            {itemsKeys.map(itemKey => (
              <Typography key={itemKey} variant="body1" color={colors.black800}>
                {t(itemKey)}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Stack mt={4}>
          {questionKey && (
            <Typography variant="body1" component="h3" fontWeight={700} color={colors.blue500}>
              {t(questionKey)}
            </Typography>
          )}
          {answerKey && <Typography variant="body1">{t(answerKey)}</Typography>}
          {link && (
            <Link href={link?.href} style={{ marginTop: 16 }}>
              <Button
                color="secondary"
                size="medium"
                sx={{
                  width: { xs: '100%', sm: 196 },
                  fontSize: { xs: 16, sm: 14 },
                  paddingBlock: { xs: 1.25, sm: 0.75 },
                }}
              >
                {link?.textKey ? t(link.textKey) : link?.text}
              </Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default HowWeWorkStep;
