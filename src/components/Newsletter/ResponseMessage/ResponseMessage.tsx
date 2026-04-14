import React from 'react';

import { Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';

import Check from '@/components/SvgIcons/Check';
import Close from '@/components/SvgIcons/Close';
import colors from '@/styles/themes/colors';

import styles from './ResponseMessage.module.scss';

interface ResponseMessageProps {
  status: number;
}

const ResponseMessage: React.FC<ResponseMessageProps> = ({ status }) => {
  const t = useTranslations('common.newsletter.response');

  let message = t('default');

  if (status === 200) {
    message = t('200');
  } else if (status === 500) {
    message = t('500');
  }

  const isSuccess = status === 200;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      className={cx(styles.container, { [styles.success]: isSuccess })}
    >
      {isSuccess ? <Check size={18} fill={colors.green500} /> : <Close size={18} fill={colors.red500} />}
      <Typography variant="body1" className={cx(styles.text, { [styles.success]: isSuccess })}>
        {message}
      </Typography>
    </Stack>
  );
};

export default ResponseMessage;
