import { showToast } from '@/valtio/global/global.actions';

const copyToClipboard = (text: string, message: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast({
        status: 'success',
        text: message,
      });
    })
    .catch(() => {
      showToast({
        status: 'error',
        text: 'Failed to copy to clipboard',
      });
    });
};

export default copyToClipboard;
