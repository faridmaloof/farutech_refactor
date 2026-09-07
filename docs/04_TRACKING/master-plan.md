# 📊 Master Tracking Plan — Farutech Website Ecosystem

**Última actualización:** 2026-09-05
**Estado General:** 🟡 En Desarrollo (Progreso real inferior al reportado previamente — ver nota de auditoría)

> ⚠️ **Nota de auditoría (2026-09-05):** el "45% implementado" reportado en la versión anterior de este documento no reflejaba piezas críticas del alcance funcional completo (módulos de Newsletter/Blog en admin, cotizaciones/tarifas, señales reales de Opportunity Search). Este documento se actualiza para incluir las tareas correctivas y las tareas que cierran brechas funcionales identificadas frente a la definición de producto completa. Ver también: [ADR-005](../01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md), [ADR-006](../01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md), [ADR-007](../01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md).
>
> Alcance de este documento: **Website Ecosystem** únicamente. La futura `platform` (ver SPEC-003) se trackeará en su propio master-plan cuando ese proyecto inicie formalmente.

---

## 🎯 Resumen Ejecutivo de Fases

| Fase | Nombre | Estado | Progreso | Tareas Asociadas |
|------|--------|--------|----------|-------------------|
| **FASE 1-2** | Auditoría y Línea Base | ✅ COMPLETADO | 100% | TASK-000A |
| **FASE 3** | Decisiones Arquitectónicas (ADRs) | 🔄 EN PROGRESO | 80% | TASK-000B, TASK-000C, TASK-000D, y nuevas ADR-005/006/007 |
| **FASE 4** | Normalización de Documentación | 🔄 EN PROGRESO | 70% | TASK-007, TASK-008, TASK-016 |
| **FASE 5** | Especificaciones SDD | ✅ COMPLETADO | 100% | TASK-003 (SPEC-001), TASK-004 (SPEC-002 v1.1), SPEC-003/004/005/006 |
| **FASE 7** | Foundation Admin & API Client | 🔄 EN PROGRESO | 60% | TASK-009, TASK-010, TASK-011 |
| **FASE 11** | Implementación MiniCRM (Admin) | 🔄 EN PROGRESO | 30% | TASK-005 (Leads), TASK-006 (Opportunities) |
| **FASE 13** | Testing & Calidad E2E | ⬜ BACKLOG | 15% | TASK-012 |
| **FASE 14** | Corrección de Deuda Técnica (Auditoría 2026-09) | ⬜ BACKLOG | 0% | TASK-013 a TASK-017, TASK-023, TASK-024 |
| **FASE 15** | Cierre de Brechas Funcionales (Requisitos 1-6 completos) | ⬜ BACKLOG | 0% | TASK-018 a TASK-022, TASK-025, TASK-026 |

---

## 📋 Tablero Maestro de Tareas

