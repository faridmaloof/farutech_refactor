import { useState, useCallback, useMemo } from 'react';
import type { MenuItem, MenuCategory } from '@/config/menu.config';

export interface UseMenuOptions {
  items?: MenuItem[];
  categories?: MenuCategory[];
  userPermissions?: string[];
}

export interface UseMenuReturn {
  menu: MenuItem[];
  categories: MenuCategory[];
  isExpanded: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  collapseAll: () => void;
  expandAll: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export function useMenu({ items = [], categories = [], userPermissions = [] }: UseMenuOptions): UseMenuReturn {
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

  const menu = useMemo(() => {
    if (items && items.length > 0) {
      return filterByPermissions(items);
    }
    // Si se proporcionan categorías, aplanar los items
    if (categories && categories.length > 0) {
      const allItems = categories.flatMap(cat => cat.items);
      return filterByPermissions(allItems);
    }
    return [];
  }, [items, categories, filterByPermissions]);

  const toggleExpand = useCallback((id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const collapseAll = useCallback(() => {
    setIsExpanded({});
  }, []);

  const expandAll = useCallback(() => {
    const allIds: Record<string, boolean> = {};
    const collectIds = (menuItems: MenuItem[]) => {
      menuItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          allIds[item.id] = true;
          collectIds(item.children);
        }
      });
    };
    collectIds(menu);
    setIsExpanded(allIds);
  }, [menu]);

  return {
    menu,
    categories,
    isExpanded,
    toggleExpand,
    collapseAll,
    expandAll,
    activeId,
    setActiveId,
  };
}
