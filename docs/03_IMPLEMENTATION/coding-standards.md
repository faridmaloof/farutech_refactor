# 📝 Estándares de Código — Farutech

**Objetivo:** Mantener consistencia, calidad y legibilidad en todo el código del proyecto.

---

## 🎯 Principios Generales

1. **Clean Code:** Funciones pequeñas, nombres descriptivos, una responsabilidad por archivo
2. **DRY (Don't Repeat Yourself):** Reutiliza lógica común en servicios y utilidades
3. **KISS (Keep It Simple, Stupid):** Evita sobre-ingeniería
4. **YAGNI (You Ain't Gonna Need It):** No implementes funcionalidades "por si acaso"

---

## 💻 Backend (Laravel/PHP)

### Convenciones de Nomenclatura

```php
// Clases: PascalCase
class LeadController { }

// Métodos: camelCase
public function getLeads() { }

// Variables: camelCase
$leadStatus = 'new';

// Constantes: UPPER_SNAKE_CASE
const MAX_LEADS_PER_PAGE = 20;

// Tablas BD: snake_case plural
Schema::create('lead_interactions', function (Blueprint $table) { });
```

### Estructura de Controladores

```php
<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LeadStoreRequest;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;

class LeadController extends Controller
{
    /**
     * Display a listing of leads.
     */
    public function index(LeadIndexRequest $request): JsonResponse
    {
        // Implementación
    }
}
```

### Reglas Obligatorias

- ✅ Type hints en todos los parámetros y retornos
- ✅ PHPDoc en métodos públicos
- ✅ Validación en FormRequests, no en controladores
- ✅ Uso de recursos API para respuestas JSON
- ✅ Tests para cada método de controlador

---

## ⚛️ Frontend (React/TypeScript)

### Convenciones de Nomenclatura

```typescript
// Componentes: PascalCase
interface LeadTableProps { }
const LeadTable: React.FC<LeadTableProps> = () => { };

// Hooks: camelCase con prefijo 'use'
const useLeads = () => { };

// Utilidades: camelCase
export const formatCurrency = (amount: number) => { };

// Tipos e Interfaces: PascalCase
interface Lead { id: string; name: string; }
type LeadStatus = 'new' | 'contacted' | 'qualified';
```

### Estructura de Componentes

```typescript
import React from 'react';
import { DataTable } from '@farutech/ui';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../types';

interface LeadsTableProps {
  pageSize?: number;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ 
  pageSize = 20 
}) => {
  const { leads, loading, error } = useLeads({ pageSize });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={leads}
      columns={columns}
      data-testid="leads-table"
    />
  );
};
```

### Reglas Obligatorias

- ✅ TypeScript estricto (sin `any`)
- ✅ Functional components con hooks
- ✅ `data-testid` en elementos clave para E2E tests
- ✅ Importaciones ordenadas (externas → internas → estilos)
- ✅ Archivos pequeños (< 300 líneas)

---

## 🧪 Testing

### Backend (PHPUnit)

```php
/** @test */
public function it_returns_leads_filtered_by_status(): void
{
    // Arrange
    Lead::factory()->create(['status' => 'qualified']);

    // Act
    $response = $this->getJson('/api/v1/admin/leads?status=qualified');

    // Assert
    $response->assertStatus(200)
             ->assertJsonCount(1, 'data');
}
```

### Frontend (Vitest + React Testing Library)

```typescript
describe('LeadsTable', () => {
  it('renders empty state when no leads', async () => {
    render(<LeadsTable />);
    
    expect(await screen.findByText('Sin leads')).toBeInTheDocument();
  });

  it('displays leads when loaded', async () => {
    server.use(rest.get('/api/leads', (req, res, ctx) => {
      return res(ctx.json([{ id: '1', name: 'John' }]));
    }));

    render(<LeadsTable />);
    
    expect(await screen.findByText('John')).toBeInTheDocument();
  });
});
```

---

## 🔧 Herramientas de Linting

### Backend

```bash
composer run lint        # PHPStan
composer run format      # PHP CS Fixer
composer run test        # PHPUnit
```

### Frontend

```bash
npm run lint             # ESLint
npm run typecheck        # TypeScript
npm run test             # Vitest
npm run format           # Prettier
```

---

## 📁 Organización de Archivos

### Backend

```
app/
├── Http/
│   ├── Controllers/Api/V1/Admin/
│   └── Requests/
├── Models/
├── Services/
└── Jobs/
```

### Frontend

```
src/
├── features/
│   └── leads/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── pages/
├── entities/
└── shared/
```

---

## 🚫 Anti-patrones a Evitar

❌ **Controladores God Class** (> 200 líneas)  
❌ **Componentes Anidados** (> 3 niveles de props drilling)  
❌ **Magic Numbers** (usar constantes)  
❌ **Console.log** en producción  
❌ **Cualquier cosa** sin tests  

---

## ✅ Checklist Antes de Commit

- [ ] Código sigue estándares
- [ ] Tests pasando localmente
- [ ] Lint sin errores
- [ ] Typecheck sin errores
- [ ] Documentación actualizada (si aplica)
- [ ] Changelog actualizado (si aplica)
