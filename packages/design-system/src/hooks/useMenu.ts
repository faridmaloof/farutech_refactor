import { useState, useCallback, useMemo } from 'react'
import type { MenuCategory, MenuEntry, MenuItem } from '@/config/menu.config'
import { defaultMenuConfig } from '@/config/menu.config'

export interface UseMenuOptions {
  items?: MenuItem[]
  categories?: MenuCategory[]
  userPermissions?: string[]
}

export interface UseMenuReturn {
  menu: MenuEntry[]
  categories: MenuCategory[]
  isExpanded: Record<string, boolean>
  toggleExpand: (id: string) => void
  collapseAll: () => void
  expandAll: () => void
  activeId: string | null
  setActiveId: (id: string | null) => void
}

function isCategory(entry: MenuEntry): entry is MenuCategory {
  return 'items' in entry
}

function filterItems(items: MenuItem[], userPermissions: string[]): MenuItem[] {
  return items.reduce<MenuItem[]>((acc, item) => {
    if (item.permissions?.length && !item.permissions.some((permission) => userPermissions.includes(permission))) {
      return acc
    }

    acc.push({
      ...item,
      children: item.children ? filterItems(item.children, userPermissions) : undefined,
    })
    return acc
  }, [])
}

function filterEntries(entries: MenuEntry[], userPermissions: string[]): MenuEntry[] {
  return entries.reduce<MenuEntry[]>((acc, entry) => {
    if (isCategory(entry)) {
      if (entry.permissions?.length && !entry.permissions.some((permission) => userPermissions.includes(permission))) {
        return acc
      }

      const items = filterItems(entry.items, userPermissions)
      acc.push({ ...entry, items })
      return acc
    }

    const filtered = filterItems([entry], userPermissions)
    if (filtered[0]) acc.push(filtered[0])
    return acc
  }, [])
}

export function useMenu({
  items = [],
  categories = defaultMenuConfig.categories,
  userPermissions = [],
}: UseMenuOptions = {}): UseMenuReturn {
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const menu = useMemo(() => {
    const entries: MenuEntry[] = items.length > 0 ? items : categories
    return filterEntries(entries, userPermissions)
  }, [items, categories, userPermissions])

  const filteredCategories = useMemo(
    () => menu.filter((entry): entry is MenuCategory => isCategory(entry)),
    [menu]
  )

  const toggleExpand = useCallback((id: string) => {
    setIsExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const collapseAll = useCallback(() => setIsExpanded({}), [])

  const expandAll = useCallback(() => {
    const allIds: Record<string, boolean> = {}
    const collectIds = (entries: MenuEntry[]) => {
      entries.forEach((entry) => {
        if (isCategory(entry)) {
          allIds[entry.id] = true
          collectIds(entry.items)
        } else if (entry.children?.length) {
          allIds[entry.id] = true
          collectIds(entry.children)
        }
      })
    }
    collectIds(menu)
    setIsExpanded(allIds)
  }, [menu])

  return {
    menu,
    categories: filteredCategories,
    isExpanded,
    toggleExpand,
    collapseAll,
    expandAll,
    activeId,
    setActiveId,
  }
}
