/**
 * Design Tokens - Farutech Design System
 * 
 * Tokens configurables para color, tipografía, espaciado, radios y sombras.
 * Cada app consumidora puede sobreescribir estos valores mediante CSS custom properties.
 */

export const colors = {
  // Primary palette - configurable via CSS variables
  primary: {
    50: 'var(--color-primary-50, #eff6ff)',
    100: 'var(--color-primary-100, #dbeafe)',
    200: 'var(--color-primary-200, #bfdbfe)',
    300: 'var(--color-primary-300, #93c5fd)',
    400: 'var(--color-primary-400, #60a5fa)',
    500: 'var(--color-primary-500, #3b82f6)',
    600: 'var(--color-primary-600, #2563eb)',
    700: 'var(--color-primary-700, #1d4ed8)',
    800: 'var(--color-primary-800, #1e40af)',
    900: 'var(--color-primary-900, #1e3a8a)',
    950: 'var(--color-primary-950, #172554)',
  },
  
  // Secondary palette
  secondary: {
    50: 'var(--color-secondary-50, #f8fafc)',
    100: 'var(--color-secondary-100, #f1f5f9)',
    200: 'var(--color-secondary-200, #e2e8f0)',
    300: 'var(--color-secondary-300, #cbd5e1)',
    400: 'var(--color-secondary-400, #94a3b8)',
    500: 'var(--color-secondary-500, #64748b)',
    600: 'var(--color-secondary-600, #475569)',
    700: 'var(--color-secondary-700, #334155)',
    800: 'var(--color-secondary-800, #1e293b)',
    900: 'var(--color-secondary-900, #0f172a)',
    950: 'var(--color-secondary-950, #020617)',
  },
  
  // Semantic colors
  success: {
    light: 'var(--color-success-light, #dcfce7)',
    DEFAULT: 'var(--color-success-default, #22c55e)',
    dark: 'var(--color-success-dark, #15803d)',
  },
  warning: {
    light: 'var(--color-warning-light, #fef3c7)',
    DEFAULT: 'var(--color-warning-default, #f59e0b)',
    dark: 'var(--color-warning-dark, #b45309)',
  },
  error: {
    light: 'var(--color-error-light, #fee2e2)',
    DEFAULT: 'var(--color-error-default, #ef4444)',
    dark: 'var(--color-error-dark, #b91c1c)',
  },
  info: {
    light: 'var(--color-info-light, #e0f2fe)',
    DEFAULT: 'var(--color-info-default, #0ea5e9)',
    dark: 'var(--color-info-dark, #0369a1)',
  },
  
  // Neutral colors
  gray: {
    50: 'var(--color-gray-50, #f9fafb)',
    100: 'var(--color-gray-100, #f3f4f6)',
    200: 'var(--color-gray-200, #e5e7eb)',
    300: 'var(--color-gray-300, #d1d5db)',
    400: 'var(--color-gray-400, #9ca3af)',
    500: 'var(--color-gray-500, #6b7280)',
    600: 'var(--color-gray-600, #4b5563)',
    700: 'var(--color-gray-700, #374151)',
    800: 'var(--color-gray-800, #1f2937)',
    900: 'var(--color-gray-900, #111827)',
    950: 'var(--color-gray-950, #030712)',
  },
  
  // Basic colors
  white: 'var(--color-white, #ffffff)',
  black: 'var(--color-black, #000000)',
  transparent: 'transparent',
}

