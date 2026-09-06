# ADR-005 — Website Backend Consolidation (`apps/api` → `apps/website/src/backend`)

**Fecha:** 2026-09-05
**Estado:** ✅ DECIDIDO — Pendiente de ejecución (ver TASK-014)
**Responsable:** Technical Lead
**Supersede parcialmente:** Estructura de directorios descrita en `overview.md` v1 y en `getting-started.md` v1

---

## Contexto

La auditoría del repositorio (septiembre 2026) identificó que `apps/api` existe como aplicación **top-level independiente**, separada de `apps/website`, aunque en la práctica:

- El 100% de los endpoints implementados en `apps/api/src/backend` (Laravel 11) sirven exclusivamente al ecosistema del sitio web público: `/contact`, `/newsletter`, `/leads`, `/opportunities`, blog público, y los endpoints consumidos por `apps/admin`.
- No existe ningún otro consumidor de esta API fuera del website y su panel de administración.
- El propietario del producto ha aclarado que la intención original era que **el website fuera una unidad autocontenida**: `apps/website/{src/frontend, src/backend, test}`, de modo que cada aplicación del monorepo sea independiente y transportable (clonable, compilable y desplegable por separado), en línea con la futura migración a multi-repo modular (ver ADR-007).

## Problema

Mantener `apps/api` como aplicación separada de `apps/website` genera:

1. **Falsa independencia:** `apps/api` no tiene sentido de negocio fuera del website; separarlo como "aplicación propia" sugiere reutilización que no existe y nunca se ha diseñado.
2. **Confusión de límites:** un desarrollador nuevo no tiene forma de saber, solo mirando el árbol de carpetas, que `apps/api` es en realidad "el backend del website" y no un servicio de plataforma.
3. **Fricción para la futura modularización (ADR-007):** cuando el repositorio evolucione a multi-repo, cada `apps/<nombre>` se convertirá en (o se extraerá a) su propio repositorio. Si `apps/api` permanece separado, un equipo que solo necesita tocar el website tendría que clonar y coordinar dos repos en vez de uno.
4. **Documentación inconsistente:** `getting-started.md`, `README.md` y `overview.md` describen el backend en tres ubicaciones ligeramente distintas, lo que ya generó errores de rutas verificados en la auditoría (`cd apps/admin/src && npm install` cuando el código real vive en `apps/admin/src/frontend`).

## Alternativas Consideradas

### Alternativa A: Mantener `apps/api` separado (status quo)
- ✅ Sin esfuerzo de migración
- ❌ No resuelve ninguno de los problemas anteriores
- ❌ Contradice el mandato explícito del Product Owner

### Alternativa B: Mover `apps/api/src/backend` → `apps/website/src/backend` (RECOMENDADA)
- ✅ El website queda autocontenido: `frontend` + `backend` + `test` bajo un solo directorio
- ✅ Reduce de 4 a 3 las "aplicaciones" del monorepo (`website`, `admin`, `intranet` — congelada)
- ✅ Prepara el terreno para que `apps/website` se extraiga como repo único cuando se ejecute la migración a multi-repo
- ⚠️ Requiere mover el proyecto Laravel completo (composer.json, vendor, migraciones, tests PHPUnit) y actualizar:
  - `Framework.Automation.sln` (ruta del proyecto `Farutech.Api.Tests` — pasa a vivir bajo `apps/website/test/backend/` o se fusiona con `Farutech.Website.Tests`, ver TASK-014)
  - `infrastructure/gateway/haproxy.cfg` (el backend sigue expuesto como servicio propio a nivel de red/contenedor aunque el código viva bajo `website`)
  - `infrastructure/docker-compose.yml`
  - Todas las referencias de path en docs (`getting-started.md`, `README.md`, `testing-strategy.md`, `coding-standards.md`)
  - `.env.example` de admin (`VITE_API_BASE_URL` no cambia de valor, pero sí la ubicación del `.env` fuente)

