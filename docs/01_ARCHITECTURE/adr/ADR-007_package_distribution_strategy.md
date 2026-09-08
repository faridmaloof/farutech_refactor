# ADR-007 — Estrategia de distribución de paquetes reutilizables

- **Status:** Accepted
- **Date:** 2026-09-07
- **Scope:** Design System + Framework.Core

## Contexto

El monorepo contiene dos activos reutilizables de primera clase:

- `packages/design-system/src` → `@farutech/design-system` (npm/React/TypeScript).
- `packages/framework-automation/src/Framework.Core` → `EnterpriseAutomation.Framework` (.NET).

Ambos deben permanecer en este monorepo como fuente de verdad y poder publicarse desde aquí. El consumidor debe poder instalar una versión publicada sin copiar código del monorepo.

## Decisión

1. Mantener ambos paquetes dentro del monorepo.
2. Publicar inicialmente en **GitHub Packages** bajo la cuenta/organización propietaria del repositorio.
3. Los workflows quedan preparados para publicación mediante tags:
   - `design-system-vX.Y.Z`
   - `framework-core-vX.Y.Z`
4. La autenticación de CI utiliza `GITHUB_TOKEN`; no se almacenan tokens personales en el repositorio.
5. La visibilidad `public` del paquete se configura en el registro/organización de GitHub después de la primera publicación. El repositorio público no implica por sí mismo que un paquete de GitHub Packages sea instalable anónimamente.
6. Si el requisito posterior es consumo **sin token por parte de consumidores**, se añadirá una distribución complementaria en npmjs (`@farutech/design-system`) y nuget.org (`EnterpriseAutomation.Framework`). Esto no sustituye la fuente de verdad del monorepo.

## Design System

`@farutech/design-system` utiliza el registro `https://npm.pkg.github.com` y referencia el repositorio real `faridmaloof/farutech_refactor` con `directory=packages/design-system/src`.

## Framework.Core

`EnterpriseAutomation.Framework` incorpora metadata NuGet de repositorio, tags, licencia y URL del proyecto. El workflow genera y publica el `.nupkg` desde `packages/framework-automation/src/Framework.Core`.

## Versionado

No se deben reutilizar versiones publicadas. Cada release debe incrementar `Major.Minor.Patch` según SemVer y crear el tag correspondiente.

## Validación previa

Antes de publicar se ejecutan restore/install, build y validación del artefacto. El workflow de Design System ejecuta `npm pack --dry-run`; Framework.Core ejecuta `dotnet pack` y comprueba la generación del paquete.

## Consecuencia

La publicación queda reproducible desde GitHub Actions y también puede ejecutarse localmente con las credenciales apropiadas. No se requiere modificar la estructura del monorepo para que el propietario del repositorio ejecute el release.

## Nota de seguridad

Nunca se deben añadir PAT, passwords, `.npmrc` con tokens, `NuGet.Config` con credenciales ni secretos en Git. Para CI se utiliza `GITHUB_TOKEN`; para publicación manual local se recomienda autenticación efímera/segura del entorno del desarrollador.