| ID Tarea | Nombre | Fase | Prioridad | Estado | Documento / Artefacto |
|----------|--------|------|-----------|--------|------------------------|
| **TASK-000A** | Aprobación de Auditoría Técnica | FASE 2 | 🔴 CRÍTICO | ✅ DONE | `docs/04_TRACKING/tasks/TASK-000A.md` |
| **TASK-000B** | Decisión Design System Structure | FASE 3 | 🔴 CRÍTICO | ✅ DONE | `docs/01_ARCHITECTURE/adr/ADR-002_design_system_structure.md` |
| **TASK-000C** | Decisión Intranet Necesidad | FASE 3 | 🟡 HIGH | ✅ DONE | `docs/01_ARCHITECTURE/adr/ADR-003_intranet_strategy.md` |
| **TASK-000D** | Decisión Multi-Database Strategy | FASE 3 | 🟡 HIGH | ⚠️ DECIDIDO NO EJECUTADO | `docs/01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md` |
| **TASK-003** | SPEC-001: Lead Management System | FASE 5 | 🔴 HIGH | ✅ DONE | `docs/02_SPECIFICATIONS/SPEC-001_Lead_Management.md` |
| **TASK-004** | SPEC-002: Opportunity Search System | FASE 5 | 🔴 CRÍTICO | 🔄 EXTENDIDA v1.1 | `docs/02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md` |
| **TASK-007** | Actualizar README con Estado Real | FASE 4 | 🟢 MEDIUM | 🔄 EN PROGRESO | `README.md` |
| **TASK-008** | Normalizar Documentación | FASE 4 | 🟢 MEDIUM | 🔄 EN PROGRESO | `docs/README.md`, `docs/00_INDEX.md` |
| **TASK-009** | Estructura Directorios Base Admin | FASE 7 | 🔴 CRÍTICO | 🔄 EN PROGRESO | `apps/admin/src/features/` |
| **TASK-010** | Integración Design System en Admin | FASE 9 | 🔴 CRÍTICO | 🔄 EN PROGRESO | `apps/admin/` |
| **TASK-011** | Capa Servicios API (Client) Admin | FASE 7 | 🔴 CRÍTICO | 🔄 EN PROGRESO | `apps/admin/src/shared/api/` |
| **TASK-005** | Admin Panel: Leads Management Page | FASE 11 | 🔴 CRÍTICO | 🔄 EN PROGRESO | `apps/admin/src/features/leads/` |
| **TASK-006** | Admin Panel: Opportunity Search | FASE 11 | 🔴 CRÍTICO | 🔄 EN PROGRESO | `apps/admin/src/features/opportunities/` |
| **TASK-012** | Configuración Testing E2E / Unitario | FASE 13 | 🟡 HIGH | ⬜ BACKLOG | `apps/admin/tests/` |
| **TASK-013** | Corregir referencia rota en `Framework.Automation.sln` | FASE 14 | 🔴 CRÍTICO | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-013.md` |
| **TASK-014** | Consolidar `apps/api` → `apps/website/src/backend` | FASE 14 | 🔴 CRÍTICO | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-014.md` (ADR-005) |
| **TASK-015** | Admin bajo path `/admin` | FASE 14 | 🔴 CRÍTICO | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-015.md` (ADR-006) |
| **TASK-016** | Sincronizar documentación desactualizada | FASE 14 | 🟡 HIGH | 🔄 EN PROGRESO | `docs/04_TRACKING/tasks/TASK-016.md` |
| **TASK-017** | Ejecutar consolidación de BD en infraestructura | FASE 14 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-017.md` (ADR-004) |
| **TASK-018** | Admin: Gestión de Mensajes de Contáctenos | FASE 15 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-018.md` (Req. 6.1) |
| **TASK-019** | Admin: Newsletter WYSIWYG | FASE 15 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-019.md` (SPEC-004, Req. 6.2) |
| **TASK-020** | Admin: Blog CMS con SEO | FASE 15 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-020.md` (SPEC-005, Req. 6.3) |
| **TASK-021** | Opportunity Search: señales reales de negocio | FASE 15 | 🔴 CRÍTICO | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-021.md` (SPEC-002 v1.1, Req. 6.4) |
| **TASK-022** | Mini CRM: Cotizaciones + Tarifas ("minipos") | FASE 15 | 🔴 CRÍTICO | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-022.md` (SPEC-006, Req. 6.5) |
| **TASK-023** | Corregir JSON-LD ausente en prerender (SEO) | FASE 14 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-023.md` |
| **TASK-024** | Resolver estado de `apps/intranet` (huérfano) | FASE 14 | 🟢 MEDIUM | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-024.md` |
| **TASK-025** | Independencia real de páginas de servicio | FASE 15 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-025.md` (Req. 1) |
| **TASK-026** | Auditoría formal Lighthouse (Performance/A11y/SEO) | FASE 15 | 🟡 HIGH | ⬜ BACKLOG | `docs/04_TRACKING/tasks/TASK-026.md` (Req. 2, 3, 5) |

### Orden de Ejecución Recomendado (FASE 14, correctivas)

Las tareas de FASE 14 tienen dependencias entre sí y deben ejecutarse en este orden para minimizar retrabajo sobre los mismos archivos (`haproxy.cfg`, `docker-compose.yml`, `Framework.Automation.sln`):

