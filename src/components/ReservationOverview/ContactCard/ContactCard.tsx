import { Icon, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import colors from '@/styles/themes/colors';

interface ContactCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const ContactCard = ({ icon: ContactIcon, title, description, linkTo, linkText }: ContactCardProps) => (
  <Stack direction="row" alignItems="flex-start" spacing={1}>
    <Icon>
      <ContactIcon size={24} />
    </Icon>
    <Stack spacing={1}>
      <Typography variant="h4" component="p" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: { xs: '100%', md: 314 } }}>
        {description}
      </Typography>
      <Link href={linkTo} target="_blank" rel="noopener noreferrer" style={{ color: colors.blue500 }}>
        {linkText}
      </Link>
    </Stack>
  </Stack>
);

export default ContactCard;
