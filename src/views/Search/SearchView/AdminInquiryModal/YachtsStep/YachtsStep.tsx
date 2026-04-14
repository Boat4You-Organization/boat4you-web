import { Stack } from '@mui/material';

import { YachtModelShortInfo } from '@/models/yacht.model';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import InquiryYachtCard from '@/views/Search/SearchView/AdminInquiryModal/InquiryYachtCard';

interface YachtsStepProps {
  selectedYachts: YachtModelShortInfo[];
}

const YachtsStep = ({ selectedYachts }: YachtsStepProps) => {
  const { selectedYachtIds } = useYachtStore();

  const filteredYachts = selectedYachts.filter(yacht => selectedYachtIds.includes(yacht.id));

  return (
    <Stack spacing={2}>
      {filteredYachts.map(yacht => (
        <InquiryYachtCard key={yacht.id} yacht={yacht} />
      ))}
    </Stack>
  );
};

export default YachtsStep;
