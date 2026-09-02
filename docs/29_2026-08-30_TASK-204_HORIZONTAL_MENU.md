# TASK-204 — HorizontalMenu (REQ-DS-04)

**Estado:** DONE (2026-08-30)
**Repo:** `Farutech/design-system`
**Componente:** `HorizontalMenu` (src/components/HorizontalMenu/)

## Summary

Componente de navegación horizontal (header) siguiendo las mismas convenciones de tokens/props que el catálogo existente del Design System.

## Archivos creados

| Archivo | Propósito |
|---|---|
| `src/components/HorizontalMenu/HorizontalMenu.tsx` | Componente principal con tipos, renderizado de items, brand, actions, dropdown/submenú |
| `src/components/HorizontalMenu/HorizontalMenu.css` | Estilos con tokens CSS, variantes light/dark/transparent, dropdown, responsive |
| `src/components/HorizontalMenu/index.ts` | Barrel export |
| `src/__tests__/HorizontalMenu.test.tsx` | 8 tests: renderizado, activo, LinkComponent, brand, actions, dropdown, variante dark, accesibilidad |
| `src/tokens/tokens.css` | +`--ft-header-height: 3.5rem` |
| `src/tokens/tokens.ts` | +`headerHeight?: string` |
| `src/index.ts` | +export `HorizontalMenu`

## API

```tsx
interface HorizontalMenuItem {
  label: string
  to?: string       // ruta interna (usa LinkComponent del provider)
  href?: string     // URL externa
  icon?: ReactNode  // icono opcional a la izquierda
  active?: boolean  // marca visual activo
  children?: HorizontalMenuItem[]  // submenú (dropdown)
}

interface HorizontalMenuProps {
  items: HorizontalMenuItem[]
  variant?: 'light' | 'dark' | 'transparent'
  brand?: ReactNode        // logo/marca a la izquierda
  actions?: ReactNode      // acciones a la derecha (avatar, botón login)
  className?: string
}
```

## Validación

- **8 tests** → todos pass
- **Regresión**: suite completa 33 tests, 7 files → todos pass
- Accesibilidad: `role="navigation"` + `aria-label`, focus-visible ring

## Próximo

Consumir en el admin panel (TASK-301) y en website (TASK-104) reemplazando los headers actuales.