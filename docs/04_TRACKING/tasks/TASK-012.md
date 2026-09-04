# TASK-012 — Configuración de Testing E2E y Unitario para Admin

**Fase:** FASE 13 — Testing  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🟡 HIGH  
**Responsable:** QA Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Configurar el entorno completo de pruebas para la aplicación Admin, incluyendo Playwright para E2E tests, Vitest para unit tests, React Testing Library para componentes, y fixtures reutilizables para autenticación y datos de prueba.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-009 | Estructura de Directorios Base | 🔄 READY |
| TASK-010 | Integración Design System | ⬜ BACKLOG |
| TASK-011 | Capa de Servicios API | 🔄 READY |

---

## 📂 Archivos Afectados

### Nuevos
```
apps/admin/
├── playwright.config.ts            # Configuración de Playwright
├── vitest.config.ts                # Configuración de Vitest
├── tests/
│   ├── e2e/
│   │   ├── auth.setup.ts           # Setup de autenticación global
│   │   ├── fixtures/
│   │   │   ├── auth.fixture.ts     # Fixtures para login/logout
│   │   │   └── leads.fixture.ts    # Fixtures para datos de leads
│   │   ├── specs/
│   │   │   ├── auth.spec.ts        # Tests E2E de autenticación
│   │   │   ├── leads.spec.ts       # Tests E2E de gestión de leads
│   │   │   └── opportunities.spec.ts
│   │   └── utils/
│   │       └── test-helpers.ts
│   └── unit/
│       ├── features/
│       │   ├── leads/
│       │   │   ├── useLeads.test.ts
│       │   │   └── LeadsTable.test.tsx
│       │   └── opportunities/
│       │       └── OpportunitySearch.test.tsx
│       ├── shared/
│       │   └── api/
│       │       └── client.test.ts
│       └── setup.ts                # Setup global de Vitest
├── .env.test                       # Variables de entorno para tests
└── package.json                    # Scripts: test, test:e2e, test:unit, test:coverage
```

### Modificados
- `apps/admin/package.json` — Agregar dependencias de testing
- `apps/admin/tsconfig.json` — Incluir paths de tests
- `.github/workflows/ci.yml` — Agregar jobs de tests en CI

---

## ✅ Criterios de Aceptación

### Configuración General
- [ ] Playwright instalado y configurado correctamente
- [ ] Vitest instalado y configurado correctamente
- [ ] React Testing Library configurado con custom renders
- [ ] MSW (Mock Service Worker) configurado para mockear API
- [ ] Cobertura de código habilitada (>80% objetivo)
- [ ] Reports generados en formatos HTML + JUnit

### E2E Tests (Playwright)
- [ ] Auth setup global (login antes de todos los tests)
- [ ] Fixtures reutilizables para autenticación
- [ ] Fixtures reutilizables para datos (leads, opportunities)
- [ ] Tests de autenticación: login, logout, sesión expirada, permisos
- [ ] Tests de leads: CRUD completo, filtros, búsqueda, paginación
- [ ] Tests de oportunidades: búsqueda, conversión a lead
- [ ] Tests de errores: 401, 403, 404, 500 manejados correctamente
- [ ] Tests responsive: desktop + mobile viewports
- [ ] Screenshots automáticos en fallos
- [ ] Video recording de tests fallidos
- [ ] Parallel execution configurado correctamente

### Unit Tests (Vitest + RTL)
- [ ] Setup global con providers (Router, QueryClient, Theme)
- [ ] Mock de API client configurado
- [ ] Tests de hooks customizados (useLeads, useOpportunitySearch)
- [ ] Tests de componentes UI (render, eventos, estados)
- [ ] Tests de servicios API (mock de Axios)
- [ ] Tests de utils y helpers
- [ ] Cobertura >80% en lógica crítica

### CI/CD Integration
- [ ] Workflow de GitHub Actions ejecuta tests en cada PR
- [ ] Tests E2E corren en headless mode en CI
- [ ] Artifacts guardados (videos, screenshots, reports)
- [ ] Coverage report subido a codecov.io o similar
- [ ] Status check requerido antes de merge

---

## 🧪 Pruebas Requeridas

### Meta-Tests (Probar el sistema de testing)
- [ ] Ejecutar `npm run test` pasa todos los unit tests
- [ ] Ejecutar `npm run test:e2e` pasa todos los E2E tests
- [ ] Ejecutar `npm run test:coverage` genera reporte >80%
- [ ] CI ejecuta tests correctamente en cada push
- [ ] Reports son legibles y útiles

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Todos los tests pasan:** `npm run test` sin fallos
- [ ] **E2E tests pasan:** `npm run test:e2e` sin fallos
- [ ] **Cobertura:** >80% en líneas, >70% en funciones
- [ ] **CI:** Workflow ejecuta tests correctamente
- [ ] **Documentación:** Guía de testing creada
- [ ] **Changelog:** IMPLEMENTATION_GUIDE.md actualizado

