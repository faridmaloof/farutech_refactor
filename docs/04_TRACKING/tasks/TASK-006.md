# TASK-006 — Admin Panel: Opportunity Search Implementation

**Fase:** FASE 11  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Frontend Lead + Backend Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Implementar la página de **Búsqueda de Oportunidades** en el Admin Panel (`admin.farutech.local/opportunities`) permitiendo buscar, filtrar, visualizar y convertir oportunidades de negocio obtenidas mediante scraping automatizado según SPEC-002.

Esta feature complementa el MiniCRM permitiendo la adquisición proactiva de leads desde fuentes externas.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE |
| TASK-003 | SPEC-001 Lead Management | ✅ DONE |
| TASK-004 | SPEC-002 Opportunity Search | ✅ DONE |
| TASK-005 | Admin Leads Page | ⬜ Pendiente (recomendado) |
| TASK-002 | Generar build del Design System | ⬜ Pendiente |

---

## 📂 Archivos Afectados

### Nuevos (Frontend - Admin App)
- `apps/admin/src/features/opportunities/pages/OpportunitiesPage.tsx`
- `apps/admin/src/features/opportunities/pages/OpportunityDetailPage.tsx`
- `apps/admin/src/features/opportunities/components/OpportunitiesTable.tsx`
- `apps/admin/src/features/opportunities/components/OpportunityFilters.tsx`
- `apps/admin/src/features/opportunities/components/OpportunityQualityScore.tsx`
- `apps/admin/src/features/opportunities/components/OpportunitySourceBadge.tsx`
- `apps/admin/src/features/opportunities/components/ConvertToLeadModal.tsx`
- `apps/admin/src/features/opportunities/components/OpportunityMap.tsx` (si aplica geolocalización)
- `apps/admin/src/features/opportunities/hooks/useOpportunities.ts`
- `apps/admin/src/features/opportunities/hooks/useOpportunityDetail.ts`
- `apps/admin/src/features/opportunities/store/opportunitiesStore.ts`
- `apps/admin/src/features/opportunities/types/opportunity.types.ts`
- `apps/admin/src/features/opportunities/utils/opportunityUtils.ts`
- `apps/admin/src/features/opportunities/utils/scoringAlgorithm.ts`

### Nuevos (Tests - Admin App)
- `apps/admin/src/features/opportunities/__tests__/OpportunitiesPage.test.tsx`
- `apps/admin/src/features/opportunities/__tests__/OpportunityFilters.test.tsx`
- `apps/admin/src/features/opportunities/__tests__/useOpportunities.test.ts`
- `apps/admin/src/features/opportunities/__tests__/scoringAlgorithm.test.ts`
- `tests/framework-automation/src/Farutech.Admin.Tests/Features/Opportunities/`
  - `OpportunitiesListSteps.cs`
  - `OpportunityDetailSteps.cs`
  - `OpportunityFilteringSteps.cs`
  - `OpportunityConversionSteps.cs`
  - `Opportunities.feature` (Gherkin)

### Nuevos (Backend - API)
- `apps/api/src/backend/app/Http/Controllers/Api/V1/OpportunityController.php`
- `apps/api/src/backend/app/Services/OpportunitySearchService.php`
- `apps/api/src/backend/app/Services/OpportunityScoringService.php`
- `apps/api/src/backend/app/Services/OpportunityDeduplicationService.php`
- `apps/api/src/backend/app/Jobs/OpportunityScraperJob.php`
- `apps/api/src/backend/tests/Feature/Api/V1/OpportunityApiTest.php`

### Modificados
- `apps/admin/src/App.tsx` — Agregar rutas de oportunidades
- `apps/admin/src/routes/index.tsx` — Configurar routing
- `apps/admin/package.json` — Dependencias si aplica (ej. librería de mapas)
- `docs/tracking/MASTER_TRACKING.md` — Estado de TASK-006
- `IMPLEMENTATION_GUIDE.md` — Avance de FASE 11

---

## ✅ Criterios de Aceptación

### Funcionalidad Principal

