# TASK-004 — SPEC-002 Opportunity Search System

**Fase:** FASE 5  
**Estado:** 🔄 READY  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Software Architect / Technical Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Crear la especificación completa (SPEC-002) para el sistema de **Búsqueda de Oportunidades** que permitirá a los usuarios encontrar oportunidades de negocio mediante scraping automatizado, scoring de calidad y conversión a leads.

Esta especificación servirá como contrato único para la implementación del módulo de oportunidades en el Admin Panel.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000A | Aprobación Auditoría | ✅ DONE |
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE |
| TASK-003 | SPEC-001 Lead Management | 🔄 READY |

---

## 📂 Archivos Afectados

### Nuevos
- `docs/specifications/SPEC-002_opportunity_search.md` (archivo principal ~400-500 líneas)
- `docs/tracking/tasks/TASK-004-historical.md` (historial de esta tarea)

### Modificados
- `docs/tracking/MASTER_TRACKING.md` — Actualizar estado de TASK-004
- `IMPLEMENTATION_GUIDE.md` — Sección FASE 5
- `docs/05_API_CONTRACT.md` — Agregar endpoints de oportunidades (si aplica)

---

## ✅ Criterios de Aceptación

### Contenido de la Especificación

- [ ] **Sección 1: Nombre y Objetivo** — Título claro, propósito definido
- [ ] **Sección 2: Contexto y Problema** — Por qué existe esta funcionalidad, qué problema resuelve
- [ ] **Sección 3: Alcance** — Qué incluye y qué NO incluye explícitamente
- [ ] **Sección 4: Actores** — Roles que interactúan con el sistema (Admin, System, etc.)
- [ ] **Sección 5: Precondiciones** — Qué debe existir antes de usar el feature
- [ ] **Sección 6: Flujo Principal** — Paso a paso del happy path completo
- [ ] **Sección 7: Flujos Alternativos** — Variaciones y edge cases
- [ ] **Sección 8: Reglas de Negocio** — Algoritmos, validaciones, restricciones
- [ ] **Sección 9: Datos de Entrada** — Inputs requeridos y opcionales
- [ ] **Sección 10: Datos de Salida** — Outputs esperados, formatos
- [ ] **Sección 11: API Contract** — Endpoints, métodos, request/response, errores
- [ ] **Sección 12: Persistencia** — Modelos, tablas, relaciones, índices
- [ ] **Sección 13: Frontend Requirements** — UI components, estados, interacciones
- [ ] **Sección 14: Backend Requirements** — Jobs, services, events, listeners
- [ ] **Sección 15: Seguridad** — Auth, autorización, rate limiting, PII
- [ ] **Sección 16: Manejo de Errores** — Códigos HTTP, mensajes, reintentos
- [ ] **Sección 17: Performance** — SLAs, timeouts, caching strategy
- [ ] **Sección 18: Testing Strategy** — API tests, integration tests, E2E tests
- [ ] **Sección 19: Observabilidad** — Logging, métricas, alertas
- [ ] **Sección 20: Criterios de Aceptación Funcionales** — Lista verificable (>30 criterios)
- [ ] **Sección 21: Dependencias Externas** — APIs de terceros, servicios de scraping
- [ ] **Sección 22: Riesgos Identificados** — Técnicos, de negocio, operativos
- [ ] **Sección 23: Estado y Versionado** — Draft, Review, Approved, Deprecated

### Calidad de la Especificación

- [ ] **Cero ambigüedad** — Todos los términos técnicos definidos
- [ ] **Criterios binarios** — Cada criterio es verificable (pasa/no pasa)
- [ ] **Ejemplos concretos** — Request/response con datos reales
- [ ] **Diagramas cuando aplique** — Flujo, secuencia, arquitectura (en texto o mermaid)
- [ ] **Consistencia con SPEC-001** — Mismos patrones, naming conventions
- [ ] **Revisión de pares** — Al menos 1 reviewer asignado
- [ ] **Aprobación formal** — Sign-off del Technical Lead

---

