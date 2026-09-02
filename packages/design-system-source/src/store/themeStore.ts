import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const current = get().theme;
    set({ theme: current === 'dark' ? 'light' : 'dark' });
  },
}));
