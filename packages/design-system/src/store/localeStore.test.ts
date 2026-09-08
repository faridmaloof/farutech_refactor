import { describe, expect, it, beforeEach } from 'vitest'
import { formatDateWithLocale, useLocaleStore } from './localeStore'

describe('localeStore', () => {
  beforeEach(() => {
    useLocaleStore.getState().setLocale('es')
  })

  it('provides complete calendar arrays for the selected locale', () => {
    const config = useLocaleStore.getState().getLocaleConfig()

    expect(config.locale).toBe('es')
    expect(config.months).toHaveLength(12)
    expect(config.monthsShort).toHaveLength(12)
    expect(config.weekdays).toHaveLength(7)
    expect(config.days).toHaveLength(7)
    expect(config.daysShort).toHaveLength(7)
  })

  it('changes locale configuration consistently', () => {
    useLocaleStore.getState().setLocale('en')

    const config = useLocaleStore.getState().getLocaleConfig()

    expect(config.locale).toBe('en')
    expect(config.months).toHaveLength(12)
    expect(config.daysShort).toHaveLength(7)
  })

  it('formats dates using the active locale and requested options', () => {
    useLocaleStore.getState().setLocale('en')

    const result = formatDateWithLocale(
      new Date(2024, 0, 15, 13, 30),
      'long',
      true,
      'short'
    )

    expect(result).toContain('January')
  })
})
