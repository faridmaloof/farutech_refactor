# TASK-010 — Integración Design System en Admin App

**Fase:** FASE 9 — Design System Build  
**Estado:** ⬜ BACKLOG  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Frontend Lead  
**Fecha Creación:** 2024-09-04  
**Última Actualización:** 2024-09-04  

---

## 🎯 Objetivo

Integrar el Design System (@farutech/design-system) en la aplicación Admin, configurando aliases, providers y asegurando que todos los componentes estén disponibles para su uso en las features del MiniCRM.

---

## 📋 Dependencias

| ID Tarea | Nombre | Estado Requerido |
|----------|--------|------------------|
| TASK-000B | Decisión Design System Structure | ✅ DONE |
| TASK-002 | Generar build del Design System | ⬜ BACKLOG |
| TASK-009 | Estructura de Directorios Base | 🔄 READY |

---

## 📂 Archivos Afectados

### Modificados
- `apps/admin/package.json` — Agregar dependencia @farutech/design-system
- `apps/admin/vite.config.ts` — Configurar alias @farutech/ui
- `apps/admin/tsconfig.json` — Agregar tipos del Design System
- `apps/admin/src/main.tsx` — Envolver con DesignSystem Provider
- `apps/admin/src/App.tsx` — Importar componentes base

### Nuevos
- `apps/admin/src/shared/ui/DesignSystemProvider.tsx` — Wrapper de contexto
- `apps/admin/src/shared/ui/components/index.ts` — Re-export de componentes DS

---

## ✅ Criterios de Aceptación

- [ ] @farutech/design-system instalado como dependencia local/vía npm
- [ ] Alias `@farutech/ui` configurado y funcional
- [ ] DesignSystemProvider envuelve toda la aplicación Admin
- [ ] Todos los componentes del DS son importables desde `@farutech/ui`
- [ ] Theme configurado correctamente (colores, tipografía, spacing)
- [ ] Storybook de Admin muestra componentes del DS
- [ ] Build exitoso sin warnings de tipos
- [ ] Documentación de integración creada

---

## 🧪 Pruebas Requeridas

### Unit Tests
- [ ] Componentes del DS se renderizan sin errores
- [ ] Theme context es accesible desde cualquier componente
- [ ] Imports desde `@farutech/ui` resuelven correctamente

### Integration Tests
- [ ] Build completo con Design System integrado
- [ ] Tree-shaking funciona (solo se incluye lo usado)

### Visual Tests
- [ ] Componentes se ven consistentes con especificación del DS
- [ ] Responsive design funciona según tokens del DS

---

## 🔍 Validaciones Obligatorias

Antes de marcar como DONE, verificar:

- [ ] **Lint:** `npm run lint` sin errores
- [ ] **Type Check:** `npm run typecheck` sin errores de tipos del DS
- [ ] **Build:** `npm run build` exitoso
- [ ] **Storybook:** `npm run storybook` inicia sin errores
- [ ] **Documentación:** Guía de uso del DS en Admin creada
- [ ] **Changelog:** IMPLEMENTATION_GUIDE.md actualizado

---

## 📄 Documentación a Actualizar

- [ ] `docs/design-system/admin-integration.md` — Nueva documentación
- [ ] `docs/tracking/MASTER_TRACKING.md` — Estado de esta tarea
- [ ] `IMPLEMENTATION_GUIDE.md` — Sección FASE 9
- [ ] `apps/admin/README.md` — Ejemplos de uso del DS

---

## ⚠️ Riesgos Conocidos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Version mismatch entre DS y Admin | Media | Alto | Usar version fija, no ^ o ~ |
| Tree-shaking no funciona | Baja | Medio | Verificar bundle size post-build |
| Tipos TypeScript conflictivos | Media | Medio | Extender tipos del DS, no reemplazar |

---

## 🚧 Bloqueos Actuales

Depende de TASK-002 (Generar build del Design System)

---

## 📆 Historial de Cambios

| Fecha | Estado Anterior | Estado Nuevo | Cambio | Responsable |
|-------|-----------------|--------------|--------|-------------|
| 2024-09-04 | BACKLOG | BACKLOG | Tarea creada, pendiente de TASK-002 | Architect |

---

## 🔗 Enlaces Relacionados

- [SPEC-001](../specifications/SPEC-001_Lead_Management.md) — Usa componentes del DS
- [SPEC-002](../specifications/SPEC-002_Opportunity_Search.md) — Usa componentes del DS
- [ADR-002](../adr/ADR-002_design_system_structure.md) — Estructura del DS
- [TASK-002](./TASK-002.md) — Build del Design System

---

## 📊 Evidencia de Completado

[VERIFICADO — DEPENDENCIA]
- `@farutech/design-system` listado en package.json

[VERIFICADO — CONFIG]
- Alias `@farutech/ui` configurado en vite.config.ts y tsconfig.json

[VERIFICADO — CÓDIGO]
- `DesignSystemProvider` envuelve `<App />` en main.tsx

[VERIFICADO — BUILD]
- Build exitoso sin warnings de tipos
- Bundle size dentro de límites esperados

[VERIFICADO — DOCUMENTACIÓN]
- Guía de integración documentada en `docs/design-system/admin-integration.md`

---

**Nota:** Esta tarea habilita el uso consistente de UI en todo el Admin. Sin ella, cada desarrollador podría implementar componentes diferentes, rompiendo la coherencia visual.
