import { useTranslations } from 'next-intl';

import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import FiltersSectionV2 from '@/views/Search/SearchView/FiltersSectionV2';

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
      <FiltersSectionV2 catalogueData={catalogueData} catalogueFilters={catalogueFilters} isMobile />
    </SwipeableModal>
  );
};

export default FiltersModal;
