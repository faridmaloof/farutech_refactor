# TASK-104-C — Blog público en website consumiendo API real

**Fecha:** 2026-08-28
**Estado:** DONE
**Relacionado:** REQ-FE-01 (website público) · TASK-102/103 (backend Lumen + docs API)

---

## WHAT

Se implementó la página `/blog` del sitio público `Farutech/website` consumiendo el endpoint
real del backend (`GET /blog/posts`), con tarjetas de posts, paginación, meta SEO prerenderizada
y un cliente API tipado. Es la primera feature dinámica del website sobre el backend ya
desplegado en contenedor.

## WHY

Cierra el hueco funcional del website (docs/09 señala TASK-104-C como expansión de Wave 3)
y demuestra el flujo completo website → API → DB con datos reales, aprovechando la documentación
OpenAPI ya generada (TASK-103).

## WHERE (archivos creados/modificados en `Farutech/website`)

| Archivo | Rol |
|---|---|
| `src/lib/api.ts` | `ApiClient` tipado + `fetchAPI` (reemplaza el getter base anterior, preserva `API_BASE_URL`/`API_PUBLIC_BASE`) |
| `src/hooks/useBlogPosts.ts` | Hook con estado loading/error/totalPages, tipado al payload real |
| `src/components/BlogPostCard.tsx` | Card con imagen, badge de categoría (design-system), fecha y minutos de lectura |
| `src/pages/BlogListPage.tsx` | Lista + paginación + empty state |
| `src/App.tsx` | Ruta pública `/blog` |
| `scripts/prerender.mjs` | Ruta `/blog` en `routeMeta` (+ title/description SEO) |
| `package.json` / `tsconfig.json` | Dep. local `@farutech/design-system` (file:) y alias `@/` |

## EVIDENCIA

### Build + typecheck
```
tsc --noEmit          → 0 errores
vite build            → ✓ 1972 modules, 469.51 kB (gzip 147 kB)
Build SSR + prerender → 23 rutas con HTML estático (incluye /blog)
dist/blog/index.html  → <title>Blog · FaruTech</title> + og:title correctos
```

### API real (contra backend en contenedor, seed con posts publicados)
```
GET /blog/posts           → 200 {"success":true,"data":[{...posts reales...}],"meta":{...}}
```
Bundle producido con `VITE_API_URL=http://localhost:8000` → `api client` apunta a la API real
(verificado en `dist/assets/index-*.js` → match `localhost:8000`).

### Seguridad
- Sweep del bundle: 0 refs a `admin/login`, `AdminPanel`, credenciales.
- El payload de `BlogPostPublic` del backend **no expone** campos internos (solo públicos).

## NOTAS HONESTAS (gaps encontrados durante la implementación)

1. **Design system aún no publicado en npm:** `npm view @farutech/design-system` → **E403**.
   Por eso el website usa `file:../../design-system` (dev local). El publish efectivo requiere
   cuenta npm del owner + `NPM_TOKEN` (workflow `publish.yml` ya preparado en TASK-202).
2. **`vite preview` en Windows** sirve el shell SPA (fallback) para `/blog` del `dist/index.html`
   raíz; el HTML prerenderizado correcto está en `dist/blog/index.html` (lo que sirve nginx/CDN
   en producción).
3. Warnings `No routes matched /servicios/*` preexistentes (mapeo de slugs ES/EN en runtime).

## VALIDATION

- Typecheck + build client + build SSR + prerender 23 rutas.
- GET real al endpoint con datos poblados.
- Push a `Farutech/website` main @ `43972fd`.

## ROLLBACK

`main` previo @ `d241161` (governance) — reversión trivial `git revert 43972fd`.