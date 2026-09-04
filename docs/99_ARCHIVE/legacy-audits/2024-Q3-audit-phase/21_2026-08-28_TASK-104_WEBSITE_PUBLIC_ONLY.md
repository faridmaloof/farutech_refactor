# FARUTECH — TASK-104: Split de `apps/frontend` → `website` público sin admin embebido (REQ-FE-01)

**Fecha:** 2026-08-28 · **Repo:** `Farutech/website` · **Estado:** DONE
**Fuente:** `docs/09` TASK-104 · **Dependencias:** TASK-101 (DONE)

## 1. WHAT
`Farutech/website` queda **solo con el sitio público**: se removió del bundle todo el panel admin que el bootstrap (TASK-101) había copiado tal cual desde el monorepo:
- Páginas eliminadas: `AdminLoginPage`, `AdminDashboardPage`, `AdminLeadsPage`, `AdminSettingsPage`.
- Hook admin-only eliminado: `src/hooks/useAuth.tsx` (usado únicamente por las páginas admin, `RequireAuth` y `AuthProvider` en `main.tsx`).
- `App.tsx`: fuera imports, guard `RequireAuth` y las 5 rutas `/admin/*`. Cualquier `/admin/*` ahora cae al 404 público (`NotFoundPage`).
- `main.tsx`: fuera `AuthProvider`.

## 2. WHY
- REQ-FE-01 parte 1: el sitio público (front door de farutech.com) no debe contener el admin ni su lógica de auth — menor superficie de ataque y bundle más chico.
- docs/09: "las páginas admin quedan como referencia de extracción para TASK-107/301, no se copian tal cual" — la referencia vive en el monorepo original (`faridmaloof/website-farutech`, intacto como rollback), no en este repo.

## 3. WHERE — decisiones de frontera (verificadas con grep, no asumidas)
| Pieza | Decisión | Motivo |
|---|---|---|
| `Admin*Page.tsx` (4) | **Eliminadas** | Solo admin |
| `hooks/useAuth.tsx` | **Eliminado** | Solo lo consumen admin + guard |
| `lib/api.ts` (`API_BASE_URL`) | **Conservado** | Lo usan componentes públicos: `ContactForm`, `contactService`, `newsletterService` |
| `ContactForm`, `Newsletter`, `Logo`, `JsonLd` | **Intactos** (exigido por docs/09) | Son del sitio público |
| `public/robots.txt` (`Disallow: /admin/`) | **Conservado** | Defensivo aunque ya no exista la ruta |

## 4. CONFLICTING
Ninguno. El estado real coincidió con el TARGET STATE de docs/09 una vez aplicada la remoción. Observación **preexistente** (no introducida por esta tarea): el prerender emite warnings `No routes matched location "/servicios/*"` (mapeo de slugs ES/EN que se resuelve en runtime; los HTML de las 22 rutas sí se generan). Se reporta como mejora futura del prerender — no bloquea.

## 5. RISK
- **R-SPLIT-ORPHANS (cerrado):** riesgo de dejar imports/refs rotos o código huérfano. Mitigado con grep de residuales (`useAuth|Admin` en `src/` → 0 resultados) + `tsc --noEmit` + build.
- **R-ADMIN-REgress (controlado):** TASK-301 (admin) deberá recrear login/dashboard/leads/settings en `Farutech/admin` con design-system (TASK-203), no copiar estos archivos (ya no existen aquí; referencia en monorepo original).

## 6. TEST / VALIDATION (evidencia real)
- `npm install` → 78 packages.
- `npm run typecheck` (`tsc --noEmit`) → **sin errores**.
- `npm run build` (producción) → **✓ built in 12.52s**.
- `npm run build:seo` (SSR + prerender) → **22 rutas con HTML estático** en `dist/` (home, servicios EN/ES, casos, nosotros, ecosistema, legal). Cero páginas admin prerenderizadas.
- **Smoke anti-filtración:** 0 chunks con `Admin|useAuth|auth` en `dist/assets`; grep de `AdminLogin|AdminDashboard|admin/login` sobre todos los HTML+JS de `dist/` → **0 resultados**.
- **Smoke contenido:** `dist/index.html` (51 KB) contiene `FaruTech` y la lógica de contacto.

## 7. SECURITY REVIEW
- El bundle público ya no incluye: pantalla de login admin, llamadas a `/admin/*` de la API, ni manejo de token/sesión (`useAuth`). Menor superficie expuesta a farutech.com.
- Sin secretos nuevos; `lib/api.ts` solo resuelve la URL base de la API.

## 8. ROLLBACK
`git revert fd58e5f` en `Farutech/website` (o `git checkout 5c9b0ed -- src/`). El monorepo original `faridmaloof/website-farutech` sigue intacto como referencia completa del admin embebido.

## 9. EVIDENCE
- Commit: `task/104-website-public-only` @ `ec75742` (push verificado en origin).
- Merge a `main` @ `fd58e5f` (push verificado: `origin/main` → `fd58e5f`).
- Cambios: 7 archivos (4 páginas D, useAuth D, App.tsx M, main.tsx M).
