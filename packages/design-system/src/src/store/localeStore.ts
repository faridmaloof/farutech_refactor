import { create } from 'zustand';

type Locale = 'es' | 'en' | 'pt';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: 'es',
  setLocale: (locale) => set({ locale }),
}));

export function formatDateWithLocale(date: Date | string, locale: Locale = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}
