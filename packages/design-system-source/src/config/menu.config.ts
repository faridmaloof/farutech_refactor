/**
 * Configuración de menús para el sistema de diseño
 * Totalmente configurable y basado en permisos
 */

export interface MenuItemBase {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger';
}

export interface MenuItem extends MenuItemBase {
  path?: string;
  onClick?: () => void;
  children?: MenuItem[];
  permissions?: string[];
  disabled?: boolean;
  external?: boolean;
}

export interface MenuCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  items: MenuItem[];
  permissions?: string[];
  collapsed?: boolean;
}

export interface MenuEntry {
  categories: MenuCategory[];
  quickActions?: MenuItem[];
}

export interface Module {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

/**
 * Configuración por defecto del menú
 * Puede ser sobrescrita por cada aplicación (website, admin, intranet, etc.)
 */
export const defaultMenuConfig: MenuEntry = {
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
    { id: 'create', label: 'Crear Nuevo', icon: null },
    { id: 'import', label: 'Importar', icon: null },
    { id: 'export', label: 'Exportar', icon: null },
  ],
};

/**
 * Módulos disponibles para el switcher
 */
export const defaultModules: Module[] = [
  { id: 'admin', name: 'Admin', icon: null, color: '#10b981' },
  { id: 'crm', name: 'CRM', icon: null, color: '#3b82f6' },
  { id: 'pos', name: 'POS', icon: null, color: '#f59e0b' },
  { id: 'intranet', name: 'Intranet', icon: null, color: '#8b5cf6' },
];
