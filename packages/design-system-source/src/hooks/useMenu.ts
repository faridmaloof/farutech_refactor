import { useState, useCallback, useMemo } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
  badge?: number | string;
}

export interface UseMenuOptions {
  items: MenuItem[];
  userPermissions?: string[];
}

export interface UseMenuReturn {
  menuItems: MenuItem[];
  isExpanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  collapseAll: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export function useMenu({ items, userPermissions = [] }: UseMenuOptions): UseMenuReturn {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const filterByPermissions = useCallback((menuItems: MenuItem[]): MenuItem[] => {
    return menuItems.reduce((acc: MenuItem[], item) => {
      // Si no hay permisos definidos, incluir el item
      if (!item.permissions || item.permissions.length === 0) {
        acc.push(item);
        return acc;
      }

      // Verificar si el usuario tiene al menos uno de los permisos requeridos
      const hasPermission = item.permissions.some(perm => userPermissions.includes(perm));
      if (hasPermission) {
        // Filtrar también los hijos si existen
        if (item.children) {
          const filteredChildren = filterByPermissions(item.children);
          acc.push({ ...item, children: filteredChildren });
        } else {
          acc.push(item);
        }
      }

      return acc;
    }, []);
  }, [userPermissions]);

  const menuItems = useMemo(() => filterByPermissions(items), [items, filterByPermissions]);

  const toggleExpand = useCallback((id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const collapseAll = useCallback(() => {
    setIsExpanded({});
  }, []);

  return {
    menuItems,
    isExpanded,
    toggleExpand,
    collapseAll,
    activeId,
    setActiveId,
  };
}