- [ ] **Listado de Oportunidades:** Tabla muestra oportunidades con columnas: título, descripción corta, ubicación, servicio, calidad (score), fuente, fecha descubrimiento, acciones
- [ ] **Paginación:** Paginación server-side con 20/50/100 items por página
- [ ] **Ordenamiento:** Click en headers ordena asc/desc (score, fecha, ubicación)
- [ ] **Búsqueda:** Input texto busca en título, descripción, tags (debounce 300ms)
- [ ] **Filtros Avanzados:**
  - [ ] Por calidad/score (A: 90-100, B: 70-89, C: 50-69, D: <50)
  - [ ] Por fuente (LinkedIn, Indeed, Glassdoor, Otras)
  - [ ] Por tipo de servicio (desarrollo, diseño, marketing, etc.)
  - [ ] Por ubicación (país, ciudad, remoto)
  - [ ] Por fecha de descubrimiento (rango)
  - [ ] Por estado (Nueva, Vista, Descartada, Convertida)
- [ ] **Filtros persistentes:** Filtros se mantienen en URL query params
- [ ] **Reset filtros:** Botón para limpiar todos los filtros

### Detalle de Oportunidad

- [ ] **Página de Detalle:** `/opportunities/{id}` muestra información completa
- [ ] **Información Básica:** Título completo, descripción detallada, empresa (si disponible)
- [ ] **Metadata:** Score de calidad, fuente original, fecha descubrimiento, tags
- [ ] **Ubicación:** Mapa o texto de ubicación (según disponibilidad)
- [ ] **Enlace Original:** Link a la fuente original (abre en nueva pestaña)
- [ ] **Historial:** Timeline de vistas, flags, conversiones
- [ ] **Score Breakdown:** Desglose visual del cálculo del score (qué factores sumaron/restaron)
- [ ] **Convertir a Lead:** Modal para crear lead desde oportunidad con datos pre-llenados
- [ ] **Marcar como Vista:** Button para marcar oportunidad como vista
- [ ] **Flag/Discard:** Marcar oportunidad como no relevante con razón opcional
- [ ] **Compartir:** Opción para compartir oportunidad con teammate (si aplica)

### Búsqueda Avanzada

- [ ] **Búsqueda Geográfica:** Filtrar por radio alrededor de una ubicación (ej. "50km around Bogotá")
- [ ] **Auto-refresh:** Opcional: polling cada X minutos para nuevas oportunidades (configurable)
- [ ] **Guardar Búsquedas:** Guardar combinación de filtros como búsqueda guardada
- [ ] **Alertas:** Configurar alertas cuando nuevas oportunidades coincidan con criterios guardados

### UI/UX

- [ ] **Design System:** Todos los componentes usan @farutech/design-system
- [ ] **Responsive:** Tabla adaptable a móviles (card view en pantallas pequeñas)
- [ ] **Loading States:** Skeletons mientras cargan datos
- [ ] **Empty States:** Mensaje cuando no hay oportunidades o no hay resultados
- [ ] **Error States:** Manejo elegante de errores de API
- [ ] **Toast Notifications:** Feedback para acciones exitosas/fallidas
- [ ] **Confirmations:** Confirm modal para conversión a lead
- [ ] **Keyboard Navigation:** Atajos de teclado para acciones comunes
- [ ] **Score Visual:** Indicador visual de calidad (color + número + badge)

### Estados y Permisos

- [ ] **Role-based UI:** Botones/actions visibles según rol del usuario
- [ ] **Todos ven oportunidades:** No hay restricción de visibilidad por defecto
- [ ] **Solo admins convierten:** Conversión a lead puede estar restringida a roles específicos
- [ ] **Audit log:** Conversiones y flags quedan registrados con usuario y timestamp

### Performance

- [ ] **Initial Load:** < 2 segundos para primera carga
- [ ] **Filtering:** < 800ms para aplicar filtros (puede ser más lento que leads por complejidad)
- [ ] **Navigation:** < 200ms para cambiar de página
- [ ] **Bundle Size:** Feature añade < 70KB al bundle principal (posible librería de mapas)
- [ ] **Scoring Calculation:** < 100ms por oportunidad (backend caching recomendado)

