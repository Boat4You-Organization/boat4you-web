import { ReactNode } from 'react';

import { AccordionDetails, AccordionSummary, Accordion as MuiAccordion, Stack, Typography } from '@mui/material';

import ChevronDown from '@/components/SvgIcons/ChevronDown';
import Switch from '@/components/Switch';
import colors from '@/styles/themes/colors';

import styles from './CookieAccordion.module.scss';

interface CookieAccordionProps {
  title: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled: boolean;
  children: ReactNode;
}

const CookieAccordion = ({ title, checked, onChange, disabled, children }: CookieAccordionProps) => {
  const handleSwitchClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <MuiAccordion
      classes={{ root: styles.root }}
      className={styles.container}
      sx={{
        '&&': {
          borderRadius: '16px',
        },
      }}
    >
      <AccordionSummary className={styles.summary} expandIcon={<ChevronDown size={16} fill={colors.black400} />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
          <Typography component="p" variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Stack width="fit-content" onClick={handleSwitchClick}>
            <Switch checked={checked} onChange={onChange} disabled={disabled} onClick={handleSwitchClick} />
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails className={styles.details}>{children}</AccordionDetails>
    </MuiAccordion>
  );
};

export default CookieAccordion;