## 🧪 Pruebas Requeridas (Para la Especificación)

### Validación de Contenido

- [ ] **Revisión de consistencia** — La spec no contradice otras specs o ADRs
- [ ] **Revisión de completitud** — Todas las secciones están presentes
- [ ] **Revisión de claridad** — Un desarrollador nuevo puede entenderla sin contexto adicional
- [ ] **Revisión de viabilidad técnica** — Lo especificado es implementable con la tecnología actual

### Validación contra Código Existente

- [ ] **Verificación de modelos** — Los modelos mencionados existen o están planificados
- [ ] **Verificación de endpoints** — Las rutas API no colisionan con existentes
- [ ] **Verificación de jobs** — Los jobs mencionados están en el backend o planificados
- [ ] **Verificación de tests** — Los tests propuestos son ejecutables con el framework actual

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Revisión de Pares:** Al menos 1 reviewer ha aprobado la especificación
- [ ] **Consistencia Cross-Docs:** No hay contradicciones con SPEC-001, ADRs, o documentación existente
- [ ] **Trazabilidad:** Cada requirement tiene su criterio de aceptación asociado
- [ ] **Testabilidad:** Cada feature puede ser validada con tests automáticos
- [ ] **Documentación:** Esta tarea (TASK-004) actualizada con evidencia
- [ ] **MASTER_TRACKING:** Tabla de estado actualizada
- [ ] **IMPLEMENTATION_GUIDE:** Sección FASE 5 actualizada

---

## 📄 Documentación a Actualizar

- [ ] `docs/specifications/SPEC-002_opportunity_search.md` — Crear especificación completa
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de TASK-004 → DONE
- [ ] `docs/tracking/tasks/TASK-004.md` — Este archivo con historial y evidencia
- [ ] `IMPLEMENTATION_GUIDE.md` — Avance de FASE 5
- [ ] `docs/05_API_CONTRACT.md` — Endpoints de oportunidades (resumen)
- [ ] `docs/06_DATABASE.md` — Modelo de datos de oportunidades (resumen)

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Especificación muy genérica | Media | Alto | Usar ejemplos concretos, criterios binarios |
| Especificación muy detallada | Media | Medio | Enfocarse en QUÉ, no en CÓMO |
| Inconsistencia con SPEC-001 | Baja | Alto | Revisión cruzada entre specs |
| Dependencies externas no claras | Media | Alto | Listar explícitamente APIs de terceros |
| Scope creep durante implementación | Alta | Medio | Definir explícitamente "Fuera de Alcance" |
| Cambios en fuentes de scraping | Alta | Alto | Diseñar para flexibilidad, configurar URLs externamente |

---

## 🚧 Bloqueos Actuales

**Ninguno** — Esta tarea está READY para comenzar.

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | READY | Tarea creada con criterios definidos | Architect |
| - | - | - | - | - |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](./TASK-003.md) — Lead Management (especificación relacionada)
- [ADR-001](../adr/ADR-001_admin_routing_strategy.md) — Admin Routing Strategy
- [ADR-002](../adr/ADR-002_design_system_structure.md) — Design System Structure
- [TASK-005](./TASK-005.md) — Admin Leads Page (implementación basada en SPEC-001)
- [TASK-006](./TASK-006.md) — Admin Opportunity Search (implementación basada en SPEC-002)

---

## 📊 Evidencia de Completado

[VERIFICADO — DOCUMENTACIÓN]
- `docs/specifications/SPEC-002_opportunity_search.md` creado con 20+ secciones completas
- Especificación incluye 30+ criterios de aceptación funcionales
- API contract definido con 5+ endpoints documentados
- Modelo de datos especificado con relaciones claras
- Estrategia de testing definida (API + Integration + E2E)

[VERIFICADO — REVISIÓN]
- Reviewer asignado: [Nombre]
- Comentarios incorporados: [Lista o "Ninguno"]
- Aprobación formal: [Fecha]

[VERIFICADO — CONSISTENCIA]
- No hay contradicciones con SPEC-001
- No hay contradicciones con ADRs existentes
- Endpoints no colisionan con API actual
- Modelo de datos compatible con migraciones existentes

