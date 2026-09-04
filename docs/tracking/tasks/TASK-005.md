# TASK-005 — Admin Panel: Leads Management Page Implementation

**Fase:** FASE 11  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Frontend Lead + Backend Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Implementar la página de **Gestión de Leads** en el Admin Panel (`admin.farutech.local/leads`) permitiendo listar, buscar, filtrar, visualizar detalle y gestionar el ciclo de vida completo de leads según SPEC-001.

Esta es la primera feature funcional del MiniCRM que habilita la operación comercial del negocio.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE |
| TASK-003 | SPEC-001 Lead Management | ✅ DONE |
| TASK-007 | Actualizar README con estado real | ⬜ Pendiente |
| TASK-008 | Normalizar documentación | ⬜ Pendiente |
| TASK-002 | Generar build del Design System | ⬜ Pendiente |

---

## 📂 Archivos Afectados

### Nuevos (Frontend - Admin App)
- `apps/admin/src/features/leads/pages/LeadsPage.tsx`
- `apps/admin/src/features/leads/pages/LeadDetailPage.tsx`
- `apps/admin/src/features/leads/components/LeadsTable.tsx`
- `apps/admin/src/features/leads/components/LeadFilters.tsx`
- `apps/admin/src/features/leads/components/LeadStatusBadge.tsx`
- `apps/admin/src/features/leads/components/LeadQualityIndicator.tsx`
- `apps/admin/src/features/leads/components/LeadActionsDropdown.tsx`
- `apps/admin/src/features/leads/components/LeadTimeline.tsx`
- `apps/admin/src/features/leads/components/LeadNotesList.tsx`
- `apps/admin/src/features/leads/components/LeadInteractionForm.tsx`
- `apps/admin/src/features/leads/hooks/useLeads.ts`
- `apps/admin/src/features/leads/hooks/useLeadDetail.ts`
- `apps/admin/src/features/leads/store/leadsStore.ts`
- `apps/admin/src/features/leads/types/lead.types.ts`
- `apps/admin/src/features/leads/utils/leadUtils.ts`

### Nuevos (Tests - Admin App)
- `apps/admin/src/features/leads/__tests__/LeadsPage.test.tsx`
- `apps/admin/src/features/leads/__tests__/LeadFilters.test.tsx`
- `apps/admin/src/features/leads/__tests__/useLeads.test.ts`
- `tests/framework-automation/src/Farutech.Admin.Tests/Features/Leads/`
  - `LeadsListSteps.cs`
  - `LeadDetailSteps.cs`
  - `LeadFilteringSteps.cs`
  - `LeadConversionSteps.cs`
  - `Leads.feature` (Gherkin)

### Nuevos (Backend - API)
- `apps/api/src/backend/app/Http/Controllers/Api/V1/LeadController.php` (si no existe completo)
- `apps/api/src/backend/tests/Feature/Api/V1/LeadApiTest.php`

### Modificados
- `apps/admin/src/App.tsx` — Agregar rutas de leads
- `apps/admin/src/routes/index.tsx` — Configurar routing
- `apps/admin/package.json` — Dependencias si aplica
- `docs/tracking/MASTER_TRACKING.md` — Estado de TASK-005
- `IMPLEMENTATION_GUIDE.md` — Avance de FASE 11

---

## ✅ Criterios de Aceptación

### Funcionalidad Principal

- [ ] **Listado de Leads:** Tabla muestra leads con columnas: nombre, email, teléfono, estado, calidad, fuente, fecha creación, acciones
- [ ] **Paginación:** Paginación server-side con 20/50/100 items por página
- [ ] **Ordenamiento:** Click en headers ordena asc/desc (nombre, fecha, calidad)
- [ ] **Búsqueda:** Input texto busca en nombre, email, teléfono, empresa (debounce 300ms)
- [ ] **Filtros Avanzados:**
  - [ ] Por estado (New, Contacted, Qualified, Converted, Lost)
  - [ ] Por calidad (A, B, C, D)
  - [ ] Por fuente (Website, Newsletter, Opportunity, Manual)
  - [ ] Por ubicación (país, ciudad)
  - [ ] Por fecha de creación (rango)
  - [ ] Por asignación (mis leads, todos, usuario específico)
- [ ] **Filtros persistentes:** Filtros se mantienen en URL query params
- [ ] **Reset filtros:** Botón para limpiar todos los filtros

### Detalle de Lead

- [ ] **Página de Detalle:** `/leads/{id}` muestra información completa
- [ ] **Información Básica:** Nombre, email, teléfono, empresa, cargo, ubicación
- [ ] **Metadata:** Fuente, calidad, estado, score, tags
- [ ] **Historial:** Timeline de interacciones (llamadas, emails, notas)
- [ ] **Notas:** Lista de notas con autor y fecha
- [ ] **Agregar Nota:** Formulario para agregar nueva nota
- [ ] **Agregar Interacción:** Formulario para registrar llamada/email/reunión
- [ ] **Cambiar Estado:** Dropdown para actualizar estado del lead
- [ ] **Cambiar Asignación:** Reasignar lead a otro usuario (solo admins)
- [ ] **Convertir a Oportunidad:** Botón para crear oportunidad desde lead (si aplica)
- [ ] **Eliminar Lead:** Soft delete con confirmación (solo admins)