### Alternativa C: Fusionar también `apps/admin` dentro de `apps/website`
- ❌ Rechazada. El admin sí debe seguir siendo un proyecto independiente (Vite app propia), porque:
  - Tiene su propio ciclo de release y su propio build
  - Va a ser el germen del futuro dashboard de `platform` (ADR-007) y conviene no atarlo al ciclo de vida del website público
  - El requisito de exponerlo bajo `/admin` se resuelve en la capa de gateway (ver ADR-006), no fusionando código

## Decisión

**ALTERNATIVA B** — Mover `apps/api/src/backend/*` a `apps/website/src/backend/`, eliminando `apps/api` como aplicación top-level.

### Estructura Resultante

```
apps/website/
├── src/
│   ├── frontend/          # React + Vite + TypeScript (sin cambios)
│   └── backend/           # Laravel 11 + PHP 8.2 (movido desde apps/api/src/backend)
│       ├── app/
│       ├── database/
│       ├── routes/
│       ├── tests/         # PHPUnit (unit/integration Laravel)
│       └── composer.json
└── test/                  # BDD .NET (Framework.Core consumer) — sin cambios de contenido,
                            # pero ahora también cubre escenarios de backend (antes en apps/api/test)
```

`apps/api` deja de existir como directorio top-level tras la migración.

## Justificación

1. **Coherencia de dominio:** un backend que solo existe para servir a un frontend no es una "aplicación" aparte, es una capa del mismo producto.
2. **Alineación con la visión de independencia por aplicación** confirmada por el Product Owner: cada `apps/<nombre>` debe poder clonarse, compilarse y desplegarse de forma autónoma.
3. **Preparación para ADR-007:** cuando `platform` nazca como aplicación nueva, no repetirá este error — nacerá directamente como `apps/platform/{src/frontend, src/backend, test}`.

## Consecuencias

### Positivas
- Un desarrollador que clona `apps/website` tiene el sistema completo (front + back + tests) sin dependencias externas al monorepo, salvo `packages/design-system`.
- Documentación más simple de mantener (un solo "Quick Start" para website).

### Negativas / Riesgos
- Migración con archivos grandes (`vendor/`, `node_modules/` deben excluirse del `mv` y regenerarse).
- Ventana de riesgo de romper imports/paths absolutos en scripts CI/CD y en `Framework.Automation.sln`.
- Debe coordinarse con TASK-015 (admin bajo `/admin`) porque ambas tocan `infrastructure/gateway/haproxy.cfg` — **ejecutar en el mismo ciclo para evitar dos rounds de cambios en el gateway**.

## Plan de Migración (resumen — detalle completo en TASK-014)

1. `git mv apps/api/src/backend apps/website/src/backend` (excluir `vendor/`, regenerar con `composer install`)
2. Actualizar `Framework.Automation.sln`: fusionar o reubicar `Farutech.Api.Tests`
3. Actualizar `infrastructure/gateway/haproxy.cfg`: el backend Laravel sigue siendo un servicio de contenedor independiente (`backend:80`), solo cambia dónde vive su código fuente — **no cambia el runtime**, cambia el repo
4. Actualizar `infrastructure/docker-compose.yml` (build context del servicio `backend`)
5. Eliminar `apps/api/`
6. Actualizar toda la documentación afectada (`README.md`, `overview.md`, `getting-started.md`, `testing-strategy.md`, `coding-standards.md`)
7. Actualizar `docs/00_INDEX.md` y `docs/04_TRACKING/master-plan.md`

## Referencias

- ADR-001 / ADR-006 — Admin Routing Strategy (impacta el mismo `haproxy.cfg`)
- ADR-007 — Platform Scope Separation
- TASK-014 — Ejecución de esta migración

---

**Estado:** ✅ DECIDIDO — Pendiente de Implementación
**Próxima Revisión:** al cerrar TASK-014
