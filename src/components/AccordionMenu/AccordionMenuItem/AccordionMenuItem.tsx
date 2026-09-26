'use client';

import { useState } from 'react';

import { Accordion, AccordionDetails, AccordionProps, AccordionSummary, Icon, Typography } from '@mui/material';
import cx from 'clsx';

import ChevronDown from '@/components/SvgIcons/ChevronDown';
import colors from '@/styles/themes/colors';
import { Accordion as AccordionType } from '@/types/accordion.type';

import styles from './AccordionMenuItem.module.scss';

interface AccordionMenuItemProps
  extends Omit<AccordionProps, 'children' | 'title' | 'content' | 'variant'>, AccordionType {
  defaultExpanded?: boolean;
}

const AccordionMenuItem = ({ title, content, defaultExpanded = false, ...accordionProps }: AccordionMenuItemProps) => {
  const [expanded, handleChange] = useState(defaultExpanded);

  const handleToogle = () => {
    handleChange(prev => !prev);
  };

  return (
    <Accordion
      {...accordionProps}
      classes={{ root: styles.root }}
      className={cx(styles.container, { [styles.expanded]: expanded })}
      expanded={expanded}
      onChange={handleToogle}
      component="section"
    >
      <AccordionSummary
        expandIcon={
          <Icon className={styles.arrowWrapper}>
            <ChevronDown size={24} props={{ className: styles.arrow }} />
          </Icon>
        }
      >
        {/* MUI v7 already wraps AccordionSummary in an <h3> (slots.heading),
            so the title itself must be phrasing content — an inner h3 made
            every question heading appear twice in the outline (audit B27). */}
        <Typography variant="h4" component="span" fontWeight={700} color={colors.black950}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content! }}
          className={styles.body}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionMenuItem;
