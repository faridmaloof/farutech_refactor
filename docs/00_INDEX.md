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
│       ├── ADR-004_multi_database_strategy.md         # decidido, pendiente
│       ├── ADR-005_website_backend_consolidation.md
│       ├── ADR-006_admin_routing_strategy_v2.md       # SUPERSEDED por ADR-008
│       ├── ADR-007_platform_scope_separation.md
│       └── ADR-008_admin_hosting_and_ownership.md     # VIGENTE
├── 02_SPECIFICATIONS/
├── 03_IMPLEMENTATION/
├── 04_TRACKING/
│   ├── master-plan.md
│   ├── guia-de-uso.md
│   ├── IMPLEMENTATION_PROMPT.md
│   ├── change-log/CHANGELOG.md
│   └── tasks/
└── 99_ARCHIVE/                                        # evidencia histórica
```

## 🔗 Enlaces rápidos

- [Master Plan](04_TRACKING/master-plan.md)
- [Guía de Tracking](04_TRACKING/guia-de-uso.md)
- [ADRs](01_ARCHITECTURE/adr/)
- [Especificaciones](02_SPECIFICATIONS/)
- [CHANGELOG](04_TRACKING/change-log/CHANGELOG.md)
- [TASK-025 — Integración definitiva del Admin](04_TRACKING/tasks/TASK-025.md)

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

## 📌 Estados documentales

- `TODO` — identificado, aún no preparado.
- `READY` — puede ejecutarse si sus dependencias están satisfechas.
- `IN PROGRESS` — ejecución activa.
- `BLOCKED` — requiere resolver una dependencia/decisión.
- `VALIDATION` — implementación terminada, pendiente de evidencia final.
- `DONE` — criterios satisfechos con evidencia.
- `SUPERSEDED` — reemplazado por una decisión/implementación posterior.
- `ARCHIVED` — conservado como historia y no aplicable al estado actual.

## 🧾 Nota de reconciliación 2026-09-07

La auditoría documental detectó que la estrategia intermedia de ADR-006 y TASK-015 seguía describiendo `apps/admin` como aplicación independiente. La URL `/admin` continúa siendo correcta, pero la topología fue reemplazada por ADR-008. TASK-025 contiene la migración definitiva.

Los documentos bajo `docs/99_ARCHIVE/` que describen subdominios, repositorios separados o `apps/admin` se conservan como evidencia histórica y **no constituyen instrucciones de implementación actuales**.
