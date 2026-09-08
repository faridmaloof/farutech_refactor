# ADR-009 — Estrategia de distribución de paquetes reutilizables

**Fecha:** 2026-09-07  
**Estado:** ACEPTADO  
**Responsable:** Technical Lead / Product Owner  
**Ámbito:** Design System + Framework.Core

## Contexto

El monorepo contiene dos activos reutilizables de primera clase:

- `packages/design-system/src` → `@farutech/design-system` (npm/React/TypeScript).
- `packages/framework-automation/src/Framework.Core` → `EnterpriseAutomation.Framework` (.NET).

Ambos permanecen en el monorepo como fuente de verdad y deben poder distribuirse como paquetes versionados sin copiar código entre proyectos.

## Decisión

1. Mantener ambos paquetes dentro del monorepo.
2. Publicar inicialmente en GitHub Packages.
3. Versionar cada paquete independientemente mediante SemVer.
4. Usar tags independientes:
   - `design-system-vX.Y.Z`
   - `framework-core-vX.Y.Z`
5. Usar `GITHUB_TOKEN` únicamente dentro de CI con los permisos mínimos necesarios.
6. No almacenar PAT, npm tokens, NuGet credentials ni archivos de configuración con secretos.
7. La visibilidad pública del repositorio no implica por sí sola instalación anónima desde GitHub Packages.
8. Si el requisito futuro es consumo sin autenticación por terceros, evaluar distribución complementaria en npmjs y nuget.org.

## Validación y Definition of Done

Antes de publicar: restore/install, build, tests aplicables, análisis de seguridad y generación/validación del artefacto. La publicación no sustituye la validación del contenido.

Un release se considera válido cuando el paquete es reproducible, tiene metadata correcta, versión no publicada previamente, artefacto íntegro y consumo validado.

## Referencias

- TASK-026 — Publicación de paquetes reutilizables.
- `docs/03_IMPLEMENTATION/package-publishing.md`.
- `packages/design-system/src/package.json`.
- `packages/framework-automation/src/Framework.Core/Framework.Core.csproj`.

## Seguridad

Nunca añadir credenciales al repositorio. La autenticación local debe permanecer en el entorno del desarrollador y la autenticación CI en secretos/tokens administrados por la plataforma.
