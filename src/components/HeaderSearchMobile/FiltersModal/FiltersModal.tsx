import { useTranslations } from 'next-intl';

import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import FiltersSection from '@/views/Search/SearchView/FiltersSection';

interface FiltersModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  catalogueData: CatalogueData;
  catalogueFilters?: CatalogueFilters | null;
}

const FiltersModal = ({ isOpen, onOpen, onClose, catalogueData, catalogueFilters }: FiltersModalProps) => {
  const t = useTranslations();

  return (
    <SwipeableModal
      title={t('filters.filters')}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      onConfirm={onClose}
      confirmBtnText={t('filters.close')}
      hideCancelButton
    >
      <FiltersSection catalogueData={catalogueData} catalogueFilters={catalogueFilters} isMobile />
    </SwipeableModal>
  );
};

export default FiltersModal;
