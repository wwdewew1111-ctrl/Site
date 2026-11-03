import { createContext, useContext } from 'react';
import type { ThemeMode } from '@/types';

export interface ThemeContextValue {
  theme: ThemeMode;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
