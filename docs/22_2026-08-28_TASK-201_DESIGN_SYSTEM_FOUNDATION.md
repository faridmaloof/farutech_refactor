# 22 — TASK-201: Design System foundation + Gobernanza por equipos

**Fecha:** 2026-08-28 · **Estado:** DONE (fase fundacional) · **Repo:** `Farutech/design-system` @ `e9e1d61` · **Rama:** `task/201-design-system-foundation`

## PARTE A — Gobernanza multi-equipo (solicitud del owner)

El owner pidió que la organización refleje equipos especializados (backend, frontend web/flutter, workers, diseño, QA, etc.) para que un cambio de un rol no afecte ni exija revisar el total, evitando conflictos de despliegue.

### Teams creados en la org `Farutech` (verificado con `gh api`)
| Team (slug) | Repo que posee | Permiso |
|---|---|---|
| `web-team` | `website` | push |
| `backend-team` | `backend` | push |
| `admin-team` | `admin` | push |
| `intranet-team` | `intranet` | push |
| `design-team` | `design-system` | push |
| `qa-team` | `framework-automation` | push |
| `platform-team` | `infrastructure` | push |

- Los teams están **vacíos**: hoy la org tiene 1 solo miembro (`faridmaloof`); el owner solo tiene que invitar personas al team correspondiente para que hereden el acceso por equipo.
- **CODEOWNERS** versionado en los 7 repos (`.github/CODEOWNERS`) mapea todo el repo a su team — commit `governance: CODEOWNERS` en cada uno.

### Limitación real encontrada (no inventada)
- La **protección de ramas** (`required_pull_request_reviews`) devolvió **HTTP 403**: GitHub exige plan de pago (Pro/Team) para repos **privados**. Compensación aplicada: CODEOWNERS + convención de PR del equipo. Cuando el owner contrate plan o publique repos, la regla se activa sin cambiar nada.
- Los teams usan `privacy: closed` (visible entre miembros de la org; requisito del plan gratuito).

### Modelo de aislamiento elegido (por qué no monorepo)
Cada equipo trabaja en SU repo; los cruces solo ocurren por **interfaces versionadas**: el design system se consume como paquete (`@farutech/design-system`) con SemVer, y el backend se consume vía API documentada (TASK-103). Un cambio de diseño no toca backend ni website: se publica el paquete y cada app actualiza cuando quiera — ese es el mecanismo anti-solapamiento.

## PARTE B — TASK-201: fundación del paquete (REQ-DS-01..04)

### VERIFY (estado real, no el de docs/08)
- Un tramo previo de esta sesión ya había scaffolded: tokens + `DesignSystemProvider` + Button/Badge (reconciliados) + Input + Alert + Spinner + tests + build Vite (MIGRATION.md filas 1–6 ✅).
- Fuentes inventariadas: `faridmaloof/dashboard` `src/components/ui/*` (47 componentes) y `apps/frontend` `primitives.tsx`/`patterns.tsx` (Button, Eyebrow, SectionHeading, Tag, StatusBadge, Reveal).

### IMPLEMENT (esta iteración)
- **Fila 47 ✅** `Content`: `Eyebrow` + `SectionHeading` migrados de `apps/frontend`, estilos 100% tokens `--ft-*`.
- **Fila 48 ✅** `Reveal`: reescrito con **IntersectionObserver nativo** — elimina la dependencia de framer-motion que tenía el original (doc 08 PERFORMANCE: website liviano) y es SSR-safe (sin observer → visible).
- Ambos integrados a convenciones del paquete: `components/<Name>/index.ts` (entry de build por componente), CSS PascalCase, registro en `styles.css` y `index.ts`, checklist MIGRATION.md actualizado (8/51 migrados).

### RUN TESTS + EVIDENCIA
- `tsc --noEmit`: **limpio**.
- `vitest`: **16/16 PASS** (3 suites) — regresión verde.
- `vite build`: **✓ 175ms**, entries nuevos `Content`/`Reveal` emitidos con sourcemaps.
- Commit `e9e1d61` en `main` (tras rebase sobre `426ca24`); rama de tarea conservada en remoto.

## ROLLBACK
`git revert e9e1d61` en `design-system`; teams/CODEOWNERS son aditivos y se reversan con `gh api -X DELETE`.

## PRÓXIMO PASO
Continuar MIGRATION.md (filas 7+: ButtonGroup, Checkbox, Select...) y luego TASK-203/204 (auth screens, menú horizontal). TASK-202 (consumo desde website) desbloqueada.
