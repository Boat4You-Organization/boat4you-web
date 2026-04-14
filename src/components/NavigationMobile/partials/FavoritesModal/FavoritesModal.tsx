import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';

import SwipeableModal from '@/components/ModalRoot/SwipeableModal';
import WishlistItem from '@/components/WishlistItem';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';

interface FavoritesModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const FavoritesModal = ({ isOpen, onOpen, onClose }: FavoritesModalProps) => {
  const [favorites] = useLocalStorage<YachtModelLocalStorage[]>('favorites', []);
  const t = useTranslations('common');

  const favoritesArray = favorites || [];

  return (
    <SwipeableModal
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      title={t('favorites')}
      hideConfirmButton
      hideCancelButton
      removePadding
    >
      {favoritesArray.length === 0 ? (
        <MenuItem disabled>Your wishlist is empty</MenuItem>
      ) : (
        favoritesArray.map(yacht => <WishlistItem key={yacht.id} yacht={yacht} />)
      )}
    </SwipeableModal>
  );
};

export default FavoritesModal;
