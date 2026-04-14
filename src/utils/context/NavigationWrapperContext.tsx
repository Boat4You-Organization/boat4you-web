'use client';

import { createContext } from 'react';

export type NavigationWrapperContextValue = ((fn: () => void) => void) | null;

export const NavigationWrapperContext = createContext<NavigationWrapperContextValue>(null);
