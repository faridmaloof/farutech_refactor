# TASK-017 — Publicación de paquetes reutilizables

- **Status:** READY_FOR_LOCAL_EXECUTION
- **Scope:** Design System + Framework.Core
- **Depends on:** validación de build local
- **Architecture:** ADR-007

## Objetivo

Dejar ambos paquetes listos para publicación reproducible desde el monorepo, sin credenciales versionadas y sin exigir cambios estructurales posteriores.

## Implementado en esta rama

- Metadata real del repositorio en `@farutech/design-system`.
- Registry de GitHub Packages correctamente definido como `https://npm.pkg.github.com`.
- Metadata NuGet completa para `EnterpriseAutomation.Framework`.
- Workflow de Design System: `.github/workflows/publish-design-system.yml`.
- Workflow de Framework.Core: `.github/workflows/publish-framework-core.yml`.
- ADR-007 y guía operativa.

## Pendiente de ejecutar localmente

1. Revisar diff de esta rama.
2. Instalar dependencias del Design System y ejecutar build/tests.
3. Ejecutar `dotnet restore`, `dotnet build -c Release` y `dotnet pack -c Release` para Framework.Core.
4. Fusionar la rama a `main` mediante PR después de validación.
5. Incrementar versiones cuando corresponda.
6. Crear y publicar el tag del paquete.
7. Verificar en GitHub Packages que cada paquete aparezca con la visibilidad deseada.
8. Probar instalación desde un proyecto consumidor.

## No hacer

- No crear `apps/admin` como aplicación independiente por causa de esta tarea.
- No introducir un segundo Design System.
- No copiar Framework.Core a `tests`.
- No almacenar PAT, npm token o credenciales NuGet en Git.

## Criterio de finalización

La tarea queda DONE cuando los dos paquetes hayan sido publicados, su instalación haya sido validada y la documentación refleje las versiones reales.
