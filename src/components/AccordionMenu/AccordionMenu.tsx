import { Stack } from '@mui/material';

import { Accordion } from '@/types/accordion.type';

import AccordionMenuItem from './AccordionMenuItem';

interface AccordionMenuProps {
  accordionList: Accordion[];
  /** The boat page's smaller type (boatType): 16 px questions, 14 px answers. */
  dense?: boolean;
}

const AccordionMenu = ({ accordionList, dense = false }: AccordionMenuProps) => (
  <Stack spacing={0}>
    {accordionList.map((menu, index) => (
      <AccordionMenuItem key={`faq-${index + 1}`} dense={dense} {...menu} />
    ))}
  </Stack>
);

export default AccordionMenu;
