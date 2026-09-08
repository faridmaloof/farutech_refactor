# Publicación de paquetes reutilizables

## Activos

| Paquete | Tipo | Fuente | Registro inicial | Tag |
|---|---|---|---|---|
| `@farutech/design-system` | npm | `packages/design-system/src` | GitHub Packages | `design-system-vX.Y.Z` |
| `EnterpriseAutomation.Framework` | NuGet | `packages/framework-automation/src/Framework.Core` | GitHub Packages | `framework-core-vX.Y.Z` |

## Publicación desde GitHub Actions

Los workflows están en `.github/workflows/` y no requieren credenciales personales almacenadas en el repositorio.

### Design System

1. Incrementar la versión en `packages/design-system/src/package.json`.
2. Ejecutar localmente `npm ci` y `npm run build` desde esa carpeta.
3. Crear el tag `design-system-vX.Y.Z` y publicarlo.
4. GitHub Actions instala, construye, valida el tarball y publica usando `GITHUB_TOKEN`.

### Framework.Core

1. Incrementar `<Version>` en `packages/framework-automation/src/Framework.Core/Framework.Core.csproj`.
2. Ejecutar `dotnet restore`, `dotnet build -c Release` y `dotnet pack -c Release`.
3. Crear el tag `framework-core-vX.Y.Z` y publicarlo.
4. GitHub Actions restaura, compila, empaqueta y publica usando `GITHUB_TOKEN`.

## Publicación manual

El propietario puede ejecutar el proceso localmente con las credenciales que correspondan a su cuenta/organización. No se deben commitear credenciales.

## GitHub Packages y consumo anónimo

**Importante:** configurar un paquete como público en GitHub Packages no debe interpretarse como garantía de instalación anónima. Los consumidores de npm/NuGet pueden seguir necesitando autenticación según las políticas del registro.

Si el requisito es que cualquier proyecto pueda instalar los paquetes sin token:

- npm: publicar también `@farutech/design-system` en npmjs.
- NuGet: publicar también `EnterpriseAutomation.Framework` en nuget.org.

En ambos casos el código fuente continúa en este monorepo y los releases deben mantener la misma versión SemVer.

## Criterios de aceptación

- El paquete se genera desde la ruta real del monorepo.
- El artefacto contiene únicamente los archivos necesarios.
- Build/restore pasan antes de publicar.
- No existen secretos en archivos versionados.
- La versión publicada coincide con el tag.
- El README/documentación del paquete identifica el repositorio fuente real.
