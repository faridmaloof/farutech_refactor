import React, { useState, useMemo } from 'react';

// ==================== TYPES ====================

export interface Column<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface GlobalAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  tooltip?: string;
}

export interface RowAction<T = any> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  disabled?: (record: T) => boolean;
  tooltip?: string;
  showInMenu?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'multiselect' | 'custom';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  render?: (onChange: (value: any) => void, value: any) => React.ReactNode;
}

export interface CRUDTableProps<T = any> {
  // Datos
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  
  // Acciones globales (al lado del botón Create)
  globalActions?: GlobalAction[];
  
  // Acciones por registro
  rowActions?: RowAction<T>[];
  
  // Creación y configuración
  onCreate?: () => void;
  createLabel?: string;
  showCreateButton?: boolean;
  
  // Búsqueda y filtros
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  onFilterChange?: (filters: Record<string, any>) => void;
  
  // Paginación
  pagination?: boolean;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  currentPage?: number;
  
  // Selección múltiple
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Ordenamiento
  sortable?: boolean;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  
  // Exportar
  exportable?: boolean;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  
  // Personalización
  className?: string;
  emptyMessage?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  
  // Bulk actions (acciones masivas)
  bulkActions?: GlobalAction[];
}

// ==================== COMPONENTE PRINCIPAL ====================

/**
 * CRUDTable - Componente CRUD avanzado y dinámico
 * 
 * Características:
 * - Acciones globales configurables (al lado del botón Create)
 * - Acciones por registro (en menú contextual o botones inline)
 * - Búsqueda y filtros dinámicos
 * - Paginación, ordenamiento y selección múltiple
 * - Exportación a CSV/Excel/PDF
 * - Totalmente configurable vía props
 * - Psicología del color aplicada
 */
