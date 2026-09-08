# 📊 Master Tracking Plan — Farutech Website Ecosystem

**Última actualización:** 2026-09-07  
**Estado General:** 🟡 Reconciliación arquitectónica/documental + desarrollo

> **Regla vigente:** el Admin se accede mediante `<dominio>/admin` y pertenece a `apps/website`. `apps/admin` no es arquitectura objetivo. Ver [ADR-008](../01_ARCHITECTURE/adr/ADR-008_admin_hosting_and_ownership.md).
>
> Este documento cubre únicamente el **Website Ecosystem**. La futura `platform` tiene alcance separado según ADR-007/SPEC-003.

---

## 🎯 Fases

| Fase | Estado | Tareas principales |
|---|---|---|
| FASE 1-2 — Auditoría/Línea base | ✅ COMPLETADO | TASK-000A |
| FASE 3 — Decisiones arquitectónicas | ✅ COMPLETADO | TASK-000B/C/D, ADR-005/006/007/008 |
| FASE 4 — Normalización documental | 🔄 RECONCILIACIÓN | TASK-007/008/016 + reconciliación posterior |
| FASE 5 — SDD | ✅ COMPLETADO | TASK-003/004, SPEC-001..006 |
| FASE 7/9 — Foundation Admin | ⚠️ RECONCILIAR | TASK-009/010/011 deben migrarse conceptualmente a `apps/website` |
| FASE 11 — MiniCRM Admin | 🔄 EN DESARROLLO | TASK-005/006; adaptar ubicación objetivo |
| FASE 13 — Testing | ⬜ BACKLOG | TASK-012 |
| FASE 14 — Deuda técnica/reconciliación | 🔄 EN PROGRESO | TASK-013/014/016; TASK-015 superseded; TASK-017/023/024; TASK-025 |
| FASE 15 — Brechas funcionales | ⬜ BACKLOG | TASK-018..022 |

## 📋 Tablero Maestro

| ID | Estado | Prioridad | Acción/resultado |
|---|---|---|---|
| TASK-000A | ✅ DONE | CRÍTICO | Auditoría base aprobada |
| TASK-000B | ✅ DONE | CRÍTICO | ADR-002 |
| TASK-000C | ✅ DONE | HIGH | ADR-003 |
| TASK-000D | ⚠️ DECIDIDO / NO EJECUTADO | HIGH | ADR-004; consolidación pendiente |
| TASK-003 | ✅ DONE | HIGH | SPEC-001 |
| TASK-004 | 🔄 EXTENDIDA v1.1 | CRÍTICO | SPEC-002 |
| TASK-005 | 🔄 EN DESARROLLO | CRÍTICO | Leads Admin; debe alinearse con `apps/website` |
| TASK-006 | 🔄 EN DESARROLLO | CRÍTICO | Opportunities; debe alinearse con `apps/website` |
| TASK-007 | 🔄 RECONCILIAR | MEDIUM | README debe reflejar ADR-008 |
| TASK-008 | 🔄 RECONCILIAR | MEDIUM | Índice/documentación |
| TASK-009 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | No crear `apps/admin`; integrar en Website |
| TASK-010 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | Design System dentro del Admin de Website |
| TASK-011 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | API client dentro del Website |
| TASK-012 | ⬜ BACKLOG | HIGH | Testing unificado |
| TASK-013 | ✅ DONE | CRÍTICO | Framework.Automation.sln |
| TASK-014 | ✅ DONE | CRÍTICO | Backend consolidado en `apps/website/src/backend` |
| TASK-015 | ⚠️ SUPERSEDED | CRÍTICO | URL `/admin` correcta; topología `apps/admin` obsoleta |
| TASK-016 | ⚠️ REABRIR/RECONCILIAR | HIGH | Quedó obsoleta tras ADR-008 |
| TASK-017 | ⬜ BACKLOG | HIGH | Consolidación BD |
| TASK-018 | ⬜ BACKLOG | HIGH | Contacto |
| TASK-019 | ⬜ BACKLOG | HIGH | Newsletter |
| TASK-020 | ⬜ BACKLOG | HIGH | Blog CMS |
| TASK-021 | ⬜ BACKLOG | CRÍTICO | Opportunity Search real |
| TASK-022 | ⬜ BACKLOG | CRÍTICO | Cotizaciones/Tarifas |
| TASK-023 | ⬜ BACKLOG | HIGH | JSON-LD/SEO |
| TASK-024 | ⬜ BACKLOG | MEDIUM | Decisión Intranet |
| TASK-025 | 🟢 READY | CRÍTICO | Integrar Admin definitivamente en `apps/website` |

## 🔗 Orden de ejecución vigente

```text
RECONCILIACIÓN DOCUMENTAL
    │
    ├── ADR-008 (vigente)
    ├── marcar ADR-006/TASK-015 como superseded
    ├── reconciliar TASK-007/008/016
    └── identificar todas las referencias activas a apps/admin
             │
             ▼
TASK-025 — integrar Admin en apps/website
             │
             ├── frontend /admin
             ├── backend ya consolidado
             ├── tests + Framework.Core
             ├── Docker / gateway / CI
             └── retirar dependencia operativa de apps/admin
             │
             ▼
TASK-017 / TASK-023 / TASK-024
             │
             ▼
TASK-018..022 — brechas funcionales
             │
             ▼
TASK-012 + verificación E2E final
```

## 🧭 Regla para tareas antiguas

Una tarea histórica puede permanecer `DONE` únicamente si su resultado sigue siendo válido. Si su implementación fue reemplazada por una decisión posterior, debe marcarse `SUPERSEDED`, aunque el trabajo histórico realmente se haya ejecutado.

No se deben borrar tareas ni auditorías históricas para ocultar cambios de arquitectura.

## 🏗️ Arquitectura objetivo resumida

```text
apps/website/
├── src/frontend/       # Website público + Admin bajo /admin
└── src/backend/        # API Website + API Admin

packages/
├── design-system/      # paquete reutilizable
└── framework-automation/
    └── src/Framework.Core/  # framework de automatización

Examples/tests/framework-automation/ # referencia, no framework paralelo
```

## Definición de Done

Una tarea solo puede cerrarse cuando existe evidencia de:

- implementación real;
- build/type-check/lint aplicables;
- pruebas aplicables;
- seguridad revisada cuando corresponda;
- documentación actualizada;
- changelog actualizado;
- criterios de aceptación satisfechos;
- ausencia de contradicción con ADR/SPEC vigentes.
