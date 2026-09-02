# 📚 Ejemplos de Uso - Carga Asíncrona en Design System

## Índice
1. [Hook useAsyncData](#useasyncdata)
2. [Hook useAsyncSelect](#useasyncselect)
3. [Hook useAsyncDropdown](#useasyncdropdown)
4. [Componente Select con carga asíncrona](#select-async)
5. [Componente Dropdown con carga asíncrona](#dropdown-async)
6. [Componente ProgressBar indeterminado](#progressbar-indeterminate)

---

## useAsyncData

Hook genérico para cargar datos desde una API con mapeo configurable.

### Ejemplo Básico

```tsx
import { useAsyncData } from '@farutech/design-system'

interface User {
  id: number
  name: string
  email: string
}

interface ApiResponse {
  data: Array<{ id: number; name: string; email: string }>
}

function UserList() {
  const { data, isLoading, isError, error, refetch, reset } = useAsyncData<User, ApiResponse>({
    fetchData: async () => {
      const response = await fetch('/api/users')
      return response.json()
    },
    mapResponse: (response) => 
      response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    dependencies: [], // Se recarga cuando cambian estas dependencias
    minLoadingTime: 300, // Evita parpadeos si la carga es muy rápida
    immediate: true, // Se ejecuta automáticamente al montar
  })

  if (isLoading) return <div>Cargando usuarios...</div>
  if (isError) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refetch}>Recargar</button>
      <ul>
        {data.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Ejemplo con Dependencias

```tsx
function ProductList({ categoryId }: { categoryId: number }) {
  const { data, isLoading, refetch } = useAsyncData({
    fetchData: async () => {
      const response = await fetch(`/api/products?category=${categoryId}`)
      return response.json()
    },
    dependencies: [categoryId], // Se recarga cuando cambia la categoría
    immediate: true,
  })

  return <div>{/* Render products */}</div>
}
```

---

## useAsyncSelect

Hook específico para componentes Select que cargan opciones desde una API.

### Ejemplo Completo

```tsx
import { useAsyncSelect, Select } from '@farutech/design-system'

function CountrySelect() {
  const { data: countries, isLoading } = useAsyncSelect({
    fetchData: async () => {
      const response = await fetch('/api/countries')
      return response.json()
    },
    mapResponse: (countries) =>
      countries.map(country => ({
        label: country.name,
        value: country.code,
        disabled: !country.active,
      })),
    immediate: true,
  })

  return (
    <Select
      label="País"
      placeholder="Seleccione un país"
      asyncData={countries}
      isLoading={isLoading}
      loadingMessage="Cargando países..."
      emptyMessage="No hay países disponibles"
      onChange={(value) => console.log('País seleccionado:', value)}
    />
  )
}
```

### Ejemplo con Datos Estáticos (Hardcoded)

```tsx
function StaticSelect() {
  const options = [
    { label: 'Opción 1', value: 'opt1' },
    { label: 'Opción 2', value: 'opt2' },
    { label: 'Opción 3', value: 'opt3', disabled: true },
  ]

  return (
    <Select
      label="Opciones"
      options={options}
      placeholder="Seleccione"
    />
  )
}
```

---

## useAsyncDropdown

Hook específico para componentes Dropdown que cargan items desde una API.

### Ejemplo con Iconos

```tsx
import { useAsyncDropdown, Dropdown } from '@farutech/design-system'
import { EditIcon, DeleteIcon, ViewIcon } from './icons'

function ActionsDropdown({ itemId }: { itemId: number }) {
  const { data: actions, isLoading } = useAsyncDropdown({
    fetchData: async () => {
      const response = await fetch(`/api/items/${itemId}/actions`)
      return response.json()
    },
    mapResponse: (actions) =>
      actions.map(action => ({
        label: action.name,
        value: action.id,
        icon: action.icon === 'edit' ? EditIcon : action.icon === 'delete' ? DeleteIcon : ViewIcon,
        onClick: () => handleAction(action.id),
        disabled: !action.enabled,
      })),
    immediate: false, // No se carga automáticamente
  })

  const loadActions = () => {
    // Cargar acciones cuando se necesiten
  }

  return (
    <Dropdown
      label="Acciones"
      placeholder="Seleccionar acción"
      asyncItems={actions}
      isLoading={isLoading}
      loadingMessage="Cargando acciones..."
      emptyMessage="No hay acciones disponibles"
      onChange={(value) => console.log('Acción:', value)}
    />
  )
}
```

---

## Select con Carga Asíncrona

### Patrón 1: Usando el Hook (Recomendado)

```tsx
function DepartmentSelect() {
  const { data: departments, isLoading, error } = useAsyncSelect({
    fetchData: async () => {
      const response = await fetch('/api/departments')
      if (!response.ok) throw new Error('Error al cargar departamentos')
      return response.json()
    },
    mapResponse: (departments) =>
      departments.map(dept => ({
        label: dept.name,
        value: dept.id,
        disabled: dept.isClosed,
      })),
    minLoadingTime: 500, // Mostrar loading mínimo por 500ms
  })

  if (error) {
    return (
      <Select
        label="Departamento"
        error={error}
        asyncData={[]}
        isLoading={false}
      />
    )
  }

  return (
    <Select
      label="Departamento"
      asyncData={departments}
      isLoading={isLoading}
      loadingMessage="Cargando departamentos..."
      emptyMessage="No hay departamentos registrados"
      placeholder="Seleccione un departamento"
      helperText="Los departamentos cerrados no están disponibles"
    />
  )
}
```

### Patrón 2: Carga Manual con Callback

```tsx
function ManualLoadSelect() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(
        data.map(cat => ({
          label: cat.name,
          value: cat.id,
        }))
      )
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar al montar el componente
  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <Select
      label="Categoría"
      asyncData={categories}
      isLoading={isLoading}
      loadingMessage="Cargando categorías..."
      emptyMessage="Sin categorías"
    />
  )
}
```

---

## Dropdown con Carga Asíncrona

### Ejemplo con Menú Contextual

```tsx
function ContextMenu({ item }) {
  const [menuItems, setMenuItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadMenuItems = async () => {
    if (menuItems.length > 0) return // Ya cargados
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${item.id}/context-menu`)
      const data = await response.json()
      
      setMenuItems([
        ...data.map(action => ({
          label: action.label,
          value: action.id,
          icon: getIcon(action.type),
          onClick: () => executeAction(action),
        })),
        { divider: true }, // Separador
        {
          label: 'Eliminar',
          value: 'delete',
          icon: DeleteIcon,
          disabled: !item.canDelete,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dropdown
      items={menuItems}
      asyncItems={menuItems}
      isLoading={isLoading}
      placeholder="Más acciones"
      variant="ghost"
      size="sm"
    />
  )
}
```

---

## ProgressBar Indeterminado

Ideal para procesos donde no se conoce el tiempo estimado o el progreso exacto.

### Ejemplo de Carga Desconocida

```tsx
function UploadingFile() {
  const [isUploading, setIsUploading] = useState(true)

  const handleUpload = async () => {
    setIsUploading(true)
    try {
      await uploadFile(file)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <ProgressBar
        variant="indeterminate"
        color="primary"
        showSpinner={isUploading}
        loadingMessage="Subiendo archivo..."
        size="md"
      />
      {isUploading && <span>Por favor espere...</span>}
    </div>
  )
}
```

### Ejemplo con Progreso Conocido

```tsx
function FileDownload({ progress }) {
  return (
    <ProgressBar
      value={progress}
      max={100}
      label="Descargando archivo"
      showLabel={true}
      variant="gradient"
      color="success"
      size="lg"
    />
  )
}
```

### Comparación: Determinado vs Indeterminado

```tsx
function Comparison() {
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(true)

  // Simular proceso conocido
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {/* Progreso indeterminado - inicio del proceso */}
      {isProcessing && progress === 0 && (
        <ProgressBar
          variant="indeterminate"
          label="Iniciando proceso..."
          showSpinner
          loadingMessage="Preparando..."
        />
      )}

      {/* Progreso determinado - durante el proceso */}
      {!isProcessing || progress > 0 && (
        <ProgressBar
          value={progress}
          label="Procesando datos"
          showLabel
          variant="gradient"
          color="primary"
        />
      )}
    </div>
  )
}
```

---

## Patrones Comunes

### 1. Formulario con Múltiples Selects Asíncronos

```tsx
function RegistrationForm() {
  const { data: countries } = useAsyncSelect({
    fetchData: async () => fetch('/api/countries').then(r => r.json()),
    mapResponse: data => data.map(c => ({ label: c.name, value: c.id })),
  })

  const { data: states, isLoading: statesLoading } = useAsyncSelect({
    fetchData: async () => {
      if (!selectedCountry) return []
      return fetch(`/api/states?country=${selectedCountry}`).then(r => r.json())
    },
    mapResponse: data => data.map(s => ({ label: s.name, value: s.id })),
    dependencies: [selectedCountry], // Recargar cuando cambie el país
    immediate: !!selectedCountry,
  })

  const { data: cities, isLoading: citiesLoading } = useAsyncSelect({
    fetchData: async () => {
      if (!selectedState) return []
      return fetch(`/api/cities?state=${selectedState}`).then(r => r.json())
    },
    mapResponse: data => data.map(c => ({ label: c.name, value: c.id })),
    dependencies: [selectedState],
    immediate: !!selectedState,
  })

  return (
    <form>
      <Select
        label="País"
        asyncData={countries}
        onChange={setSelectedCountry}
        placeholder="Seleccione país"
      />
      
      <Select
        label="Estado/Provincia"
        asyncData={states}
        isLoading={statesLoading}
        disabled={!selectedCountry}
        placeholder="Seleccione estado"
      />
      
      <Select
        label="Ciudad"
        asyncData={cities}
        isLoading={citiesLoading}
        disabled={!selectedState}
        placeholder="Seleccione ciudad"
      />
    </form>
  )
}
```

### 2. Tabla con Filtros Asíncronos

```tsx
function DataTable() {
  const { data: categories } = useAsyncSelect({
    fetchData: async () => fetch('/api/categories').then(r => r.json()),
    mapResponse: data => [{ label: 'Todas', value: '' }, ...data.map(c => ({ label: c.name, value: c.id }))],
  })

  const { data: statuses } = useAsyncSelect({
    fetchData: async () => fetch('/api/statuses').then(r => r.json()),
    mapResponse: data => [{ label: 'Todos', value: '' }, ...data.map(s => ({ label: s.name, value: s.id }))],
  })

  return (
    <div>
      <div className="filters">
        <Select
          label="Categoría"
          asyncData={categories}
          onChange={setFilterCategory}
        />
        <Select
          label="Estado"
          asyncData={statuses}
          onChange={setFilterStatus}
        />
      </div>
      
      <DataTable
        filters={{ category: filterCategory, status: filterStatus }}
      />
    </div>
  )
}
```

### 3. Cascada de Selects Dependientes

```tsx
function LocationSelector() {
  const continent = useFormValue('continent')
  const country = useFormValue('country')
  const state = useFormValue('state')

  const continents = useAsyncSelect({ /* ... */ })
  const countries = useAsyncSelect({
    dependencies: [continent],
    immediate: !!continent,
    // ...
  })
  const states = useAsyncSelect({
    dependencies: [country],
    immediate: !!country,
    // ...
  })
  const cities = useAsyncSelect({
    dependencies: [state],
    immediate: !!state,
    // ...
  })

  return (
    <>
      <Select label="Continente" {...continents} />
      <Select label="País" {...countries} disabled={!continent} />
      <Select label="Estado" {...states} disabled={!country} />
      <Select label="Ciudad" {...cities} disabled={!state} />
    </>
  )
}
```

---

## Mejores Prácticas

### ✅ Hacer

1. **Usar minLoadingTime** para evitar parpadeos en cargas rápidas
2. **Manejar estados de error** apropiadamente
3. **Deshabilitar selects** mientras cargan datos dependientes
4. **Proporcionar mensajes claros** de loading y empty state
5. **Usar el hook useAsyncData** para lógica personalizada

### ❌ No Hacer

1. **No mezclar** `options` y `asyncData` simultáneamente
2. **No olvidar** manejar el estado de error
3. **No usar** `immediate: true` si hay dependencias que pueden ser undefined
4. **No mostrar** el componente sin un estado de loading adecuado

---

## Referencias

- [Documentación de Hooks](./HOOKS.md)
- [Documentación de Componentes](./COMPONENTS.md)
- [Ejemplos de CRUD](./CRUD_EXAMPLES.md)
