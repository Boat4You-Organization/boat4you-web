export type SessionStorageKey = 'reservationId' | 'activeStep' | 'selectedPaymentMethod' | 'selectedInstallment';

export const getDataFromSessionStorage = <T>(key: SessionStorageKey): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = sessionStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to get data from sessionStorage for key "${key}":`, error);

    return null;
  }
};

export const clearDataFromSessionStorage = (key: SessionStorageKey): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to clear data from sessionStorage for key "${key}":`, error);
  }
};

export const saveDataToSessionStorage = <T>(key: SessionStorageKey, data: T): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    sessionStorage.setItem(key, JSON.stringify(data));

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to save data to sessionStorage:', error);

    return false;
  }
};
