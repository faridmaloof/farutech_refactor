import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface UseCRUDOptions<T> {
  initialData?: T[];
  itemsPerPage?: number;
  onFetch?: () => Promise<T[]>;
  onCreate?: (item: Omit<T, 'id'>) => Promise<void>;
  onUpdate?: (id: string | number, item: Partial<T>) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onBulkAction?: (ids: (string | number)[], action: string) => Promise<void>;
}

export interface UseCRUDReturn<T> {
  // Data
  data: T[];
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  pagination: PaginationState;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  totalPages: number;
  paginatedData: T[];
  
  // Sorting
  sortConfig: SortState | null;
  requestSort: (field: string) => void;
  
  // Selection
  selectedIds: (string | number)[];
  toggleSelection: (id: string | number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredData: T[];
  
  // Actions
  refresh: () => Promise<void>;
  handleCreate: (item: Omit<T, 'id'>) => Promise<void>;
  handleUpdate: (id: string | number, item: Partial<T>) => Promise<void>;
  handleDelete: (id: string | number) => Promise<void>;
  handleBulkAction: (action: string) => Promise<void>;
}

export function useCRUD<T extends { id: string | number }>({
  initialData = [],
  itemsPerPage = 10,
  onFetch,
  onCreate,
  onUpdate,
  onDelete,
  onBulkAction,
}: UseCRUDOptions<T>): UseCRUDReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: itemsPerPage,
    totalItems: initialData.length,
  });
  
  // Sorting
  const [sortConfig, setSortConfig] = useState<SortState | null>(null);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Refresh Data
  const refresh = useCallback(async () => {
    if (!onFetch) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedData = await onFetch();
      setData(fetchedData);
      setPagination(prev => ({ ...prev, totalItems: fetchedData.length }));
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [onFetch]);

  // Handlers
  const handleCreate = useCallback(async (item: Omit<T, 'id'>) => {
    if (!onCreate) return;
    setIsLoading(true);
    try {
      await onCreate(item);
      await refresh();
    } catch (err) {
      setError('Failed to create item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onCreate, refresh]);

  const handleUpdate = useCallback(async (id: string | number, item: Partial<T>) => {
    if (!onUpdate) return;
    setIsLoading(true);
    try {
      await onUpdate(id, item);
      await refresh();
    } catch (err) {
      setError('Failed to update item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onUpdate, refresh]);

  const handleDelete = useCallback(async (id: string | number) => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(id);
      await refresh();
    } catch (err) {
      setError('Failed to delete item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onDelete, refresh]);

  const handleBulkAction = useCallback(async (action: string) => {
    if (!onBulkAction || selectedIds.length === 0) return;
    setIsLoading(true);
    try {
      await onBulkAction(selectedIds, action);
      setSelectedIds([]);
      await refresh();
    } catch (err) {
      setError('Failed to perform bulk action');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onBulkAction, selectedIds, refresh]);

  // Pagination Logic
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const setPageSize = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

  // Sorting Logic
  const requestSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
  };

  // Selection Logic
  const toggleSelection = (id: string | number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(paginatedData.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.includes(item.id));

  // Search & Filter Logic
  const filteredData = useMemo(() => {
    let result = [...data];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerQuery)
        )
      );
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof T];
        const bValue = b[sortConfig.field as keyof T];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination.currentPage, pagination.pageSize]);

  return {
    data,
    isLoading,
    error,
    pagination,
    setPage,
    setPageSize,
    totalPages,
    paginatedData,
    sortConfig,
    requestSort,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isAllSelected,
    searchQuery,
    setSearchQuery,
    filteredData,
    refresh,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkAction,
  };
}
