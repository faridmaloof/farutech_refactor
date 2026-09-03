/**
 * Hooks para carga asíncrona de datos en componentes
 * Soporta APIs REST, mapeo de respuestas y estados de loading/error
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export interface AsyncDataOptions<T, R = any> {
  /** Función que ejecuta la petición a la API */
  fetchData: () => Promise<R>
  /** Función para mapear la respuesta de la API al formato esperado */
  mapResponse?: (data: R) => T[]
  /** Depuraciones que disparan la recarga automática */
  dependencies?: any[]
  /** Retraso mínimo para mostrar el estado de loading (evita parpadeos) */
  minLoadingTime?: number
  /** Si true, se ejecuta automáticamente al montar el componente */
  immediate?: boolean
}

export interface AsyncDataState<T> {
  data: T[]
  isLoading: boolean
  isError: boolean
  error: string | null
  hasLoaded: boolean
  refetch: () => Promise<void>
  reset: () => void
}

/**
 * Hook genérico para carga asíncrona de datos con mapeo
 * Ideal para Select, Dropdown, ListBox, etc.
 */
export function useAsyncData<T = any, R = any>({
  fetchData,
  mapResponse,
  dependencies = [],
  minLoadingTime = 300,
  immediate = true,
}: AsyncDataOptions<T, R>): AsyncDataState<T> {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  
  const startTimeRef = useRef<number | null>(null)
  const isMountedRef = useRef(true)

  const executeFetch = useCallback(async () => {
    if (!isMountedRef.current) return
    
    setIsLoading(true)
    setIsError(false)
    setError(null)
    startTimeRef.current = Date.now()

    try {
      const response = await fetchData()
      
      // Calcular tiempo restante para completar el minLoadingTime
      const elapsedTime = Date.now() - startTimeRef.current
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
      
      // Esperar el tiempo mínimo si es necesario
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }
      
      if (!isMountedRef.current) return
      
      // Mapear la respuesta si se proporciona la función, sino asumir que ya viene en el formato correcto
      const mappedData = mapResponse ? mapResponse(response) : (response as unknown as T[])
      
      setData(mappedData)
      setHasLoaded(true)
    } catch (err) {
      if (!isMountedRef.current) return
      
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos'
      setError(errorMessage)
      setIsError(true)
      setHasLoaded(true)
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [fetchData, mapResponse, minLoadingTime])

  useEffect(() => {
    isMountedRef.current = true
    
    if (immediate) {
      executeFetch()
    }

    return () => {
      isMountedRef.current = false
    }
  }, [...dependencies, immediate])

  const refetch = useCallback(async () => {
    await executeFetch()
  }, [executeFetch])

  const reset = useCallback(() => {
    setData([])
    setIsLoading(false)
    setIsError(false)
    setError(null)
    setHasLoaded(false)
  }, [])

  return {
    data,
    isLoading,
    isError,
    error,
    hasLoaded,
    refetch,
    reset,
  }
}

/**
 * Hook específico para Select con carga asíncrona
 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export function useAsyncSelect<R = any>({
  fetchData,
  mapResponse,
  dependencies = [],
  immediate = true,
}: Omit<AsyncDataOptions<SelectOption, R>, 'mapResponse'> & {
  mapResponse?: (data: R) => SelectOption[]
}) {
  return useAsyncData<SelectOption, R>({
    fetchData,
    mapResponse,
    dependencies,
    immediate,
  })
}

/**
 * Hook específico para Dropdown con carga asíncrona
 */
export interface DropdownItem {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

export function useAsyncDropdown<R = any>({
  fetchData,
  mapResponse,
  dependencies = [],
  immediate = true,
}: Omit<AsyncDataOptions<DropdownItem, R>, 'mapResponse'> & {
  mapResponse?: (data: R) => DropdownItem[]
}) {
  return useAsyncData<DropdownItem, R>({
    fetchData,
    mapResponse,
    dependencies,
    immediate,
  })
}

/**
 * Hook para paginación asíncrona (útil para tablas, listas largas)
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface UseAsyncPaginationOptions<T, R = any> 
  extends AsyncDataOptions<T, R> {
  initialPage?: number
  perPage?: number
}

export function useAsyncPagination<T = any, R = any>({
  fetchData,
  mapResponse,
  dependencies = [],
  immediate = true,
  initialPage = 1,
  perPage = 10,
}: UseAsyncPaginationOptions<T, R>) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<T>>({
    data: [],
    total: 0,
    page: currentPage,
    perPage,
    totalPages: 0,
  })

  const { data, isLoading, isError, error, hasLoaded, refetch, reset } = 
    useAsyncData<T, R>({
      fetchData: () => fetchData(),
      mapResponse: mapResponse ? (data) => {
        const mapped = mapResponse(data)
        // Asumimos que la respuesta incluye metadatos de paginación
        // Si no, se puede personalizar en el mapResponse externo
        return mapped
      } : undefined,
      dependencies: [...dependencies, currentPage, perPage],
      immediate,
    })

  useEffect(() => {
    if (data.length > 0 || hasLoaded) {
      // Aquí se debería integrar con la lógica de paginación del backend
      // Esto es un placeholder para futuras implementaciones
      setPaginatedData(prev => ({
        ...prev,
        data,
        page: currentPage,
      }))
    }
  }, [data, currentPage, hasLoaded])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1)
  }, [])

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }, [])

  return {
    ...paginatedData,
    isLoading,
    isError,
    error,
    hasLoaded,
    refetch,
    reset,
    goToPage,
    nextPage,
    previousPage,
    setPage: setCurrentPage,
  }
}