### UI/UX

- [ ] **Design System:** Todos los componentes usan @farutech/design-system
- [ ] **Responsive:** Tabla adaptable a móviles (card view en pantallas pequeñas)
- [ ] **Loading States:** Skeletons mientras cargan datos
- [ ] **Empty States:** Mensaje cuando no hay leads o no hay resultados
- [ ] **Error States:** Manejo elegante de errores de API
- [ ] **Toast Notifications:** Feedback para acciones exitosas/fallidas
- [ ] **Confirmations:** Confirm modal para acciones destructivas
- [ ] **Keyboard Navigation:** Atajos de teclado para acciones comunes

### Estados y Permisos

- [ ] **Role-based UI:** Botones/actions visibles según rol del usuario
- [ ] **Solo mis leads:** Usuarios normales ven solo leads asignados a ellos
- [ ] **Admin ve todo:** Admins ven todos los leads del sistema
- [ ] **Edición restringida:** Solo owner o admin puede editar lead
- [ ] **Audit log:** Cambios importantes quedan registrados

### Performance

- [ ] **Initial Load:** < 2 segundos para primera carga
- [ ] **Filtering:** < 500ms para aplicar filtros
- [ ] **Navigation:** < 200ms para cambiar de página
- [ ] **Bundle Size:** Feature añade < 50KB al bundle principal

---

## 🧪 Pruebas Requeridas

### API Tests (Backend)

- [ ] `GET /api/v1/leads` — Lista paginada con filtros
- [ ] `GET /api/v1/leads/{id}` — Detalle de lead existente
- [ ] `GET /api/v1/leads/{id}` — 404 para lead inexistente
- [ ] `PATCH /api/v1/leads/{id}/status` — Actualizar estado
- [ ] `PATCH /api/v1/leads/{id}/assignment` — Reasignar lead
- [ ] `POST /api/v1/leads/{id}/notes` — Agregar nota
- [ ] `POST /api/v1/leads/{id}/interactions` — Registrar interacción
- [ ] `DELETE /api/v1/leads/{id}` — Soft delete
- [ ] `GET /api/v1/leads/stats` — Estadísticas de leads
- [ ] Auth tests — 401 sin token, 403 sin permisos

### Integration Tests (Backend)

- [ ] Lead creation con validación de datos duplicados
- [ ] Lead status change dispara eventos correctos
- [ ] Lead assignment notifica al usuario asignado
- [ ] Notas e interacciones se relacionan correctamente
- [ ] Filtros compuestos funcionan correctamente
- [ ] Paginación funciona con grandes volúmenes de datos

### Unit Tests (Frontend)

- [ ] `useLeads` hook — Fetch, filter, pagination logic
- [ ] `LeadsTable` component — Render, sorting, row click
- [ ] `LeadFilters` component — Filter state management
- [ ] `LeadStatusBadge` component — Color mapping
- [ ] `LeadQualityIndicator` component — Grade display
- [ ] `leadUtils` — Helper functions
- [ ] Cobertura > 80% en lógica crítica

### E2E Tests (Framework .NET)

- [ ] **Leads.feature — Listado:**
  - [ ] Usuario autenticado ve lista de leads
  - [ ] Paginación funciona correctamente
  - [ ] Ordenamiento por columnas funciona
- [ ] **Leads.feature — Búsqueda y Filtros:**
  - [ ] Búsqueda por texto filtra correctamente
  - [ ] Filtro por estado funciona
  - [ ] Filtro por calidad funciona
  - [ ] Filtro por fuente funciona
  - [ ] Múltiples filtros se combinan correctamente
  - [ ] Reset limpia todos los filtros
- [ ] **Leads.feature — Detalle:**
  - [ ] Click en lead navega a detalle
  - [ ] Información completa se muestra
  - [ ] Timeline de interacciones visible
- [ ] **Leads.feature — Acciones:**
  - [ ] Agregar nota funciona
  - [ ] Cambiar estado funciona
  - [ ] Reasignar lead funciona (admin)
  - [ ] Eliminar lead funciona (admin)
