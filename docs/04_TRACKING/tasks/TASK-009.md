# TASK-009 — Estructura de Directorios Base para Admin (MiniCRM)

**Fase:** FASE 7 — Foundation  
**Estado:** 🔄 READY  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Frontend Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Crear la estructura de directorios base para la aplicación Admin siguiendo patrones Feature-Sliced Design, permitiendo escalabilidad, mantenibilidad y separación clara de responsabilidades para el MiniCRM (Leads, Oportunidades, Newsletter, Blog).

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-000C | Decisión Intranet Necesidad | ✅ DONE |
| TASK-007 | Actualizar README | 🔄 READY |
| TASK-008 | Normalizar documentación | 🔄 READY |

---

## 📂 Archivos Afectados

### Nuevos (Estructura de Directorios)
```
apps/admin/src/
├── features/
│   ├── leads/
│   │   ├── pages/
│   │   │   └── LeadsPage.tsx
│   │   ├── components/
│   │   │   ├── LeadsTable.tsx
│   │   │   ├── LeadFilters.tsx
│   │   │   └── LeadDetailModal.tsx
│   │   ├── hooks/
│   │   │   └── useLeads.ts
│   │   ├── services/
│   │   │   └── leadApi.ts
│   │   └── types/
│   │       └── lead.types.ts
│   ├── opportunities/
│   │   ├── pages/
│   │   │   └── OpportunitySearchPage.tsx
│   │   ├── components/
│   │   │   ├── OpportunitySearch.tsx
│   │   │   ├── SourceSelector.tsx
│   │   │   └── QualityScoreIndicator.tsx
│   │   ├── hooks/
│   │   │   └── useOpportunitySearch.ts
│   │   ├── services/
│   │   │   └── opportunityApi.ts
│   │   └── types/
│   │       └── opportunity.types.ts
│   ├── newsletter/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── blog/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── services/
├── entities/
│   ├── user/
│   ├── lead/
│   └── opportunity/
├── shared/
│   ├── api/
│   │   └── client.ts
│   ├── ui/
│   │   └── components/
│   └── lib/
└── widgets/
    ├── header/
    ├── sidebar/
    └── auth-guard/
```

### Modificados
- `apps/admin/tsconfig.json` — Agregar path aliases (@features/*, @entities/*, @shared/*)
- `apps/admin/vite.config.ts` — Configurar resolve aliases
- `apps/admin/package.json` — Agregar scripts de validación de estructura

---

## ✅ Criterios de Aceptación

- [ ] Todos los directorios listados existen físicamente
- [ ] Archivos placeholder creados en cada directorio (`.gitkeep` o componente base)
- tsconfig.json configurado con path aliases funcionales
- [ ] Vite config actualizado con resolve aliases
- [ ] Importaciones de prueba funcionan (`import { LeadsTable } from '@features/leads'`)
- [ ] Lint pasa sin errores de imports
- [ ] Build exitoso con nueva estructura
- [ ] Documentación de estructura creada en `docs/architecture/admin-folder-structure.md`

---

## 🧪 Pruebas Requeridas

### Unit Tests
- [ ] Test de importación de aliases desde diferentes niveles de anidación
- [ ] Test de resolución de módulos circular

### Integration Tests
- [ ] Build completo del proyecto con nueva estructura
- [ ] Hot reload funciona con Vite

### Validación Manual
- [ ] Navegación entre features funciona
- [ ] Imports cruzados entre features resueltos correctamente

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Lint:** `npm run lint` sin errores de imports
- [ ] **Type Check:** `npm run typecheck` sin errores de paths
- [ ] **Build:** `npm run build` exitoso
- [ ] **Dev Server:** `npm run dev` inicia sin warnings
- [ ] **Documentación:** `docs/architecture/admin-folder-structure.md` creada
- [ ] **Changelog:** IMPLEMENTATION_GUIDE.md actualizado

---

## 📄 Documentación a Actualizar

- [ ] `docs/architecture/admin-folder-structure.md` — Nueva documentación
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección FASE 7
- [ ] `apps/admin/README.md` — Guía de estructura para devs

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Imports circulares entre features | Media | Medio | ESLint rule para detectar circular deps |
| Confusión con path aliases | Baja | Bajo | Documentación clara + ejemplos en README |
| Refactor futuro costoso | Baja | Alto | Seguir Feature-Sliced Design estrictamente |

---

## 🚧 Bloqueos Actuales

Ninguno

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | READY | Dependencias TASK-007, TASK-008 completadas | Architect |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](../specifications/SPEC-001_Lead_Management.md) — Especificación de Leads
- [SPEC-002](../specifications/SPEC-002_Opportunity_Search.md) — Especificación de Oportunidades
- [ADR-002](../adr/ADR-002_design_system_structure.md) — Estructura Design System
- [Feature-Sliced Design](https://feature-sliced.design/) — Metodología de referencia

---

## 📊 Evidencia de Completado

[VERIFICADO — ESTRUCTURA]
- Todos los directorios listados existen en `apps/admin/src/`

[VERIFICADO — CONFIG]
- `tsconfig.json` contiene paths: `@features/*`, `@entities/*`, `@shared/*`
- `vite.config.ts` contiene resolve.alias configurado

[VERIFICADO — BUILD]
- Build exitoso: `npm run build` en apps/admin
- Sin warnings de imports no resueltos

[VERIFICADO — DOCUMENTACIÓN]
- `docs/architecture/admin-folder-structure.md` creada con diagramas

---

**Nota:** Esta tarea es FUNDAMENTAL para todas las implementaciones posteriores de features del Admin. Una estructura mal definida generará deuda técnica inmediata.
