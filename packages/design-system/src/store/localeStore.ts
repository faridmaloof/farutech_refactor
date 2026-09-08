import { create } from 'zustand'

type Locale = 'es' | 'en' | 'pt'
export type DateFormat = 'short' | 'medium' | 'long' | 'full'
export type TimeFormat = 'short' | 'medium'

export interface LocaleConfig {
  locale: Locale
  months: string[]
  weekdays: string[]
  dateFormat: DateFormat
  timeFormat: TimeFormat
}

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  getLocaleConfig: () => LocaleConfig
}

const localeConfigs: Record<Locale, LocaleConfig> = {
  es: {
    locale: 'es',
    months: Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(2024, month, 1))),
    weekdays: Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat('es', { weekday: 'short' }).format(new Date(2024, 0, 7 + day))),
    dateFormat: 'long',
    timeFormat: 'short',
  },
  en: {
    locale: 'en',
    months: Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2024, month, 1))),
    weekdays: Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(2024, 0, 7 + day))),
    dateFormat: 'long',
    timeFormat: 'short',
  },
  pt: {
    locale: 'pt',
    months: Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat('pt', { month: 'long' }).format(new Date(2024, month, 1))),
    weekdays: Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat('pt', { weekday: 'short' }).format(new Date(2024, 0, 7 + day))),
    dateFormat: 'long',
    timeFormat: 'short',
  },
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: 'es',
  setLocale: (locale) => set({ locale }),
  getLocaleConfig: () => localeConfigs[get().locale],
}))

export function formatDateWithLocale(
  date: Date | string,
  dateFormat: DateFormat = 'long',
  showTime = false,
  timeFormat: TimeFormat = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const locale = getLocaleFromStore()
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: dateFormat,
    ...(showTime ? { timeStyle: timeFormat } : {}),
  }
  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

function getLocaleFromStore(): Locale {
  return useLocaleStore.getState().locale
}
