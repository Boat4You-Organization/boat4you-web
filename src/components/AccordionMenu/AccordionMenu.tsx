import { Stack } from '@mui/material';

import { Accordion } from '@/types/accordion.type';

import AccordionMenuItem from './AccordionMenuItem';

interface AccordionMenuProps {
  accordionList: Accordion[];
}

const AccordionMenu = ({ accordionList }: AccordionMenuProps) => (
  <Stack spacing={0}>
    {accordionList.map((menu, index) => (
      <AccordionMenuItem key={`faq-${index + 1}`} {...menu} />
    ))}
  </Stack>
);

export default AccordionMenu;