---

## 🧪 Pruebas Requeridas

### API Tests (Backend)

- [ ] `GET /api/v1/opportunities/search` — Lista paginada con filtros
- [ ] `GET /api/v1/opportunities/{id}` — Detalle de oportunidad existente
- [ ] `GET /api/v1/opportunities/{id}` — 404 para oportunidad inexistente
- [ ] `POST /api/v1/opportunities/{id}/convert` — Convertir a lead
- [ ] `POST /api/v1/opportunities/{id}/view` — Marcar como vista
- [ ] `POST /api/v1/opportunities/{id}/flag` — Marcar como no relevante
- [ ] `GET /api/v1/opportunities/sources` — Listar fuentes disponibles
- [ ] `GET /api/v1/opportunities/stats` — Estadísticas de oportunidades
- [ ] Auth tests — 401 sin token, 403 sin permisos (para conversión)

### Integration Tests (Backend)

- [ ] Opportunity creation desde job de scraping
- [ ] Scoring algorithm calcula correctamente según reglas
- [ ] Deduplicación detecta oportunidades duplicadas
- [ ] Conversión a lead crea lead válido y marca oportunidad como convertida
- [ ] Filtros compuestos funcionan correctamente
- [ ] Geolocalización calcula distancias correctamente

### Unit Tests (Frontend)

- [ ] `useOpportunities` hook — Fetch, filter, pagination logic
- [ ] `OpportunitiesTable` component — Render, sorting, row click
- [ ] `OpportunityFilters` component — Filter state management
- [ ] `OpportunityQualityScore` component — Score calculation display
- [ ] `ConvertToLeadModal` component — Form validation, submission
- [ ] `scoringAlgorithm` — Weight calculation, edge cases
- [ ] Cobertura > 80% en lógica crítica

### E2E Tests (Framework .NET)

- [ ] **Opportunities.feature — Listado:**
  - [ ] Usuario autenticado ve lista de oportunidades
  - [ ] Paginación funciona correctamente
  - [ ] Ordenamiento por columnas funciona
- [ ] **Opportunities.feature — Búsqueda y Filtros:**
  - [ ] Búsqueda por texto filtra correctamente
  - [ ] Filtro por score funciona
  - [ ] Filtro por fuente funciona
  - [ ] Filtro por ubicación funciona
  - [ ] Múltiples filtros se combinan correctamente
  - [ ] Reset limpia todos los filtros
- [ ] **Opportunities.feature — Detalle:**
  - [ ] Click en oportunidad navega a detalle
  - [ ] Información completa se muestra
  - [ ] Score breakdown es visible
  - [ ] Link a fuente original funciona
- [ ] **Opportunities.feature — Conversión:**
  - [ ] Modal de conversión abre correctamente
  - [ ] Datos se pre-llenan desde oportunidad
  - [ ] Conversión crea lead exitosamente
  - [ ] Oportunidad marcada como convertida
- [ ] **Opportunities.feature — Acciones:**
  - [ ] Marcar como vista funciona
  - [ ] Flag/Discard funciona con razón
  - [ ] Historial se actualiza correctamente

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
- [ ] **Scraping Compliance:** Verificar que fuentes permiten scraping (robots.txt, ToS)

---

## 📄 Documentación a Actualizar

- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de TASK-006
- [ ] `docs/tracking/tasks/TASK-006.md` — Este archivo con historial y evidencia
- [ ] `IMPLEMENTATION_GUIDE.md` — Avance de FASE 11, changelog
- [ ] `docs/specifications/SPEC-002.md` — Marcar como implementada (cuando esté 100%)
- [ ] `apps/admin/README.md` — Features disponibles
- [ ] `docs/05_API_CONTRACT.md` — Endpoints de oportunidades
- [ ] `docs/scraping_policy.md` — Política de scraping ético (nuevo, si no existe)

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Fuentes de scraping cambian estructura | Alta | Alto | Diseñar parsers configurables, monitoring de cambios |
| Bloqueo por rate limiting | Media | Alto | Implementar delays, rotación de user-agents, proxies |
| Calidad de datos inconsistentes | Alta | Medio | Validación estricta, scoring penaliza datos incompletos |
| Problemas legales por scraping | Media | Crítico | Revisar ToS de cada fuente, solo fuentes públicas, opt-out |
| Performance de scoring con muchos items | Media | Medio | Caching de scores, cálculo asíncrono |
| Librería de mapas aumenta bundle | Alta | Bajo | Lazy loading, alternativa sin mapa si pesa mucho |
| Scope creep (agregar features extra) | Alta | Medio | Mantener foco en SPEC-002 estrictamente |

