# 📝 Change Log — Tracking Maestro de Implementación

Este documento registra los cambios realizados al sistema de tracking del proyecto Farutech.

---

## [2026-09-08] — Corrección del contrato de build del Design System

**Tipo:** 🔴 BUILD / DESIGN SYSTEM / PACKAGES  
**Responsable:** Technical Lead

### Hallazgos

La ejecución manual demostró que la incidencia de publicación no era el único problema. La generación de declaraciones TypeScript fallaba antes de publicar el paquete.

Se identificaron dependencias de aplicación dentro del Design System, contratos de tipos inconsistentes entre navegación/módulos/locale y una divergencia entre los tipos React utilizados por el paquete y los consumidores React 18 del monorepo.

### Correcciones

- `ErrorBoundary` dejó de depender de `ServerErrorPage`, que pertenece a una aplicación consumidora.
- Se restauró el contrato público `PushNotificationItem`.
- Se normalizó el modelo `MenuEntry` / `MenuCategory` / `MenuItem`.
- `useMenu()` ahora acepta configuración opcional y devuelve entradas coherentes con el Sidebar.
- `moduleStore` y `ModuleSwitcher` comparten el contrato de módulo basado en `moduleId`.
- `localeStore` recuperó `DateFormat`, `TimeFormat`, `getLocaleConfig()` y el contrato de formateo usado por los controles de fecha.
- `Sidebar` fue desacoplado de propiedades de configuración inexistentes y de tipos de menú obsoletos.
- El Design System quedó preparado para compilar contra el baseline React 18 utilizado por las aplicaciones actuales.
- Se creó TASK-030 para controlar la regeneración del lockfile y la validación final.

### Validación pendiente

La sincronización de `packages/design-system/src/package-lock.json` debe ejecutarse localmente con `npm install --package-lock-only` y posteriormente deben pasar build, lint, tests y `npm pack --dry-run`.

---

## [2026-09-08] — Corrección de publicación y versionado de paquetes

**Tipo:** 🔧 CI/CD / PACKAGES / VERSIONING  
**Responsable:** Technical Lead

### Cambios

- Se corrigió la identidad npm del Design System para el propietario actual del repositorio: `@faridmaloof/design-system`.
- Se añadió validación de scope contra `github.repository_owner` para evitar publicaciones con una identidad incompatible.
- Se añadió validación de igualdad entre versión SemVer y tag de release.
- Design System ahora ejecuta build, lint, tests y validación del tarball antes de publicar.
- Framework.Core valida la versión contra `framework-core-vX.Y.Z` antes de publicar.
- Se actualizaron los workflows de publicación a `actions/checkout@v5`, `actions/setup-node@v5` y `actions/setup-dotnet@v5`.
- Se eliminó el uso de `__dirname` en la configuración de Vite y se adoptó `import.meta.dirname`.
- Se documentó la estrategia para migrar posteriormente los paquetes a repositorios independientes sin perder el versionado SemVer ni la trazabilidad.
- Se creó TASK-029 para controlar la validación final, sincronización del lockfile y evidencia de publicación.

### Incidencia observada

La publicación inicial de `@farutech/design-system@1.0.0` fue rechazada por GitHub Packages con HTTP 403 porque el scope `@farutech` no correspondía al propietario actual `faridmaloof`. La ejecución posterior también reveló errores reales de compilación del paquete, que son tratados por TASK-030.

---

## [2026-09-07] — Reconciliación de agentes, tareas y arquitectura

**Tipo:** 📝 DOCUMENTATION / PROCESS / ARCHITECTURE  
**Responsable:** Technical Lead

### Cambios

- Se incorporó el agente orquestador `Technical Lead` con comandos `/TL` y `/lider-Tecnico`.
- Se incorporaron agentes especializados de Developer y QA Validation.
- Se estableció el protocolo de delegación y triage de fallos.
- Se establecieron quality gates obligatorios: criterios de aceptación, build sin errores/warnings, static checks, tests, security y documentación.
- Se estableció que una tarea no puede marcarse `DONE` sin evidencia.
- Se estableció que un false positive de test pertenece a QA/Test Automation y un defecto real de producto pertenece a Developer.
- Se normalizó la numeración de ADR: ADR-007 queda reservado para Platform y distribución de paquetes pasa a ADR-009.
- Se normalizó la tarea de publicación de paquetes a TASK-026 para evitar colisión con TASK-017.
- TASK-017 de infraestructura queda `SUPERSEDED` donde contradice ADR-008; TASK-027 reemplaza su topología vigente.
- `IMPLEMENTATION_PROMPT.md` fue actualizado a una versión provider-neutral y alineada con ADR-008.
- `00_INDEX.md` y `master-plan.md` fueron reconciliados con la identidad real de tareas y ADRs.

### Regla vigente

La documentación histórica se conserva para trazabilidad, pero ningún documento `SUPERSEDED` o `ARCHIVED` constituye instrucción de implementación actual.

---
