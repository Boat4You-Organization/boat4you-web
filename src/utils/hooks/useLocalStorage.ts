import React, { useDebugValue, useEffect, useState } from 'react';

const parse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const useLocalStorage = <S>(
  key: string,
  initialState?: S | (() => S)
): [S, React.Dispatch<React.SetStateAction<S>>] => {
  const getInitialValue = (): S =>
    typeof initialState === 'function' ? (initialState as () => S)() : (initialState as S);

  const [state, setState] = useState<S>(getInitialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useDebugValue(state);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = localStorage.getItem(key);

      if (item !== null) setState(parse(item));
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;

    localStorage.setItem(key, JSON.stringify(state));
    window.dispatchEvent(
      new CustomEvent('localStorageChange', {
        detail: { key, newValue: state },
      })
    );
  }, [key, state, isLoaded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent;

      if (customEvent.detail.key === key) setState(customEvent.detail.newValue);
    };

    window.addEventListener('localStorageChange', handleStorageChange);

    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('localStorageChange', handleStorageChange);
  }, [key]);

  return [state, setState];
};