export const typography = {
  fontFamily: {
    sans: 'var(--font-family-sans, "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
    serif: 'var(--font-family-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
    mono: 'var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
  },
  fontSize: {
    xs: 'var(--font-size-xs, 0.75rem)',
    sm: 'var(--font-size-sm, 0.875rem)',
    base: 'var(--font-size-base, 1rem)',
    lg: 'var(--font-size-lg, 1.125rem)',
    xl: 'var(--font-size-xl, 1.25rem)',
    '2xl': 'var(--font-size-2xl, 1.5rem)',
    '3xl': 'var(--font-size-3xl, 1.875rem)',
    '4xl': 'var(--font-size-4xl, 2.25rem)',
    '5xl': 'var(--font-size-5xl, 3rem)',
    '6xl': 'var(--font-size-6xl, 3.75rem)',
  },
  fontWeight: {
    thin: 'var(--font-weight-thin, 100)',
    extralight: 'var(--font-weight-extralight, 200)',
    light: 'var(--font-weight-light, 300)',
    normal: 'var(--font-weight-normal, 400)',
    medium: 'var(--font-weight-medium, 500)',
    semibold: 'var(--font-weight-semibold, 600)',
    bold: 'var(--font-weight-bold, 700)',
    extrabold: 'var(--font-weight-extrabold, 800)',
    black: 'var(--font-weight-black, 900)',
  },
  lineHeight: {
    none: 'var(--line-height-none, 1)',
    tight: 'var(--line-height-tight, 1.25)',
    snug: 'var(--line-height-snug, 1.375)',
    normal: 'var(--line-height-normal, 1.5)',
    relaxed: 'var(--line-height-relaxed, 1.625)',
    loose: 'var(--line-height-loose, 2)',
  },
}

export const spacing = {
  px: 'var(--spacing-px, 1px)',
  0: 'var(--spacing-0, 0)',
  0.5: 'var(--spacing-0-5, 0.125rem)',
  1: 'var(--spacing-1, 0.25rem)',
  1.5: 'var(--spacing-1-5, 0.375rem)',
  2: 'var(--spacing-2, 0.5rem)',
  2.5: 'var(--spacing-2-5, 0.625rem)',
  3: 'var(--spacing-3, 0.75rem)',
  3.5: 'var(--spacing-3-5, 0.875rem)',
  4: 'var(--spacing-4, 1rem)',
  5: 'var(--spacing-5, 1.25rem)',
  6: 'var(--spacing-6, 1.5rem)',
  7: 'var(--spacing-7, 1.75rem)',
  8: 'var(--spacing-8, 2rem)',
  9: 'var(--spacing-9, 2.25rem)',
  10: 'var(--spacing-10, 2.5rem)',
  11: 'var(--spacing-11, 2.75rem)',
  12: 'var(--spacing-12, 3rem)',
  14: 'var(--spacing-14, 3.5rem)',
  16: 'var(--spacing-16, 4rem)',
  20: 'var(--spacing-20, 5rem)',
  24: 'var(--spacing-24, 6rem)',
  28: 'var(--spacing-28, 7rem)',
  32: 'var(--spacing-32, 8rem)',
  36: 'var(--spacing-36, 9rem)',
  40: 'var(--spacing-40, 10rem)',
  44: 'var(--spacing-44, 11rem)',
  48: 'var(--spacing-48, 12rem)',
  52: 'var(--spacing-52, 13rem)',
  56: 'var(--spacing-56, 14rem)',
  60: 'var(--spacing-60, 15rem)',
  64: 'var(--spacing-64, 16rem)',
  72: 'var(--spacing-72, 18rem)',
  80: 'var(--spacing-80, 20rem)',
  96: 'var(--spacing-96, 24rem)',
}

export const borderRadius = {
  none: 'var(--border-radius-none, 0)',
  sm: 'var(--border-radius-sm, 0.125rem)',
  DEFAULT: 'var(--border-radius-default, 0.25rem)',
  md: 'var(--border-radius-md, 0.375rem)',
  lg: 'var(--border-radius-lg, 0.5rem)',
  xl: 'var(--border-radius-xl, 0.75rem)',
  '2xl': 'var(--border-radius-2xl, 1rem)',
  '3xl': 'var(--border-radius-3xl, 1.5rem)',
  full: 'var(--border-radius-full, 9999px)',
}

export const boxShadow = {
  sm: 'var(--box-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
  DEFAULT: 'var(--box-shadow-default, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))',
  md: 'var(--box-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1))',
  lg: 'var(--box-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))',
  xl: 'var(--box-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1))',
  '2xl': 'var(--box-shadow-2xl, 0 25px 50px -12px rgb(0 0 0 / 0.25))',
  inner: 'var(--box-shadow-inner, inset 0 2px 4px 0 rgb(0 0 0 / 0.05))',
  none: 'var(--box-shadow-none, 0 0 #0000)',
}

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export type ColorPalette = typeof colors
export type TypographyConfig = typeof typography
export type SpacingConfig = typeof spacing
export type BorderRadiusConfig = typeof borderRadius
export type BoxShadowConfig = typeof boxShadow