---

## 🚧 Bloqueos Actuales

**BLOQUEADO POR:**
- TASK-004 (SPEC-002) debe estar ✅ DONE antes de comenzar
- TASK-002 (Design System Build) debe estar ✅ DONE para usar componentes
- TASK-005 (Leads Page) recomendada para tener patrón establecido
- Decisión legal sobre scraping debe estar documentada

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | BACKLOG | Tarea creada, pendiente dependencias | Architect |
| - | - | - | - | - |

---

## 🔗 Enlaces Relacionados

- [SPEC-002](./TASK-004.md) — Opportunity Search Specification
- [TASK-004](./TASK-004.md) — Creación de SPEC-002
- [TASK-005](./TASK-005.md) — Leads Page (feature relacionada)
- [ADR-001](../adr/ADR-001_admin_routing_strategy.md) — Admin Routing
- [ADR-002](../adr/ADR-002_design_system_structure.md) — Design System

---

## 📊 Evidencia de Completado

[VERIFICADO — CÓDIGO]
- `apps/admin/src/features/opportunities/` contiene todas las páginas, componentes, hooks y types
- Rutas configuradas en `apps/admin/src/routes/`
- Store de Zustand/Redux configurado para opportunities
- Backend services y jobs implementados

[VERIFICADO — TEST]
- Unit tests: X/Y tests passing, Z% cobertura
- API tests: X/Y endpoints cubiertos
- E2E tests: X escenarios Gherkin pasando

[VERIFICADO — BUILD]
- Build de admin app exitoso: `npm run build` → dist/ generado
- Sin warnings críticos de TypeScript
- Bundle size dentro de límites (< 70KB adicionales)

[VERIFICADO — MANUAL]
- QA ha validado: listado, filtros, búsqueda, detalle, conversión
- Accessibility check passed (keyboard navigation, screen reader)
- Performance: Lighthouse score X/100
- Legal review de scraping policy completada

[VERIFICADO — DOCUMENTACIÓN]
- Este archivo actualizado con toda la evidencia
- MASTER_TRACKING.md refleja estado DONE
- IMPLEMENTATION_GUIDE.md actualizado
- Scraping policy documentada

---

## ✨ DEFINICIÓN DE DONE PARA ESTA TAREA

**TASK-006 se considera DONE únicamente cuando:**

1. ✅ Todas las páginas y componentes están implementados
2. ✅ TODOS los criterios de aceptación funcionales están cumplidos
3. ✅ Unit tests > 80% cobertura en lógica crítica (incluyendo scoring algorithm)
4. ✅ API tests passing para todos los endpoints de oportunidades
5. ✅ E2E tests passing para al menos 5 flujos principales
6. ✅ Manual testing completado y aprobado por QA
7. ✅ Performance dentro de SLAs definidos
8. ✅ Accessibility WCAG AA verified
9. ✅ Documentación actualizada (este file, MASTER_TRACKING, IMPLEMENTATION_GUIDE, scraping policy)
10. ✅ Code review aprobado por al menos 1 senior developer
11. ✅ Legal review de scraping policy completada
12. ✅ Deploy a staging environment exitoso
13. ✅ Smoke tests en staging passing

---

**Nota:** Esta tarea implica **SCRAPING DE FUENTES EXTERNAS**. Es crítico obtener aprobación legal antes de implementar y mantener documentación clara de qué fuentes se scrapean y bajo qué términos.