---

## 📄 Documentación a Actualizar

- [ ] `docs/testing/admin-testing-strategy.md` — Nueva documentación
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección FASE 13
- [ ] `apps/admin/README.md` — Comandos de testing
- [ ] `apps/admin/tests/README.md` — Guía específica de tests

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Tests flaky (intermitentes) | Media | Alto | Usar data-testid, waits explícitos, evitar timeouts fijos |
| Lentitud en E2E tests | Media | Medio | Parallel execution, tests independientes, DB limpia por test |
| Falso positivos/negativos | Baja | Alto | Revisar assertions, usar matchers específicos |
| Mantenimiento costoso | Media | Medio | Page Object Model, fixtures reutilizables, DRY en tests |

---

## 🚧 Bloqueos Actuales

Depende de tener estructura base (TASK-009) y preferiblemente API client (TASK-011)

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | BACKLOG | Tarea creada | Architect |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](../specifications/SPEC-001_Lead_Management.md) — Criterios de testing para Leads
- [SPEC-002](../specifications/SPEC-002_Opportunity_Search.md) — Criterios de testing para Oportunidades
- [TASK-005](./TASK-005.md) — Implementación de Leads (requiere tests)
- [TASK-006](./TASK-006.md) — Implementación de Opportunities (requiere tests)
- [Playwright Docs](https://playwright.dev/) — Documentación oficial
- [Vitest Docs](https://vitest.dev/) — Documentación oficial

---

## 📊 Evidencia de Completado

[VERIFICADO — CONFIG]
- `playwright.config.ts` existe con configuración correcta
- `vitest.config.ts` existe con configuración correcta
- Scripts en package.json funcionan

[VERIFICADO — CÓDIGO]
- Fixtures de autenticación implementadas
- Al menos 1 test E2E por feature crítica
- Al menos 1 test unitario por hook/componente crítico

[VERIFICADO — TEST]
- `npm run test` pasa 100%
- `npm run test:e2e` pasa 100%
- Cobertura >80%

[VERIFICADO — CI]
- Workflow de GitHub Actions ejecuta tests
- Artifacts se generan correctamente

[VERIFICADO — DOCUMENTACIÓN]
- `docs/testing/admin-testing-strategy.md` creada
- README de tests con ejemplos claros

---

## 💻 EJEMPLOS DE TESTS

### E2E Test con Playwright
```typescript
// apps/admin/tests/e2e/specs/leads.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Leads Management', () => {
  test.use({ storageState: 'tests/e2e/auth.setup.json' }); // Login automático

  test('should display leads list with pagination', async ({ page }) => {
    await page.goto('/admin/leads');
    
    await expect(page.locator('[data-testid="leads-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="lead-row"]')).toHaveCount(20);
    
    // Paginación
    await page.click('[data-testid="pagination-next"]');
    await expect(page.locator('[data-testid="lead-row"]')).toHaveCount(20);
  });

  test('should filter leads by status', async ({ page }) => {
    await page.goto('/admin/leads');
    
    await page.selectOption('[data-testid="filter-status"]', 'qualified');
    await page.waitForURL(/status=qualified/);
    
    const qualifiedLeads = page.locator('[data-testid="lead-row"]');
    await expect(qualifiedLeads).toHaveCount(5); // Solo qualified
    
    // Verificar que todos los rows muestran badge "Qualified"
    await expect(page.locator('[data-testid="badge-qualified"]')).toHaveCount(5);
  });

  test('should create new lead successfully', async ({ page }) => {
    await page.goto('/admin/leads');
    
    await page.click('[data-testid="btn-new-lead"]');
    await page.fill('[data-testid="input-name"]', 'Juan Pérez');
    await page.fill('[data-testid="input-email"]', 'juan@example.com');
    await page.click('[data-testid="btn-save"]');
    
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="lead-row"]:has-text("Juan Pérez")')).toBeVisible();
  });
});
```

### Unit Test con Vitest + RTL
```typescript
// apps/admin/tests/unit/features/leads/useLeads.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeads } from '@/features/leads/hooks/useLeads';
import { leadApi } from '@/features/leads/services/leadApi';
import { vi } from 'vitest';

vi.mock('@/features/leads/services/leadApi');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLeads hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch leads successfully', async () => {
    const mockLeads = { data: [{ id: 1, name: 'Test Lead' }], meta: { total: 1 } };
    vi.mocked(leadApi.getAll).mockResolvedValue(mockLeads);

    const { result } = renderHook(() => useLeads({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockLeads);
    expect(leadApi.getAll).toHaveBeenCalledWith({});
  });

  it('should handle error state', async () => {
    vi.mocked(leadApi.getAll).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useLeads({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
```

---

**Nota:** Esta tarea es CRÍTICA para garantizar calidad del código. Sin tests automatizados, cada cambio será riesgoso y el refactor será costoso. Invertir tiempo aquí ahorra horas de debugging manual futuro.
