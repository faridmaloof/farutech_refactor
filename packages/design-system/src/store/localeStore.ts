import { create } from 'zustand'

type Locale = 'es' | 'en' | 'pt'
export type DateFormat = 'short' | 'medium' | 'long' | 'full'
export type TimeFormat = 'short' | 'medium'

export interface LocaleConfig {
  locale: Locale
  months: string[]
  monthsShort: string[]
  weekdays: string[]
  days: string[]
  daysShort: string[]
  dateFormat: DateFormat
  timeFormat: TimeFormat
}

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  getLocaleConfig: () => LocaleConfig
}

function createLocaleConfig(locale: Locale): LocaleConfig {
  const dateLocale = locale === 'pt' ? 'pt-BR' : locale
  const referenceDate = new Date(2024, 0, 7)

  return {
    locale,
    months: Array.from({ length: 12 }, (_, month) =>
      new Intl.DateTimeFormat(dateLocale, { month: 'long' }).format(new Date(2024, month, 1))
    ),
    monthsShort: Array.from({ length: 12 }, (_, month) =>
      new Intl.DateTimeFormat(dateLocale, { month: 'short' }).format(new Date(2024, month, 1))
    ),
    weekdays: Array.from({ length: 7 }, (_, day) =>
      new Intl.DateTimeFormat(dateLocale, { weekday: 'long' }).format(
        new Date(referenceDate.getTime() + day * 24 * 60 * 60 * 1000)
      )
    ),
    days: Array.from({ length: 7 }, (_, day) =>
      new Intl.DateTimeFormat(dateLocale, { weekday: 'long' }).format(
        new Date(referenceDate.getTime() + day * 24 * 60 * 60 * 1000)
      )
    ),
    daysShort: Array.from({ length: 7 }, (_, day) =>
      new Intl.DateTimeFormat(dateLocale, { weekday: 'short' }).format(
        new Date(referenceDate.getTime() + day * 24 * 60 * 60 * 1000)
      )
    ),
    dateFormat: 'long',
    timeFormat: 'short',
  }
}

const localeConfigs: Record<Locale, LocaleConfig> = {
  es: createLocaleConfig('es'),
  en: createLocaleConfig('en'),
  pt: createLocaleConfig('pt'),
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
