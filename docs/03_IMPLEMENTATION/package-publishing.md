# Publicación de paquetes reutilizables

## Objetivo

El monorepo debe poder publicar paquetes reutilizables hoy y permitir su migración posterior a repositorios independientes sin perder trazabilidad, SemVer ni un contrato de publicación claro.

## Activos

| Paquete | Tipo | Fuente actual | Registro actual | Tag | Identidad actual |
|---|---|---|---|---|---|
| `@faridmaloof/design-system` | npm | `packages/design-system/src` | GitHub Packages | `design-system-vX.Y.Z` | Scope GitHub del propietario actual |
| `EnterpriseAutomation.Framework` | NuGet | `packages/framework-automation/src/Framework.Core` | GitHub Packages | `framework-core-vX.Y.Z` | PackageId independiente |

### Por qué el Design System usa `@faridmaloof`

GitHub Packages exige que el scope npm corresponda al propietario de GitHub que publica el paquete. El repositorio actual pertenece a `faridmaloof`, por lo que `@farutech/design-system` produce `403 Permission denied` al intentar publicar desde este repositorio.

El nombre actual `@faridmaloof/design-system` es deliberado y no representa una decisión definitiva sobre la marca pública. Cuando el paquete se traslade a un repositorio propiedad de la organización correspondiente, se deberá evaluar el cambio a un scope organizacional, por ejemplo `@farutech/design-system`, como una migración de identidad del paquete.

## Versionado

Se utiliza Semantic Versioning (`MAJOR.MINOR.PATCH`). La versión declarada en el artefacto es la fuente de verdad del paquete y el tag de release debe coincidir exactamente con ella:

- Design System: `package.json.version` ↔ `design-system-vX.Y.Z`.
- Framework.Core: `<Version>` ↔ `framework-core-vX.Y.Z`.

Los workflows rechazan un tag cuya versión no coincida con la versión declarada en el paquete. Los `workflow_dispatch` permiten validación/publicación manual de la versión actualmente declarada.

No se debe reutilizar una versión ya publicada para introducir cambios. Un cambio incompatible requiere incremento de `MAJOR`; funcionalidad compatible, `MINOR`; corrección compatible, `PATCH`.

## Publicación desde GitHub Actions

Los workflows están en `.github/workflows/` y no requieren credenciales personales almacenadas en el repositorio.

### Design System

1. Incrementar la versión en `packages/design-system/src/package.json`.
2. Sincronizar el lockfile localmente (`npm install --package-lock-only`) y verificar que `npm ci` funcione.
3. Ejecutar localmente `npm run build`, `npm run lint` y `npm test -- --run` desde esa carpeta.
4. Crear el tag `design-system-vX.Y.Z` y publicarlo.
5. GitHub Actions valida scope y versión, instala, construye, prueba, valida el tarball y publica usando `GITHUB_TOKEN`.

### Framework.Core

1. Incrementar `<Version>` en `packages/framework-automation/src/Framework.Core/Framework.Core.csproj`.
2. Ejecutar `dotnet restore`, `dotnet build -c Release` y `dotnet pack -c Release`.
3. Crear el tag `framework-core-vX.Y.Z` y publicarlo.
4. GitHub Actions valida la versión, restaura, compila, empaqueta y publica usando `GITHUB_TOKEN`.

## Publicación manual

El propietario puede ejecutar el proceso localmente con las credenciales que correspondan a su cuenta/organización. No se deben commitear credenciales.

La publicación manual debe conservar exactamente la misma identidad y versión que el pipeline. No se debe cambiar el nombre del paquete solamente para sortear un error de permisos.

## Migración futura a repositorios independientes

La separación futura de:

- `farutech-design-system`
- `framework-automation` / repositorio equivalente

no requiere cambiar el modelo de versionado.

En la migración se debe:

1. conservar el historial y la versión SemVer publicada;
2. mover el código y su pipeline al repositorio independiente;
3. actualizar `repository`, `homepage` y documentación del paquete;
4. mantener el `PackageId` NuGet cuando no exista una razón de compatibilidad para cambiarlo;
5. decidir explícitamente si el scope npm cambia de `@faridmaloof` al scope organizacional;
6. tratar un cambio de nombre/scope npm como una migración de identidad y documentar compatibilidad/consumidores;
7. evitar publicar dos paquetes con la misma identidad y versión desde dos pipelines simultáneamente;
8. actualizar consumidores para apuntar al nuevo registro/repositorio cuando corresponda.

## GitHub Packages y consumo anónimo

**Importante:** configurar un paquete como público en GitHub Packages no debe interpretarse como garantía de instalación anónima. Los consumidores de npm/NuGet pueden seguir necesitando autenticación según las políticas del registro.

Si el requisito es que cualquier proyecto pueda instalar los paquetes sin token:

- npm: publicar también el Design System en npmjs con una identidad pública estable;
- NuGet: publicar también `EnterpriseAutomation.Framework` en nuget.org.

En ambos casos el código fuente puede continuar en este monorepo o migrarse posteriormente; los releases deben mantener una política SemVer única y trazable.

## Criterios de aceptación

- El paquete se genera desde la ruta real del monorepo.
- El artefacto contiene únicamente los archivos necesarios.
- Build/restore, lint y pruebas aplicables pasan antes de publicar.
- No existen secretos en archivos versionados.
- La versión publicada coincide con el tag cuando el release se origina en un tag.
- El scope npm coincide con el propietario GitHub actual.
- El README/documentación del paquete identifica el repositorio fuente real.
- Una futura migración a repositorio independiente no requiere romper SemVer por razones puramente de infraestructura.
