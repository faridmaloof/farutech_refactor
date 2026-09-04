# 23 — TASK-202: Publicación del Design System (CONFLICTING resuelto → npmjs.com)

**Fecha:** 2026-08-28 · **Estado:** DONE (preparado + validado; *publish efectivo requiere cuenta npm del owner*) · **Repo:** `Farutech/design-system` @ `8b491ff` (rama `task/202-publish-npmjs` conservada)

## ❗ CONFLICTING declarado (con evidencia oficial)

`docs/06 §4` y `REQ-DS-02` pedían: *"paquete público en GitHub Packages, sin exigir credenciales, aunque el repo sea privado"*.

**Evidencia oficial (documentación de GitHub, consultada 2026-08-28):**
> *"You need an access token to **publish, install, and delete** private, internal, **and public** packages."*
> — GitHub Docs, *Working with the npm registry* (sección "Authenticating to GitHub Packages").

Es decir: **en GitHub Packages ni un paquete público es instalable sin token**. La premisa del spec (público + sin credenciales) es **inalcanzable** en ese registro — público o privado el repo. Un paquete público sí puede desvincularse del repo (granular permissions), pero el *install* público sigue exigiendo auth.

**Decisión (la VALIDATION de docs/09 manda):**
> *"Instalar el paquete desde una máquina/proyecto sin ningún token configurado, confirmando acceso público real."*

El único registro mainstream que permite install anónimo de paquetes públicos es **npmjs.com**. Se mantiene el repo fuente `Farutech/design-system` **privado** y se publica a npmjs con `publishConfig.access = public` — cumple la intención (público, sin credenciales para consumidores) y el repo sigue privado.

> Nota: el tarball lo generé en una máquina que tenía un `~/.npmrc` global con un PAT clásico `ghp_…` que rutéaba `@farutech` a GitHub Packages y además **deja a credencial en texto plano en el home del usuario**. Recomendación: **rotar ese PAT y emitir un `NPM_TOKEN` de alcance mínimo** (`write:packages` no aplica a npmjs; en npmjs un token granular de `Automation` del user `farutech`).

## IMPLEMENT

1. `package.json`: `publishConfig` → `{ "access": "public" }`, se elimina el registry de GitHub Packages; añadido `repository`, `engines`, y **`prepublishOnly`** (`typecheck && test && build`) que fuerza que todo lo que se publique pase por verificación.
2. **Corregido bug real detectado:** el paquete declaraba `types`/`exports` hacia `dist/*.d.ts` pero el build no emitía declaraciones (Vite no las genera). Nuevo `tsconfig.build.json` + `tsc --emitDeclarationOnly` en `build`. Tarball final: 76 archivos con `.d.ts` + `.d.ts.map` por componente.
3. `.npmrc` de proyecto: `@farutech:registry=https://registry.npmjs.org/` (tiene precedencia sobre el `~/.npmrc` global que apuntaba a GitHub Packages).
4. `.github/workflows/publish.yml`: publica a npmjs con `NODE_AUTH_TOKEN = secrets.NPM_TOKEN` al pushear tag `v*` (repos privados sí corren Actions).
5. `README.md` reescrito para cara pública (instalación, tokens/temas, desarrollo, publicación).

## SECURITY (gate del plan maestro: sin esto no se publica)

Empaquetado real (`npm pack`) e inspección del contenido del tarball:
- **Lista de 76 archivos:** solo `dist/` + `package.json` + `README.md`. NO incluye `.github/CODEOWNERS`, `MIGRATION.md`, fuentes `.tsx`, `.env`, config interna.
- **Grep de secretos** sobre todo el contenido: **0** coincidencias de `ghp_`/`gho_`/`password`/`secret`/`Admin@`/`@123456`/`PRIVATE KEY`. Única coincidencia: la palabra `NPM_TOKEN` en README (referencia al secreto de CI, no un valor).
- **Grep de rutas internas** (`ft-repo`, `ft-validate`, `faridmaloof`, `d:\tmp`): **0** — los sourcemaps no filtran rutas de la máquina.
- **Resultado: NO HAY FILTRACIÓN de datos del repo privado.** → gate superado, paquete listo para publicar.

## RUN TESTS / EVIDENCE

- `npm publish --dry-run` → `Publishing to https://registry.npmjs.org/ with tag latest and public access (dry-run)` — corrió `prepublishOnly` (typecheck ✓, vitest 16/16 ✓, build ✓).
- **Consumo real sin credenciales** (validación del mecanismo): proyecto limpio `d:\tmp\ft-consumer`, `npm install react@18` (anónimo) + `npm install <tgz>` → `import('@farutech/design-system')` exporta 12 símbolos, subpath `.../components/Button` resuelve, `.d.ts` presentes. Todo sin ningún token.

## VALIDATION pendiente (única pieza que depende del owner)

El **publish efectivo** a npmjs requiere una cuenta/scope npm `farutech` (no puedo crearla por el owner). Pasos (una sola vez):
1. Crear usuario/org `farutech` en npmjs.com.
2. `npm login` (o generar **Automation token** y usarlo en `~/.npmrc` / secreto del workflow).
3. `cd design-system && npm publish` (o `git tag v0.1.0 && git push --tags`; CI publica).
4. Validación final del spec: `npm install @farutech/design-system` en máquina **sin ningún token** → debe instalar sin error.

## ROLLBACK
- Para el paquete: `npm unpublish @farutech/design-system@0.1.0 --force` (solo 72h desde publish).
- Config: `git revert 8b491ff`.

## Notas extra
- licencia actual `UNLICENSED` (todos los derechos reservados). Recomendación legal pendiente de owner: MIT para eliminar fricción de consumo público. Se dejó `UNLICENSED` (no decido por mí).
- Con este decisión, GitHub Packages queda disponible (opcional) como **mirror interno privado** para admin/intranet con su próprio token.

## próximos pasos
TASK-203 (pantallas auth) y TASK-204 (menú horizontal) continúan sobre el paquete ya preparado.