- [ ] **Leads.feature — Permisos:**
  - [ ] Usuario normal ve solo sus leads
  - [ ] Admin ve todos los leads
  - [ ] Usuario sin permisos no ve botones de eliminar

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Lint:** `npm run lint` en admin app sin errores
- [ ] **Type Check:** `npm run typecheck` sin errores
- [ ] **Build:** `npm run build` en admin app exitoso
- [ ] **Unit Tests:** `npm run test` en admin app > 80% cobertura
- [ ] **API Tests:** Tests de backend passing
- [ ] **E2E Tests:** Framework .NET tests passing (al menos flujos principales)
- [ ] **Manual Testing:** QA ha validado flujos principales manualmente
- [ ] **Documentación:** Este archivo actualizado con evidencia
- [ ] **MASTER_TRACKING:** Tabla de estado actualizada
- [ ] **IMPLEMENTATION_GUIDE:** Sección FASE 11 actualizada
- [ ] **Storybook:** Componentes nuevos documentados en Storybook (si aplica)
- [ ] **Accessibility:** WCAG AA compliance verificado (keyboard nav, screen readers)
- [ ] **Performance:** Lighthouse performance score > 90

---

## 📄 Documentación a Actualizar

- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de TASK-005
- [ ] `docs/tracking/tasks/TASK-005.md` — Este archivo con historial y evidencia
- [ ] `IMPLEMENTATION_GUIDE.md` — Avance de FASE 11, changelog
- [ ] `docs/specifications/SPEC-001.md` — Marcar como implementada (cuando esté 100%)
- [ ] `apps/admin/README.md` — Features disponibles
- [ ] `docs/05_API_CONTRACT.md` — Endpoints de leads (si hubo cambios)

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Design System sin componentes necesarios | Media | Alto | Crear componentes faltantes primero |
| API endpoints incompletos | Media | Alto | Verificar SPEC-001 antes de empezar |
| Complejidad de filtros compuestos | Alta | Medio | Implementar gradualmente, testear cada uno |
| Performance con muchos leads | Media | Medio | Implementar virtual scrolling si > 1000 items |
| Permisos mal implementados | Media | Alto | Revisión de seguridad obligatoria |
| E2E tests frágiles | Alta | Medio | Usar data-testid, evitar selectores CSS frágiles |
| Scope creep (agregar features extra) | Alta | Medio | Mantener foco en SPEC-001 estrictamente |

---

## 🚧 Bloqueos Actuales

**BLOQUEADO POR:**
- TASK-003 (SPEC-001) debe estar ✅ DONE antes de comenzar
- TASK-002 (Design System Build) debe estar ✅ DONE para usar componentes
- TASK-007 y TASK-008 recomendadas para tener documentación base

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | BACKLOG | Tarea creada, pendiente dependencias | Architect |
| - | - | - | - | - |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](./TASK-003.md) — Lead Management Specification
- [TASK-003](./TASK-003.md) — Creación de SPEC-001
- [TASK-006](./TASK-006.md) — Opportunity Search (siguiente feature)
- [ADR-001](../adr/ADR-001_admin_routing_strategy.md) — Admin Routing
- [ADR-002](../adr/ADR-002_design_system_structure.md) — Design System

---

## 📊 Evidencia de Completado

[VERIFICADO — CÓDIGO]
- `apps/admin/src/features/leads/` contiene todas las páginas, componentes, hooks y types
- Rutas configuradas en `apps/admin/src/routes/`
- Store de Zustand/Redux configurado para leads

[VERIFICADO — TEST]
- Unit tests: X/Y tests passing, Z% cobertura
- API tests: X/Y endpoints cubiertos
- E2E tests: X escenarios Gherkin pasando

[VERIFICADO — BUILD]
- Build de admin app exitoso: `npm run build` → dist/ generado
- Sin warnings críticos de TypeScript
- Bundle size dentro de límites (< 50KB adicionales)

[VERIFICADO — MANUAL]
- QA ha validado: listado, filtros, búsqueda, detalle, acciones
- Accessibility check passed (keyboard navigation, screen reader)
- Performance: Lighthouse score X/100

[VERIFICADO — DOCUMENTACIÓN]
- Este archivo actualizado con toda la evidencia
- MASTER_TRACKING.md refleja estado DONE
- IMPLEMENTATION_GUIDE.md actualizado

---

## ✨ DEFINICIÓN DE DONE PARA ESTA TAREA

**TASK-005 se considera DONE únicamente cuando:**

1. ✅ Todas las páginas y componentes están implementados
2. ✅ TODOS los criterios de aceptación funcionales están cumplidos
3. ✅ Unit tests > 80% cobertura en lógica crítica
4. ✅ API tests passing para todos los endpoints de leads
5. ✅ E2E tests passing para al menos 5 flujos principales
6. ✅ Manual testing completado y aprobado por QA
7. ✅ Performance dentro de SLAs definidos
8. ✅ Accessibility WCAG AA verified
9. ✅ Documentación actualizada (este file, MASTER_TRACKING, IMPLEMENTATION_GUIDE)
10. ✅ Code review aprobado por al menos 1 senior developer
11. ✅ Deploy a staging environment exitoso
12. ✅ Smoke tests en staging passing

---

**Nota:** Esta es una tarea de **IMPLEMENTACIÓN CRÍTICA**. Cualquier desviación de SPEC-001 debe ser justificada y documentada en este archivo antes de proceder.