```
TASK-014 (consolidar backend)
   └─▶ TASK-013 (fix .sln — coordinado con el movimiento de TASK-014)
   └─▶ TASK-015 (admin bajo /admin — toca el mismo gateway/compose)
         └─▶ TASK-017 (consolidación BD — mismo docker-compose.yml)
               └─▶ TASK-016 (sincronizar docs — con todo lo anterior ya estable)
TASK-023 (JSON-LD) — independiente, puede ejecutarse en paralelo
TASK-024 (intranet) — independiente, puede ejecutarse en paralelo
```

### Orden Recomendado (FASE 15, funcionales)

```
TASK-018 (contacto) — independiente, la más simple, buen punto de partida
TASK-019 (newsletter) ─┬─ decisión compartida: ContentBlockEditor en Design System
TASK-020 (blog)        ─┘
TASK-021 (opportunity search real) — requiere decisión de producto sobre LinkedIn antes de estimar
TASK-022 (cotizaciones/tarifas) — requiere SPEC-001 estable (TASK-005) como base
TASK-025 (independencia de páginas de servicio) — requiere decisión previa de Product Owner, independiente del resto
TASK-026 (auditoría Lighthouse) — ejecutar al final, requiere TASK-015 y TASK-023 ya cerradas
```

---

## 🏗️ Estado Verificado por Aplicación

1. **Website Público (`apps/website/src/frontend/`)**:
   - **Tecnología:** React 18 + Vite + Tailwind CSS v4 (**no Next.js** — corregido en esta auditoría).
   - **Estado:** 🟡 Funcional con gaps de SEO (ver TASK-023) y de independencia parcial entre páginas de servicio (comparten `ServiceScaffold`).
   - **Optimizaciones:** Code splitting con `React.lazy` y Suspense, bundle principal optimizado (< 450 kB).

2. **Admin Panel (`apps/admin/src/frontend/`)**:
   - **Tecnología:** React 18 + Vite + TypeScript.
   - **Estado:** 🟡 En Desarrollo (~20% del alcance funcional completo del requisito 6 — corregido a la baja tras auditoría; el 45% previo no contemplaba Newsletter, Blog, Contacto, Cotizaciones/Tarifas ni las señales reales de Opportunity Search). Login, Dashboard básico, Leads en progreso.
   - **Pendiente crítico:** servir bajo `/admin` (TASK-015, hoy no implementado ni por subdominio ni por path).

3. **Backend (`apps/website/src/backend/` tras ADR-005 — antes `apps/api/src/backend/`)**:
   - **Tecnología:** Laravel 11 + PHP 8.2 + Sanctum Auth.
   - **Estado:** 🟡 Funcional para lo ya construido (`/contact`, `/newsletter`, `/leads`), pero con `FindOpportunitiesJob` en estado de stub (ver TASK-021) y sin ningún artefacto de Cotizaciones/Tarifas (ver TASK-022).
   - **Pendiente crítico:** migración física a `apps/website/src/backend` (TASK-014, aún no ejecutada al momento de este documento).

4. **Design System (`packages/design-system/src/`)**:
   - **Tecnología:** React + TypeScript + Tailwind CSS.
   - **Estado:** ✅ Estructura normalizada (ADR-002), 45+ componentes exportados directamente desde `src/`.
   - **Nota:** confirmado como paquete de reutilización dual (admin del website + futuro dashboard de `platform`), formalizado en ADR-007.

5. **Intranet (`apps/intranet/`)**:
   - **Estado:** ⏸️ CONGELADA (ADR-003 Alternativa D), sin fecha de resolución — marcada como elemento huérfano a resolver (TASK-024).

6. **Platform (futuro, `apps/platform/` — aún no existe)**:
   - **Estado:** 🔵 Visión documentada (SPEC-003), sin proyecto iniciado. Fuera del alcance de este master-plan — ver ADR-007.

---

## 🔗 Documentos Relacionados

- [Índice de Documentación](../00_INDEX.md)
- [Especificaciones Funcionales](../02_SPECIFICATIONS/)
- [ADRs](../01_ARCHITECTURE/adr/)
