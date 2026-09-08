# 📚 Farutech Documentation — Índice Maestro

Bienvenido a la documentación técnica del **Website Ecosystem** de Farutech.

> **Arquitectura vigente:** Website público + Admin integrado dentro de `apps/website`, accesible exclusivamente mediante `<dominio>/admin`. El backend Website/Admin vive en `apps/website/src/backend`. `apps/admin` no es arquitectura objetivo. Ver [ADR-008](01_ARCHITECTURE/adr/ADR-008_admin_hosting_and_ownership.md).
>
> La futura plataforma multi-tenant (`platform`) mantiene un alcance separado mediante [SPEC-003](02_SPECIFICATIONS/SPEC-003_Platform_Vision.md) y [ADR-007](01_ARCHITECTURE/adr/ADR-007_platform_scope_separation.md).

---

## 🧭 Mapa General

```text
docs/
├── 00_INDEX.md
├── README.md
├── 01_ARCHITECTURE/
│   ├── overview.md
│   └── adr/
│       ├── ADR-001_admin_routing_strategy.md          # SUPERSEDED
│       ├── ADR-002_design_system_structure.md
│       ├── ADR-003_intranet_strategy.md
│       ├── ADR-004_multi_database_strategy.md
│       ├── ADR-005_website_backend_consolidation.md
│       ├── ADR-006_admin_routing_strategy_v2.md       # SUPERSEDED por ADR-008
│       ├── ADR-007_platform_scope_separation.md       # VIGENTE
│       ├── ADR-008_admin_hosting_and_ownership.md     # VIGENTE
│       └── ADR-009_package_distribution_strategy.md   # VIGENTE
├── 02_SPECIFICATIONS/
├── 03_IMPLEMENTATION/
├── 04_TRACKING/
│   ├── master-plan.md
│   ├── TASK_WORKFLOW_AND_HANDOFF.md
│   ├── RECONCILIATION_MATRIX.md
│   ├── guia-de-uso.md
│   ├── IMPLEMENTATION_PROMPT.md
│   ├── change-log/CHANGELOG.md
│   └── tasks/
└── 99_ARCHIVE/                                        # evidencia histórica
```

## 🔗 Enlaces rápidos

- [Master Plan](04_TRACKING/master-plan.md)
- [Workflow, ownership y quality gates](04_TRACKING/TASK_WORKFLOW_AND_HANDOFF.md)
- [Matriz de reconciliación](04_TRACKING/RECONCILIATION_MATRIX.md)
- [Guía de Tracking](04_TRACKING/guia-de-uso.md)
- [ADRs](01_ARCHITECTURE/adr/)
- [Especificaciones](02_SPECIFICATIONS/)
- [CHANGELOG](04_TRACKING/change-log/CHANGELOG.md)
- [TASK-025 — Integración definitiva del Admin](04_TRACKING/tasks/TASK-025.md)
- [TASK-026 — Publicación de paquetes](04_TRACKING/tasks/TASK-026-PACKAGES-PUBLISHING.md)
- [TASK-027 — Infraestructura y topología](04_TRACKING/tasks/TASK-027-INFRASTRUCTURE-TOPOLOGY.md)

## 🏗️ Reglas arquitectónicas clave

1. **Admin:** `<dominio>/admin`.
2. **No:** `admin.<dominio>`.
3. **Ownership:** Admin dentro de `apps/website`.
4. **Backend:** `apps/website/src/backend`.
5. **No:** `apps/admin` como aplicación objetivo.
6. **Design System:** `packages/design-system`.
7. **Automation Core:** `packages/framework-automation/src/Framework.Core`.
8. **Ejemplo:** `Examples/tests/framework-automation` no es un segundo framework.
9. **Histórico:** documentación obsoleta se conserva y se marca `SUPERSEDED`/`ARCHIVED`.
10. **Platform:** alcance futuro separado; no mezclarlo con Website Ecosystem.
11. **Packages:** Design System y Framework.Core tienen versionado y distribución independientes.
12. **Orquestación:** `/TL` y `/lider-Tecnico` son la entrada recomendada para implementación multiagente.

## 📌 Estados documentales

- `TODO` — identificado, aún no preparado.
- `READY` — puede ejecutarse si sus dependencias están satisfechas.
- `IN PROGRESS` — ejecución activa.
- `BLOCKED` — requiere resolver una dependencia/decisión.
- `VALIDATION` — implementación terminada, pendiente de evidencia final.
- `DONE` — criterios satisfechos con evidencia.
- `SUPERSEDED` — reemplazado por una decisión/implementación posterior.
- `ARCHIVED` — conservado como historia y no aplicable al estado actual.

## 🧾 Reconciliación 2026-09-07

ADR-007 queda reservado para Platform. La estrategia de distribución de paquetes se normaliza como ADR-009. La tarea de publicación de paquetes se normaliza como TASK-026 porque TASK-017 corresponde a infraestructura histórica.

ADR-006/TASK-015 describieron una etapa intermedia en la que el Admin era una aplicación independiente. Esa etapa queda superseded por ADR-008/TASK-025.

Las referencias históricas a `apps/admin`, subdominios o repositorios separados pueden permanecer cuando documenten decisiones anteriores, pero no son instrucciones actuales.
