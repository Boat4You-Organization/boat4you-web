export type LocalStorageKey = 'yachtReservation';

export const getDataFromLocalStorage = <T>(key: LocalStorageKey): T | null => {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to get data from localStorage for key "${key}":`, error);

    return null;
  }
};

export const clearDataFromLocalStorage = (key: LocalStorageKey) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to clear reservation data:', error);
  }
};

export const saveDataToLocalStorage = <T extends Record<string, unknown>>(key: LocalStorageKey, data: T): boolean => {
  clearDataFromLocalStorage(key);
  try {
    localStorage.setItem(key, JSON.stringify(data));

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to save reservation data:', error);

    return false;
  }
};
