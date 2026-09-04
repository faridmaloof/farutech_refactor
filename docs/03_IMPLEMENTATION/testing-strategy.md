# 🧪 Estrategia de Testing — Farutech

**Objetivo:** Garantizar calidad, confiabilidad y mantenibilidad del código mediante una pirámide de pruebas bien definida.

---

## 📐 Pirámide de Testing

```
        /\
       /  \      E2E Tests (10%)
      /----\     - Flujos completos
     /      \    - Críticos para negocio
    /--------\   
   /          \  Integration Tests (20%)
  /------------\ - Servicios, DB, colas
 /              \- APIs externas
/----------------\ 
Unit Tests (70%)   - Componentes, funciones, utilidades
```

---

## 🔬 Tipos de Pruebas

### 1. Unit Tests

**Propósito:** Validar lógica aislada sin dependencias externas.

**Backend (PHPUnit):**
- Modelos (scopes, accessors, mutators)
- Servicios de dominio
- Utilidades y helpers
- Reglas de validación customizadas

**Frontend (Vitest + RTL):**
- Hooks customizados
- Utilidades y funciones puras
- Componentes UI aislados
- Selectores y filtros

**Cobertura mínima:** 80% en lógica crítica

### 2. Integration Tests

**Propósito:** Validar integración entre componentes.

**Backend:**
- Controladores + Requests + Resources
- Eventos + Listeners
- Jobs + Colas (Redis)
- Repositorios + Base de datos

**Frontend:**
- Componentes con servicios API mockeados
- Hooks con contexto de autenticación
- Formularios complejos

### 3. E2E Tests (End-to-End)

**Propósito:** Validar flujos completos desde la perspectiva del usuario.

**Herramienta:** Playwright (.NET Framework Automation)

**Flujos críticos:**
- Autenticación (login/logout)
- CRUD de Leads completo
- Búsqueda y conversión de Oportunidades
- Publicación de Blog Posts
- Suscripción a Newsletter

---

## 📝 Ejemplos Concretos

### Backend — Unit Test

```php
<?php

namespace Tests\Unit\Services;

use App\Services\LeadScoringService;
use Tests\TestCase;

class LeadScoringServiceTest extends TestCase
{
    private LeadScoringService $scorer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scorer = new LeadScoringService();
    }

    /** @test */
    public function it_calculates_quality_score_correctly(): void
    {
        $lead = [
            'email_validated' => true,
            'phone_provided' => true,
            'company_provided' => false,
            'source' => 'referral',
        ];

        $score = $this->scorer->calculateScore($lead);

        $this->assertEquals(75, $score);
        $this->assertEquals('B', $this->scorer->getQualityGrade($score));
    }

    /** @test */
    public function it_rejects_invalid_email(): void
    {
        $lead = ['email_validated' => false];

        $score = $this->scorer->calculateScore($lead);

        $this->assertLessThan(50, $score);
    }
}
```

### Frontend — Unit Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { LeadsTable } from './LeadsTable';
import { useLeads } from '../hooks/useLeads';

vi.mock('../hooks/useLeads');

describe('LeadsTable', () => {
  it('shows loading state initially', () => {
    vi.mocked(useLeads).mockReturnValue({
      leads: [],
      loading: true,
      error: null,
    });

    render(<LeadsTable />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('displays leads when loaded', async () => {
    vi.mocked(useLeads).mockReturnValue({
      leads: [
        { id: '1', name: 'John Doe', status: 'qualified' },
      ],
      loading: false,
      error: null,
    });

    render(<LeadsTable />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('shows error message on failure', () => {
    vi.mocked(useLeads).mockReturnValue({
      leads: [],
      loading: false,
      error: new Error('Failed to fetch'),
    });

    render(<LeadsTable />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### E2E Test — Gherkin (Playwright)

```gherkin
Feature: Lead Management
  As an admin user
  I want to manage leads in the system
  So that I can track potential customers

  Scenario: Create a new lead successfully
    Given I am authenticated as an admin
    And I navigate to the Leads page
    When I click "New Lead"
    And I fill in the lead form:
      | field     | value              |
      | name      | John Doe           |
      | email     | john@example.com   |
      | phone     | +1234567890        |
      | source    | website            |
    And I submit the form
    Then I should see a success message
    And the lead should appear in the table
    And the lead status should be "new"

  Scenario: Filter leads by status
    Given there are leads with different statuses
    When I filter by status "qualified"
    Then only qualified leads should be displayed
    And the count should match the filtered results
```

---

## 🛠️ Herramientas por Capa

| Capa | Herramienta | Ubicación |
|------|-------------|-----------|
| **Unit Backend** | PHPUnit | `apps/api/src/backend/tests/` |
| **Integration Backend** | PHPUnit + RefreshDatabase | `apps/api/src/backend/tests/` |
| **API Tests** | .NET Framework Automation | `tests/framework-automation/` |
| **Unit Frontend** | Vitest + RTL | `apps/admin/src/**/*.test.tsx` |
| **E2E** | Playwright (.NET) | `tests/framework-automation/` |

---

## 🚦 Cuándo Ejecutar Cada Tipo

| Tipo | Frecuencia | Tiempo Estimado | Gate |
|------|------------|-----------------|------|
| **Unit** | En cada commit | < 5 min | ✅ Requerido |
| **Integration** | Pre-merge a develop | < 15 min | ✅ Requerido |
| **E2E** | Pre-merge a main | < 30 min | ✅ Requerido |
| **Performance** | Semanal | < 1 hora | ⚠️ Recomendado |

---

## 📊 Métricas de Calidad

### Backend

```bash
# Ejecutar todos los tests
php artisan test

# Con cobertura
php artisan test --coverage

# Solo unit tests
php artisan test --testsuite=Unit

# Solo integration tests
php artisan test --testsuite=Integration
```

**Meta:** > 80% cobertura en lógica de negocio

### Frontend

```bash
# Ejecutar tests
npm run test

# Con cobertura
npm run test -- --coverage

# Modo watch
npm run test -- --watch
```

**Meta:** > 80% cobertura en hooks y utilidades

---

## ✅ Checklist de Testing por Tarea

Cada tarea debe incluir:

- [ ] **Unit Tests** para lógica nueva/modificada
- [ ] **Integration Tests** si hay cambios en APIs o DB
- [ ] **E2E Tests** si afecta flujos críticos de usuario
- [ ] **Actualización de tests existentes** si se modifica comportamiento
- [ ] **Cobertura reportada** en el PR
- [ ] **Todos los tests pasando** en CI/CD

---

## 🚫 Anti-patrones de Testing

❌ **Tests que dependen del orden**  
❌ **Mocks excesivos** (pierdes valor de integración)  
❌ **Aserciones mágicas** (`expect(result).toBeTruthy()`)  
❌ **Tests lentos** (> 1s por test unitario)  
❌ **Datos hardcodeados** sin factories  
❌ **Probar implementación** en lugar de comportamiento  

---

## 📚 Recursos Adicionales

- [PHPUnit Best Practices](https://phpunit.de/manual/current/en/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Framework Automation - Farutech](../04_TRACKING/tasks/TASK-012.md)