export function CRUDTable<T = any>({
  data,
  columns,
  loading = false,
  globalActions = [],
  rowActions = [],
  onCreate,
  createLabel = 'Crear',
  showCreateButton = true,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  onSearch,
  filters = [],
  onFilterChange,
  pagination = true,
  pageSize = 10,
  total,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortable = true,
  onSortChange,
  exportable = false,
  onExport,
  className = '',
  emptyMessage = 'No hay datos disponibles',
  rowKey,
  bulkActions = [],
}: CRUDTableProps<T>) {
  // Estados locales
  const [localSearch, setLocalSearch] = useState('');
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize] = useState(pageSize);
  const [localSort, setLocalSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Obtener key única para cada row
  const getRowKey = (record: T, index: number): string | number => {
    if (rowKey) {
      return typeof rowKey === 'function' ? rowKey(record) : record[rowKey as keyof T] as string | number;
    }
    return index;
  };

  // Filtrar y ordenar datos
  const processedData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (localSearch && searchable) {
      const searchLower = localSearch.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => {
          const value = item[col.key as keyof T];
          return String(value).toLowerCase().includes(searchLower);
        })
      );
    }

    // Aplicar filtros
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter((item) => {
          const itemValue = item[key as keyof T];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return String(itemValue) === String(value);
        });
      }
    });

    // Aplicar ordenamiento
    if (localSort) {
      result.sort((a, b) => {
        const aValue = a[localSort.key as keyof T];
        const bValue = b[localSort.key as keyof T];
        
        if (aValue < bValue) return localSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return localSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, localSearch, localFilters, localSort, columns, searchable]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (localPage - 1) * localPageSize;
    return processedData.slice(start, start + localPageSize);
  }, [processedData, localPage, localPageSize, pagination]);

  // Handlers
  const handleSearch = (value: string) => {
    setLocalSearch(value);
    setLocalPage(1);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    setLocalPage(1);
    onFilterChange?.(newFilters);
  };

  const handleSort = (key: string) => {
    if (!sortable) return;
    
    let newDirection: 'asc' | 'desc' = 'asc';
    if (localSort && localSort.key === key && localSort.direction === 'asc') {
      newDirection = 'desc';
    }
    
    const newSort = { key, direction: newDirection };
    setLocalSort(newSort);
    onSortChange?.(key, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && onSelectionChange) {
      onSelectionChange(processedData);
    } else if (!checked && onSelectionChange) {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (record: T) => {
    if (!onSelectionChange) return;
    
    const isSelected = selectedRows.some(
      (row) => getRowKey(row, 0) === getRowKey(record, 0)
    );
    
    if (isSelected) {
      onSelectionChange(selectedRows.filter(
        (row) => getRowKey(row, 0) !== getRowKey(record, 0)
      ));
    } else {
      onSelectionChange([...selectedRows, record]);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    onExport?.(format);
    setShowExportMenu(false);
  };

  const hasSelectedRows = selectedRows.length > 0;

  return (
    <div className={`crud-table ${className}`}>
      <style>{`
        .crud-table {
          background: white;
          border-radius: var(--radius-lg, 0.5rem);
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
          overflow: hidden;
        }

        /* Toolbar */
        .crud-table__toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
          gap: 1rem;
          flex-wrap: wrap;
        }

        .crud-table__toolbar-left,
        .crud-table__toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Bulk actions */
        .crud-table__bulk-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--color-primary-50, #ecfdf5);
          border-radius: var(--radius-md, 0.375rem);
          color: var(--color-primary-800, #065f46);
        }

        .crud-table__bulk-count {
          font-weight: 600;
          margin-right: 0.5rem;
        }

        /* Search */
        .crud-table__search {
          position: relative;
        }

        .crud-table__search-input {
          padding: 0.625rem 1rem 0.625rem 2.5rem;
          border: 1px solid var(--color-gray-300, #d1d5db);
          border-radius: var(--radius-md, 0.375rem);
          font-size: 0.875rem;
          width: 280px;
          transition: all 0.2s ease;
        }

        .crud-table__search-input:focus {
          outline: none;
          border-color: var(--color-primary-500, #10b981);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .crud-table__search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-400, #9ca3af);
        }

        /* Buttons */
        .crud-table__btn {
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-md, 0.375rem);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .crud-table__btn--primary {
          background: linear-gradient(135deg, var(--color-primary-600, #10b981) 0%, var(--color-primary-700, #059669) 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
        }

        .crud-table__btn--primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(16, 185, 129, 0.4);
        }

        .crud-table__btn--secondary {
          background: white;
          color: var(--color-gray-700, #374151);
          border: 1px solid var(--color-gray-300, #d1d5db);
        }

        .crud-table__btn--secondary:hover:not(:disabled) {
          background: var(--color-gray-50, #f9fafb);
        }

        .crud-table__btn--danger {
          background: var(--color-error, #ef4444);
          color: white;
        }

        .crud-table__btn--success {
          background: var(--color-success, #10b981);
          color: white;
        }

        .crud-table__btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Filters */
        .crud-table__filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          background: var(--color-gray-50, #f9fafb);
          border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
          flex-wrap: wrap;
        }

        .crud-table__filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .crud-table__filter-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-gray-600, #4b5563);
          text-transform: uppercase;
        }

        .crud-table__filter-select,
        .crud-table__filter-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-gray-300, #d1d5db);
          border-radius: var(--radius-sm, 0.25rem);
          font-size: 0.875rem;
          min-width: 150px;
        }

        .crud-table__filter-select:focus,
        .crud-table__filter-input:focus {
          outline: none;
          border-color: var(--color-primary-500, #10b981);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        /* Table */
        .crud-table__table-container {
          overflow-x: auto;
        }

        .crud-table__table {
          width: 100%;
          border-collapse: collapse;
        }

        .crud-table__thead {
          background: var(--color-gray-50, #f9fafb);
        }

        .crud-table__th {
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-gray-600, #4b5563);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid var(--color-gray-200, #e5e7eb);
          white-space: nowrap;
        }

        .crud-table__th--sortable {
          cursor: pointer;
          user-select: none;
        }

        .crud-table__th--sortable:hover {
          background: var(--color-gray-100, #f3f4f6);
        }

        .crud-table__sort-icon {
          margin-left: 0.5rem;
          opacity: 0.3;
        }

        .crud-table__th--sorted .crud-table__sort-icon {
          opacity: 1;
          color: var(--color-primary-600, #10b981);
        }

        .crud-table__td {
          padding: 1rem;
          border-bottom: 1px solid var(--color-gray-100, #f3f4f6);
          font-size: 0.875rem;
          color: var(--color-gray-900, #111827);
        }

        .crud-table__tbody tr:hover {
          background: var(--color-gray-50, #f9fafb);
        }

        /* Row actions */
        .crud-table__actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .crud-table__action-btn {
          padding: 0.375rem 0.625rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-sm, 0.25rem);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .crud-table__action-btn--primary {
          color: var(--color-primary-600, #10b981);
        }

        .crud-table__action-btn--primary:hover {
          background: var(--color-primary-50, #ecfdf5);
        }

        .crud-table__action-btn--secondary {
          color: var(--color-gray-600, #4b5563);
        }

        .crud-table__action-btn--secondary:hover {
          background: var(--color-gray-100, #f3f4f6);
        }

        .crud-table__action-btn--danger {
          color: var(--color-error, #ef4444);
        }

        .crud-table__action-btn--danger:hover {
          background: var(--color-error-50, #fef2f2);
        }

        .crud-table__action-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Pagination */
        .crud-table__pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--color-gray-200, #e5e7eb);
        }

        .crud-table__pagination-info {
          font-size: 0.875rem;
          color: var(--color-gray-600, #4b5563);
        }

        .crud-table__pagination-controls {
          display: flex;
          gap: 0.5rem;
        }

        .crud-table__page-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-gray-300, #d1d5db);
          background: white;
          border-radius: var(--radius-sm, 0.25rem);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .crud-table__page-btn:hover:not(:disabled) {
          background: var(--color-gray-50, #f9fafb);
        }

        .crud-table__page-btn--active {
          background: var(--color-primary-600, #10b981);
          color: white;
          border-color: var(--color-primary-600, #10b981);
        }

        .crud-table__page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading */
        .crud-table__loading {
          padding: 3rem;
          text-align: center;
          color: var(--color-gray-500, #6b7280);
        }

        .crud-table__spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--color-gray-200, #e5e7eb);
          border-top-color: var(--color-primary-600, #10b981);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty state */
        .crud-table__empty {
          padding: 3rem;
          text-align: center;
          color: var(--color-gray-500, #6b7280);
        }

        /* Export menu */
        .crud-table__export-menu {
          position: relative;
        }

        .crud-table__export-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid var(--color-gray-200, #e5e7eb);
          border-radius: var(--radius-md, 0.375rem);
          box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
          z-index: 10;
          min-width: 150px;
        }

        .crud-table__export-item {
          padding: 0.625rem 1rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--color-gray-700, #374151);
          transition: background 0.2s ease;
        }

        .crud-table__export-item:hover {
          background: var(--color-gray-50, #f9fafb);
        }

        /* Checkbox */
        .crud-table__checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: var(--color-primary-600, #10b981);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .crud-table__toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .crud-table__toolbar-left,
          .crud-table__toolbar-right {
            justify-content: stretch;
          }

          .crud-table__search-input {
            width: 100%;
          }

          .crud-table__filters {
            flex-direction: column;
          }

          .crud-table__filter-select,
          .crud-table__filter-input {
            min-width: 100%;
          }
        }
      `}</style>

      {/* Toolbar superior */}
      <div className="crud-table__toolbar">
        <div className="crud-table__toolbar-left">
          {/* Bulk actions */}
          {hasSelectedRows && bulkActions.length > 0 && (
            <div className="crud-table__bulk-actions">
              <span className="crud-table__bulk-count">
                {selectedRows.length} seleccionado{selectedRows.length !== 1 ? 's' : ''}
              </span>
              {bulkActions.map((action) => (
                <button
                  key={action.id}
                  className={`crud-table__btn crud-table__btn--${action.variant || 'secondary'}`}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  title={action.tooltip}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Botón Create */}
          {showCreateButton && onCreate && (
            <button className="crud-table__btn crud-table__btn--primary" onClick={onCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {createLabel}
            </button>
          )}

          {/* Acciones globales */}
          {globalActions.map((action) => (
            <button
              key={action.id}
              className={`crud-table__btn crud-table__btn--${action.variant || 'secondary'}`}
              onClick={action.onClick}
              disabled={action.disabled}
              title={action.tooltip}
            >
              {action.icon}
              {action.label}
            </button>
          ))}

          {/* Botón Exportar */}
          {exportable && onExport && (
            <div className="crud-table__export-menu">
              <button
                className="crud-table__btn crud-table__btn--secondary"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Exportar
              </button>
              {showExportMenu && (
                <div className="crud-table__export-dropdown">
                  <div className="crud-table__export-item" onClick={() => handleExport('csv')}>
                    📄 CSV
                  </div>
                  <div className="crud-table__export-item" onClick={() => handleExport('excel')}>
                    📊 Excel
                  </div>
                  <div className="crud-table__export-item" onClick={() => handleExport('pdf')}>
                    📑 PDF
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="crud-table__toolbar-right">
          {/* Búsqueda */}
          {searchable && (
            <div className="crud-table__search">
              <svg
                className="crud-table__search-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                className="crud-table__search-input"
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      {filters.length > 0 && (
        <div className="crud-table__filters">
          {filters.map((filter) => (
            <div key={filter.key} className="crud-table__filter-item">
              <label className="crud-table__filter-label">{filter.label}</label>
              {filter.type === 'select' && filter.options ? (
                <select
                  className="crud-table__filter-select"
                  value={localFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'text' ? (
                <input
                  type="text"
                  className="crud-table__filter-input"
                  placeholder={filter.placeholder}
                  value={localFilters[filter.key] || ''}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                />
              ) : filter.render ? (
                filter.render(
                  (value: any) => handleFilterChange(filter.key, value),
                  localFilters[filter.key]
                )
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Tabla */}
      <div className="crud-table__table-container">
        {loading ? (
          <div className="crud-table__loading">
            <div className="crud-table__spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="crud-table__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
              <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <table className="crud-table__table">
            <thead className="crud-table__thead">
              <tr>
                {selectable && (
                  <th className="crud-table__th" style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      className="crud-table__checkbox"
                      checked={selectedRows.length === processedData.length && processedData.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((column) => {
                  const isSorted = localSort?.key === column.key;
                  return (
                    <th
                      key={String(column.key)}
                      className={`crud-table__th ${column.sortable && sortable ? 'crud-table__th--sortable' : ''} ${isSorted ? 'crud-table__th--sorted' : ''}`}
                      style={{ width: column.width, textAlign: column.align }}
                      onClick={() => column.sortable && handleSort(String(column.key))}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {column.label}
                        {column.sortable && sortable && (
                          <span className="crud-table__sort-icon">
                            {isSorted && localSort?.direction === 'desc' ? '↓' : '↑'}
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
                {rowActions.length > 0 && (
                  <th className="crud-table__th" style={{ width: 'auto', textAlign: 'right' }}>
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                return (
                  <tr key={key}>
                    {selectable && (
                      <td className="crud-table__td">
                        <input
                          type="checkbox"
                          className="crud-table__checkbox"
                          checked={selectedRows.some(
                            (row) => getRowKey(row, 0) === key
                          )}
                          onChange={() => handleSelectRow(record)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="crud-table__td"
                        style={{ textAlign: column.align }}
                      >
                        {column.render
                          ? column.render(record[column.key as keyof T], record, index)
                          : String(record[column.key as keyof T] ?? '')}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="crud-table__td">
                        <div className="crud-table__actions">
                          {rowActions
                            .filter((action) => !action.showInMenu)
                            .map((action) => (
                              <button
                                key={action.id}
                                className={`crud-table__action-btn crud-table__action-btn--${action.variant || 'primary'}`}
                                onClick={() => action.onClick(record)}
                                disabled={action.disabled?.(record)}
                                title={action.tooltip}
                              >
                                {action.icon}
                                {action.label}
                              </button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {pagination && processedData.length > 0 && (
        <div className="crud-table__pagination">
          <div className="crud-table__pagination-info">
            Mostrando {(localPage - 1) * localPageSize + 1} a{' '}
            {Math.min(localPage * localPageSize, processedData.length)} de{' '}
            {total ?? processedData.length} resultados
          </div>
          <div className="crud-table__pagination-controls">
            <button
              className="crud-table__page-btn"
              onClick={() => setLocalPage(1)}
              disabled={localPage === 1}
            >
              Primera
            </button>
            <button
              className="crud-table__page-btn"
              onClick={() => setLocalPage(localPage - 1)}
              disabled={localPage === 1}
            >
              Anterior
            </button>
            <span className="crud-table__page-btn crud-table__page-btn--active">
              {localPage}
            </span>
            <button
              className="crud-table__page-btn"
              onClick={() => setLocalPage(localPage + 1)}
              disabled={localPage * localPageSize >= processedData.length}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRUDTable;