---

## 📝 CONTENIDO ESPERADO DE SPEC-002 (Esquema Detallado)

```markdown
# SPEC-002 — Opportunity Search System

## 1. Nombre
## 2. Objetivo
## 3. Contexto
## 4. Problema
## 5. Alcance
   5.1. Incluye
   5.2. Fuera de Alcance
## 6. Actores
## 7. Precondiciones
## 8. Flujo Principal
## 9. Flujos Alternativos
## 10. Reglas de Negocio
    10.1. Quality Score Algorithm
    10.2. Deduplicación
    10.3. Geolocalización
    10.4. Categorización
    10.5. SLA de Refresco
## 11. Datos de Entrada
## 12. Datos de Salida
## 13. API Contract
    13.1. GET /api/v1/opportunities/search
    13.2. GET /api/v1/opportunities/{id}
    13.3. POST /api/v1/opportunities/{id}/convert
    13.4. GET /api/v1/opportunities/sources
    13.5. POST /api/v1/opportunities/{id}/flag
    13.6. Request/Response Examples
    13.7. Error Codes
## 14. Persistencia
    14.1. Tabla: opportunities
    14.2. Tabla: opportunity_sources
    14.3. Tabla: opportunity_tags
    14.4. Relaciones con leads
    14.5. Índices
## 15. Frontend Requirements
    15.1. Búsqueda Avanzada UI
    15.2. Filtros (geografía, servicio, calidad, fuente)
    15.3. Lista de Resultados
    15.4. Detalle de Oportunidad
    15.5. Conversión a Lead (modal)
    15.6. Estados de UI
## 16. Backend Requirements
    16.1. OpportunitySearchService
    16.2. OpportunityScraperJob
    16.3. OpportunityDeduplicationService
    16.4. OpportunityScoringService
    16.5. Events: OpportunityCreated, OpportunityConverted
## 17. Seguridad
    17.1. Autenticación requerida
    17.2. Autorización por rol
    17.3. Rate limiting
    17.4. Protección contra abuso de scraping
## 18. Manejo de Errores
    18.1. Errores de scraping
    18.2. Errores de conexión
    18.3. Errores de validación
    18.4. Reintentos y backoff
## 19. Performance
    19.1. Search < 1000ms
    19.2. Detalle < 200ms
    19.3. Scraping asíncrono
    19.4. Cache strategy
## 20. Testing Strategy
    20.1. API Tests (10 casos)
    20.2. Integration Tests (5 casos)
    20.3. E2E Tests (6 flujos)
    20.4. Performance Tests
## 21. Observabilidad
    21.1. Logging levels
    21.2. Métricas Prometheus
    21.3. Alertas configuradas
## 22. Criterios de Aceptación (30+)
## 23. Dependencias Externas
## 24. Riesgos
## 25. Estado
```

---

## ✨ DEFINICIÓN DE DONE PARA ESTA TAREA

**TASK-004 se considera DONE únicamente cuando:**

1. ✅ El archivo `docs/specifications/SPEC-002_opportunity_search.md` existe con 20+ secciones completas
2. ✅ La especificación tiene 30+ criterios de aceptación funcionales verificables
3. ✅ El API contract define al menos 5 endpoints con request/response examples
4. ✅ El modelo de datos está completamente especificado
5. ✅ La estrategia de testing está definida (API + Integration + E2E)
6. ✅ Un reviewer ha aprobado formalmente la especificación
7. ✅ No hay contradicciones con SPEC-001 u otros documentos
8. ✅ Este archivo (TASK-004.md) está actualizado con evidencia
9. ✅ MASTER_TRACKING.md refleja estado DONE
10. ✅ IMPLEMENTATION_GUIDE.md actualizado

---

**Nota:** Esta tarea es de **DOCUMENTACIÓN DE ESPECIFICACIÓN**, no de implementación. La implementación correspondiente será TASK-006 (Admin Opportunity Search) una vez esta especificación esté aprobada.
