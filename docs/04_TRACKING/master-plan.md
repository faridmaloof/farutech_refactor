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
| FASE 3 — Decisiones arquitectónicas | ✅ COMPLETADO | TASK-000B/C/D, ADR-005/006/007/008/009 |
| FASE 4 — Normalización documental | 🔄 RECONCILIACIÓN | TASK-007/008/016 + reconciliación |
| FASE 5 — SDD | ✅ COMPLETADO | TASK-003/004, SPEC-001..006 |
| FASE 7/9 — Foundation Admin | ⚠️ RECONCILIAR | TASK-009/010/011 → ubicación definitiva en Website |
| FASE 11 — MiniCRM Admin | 🔄 EN DESARROLLO | TASK-005/006; ubicación objetivo en Website |
| FASE 13 — Testing | ⬜ BACKLOG | TASK-012 |
| FASE 14 — Deuda técnica/reconciliación | 🔄 EN PROGRESO | TASK-013/014/016/025/027 + decisiones de release |
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
| TASK-005 | 🔄 EN DESARROLLO | CRÍTICO | Leads Admin; debe alinearse con Website |
| TASK-006 | 🔄 EN DESARROLLO | CRÍTICO | Opportunities; debe alinearse con Website |
| TASK-007 | 🔄 RECONCILIAR | MEDIUM | README/documentación vigente |
| TASK-008 | 🔄 RECONCILIAR | MEDIUM | Índice/documentación |
| TASK-009 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | No crear apps/admin; integrar en Website |
| TASK-010 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | Design System en Website/Admin |
| TASK-011 | ⚠️ SUPERSEDED/REUBICAR | CRÍTICO | API client en Website |
| TASK-012 | ⬜ BACKLOG | HIGH | Testing unificado |
| TASK-013 | ✅ DONE | CRÍTICO | Framework.Automation.sln |
| TASK-014 | ✅ DONE | CRÍTICO | Backend consolidado |
| TASK-015 | ⚠️ SUPERSEDED | CRÍTICO | `/admin` correcto; topología independiente obsoleta |
| TASK-016 | ⚠️ REABRIR/RECONCILIAR | HIGH | Reconciliar contra ADR-008 |
| TASK-017 | ⬜ BACKLOG | HIGH | Infraestructura histórica; reemplazada por TASK-027 donde contradice ADR-008 |
| TASK-018 | ⬜ BACKLOG | HIGH | Contacto |
| TASK-019 | ⬜ BACKLOG | HIGH | Newsletter |
| TASK-020 | ⬜ BACKLOG | HIGH | Blog CMS |
| TASK-021 | ⬜ BACKLOG | CRÍTICO | Opportunity Search real |
| TASK-022 | ⬜ BACKLOG | CRÍTICO | Cotizaciones/Tarifas |
| TASK-023 | ⬜ BACKLOG | HIGH | JSON-LD/SEO |
| TASK-024 | ⬜ BACKLOG | MEDIUM | Decisión Intranet |
| TASK-025 | 🟢 READY | CRÍTICO | Integrar Admin definitivamente en Website |
| TASK-026 | 🟡 READY_FOR_LOCAL_EXECUTION | HIGH | Publicar Design System + Framework.Core |
| TASK-027 | ⬜ TODO | HIGH | Reconciliar infraestructura con arquitectura final |

> **Nota de identidad:** `TASK-017.md` es la tarea histórica de infraestructura. La antigua `TASK-017-PACKAGES-PUBLISHING.md` tenía una colisión de ID y fue normalizada como `TASK-026-PACKAGES-PUBLISHING.md`.

## 🔗 Orden de ejecución vigente

```text
RECONCILIACIÓN DOCUMENTAL
    │
    ├── ADR-008: Admin dentro de Website
    ├── ADR-009: distribución de paquetes
    ├── reconciliar tareas/documentos antiguos
    └── eliminar contradicciones operativas
             │
             ▼
TASK-025 — integrar Admin en apps/website
             │
             ├── frontend /admin
             ├── backend consolidado
             ├── tests + Framework.Core
             ├── Docker / gateway / CI
             └── retirar dependencia operativa de apps/admin
             │
             ├───────────────┐
             ▼               ▼
TASK-027                     TASK-026
infraestructura              packages
             │               │
             └───────┬───────┘
                     ▼
TASK-012 / TASK-023 / TASK-024
                     │
                     ▼
TASK-018..022 — brechas funcionales
                     │
                     ▼
verificación E2E + security + quality gates
```

## 🧭 Regla para tareas antiguas

Una tarea histórica puede permanecer `DONE` únicamente si su resultado sigue siendo válido. Si una implementación fue reemplazada por una decisión posterior, debe marcarse `SUPERSEDED`, aunque el trabajo histórico haya sido ejecutado.

No borrar tareas ni auditorías históricas para ocultar cambios de arquitectura.

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

## Definition of Done global

Una tarea solo puede cerrarse cuando exista evidencia de:

- criterios de aceptación satisfechos;
- build limpio: **0 errores y 0 warnings**;
- type-check/lint/static analysis aplicables limpios;
- tests aplicables en verde;
- seguridad revisada y sin bloqueadores;
- documentación y changelog reconciliados;
- ausencia de contradicción con ADR/SPEC vigentes;
- comandos y resultados registrados.

Si una validación requerida no puede ejecutarse, la tarea no es `DONE`.
