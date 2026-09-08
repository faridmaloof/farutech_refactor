/**
 * Tipos de menú públicos del Design System.
 * Las aplicaciones consumidoras pueden proporcionar su propia configuración.
 */

import type { ReactNode } from 'react'

export interface MenuItemBase {
  id: string
  label: string
  icon?: ReactNode
  badge?: string | number
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger'
}

export interface MenuItem extends MenuItemBase {
  path?: string
  onClick?: () => void
  children?: MenuItem[]
  permissions?: string[]
  disabled?: boolean
  external?: boolean
}

export interface MenuCategory {
  id: string
  label: string
  icon?: ReactNode
  items: MenuItem[]
  permissions?: string[]
  collapsed?: boolean
}

/** Entrada individual renderizable por los componentes de navegación. */
export type MenuEntry = MenuItem | MenuCategory

/** Configuración completa del menú de una aplicación. */
export interface MenuConfig {
  categories: MenuCategory[]
  quickActions?: MenuItem[]
}

export interface Module {
  id: string
  name: string
  icon?: ReactNode
  color?: string
  description?: string
}

export const defaultMenuConfig: MenuConfig = {
  categories: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      items: [
        { id: 'overview', label: 'Vista General', path: '/dashboard' },
        { id: 'analytics', label: 'Analíticas', path: '/dashboard/analytics' },
      ],
    },
    {
      id: 'management',
      label: 'Gestión',
      items: [
        { id: 'users', label: 'Usuarios', path: '/users' },
        { id: 'roles', label: 'Roles', path: '/roles' },
        { id: 'permissions', label: 'Permisos', path: '/permissions' },
      ],
    },
  ],
  quickActions: [
    { id: 'create', label: 'Crear Nuevo' },
    { id: 'import', label: 'Importar' },
    { id: 'export', label: 'Exportar' },
  ],
}

export const defaultModules: Module[] = [
  { id: 'admin', name: 'Admin', color: '#10b981' },
  { id: 'crm', name: 'CRM', color: '#3b82f6' },
  { id: 'pos', name: 'POS', color: '#f59e0b' },
  { id: 'intranet', name: 'Intranet', color: '#8b5cf6' },
]
