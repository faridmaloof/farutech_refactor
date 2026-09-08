/**
 * Sidebar reusable del Design System.
 * La configuración de navegación pertenece a la aplicación consumidora.
 */

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useSidebarStore } from '@/store/sidebarStore'
import { useModuleStore } from '@/store/moduleStore'
import { useConfig } from '@/contexts/ConfigContext'
import type { MenuCategory, MenuItem, MenuEntry } from '@/config/menu.config'
import { useMenu } from '@/hooks/useMenu'
import { ModuleSwitcher } from '@/components/ui'

function isCategory(entry: MenuEntry): entry is MenuCategory {
  return 'items' in entry
}

function MenuIcon({ icon, className }: { icon?: ReactNode; className?: string }) {
  if (!icon) return null
  return <span className={clsx('inline-flex shrink-0', className)}>{icon}</span>
}

function Badge({ value }: { value: string | number }) {
  return <span className="ml-auto inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{value}</span>
}

function MenuLink({ item, onNavigate }: { item: MenuItem; onNavigate: () => void }) {
  if (item.onClick) {
    return (
      <button type="button" onClick={() => { item.onClick?.(); onNavigate() }} disabled={item.disabled}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50">
        <MenuIcon icon={item.icon} className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge !== undefined && <Badge value={item.badge} />}
      </button>
    )
  }

  return (
    <NavLink
      to={item.path ?? '#'}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
      onClick={onNavigate}
      className={({ isActive }) => clsx(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      )}
    >
      <MenuIcon icon={item.icon} className="h-4 w-4" />
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && <Badge value={item.badge} />}
    </NavLink>
  )
}

function CategoryItem({ category, isExpanded, onToggle, onNavigate }: {
  category: MenuCategory
  isExpanded: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  return (
    <div className="overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors uppercase tracking-wider">
        <span className="flex items-center gap-2.5"><MenuIcon icon={category.icon} className="h-4 w-4" /><span>{category.label}</span></span>
        <ChevronRightIcon className={clsx('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-90')} />
      </button>
      {isExpanded && <div className="ml-4 mt-1 space-y-0.5">{category.items.map((item) => <MenuLink key={item.id} item={item} onNavigate={onNavigate} />)}</div>}
    </div>
  )
}

export function Sidebar() {
  const { isOpen, isMobile, close, setSidebarWidth } = useSidebarStore()
  const { currentModule, modules, setCurrentModule } = useModuleStore()
  const config = useConfig()
  const { menu } = useMenu()
  const navigate = useNavigate()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [localWidth, setLocalWidth] = useState(256)
  const [isResizing, setIsResizing] = useState(false)
  const resizeStart = useRef<{ x: number; width: number } | null>(null)

  const handleModuleChange = (moduleId: string) => {
    setCurrentModule(moduleId)
    const module = modules.find((candidate) => candidate.id === moduleId)
    if (module?.path) navigate(module.path)
  }

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!isOpen || isMobile) return
    event.preventDefault()
    resizeStart.current = { x: event.clientX, width: localWidth }
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return
    const handleMouseMove = (event: MouseEvent) => {
      const start = resizeStart.current
      if (!start) return
      const width = Math.min(Math.max(start.width + event.clientX - start.x, 200), 400)
      setLocalWidth(width)
      setSidebarWidth(width)
    }
    const handleMouseUp = () => { resizeStart.current = null; setIsResizing(false) }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, setSidebarWidth])

  const currentModuleId = currentModule ?? modules[0]?.id ?? ''

  return (
    <>
      {isMobile && isOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={close} aria-hidden="true" />}
      <aside
        style={{ width: isOpen && !isMobile ? `${localWidth}px` : undefined }}
        className={clsx(
          'fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[63px]',
          isMobile && 'w-64'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-center border-b border-gray-200 dark:border-gray-700 px-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center font-bold">{config.appName.charAt(0).toUpperCase()}</div>
              {isOpen && <span className="text-sm font-bold text-gray-900 dark:text-white">{config.appName}</span>}
            </div>
            {isMobile && <button type="button" onClick={close} className="ml-auto p-1.5 text-gray-500 lg:hidden" aria-label="Close sidebar"><XMarkIcon className="h-5 w-5" /></button>}
          </div>

          {isOpen && modules.length > 0 && (
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
              <ModuleSwitcher modules={modules} currentModule={currentModuleId} onModuleChange={handleModuleChange} searchable={false} compact={false} className="w-full" />
            </div>
          )}

          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {menu.map((entry) => isCategory(entry)
              ? <CategoryItem key={entry.id} category={entry} isExpanded={expandedCategory === entry.id} onToggle={() => setExpandedCategory((value) => value === entry.id ? null : entry.id)} onNavigate={() => isMobile && close()} />
              : <MenuLink key={entry.id} item={entry} onNavigate={() => isMobile && close()} />
            )}
          </nav>

          {isOpen && <div role="separator" aria-label="Resize sidebar" onMouseDown={handleMouseDown} className={clsx('absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary-400', isResizing && 'bg-primary-500')} />}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
