# 📝 Change Log — Tracking Maestro de Implementación

Este documento registra los cambios realizados al sistema de tracking del proyecto Farutech.

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
- Se actualizaron los workflows de publicación a `actions/checkout@v5`, `actions/setup-node@v5` y `actions/setup-dotnet@v5` para evitar depender de runtimes de acción basados en Node 20.
- Se eliminó el uso de `__dirname` en la configuración de Vite y se adoptó `import.meta.dirname`.
- Se documentó la estrategia para migrar posteriormente los paquetes a repositorios independientes sin perder el versionado SemVer ni la trazabilidad.
- Se creó TASK-029 para controlar la validación final, sincronización del lockfile y evidencia de publicación.

### Incidencia corregida

La publicación inicial de `@farutech/design-system@1.0.0` fue rechazada por GitHub Packages con HTTP 403 porque el scope `@farutech` no correspondía al propietario actual `faridmaloof`. El error está registrado como evidencia de la ejecución manual y no se considera un fallo de compilación del paquete.

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
